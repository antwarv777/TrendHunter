import type { Trend } from '../types'
import type { useAccess } from '../hooks/useAccess'

interface Props {
  trend: Trend
  onBack: () => void
  onBuy: (t: Trend) => void
  hasAccess: ReturnType<typeof useAccess>['hasAccess']
}

export function TrendScreen({ trend, onBack, onBuy, hasAccess }: Props) {
  const unlocked = hasAccess(trend)

  return (
    <div>
      <button className="btn btn-ghost" onClick={onBack}>← Назад</button>
      <span className="chip">{trend.category}</span>
      <h1 className="screen-title">{trend.title}</h1>
      <p className="screen-sub">{trend.shortDescription}</p>

      <div className="info-grid">
        <div className="info-item"><b>Время на запуск</b>{trend.timeToLaunch}</div>
        <div className="info-item"><b>Цена продажи</b>{trend.recommendedPrice} ₽</div>
        <div className="info-item"><b>Доход (прогноз)</b>{trend.potentialIncome}</div>
      </div>

      <h2 className="section-title">Инструменты</h2>
      <div className="badges">{trend.tools.map((t) => <span key={t} className="badge">{t}</span>)}</div>

      <h2 className="section-title">Где продавать</h2>
      <div className="badges">{trend.salesChannels.map((t) => <span key={t} className="badge">{t}</span>)}</div>

      <h2 className="section-title">{trend.guideTitle}</h2>
      <p>{trend.guidePreview}</p>

      {unlocked ? (
        <div className="guide">
          {trend.guideContent.map((step) => (
            <p key={step} className="guide-step">{step}</p>
          ))}
        </div>
      ) : (
        <div className="paywall-box">
          <p>🔒 Инструкция закрыта. Полное руководство из {trend.guideContent.length} шагов — за {trend.recommendedPrice} ₽.</p>
          <button className="btn btn-primary" onClick={() => onBuy(trend)}>
            Купить инструкцию за {trend.recommendedPrice} ₽
          </button>
        </div>
      )}
    </div>
  )
}
