import { useState } from 'react'
import { TabBar, type Tab } from './components/TabBar'
import { FeedScreen } from './screens/FeedScreen'
import { TrendScreen } from './screens/TrendScreen'
import { GeneratorScreen } from './screens/GeneratorScreen'
import { PaywallScreen } from './screens/PaywallScreen'
import { useAccess } from './hooks/useAccess'
import { useTelegram } from './hooks/useTelegram'
import { trends } from './data/trends'
import type { Trend } from './types'

type View = { screen: 'main'; tab: Tab } | { screen: 'trend'; trendId: string }

export default function App() {
  useTelegram()
  const { hasAccess, buy, buyAll, allAccess } = useAccess()
  const [view, setView] = useState<View>({ screen: 'main', tab: 'feed' })

  const openTrend = (t: Trend) => setView({ screen: 'trend', trendId: t.id })

  // Покупка из карточки/детального экрана — сразу мок-оплата конкретного тренда
  const buyTrend = (t: Trend) => {
    if (confirm(`Мок-оплата: купить инструкцию «${t.title}» за ${t.recommendedPrice} ₽?`)) {
      buy(t.id)
      openTrend(t)
    }
  }

  let content: React.ReactNode
  if (view.screen === 'trend') {
    const trend = trends.find((t) => t.id === view.trendId)
    content = trend && (
      <TrendScreen trend={trend} onBack={() => setView({ screen: 'main', tab: 'feed' })} onBuy={buyTrend} hasAccess={hasAccess} />
    )
  } else if (view.tab === 'feed') {
    content = <FeedScreen onOpen={openTrend} onBuy={buyTrend} hasAccess={hasAccess} />
  } else if (view.tab === 'generator') {
    content = <GeneratorScreen />
  } else {
    content = <PaywallScreen allAccess={allAccess} onBuyTrend={buy} onBuyAll={buyAll} />
  }

  return (
    <div className="app">
      <main className="content">{content}</main>
      {view.screen === 'main' && <TabBar active={view.tab} onChange={(tab) => setView({ screen: 'main', tab })} />}
    </div>
  )
}
