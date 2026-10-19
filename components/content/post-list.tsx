import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatDate, type PostCard } from '@/lib/wp'
import { sectionBySlug } from '@/lib/site'

export function PostRow({ post, showExcerpt = true }: { post: PostCard; showExcerpt?: boolean }) {
  const section = sectionBySlug(post.section)
  return (
    <article className="group py-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {section && <span className="font-semibold uppercase tracking-wider text-primary">{section.short}</span>}
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
      <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-pretty">
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
          <h2 id={`h-${href}`} className="font-serif text-2xl font-semibold">
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
