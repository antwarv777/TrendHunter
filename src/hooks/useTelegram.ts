import { useEffect, useState } from 'react'

// Минимальная обёртка над Telegram WebApp. В браузере просто возвращает null.
interface TgWebApp {
  ready: () => void
  expand: () => void
  setHeaderColor?: (c: string) => void
  setBackgroundColor?: (c: string) => void
}

export function useTelegram() {
  const [tg, setTg] = useState<TgWebApp | null>(null)

  useEffect(() => {
    const w = window as unknown as { Telegram?: { WebApp?: TgWebApp } }
    const webApp = w.Telegram?.WebApp
    if (webApp) {
      webApp.ready()
      webApp.expand()
      webApp.setHeaderColor?.('#0f1115')
      webApp.setBackgroundColor?.('#0f1115')
      setTg(webApp)
    }
  }, [])

  return tg
}
