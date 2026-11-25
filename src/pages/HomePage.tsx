import { IonIcon } from '@ionic/react'
import { addCircleOutline, alertCircleOutline, cartOutline, chevronForwardOutline, cubeOutline, timeOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import { MetricCard } from '../components/MetricCard'
import { useApp } from '../state/AppContext'
import { expiryLabel, getExpiryLevel } from '../utils/expiry'

interface Props { onNavigate: (page: string) => void; onAdd: () => void }

export function HomePage({ onNavigate, onAdd }: Props) {
  const { t } = useTranslation()
  const { inventory, recommendations, settings, shoppingLists, addShoppingItem } = useApp()
  const active = inventory.filter((item) => item.status === 'available')
  const expired = active.filter((item) => getExpiryLevel(item) === 'expired')
  const expiring = active.filter((item) => ['soon', 'urgent'].includes(getExpiryLevel(item)))
  const low = active.filter((item) => item.quantity <= item.minimumQuantity)
  const attention = [...expired, ...expiring].slice(0, 4)
  const targetList = shoppingLists[0]

  return <main className="page home-page">
    <section className="welcome-card">
      <div>
        <span className="eyebrow">{settings.householdName.toUpperCase()}</span>
        <h1>{t('greeting')}, <em>{settings.deviceName.replace(/'s .*/, '')}</em></h1>
        <p>{t('overview')}</p>
      </div>
      <button className="primary-action" type="button" onClick={onAdd}><IonIcon icon={addCircleOutline} /> {t('addItem')}</button>
    </section>

    <section className="metric-grid" aria-label="Inventory summary">
      <MetricCard icon={timeOutline} label={t('expiringSoon')} value={expiring.length} tone="amber" onClick={() => onNavigate('inventory')} />
      <MetricCard icon={alertCircleOutline} label={t('expired')} value={expired.length} tone="red" onClick={() => onNavigate('inventory')} />
      <MetricCard icon={cubeOutline} label={t('lowStock')} value={low.length} tone="blue" onClick={() => onNavigate('inventory')} />
    </section>

    <section className="section-block">
      <div className="section-heading"><div><span className="eyebrow">USE FIRST</span><h2>{t('expiringSoon')}</h2></div><button type="button" onClick={() => onNavigate('inventory')}>{t('viewAll')} <IonIcon icon={chevronForwardOutline} /></button></div>
      <div className="attention-list">
        {attention.length === 0 && <div className="empty-state">Everything looks fresh.</div>}
        {attention.map((item) => <div className={`attention-row ${getExpiryLevel(item)}`} key={item.id}>
          <span className="attention-dot" />
          <div><strong>{item.name}</strong><small>{item.quantity} {item.unit} · {item.storage}</small></div>
          <span>{expiryLabel(item)}</span>
        </div>)}
      </div>
    </section>

    <section className="section-block recommendation-block">
      <div className="section-heading"><div><span className="eyebrow">SMART LIST</span><h2>{t('suggestions')}</h2></div><IonIcon className="section-icon" icon={cartOutline} /></div>
      <div className="suggestion-grid">
        {recommendations.slice(0, 4).map((item) => {
          const alreadyAdded = targetList?.items.some((entry) => entry.name.toLowerCase() === item.name.toLowerCase())
          return <article className="suggestion-card" key={item.id}>
            <div><strong>{item.name}</strong><small>{getExpiryLevel(item) === 'expired' ? 'Replace expired stock' : `Only ${item.quantity} ${item.unit} left`}</small></div>
            <button type="button" disabled={alreadyAdded || !targetList} onClick={() => targetList && addShoppingItem(targetList.id, item.name, 'recommendation')}>{alreadyAdded ? 'Added' : '+ Add'}</button>
          </article>
        })}
      </div>
    </section>
  </main>
}
