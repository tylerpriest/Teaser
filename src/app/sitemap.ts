import { MetadataRoute } from 'next'

import { BlogService } from '@/features/adhdnsw/services/blog.service'
import { DirectoryService } from '@/features/adhdnsw/services/directory.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://adhdnsw.org'

  try {
    // Fetch all professionals and blog posts for sitemap
    const [professionals, blogEntries, categories] = await Promise.all([
      DirectoryService.searchProfessionals({ limit: 1000 }),
      BlogService.generateSitemapEntries(),
      BlogService.getCategories(),
    ])

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/directory`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ]

    // Professional pages
    const professionalPages: MetadataRoute.Sitemap = professionals.data.map(
      (professional) => ({
        url: `${baseUrl}/professionals/${professional.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    )

    // Location-based directory pages (major NSW cities)
    const locations = [
      'Sydney',
      'Newcastle',
      'Wollongong',
      'Central Coast',
      'Parramatta',
      'Penrith',
    ]
    const locationPages: MetadataRoute.Sitemap = locations.map((location) => ({
      url: `${baseUrl}/directory?location=${encodeURIComponent(location)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // Service-based directory pages
    const services = [
      'psychiatrist',
      'psychologist',
      'paediatrician',
      'adhd-coach',
    ]
    const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${baseUrl}/directory?services=${service}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // Blog category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/blog?category=${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    // Transform blog entries to match MetadataRoute.Sitemap format
    const transformedBlogEntries: MetadataRoute.Sitemap = blogEntries.map(
      (entry) => ({
        url: entry.loc,
        lastModified: new Date(entry.lastmod),
        changeFrequency: entry.changefreq as
          | 'daily'
          | 'weekly'
          | 'monthly'
          | 'yearly'
          | 'always'
          | 'hourly'
          | 'never',
        priority: entry.priority,
      })
    )

    return [
      ...staticPages,
      ...professionalPages,
      ...locationPages,
      ...servicePages,
      ...categoryPages,
      ...transformedBlogEntries,
    ]
  } catch {
    // Return minimal sitemap if Supabase is not configured
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/directory`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ]
  }
}
