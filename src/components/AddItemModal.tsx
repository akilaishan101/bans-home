import { useMemo, useState } from 'react'
import { IonButton, IonContent, IonInput, IonModal, IonSelect, IonSelectOption } from '@ionic/react'
import { useTranslation } from 'react-i18next'
import { formatISO } from 'date-fns'
import type { NewInventoryItem } from '../types'
import type { CatalogueProduct } from '../data/productCatalogue'
import { ProductSuggestions } from './ProductSuggestions'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (item: NewInventoryItem) => void
}

const today = formatISO(new Date(), { representation: 'date' })

export function AddItemModal({ open, onClose, onAdd }: Props) {
  const { t } = useTranslation()
  const defaults = useMemo<NewInventoryItem>(() => ({
    name: '', category: 'Food', quantity: 1, unit: 'item', storage: 'Pantry', purchaseDate: today,
    purchasePrice: 0, expiryDate: '', lifetimeDays: undefined, afterOpenDays: undefined, minimumQuantity: 1,
  }), [])
  const [form, setForm] = useState<NewInventoryItem>(defaults)

  const selectProduct = (product: CatalogueProduct) => setForm((current) => ({
    ...current,
    name: product.name,
    purchasePrice: product.estimatedPrice,
    category: product.category,
    unit: product.unit,
  }))

  const save = () => {
    if (!form.name.trim()) return
    onAdd({ ...form, name: form.name.trim(), expiryDate: form.expiryDate || undefined })
    setForm(defaults)
    onClose()
  }

  return <IonModal className="add-item-modal" isOpen={open} onDidDismiss={onClose} initialBreakpoint={0.92} breakpoints={[0, 0.92, 1]} expandToScroll={false}>
    <IonContent className="sheet-content" scrollY>
    <div className="sheet">
      <div className="sheet-handle" />
      <div className="sheet-header"><div><small>BANS HOME</small><h2>{t('addItem')}</h2></div><button type="button" className="close-button" onClick={onClose}>×</button></div>
      <div className="form-grid">
        <div className="span-2 product-name-field form-field"><label>Item name</label><IonInput aria-label="Item name" value={form.name} placeholder="Type a product name" onIonInput={(e) => setForm({ ...form, name: String(e.detail.value ?? '') })} /><ProductSuggestions query={form.name} onSelect={selectProduct} /><small className="field-help">Suggestions and starting prices come from supermarket websites. Check the receipt price before saving.</small></div>
        <label>Quantity<IonInput type="number" value={form.quantity} onIonInput={(e) => setForm({ ...form, quantity: Number(e.detail.value) || 0 })} /></label>
        <label>Unit<IonSelect value={form.unit} onIonChange={(e) => setForm({ ...form, unit: e.detail.value })}><IonSelectOption value="item">item</IonSelectOption><IonSelectOption value="kg">kg</IonSelectOption><IonSelectOption value="g">g</IonSelectOption><IonSelectOption value="litre">litre</IonSelectOption><IonSelectOption value="packet">packet</IonSelectOption></IonSelect></label>
        <label>Category<IonSelect value={form.category} onIonChange={(e) => setForm({ ...form, category: e.detail.value })}><IonSelectOption value="Food">Food</IonSelectOption><IonSelectOption value="Dairy">Dairy</IonSelectOption><IonSelectOption value="Grains">Grains</IonSelectOption><IonSelectOption value="Household">Household</IonSelectOption><IonSelectOption value="Medicine">Medicine</IonSelectOption></IonSelect></label>
        <label>Storage<IonSelect value={form.storage} onIonChange={(e) => setForm({ ...form, storage: e.detail.value })}><IonSelectOption value="Pantry">Pantry</IonSelectOption><IonSelectOption value="Fridge">Fridge</IonSelectOption><IonSelectOption value="Freezer">Freezer</IonSelectOption><IonSelectOption value="Other">Other</IonSelectOption></IonSelect></label>
        <label>Purchase date<IonInput type="date" value={form.purchaseDate} onIonInput={(e) => setForm({ ...form, purchaseDate: String(e.detail.value) })} /></label>
        <label>Expiry date<IonInput type="date" value={form.expiryDate} onIonInput={(e) => setForm({ ...form, expiryDate: String(e.detail.value ?? '') })} /></label>
        <label>Price paid / estimate (LKR)<IonInput type="number" value={form.purchasePrice} onIonInput={(e) => setForm({ ...form, purchasePrice: Number(e.detail.value) || 0 })} /></label>
        <label>Lifetime in days<IonInput type="number" placeholder="If no printed expiry" value={form.lifetimeDays} onIonInput={(e) => setForm({ ...form, lifetimeDays: Number(e.detail.value) || undefined })} /></label>
        <label>Use within days after opening<IonInput type="number" value={form.afterOpenDays} onIonInput={(e) => setForm({ ...form, afterOpenDays: Number(e.detail.value) || undefined })} /></label>
      </div>
      <IonButton expand="block" size="large" onClick={save}>{t('addItem')}</IonButton>
    </div>
    </IonContent>
  </IonModal>
}
