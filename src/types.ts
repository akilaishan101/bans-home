export type Language = 'en' | 'si'

export type ItemStatus = 'available' | 'consumed' | 'wasted' | 'donated'

export interface DeviceStamp {
  deviceId: string
  deviceName: string
  at: string
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  storage: 'Pantry' | 'Fridge' | 'Freezer' | 'Other'
  purchaseDate: string
  purchasePrice: number
  expiryDate?: string
  lifetimeDays?: number
  openedDate?: string
  afterOpenDays?: number
  minimumQuantity: number
  status: ItemStatus
  created: DeviceStamp
  updated: DeviceStamp
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  checked: boolean
  estimatedPrice?: number
  source?: 'manual' | 'low-stock' | 'recommendation'
  addedBy: DeviceStamp
}

export interface ShoppingList {
  id: string
  name: string
  items: ShoppingItem[]
  created: DeviceStamp
  updated: DeviceStamp
}

export interface AuditEntry {
  id: string
  action: string
  detail: string
  stamp: DeviceStamp
}

export interface AppSettings {
  householdName: string
  deviceId: string
  deviceName: string
  language: Language
  currency: 'LKR'
  notificationsEnabled: boolean
}

export interface AppData {
  inventory: InventoryItem[]
  shoppingLists: ShoppingList[]
  auditLog: AuditEntry[]
  settings: AppSettings
}

export interface NewInventoryItem {
  name: string
  category: string
  quantity: number
  unit: string
  storage: InventoryItem['storage']
  purchaseDate: string
  purchasePrice: number
  expiryDate?: string
  lifetimeDays?: number
  afterOpenDays?: number
  minimumQuantity: number
}
