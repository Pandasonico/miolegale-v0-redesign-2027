import Link from 'next/link'
import { ArrowRight, Calculator, Landmark } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { ImageCard, PostRow, SectionBlock } from '@/components/content/post-list'
import { Omnibox } from '@/components/home/omnibox'
import { ToolsGrid } from '@/components/tools/tools-grid'
import { ARCHIVES, MATERIE, TOOLS } from '@/lib/site'
import { getCategories, getPosts } from '@/lib/wp'

export default async function HomePage() {
  const [categories, massime, sentenze, norme, notizie, guide, brocardi] = await Promise.all([
    getCategories(),
    getPosts({ categorySlug: 'massime', perPage: 5 }),
    getPosts({ categorySlug: 'sentenze', perPage: 4 }),
    getPosts({ categorySlug: 'norme', perPage: 4 }),
    getPosts({ categorySlug: 'notizie', perPage: 10, withImages: true }),
    getPosts({ categorySlug: 'guide', perPage: 4, withImages: true }),
    getPosts({ categorySlug: 'brocardi', perPage: 1 }),
  ])
  const [leadNews, ...otherNews] = notizie.posts
  const sideNews = otherNews.slice(4)

  const count = (slug: string) => categories.find((c) => c.slug === slug)?.count ?? 0
  const stats = [
    { label: 'Massime', slug: 'massime', value: count('massime') },
    { label: 'Sentenze', slug: 'sentenze', value: count('sentenze') },
    { label: 'Norme', slug: 'norme', value: count('norme') },
    { label: 'Brocardi', slug: 'brocardi', value: count('brocardi') },
  ]
  const brocardo = brocardi.posts[0]

  return (
    <>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center lg:pt-20">
          <h1 className="text-4xl font-semibold leading-tight text-balance md:text-5xl">
            Trova la norma, la sentenza o la risposta che ti serve.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-ink-foreground/75">
            La banca dati giuridica gratuita con massime, sentenze e norme, calcolatori legali e un Avvocato AI che cita le fonti.
          </p>
          <div className="mt-8 text-left">
            <Omnibox />
          </div>
        </div>

        <div className="border-t border-ink-foreground/10">
          <div className="mx-auto grid max-w-7xl gap-px px-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_1.6fr]">
            {stats.map((s) => (
              <Link
                key={s.label}
                href={`/${s.slug}`}
                className="group flex items-baseline justify-between gap-3 px-2 py-5 hover:bg-ink-foreground/5 lg:flex-col lg:items-start lg:justify-center lg:gap-1 lg:px-4"
              >
                <span className="text-3xl font-semibold tabular-nums">
                  {s.value ? s.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '—'}
                </span>
                <span className="flex items-center gap-1 text-sm text-ink-foreground/70 group-hover:text-ink-foreground">
                  {s.label} <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            ))}
            <div className="flex flex-col justify-center gap-2 px-2 py-5 lg:px-4">
              <span className="flex items-center gap-1.5 text-xs font-mono font-medium uppercase tracking-wide text-accent">
                <Calculator className="size-3.5" aria-hidden /> Calcolatori rapidi
              </span>
              <div className="flex flex-wrap gap-2">
                {TOOLS.slice(0, 4).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/calcolatori/${t.slug}`}
                    className="rounded-md bg-ink-foreground/10 px-3 py-1.5 text-sm font-medium hover:bg-ink-foreground/20"
                  >
                    {t.title}
                  </Link>
                ))}
                <Link href="/calcolatori" className="rounded-md px-3 py-1.5 text-sm font-medium text-accent hover:bg-ink-foreground/10">
                  +{TOOLS.length - 4} altri
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="fonti-title" className="mx-auto max-w-7xl px-4 pt-12">
        <h2 id="fonti-title" className="text-3xl font-semibold">
          Fonti del diritto
        </h2>
        <p className="mt-1 text-muted-foreground">Testi vigenti consultabili articolo per articolo.</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {ARCHIVES.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/${a.slug}`}
                className="flex h-full flex-col gap-2 rounded-lg border border-border bg-card p-5 hover:border-primary"
              >
                <span className="flex items-center gap-2 text-xl font-semibold">
                  <Landmark className="size-5 text-primary" aria-hidden />
                  {a.label}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{a.description}</span>
                <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-primary">
                  Consulta <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tools-title" className="mx-auto max-w-7xl px-4 pt-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 id="tools-title" className="text-3xl font-semibold">
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

      <div className="mx-auto max-w-7xl px-4 pt-12">
        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_HOME_TOP} />
      </div>

      {leadNews && (
        <section aria-labelledby="featured-title" className="mx-auto max-w-7xl px-4 pt-14">
          <div className="mb-6 flex items-end justify-between">
            <h2 id="featured-title" className="text-3xl font-semibold">
              In primo piano
            </h2>
            <Link href="/notizie" className="text-sm font-medium text-primary hover:underline">
              Tutte le notizie
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ImageCard post={leadNews} featured />
            <div className="grid gap-4 sm:grid-cols-2">
              {otherNews.slice(0, 4).map((p) => (
                <ImageCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

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
            <h2 id="news-title" className="text-xl font-semibold">
              Notizie giuridiche
            </h2>
            <div className="divide-y divide-border">
              {sideNews.map((p) => (
                <PostRow key={p.id} post={p} showExcerpt={false} />
              ))}
            </div>
            <Link href="/notizie" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
              Tutte le notizie
            </Link>
          </section>
          {brocardo && (
            <Link href={brocardo.href} className="block rounded-lg bg-accent p-5 text-accent-foreground hover:bg-accent/90">
              <p className="text-xs font-mono font-medium uppercase tracking-wide">Brocardo del giorno</p>
              <p className="mt-2 text-2xl font-semibold italic">{brocardo.title}</p>
              <p className="mt-2 line-clamp-3 text-sm">{brocardo.excerpt}</p>
            </Link>
          )}
          <div className="sticky top-24">
            <AdSlot variant="skyscraper" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_STICKY} />
          </div>
        </aside>
      </div>

      {guide.posts.length > 0 && (
        <section aria-labelledby="guide-title" className="mx-auto max-w-7xl px-4 pt-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 id="guide-title" className="text-3xl font-semibold">
                Guide pratiche
              </h2>
              <p className="mt-1 text-muted-foreground">Il diritto spiegato in modo chiaro, per cittadini e professionisti.</p>
            </div>
            <Link href="/guide" className="hidden text-sm font-medium text-primary hover:underline sm:block">
              Tutte le guide
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guide.posts.map((p) => (
              <ImageCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="materie-title" className="mx-auto max-w-7xl px-4 pt-14">
        <h2 id="materie-title" className="text-3xl font-semibold">
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
