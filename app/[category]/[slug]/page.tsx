import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { AdSlot } from '@/components/ads/ad-slot'
import { ArticleHeader } from '@/components/article/article-header'
import { ArticleHelp } from '@/components/article/article-help'
import { ArticleToc } from '@/components/article/article-toc'
import { BackToTop } from '@/components/article/back-to-top'
import { ShareButtons } from '@/components/article/share-buttons'
import { ListingSidebar } from '@/components/content/listing'
import { ImageCard, PostRow } from '@/components/content/post-list'
import { SITE, sectionBySlug } from '@/lib/site'
import {
  decodeEntities,
  devSameOriginHtml,
  featuredImage,
  getPostBySlug,
  getPostTags,
  getRelatedPosts,
  readingMinutes,
  splitContentForAds,
  withHeadingAnchors,
} from '@/lib/wp'

type Props = { params: Promise<{ category: string; slug: string }> }

const BACK_TO_TOP_SECTIONS = new Set(['norme', 'notizie', 'guide', 'sentenze', 'massime'])

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

  const rawContent = post.content?.rendered ?? ''
  const { html, toc } = withHeadingAnchors(devSameOriginHtml(rawContent))
  const contentChunks = splitContentForAds(html)
  const minutes = readingMinutes(rawContent)
  const plainContent = decodeEntities(rawContent)
  const lead = excerpt && !plainContent.startsWith(excerpt.replace(/…$/, '').slice(0, 60)) ? excerpt : undefined

  const tags = getPostTags(post)
  const relatedPosts = await getRelatedPosts(post, category)
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

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-6 lg:grid-cols-[1fr_320px] lg:gap-8">
        <article className="min-w-0">
          <div className="mx-auto max-w-3xl lg:mx-0 lg:max-w-[52rem]">
            {cover && (
              <figure className="relative aspect-[16/10] overflow-hidden rounded-lg bg-secondary">
                <Image src={cover.src} alt={cover.alt || title} fill priority sizes="(min-width: 1024px) 768px, 100vw" className="object-cover" />
              </figure>
            )}

            {toc.length >= 3 && <ArticleToc items={toc} />}

            {contentChunks.map((chunk, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <AdSlot variant="in-article" slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE} className="my-8 print:hidden" />
                )}
                <div className={i === 0 ? 'wp-content mt-8' : 'wp-content'} dangerouslySetInnerHTML={{ __html: chunk }} />
              </Fragment>
            ))}

            {tags.length > 0 && (
              <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 print:hidden">
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">Tag</span>
                <ul className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/tag/${t.slug}`}
                        className="block rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-secondary-foreground hover:border-primary hover:text-primary"
                      >
                        {t.name}
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
          <h2 id="related-title" className="mb-5 font-sans text-xl font-semibold tracking-tight text-primary text-balance">
            {tags.length > 0 ? 'Sullo stesso argomento' : `Altro in ${categoryLabel}`}
          </h2>
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

      {BACK_TO_TOP_SECTIONS.has(category) && <BackToTop />}
    </>
  )
}
