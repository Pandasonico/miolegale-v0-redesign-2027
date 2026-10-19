import Link from 'next/link'
import { Search, Sparkles } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { PostRow, SectionBlock } from '@/components/content/post-list'
import { ToolsGrid } from '@/components/tools/tools-grid'
import { MATERIE } from '@/lib/site'
import { getCategories, getPosts } from '@/lib/wp'

const AI_PROMPTS = [
  'Quali sono i termini per impugnare una sentenza civile?',
  'Quando scatta la responsabilità del condominio per infiltrazioni?',
  'Differenza tra licenziamento per giusta causa e giustificato motivo',
]

export default async function HomePage() {
  const [categories, massime, sentenze, norme, notizie, brocardi] = await Promise.all([
    getCategories(),
    getPosts({ categorySlug: 'massime', perPage: 5 }),
    getPosts({ categorySlug: 'sentenze', perPage: 4 }),
    getPosts({ categorySlug: 'norme', perPage: 4 }),
    getPosts({ categorySlug: 'notizie', perPage: 6 }),
    getPosts({ categorySlug: 'brocardi', perPage: 1 }),
  ])

  const count = (slug: string) => categories.find((c) => c.slug === slug)?.count ?? 0
  const stats = [
    { label: 'Massime', value: count('massime') },
    { label: 'Sentenze', value: count('sentenze') },
    { label: 'Norme', value: count('norme') },
    { label: 'Brocardi', value: count('brocardi') },
  ]
  const brocardo = brocardi.posts[0]

  return (
    <>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.4fr_1fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Banca dati giuridica gratuita</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-balance md:text-5xl">
              Il diritto italiano, consultabile in un attimo.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-foreground/75">
              Massime, sentenze e norme aggiornate, calcolatori legali e un assistente AI che cita le fonti.
            </p>

            <form action="/cerca" className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row" role="search">
              <label htmlFor="hero-search" className="sr-only">
                Cerca nella banca dati
              </label>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input
                  id="hero-search"
                  name="q"
                  type="search"
                  required
                  placeholder="Es. usucapione, art. 2051 c.c., licenziamento…"
                  className="h-12 w-full rounded-md bg-card pl-12 pr-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <button type="submit" className="h-12 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:bg-accent/90">
                Cerca
              </button>
            </form>

            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-ink-foreground/60">{s.label}</dt>
                  <dd className="mt-1 font-serif text-3xl font-semibold tabular-nums">
                    {s.value ? s.value.toLocaleString('it-IT') : '—'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-ink-foreground/15 bg-ink-foreground/5 p-6">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="size-5" aria-hidden />
              <p className="text-sm font-semibold uppercase tracking-wider">Assistente AI</p>
            </div>
            <p className="mt-3 font-serif text-2xl font-semibold leading-snug">Chiedi in linguaggio naturale.</p>
            <p className="mt-2 text-sm text-ink-foreground/70">
              Risposte basate sui contenuti della banca dati, con link alle fonti.
            </p>
            <ul className="mt-5 space-y-2">
              {AI_PROMPTS.map((p) => (
                <li key={p}>
                  <Link
                    href={`/assistente-ai?q=${encodeURIComponent(p)}`}
                    className="block rounded-md bg-ink-foreground/10 px-4 py-3 text-sm hover:bg-ink-foreground/15"
                  >
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-8">
        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_HOME_TOP} />
      </div>

      <section aria-labelledby="tools-title" className="mx-auto max-w-7xl px-4 pt-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 id="tools-title" className="font-serif text-3xl font-semibold">
              Calcolatori e strumenti
            </h2>
            <p className="mt-1 text-muted-foreground">Gratuiti, aggiornati e pronti per lo studio legale.</p>
          </div>
          <Link href="/calcolatori" className="hidden text-sm font-medium text-primary hover:underline sm:block">
            Tutti gli strumenti
          </Link>
        </div>
        <ToolsGrid />
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-12 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <SectionBlock title="Ultime massime" href="/massime" posts={massime.posts} description="Principi di diritto dalla giurisprudenza." />
          <AdSlot variant="in-feed" slot={process.env.NEXT_PUBLIC_AD_SLOT_HOME_FEED} />
          <div className="grid gap-8 md:grid-cols-2">
            <SectionBlock title="Sentenze" href="/sentenze" posts={sentenze.posts} />
            <SectionBlock title="Norme" href="/norme" posts={norme.posts} />
          </div>
        </div>

        <aside className="flex flex-col gap-8" aria-label="Barra laterale">
          <AdSlot variant="rectangle" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} />
          <section aria-labelledby="news-title" className="rounded-lg border border-border bg-card p-5">
            <h2 id="news-title" className="font-serif text-xl font-semibold">
              Notizie giuridiche
            </h2>
            <div className="divide-y divide-border">
              {notizie.posts.map((p) => (
                <PostRow key={p.id} post={p} showExcerpt={false} />
              ))}
            </div>
            <Link href="/notizie" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
              Tutte le notizie
            </Link>
          </section>
          {brocardo && (
            <Link href={brocardo.href} className="block rounded-lg bg-accent p-5 text-accent-foreground hover:bg-accent/90">
              <p className="text-xs font-semibold uppercase tracking-wider">Brocardo del giorno</p>
              <p className="mt-2 font-serif text-2xl font-semibold italic">{brocardo.title}</p>
              <p className="mt-2 line-clamp-3 text-sm">{brocardo.excerpt}</p>
            </Link>
          )}
          <div className="sticky top-24">
            <AdSlot variant="skyscraper" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_STICKY} />
          </div>
        </aside>
      </div>

      <section aria-labelledby="materie-title" className="mx-auto max-w-7xl px-4 pt-14">
        <h2 id="materie-title" className="font-serif text-3xl font-semibold">
          Sfoglia per materia
        </h2>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {MATERIE.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/${m.slug}`}
                className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary"
              >
                {m.label}
                <span className="tabular-nums text-xs text-muted-foreground">{count(m.slug) || ''}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
