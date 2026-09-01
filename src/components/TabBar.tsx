export type Tab = 'feed' | 'generator' | 'paywall'

interface Props {
  active: Tab
  onChange: (t: Tab) => void
}

const items: { id: Tab; label: string; icon: string }[] = [
  { id: 'feed', label: 'Тренды', icon: '🔥' },
  { id: 'generator', label: 'Идеи', icon: '💡' },
  { id: 'paywall', label: 'Доступ', icon: '⭐' },
]

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tabbar">
      {items.map((it) => (
        <button
          key={it.id}
          className={`tab ${active === it.id ? 'tab-active' : ''}`}
          onClick={() => onChange(it.id)}
        >
          <span className="tab-icon">{it.icon}</span>
          {it.label}
        </button>
      ))}
    </nav>
  )
}
