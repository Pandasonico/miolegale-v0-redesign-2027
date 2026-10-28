import Link from 'next/link'
import { ArrowRight, Landmark } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { ImageCard, PostRow, SectionBlock } from '@/components/content/post-list'
import { HomeTools } from '@/components/home/home-tools'
import { Omnibox } from '@/components/home/omnibox'
import { ConsulenzaBand } from '@/components/studio/consulenza-cta'
import { MATERIE, SOURCE_ARCHIVES } from '@/lib/site'
import { getCategories, getLongExcerpt, getPosts, getUtilityPages } from '@/lib/wp'

export default async function HomePage() {
  const [categories, massime, norme, notizie, guide, brocardi, utilities] = await Promise.all([
    getCategories(),
    getPosts({ categorySlug: 'massime', perPage: 9, withImages: true }),
    getPosts({ categorySlug: 'norme', perPage: 10, withImages: true }),
    getPosts({ categorySlug: 'notizie', perPage: 10, withImages: true }),
    getPosts({ categorySlug: 'guide', perPage: 4, withImages: true }),
    getPosts({ categorySlug: 'brocardi', perPage: 1 }),
    getUtilityPages(),
  ])

  const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date)
  const candidates = [...notizie.posts.slice(0, 5), ...massime.posts.slice(0, 4), ...norme.posts.slice(0, 4)]
    .filter((p, i, all) => all.findIndex((q) => q.id === p.id) === i)
    .sort(byDateDesc)
  const leadBase = candidates.find((p) => p.image) ?? candidates[0]
  const leadExcerpt = leadBase ? await getLongExcerpt(leadBase.href) : null
  const leadNews = leadBase && leadExcerpt ? { ...leadBase, excerpt: leadExcerpt } : leadBase
  const otherNews = candidates.filter((p) => p !== leadBase).slice(0, 4)
  const featuredIds = new Set([leadNews, ...otherNews].filter(Boolean).map((p) => p.id))
  const notFeatured = (p: { id: number }) => !featuredIds.has(p.id)

  const latestMassime = massime.posts.filter(notFeatured).slice(0, 5)
  const latestNorme = norme.posts.filter(notFeatured).slice(0, 6)
  const sideNews = notizie.posts.filter(notFeatured).slice(0, 5)

  const count = (slug: string) => categories.find((c) => c.slug === slug)?.count ?? 0
  const brocardo = brocardi.posts[0]

  return (
    <>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-site px-4 lg:px-8 pb-14 pt-14 text-center lg:pt-20">
          <h1 className="font-sans tracking-tight text-2xl font-semibold leading-tight text-balance md:whitespace-nowrap">
            Trova la norma, la sentenza o la risposta che ti serve.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-pretty text-ink-foreground/75 lg:max-w-none lg:whitespace-nowrap">
            La banca dati giuridica gratuita con massime, sentenze e norme, calcolatori legali e un Avvocato AI che cita le fonti.
          </p>
          <div className="mx-auto mt-8 max-w-[950px] text-left">
            <Omnibox />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-site px-4 lg:px-8 pt-6">
        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_HOME_TOP} />
      </div>

      <section aria-labelledby="fonti-title" className="mx-auto max-w-site px-4 lg:px-8 pt-10">
        <h2 id="fonti-title" className="font-sans tracking-tight text-3xl font-semibold">
          Fonti del diritto
        </h2>
        <p className="mt-1 text-muted-foreground">Testi vigenti consultabili articolo per articolo.</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {SOURCE_ARCHIVES.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/${a.slug}`}
                className="flex h-full flex-col gap-2 rounded-lg border border-border bg-card p-5 hover:border-primary"
              >
                <span className="flex items-center gap-2 font-sans tracking-tight text-xl font-semibold">
                  <Landmark className="size-5 text-primary" aria-hidden />
                  {a.label}
                </span>
                <span className="hidden text-sm leading-relaxed text-muted-foreground sm:block">{a.description}</span>
                <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-primary">
                  Consulta <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tools-title" className="mx-auto max-w-site px-4 lg:px-8 pt-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 id="tools-title" className="font-sans tracking-tight text-3xl font-semibold">
              Calcolatori e strumenti
            </h2>
            <p className="mt-1 text-muted-foreground">Gratuiti, aggiornati e pronti per lo studio legale.</p>
          </div>
          <div className="hidden items-center gap-5 text-base font-medium text-primary sm:flex">
            <Link href="/calcolo" className="hover:underline">
              Tutti i calcolatori
            </Link>
            <Link href="/utilita" className="hover:underline">
              Tutte le utilità
            </Link>
          </div>
        </div>
        <HomeTools utilities={utilities} />
      </section>

      <div className="mx-auto max-w-site px-4 lg:px-8 pt-12">
        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_HOME_MIDDLE} />
      </div>

      {leadNews && (
        <section aria-labelledby="featured-title" className="mx-auto max-w-site px-4 lg:px-8 pt-14">
          <div className="mb-6 flex items-end justify-between">
            <h2 id="featured-title" className="font-sans tracking-tight text-[28px] font-semibold">
              In primo piano
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ImageCard post={leadNews} featured titleSize="text-[23px]" />
            {otherNews.map((p, i) => (
              <ImageCard key={p.id} post={p} titleSize={i === 1 || i === 3 ? 'text-base' : undefined} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto grid max-w-site gap-8 px-4 lg:px-8 pt-12 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="flex flex-col gap-8">
          <SectionBlock title="Ultime massime" href="/massime" posts={latestMassime} description="Principi di diritto dalla giurisprudenza." />
          <AdSlot variant="in-feed" slot={process.env.NEXT_PUBLIC_AD_SLOT_HOME_FEED} />
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <SectionBlock title="Notizie giuridiche" href="/notizie" posts={sideNews} />
            </div>
            <div className="flex flex-col">
              <AdSlot variant="rectangle" fill slot={process.env.NEXT_PUBLIC_AD_SLOT_HOME_FEED_SIDE} />
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-8" aria-label="Barra laterale">
          <AdSlot variant="rectangle" fill slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} />
          <section aria-labelledby="norme-side-title" className="rounded-lg border border-border bg-card p-5">
            <h2 id="norme-side-title" className="font-sans tracking-tight text-xl font-semibold">
              Norme
            </h2>
            <div className="divide-y divide-border">
              {latestNorme.map((p) => (
                <PostRow key={p.id} post={p} showExcerpt={false} />
              ))}
            </div>
            <Link href="/norme" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
              Tutte le norme
            </Link>
          </section>
          {brocardo && (
            <Link href={brocardo.href} className="block rounded-lg bg-accent p-5 text-accent-foreground hover:bg-accent/90">
              <p className="text-xs font-mono font-medium uppercase tracking-wider">Brocardo del giorno</p>
              <p className="mt-2 font-sans tracking-tight text-2xl font-semibold italic">{brocardo.title}</p>
              <p className="mt-2 line-clamp-3 text-sm">{brocardo.excerpt}</p>
            </Link>
          )}
        </aside>
      </div>

      {guide.posts.length > 0 && (
        <section aria-labelledby="guide-title" className="mx-auto max-w-site px-4 lg:px-8 pt-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 id="guide-title" className="font-sans tracking-tight text-3xl font-semibold">
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

      <ConsulenzaBand />

      <section aria-labelledby="materie-title" className="mx-auto max-w-site px-4 lg:px-8 pt-14">
        <h2 id="materie-title" className="font-sans tracking-tight text-3xl font-semibold">
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
