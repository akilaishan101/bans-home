import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import localforage from 'localforage'
import { createInitialData } from '../data/demo'
import { scheduleExpiryNotifications } from '../services/notifications'
import { getExpiryLevel } from '../utils/expiry'
import type { AppData, InventoryItem, NewInventoryItem, ShoppingList } from '../types'

const STORAGE_KEY = 'bans-home-data-v1'

interface AppContextValue extends AppData {
  ready: boolean
  setDeviceName: (name: string) => void
  setLanguage: (language: 'en' | 'si') => void
  addInventoryItem: (item: NewInventoryItem) => void
  updateItemStatus: (id: string, status: InventoryItem['status']) => void
  createShoppingList: (name: string) => void
  addShoppingItem: (listId: string, name: string, source?: 'manual' | 'low-stock' | 'recommendation', estimatedPrice?: number) => void
  toggleShoppingItem: (listId: string, itemId: string) => void
  setNotificationsEnabled: (enabled: boolean) => void
  recommendations: InventoryItem[]
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => createInitialData())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    const storageTimeout = new Promise<null>((resolve) => {
      window.setTimeout(() => resolve(null), 1500)
    })

    void Promise.race([localforage.getItem<AppData>(STORAGE_KEY), storageTimeout])
      .then((stored) => {
        if (active && stored) {
          const inventory = stored.inventory.map((saved) => {
            const { store: _oldStore, ...item } = saved as InventoryItem & { store?: string }
            return item
          })
          const shoppingLists = stored.shoppingLists.map((saved) => {
            const { store: _oldStore, ...list } = saved as ShoppingList & { store?: string }
            return list
          })
          setData({ ...stored, inventory, shoppingLists })
        }
      })
      .catch((error: unknown) => {
        console.warn('BANS Home could not restore local data; starting with the safe default.', error)
      })
      .finally(() => {
        if (active) setReady(true)
      })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (ready) void localforage.setItem(STORAGE_KEY, data)
  }, [data, ready])

  useEffect(() => {
    if (!ready || !data.settings.notificationsEnabled) return
    void scheduleExpiryNotifications(data.inventory).catch((error: unknown) => {
      console.warn('BANS Home could not refresh expiry notifications.', error)
    })
  }, [data.inventory, data.settings.notificationsEnabled, ready])

  const stamp = useCallback(() => ({
    deviceId: data.settings.deviceId,
    deviceName: data.settings.deviceName || 'Unnamed device',
    at: new Date().toISOString(),
  }), [data.settings.deviceId, data.settings.deviceName])

  const log = useCallback((action: string, detail: string) => ({
    id: crypto.randomUUID(), action, detail, stamp: stamp(),
  }), [stamp])

  const setDeviceName = (deviceName: string) => setData((current) => ({
    ...current,
    settings: { ...current.settings, deviceName },
    auditLog: [log('Registered device', deviceName), ...current.auditLog].slice(0, 100),
  }))

  const setLanguage = (language: 'en' | 'si') => setData((current) => ({
    ...current, settings: { ...current.settings, language },
  }))

  const addInventoryItem = (input: NewInventoryItem) => setData((current) => {
    const now = stamp()
    const item: InventoryItem = { ...input, id: crypto.randomUUID(), status: 'available', created: now, updated: now }
    return {
      ...current,
      inventory: [item, ...current.inventory],
      auditLog: [log('Added item', `${item.name} · ${item.quantity} ${item.unit}`), ...current.auditLog].slice(0, 100),
    }
  })

  const updateItemStatus = (id: string, status: InventoryItem['status']) => setData((current) => {
    const item = current.inventory.find((candidate) => candidate.id === id)
    if (!item) return current
    return {
      ...current,
      inventory: current.inventory.map((candidate) => candidate.id === id ? { ...candidate, status, updated: stamp() } : candidate),
      auditLog: [log(status === 'wasted' ? 'Marked wasted' : 'Marked used', item.name), ...current.auditLog].slice(0, 100),
    }
  })

  const createShoppingList = (name: string) => setData((current) => {
    const now = stamp()
    const list: ShoppingList = { id: crypto.randomUUID(), name, items: [], created: now, updated: now }
    return { ...current, shoppingLists: [...current.shoppingLists, list], auditLog: [log('Created list', name), ...current.auditLog] }
  })

  const addShoppingItem = (listId: string, name: string, source: 'manual' | 'low-stock' | 'recommendation' = 'manual', estimatedPrice?: number) => setData((current) => ({
    ...current,
    shoppingLists: current.shoppingLists.map((list) => list.id === listId ? {
      ...list,
      updated: stamp(),
      items: [...list.items, { id: crypto.randomUUID(), name, quantity: 1, unit: 'item', checked: false, estimatedPrice, source, addedBy: stamp() }],
    } : list),
    auditLog: [log('Added to shopping list', name), ...current.auditLog].slice(0, 100),
  }))

  const toggleShoppingItem = (listId: string, itemId: string) => setData((current) => ({
    ...current,
    shoppingLists: current.shoppingLists.map((list) => list.id === listId ? {
      ...list,
      updated: stamp(),
      items: list.items.map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item),
    } : list),
  }))

  const setNotificationsEnabled = (notificationsEnabled: boolean) => setData((current) => ({
    ...current, settings: { ...current.settings, notificationsEnabled },
  }))

  const recommendations = useMemo(() => data.inventory.filter((item) =>
    item.status === 'available' && (item.quantity <= item.minimumQuantity || getExpiryLevel(item) === 'expired')
  ), [data.inventory])

  return <AppContext.Provider value={{
    ...data, ready, setDeviceName, setLanguage, addInventoryItem, updateItemStatus,
    createShoppingList, addShoppingItem, toggleShoppingItem, setNotificationsEnabled, recommendations,
  }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
