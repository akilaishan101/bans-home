import { IonIcon } from '@ionic/react'
import { archiveOutline, checkmarkCircleOutline, locationOutline, trashOutline } from 'ionicons/icons'
import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../types'
import { expiryDateLabel, expiryLabel, getExpiryLevel } from '../utils/expiry'

interface Props {
  item: InventoryItem
  onStatus: (status: InventoryItem['status']) => void
}

export function ItemCard({ item, onStatus }: Props) {
  const { t } = useTranslation()
  const level = getExpiryLevel(item)
  return <article className={`item-card expiry-${level}`}>
    <div className="item-card-main">
      <div className="category-icon"><IonIcon icon={archiveOutline} /></div>
      <div className="item-copy">
        <div className="item-title-line"><h3>{item.name}</h3><span className={`status-pill ${level}`}>{expiryLabel(item)}</span></div>
        <p>{item.quantity} {item.unit} · <IonIcon icon={locationOutline} /> {item.storage}</p>
        <small>LKR {item.purchasePrice.toLocaleString()} · {expiryDateLabel(item)}</small>
      </div>
    </div>
    <div className="item-actions">
      <span>Edited by {item.updated.deviceName}</span>
      <div>
        <button type="button" className="text-button" onClick={() => onStatus('consumed')}><IonIcon icon={checkmarkCircleOutline} /> {t('markUsed')}</button>
        <button type="button" className="text-button danger" onClick={() => onStatus('wasted')}><IonIcon icon={trashOutline} /> {t('markWasted')}</button>
      </div>
    </div>
  </article>
}
