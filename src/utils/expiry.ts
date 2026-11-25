import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns'
import type { InventoryItem } from '../types'

export type ExpiryLevel = 'fresh' | 'soon' | 'urgent' | 'expired' | 'none'

export function getEffectiveExpiry(item: InventoryItem): Date | null {
  if (item.openedDate && item.afterOpenDays) {
    return addDays(parseISO(item.openedDate), item.afterOpenDays)
  }
  if (item.expiryDate) return parseISO(item.expiryDate)
  if (item.lifetimeDays) return addDays(parseISO(item.purchaseDate), item.lifetimeDays)
  return null
}

export function getLifetimeDays(item: InventoryItem): number {
  if (item.openedDate && item.afterOpenDays) return item.afterOpenDays
  if (item.lifetimeDays) return item.lifetimeDays
  const expiry = getEffectiveExpiry(item)
  return expiry
    ? Math.max(1, differenceInCalendarDays(expiry, parseISO(item.purchaseDate)))
    : 0
}

export function notificationLeadDays(lifetimeDays: number): number[] {
  if (lifetimeDays <= 0) return []
  if (lifetimeDays <= 14) return [3, 1, 0]
  if (lifetimeDays <= 90) return [14, 7, 2, 0]
  if (lifetimeDays <= 365) return [30, 14, 3, 0]
  return [90, 30, 7, 0]
}

export function getDaysRemaining(item: InventoryItem): number | null {
  const expiry = getEffectiveExpiry(item)
  return expiry ? differenceInCalendarDays(expiry, new Date()) : null
}

export function getExpiryLevel(item: InventoryItem): ExpiryLevel {
  const days = getDaysRemaining(item)
  if (days === null) return 'none'
  if (days < 0) return 'expired'
  if (days <= 3) return 'urgent'
  const firstLead = notificationLeadDays(getLifetimeDays(item))[0] ?? 7
  if (days <= firstLead) return 'soon'
  return 'fresh'
}

export function expiryLabel(item: InventoryItem): string {
  const days = getDaysRemaining(item)
  if (days === null) return 'No expiry set'
  if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`
  if (days === 0) return 'Expires today'
  if (days === 1) return 'Expires tomorrow'
  return `Expires in ${days} days`
}

export function expiryDateLabel(item: InventoryItem): string {
  const expiry = getEffectiveExpiry(item)
  return expiry ? format(expiry, 'd MMM yyyy') : '—'
}
