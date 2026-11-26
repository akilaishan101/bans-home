import { useState } from 'react'
import { IonIcon } from '@ionic/react'
import { addOutline, cartOutline, checkmarkOutline, sparklesOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import { ProductSuggestions } from '../components/ProductSuggestions'
import { estimateFor, type CatalogueProduct } from '../data/productCatalogue'
import { useApp } from '../state/AppContext'

export function ShoppingPage() {
  const { t } = useTranslation()
  const { shoppingLists, recommendations, addShoppingItem, toggleShoppingItem, createShoppingList } = useApp()
  const [activeId, setActiveId] = useState(shoppingLists[0]?.id ?? '')
  const [newItem, setNewItem] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<CatalogueProduct>()
  const [creating, setCreating] = useState(false)
  const [listName, setListName] = useState('')
  const active = shoppingLists.find((list) => list.id === activeId) ?? shoppingLists[0]
  const total = active?.items.reduce((sum, item) => sum + (item.estimatedPrice ?? 0) * item.quantity, 0) ?? 0

  const submitItem = () => {
    if (!active || !newItem.trim()) return
    const estimate = selectedProduct?.name === newItem ? selectedProduct : estimateFor(newItem)
    addShoppingItem(active.id, newItem.trim(), 'manual', estimate?.estimatedPrice)
    setNewItem('')
    setSelectedProduct(undefined)
  }
  const chooseProduct = (product: CatalogueProduct) => {
    setNewItem(product.name)
    setSelectedProduct(product)
  }
  const submitList = () => {
    if (!listName.trim()) return
    createShoppingList(listName.trim())
    setListName('')
    setCreating(false)
  }

  return <main className="page">
    <div className="page-title"><div><span className="eyebrow">PLAN TOGETHER</span><h1>{t('shopping')}</h1><p>Shared lists for the whole family</p></div><button className="primary-action" type="button" onClick={() => setCreating(true)}><IonIcon icon={addOutline} /> {t('createList')}</button></div>
    <div className="list-tabs">
      {shoppingLists.map((list) => <button key={list.id} type="button" className={active?.id === list.id ? 'active' : ''} onClick={() => setActiveId(list.id)}><IonIcon icon={cartOutline} /><span>{list.name}<small>{list.items.filter((item) => !item.checked).length} remaining</small></span></button>)}
    </div>

    {creating && <div className="inline-create"><input autoFocus value={listName} onChange={(e) => setListName(e.target.value)} placeholder="List name" onKeyDown={(e) => e.key === 'Enter' && submitList()} /><button type="button" onClick={submitList}>Create</button><button type="button" onClick={() => setCreating(false)}>Cancel</button></div>}

    {!active && !creating && <section className="shopping-panel empty-state"><IonIcon className="section-icon" icon={cartOutline} /><h2>Create your first shopping list</h2><p>Keep groceries and household essentials together for everyone.</p><button className="primary-action" type="button" onClick={() => setCreating(true)}><IonIcon icon={addOutline} /> {t('createList')}</button></section>}

    {active && <>
      <section className="shopping-panel">
        <div className="shopping-panel-head"><div><span className="eyebrow">FAMILY LIST</span><h2>{active.name}</h2></div><div><small>{t('estimatedTotal')}</small><strong>LKR {total.toLocaleString()}</strong></div></div>
        <div className="quick-add-wrap"><div className="quick-add"><input value={newItem} onChange={(e) => { setNewItem(e.target.value); setSelectedProduct(undefined) }} onKeyDown={(e) => e.key === 'Enter' && submitItem()} placeholder="Type a product name" /><button type="button" onClick={submitItem}><IonIcon icon={addOutline} /><span>{t('addToList')}</span></button></div><ProductSuggestions query={selectedProduct?.name === newItem ? '' : newItem} onSelect={chooseProduct} /></div>
        <div className="shopping-items">
          {active.items.map((item) => <button type="button" className={`shopping-row ${item.checked ? 'checked' : ''}`} key={item.id} onClick={() => toggleShoppingItem(active.id, item.id)}>
            <span className="check-circle">{item.checked && <IonIcon icon={checkmarkOutline} />}</span>
            <span><strong>{item.name}</strong><small>{item.quantity} {item.unit} · added by {item.addedBy.deviceName}</small></span>
            <em>{item.estimatedPrice ? `≈ LKR ${item.estimatedPrice.toLocaleString()}` : '—'}</em>
          </button>)}
          {active.items.length === 0 && <div className="empty-state">{t('emptyList')}</div>}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">BASED ON HOME STOCK</span><h2><IonIcon icon={sparklesOutline} /> Smart suggestions</h2></div></div>
        <div className="suggestion-grid">
          {recommendations.map((item) => {
            const added = active.items.some((entry) => entry.name.toLowerCase() === item.name.toLowerCase())
            return <article className="suggestion-card" key={item.id}><div><strong>{item.name}</strong><small>{item.quantity <= item.minimumQuantity ? 'Running low' : 'Replace expired item'}</small></div><button disabled={added} type="button" onClick={() => addShoppingItem(active.id, item.name, 'low-stock')}>{added ? 'Added' : '+ Add'}</button></article>
          })}
        </div>
      </section>
    </>}
  </main>
}
