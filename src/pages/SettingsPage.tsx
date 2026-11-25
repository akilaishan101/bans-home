import { IonIcon } from '@ionic/react'
import { useState } from 'react'
import { chevronForwardOutline, cloudDoneOutline, cloudOfflineOutline, languageOutline, notificationsOutline, phonePortraitOutline, shieldCheckmarkOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import { requestNotificationPermission, scheduleExpiryNotifications } from '../services/notifications'
import { useApp } from '../state/AppContext'

export function SettingsPage() {
  const { t } = useTranslation()
  const { settings, inventory, auditLog, cloud, connectFamily, disconnectFamily, setLanguage, setDeviceName, setNotificationsEnabled } = useApp()
  const [familyCode, setFamilyCode] = useState('')
  const changeLanguage = (language: 'en' | 'si') => { setLanguage(language); void i18n.changeLanguage(language) }
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationsEnabled(granted)
    if (granted) await scheduleExpiryNotifications(inventory)
  }
  const connect = async () => {
    try {
      await connectFamily(familyCode)
      setFamilyCode('')
    } catch {
      // A clear error is displayed from the shared app state.
    }
  }
  return <main className="page settings-page">
    <div className="page-title"><div><span className="eyebrow">BANS HOME</span><h1>{t('settings')}</h1><p>Simple family controls</p></div></div>
    <section className="settings-card">
      <div className="setting-row"><span className="setting-icon"><IonIcon icon={phonePortraitOutline} /></span><div><small>{t('thisDevice')}</small><input value={settings.deviceName} onChange={(e) => setDeviceName(e.target.value)} aria-label="Device name" /><p>Device ID · {settings.deviceId.slice(0, 8)}</p></div></div>
      <div className="setting-row"><span className="setting-icon"><IonIcon icon={languageOutline} /></span><div><small>{t('language')}</small><div className="segmented"><button className={settings.language === 'en' ? 'active' : ''} type="button" onClick={() => changeLanguage('en')}>English</button><button className={settings.language === 'si' ? 'active' : ''} type="button" onClick={() => changeLanguage('si')}>සිංහල</button></div></div></div>
      <button className="setting-row setting-button" type="button" onClick={enableNotifications}><span className="setting-icon"><IonIcon icon={notificationsOutline} /></span><div><small>{t('notifications')}</small><strong>{settings.notificationsEnabled ? 'Enabled' : t('enableNotifications')}</strong><p>Timing adapts to each item's lifetime.</p></div><IonIcon icon={chevronForwardOutline} /></button>
      <div className="setting-row"><span className="setting-icon"><IonIcon icon={shieldCheckmarkOutline} /></span><div><small>{t('household')}</small><strong>{settings.householdName}</strong><p>One shared family code · device audit enabled</p></div></div>
    </section>
    <section className="section-block">
      <div className="section-heading"><div><span className="eyebrow">SHARED FAMILY DATA</span><h2>Family sync</h2></div></div>
      <div className="settings-card family-sync-card">
        <div className="setting-row">
          <span className="setting-icon"><IonIcon icon={cloud.connected ? cloudDoneOutline : cloudOfflineOutline} /></span>
          <div>
            <small>{cloud.connected ? 'CONNECTED' : 'NOT CONNECTED'}</small>
            <strong>{cloud.connected ? 'All family devices stay in sync' : 'Connect this device'}</strong>
            <p>{cloud.connected ? 'Changes are shared automatically; an offline copy remains on this device.' : 'Use the same private family code on every phone.'}</p>
          </div>
        </div>
        {!cloud.configured && <p className="sync-message error">Cloud setup is not available in this build yet.</p>}
        {cloud.configured && !cloud.connected && <div className="family-code-form">
          <label htmlFor="family-code">Family code</label>
          <div><input id="family-code" type="password" value={familyCode} onChange={(event) => setFamilyCode(event.target.value)} placeholder="At least 8 characters" autoComplete="current-password" /><button type="button" onClick={connect} disabled={cloud.syncing || familyCode.length < 8}>{cloud.syncing ? 'Connecting…' : 'Connect'}</button></div>
          <p>The first device creates the family; all other devices use exactly the same code.</p>
        </div>}
        {cloud.connected && <button className="disconnect-button" type="button" onClick={() => void disconnectFamily()} disabled={cloud.syncing}>Disconnect this device</button>}
        {cloud.error && <p className="sync-message error" role="alert">{cloud.error}</p>}
      </div>
    </section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">WHO CHANGED WHAT</span><h2>{t('activity')}</h2></div></div><div className="activity-list">{auditLog.slice(0, 8).map((entry) => <div key={entry.id}><span className="activity-dot" /><div><strong>{entry.action}</strong><p>{entry.detail}</p></div><small>{entry.stamp.deviceName}<br />{new Date(entry.stamp.at).toLocaleString()}</small></div>)}</div></section>
  </main>
}
