import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  initializeFirestore,
  limit,
  onSnapshot,
  orderBy,
  persistentLocalCache,
  persistentMultipleTabManager,
  query,
  setDoc,
  writeBatch,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore'
import type { AppData, AuditEntry, InventoryItem, ShoppingItem, ShoppingList } from '../types'
import {
  LEGACY_DEMO_AUDIT_IDS,
  LEGACY_DEMO_INVENTORY_IDS,
  LEGACY_DEMO_LIST_IDS,
  LEGACY_DEMO_SHOPPING_ITEM_IDS,
} from '../data/demo'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const FAMILY_EMAIL = import.meta.env.VITE_FIREBASE_FAMILY_EMAIL || 'family@bans-home.app'
const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId)

let app: FirebaseApp | null = null
let auth: Auth | null = null
let database: Firestore | null = null

export interface CloudSnapshotHandlers {
  inventory: (items: InventoryItem[]) => void
  shoppingLists: (lists: ShoppingList[]) => void
  auditLog: (entries: AuditEntry[]) => void
  error: (message: string) => void
}

export const cloudConfigured = configured

function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

const docAt = (database: Firestore, path: string[]) => doc(database, path.join('/'))
const collectionAt = (database: Firestore, path: string[]) => collection(database, path.join('/'))

function services() {
  if (!configured) throw new Error('Family sync has not been configured yet.')
  if (!app) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    database = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    })
    void setPersistence(auth, browserLocalPersistence)
  }
  return { auth: auth!, database: database! }
}

function friendlyError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  if (code.includes('wrong-password') || code.includes('invalid-credential') || code.includes('email-already-in-use')) {
    return 'That family code is incorrect.'
  }
  if (code.includes('weak-password')) return 'Use a family code with at least 8 characters.'
  if (code.includes('network-request-failed')) return 'No internet connection. Your local data is still safe.'
  return error instanceof Error ? error.message : 'Family sync could not connect.'
}

async function writeInChunks(database: Firestore, writes: Array<{ path: string[]; value: unknown }>) {
  for (let start = 0; start < writes.length; start += 400) {
    const batch = writeBatch(database)
    for (const write of writes.slice(start, start + 400)) {
      batch.set(docAt(database, write.path), clean(write.value))
    }
    await batch.commit()
  }
}

async function seedHousehold(user: User, data: AppData) {
  const { database } = services()
  const root = ['households', user.uid]
  const marker = docAt(database, [...root, 'meta', 'app'])
  if ((await getDoc(marker)).exists()) return

  const writes: Array<{ path: string[]; value: unknown }> = []
  data.inventory.forEach((item) => writes.push({ path: [...root, 'inventory', item.id], value: item }))
  data.shoppingLists.forEach((list) => {
    const { items, ...listWithoutItems } = list
    writes.push({ path: [...root, 'shoppingLists', list.id], value: listWithoutItems })
    items.forEach((item) => writes.push({ path: [...root, 'shoppingItems', item.id], value: { ...item, listId: list.id } }))
  })
  data.auditLog.forEach((entry) => writes.push({ path: [...root, 'audit', entry.id], value: entry }))
  await writeInChunks(database, writes)
  await setDoc(marker, { schemaVersion: 1, initializedAt: new Date().toISOString() })
}

export function observeCloudSession(handler: (user: User | null) => void) {
  if (!configured) {
    handler(null)
    return () => undefined
  }
  const { auth } = services()
  return onAuthStateChanged(auth, handler)
}

export async function connectFamily(code: string, localData: AppData) {
  if (code.trim().length < 8) throw new Error('Use a family code with at least 8 characters.')
  const { auth } = services()
  try {
    let user: User
    try {
      user = (await signInWithEmailAndPassword(auth, FAMILY_EMAIL, code)).user
    } catch (signInError) {
      const errorCode = typeof signInError === 'object' && signInError && 'code' in signInError ? String(signInError.code) : ''
      if (!errorCode.includes('invalid-credential') && !errorCode.includes('user-not-found')) throw signInError
      user = (await createUserWithEmailAndPassword(auth, FAMILY_EMAIL, code)).user
    }
    await seedHousehold(user, localData)
    return user
  } catch (error) {
    throw new Error(friendlyError(error))
  }
}

export async function disconnectFamily() {
  if (!configured) return
  await signOut(services().auth)
}

export async function deleteLegacyDemoCloudData(user: User) {
  const { database } = services()
  const root = ['households', user.uid]
  const batch = writeBatch(database)
  LEGACY_DEMO_INVENTORY_IDS.forEach((id) => batch.delete(docAt(database, [...root, 'inventory', id])))
  LEGACY_DEMO_LIST_IDS.forEach((id) => batch.delete(docAt(database, [...root, 'shoppingLists', id])))
  LEGACY_DEMO_SHOPPING_ITEM_IDS.forEach((id) => batch.delete(docAt(database, [...root, 'shoppingItems', id])))
  LEGACY_DEMO_AUDIT_IDS.forEach((id) => batch.delete(docAt(database, [...root, 'audit', id])))
  await batch.commit()
}

export function subscribeToHousehold(user: User, handlers: CloudSnapshotHandlers) {
  const { database } = services()
  const root = ['households', user.uid]
  const unsubscribers: Unsubscribe[] = []
  let dataUnsubscribers: Unsubscribe[] = []

  const report = (error: unknown) => handlers.error(friendlyError(error))
  unsubscribers.push(onSnapshot(docAt(database, [...root, 'meta', 'app']), (marker) => {
    if (!marker.exists() || dataUnsubscribers.length) return

    let lists: Omit<ShoppingList, 'items'>[] = []
    let items: Array<ShoppingItem & { listId: string }> = []
    let listsReady = false
    let itemsReady = false
    const emitLists = () => {
      if (!listsReady || !itemsReady) return
      handlers.shoppingLists(lists.map((list) => ({
        ...list,
        items: items.filter((item) => item.listId === list.id).map(({ listId: _listId, ...item }) => item),
      })))
    }

    dataUnsubscribers = [
      onSnapshot(collectionAt(database, [...root, 'inventory']), (snapshot) => {
        handlers.inventory(snapshot.docs.map((saved) => saved.data() as InventoryItem))
      }, report),
      onSnapshot(collectionAt(database, [...root, 'shoppingLists']), (snapshot) => {
        lists = snapshot.docs.map((saved) => saved.data() as Omit<ShoppingList, 'items'>)
        listsReady = true
        emitLists()
      }, report),
      onSnapshot(collectionAt(database, [...root, 'shoppingItems']), (snapshot) => {
        items = snapshot.docs.map((saved) => saved.data() as ShoppingItem & { listId: string })
        itemsReady = true
        emitLists()
      }, report),
      onSnapshot(query(collectionAt(database, [...root, 'audit']), orderBy('stamp.at', 'desc'), limit(100)), (snapshot) => {
        handlers.auditLog(snapshot.docs.map((saved) => saved.data() as AuditEntry))
      }, report),
    ]
  }, report))

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe())
    dataUnsubscribers.forEach((unsubscribe) => unsubscribe())
  }
}

function currentRoot() {
  if (!configured) return null
  const { auth, database } = services()
  return auth.currentUser ? { database, root: ['households', auth.currentUser.uid] } : null
}

export async function saveInventoryItem(item: InventoryItem, audit?: AuditEntry) {
  const cloud = currentRoot()
  if (!cloud) return
  const batch = writeBatch(cloud.database)
  batch.set(docAt(cloud.database, [...cloud.root, 'inventory', item.id]), clean(item))
  if (audit) batch.set(docAt(cloud.database, [...cloud.root, 'audit', audit.id]), clean(audit))
  await batch.commit()
}

export async function saveShoppingList(list: ShoppingList, audit?: AuditEntry) {
  const cloud = currentRoot()
  if (!cloud) return
  const { items: _items, ...listWithoutItems } = list
  const batch = writeBatch(cloud.database)
  batch.set(docAt(cloud.database, [...cloud.root, 'shoppingLists', list.id]), clean(listWithoutItems))
  if (audit) batch.set(docAt(cloud.database, [...cloud.root, 'audit', audit.id]), clean(audit))
  await batch.commit()
}

export async function saveShoppingItem(listId: string, item: ShoppingItem, list: ShoppingList, audit?: AuditEntry) {
  const cloud = currentRoot()
  if (!cloud) return
  const { items: _items, ...listWithoutItems } = list
  const batch = writeBatch(cloud.database)
  batch.set(docAt(cloud.database, [...cloud.root, 'shoppingLists', list.id]), clean(listWithoutItems))
  batch.set(docAt(cloud.database, [...cloud.root, 'shoppingItems', item.id]), clean({ ...item, listId }))
  if (audit) batch.set(docAt(cloud.database, [...cloud.root, 'audit', audit.id]), clean(audit))
  await batch.commit()
}
