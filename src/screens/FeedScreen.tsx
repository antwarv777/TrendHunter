import { useState } from 'react'
import type { Trend } from '../types'
import { FilterBar, type Filters } from '../components/FilterBar'
import { TrendCard } from '../components/TrendCard'
import { trends } from '../data/trends'
import type { useAccess } from '../hooks/useAccess'

interface Props {
  onOpen: (t: Trend) => void
  onBuy: (t: Trend) => void
  hasAccess: ReturnType<typeof useAccess>['hasAccess']
}

const initial: Filters = { query: '', price: 'all', time: 'all', difficulty: 'all' }

export function FeedScreen({ onOpen, onBuy, hasAccess }: Props) {
  const [filters, setFilters] = useState<Filters>(initial)

  const filtered = trends.filter((t) => {
    if (filters.price !== 'all' && t.recommendedPrice !== filters.price) return false
    if (filters.time === 'fast' && t.timeToLaunch !== 'До 2 часов') return false
    if (filters.difficulty === 'easy' && t.difficulty > 2) return false
    const q = filters.query.toLowerCase()
    if (q && !(`${t.title} ${t.shortDescription} ${t.tags.join(' ')}`.toLowerCase().includes(q))) return false
    return true
  })

  return (
    <div>
      <h1 className="screen-title">Охотник за трендами</h1>
      <p className="screen-sub">Идеи цифровых микропродуктов, которые можно сделать дома за 99–299 ₽</p>
      <FilterBar filters={filters} onChange={setFilters} />
      {filtered.length === 0 ? (
        <p className="empty">Ничего не нашлось. Сбросьте фильтры.</p>
      ) : (
        <div className="card-list">
          {filtered.map((t) => (
            <TrendCard key={t.id} trend={t} onOpen={onOpen} onBuy={onBuy} hasAccess={hasAccess} />
          ))}
        </div>
      )}
      <button className="btn btn-ghost" onClick={() => setFilters(initial)}>Сбросить фильтры</button>
    </div>
  )
}
