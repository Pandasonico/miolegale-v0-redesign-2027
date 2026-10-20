import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdSlot } from '@/components/ads/ad-slot'
import { ArticleHeader } from '@/components/article/article-header'
import { ArticleHelp } from '@/components/article/article-help'
import { ArticleToc } from '@/components/article/article-toc'
import { ShareButtons } from '@/components/article/share-buttons'
import { ListingSidebar } from '@/components/content/listing'
import { ImageCard, PostRow } from '@/components/content/post-list'
import { SITE, sectionBySlug } from '@/lib/site'
import {
  decodeEntities,
  featuredImage,
  getPostBySlug,
  getPosts,
  readingMinutes,
  splitContent,
  withHeadingAnchors,
} from '@/lib/wp'

type Props = { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const title = decodeEntities(post.title.rendered)
  const description = decodeEntities(post.excerpt.rendered).slice(0, 160)
  const cover = featuredImage(post, 'large')
  return {
    title,
    description,
    alternates: { canonical: `/${category}/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: cover ? [cover.src] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const title = decodeEntities(post.title.rendered)
  const excerpt = decodeEntities(post.excerpt.rendered).replace(/\s*\[…\]$|…$/, '…')
  const cover = featuredImage(post, 'large')
  const section = sectionBySlug(category)
  const categoryLabel = section?.short ?? category
  const path = `/${category}/${slug}`
  const url = `${SITE.url}${path}`
  const terms = (post._embedded?.['wp:term']?.flat() ?? []).filter((t) => t.taxonomy === 'category' && t.slug !== category)

  const rawContent = post.content?.rendered ?? ''
  const { html, toc } = withHeadingAnchors(rawContent)
  const [firstHalf, secondHalf] = splitContent(html)
  const minutes = readingMinutes(rawContent)
  const plainContent = decodeEntities(rawContent)
  const lead = excerpt && !plainContent.startsWith(excerpt.replace(/…$/, '').slice(0, 60)) ? excerpt : undefined

  const related = await getPosts({ categorySlug: category, perPage: 5, withImages: true })
  const relatedPosts = related.posts.filter((p) => p.id !== post.id).slice(0, 3)
  const relatedHaveImages = relatedPosts.length > 0 && relatedPosts.every((p) => p.image)

  return (
    <>
      <ArticleHeader
        title={title}
        lead={lead}
        category={category}
        categoryLabel={categoryLabel}
        date={post.date}
        modified={post.modified}
        minutes={minutes}
        url={url}
      />

      <div className="mx-auto max-w-7xl px-4 pt-6 print:hidden">
        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_TOP} />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-6 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0">
          <div className="mx-auto max-w-3xl lg:mx-0">
            {cover && (
              <figure className="relative aspect-[16/9] overflow-hidden rounded-lg bg-secondary">
                <Image src={cover.src} alt={cover.alt || title} fill priority sizes="(min-width: 1024px) 768px, 100vw" className="object-cover" />
              </figure>
            )}

            {toc.length >= 3 && <ArticleToc items={toc} />}

            <div className="wp-content mt-8" dangerouslySetInnerHTML={{ __html: firstHalf }} />
            {secondHalf && (
              <>
                <AdSlot variant="in-article" slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE} className="my-8" />
                <div className="wp-content" dangerouslySetInnerHTML={{ __html: secondHalf }} />
              </>
            )}

            {terms.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
                <span className="mr-1 text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">Argomenti</span>
                <ul className="flex flex-wrap gap-2">
                  {terms.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/${t.slug}`}
                        className="block rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-secondary-foreground hover:border-primary hover:text-primary"
                      >
                        {decodeEntities(t.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 print:hidden">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                Condividi o stampa
              </span>
              <ShareButtons url={url} title={title} tone="light" />
            </div>

            <div className="print:hidden">
              <ArticleHelp title={title} />
            </div>

            <AdSlot variant="rectangle" slot={process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_BOTTOM} className="mt-10" />
          </div>
        </article>
        <ListingSidebar rectangleAfterDatabase />
      </div>

      {relatedPosts.length > 0 && (
        <section aria-labelledby="related-title" className="mx-auto max-w-7xl px-4 pt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="related-title" className="font-sans text-3xl font-semibold tracking-tight">
              Altro in {categoryLabel}
            </h2>
            <Link href={`/${category}`} className="hidden text-sm font-medium text-primary hover:underline sm:block">
              Vedi tutti
            </Link>
          </div>
          {relatedHaveImages ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((p) => (
                <ImageCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <div className="grid divide-y divide-border rounded-lg border border-border bg-card px-5 md:grid-cols-3 md:gap-6 md:divide-y-0">
              {relatedPosts.map((p) => (
                <PostRow key={p.id} post={p} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  )
}
