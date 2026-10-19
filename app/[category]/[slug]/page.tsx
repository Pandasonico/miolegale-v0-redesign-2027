import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { ListingSidebar } from '@/components/content/listing'
import { PostRow } from '@/components/content/post-list'
import { ConsulenzaArticleBox } from '@/components/studio/consulenza-cta'
import { sectionBySlug } from '@/lib/site'
import { decodeEntities, featuredImage, formatDate, getPostBySlug, getPosts, splitContent } from '@/lib/wp'

type Props = { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const title = decodeEntities(post.title.rendered)
  const description = decodeEntities(post.excerpt.rendered).slice(0, 160)
  return {
    title,
    description,
    alternates: { canonical: `/${category}/${slug}` },
    openGraph: { title, description, type: 'article', publishedTime: post.date },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const title = decodeEntities(post.title.rendered)
  const cover = featuredImage(post, 'large')
  const section = sectionBySlug(category)
  const terms = (post._embedded?.['wp:term']?.flat() ?? []).filter((t) => t.taxonomy === 'category' && t.slug !== category)
  const [firstHalf, secondHalf] = splitContent(post.content?.rendered ?? '')
  const related = await getPosts({ categorySlug: category, perPage: 5 })
  const relatedPosts = related.posts.filter((p) => p.id !== post.id).slice(0, 4)

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 lg:grid-cols-[1fr_320px]">
      <article className="min-w-0">
        <nav aria-label="Percorso" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/${category}`} className="hover:text-primary">
                {section?.short ?? category}
              </Link>
            </li>
          </ol>
        </nav>

        <header className="mt-4 border-b border-border pb-6">
          <h1 className="font-sans tracking-tight text-3xl font-semibold leading-tight text-balance md:text-4xl">{title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <time dateTime={post.date}>Pubblicato il {formatDate(post.date)}</time>
            {post.modified !== post.date && <span>Aggiornato il {formatDate(post.modified)}</span>}
          </div>
          {terms.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {terms.map((t) => (
                <li key={t.id}>
                  <Link href={`/${t.slug}`} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70">
                    {decodeEntities(t.name)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        {cover && (
          <figure className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg bg-secondary">
            <Image src={cover.src} alt={cover.alt || title} fill priority sizes="(min-width: 1024px) 860px, 100vw" className="object-cover" />
          </figure>
        )}

        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_TOP} className="my-6" />

        <div className="wp-content" dangerouslySetInnerHTML={{ __html: firstHalf }} />
        {secondHalf && (
          <>
            <AdSlot variant="in-article" slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE} className="my-8" />
            <div className="wp-content" dangerouslySetInnerHTML={{ __html: secondHalf }} />
          </>
        )}

        <Link
          href={`/assistente-ai?q=${encodeURIComponent(`Spiegami in modo semplice: ${title}`)}`}
          className="mt-10 flex items-center gap-4 rounded-lg bg-primary p-5 text-primary-foreground hover:bg-primary/95"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block font-semibold">Hai dubbi su questo contenuto?</span>
            <span className="block text-sm text-primary-foreground/80">Chiedi all&apos;assistente AI una spiegazione semplificata.</span>
          </span>
        </Link>
        <ConsulenzaArticleBox />

        <AdSlot variant="rectangle" slot={process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_BOTTOM} className="my-10" />

        {relatedPosts.length > 0 && (
          <section aria-labelledby="related-title" className="rounded-lg border border-border bg-card p-5">
            <h2 id="related-title" className="font-sans tracking-tight text-2xl font-semibold">
              Potrebbe interessarti
            </h2>
            <div className="divide-y divide-border">
              {relatedPosts.map((p) => (
                <PostRow key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </article>
      <ListingSidebar />
    </div>
  )
}
