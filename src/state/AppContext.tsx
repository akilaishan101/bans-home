import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import localforage from 'localforage'
import { createInitialData, removeLegacyDemoData } from '../data/demo'
import {
  cloudConfigured,
  connectFamily as connectCloudFamily,
  disconnectFamily as disconnectCloudFamily,
  deleteLegacyDemoCloudData,
  observeCloudSession,
  saveInventoryItem,
  saveShoppingItem,
  saveShoppingList,
  subscribeToHousehold,
} from '../services/cloudSync'
import { scheduleExpiryNotifications } from '../services/notifications'
import { getExpiryLevel } from '../utils/expiry'
import { getFrequentInventoryItems } from '../utils/frequency'
import type { AppData, FrequentInventoryItem, InventoryItem, NewInventoryItem, ShoppingList } from '../types'

const STORAGE_KEY = 'bans-home-data-v1'

interface AppContextValue extends AppData {
  ready: boolean
  cloud: { configured: boolean; connected: boolean; syncing: boolean; error: string }
  connectFamily: (code: string) => Promise<void>
  disconnectFamily: () => Promise<void>
  setDeviceName: (name: string) => void
  setLanguage: (language: 'en' | 'si') => void
  addInventoryItem: (item: NewInventoryItem) => void
  updateItemStatus: (id: string, status: InventoryItem['status']) => void
  createShoppingList: (name: string) => void
  addShoppingItem: (listId: string, name: string, source?: 'manual' | 'low-stock' | 'recommendation', estimatedPrice?: number) => void
  toggleShoppingItem: (listId: string, itemId: string) => void
  setNotificationsEnabled: (enabled: boolean) => void
  recommendations: InventoryItem[]
  frequentItems: FrequentInventoryItem[]
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => createInitialData())
  const [ready, setReady] = useState(false)
  const [cloud, setCloud] = useState({ configured: cloudConfigured, connected: false, syncing: false, error: '' })

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
          setData(removeLegacyDemoData({ ...stored, inventory, shoppingLists }))
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
    if (!ready || !cloudConfigured) return
    let stopHousehold: (() => void) | undefined
    let sessionVersion = 0
    const stopSession = observeCloudSession((user) => {
      const version = ++sessionVersion
      stopHousehold?.()
      stopHousehold = undefined
      if (!user) {
        setCloud((current) => ({ ...current, connected: false, syncing: false }))
        return
      }
      setCloud((current) => ({ ...current, connected: true, syncing: true, error: '' }))
      void deleteLegacyDemoCloudData(user)
        .catch((error: unknown) => {
          setCloud((current) => ({ ...current, error: error instanceof Error ? error.message : 'Could not clean old sample data.' }))
        })
        .finally(() => {
          if (version !== sessionVersion) return
          stopHousehold = subscribeToHousehold(user, {
            inventory: (inventory) => setData((current) => removeLegacyDemoData({ ...current, inventory })),
            shoppingLists: (shoppingLists) => setData((current) => removeLegacyDemoData({ ...current, shoppingLists })),
            auditLog: (auditLog) => {
              setData((current) => removeLegacyDemoData({ ...current, auditLog }))
              setCloud((current) => ({ ...current, syncing: false }))
            },
            error: (error) => setCloud((current) => ({ ...current, syncing: false, error })),
          })
        })
    })
    return () => { sessionVersion += 1; stopSession(); stopHousehold?.() }
  }, [ready])

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

  const reportCloudError = useCallback((error: unknown) => {
    setCloud((current) => ({ ...current, syncing: false, error: error instanceof Error ? error.message : 'Cloud sync failed.' }))
  }, [])

  const connectFamily = useCallback(async (code: string) => {
    setCloud((current) => ({ ...current, syncing: true, error: '' }))
    try {
      await connectCloudFamily(code, data)
      setCloud((current) => ({ ...current, connected: true, syncing: false }))
    } catch (error) {
      reportCloudError(error)
      throw error
    }
  }, [data, reportCloudError])

  const disconnectFamily = useCallback(async () => {
    setCloud((current) => ({ ...current, syncing: true, error: '' }))
    try {
      await disconnectCloudFamily()
      setCloud((current) => ({ ...current, connected: false, syncing: false }))
    } catch (error) {
      reportCloudError(error)
    }
  }, [reportCloudError])

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
    const audit = log('Added item', `${item.name} · ${item.quantity} ${item.unit}`)
    void saveInventoryItem(item, audit).catch(reportCloudError)
    return {
      ...current,
      inventory: [item, ...current.inventory],
      auditLog: [audit, ...current.auditLog].slice(0, 100),
    }
  })

  const updateItemStatus = (id: string, status: InventoryItem['status']) => setData((current) => {
    const item = current.inventory.find((candidate) => candidate.id === id)
    if (!item) return current
    const updated = { ...item, status, updated: stamp() }
    const audit = log(status === 'wasted' ? 'Marked wasted' : 'Marked used', item.name)
    void saveInventoryItem(updated, audit).catch(reportCloudError)
    return {
      ...current,
      inventory: current.inventory.map((candidate) => candidate.id === id ? updated : candidate),
      auditLog: [audit, ...current.auditLog].slice(0, 100),
    }
  })

  const createShoppingList = (name: string) => setData((current) => {
    const now = stamp()
    const list: ShoppingList = { id: crypto.randomUUID(), name, items: [], created: now, updated: now }
    const audit = log('Created list', name)
    void saveShoppingList(list, audit).catch(reportCloudError)
    return { ...current, shoppingLists: [...current.shoppingLists, list], auditLog: [audit, ...current.auditLog] }
  })

  const addShoppingItem = (listId: string, name: string, source: 'manual' | 'low-stock' | 'recommendation' = 'manual', estimatedPrice?: number) => setData((current) => {
    const existingList = current.shoppingLists.find((list) => list.id === listId)
    if (!existingList) return current
    const item = { id: crypto.randomUUID(), name, quantity: 1, unit: 'item', checked: false, estimatedPrice, source, addedBy: stamp() }
    const list = { ...existingList, updated: stamp(), items: [...existingList.items, item] }
    const audit = log('Added to shopping list', name)
    void saveShoppingItem(listId, item, list, audit).catch(reportCloudError)
    return {
      ...current,
      shoppingLists: current.shoppingLists.map((candidate) => candidate.id === listId ? list : candidate),
      auditLog: [audit, ...current.auditLog].slice(0, 100),
    }
  })

  const toggleShoppingItem = (listId: string, itemId: string) => setData((current) => {
    const existingList = current.shoppingLists.find((list) => list.id === listId)
    const existingItem = existingList?.items.find((item) => item.id === itemId)
    if (!existingList || !existingItem) return current
    const item = { ...existingItem, checked: !existingItem.checked }
    const list = { ...existingList, updated: stamp(), items: existingList.items.map((candidate) => candidate.id === itemId ? item : candidate) }
    void saveShoppingItem(listId, item, list).catch(reportCloudError)
    return { ...current, shoppingLists: current.shoppingLists.map((candidate) => candidate.id === listId ? list : candidate) }
  })

  const setNotificationsEnabled = (notificationsEnabled: boolean) => setData((current) => ({
    ...current, settings: { ...current.settings, notificationsEnabled },
  }))

  const recommendations = useMemo(() => data.inventory.filter((item) =>
    item.status === 'available' && (item.quantity <= item.minimumQuantity || getExpiryLevel(item) === 'expired')
  ), [data.inventory])
  const frequentItems = useMemo(() => getFrequentInventoryItems(data.inventory), [data.inventory])

  return <AppContext.Provider value={{
    ...data, ready, cloud, connectFamily, disconnectFamily, setDeviceName, setLanguage, addInventoryItem, updateItemStatus,
    createShoppingList, addShoppingItem, toggleShoppingItem, setNotificationsEnabled, recommendations, frequentItems,
  }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
