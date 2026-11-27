import { IonIcon } from '@ionic/react'
import { useState } from 'react'
import { chevronForwardOutline, cloudDoneOutline, cloudOfflineOutline, copyOutline, enterOutline, exitOutline, homeOutline, languageOutline, notificationsOutline, phonePortraitOutline, shareOutline, shieldCheckmarkOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import { requestNotificationPermission, scheduleExpiryNotifications } from '../services/notifications'
import { useApp } from '../state/AppContext'
import { normalizeHouseholdCode } from '../utils/householdCode'

const PUBLIC_APP_URL = 'https://akilaishan101.github.io/bans-home/'

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }
  const input = document.createElement('textarea')
  input.value = value
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  input.remove()
}

export function SettingsPage() {
  const { t } = useTranslation()
  const joinCodeFromLink = new URLSearchParams(window.location.search).get('join') ?? ''
  const { settings, inventory, auditLog, cloud, createHousehold, joinHousehold, leaveHousehold, setLanguage, setDeviceName, setNotificationsEnabled } = useApp()
  const [familyCode, setFamilyCode] = useState(joinCodeFromLink)
  const [syncMode, setSyncMode] = useState<'choose' | 'join'>(joinCodeFromLink ? 'join' : 'choose')
  const [shareMessage, setShareMessage] = useState('')
  const changeLanguage = (language: 'en' | 'si') => { setLanguage(language); void i18n.changeLanguage(language) }
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationsEnabled(granted)
    if (granted) await scheduleExpiryNotifications(inventory)
  }
  const create = async () => {
    try {
      await createHousehold()
    } catch {
      // A clear error is displayed from the shared app state.
    }
  }
  const join = async () => {
    try {
      await joinHousehold(familyCode)
      setFamilyCode('')
      window.history.replaceState({}, '', import.meta.env.BASE_URL)
    } catch {
      // A clear error is displayed from the shared app state.
    }
  }
  const shareCode = async () => {
    const code = settings.householdCode
    if (!code) return
    const joinUrl = new URL(PUBLIC_APP_URL)
    joinUrl.searchParams.set('join', code)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Join my BANS Home household', text: `Use household code ${code}`, url: joinUrl.toString() })
        setShareMessage('Shared')
        return
      }
      await copyText(joinUrl.toString())
      setShareMessage('Join link copied')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setShareMessage('Could not share. Please copy the code instead.')
    }
  }
  const copyCode = async () => {
    if (!settings.householdCode) return
    try {
      await copyText(settings.householdCode)
      setShareMessage('Code copied')
    } catch {
      setShareMessage('Could not copy. Press and hold the code to select it.')
    }
  }
  const leave = async () => {
    if (!window.confirm('Leave this household on this device? Its local household data will be cleared. The household remains available to other family devices.')) return
    await leaveHousehold()
    setSyncMode('choose')
    setShareMessage('')
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
        {cloud.configured && !cloud.connected && syncMode === 'choose' && <div className="household-choice-grid">
          <button type="button" onClick={() => void create()} disabled={cloud.syncing}><IonIcon icon={homeOutline} /><span><strong>{cloud.syncing ? 'Creating…' : 'Create new household'}</strong><small>Automatically generate a unique code</small></span></button>
          <button type="button" onClick={() => setSyncMode('join')} disabled={cloud.syncing}><IonIcon icon={enterOutline} /><span><strong>Join a household</strong><small>Use a family code or shared link</small></span></button>
        </div>}
        {cloud.configured && !cloud.connected && syncMode === 'join' && <div className="family-code-form">
          <label htmlFor="family-code">Household code</label>
          <div><input id="family-code" value={familyCode} onChange={(event) => setFamilyCode(event.target.value.toUpperCase())} placeholder="BANS-ABCD-2345" autoCapitalize="characters" autoComplete="off" /><button type="button" onClick={join} disabled={cloud.syncing || !normalizeHouseholdCode(familyCode)}>{cloud.syncing ? 'Joining…' : 'Join'}</button></div>
          <button className="back-choice" type="button" onClick={() => setSyncMode('choose')}>← Create a new household instead</button>
        </div>}
        {cloud.connected && settings.householdCode && <div className="household-code-card">
          <small>YOUR HOUSEHOLD CODE</small><strong>{settings.householdCode}</strong><p>Share this only with family members you want to join.</p>
          <div><button type="button" onClick={() => void copyCode()}><IonIcon icon={copyOutline} /> Copy code</button><button type="button" onClick={() => void shareCode()}><IonIcon icon={shareOutline} /> Share join link</button></div>
          {shareMessage && <span>{shareMessage}</span>}
        </div>}
        {cloud.connected && <button className="disconnect-button" type="button" onClick={() => void leave()} disabled={cloud.syncing}><IonIcon icon={exitOutline} /> Leave this household</button>}
        {cloud.error && <p className="sync-message error" role="alert">{cloud.error}</p>}
      </div>
    </section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">WHO CHANGED WHAT</span><h2>{t('activity')}</h2></div></div><div className="activity-list">{auditLog.slice(0, 8).map((entry) => <div key={entry.id}><span className="activity-dot" /><div><strong>{entry.action}</strong><p>{entry.detail}</p></div><small>{entry.stamp.deviceName}<br />{new Date(entry.stamp.at).toLocaleString()}</small></div>)}</div></section>
  </main>
}
