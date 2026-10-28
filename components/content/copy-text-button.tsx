'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyTextButton({ targetId, heading }: { targetId: string; heading: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    const node = document.getElementById(targetId)
    if (!node) return
    const body = [...node.querySelectorAll('p')].map((p) => p.innerText.trim()).join('\n')
    await navigator.clipboard.writeText(`${heading}\n\n${body}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-primary hover:bg-secondary print:hidden"
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      <span aria-live="polite">{copied ? 'Copiato' : 'Copia testo'}</span>
    </button>
  )
}
