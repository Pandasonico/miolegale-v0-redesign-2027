'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'

export function AiFab() {
  const pathname = usePathname()
  if (pathname?.startsWith('/assistente-ai')) return null

  return (
    <Link
      href="/assistente-ai"
      className="fixed bottom-6 right-5 z-40 hidden items-center gap-2 rounded-full bg-primary py-3 pl-4 pr-5 text-sm font-semibold text-primary-foreground shadow-lg ring-1 ring-primary-foreground/15 transition-transform hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:flex print:hidden"
    >
      <Sparkles className="size-5" aria-hidden />
      Avvocato AI
    </Link>
  )
}
