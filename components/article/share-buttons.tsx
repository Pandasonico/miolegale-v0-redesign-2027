'use client'

import { useState } from 'react'
import { Check, Link2, Mail, Share2 } from 'lucide-react'

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // L'utente ha chiuso il pannello di condivisione.
      }
      return
    }
    await copy()
  }

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const button =
    'flex size-9 items-center justify-center rounded-md border border-ink-foreground/20 text-ink-foreground/85 hover:border-ink-foreground/50 hover:text-ink-foreground'

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={share} className={button}>
        <Share2 className="size-4" aria-hidden />
        <span className="sr-only">Condividi</span>
      </button>
      <button type="button" onClick={copy} className={button}>
        {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        <span className="sr-only">{copied ? 'Link copiato' : 'Copia link'}</span>
      </button>
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} className={button}>
        <Mail className="size-4" aria-hidden />
        <span className="sr-only">Invia per email</span>
      </a>
      <span role="status" className="sr-only">
        {copied ? 'Link copiato negli appunti' : ''}
      </span>
    </div>
  )
}
