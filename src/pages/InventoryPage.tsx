import { useMemo, useState } from 'react'
import { IonIcon } from '@ionic/react'
import { addOutline, searchOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import { ItemCard } from '../components/ItemCard'
import { useApp } from '../state/AppContext'
import { getExpiryLevel } from '../utils/expiry'

export function InventoryPage({ onAdd }: { onAdd: () => void }) {
  const { t } = useTranslation()
  const { inventory, updateItemStatus } = useApp()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'expiring' | 'expired' | 'low'>('all')
  const results = useMemo(() => inventory.filter((item) => {
    if (item.status !== 'available') return false
    const matchesQuery = `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())
    const level = getExpiryLevel(item)
    const matchesFilter = filter === 'all' || (filter === 'expiring' && ['soon','urgent'].includes(level)) || (filter === 'expired' && level === 'expired') || (filter === 'low' && item.quantity <= item.minimumQuantity)
    return matchesQuery && matchesFilter
  }), [inventory, query, filter])

  return <main className="page">
    <div className="page-title"><div><span className="eyebrow">WHAT IS AT HOME</span><h1>{t('inventory')}</h1><p>{inventory.filter((item) => item.status === 'available').length} active items</p></div><button className="primary-action" type="button" onClick={onAdd}><IonIcon icon={addOutline} /> {t('addItem')}</button></div>
    <div className="search-box"><IonIcon icon={searchOutline} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchItems')} aria-label={t('searchItems')} /></div>
    <div className="filter-row">
      {([['all', t('all')], ['expiring', t('expiringSoon')], ['expired', t('expired')], ['low', t('lowStock')]] as const).map(([id, label]) => <button className={filter === id ? 'active' : ''} type="button" key={id} onClick={() => setFilter(id)}>{label}</button>)}
    </div>
    <div className="item-list">
      {results.map((item) => <ItemCard item={item} key={item.id} onStatus={(status) => updateItemStatus(item.id, status)} />)}
      {results.length === 0 && <div className="empty-state">No items match this view.</div>}
    </div>
  </main>
}
