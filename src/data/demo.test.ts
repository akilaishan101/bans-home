import { describe, expect, it } from 'vitest'
import { createInitialData, removeLegacyDemoData } from './demo'
import type { AppData } from '../types'

describe('demo data migration', () => {
  it('starts a new household without sample records', () => {
    const data = createInitialData()
    expect(data.inventory).toEqual([])
    expect(data.shoppingLists).toEqual([])
    expect(data.auditLog).toEqual([])
  })

  it('removes only known legacy demo IDs', () => {
    const data = createInitialData() as AppData
    data.inventory = [
      { id: 'milk-1' } as AppData['inventory'][number],
      { id: 'real-family-item' } as AppData['inventory'][number],
    ]
    data.shoppingLists = [
      { id: 'weekly-list', items: [] } as unknown as AppData['shoppingLists'][number],
      { id: 'real-list', items: [{ id: 'shop-1' }, { id: 'real-shopping-item' }] } as unknown as AppData['shoppingLists'][number],
    ]
    data.auditLog = [{ id: 'audit-demo' }, { id: 'real-audit' }] as AppData['auditLog']

    const cleaned = removeLegacyDemoData(data)
    expect(cleaned.inventory.map((item) => item.id)).toEqual(['real-family-item'])
    expect(cleaned.shoppingLists.map((list) => list.id)).toEqual(['real-list'])
    expect(cleaned.shoppingLists[0].items.map((item) => item.id)).toEqual(['real-shopping-item'])
    expect(cleaned.auditLog.map((entry) => entry.id)).toEqual(['real-audit'])
  })
})
