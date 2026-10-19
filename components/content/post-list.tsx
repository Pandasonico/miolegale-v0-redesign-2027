import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatDate, type PostCard } from '@/lib/wp'
import { sectionBySlug } from '@/lib/site'

export function ImageCard({ post, featured = false }: { post: PostCard; featured?: boolean }) {
  const section = sectionBySlug(post.section)
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className={`relative overflow-hidden bg-secondary ${featured ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
        {post.image && (
          <Image
            src={post.image}
            alt={post.imageAlt ?? ''}
            fill
            priority={featured}
            sizes={featured ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
            className="object-cover"
          />
        )}
        {section && (
          <span className="absolute left-3 top-3 rounded bg-primary px-2 py-0.5 text-xs font-mono font-medium uppercase tracking-wider text-primary-foreground">
            {section.short}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <time dateTime={post.date} className="text-xs text-muted-foreground">
          {formatDate(post.date)}
        </time>
        <h3 className={`mt-1 font-sans tracking-tight font-semibold leading-snug text-pretty ${featured ? 'text-2xl md:text-3xl' : 'line-clamp-3 text-lg'}`}>
          <Link href={post.href} className="after:absolute after:inset-0 group-hover:text-primary">
            {post.title}
          </Link>
        </h3>
        {featured && post.excerpt && <p className="mt-3 line-clamp-6 leading-relaxed text-muted-foreground">{post.excerpt}</p>}
      </div>
    </article>
  )
}

export function PostRow({ post, showExcerpt = true }: { post: PostCard; showExcerpt?: boolean }) {
  const section = sectionBySlug(post.section)
  return (
    <article className="group py-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {section && <span className="font-mono font-medium uppercase tracking-wider text-primary">{section.short}</span>}
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
      <h3 className="mt-1 font-sans tracking-tight text-lg font-semibold leading-snug text-pretty">
        <Link href={post.href} className="hover:text-primary">
          {post.title}
        </Link>
      </h3>
      {showExcerpt && post.excerpt && (
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      )}
    </article>
  )
}

export function SectionBlock({
  title,
  href,
  posts,
  description,
}: {
  title: string
  href: string
  posts: PostCard[]
  description?: string
}) {
  return (
    <section aria-labelledby={`h-${href}`} className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
        <div>
          <h2 id={`h-${href}`} className="font-sans tracking-tight text-2xl font-semibold">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">
          Tutte <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      {posts.length > 0 ? (
        <div className="divide-y divide-border">
          {posts.map((p) => (
            <PostRow key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <p className="py-6 text-sm text-muted-foreground">Contenuti momentaneamente non disponibili.</p>
      )}
    </section>
  )
}
