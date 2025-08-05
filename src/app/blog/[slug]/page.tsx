import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Calendar, Clock, User, Tag, Share2, Facebook, Twitter } from 'lucide-react'

import { BlogPostCard } from '@/features/adhdnsw/components/blog/BlogPostCard'
import { BlogService } from '@/features/adhdnsw/services/blog.service'
import { SEOService } from '@/features/adhdnsw/services/seo.service'
import { Button } from '@/shared/components/button'

interface PageProps {
  params: { slug: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await BlogService.getBlogPostBySlug(params.slug)
  
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
  const post = await BlogService.getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200)
  const categoryIds = post.categories.map(c => c.id)
  const relatedPosts = await BlogService.getRelatedPosts(post.id, categoryIds, 3)

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
              <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
              <li className="text-muted-foreground">/</li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li className="text-muted-foreground">/</li>
              <li className="font-medium line-clamp-1">{post.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <article>
        {/* Header */}
        <header className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map(category => (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b">
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
                    day: 'numeric'
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
          <div className="container mx-auto px-4 mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
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
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map(tag => (
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
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Share this article</h3>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://adhdnsw.org/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=https://adhdnsw.org/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://adhdnsw.org/blog/${post.slug}`)
                    // You could add a toast notification here
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Author bio */}
            {post.authorBio && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">About the Author</h3>
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
                    <p className="font-medium mb-1">{post.authorName}</p>
                    <p className="text-sm text-muted-foreground">{post.authorBio}</p>
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
              <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map(relatedPost => (
                  <BlogPostCard
                    key={relatedPost.id}
                    post={relatedPost}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-primary/5 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-4">Need ADHD Support?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Find verified ADHD professionals in your area or explore more resources 
              to help manage ADHD effectively.
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