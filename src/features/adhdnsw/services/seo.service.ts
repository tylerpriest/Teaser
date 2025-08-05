import type { SEOMetadata, Professional, BlogPost } from '../types'

export class SEOService {
  private static readonly siteName = 'ADHD NSW'
  private static readonly siteUrl = 'https://adhdnsw.org'
  private static readonly twitterHandle = '@adhdnsw'

  /**
   * Generate SEO metadata for a professional profile
   */
  static generateProfessionalMeta(professional: Professional): SEOMetadata {
    const fullName = `${professional.title} ${professional.firstName} ${professional.lastName}`
    const primaryLocation = professional.locations?.find(l => l.isPrimary)
    const locationText = primaryLocation 
      ? ` in ${primaryLocation.suburb}, NSW` 
      : ' in NSW'
    
    const services = professional.services?.map(s => s.name).join(', ') || 'ADHD Services'
    const credentials = professional.credentials.length > 0 
      ? ` (${professional.credentials.join(', ')})` 
      : ''

    const title = professional.metaTitle || 
      `${fullName} - ADHD ${professional.services?.[0]?.name || 'Specialist'}${locationText}`
    
    const description = professional.metaDescription || 
      `${fullName}${credentials} - ${services}${locationText}. ${
        professional.bio?.substring(0, 120) || 'Experienced ADHD professional'
      }... Book online or view contact details.`

    return {
      title: this.truncateTitle(title),
      description: this.truncateDescription(description),
      canonical: `${this.siteUrl}/professionals/${professional.slug}`,
      openGraph: {
        title,
        description,
        type: 'profile',
        image: '/images/og-professional-default.jpg',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
      jsonLd: this.generateProfessionalSchema(professional),
    }
  }

  /**
   * Generate SEO metadata for a blog post
   */
  static generateBlogPostMeta(post: BlogPost): SEOMetadata {
    const title = post.metaTitle || post.title
    const description = post.metaDescription || 
      post.excerpt || 
      this.generateExcerpt(post.content)

    return {
      title: this.truncateTitle(title),
      description: this.truncateDescription(description),
      canonical: post.canonicalUrl || `${this.siteUrl}/blog/${post.slug}`,
      openGraph: {
        title,
        description,
        type: 'article',
        image: post.featuredImage || '/images/og-blog-default.jpg',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        image: post.featuredImage || '/images/og-blog-default.jpg',
      },
      jsonLd: this.generateArticleSchema(post),
    }
  }

  /**
   * Generate SEO metadata for directory pages
   */
  static generateDirectoryMeta(params: {
    location?: string
    service?: string
    page?: number
  }): SEOMetadata {
    const { location, service, page = 1 } = params
    
    let title = 'ADHD Professionals Directory NSW'
    let description = 'Find verified ADHD specialists in New South Wales. Search psychiatrists, psychologists, coaches, and more.'

    if (service && location) {
      title = `ADHD ${service} in ${location}, NSW`
      description = `Find verified ADHD ${service.toLowerCase()} in ${location}, NSW. View profiles, specialties, and book appointments.`
    } else if (service) {
      title = `ADHD ${service} in NSW - Directory`
      description = `Find qualified ADHD ${service.toLowerCase()} across New South Wales. Compare specialists and book appointments online.`
    } else if (location) {
      title = `ADHD Specialists in ${location}, NSW`
      description = `Find ADHD psychiatrists, psychologists, and coaches in ${location}, NSW. Verified professionals accepting new patients.`
    }

    if (page > 1) {
      title += ` - Page ${page}`
    }

    return {
      title: this.truncateTitle(title),
      description: this.truncateDescription(description),
      canonical: `${this.siteUrl}/directory${location ? `/${location.toLowerCase()}` : ''}${service ? `/${service}` : ''}${page > 1 ? `?page=${page}` : ''}`,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    }
  }

  /**
   * Generate structured data for a professional
   */
  private static generateProfessionalSchema(professional: Professional): Record<string, unknown> {
    const primaryLocation = professional.locations?.find(l => l.isPrimary)
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      '@id': `${this.siteUrl}/professionals/${professional.slug}`,
      name: `${professional.title} ${professional.firstName} ${professional.lastName}`,
      description: professional.bio,
      medicalSpecialty: professional.services?.map(s => ({
        '@type': 'MedicalSpecialty',
        name: s.name,
      })),
      hasCredential: professional.credentials.map(c => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: c,
      })),
    }

    if (primaryLocation) {
      Object.assign(schema, {
        address: {
          '@type': 'PostalAddress',
          streetAddress: primaryLocation.streetAddress,
          addressLocality: primaryLocation.suburb,
          addressRegion: primaryLocation.state,
          postalCode: primaryLocation.postcode,
          addressCountry: 'AU',
        },
        geo: primaryLocation.latitude && primaryLocation.longitude ? {
          '@type': 'GeoCoordinates',
          latitude: primaryLocation.latitude,
          longitude: primaryLocation.longitude,
        } : undefined,
        telephone: primaryLocation.phone || professional.phone,
      })
    }

    if (professional.website) {
      Object.assign(schema, { url: professional.website })
    }

    return schema
  }

  /**
   * Generate structured data for a blog post
   */
  static generateArticleSchema(post: BlogPost): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      '@id': `${this.siteUrl}/blog/${post.slug}`,
      headline: post.title,
      description: post.excerpt || this.generateExcerpt(post.content),
      image: post.featuredImage ? `${this.siteUrl}${post.featuredImage}` : undefined,
      datePublished: post.publishedAt?.toISOString(),
      dateModified: post.updatedAt.toISOString(),
      author: {
        '@type': 'Organization',
        name: post.authorName || 'ADHD NSW',
        url: this.siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'ADHD NSW',
        url: this.siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.siteUrl}/images/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.siteUrl}/blog/${post.slug}`,
      },
    }
  }

  /**
   * Generate organization schema for the site
   */
  static generateOrganizationSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      '@id': this.siteUrl,
      name: 'ADHD NSW',
      url: this.siteUrl,
      logo: `${this.siteUrl}/images/logo.png`,
      description: 'Trusted directory of ADHD professionals and resources for New South Wales',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'NSW',
        addressCountry: 'AU',
      },
      sameAs: [
        'https://twitter.com/adhdnsw',
        'https://facebook.com/adhdnsw',
      ],
    }
  }

  /**
   * Generate breadcrumb schema
   */
  static generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.siteUrl}${item.url}`,
      })),
    }
  }

  /**
   * Helper methods
   */
  private static truncateTitle(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength - 3) + '...'
  }

  private static truncateDescription(description: string, maxLength: number = 160): string {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength - 3) + '...'
  }

  private static generateExcerpt(content: string, maxLength: number = 160): string {
    // Remove markdown/HTML
    const plainText = content
      .replace(/#{1,6}\s/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/\n+/g, ' ')
      .trim()
    
    return this.truncateDescription(plainText, maxLength)
  }
}