import { addDays, formatISO, subDays } from 'date-fns'
import type { AppData, DeviceStamp, InventoryItem, ShoppingList } from '../types'

const date = (offset: number) => formatISO(addDays(new Date(), offset), { representation: 'date' })
const past = (offset: number) => formatISO(subDays(new Date(), offset), { representation: 'date' })

const stamp: DeviceStamp = {
  deviceId: 'demo-device',
  deviceName: "Mother's phone",
  at: new Date().toISOString(),
}

const inventory: InventoryItem[] = [
  {
    id: 'milk-1', name: 'Fresh milk', category: 'Dairy', quantity: 1, unit: 'carton',
    storage: 'Fridge', purchaseDate: past(4), purchasePrice: 530,
    expiryDate: date(1), minimumQuantity: 1, status: 'available', created: stamp, updated: stamp,
  },
  {
    id: 'eggs-1', name: 'Eggs', category: 'Dairy', quantity: 4, unit: 'eggs',
    storage: 'Fridge', purchaseDate: past(10), purchasePrice: 720,
    expiryDate: date(3), minimumQuantity: 6, status: 'available', created: stamp, updated: stamp,
  },
  {
    id: 'rice-1', name: 'Samba rice', category: 'Grains', quantity: 4, unit: 'kg',
    storage: 'Pantry', purchaseDate: past(35), purchasePrice: 1280,
    lifetimeDays: 365, minimumQuantity: 2, status: 'available', created: stamp, updated: stamp,
  },
  {
    id: 'yoghurt-1', name: 'Yoghurt', category: 'Dairy', quantity: 2, unit: 'cups',
    storage: 'Fridge', purchaseDate: past(16), purchasePrice: 240,
    expiryDate: date(-2), minimumQuantity: 2, status: 'available', created: stamp, updated: stamp,
  },
  {
    id: 'soap-1', name: 'Laundry detergent', category: 'Household', quantity: 0.5, unit: 'kg',
    storage: 'Other', purchaseDate: past(70), purchasePrice: 970,
    lifetimeDays: 730, minimumQuantity: 0.5, status: 'available', created: stamp, updated: stamp,
  },
]

const shoppingLists: ShoppingList[] = [
  {
    id: 'weekly-list', name: 'Weekly groceries', created: stamp, updated: stamp,
    items: [
      { id: 'shop-1', name: 'Bread', quantity: 1, unit: 'loaf', checked: false, estimatedPrice: 250, source: 'manual', addedBy: stamp },
      { id: 'shop-2', name: 'Bananas', quantity: 1, unit: 'kg', checked: true, estimatedPrice: 480, source: 'manual', addedBy: stamp },
    ],
  },
  { id: 'monthly-list', name: 'Monthly household', created: stamp, updated: stamp, items: [] },
]

export function createInitialData(): AppData {
  return {
    inventory,
    shoppingLists,
    auditLog: [
      { id: 'audit-demo', action: 'Updated quantity', detail: 'Fresh milk · 1 carton', stamp },
    ],
    settings: {
      householdName: 'BANS Home',
      deviceId: crypto.randomUUID(),
      deviceName: '',
      language: 'en',
      currency: 'LKR',
      notificationsEnabled: false,
    },
  }
}
