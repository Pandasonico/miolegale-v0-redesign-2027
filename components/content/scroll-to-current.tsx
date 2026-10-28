'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export function ScrollToCurrentList({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = ref.current
    const current = list?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!list || !current) return
    list.scrollTop = current.offsetTop - list.offsetTop - list.clientHeight / 2 + current.offsetHeight / 2
  }, [])

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  )
}
