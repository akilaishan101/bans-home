import { useTranslation } from 'react-i18next'
import { useApp } from '../state/AppContext'
import { getExpiryLevel } from '../utils/expiry'

function groupTotals(items: { key: string; value: number }[]) {
  return Object.entries(items.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.key]: (acc[item.key] ?? 0) + item.value }), {})).sort((a, b) => b[1] - a[1])
}

export function StatsPage() {
  const { t } = useTranslation()
  const { inventory } = useApp()
  const total = inventory.reduce((sum, item) => sum + item.purchasePrice, 0)
  const activeValue = inventory.filter((item) => item.status === 'available').reduce((sum, item) => sum + item.purchasePrice, 0)
  const waste = inventory.filter((item) => item.status === 'wasted' || getExpiryLevel(item) === 'expired').reduce((sum, item) => sum + item.purchasePrice, 0)
  const categories = groupTotals(inventory.map((item) => ({ key: item.category, value: item.purchasePrice })))
  const maxCategory = categories[0]?.[1] || 1
  const usedValue = inventory.filter((item) => item.status === 'consumed').reduce((sum, item) => sum + item.purchasePrice, 0)
  const valueByOutcome = [['Available at home', activeValue], ['Used', usedValue], ['Wasted / expired', waste]] as const

  return <main className="page">
    <div className="page-title"><div><span className="eyebrow">MONEY AT A GLANCE</span><h1>{t('stats')}</h1><p>Based on recorded purchases</p></div></div>
    <section className="money-grid">
      <article><small>{t('totalSpend')}</small><strong>LKR {total.toLocaleString()}</strong><span>{t('month')}</span></article>
      <article><small>{t('inventoryValue')}</small><strong>LKR {activeValue.toLocaleString()}</strong><span>Currently at home</span></article>
      <article className="loss"><small>{t('wasteCost')}</small><strong>LKR {waste.toLocaleString()}</strong><span>Reduce this next month</span></article>
    </section>
    <div className="analytics-grid">
      <section className="analytics-card"><span className="eyebrow">WHAT YOU BUY</span><h2>{t('byCategory')}</h2><div className="bar-list">{categories.map(([name, value]) => <div className="bar-row" key={name}><div><span>{name}</span><strong>LKR {value.toLocaleString()}</strong></div><i><b style={{ width: `${(value / maxCategory) * 100}%` }} /></i></div>)}</div></section>
      <section className="analytics-card"><span className="eyebrow">HOUSEHOLD VALUE</span><h2>By outcome</h2><div className="category-list">{valueByOutcome.map(([name, value]) => <div key={name}><span>{name}</span><strong>LKR {value.toLocaleString()}</strong></div>)}</div></section>
    </div>
    <p className="data-note">Savings will be calculated only after reliable supermarket comparison prices are connected.</p>
  </main>
}
