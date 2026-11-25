import { useEffect, useState, type ReactNode } from 'react'
import { IonApp, IonIcon, setupIonicReact } from '@ionic/react'
import { cartOutline, homeOutline, pieChartOutline, settingsOutline, storefrontOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import { AddItemModal } from './components/AddItemModal'
import { DeviceSetup } from './components/DeviceSetup'
import { HomePage } from './pages/HomePage'
import { InventoryPage } from './pages/InventoryPage'
import { ShoppingPage } from './pages/ShoppingPage'
import { StatsPage } from './pages/StatsPage'
import { SettingsPage } from './pages/SettingsPage'
import { AppProvider, useApp } from './state/AppContext'
import i18n from './i18n'
import './App.css'

setupIonicReact({ mode: 'md' })

type PageId = 'home' | 'inventory' | 'shopping' | 'stats' | 'settings'

function Shell() {
  const { t } = useTranslation()
  const { settings, ready, addInventoryItem } = useApp()
  const [page, setPage] = useState<PageId>('home')
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => { void i18n.changeLanguage(settings.language) }, [settings.language])

  if (!ready) return <div className="loading-screen"><div className="brand-mark">B</div><p>Preparing your home…</p></div>
  if (!settings.deviceName) return <DeviceSetup />

  const pages: Record<PageId, ReactNode> = {
    home: <HomePage onNavigate={(id) => setPage(id as PageId)} onAdd={() => setAddOpen(true)} />,
    inventory: <InventoryPage onAdd={() => setAddOpen(true)} />,
    shopping: <ShoppingPage />,
    stats: <StatsPage />,
    settings: <SettingsPage />,
  }
  const tabs: { id: PageId; label: string; icon: string }[] = [
    { id: 'home', label: t('home'), icon: homeOutline },
    { id: 'inventory', label: t('inventory'), icon: storefrontOutline },
    { id: 'shopping', label: t('shopping'), icon: cartOutline },
    { id: 'stats', label: t('stats'), icon: pieChartOutline },
    { id: 'settings', label: t('settings'), icon: settingsOutline },
  ]

  return <div className="app-frame">
    <header className="topbar"><button className="brand" type="button" onClick={() => setPage('home')}><span className="brand-mark small">B</span><span><strong>BANS</strong><small>HOME</small></span></button><div className="device-badge"><span />{settings.deviceName}</div></header>
    <div className="page-scroll">{pages[page]}</div>
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => <button key={tab.id} type="button" className={page === tab.id ? 'active' : ''} onClick={() => setPage(tab.id)}><IonIcon icon={tab.icon} /><span>{tab.label}</span></button>)}
    </nav>
    <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addInventoryItem} />
  </div>
}

export default function App() {
  return <IonApp><AppProvider><Shell /></AppProvider></IonApp>
}
