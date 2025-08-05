import { Mail, Phone, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - ADHD NSW',
  description:
    'Get in touch with ADHD NSW for questions about our directory and resources.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Contact Us</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Get in Touch</h2>
            <p className="mb-6 text-muted-foreground">
              Have questions about our directory or need help finding ADHD
              support services in NSW? We&apos;re here to help.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>hello@adhdnsw.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>Available via email</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>New South Wales, Australia</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-semibold">
              Professional Listings
            </h2>
            <p className="mb-4 text-muted-foreground">
              Are you an ADHD professional in NSW? We&apos;d love to include you
              in our directory.
            </p>
            <p className="text-muted-foreground">
              Please email us with your practice details and we&apos;ll get back
              to you about listing requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
