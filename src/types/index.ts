export type Price = 99 | 199 | 299

export interface Trend {
  id: string
  title: string
  shortDescription: string
  category: string
  difficulty: 1 | 2 | 3 | 4 | 5
  timeToLaunch: string // «До 2 часов», «До 1 дня»
  recommendedPrice: Price
  potentialIncome: string // прогноз, без гарантий
  tools: string[]
  salesChannels: string[]
  isFree: boolean
  guideTitle: string
  guidePreview: string
  guideContent: string[]
  tags: string[]
}

export interface GeneratedIdea {
  title: string
  description: string
  price: Price
}
