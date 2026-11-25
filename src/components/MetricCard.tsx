import { IonIcon } from '@ionic/react'

interface Props {
  icon: string
  label: string
  value: string | number
  tone?: 'green' | 'amber' | 'red' | 'blue'
  onClick?: () => void
}

export function MetricCard({ icon, label, value, tone = 'green', onClick }: Props) {
  return <button className={`metric-card metric-${tone}`} type="button" onClick={onClick}>
    <span className="metric-icon"><IonIcon icon={icon} /></span>
    <span><strong>{value}</strong><small>{label}</small></span>
  </button>
}
