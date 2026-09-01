import { useState } from 'react'
import { trends } from '../data/trends'

interface Props {
  allAccess: boolean
  onBuyTrend: (id: string, price: number) => void
  onBuyAll: () => void
}

// Мок-оплата. Никаких реальных списаний — просто имитация процесса.
export function PaywallScreen({ allAccess, onBuyTrend, onBuyAll }: Props) {
  const [processing, setProcessing] = useState<string | null>(null)

  const pay = (id: string, price: number, done: () => void) => {
    setProcessing(id)
    setTimeout(() => {
      alert(`Мок-оплата ${price} ₽ прошла успешно. Доступ открыт. (Реальная оплата появится позже.)`)
      done()
      setProcessing(null)
    }, 800)
  }

  return (
    <div>
      <h1 className="screen-title">Доступ</h1>
      <p className="screen-sub">Оплата — заглушка для MVP. Никаких реальных списаний.</p>

      <div className="card">
        <h3 className="card-title">Доступ ко всем трендам</h3>
        <p className="card-desc">Все инструкции, текущие и будущие, без ограничений.</p>
        {allAccess ? (
          <p className="all-access-ok">✓ Активен</p>
        ) : (
          <button
            className="btn btn-primary"
            disabled={processing !== null}
            onClick={() => pay('all', 499, onBuyAll)}
          >
            {processing === 'all' ? 'Оплата…' : 'Купить за 499 ₽'}
          </button>
        )}
      </div>

      <h2 className="section-title">Или отдельные инструкции</h2>
      <div className="card-list">
        {trends.filter((t) => !t.isFree).map((t) => (
          <div key={t.id} className="card">
            <div className="card-top">
              <span className="chip">{t.category}</span>
              <span className="price-tag">{t.recommendedPrice} ₽</span>
            </div>
            <h3 className="card-title">{t.title}</h3>
            <button
              className="btn btn-primary"
              disabled={processing !== null}
              onClick={() => pay(t.id, t.recommendedPrice, () => onBuyTrend(t.id, t.recommendedPrice))}
            >
              {processing === t.id ? 'Оплата…' : 'Оплатить'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
