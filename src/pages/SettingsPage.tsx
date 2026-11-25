import { IonIcon } from '@ionic/react'
import { chevronForwardOutline, languageOutline, notificationsOutline, phonePortraitOutline, shieldCheckmarkOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import { requestNotificationPermission, scheduleExpiryNotifications } from '../services/notifications'
import { useApp } from '../state/AppContext'

export function SettingsPage() {
  const { t } = useTranslation()
  const { settings, inventory, auditLog, setLanguage, setDeviceName, setNotificationsEnabled } = useApp()
  const changeLanguage = (language: 'en' | 'si') => { setLanguage(language); void i18n.changeLanguage(language) }
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationsEnabled(granted)
    if (granted) await scheduleExpiryNotifications(inventory)
  }
  return <main className="page settings-page">
    <div className="page-title"><div><span className="eyebrow">BANS HOME</span><h1>{t('settings')}</h1><p>Simple family controls</p></div></div>
    <section className="settings-card">
      <div className="setting-row"><span className="setting-icon"><IonIcon icon={phonePortraitOutline} /></span><div><small>{t('thisDevice')}</small><input value={settings.deviceName} onChange={(e) => setDeviceName(e.target.value)} aria-label="Device name" /><p>Device ID · {settings.deviceId.slice(0, 8)}</p></div></div>
      <div className="setting-row"><span className="setting-icon"><IonIcon icon={languageOutline} /></span><div><small>{t('language')}</small><div className="segmented"><button className={settings.language === 'en' ? 'active' : ''} type="button" onClick={() => changeLanguage('en')}>English</button><button className={settings.language === 'si' ? 'active' : ''} type="button" onClick={() => changeLanguage('si')}>සිංහල</button></div></div></div>
      <button className="setting-row setting-button" type="button" onClick={enableNotifications}><span className="setting-icon"><IonIcon icon={notificationsOutline} /></span><div><small>{t('notifications')}</small><strong>{settings.notificationsEnabled ? 'Enabled' : t('enableNotifications')}</strong><p>Timing adapts to each item's lifetime.</p></div><IonIcon icon={chevronForwardOutline} /></button>
      <div className="setting-row"><span className="setting-icon"><IonIcon icon={shieldCheckmarkOutline} /></span><div><small>{t('household')}</small><strong>{settings.householdName}</strong><p>Account-free mode · device audit enabled</p></div></div>
    </section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">WHO CHANGED WHAT</span><h2>{t('activity')}</h2></div></div><div className="activity-list">{auditLog.slice(0, 8).map((entry) => <div key={entry.id}><span className="activity-dot" /><div><strong>{entry.action}</strong><p>{entry.detail}</p></div><small>{entry.stamp.deviceName}<br />{new Date(entry.stamp.at).toLocaleString()}</small></div>)}</div></section>
  </main>
}
