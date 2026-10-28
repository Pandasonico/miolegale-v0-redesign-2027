import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronRight, ListTree } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { ArticleHelp } from '@/components/article/article-help'
import { BackToTop } from '@/components/article/back-to-top'
import { ShareButtons } from '@/components/article/share-buttons'
import { CopyTextButton } from '@/components/content/copy-text-button'
import { ListingSidebar } from '@/components/content/listing'
import { SITE } from '@/lib/site'
import type { ActArticle, ActLink } from '@/lib/act-article'

export function articleHeading(a: ActArticle) {
  return a.rubrica ? `${a.number} – ${a.rubrica}` : a.number
}

export function ActArticleView({ article, parent }: { article: ActArticle; parent: { href: string; label: string } }) {
  const heading = articleHeading(article)
  const url = `${SITE.url}/${article.path}/`
  const trail = article.trail.length ? article.trail : [parent, { href: article.act.href, label: article.act.title }]

  return (
    <>
      <header className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 lg:pb-12">
          <nav aria-label="Percorso" className="text-sm text-ink-foreground/70">
            <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
              <li>
                <Link href="/" className="hover:text-ink-foreground">
                  Home
                </Link>
              </li>
              {trail.map((t) => (
                <li key={t.href} className="flex items-center gap-1">
                  <ChevronRight className="size-3.5 shrink-0" aria-hidden />
                  <Link href={t.href} className="hover:text-ink-foreground">
                    {t.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-1">
                <ChevronRight className="size-3.5 shrink-0" aria-hidden />
                <span aria-current="page" className="text-ink-foreground">
                  {article.number.replace(/\s+(c\.c\.|c\.p\.|c\.p\.c\.|c\.p\.p\.|Cost\.)$/i, '')}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-6">
            {article.act.title && (
              <Link
                href={article.act.href}
                className="inline-block rounded bg-ink-foreground/10 px-2 py-0.5 text-xs font-mono font-medium uppercase tracking-wider hover:bg-ink-foreground/20"
              >
                {article.act.title}
              </Link>
            )}
            <h1 className="mt-4 flex flex-col gap-2 font-sans tracking-tight">
              <span className="text-4xl font-semibold leading-tight tabular-nums md:text-5xl">{article.number}</span>
              {article.rubrica && (
                <span className="max-w-4xl text-2xl font-medium leading-snug text-ink-foreground/85 text-pretty md:text-3xl">
                  {article.rubrica}
                </span>
              )}
            </h1>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-ink-foreground/15 pt-5">
            <dl className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-ink-foreground/80">
              {article.act.estremi && (
                <div className="flex gap-1.5">
                  <dt className="sr-only">Estremi dell&apos;atto</dt>
                  <dd className="text-base font-semibold text-ink-foreground">{article.act.estremi}</dd>
                </div>
              )}
            </dl>
            <ShareButtons url={url} title={heading} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-6 print:hidden">
        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_TOP} />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-6 lg:grid-cols-[1fr_320px] lg:gap-8">
        <article className="min-w-0">
          <div className="mx-auto max-w-3xl lg:mx-0 lg:max-w-[52rem]">
            <section aria-labelledby="testo-title" className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 md:px-7">
                <h2 id="testo-title" className="text-sm font-mono font-medium uppercase tracking-wider text-muted-foreground">
                  Testo vigente
                  {article.commaCount > 1 && <span className="normal-case tracking-normal"> · {article.commaCount} commi</span>}
                </h2>
                <CopyTextButton targetId="testo-articolo" heading={heading} />
              </div>
              <div
                id="testo-articolo"
                className="act-text px-5 py-6 md:px-7 md:py-8"
                dangerouslySetInnerHTML={{ __html: article.textHtml }}
              />
              {article.meta.length > 0 && (
                <ul className="flex flex-col gap-1 border-t border-border bg-muted px-5 py-4 text-sm leading-relaxed text-muted-foreground md:px-7 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:no-underline">
                  {article.meta.map((m) => (
                    <li key={m} dangerouslySetInnerHTML={{ __html: m }} />
                  ))}
                </ul>
              )}
            </section>

            {article.commentHtml && (
              <>
                <AdSlot variant="in-article" slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE} className="my-10 print:hidden" />
                <section aria-labelledby="commento-title">
                  <h2 id="commento-title" className="font-sans text-2xl font-semibold tracking-tight text-primary">
                    Commento
                  </h2>
                  <div className="wp-content mt-2" dangerouslySetInnerHTML={{ __html: article.commentHtml }} />
                </section>
              </>
            )}

            {(article.prev || article.next) && (
              <nav aria-label="Articoli vicini" className="mt-12 grid gap-3 sm:grid-cols-2 print:hidden">
                {article.prev ? <NeighbourLink link={article.prev} direction="prev" /> : <span aria-hidden />}
                {article.next && <NeighbourLink link={article.next} direction="next" />}
              </nav>
            )}

            <div className="mt-10 flex flex-col gap-3 print:hidden">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">Condividi o stampa</span>
              <ShareButtons url={url} title={heading} tone="light" />
            </div>

            <div className="print:hidden">
              <ArticleHelp title={heading} />
            </div>

            <AdSlot variant="rectangle" slot={process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_BOTTOM} className="mt-10" />
          </div>
        </article>

        <div className="flex flex-col gap-8">
          {article.siblings.articles.length > 0 && <SiblingIndex article={article} />}
          <ListingSidebar rectangleAfterDatabase />
        </div>
      </div>

      <BackToTop />
    </>
  )
}

function NeighbourLink({ link, direction }: { link: ActLink; direction: 'prev' | 'next' }) {
  const next = direction === 'next'
  return (
    <Link
      href={link.href}
      rel={direction}
      className={`group flex flex-col gap-1 rounded-lg border border-border bg-card p-4 hover:border-primary ${next ? 'sm:items-end sm:text-right' : ''}`}
    >
      <span className="flex items-center gap-1.5 text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
        {!next && <ArrowLeft className="size-3.5" aria-hidden />}
        {next ? 'Articolo successivo' : 'Articolo precedente'}
        {next && <ArrowRight className="size-3.5" aria-hidden />}
      </span>
      <span className="font-semibold tabular-nums text-primary">{link.label}</span>
      {link.rubrica && <span className="text-sm leading-relaxed text-foreground text-pretty">{link.rubrica}</span>}
    </Link>
  )
}

function SiblingIndex({ article }: { article: ActArticle }) {
  return (
    <nav aria-labelledby="sb-act" className="rounded-lg border border-border bg-card p-5 print:hidden">
      <p id="sb-act" className="text-sm font-mono font-medium uppercase tracking-wider text-muted-foreground">
        {article.act.title || 'Indice'}
      </p>
      {article.siblings.group && <p className="mt-2 text-sm font-semibold leading-snug text-foreground text-pretty">{article.siblings.group}</p>}
      <ul className="mt-3 flex max-h-96 flex-col overflow-y-auto">
        {article.siblings.articles.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              aria-current={a.current ? 'page' : undefined}
              className={`flex gap-2 rounded-md px-2 py-1.5 text-sm leading-snug ${
                a.current ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'
              }`}
            >
              <strong className={`w-20 shrink-0 font-semibold tabular-nums ${a.current ? '' : 'text-primary'}`}>{a.label}</strong>
              {a.rubrica && <span className="text-pretty">{a.rubrica}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={article.act.href}
        className="mt-4 flex items-center justify-between gap-2 rounded-md bg-primary px-4 py-2.5 text-base font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Indice completo
        <ListTree className="size-4" aria-hidden />
      </Link>
    </nav>
  )
}
