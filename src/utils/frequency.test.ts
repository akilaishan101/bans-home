import { describe, expect, it } from 'vitest'
import type { InventoryItem } from '../types'
import { getFrequentInventoryItems } from './frequency'

const item = (id: string, name: string, at: string): InventoryItem => ({
  id, name, category: 'Food', quantity: 1, unit: 'item', storage: 'Pantry', purchaseDate: '2026-11-26',
  purchasePrice: 100, minimumQuantity: 1, status: 'available',
  created: { deviceId: 'test', deviceName: 'Test', at }, updated: { deviceId: 'test', deviceName: 'Test', at },
})

describe('frequently purchased items', () => {
  it('ranks repeated additions ahead of one-time purchases', () => {
    const frequent = getFrequentInventoryItems([
      item('1', 'Fresh Milk', '2026-11-20T00:00:00Z'),
      item('2', 'fresh milk', '2026-11-25T00:00:00Z'),
      item('3', 'Bread', '2026-11-26T00:00:00Z'),
    ])
    expect(frequent[0]).toMatchObject({ name: 'fresh milk', count: 2 })
    expect(frequent[1]).toMatchObject({ name: 'Bread', count: 1 })
  })

  it('uses the latest purchase as the quick-add template', () => {
    const older = item('1', 'Eggs', '2026-11-20T00:00:00Z')
    const newer = { ...item('2', 'Eggs', '2026-11-25T00:00:00Z'), purchasePrice: 650, storage: 'Fridge' as const }
    expect(getFrequentInventoryItems([older, newer])[0].template).toMatchObject({ purchasePrice: 650, storage: 'Fridge' })
  })
})
