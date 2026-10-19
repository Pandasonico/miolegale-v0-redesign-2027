import { BookOpen, Calculator, Home, Newspaper, Sparkles } from 'lucide-react'
import { NavLink } from './nav-link'

const TABS = [
  { href: '/', label: 'Home', icon: Home, exact: true },
  { href: '/banca-dati', label: 'Banca dati', icon: BookOpen },
  { href: '/assistente-ai', label: 'AI', icon: Sparkles },
  { href: '/calcolatori', label: 'Calcolatori', icon: Calculator },
  { href: '/notizie', label: 'Notizie', icon: Newspaper },
]

export function MobileTabBar() {
  return (
    <nav
      aria-label="Navigazione rapida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ href, label, icon: Icon, exact }) => (
          <li key={href}>
            <NavLink
              href={href}
              exact={exact}
              className="flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground"
              activeClassName="text-primary"
            >
              <Icon className="size-5" aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
