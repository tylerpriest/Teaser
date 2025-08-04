import { Suspense } from 'react'
import Link from 'next/link'
import { BlogService } from '@/features/adhdnsw/services/blog.service'
import { SEOService } from '@/features/adhdnsw/services/seo.service'
import { BlogPostCard } from '@/features/adhdnsw/components/blog/BlogPostCard'
import { Button } from '@/shared/components/button'
import type { Metadata } from 'next'

async function BlogContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search params
  const page = parseInt(searchParams.page as string) || 1
  const category = searchParams.category as string

  // Fetch data
  const [posts, categories, featuredPosts] = await Promise.all([
    BlogService.getBlogPosts({
      categories: category ? [category] : [],
      page,
      limit: 12,
    }),
    BlogService.getCategories(),
    BlogService.getFeaturedPosts(3),
  ])

  const { pagination } = posts
  const hasResults = posts.data.length > 0

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">ADHD Resources & News for NSW</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Expert guides, latest research, NSW-specific updates, and practical strategies 
            for managing ADHD across all ages.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && page === 1 && !category && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Articles</h2>
          <div className="grid gap-6 md:grid-cols-1">
            {featuredPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!category ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href="/blog">All Posts</Link>
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.slug ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <Link href={`/blog?category=${cat.slug}`}>
                {cat.name}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 pb-12">
        {hasResults ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.data.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {page > 1 && (
                  <Button
                    variant="outline"
                    asChild
                  >
                    <Link href={`/blog?${category ? `category=${category}&` : ''}page=${page - 1}`}>
                      Previous
                    </Link>
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? 'default' : 'outline'}
                        size="sm"
                        asChild
                      >
                        <Link href={`/blog?${category ? `category=${category}&` : ''}page=${pageNum}`}>
                          {pageNum}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
                
                {page < pagination.totalPages && (
                  <Button
                    variant="outline"
                    asChild
                  >
                    <Link href={`/blog?${category ? `category=${category}&` : ''}page=${page + 1}`}>
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No posts found in this category.
            </p>
            <Button variant="outline" asChild>
              <Link href="/blog">View all posts</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest ADHD news, NSW policy updates, and helpful resources 
            delivered to your inbox monthly.
          </p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* SEO Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <h2>ADHD Information Hub for New South Wales</h2>
          <p>
            Our blog provides comprehensive resources for individuals with ADHD, families, 
            educators, and healthcare professionals across NSW. From understanding diagnosis 
            pathways to navigating the NDIS, we cover topics that matter to our community.
          </p>
          <h3>Popular Topics</h3>
          <ul>
            <li>ADHD diagnosis and assessment guides</li>
            <li>Medication management and treatment options</li>
            <li>School support and educational strategies</li>
            <li>Workplace accommodations and career advice</li>
            <li>NSW healthcare system navigation</li>
            <li>NDIS funding and support services</li>
          </ul>
        </div>
      </section>
    </>
  )
}

// Loading state
function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Generate metadata
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const category = searchParams.category as string
  const page = parseInt(searchParams.page as string) || 1

  let title = 'ADHD Blog & Resources - NSW Updates, Guides & News'
  let description = 'Expert ADHD content for NSW: diagnosis guides, treatment options, school support, workplace strategies, and local news.'

  if (category) {
    const categoryData = await BlogService.getCategoryBySlug(category)
    if (categoryData) {
      title = `${categoryData.name} - ADHD NSW Blog`
      description = categoryData.description || `Latest ${categoryData.name} articles and resources for the ADHD community in NSW.`
    }
  }

  if (page > 1) {
    title += ` - Page ${page}`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://adhdnsw.org/blog${category ? `?category=${category}` : ''}${page > 1 ? `${category ? '&' : '?'}page=${page}` : ''}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      types: {
        'application/rss+xml': [
          { title: 'ADHD NSW Blog RSS Feed', url: '/blog/rss.xml' },
        ],
      },
    },
  }
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogContent searchParams={searchParams} />
    </Suspense>
  )
}