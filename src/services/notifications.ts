import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { setHours, setMinutes, subDays } from 'date-fns'
import type { InventoryItem } from '../types'
import { getEffectiveExpiry, getLifetimeDays, notificationLeadDays } from '../utils/expiry'

export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    const result = await LocalNotifications.requestPermissions()
    return result.display === 'granted'
  }
  if (!('Notification' in window)) return false
  return (await Notification.requestPermission()) === 'granted'
}

export async function scheduleExpiryNotifications(items: InventoryItem[]) {
  if (!Capacitor.isNativePlatform()) return
  await LocalNotifications.cancel({ notifications: (await LocalNotifications.getPending()).notifications })

  const now = Date.now()
  const candidates = items
    .filter((item) => item.status === 'available')
    .flatMap((item) => {
      const expiry = getEffectiveExpiry(item)
      if (!expiry || expiry.getTime() < now) return []

      return notificationLeadDays(getLifetimeDays(item)).map((leadDays) => ({
        item,
        leadDays,
        at: setMinutes(setHours(subDays(expiry, leadDays), 9), 0),
      }))
    })
    .filter(({ at }) => at.getTime() > now)
    .sort((left, right) => left.at.getTime() - right.at.getTime())
    .slice(0, 50)

  await LocalNotifications.schedule({
    notifications: candidates.map(({ item, leadDays, at }, index) => ({
        id: 1000 + index,
        title: `${item.name} expires soon`,
        body: leadDays === 0
          ? 'This item expires today.'
          : `${leadDays} day${leadDays === 1 ? '' : 's'} remaining.`,
        schedule: { at },
        extra: { itemId: item.id },
      })),
  })
}
