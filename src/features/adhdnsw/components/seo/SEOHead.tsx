import Head from 'next/head'
import { useRouter } from 'next/router'
import type { SEOMetadata } from '../../types'

interface SEOHeadProps {
  metadata: SEOMetadata
  noindex?: boolean
  additionalSchema?: any[]
}

export function SEOHead({ metadata, noindex = false, additionalSchema = [] }: SEOHeadProps) {
  const router = useRouter()
  const siteUrl = 'https://adhdnsw.org'
  
  // Ensure absolute URLs
  const canonicalUrl = metadata.canonical?.startsWith('http') 
    ? metadata.canonical 
    : `${siteUrl}${metadata.canonical || router.asPath}`

  const ogImage = metadata.openGraph?.image?.startsWith('http')
    ? metadata.openGraph.image
    : `${siteUrl}${metadata.openGraph?.image || '/images/og-default.jpg'}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,follow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={metadata.openGraph?.title || metadata.title} />
      <meta property="og:description" content={metadata.openGraph?.description || metadata.description} />
      <meta property="og:type" content={metadata.openGraph?.type || 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="ADHD NSW" />
      <meta property="og:locale" content="en_AU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={metadata.twitter?.card || 'summary'} />
      <meta name="twitter:title" content={metadata.twitter?.title || metadata.title} />
      <meta name="twitter:description" content={metadata.twitter?.description || metadata.description} />
      <meta name="twitter:image" content={metadata.twitter?.image || ogImage} />
      <meta name="twitter:site" content="@adhdnsw" />
      
      {/* Structured Data */}
      {metadata.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.jsonLd) }}
        />
      )}
      
      {/* Additional Schema */}
      {additionalSchema.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  )
}