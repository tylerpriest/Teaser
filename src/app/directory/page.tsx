import { Suspense } from 'react'
import { DirectoryService } from '@/features/adhdnsw/services/directory.service'
import { SEOService } from '@/features/adhdnsw/services/seo.service'
import { SEOHead } from '@/features/adhdnsw/components/seo/SEOHead'
import { DirectoryFilters } from '@/features/adhdnsw/components/directory/DirectoryFilters'
import { ProfessionalCard } from '@/features/adhdnsw/components/directory/ProfessionalCard'
import { Button } from '@/shared/components/button'
import type { Metadata } from 'next'

// Server component for the directory page
async function DirectoryContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search params
  const params = {
    query: searchParams.q as string,
    location: searchParams.location as string,
    services: searchParams.services ? (searchParams.services as string).split(',') : [],
    ageGroups: searchParams.ages ? (searchParams.ages as string).split(',') : [],
    ndisOnly: searchParams.ndis === 'true',
    telehealthOnly: searchParams.telehealth === 'true',
    acceptingNewPatients: searchParams.accepting === 'true',
    page: parseInt(searchParams.page as string) || 1,
  }

  // Fetch data
  const [professionals, serviceTypes, ageGroups] = await Promise.all([
    DirectoryService.searchProfessionals(params),
    DirectoryService.getServiceTypes(),
    DirectoryService.getAgeGroups(),
  ])

  const hasResults = professionals.data.length > 0
  const { pagination } = professionals

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find ADHD Professionals in NSW</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Search our directory of verified ADHD specialists including psychiatrists, psychologists, 
            coaches, and therapists across New South Wales.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <DirectoryFilters
          services={serviceTypes}
          ageGroups={ageGroups}
          onFiltersChange={() => {
            // Client-side filter updates handled by client component
          }}
        />

        {/* Results Count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {hasResults ? (
              <>
                Showing {((params.page - 1) * 20) + 1}-
                {Math.min(params.page * 20, pagination.total)} of {pagination.total} professionals
              </>
            ) : (
              'No professionals found matching your criteria'
            )}
          </p>
          {/* Sort dropdown would go here */}
        </div>
      </section>

      {/* Results Grid */}
      <section className="container mx-auto px-4 pb-12">
        {hasResults ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {professionals.data.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {params.page > 1 && (
                  <Button
                    variant="outline"
                    href={`/directory?${new URLSearchParams({
                      ...searchParams,
                      page: String(params.page - 1),
                    }).toString()}`}
                  >
                    Previous
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === params.page ? 'default' : 'outline'}
                        size="sm"
                        href={`/directory?${new URLSearchParams({
                          ...searchParams,
                          page: String(pageNum),
                        }).toString()}`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                {params.page < pagination.totalPages && (
                  <Button
                    variant="outline"
                    href={`/directory?${new URLSearchParams({
                      ...searchParams,
                      page: String(params.page + 1),
                    }).toString()}`}
                  >
                    Next
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No professionals found matching your search criteria.
            </p>
            <Button variant="outline" href="/directory">
              Clear filters
            </Button>
          </div>
        )}
      </section>

      {/* SEO Content */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">
            Finding the Right ADHD Professional in NSW
          </h2>
          <div className="prose max-w-none">
            <p>
              Our directory helps you find qualified ADHD specialists across New South Wales. 
              Whether you're looking for a psychiatrist for medication management, a psychologist 
              for therapy, or an ADHD coach for practical strategies, you can search by location, 
              specialty, and specific needs.
            </p>
            <h3>Types of ADHD Professionals</h3>
            <ul>
              <li><strong>Psychiatrists</strong>: Medical doctors who can diagnose ADHD and prescribe medication</li>
              <li><strong>Psychologists</strong>: Provide therapy and behavioral interventions</li>
              <li><strong>ADHD Coaches</strong>: Help with practical life skills and strategies</li>
              <li><strong>Occupational Therapists</strong>: Support daily living skills and sensory needs</li>
            </ul>
            <h3>Popular Searches</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" size="sm" href="/directory?services=psychiatrist">
                ADHD Psychiatrists
              </Button>
              <Button variant="outline" size="sm" href="/directory?location=Sydney">
                Sydney ADHD Specialists
              </Button>
              <Button variant="outline" size="sm" href="/directory?telehealth=true">
                Telehealth Options
              </Button>
              <Button variant="outline" size="sm" href="/directory?ndis=true">
                NDIS Providers
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Loading state
function DirectoryLoading() {
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

// Generate metadata for SEO
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const seoMeta = SEOService.generateDirectoryMeta({
    location: searchParams.location as string,
    service: searchParams.services as string,
    page: parseInt(searchParams.page as string) || 1,
  })

  return {
    title: seoMeta.title,
    description: seoMeta.description,
    openGraph: {
      title: seoMeta.openGraph?.title || seoMeta.title,
      description: seoMeta.openGraph?.description || seoMeta.description,
      type: 'website',
      url: seoMeta.canonical,
    },
    twitter: {
      card: 'summary',
      title: seoMeta.twitter?.title || seoMeta.title,
      description: seoMeta.twitter?.description || seoMeta.description,
    },
  }
}

export default function DirectoryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <Suspense fallback={<DirectoryLoading />}>
      <DirectoryContent searchParams={searchParams} />
    </Suspense>
  )
}