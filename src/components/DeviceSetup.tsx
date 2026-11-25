import { useState } from 'react'
import { IonButton, IonInput } from '@ionic/react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../state/AppContext'

export function DeviceSetup() {
  const { t } = useTranslation()
  const { setDeviceName, setLanguage } = useApp()
  const [name, setName] = useState('')
  return <div className="onboarding">
    <div className="onboarding-card">
      <div className="brand-mark">B</div>
      <span className="eyebrow">WELCOME TO BANS HOME</span>
      <h1>{t('deviceSetup')}</h1>
      <p>{t('deviceHelp')}</p>
      <div className="language-switch" aria-label="Language">
        <button type="button" onClick={() => setLanguage('en')}>English</button>
        <button type="button" onClick={() => setLanguage('si')}>සිංහල</button>
      </div>
      <IonInput className="device-input" label="Device name" labelPlacement="stacked" placeholder="e.g. Father's phone" value={name} onIonInput={(e) => setName(String(e.detail.value ?? ''))} />
      <div className="quick-names">
        {["Father's phone", "Mother's phone", "Akila's iPhone", "Shehan's iPhone"].map((value) => <button type="button" key={value} onClick={() => setName(value)}>{value}</button>)}
      </div>
      <IonButton expand="block" size="large" disabled={!name.trim()} onClick={() => setDeviceName(name.trim())}>{t('continue')}</IonButton>
    </div>
  </div>
}
