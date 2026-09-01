import { useCallback, useEffect, useState } from 'react'
import type { Trend } from '../types'

const KEY = 'th_purchases_v1'
const ALL_KEY = 'th_all_access_v1'

function readSet(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[])
  } catch {
    return new Set()
  }
}

export function useAccess() {
  const [purchased, setPurchased] = useState<Set<string>>(new Set())
  const [allAccess, setAllAccess] = useState(false)

  useEffect(() => {
    setPurchased(readSet())
    setAllAccess(localStorage.getItem(ALL_KEY) === '1')
  }, [])

  const hasAccess = useCallback(
    (t: Trend) => t.isFree || allAccess || purchased.has(t.id),
    [purchased, allAccess],
  )

  const buy = useCallback((id: string) => {
    const next = readSet()
    next.add(id)
    localStorage.setItem(KEY, JSON.stringify([...next]))
    setPurchased(new Set(next))
  }, [])

  const buyAll = useCallback(() => {
    localStorage.setItem(ALL_KEY, '1')
    setAllAccess(true)
  }, [])

  return { hasAccess, buy, buyAll, allAccess }
}
