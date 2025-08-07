import {
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  Facebook,
  Twitter,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlogPostCard } from '@/features/adhdnsw/components/blog/BlogPostCard'
import { BlogService } from '@/features/adhdnsw/services/blog.service'
import { SEOService } from '@/features/adhdnsw/services/seo.service'
import { Button } from '@/shared/components/button'

interface PageProps {
  params: { slug: string }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  let post

  try {
    post = await BlogService.getBlogPostBySlug(params.slug)
  } catch {
    post = null
  }

  if (!post) {
    return {
      title: 'Post Not Found - ADHD NSW Blog',
      description: 'The requested blog post could not be found.',
    }
  }

  const seoMeta = SEOService.generateBlogPostMeta(post)

  return {
    title: seoMeta.title,
    description: seoMeta.description,
    openGraph: {
      title: seoMeta.openGraph?.title || seoMeta.title,
      description: seoMeta.openGraph?.description || seoMeta.description,
      type: 'article',
      url: seoMeta.canonical,
      images: seoMeta.openGraph?.image ? [seoMeta.openGraph.image] : undefined,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoMeta.twitter?.title || seoMeta.title,
      description: seoMeta.twitter?.description || seoMeta.description,
      images: seoMeta.twitter?.image ? [seoMeta.twitter.image] : undefined,
    },
  }
}

// Generate static params for popular posts
export async function generateStaticParams() {
  // In production, this would fetch popular posts
  return []
}

export default async function BlogPostPage({ params }: PageProps) {
  let post: Awaited<ReturnType<typeof BlogService.getBlogPostBySlug>>
  let relatedPosts: Awaited<ReturnType<typeof BlogService.getRelatedPosts>>

  try {
    post = await BlogService.getBlogPostBySlug(params.slug)

    if (!post) {
      notFound()
    }

    const categoryIds = post.categories?.map((c) => c.id) || []
    relatedPosts = await BlogService.getRelatedPosts(post.id, categoryIds, 3)
  } catch {
    notFound()
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200)

  // Generate structured data
  const jsonLd = SEOService.generateArticleSchema(post)
  const breadcrumbSchema = SEOService.generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="line-clamp-1 font-medium">{post.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <article>
        {/* Header */}
        <header className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.slug}`}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mb-6 text-xl text-muted-foreground">
                {post.excerpt}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 border-b pb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt?.toISOString()}>
                  {post.publishedAt?.toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="container mx-auto mb-8 px-4">
            <div className="mx-auto max-w-4xl">
              <div className="relative h-96 overflow-hidden rounded-lg md:h-[500px]">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="mx-auto max-w-4xl">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 border-t pt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share buttons */}
            <div className="mt-8 border-t pt-8">
              <h3 className="mb-4 text-lg font-semibold">Share this article</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://adhdnsw.org/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=https://adhdnsw.org/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://adhdnsw.org/blog/${post.slug}`
                    )
                    // You could add a toast notification here
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Author bio */}
            {post.authorBio && (
              <div className="mt-8 rounded-lg bg-gray-50 p-6">
                <h3 className="mb-2 text-lg font-semibold">About the Author</h3>
                <div className="flex items-start gap-4">
                  {post.authorImage && (
                    <Image
                      src={post.authorImage}
                      alt={post.authorName}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="mb-1 font-medium">{post.authorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.authorBio}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="mb-6 text-2xl font-semibold">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-primary/5 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-semibold">Need ADHD Support?</h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Find verified ADHD professionals in your area or explore more
              resources to help manage ADHD effectively.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/directory">Find Professionals</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/blog">More Resources</Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}
