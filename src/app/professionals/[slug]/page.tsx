import {
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DirectoryService } from '@/features/adhdnsw/services/directory.service'
import { SEOService } from '@/features/adhdnsw/services/seo.service'
import { Button } from '@/shared/components/button'

interface PageProps {
  params: { slug: string }
}

// Generate static params for popular professionals
export async function generateStaticParams() {
  // In production, this would fetch top professionals
  return []
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  let professional

  try {
    professional = await DirectoryService.getProfessionalBySlug(params.slug)
  } catch {
    professional = null
  }

  if (!professional) {
    return {
      title: 'Professional Not Found - ADHD NSW',
      description: 'The requested professional profile could not be found.',
    }
  }

  const seoMeta = SEOService.generateProfessionalMeta(professional)

  return {
    title: seoMeta.title,
    description: seoMeta.description,
    openGraph: {
      title: seoMeta.openGraph?.title || seoMeta.title,
      description: seoMeta.openGraph?.description || seoMeta.description,
      type: 'profile',
      url: seoMeta.canonical,
    },
    twitter: {
      card: 'summary',
      title: seoMeta.twitter?.title || seoMeta.title,
      description: seoMeta.twitter?.description || seoMeta.description,
    },
  }
}

export default async function ProfessionalProfilePage({ params }: PageProps) {
  let professional: Awaited<
    ReturnType<typeof DirectoryService.getProfessionalBySlug>
  >

  try {
    professional = await DirectoryService.getProfessionalBySlug(params.slug)
  } catch {
    notFound()
  }

  if (!professional) {
    notFound()
  }

  const fullName = `${professional.title} ${professional.firstName} ${professional.lastName}`
  const primaryLocation = professional.locations?.find((l) => l.isPrimary)
  const otherLocations =
    professional.locations?.filter((l) => !l.isPrimary) || []

  // Generate structured data
  const jsonLd = SEOService.generateProfessionalSchema(professional)
  const breadcrumbSchema = SEOService.generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Directory', url: '/directory' },
    { name: fullName, url: `/professionals/${professional.slug}` },
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
                <a
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </a>
              </li>
              <li className="text-muted-foreground">/</li>
              <li>
                <a
                  href="/directory"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Directory
                </a>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="font-medium">{fullName}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Profile Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
                {fullName}
                {professional.isVerified && (
                  <CheckCircle
                    className="h-6 w-6 text-green-600"
                    aria-label="Verified professional"
                  />
                )}
              </h1>
              {professional.credentials.length > 0 && (
                <p className="text-lg text-muted-foreground">
                  {professional.credentials.join(', ')}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              {professional.bookingUrl && (
                <Button asChild>
                  <a
                    href={professional.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Appointment
                  </a>
                </Button>
              )}
              {professional.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${professional.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h2 className="mb-3 font-semibold">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {professional.services?.map((service) => (
                <span
                  key={service.id}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>

          {/* Specializations */}
          {professional.specializations.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 font-semibold">Areas of Specialization</h2>
              <ul className="list-inside list-disc space-y-1">
                {professional.specializations.map((spec, index) => (
                  <li key={index} className="text-muted-foreground">
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Availability</h3>
              </div>
              {professional.acceptsNewPatients ? (
                <p className="font-medium text-green-600">
                  Accepting new patients
                </p>
              ) : (
                <p className="font-medium text-orange-600">Waitlist only</p>
              )}
              {professional.waitlistWeeks && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Approx. {professional.waitlistWeeks} week wait
                </p>
              )}
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Payment Options</h3>
              </div>
              {professional.paymentMethods?.map((method) => (
                <p key={method.id} className="text-sm">
                  {method.name}
                  {method.bulkBillingAvailable && (
                    <span className="ml-1 text-green-600">
                      (Bulk billing available)
                    </span>
                  )}
                </p>
              ))}
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Additional Info</h3>
              {professional.ndisRegistered && (
                <p className="mb-1 text-sm">✓ NDIS Registered</p>
              )}
              {professional.languages.length > 1 && (
                <p className="mb-1 text-sm">
                  Languages: {professional.languages.join(', ')}
                </p>
              )}
              {professional.ageGroups && (
                <p className="text-sm">
                  Ages: {professional.ageGroups.map((ag) => ag.name).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {(professional.bio || professional.approach) && (
        <section className="container mx-auto px-4 pb-8">
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">
              About {professional.firstName}
            </h2>
            {professional.bio && (
              <div className="prose mb-6 max-w-none">
                <p>{professional.bio}</p>
              </div>
            )}
            {professional.approach && (
              <>
                <h3 className="mb-2 text-lg font-semibold">
                  Treatment Approach
                </h3>
                <div className="prose max-w-none">
                  <p>{professional.approach}</p>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Locations */}
      <section className="container mx-auto px-4 pb-8">
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">Locations</h2>

          {/* Primary Location */}
          {primaryLocation && (
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                {primaryLocation.name}
                <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                  Primary
                </span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{primaryLocation.streetAddress}</p>
                      <p>
                        {primaryLocation.suburb}, {primaryLocation.state}{' '}
                        {primaryLocation.postcode}
                      </p>
                    </div>
                  </div>
                  {primaryLocation.phone && (
                    <a
                      href={`tel:${primaryLocation.phone}`}
                      className="mb-2 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-4 w-4" />
                      {primaryLocation.phone}
                    </a>
                  )}
                  {primaryLocation.email && (
                    <a
                      href={`mailto:${primaryLocation.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Mail className="h-4 w-4" />
                      {primaryLocation.email}
                    </a>
                  )}
                </div>
                <div>
                  {primaryLocation.offersTelehealth && (
                    <p className="inline-block rounded bg-blue-50 px-3 py-1 text-sm text-blue-700">
                      Telehealth available
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other Locations */}
          {otherLocations.length > 0 && (
            <>
              <h3 className="mb-3 font-semibold">Other Locations</h3>
              <div className="space-y-4">
                {otherLocations.map((location) => (
                  <div key={location.id} className="border-l-2 pl-4">
                    <h4 className="mb-1 font-medium">{location.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {location.suburb}, {location.state} {location.postcode}
                    </p>
                    {location.offersTelehealth && (
                      <p className="mt-1 text-xs text-blue-600">
                        Telehealth available
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-semibold">Ready to Book?</h2>
          <p className="mb-6 text-muted-foreground">
            Contact {professional.firstName} directly to schedule an appointment
            or learn more about their services.
          </p>
          <div className="flex justify-center gap-4">
            {professional.bookingUrl && (
              <Button size="lg" asChild>
                <a
                  href={professional.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Online
                </a>
              </Button>
            )}
            {professional.phone && (
              <Button size="lg" variant="outline" asChild>
                <a href={`tel:${professional.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  {professional.phone}
                </a>
              </Button>
            )}
            {professional.website && (
              <Button size="lg" variant="outline" asChild>
                <a
                  href={professional.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Visit Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
