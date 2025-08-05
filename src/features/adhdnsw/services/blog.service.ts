import { supabase } from '@/shared/services/supabase'

import type {
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogSearchParams,
  PaginatedResponse,
} from '../types'

export class BlogService {
  /**
   * Get blog posts with filtering and pagination
   */
  static async getBlogPosts(
    params: BlogSearchParams = {}
  ): Promise<PaginatedResponse<BlogPost>> {
    const {
      query,
      categories = [],
      tags = [],
      featured,
      page = 1,
      limit = 12,
    } = params

    let queryBuilder = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_categories!inner(
          category:blog_categories(
            id,
            slug,
            name
          )
        ),
        blog_post_tags(
          tag:blog_tags(
            id,
            slug,
            name
          )
        )
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    // Apply filters
    if (featured !== undefined) {
      queryBuilder = queryBuilder.eq('is_featured', featured)
    }

    if (categories.length > 0) {
      queryBuilder = queryBuilder.in(
        'blog_post_categories.category.slug',
        categories
      )
    }

    if (tags.length > 0) {
      queryBuilder = queryBuilder.in(
        'blog_post_tags.tag.slug',
        tags
      )
    }

    // Full text search
    if (query) {
      queryBuilder = queryBuilder.textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english',
      })
    }

    // Apply pagination
    const offset = (page - 1) * limit
    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    const { data, error, count } = await queryBuilder

    if (error) {
      throw new Error(`Failed to fetch blog posts: ${error.message}`)
    }

    const posts = this.transformBlogPosts(data || [])

    return {
      data: posts,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    }
  }

  /**
   * Get a single blog post by slug
   */
  static async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_categories(
          category:blog_categories(*)
        ),
        blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
      return null
    }

    return this.transformBlogPost(data)
  }

  /**
   * Get related blog posts
   */
  static async getRelatedPosts(
    postId: string,
    categoryIds: string[],
    limit: number = 3
  ): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_categories!inner(
          category:blog_categories(*)
        )
      `)
      .eq('status', 'published')
      .neq('id', postId)
      .in('blog_post_categories.category_id', categoryIds)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching related posts:', error)
      return []
    }

    return this.transformBlogPosts(data || [])
  }

  /**
   * Get featured blog posts
   */
  static async getFeaturedPosts(limit: number = 5): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_categories(
          category:blog_categories(*)
        )
      `)
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured posts:', error)
      return []
    }

    return this.transformBlogPosts(data || [])
  }

  /**
   * Get all blog categories
   */
  static async getCategories(): Promise<BlogCategory[]> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('display_order')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  }

  /**
   * Get a category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching category:', error)
      return null
    }

    return data
  }

  /**
   * Get popular tags (most used)
   */
  static async getPopularTags(limit: number = 20): Promise<BlogTag[]> {
    // This would require a custom RPC function to count tag usage
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .limit(limit)

    if (error) {
      console.error('Error fetching tags:', error)
      return []
    }

    return data || []
  }

  /**
   * Track search query
   */
  static async trackSearchQuery(
    query: string,
    queryType: 'directory' | 'blog' | 'site',
    resultsCount: number,
    clickedResult?: string,
    userLocation?: string
  ): Promise<void> {
    await supabase
      .from('search_queries')
      .insert({
        query,
        query_type: queryType,
        results_count: resultsCount,
        clicked_result: clickedResult,
        user_location: userLocation,
      })
  }

  /**
   * Transform blog post data
   */
  private static transformBlogPost(data: Record<string, unknown>): BlogPost {
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featured_image,
      authorName: data.author_name,
      authorBio: data.author_bio,
      authorImage: data.author_image,
      status: data.status,
      publishedAt: data.published_at ? new Date(data.published_at) : undefined,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      canonicalUrl: data.canonical_url,
      isFeatured: data.is_featured,
      isEvergreen: data.is_evergreen,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      categories: (data.blog_post_categories as Record<string, unknown>[])?.map((bpc: Record<string, unknown>) => bpc.category) || [],
      tags: (data.blog_post_tags as Record<string, unknown>[])?.map((bpt: Record<string, unknown>) => bpt.tag) || [],
    }
  }

  private static transformBlogPosts(data: Record<string, unknown>[]): BlogPost[] {
    return data.map(this.transformBlogPost)
  }

  /**
   * Generate RSS feed data
   */
  static async generateRSSFeed(): Promise<string> {
    const posts = await this.getBlogPosts({ limit: 20 })
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ADHD NSW Blog</title>
    <description>Latest ADHD news, guides, and resources for New South Wales</description>
    <link>https://adhdnsw.org/blog</link>
    <atom:link href="https://adhdnsw.org/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-AU</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.data.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.metaDescription || ''}]]></description>
      <link>https://adhdnsw.org/blog/${post.slug}</link>
      <guid isPermaLink="true">https://adhdnsw.org/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt?.toUTCString() || ''}</pubDate>
      ${(post.categories || []).map(cat => `<category>${cat.name}</category>`).join('\n      ')}
    </item>`).join('')}
  </channel>
</rss>`

    return rss
  }

  /**
   * Generate sitemap entries for blog
   */
  static async generateSitemapEntries(): Promise<Array<{
    loc: string
    lastmod: string
    changefreq: string
    priority: number
  }>> {
    const posts = await this.getBlogPosts({ limit: 1000 })
    const categories = await this.getCategories()

    const entries = []

    // Blog index
    entries.push({
      loc: 'https://adhdnsw.org/blog',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.8,
    })

    // Categories
    for (const category of categories) {
      entries.push({
        loc: `https://adhdnsw.org/blog/category/${category.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      })
    }

    // Posts
    for (const post of posts.data) {
      entries.push({
        loc: `https://adhdnsw.org/blog/${post.slug}`,
        lastmod: post.updatedAt.toISOString(),
        changefreq: post.isEvergreen ? 'monthly' : 'yearly',
        priority: post.isFeatured ? 0.9 : 0.6,
      })
    }

    return entries
  }
}