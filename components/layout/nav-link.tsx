'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function NavLink({
  href,
  className,
  activeClassName,
  exact = false,
  children,
}: {
  href: string
  className?: string
  activeClassName?: string
  exact?: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={cn(className, active && activeClassName)}>
      {children}
    </Link>
  )
}
