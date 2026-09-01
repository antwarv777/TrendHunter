import { useState } from 'react'
import { generateIdeas } from '../lib/generator'
import type { GeneratedIdea } from '../types'

export function GeneratorScreen() {
  const [niche, setNiche] = useState('')
  const [ideas, setIdeas] = useState<GeneratedIdea[] | null>(null)
  const [loading, setLoading] = useState(false)

  const generate = () => {
    setLoading(true)
    // Небольшая задержка для UX — имитация генерации
    setTimeout(() => {
      setIdeas(generateIdeas(niche))
      setLoading(false)
    }, 500)
  }

  return (
    <div>
      <h1 className="screen-title">Генератор идей</h1>
      <p className="screen-sub">Введите нишу — например: психология, вязание, ремонт, Excel, дети, авто</p>
      <input
        className="input"
        placeholder="Ваша ниша…"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && generate()}
      />
      <button className="btn btn-primary" onClick={generate} disabled={loading}>
        {loading ? 'Генерирую…' : 'Сгенерировать идеи'}
      </button>

      {ideas && (
        <div className="card-list">
          {ideas.map((idea, i) => (
            <div key={i} className="card">
              <div className="card-top">
                <span className="chip">Идея {i + 1}</span>
                <span className="price-tag">{idea.price} ₽</span>
              </div>
              <h3 className="card-title">{idea.title}</h3>
              <p className="card-desc">{idea.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
