import type { AppData } from '../types'

export const LEGACY_DEMO_INVENTORY_IDS = ['milk-1', 'eggs-1', 'rice-1', 'yoghurt-1', 'soap-1']
export const LEGACY_DEMO_LIST_IDS = ['weekly-list', 'monthly-list']
export const LEGACY_DEMO_SHOPPING_ITEM_IDS = ['shop-1', 'shop-2']
export const LEGACY_DEMO_AUDIT_IDS = ['audit-demo']

export function removeLegacyDemoData(data: AppData): AppData {
  return {
    ...data,
    inventory: data.inventory.filter((item) => !LEGACY_DEMO_INVENTORY_IDS.includes(item.id)),
    shoppingLists: data.shoppingLists
      .filter((list) => !LEGACY_DEMO_LIST_IDS.includes(list.id))
      .map((list) => ({ ...list, items: list.items.filter((item) => !LEGACY_DEMO_SHOPPING_ITEM_IDS.includes(item.id)) })),
    auditLog: data.auditLog.filter((entry) => !LEGACY_DEMO_AUDIT_IDS.includes(entry.id)),
  }
}

export function createInitialData(): AppData {
  return {
    inventory: [],
    shoppingLists: [],
    auditLog: [],
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
