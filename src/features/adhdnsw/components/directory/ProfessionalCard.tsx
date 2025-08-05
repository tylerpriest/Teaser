import Link from 'next/link'

import { MapPin, Phone, Globe, CheckCircle, Clock } from 'lucide-react'

import type { Professional } from '../../types'

import { Button } from '@/shared/components/button'
import { cn } from '@/shared/lib/utils'

interface ProfessionalCardProps {
  professional: Professional
  className?: string
}

export function ProfessionalCard({ professional, className }: ProfessionalCardProps) {
  const fullName = `${professional.title} ${professional.firstName} ${professional.lastName}`
  const primaryLocation = professional.locations?.find(l => l.isPrimary)
  const services = professional.services?.slice(0, 3) || []
  
  return (
    <article className={cn("bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">
            <Link 
              href={`/professionals/${professional.slug}`}
              className="text-primary hover:underline"
            >
              {fullName}
            </Link>
          </h3>
          {professional.credentials.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {professional.credentials.join(', ')}
            </p>
          )}
        </div>
        {professional.isVerified && (
          <CheckCircle className="h-5 w-5 text-green-600" aria-label="Verified professional" />
        )}
      </div>

      {/* Services */}
      <div className="flex flex-wrap gap-2 mb-4">
        {services.map(service => (
          <span 
            key={service.id}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
          >
            {service.name}
          </span>
        ))}
        {professional.services && professional.services.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{professional.services.length - 3} more
          </span>
        )}
      </div>

      {/* Location */}
      {primaryLocation && (
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm">
              {primaryLocation.suburb}, {primaryLocation.state} {primaryLocation.postcode}
            </p>
            {primaryLocation.offersTelehealth && (
              <p className="text-xs text-muted-foreground">Telehealth available</p>
            )}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        {professional.phone && (
          <a 
            href={`tel:${professional.phone}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Phone className="h-3.5 w-3.5" />
            {professional.phone}
          </a>
        )}
        {professional.website && (
          <a 
            href={professional.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            Website
          </a>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          {professional.acceptsNewPatients ? (
            <span className="text-green-600 font-medium">Accepting new patients</span>
          ) : (
            <span className="text-orange-600 font-medium">Waitlist only</span>
          )}
          {professional.waitlistWeeks && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {professional.waitlistWeeks} week wait
            </span>
          )}
        </div>
        
        <Button size="sm" variant="outline" asChild>
          <Link href={`/professionals/${professional.slug}`}>
            View Profile
          </Link>
        </Button>
      </div>

      {/* Additional badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {professional.ndisRegistered && (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
            NDIS Registered
          </span>
        )}
        {professional.languages.some(l => l !== 'English') && (
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
            Multilingual
          </span>
        )}
      </div>
    </article>
  )
}