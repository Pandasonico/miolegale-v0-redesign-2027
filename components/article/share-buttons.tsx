'use client'

import { useState, type ComponentType } from 'react'
import { Check, Link2, Mail, Printer } from 'lucide-react'
import { FaFacebookF, FaLinkedinIn, FaRedditAlien, FaTelegram, FaWhatsapp, FaXTwitter } from 'react-icons/fa6'

type Network = { label: string; href: string; icon: ComponentType<{ className?: string }>; color: string }

function networks(url: string, title: string): Network[] {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  return [
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}`, icon: FaWhatsapp, color: '#25D366' },
    { label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${t}`, icon: FaTelegram, color: '#229ED9' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: FaLinkedinIn, color: '#0A66C2' },
    { label: 'X', href: `https://x.com/intent/post?url=${u}&text=${t}`, icon: FaXTwitter, color: '#000000' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: FaFacebookF, color: '#1877F2' },
    { label: 'Reddit', href: `https://www.reddit.com/submit?url=${u}&title=${t}`, icon: FaRedditAlien, color: '#FF4500' },
  ]
}

export function ShareButtons({ url, title, tone = 'dark' }: { url: string; title: string; tone?: 'dark' | 'light' }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isLight = tone === 'light'
  const button = isLight
    ? 'flex size-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-foreground/40'
    : 'flex size-9 items-center justify-center rounded-md border border-ink-foreground/20 text-ink-foreground/85 transition-colors hover:border-ink-foreground/50 hover:text-ink-foreground'
  const icon = isLight ? 'size-[18px]' : 'size-4'

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button type="button" onClick={() => window.print()} className={button} title="Stampa">
        <Printer className={icon} aria-hidden />
        <span className="sr-only">Stampa</span>
      </button>
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} className={button} title="Email">
        <Mail className={icon} aria-hidden />
        <span className="sr-only">Invia per email</span>
      </a>
      {networks(url, title).map(({ label, href, icon: Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={button}
          title={label}
          style={isLight && label !== 'X' ? { color } : undefined}
        >
          <Icon className={icon} />
          <span className="sr-only">Condividi su {label} (si apre in una nuova scheda)</span>
        </a>
      ))}
      <button type="button" onClick={copy} className={button} title="Copia link">
        {copied ? <Check className={icon} aria-hidden /> : <Link2 className={icon} aria-hidden />}
        <span className="sr-only">{copied ? 'Link copiato' : 'Copia link'}</span>
      </button>
      <span role="status" className="sr-only">
        {copied ? 'Link copiato negli appunti' : ''}
      </span>
    </div>
  )
}
