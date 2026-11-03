'use client'

type GoogleFc = {
  showRevocationMessage?: () => void
  callbackQueue?: Array<() => void>
}

export function CookieConsentLink({ className }: { className?: string }) {
  return (
    <a
      href="#"
      className={className}
      onClick={(event) => {
        event.preventDefault()
        const googlefc = (window as unknown as { googlefc?: GoogleFc }).googlefc
        if (googlefc && typeof googlefc.showRevocationMessage === 'function') {
          googlefc.callbackQueue?.push(googlefc.showRevocationMessage)
        }
      }}
    >
      Consenso cookie
    </a>
  )
}
