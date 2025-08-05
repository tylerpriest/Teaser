import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MapPin, Phone, Mail, Globe, CheckCircle, Clock, DollarSign } from 'lucide-react'

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
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const professional = await DirectoryService.getProfessionalBySlug(params.slug)
  
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
  const professional = await DirectoryService.getProfessionalBySlug(params.slug)

  if (!professional) {
    notFound()
  }

  const fullName = `${professional.title} ${professional.firstName} ${professional.lastName}`
  const primaryLocation = professional.locations?.find(l => l.isPrimary)
  const otherLocations = professional.locations?.filter(l => !l.isPrimary) || []

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
              <li><a href="/" className="text-muted-foreground hover:text-foreground">Home</a></li>
              <li className="text-muted-foreground">/</li>
              <li><a href="/directory" className="text-muted-foreground hover:text-foreground">Directory</a></li>
              <li className="text-muted-foreground">/</li>
              <li className="font-medium">{fullName}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Profile Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                {fullName}
                {professional.isVerified && (
                  <CheckCircle className="h-6 w-6 text-green-600" aria-label="Verified professional" />
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
                  <a href={professional.bookingUrl} target="_blank" rel="noopener noreferrer">
                    Book Appointment
                  </a>
                </Button>
              )}
              {professional.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${professional.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h2 className="font-semibold mb-3">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {professional.services?.map(service => (
                <span 
                  key={service.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>

          {/* Specializations */}
          {professional.specializations.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Areas of Specialization</h2>
              <ul className="list-disc list-inside space-y-1">
                {professional.specializations.map((spec, index) => (
                  <li key={index} className="text-muted-foreground">{spec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Availability</h3>
              </div>
              {professional.acceptsNewPatients ? (
                <p className="text-green-600 font-medium">Accepting new patients</p>
              ) : (
                <p className="text-orange-600 font-medium">Waitlist only</p>
              )}
              {professional.waitlistWeeks && (
                <p className="text-sm text-muted-foreground mt-1">
                  Approx. {professional.waitlistWeeks} week wait
                </p>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Payment Options</h3>
              </div>
              {professional.paymentMethods?.map(method => (
                <p key={method.id} className="text-sm">
                  {method.name}
                  {method.bulkBillingAvailable && (
                    <span className="text-green-600 ml-1">(Bulk billing available)</span>
                  )}
                </p>
              ))}
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Additional Info</h3>
              {professional.ndisRegistered && (
                <p className="text-sm mb-1">✓ NDIS Registered</p>
              )}
              {professional.languages.length > 1 && (
                <p className="text-sm mb-1">
                  Languages: {professional.languages.join(', ')}
                </p>
              )}
              {professional.ageGroups && (
                <p className="text-sm">
                  Ages: {professional.ageGroups.map(ag => ag.name).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {(professional.bio || professional.approach) && (
        <section className="container mx-auto px-4 pb-8">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-semibold mb-4">About {professional.firstName}</h2>
            {professional.bio && (
              <div className="prose max-w-none mb-6">
                <p>{professional.bio}</p>
              </div>
            )}
            {professional.approach && (
              <>
                <h3 className="text-lg font-semibold mb-2">Treatment Approach</h3>
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
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-semibold mb-4">Locations</h2>
          
          {/* Primary Location */}
          {primaryLocation && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                {primaryLocation.name}
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Primary</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>{primaryLocation.streetAddress}</p>
                      <p>{primaryLocation.suburb}, {primaryLocation.state} {primaryLocation.postcode}</p>
                    </div>
                  </div>
                  {primaryLocation.phone && (
                    <a 
                      href={`tel:${primaryLocation.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2"
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
                    <p className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded inline-block">
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
              <h3 className="font-semibold mb-3">Other Locations</h3>
              <div className="space-y-4">
                {otherLocations.map(location => (
                  <div key={location.id} className="border-l-2 pl-4">
                    <h4 className="font-medium mb-1">{location.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {location.suburb}, {location.state} {location.postcode}
                    </p>
                    {location.offersTelehealth && (
                      <p className="text-xs text-blue-600 mt-1">Telehealth available</p>
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
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Book?</h2>
          <p className="text-muted-foreground mb-6">
            Contact {professional.firstName} directly to schedule an appointment or learn more about their services.
          </p>
          <div className="flex justify-center gap-4">
            {professional.bookingUrl && (
              <Button size="lg" asChild>
                <a href={professional.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Book Online
                </a>
              </Button>
            )}
            {professional.phone && (
              <Button size="lg" variant="outline" asChild>
                <a href={`tel:${professional.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  {professional.phone}
                </a>
              </Button>
            )}
            {professional.website && (
              <Button size="lg" variant="outline" asChild>
                <a href={professional.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
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