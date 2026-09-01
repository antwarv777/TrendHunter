import type { GeneratedIdea, Price } from '../types'

// Локальный генератор: комбинирует шаблоны под введённую нишу. Без AI API.
const formats: { type: string; desc: string; price: Price }[] = [
  { type: 'Чек-лист', desc: 'Практичный чек-лист из 20–30 пунктов, который экономит время и убирает ошибки.', price: 99 },
  { type: 'Шаблоны', desc: 'Пакет готовых шаблонов и текстов, которые можно сразу копировать и использовать.', price: 199 },
  { type: 'Мини-гайд', desc: 'Пошаговая инструкция на 10–15 страниц: как сделать X без опыта и ошибок.', price: 199 },
  { type: 'Подборка', desc: 'Каталог лучших инструментов, ресурсов и приёмов по теме с комментариями.', price: 99 },
  { type: 'Таблица-трекер', desc: 'Готовая таблица для учёта и планирования, которую можно вести каждый день.', price: 199 },
  { type: 'Каталог идей', desc: '30 идей и решений по теме с разбором: что, кому и за сколько продавать.', price: 299 },
]

const audiences = ['новичков', 'занятых людей', 'фрилансеров', 'малого бизнеса', 'студентов']

export function generateIdeas(nicheRaw: string): GeneratedIdea[] {
  const niche = nicheRaw.trim()
  if (!niche) return []

  // Сдвиг, чтобы один и тот же запрос давал один результат, но разные запросы — разные идеи
  const shift = niche.length % formats.length
  const audience = audiences[niche.length % audiences.length]

  return [0, 1, 2].map((i) => {
    const f = formats[(shift + i) % formats.length]
    return {
      title: `${f.type} по теме «${niche}» для ${audience}`,
      description: `${f.desc} Тема: ${niche}. Аудитория: ${audience}. Ориентир цены: ${f.price} ₽.`,
      price: f.price,
    }
  })
}
