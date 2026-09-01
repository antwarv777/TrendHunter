// Источник контента — trends.json (редактируется без правки кода).
// Для конвертации из TS-макета: node scripts/to-json.cjs (разовый).
import data from './trends.json'
import type { Trend } from '../types'

export const trends = data.trends as Trend[]

export const categories = [...new Set(trends.map((t) => t.category))]
