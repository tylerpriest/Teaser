'use client'

import type { SEOMetadata } from '../../types'

interface SEOHeadProps {
  metadata: SEOMetadata
  additionalSchema?: any[]
}

// Note: In Next.js App Router, meta tags are handled via metadata export
// This component now only handles structured data injection
export function SEOHead({ metadata, additionalSchema = [] }: SEOHeadProps) {
  const schemas = [metadata.jsonLd, ...additionalSchema].filter(Boolean)

  if (schemas.length === 0) return null

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}