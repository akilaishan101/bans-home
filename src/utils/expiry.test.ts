import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { format } from 'date-fns'
import type { InventoryItem } from '../types'
import { getDaysRemaining, getEffectiveExpiry, getExpiryLevel, notificationLeadDays } from './expiry'

const stamp = { deviceId: 'test', deviceName: 'Test phone', at: '2026-11-24T00:00:00.000Z' }

function item(overrides: Partial<InventoryItem>): InventoryItem {
  return {
    id: 'test-item', name: 'Milk', category: 'Dairy', quantity: 1, unit: 'carton', storage: 'Fridge',
    purchaseDate: '2026-11-20', purchasePrice: 500, minimumQuantity: 1,
    status: 'available', created: stamp, updated: stamp, ...overrides,
  }
}

describe('adaptive expiry rules', () => {
  beforeEach(() => vi.setSystemTime(new Date('2026-11-24T10:00:00+05:30')))
  afterEach(() => vi.useRealTimers())

  it('uses tighter reminders for short-life products', () => {
    expect(notificationLeadDays(14)).toEqual([3, 1, 0])
    expect(notificationLeadDays(60)).toEqual([14, 7, 2, 0])
    expect(notificationLeadDays(300)).toEqual([30, 14, 3, 0])
    expect(notificationLeadDays(730)).toEqual([90, 30, 7, 0])
  })

  it('classifies expired and urgent items', () => {
    expect(getExpiryLevel(item({ expiryDate: '2026-11-23' }))).toBe('expired')
    expect(getExpiryLevel(item({ expiryDate: '2026-11-25' }))).toBe('urgent')
  })

  it('uses the after-opening lifetime when present', () => {
    const opened = item({ expiryDate: '2027-01-01', openedDate: '2026-11-20', afterOpenDays: 7 })
    expect(format(getEffectiveExpiry(opened)!, 'yyyy-MM-dd')).toBe('2026-11-27')
    expect(getDaysRemaining(opened)).toBe(3)
  })
})
