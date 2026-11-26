import type { FrequentInventoryItem, InventoryItem, NewInventoryItem } from '../types'

function normalizedName(value: string) {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function asTemplate(item: InventoryItem): NewInventoryItem {
  return {
    name: item.name,
    category: item.category,
    quantity: 1,
    unit: item.unit,
    storage: item.storage,
    purchaseDate: item.purchaseDate,
    purchasePrice: item.purchasePrice,
    lifetimeDays: item.lifetimeDays,
    afterOpenDays: item.afterOpenDays,
    minimumQuantity: item.minimumQuantity,
  }
}

export function getFrequentInventoryItems(inventory: InventoryItem[], limit = 6): FrequentInventoryItem[] {
  const groups = new Map<string, FrequentInventoryItem>()

  inventory.forEach((item) => {
    const key = normalizedName(item.name)
    if (!key) return
    const previous = groups.get(key)
    if (!previous) {
      groups.set(key, { name: item.name, count: 1, lastAddedAt: item.created.at, template: asTemplate(item) })
      return
    }
    const isNewer = item.created.at > previous.lastAddedAt
    groups.set(key, {
      name: isNewer ? item.name : previous.name,
      count: previous.count + 1,
      lastAddedAt: isNewer ? item.created.at : previous.lastAddedAt,
      template: isNewer ? asTemplate(item) : previous.template,
    })
  })

  return [...groups.values()]
    .sort((left, right) => right.count - left.count || right.lastAddedAt.localeCompare(left.lastAddedAt))
    .slice(0, limit)
}
