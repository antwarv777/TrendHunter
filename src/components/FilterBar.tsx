import { useState } from 'react'

export interface Filters {
  query: string
  price: 'all' | 99 | 199 | 299
  time: 'all' | 'fast'
  difficulty: 'all' | 'easy'
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
}

const priceOptions: { id: Filters['price']; label: string }[] = [
  { id: 'all', label: 'Все цены' },
  { id: 99, label: '99 ₽' },
  { id: 199, label: '199 ₽' },
  { id: 299, label: '299 ₽' },
]

export function FilterBar({ filters, onChange }: Props) {
  const [showFilters, setShowFilters] = useState(false)

  const togglePrice = (p: Filters['price']) =>
    onChange({ ...filters, price: filters.price === p && p !== 'all' ? 'all' : p })

  return (
    <div className="filters">
      <input
        className="input"
        placeholder="Поиск тренда…"
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
      />
      <div className="chips-row">
        <button
          className={`chip-btn ${filters.time === 'fast' ? 'chip-btn-active' : ''}`}
          onClick={() => onChange({ ...filters, time: filters.time === 'fast' ? 'all' : 'fast' })}
        >
          До 2 часов
        </button>
        <button
          className={`chip-btn ${filters.difficulty === 'easy' ? 'chip-btn-active' : ''}`}
          onClick={() => onChange({ ...filters, difficulty: filters.difficulty === 'easy' ? 'all' : 'easy' })}
        >
          Для новичка
        </button>
        <button className="chip-btn" onClick={() => setShowFilters(!showFilters)}>
          Цена ▾
        </button>
      </div>
      {showFilters && (
        <div className="chips-row">
          {priceOptions.map((p) => (
            <button
              key={String(p.id)}
              className={`chip-btn ${filters.price === p.id ? 'chip-btn-active' : ''}`}
              onClick={() => togglePrice(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
