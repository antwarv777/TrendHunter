import type { Trend } from '../types'
import { useAccess } from '../hooks/useAccess'

interface Props {
  trend: Trend
  onOpen: (t: Trend) => void
  onBuy: (t: Trend) => void
  hasAccess: ReturnType<typeof useAccess>['hasAccess']
}

const diffLabels: Record<number, string> = { 1: 'Очень просто', 2: 'Просто', 3: 'Средне', 4: 'Сложно', 5: 'Очень сложно' }

export function TrendCard({ trend, onOpen, onBuy, hasAccess }: Props) {
  const badges: string[] = []
  if (trend.difficulty <= 2) badges.push('Для новичка')
  if (trend.timeToLaunch === 'До 2 часов') badges.push('До 2 часов')
  if (!trend.tools.some((t) => t.toLowerCase().includes('canva') && t.includes('плат'))) badges.push('Без вложений')
  if (hasAccess(trend) && !trend.isFree) badges.push('✓ Куплено')

  return (
    <div className="card" onClick={() => onOpen(trend)}>
      <div className="card-top">
        <span className="chip">{trend.category}</span>
        <span className="price-tag">{trend.recommendedPrice} ₽</span>
      </div>
      <h3 className="card-title">{trend.title}</h3>
      <p className="card-desc">{trend.shortDescription}</p>
      <div className="badges">
        {badges.map((b) => (
          <span key={b} className={`badge ${b.startsWith('✓') ? 'badge-ok' : ''}`}>{b}</span>
        ))}
        <span className="badge">{diffLabels[trend.difficulty]}</span>
      </div>
      <button
        className="btn btn-primary"
        onClick={(e) => {
          e.stopPropagation()
          hasAccess(trend) ? onOpen(trend) : onBuy(trend)
        }}
      >
        {trend.isFree ? 'Открыть бесплатно' : hasAccess(trend) ? 'Открыть инструкцию' : `Купить за ${trend.recommendedPrice} ₽`}
      </button>
    </div>
  )
}
