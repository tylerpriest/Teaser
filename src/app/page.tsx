import {
  Search,
  Users,
  BookOpen,
  ChevronRight,
  MapPin,
  Phone,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { BlogPostCard } from '@/features/adhdnsw/components/blog/BlogPostCard'
import { ProfessionalCard } from '@/features/adhdnsw/components/directory/ProfessionalCard'
import { BlogService } from '@/features/adhdnsw/services/blog.service'
import { DirectoryService } from '@/features/adhdnsw/services/directory.service'
import { SEOService } from '@/features/adhdnsw/services/seo.service'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'

export const metadata: Metadata = {
  title: 'ADHD NSW - Find ADHD Specialists & Resources in New South Wales',
  description:
    'Comprehensive directory of ADHD professionals, latest news, and expert resources for ADHD support in NSW. Find psychiatrists, psychologists, and coaches near you.',
  openGraph: {
    title: 'ADHD NSW - Your Guide to ADHD Support in New South Wales',
    description:
      'Find verified ADHD specialists, access expert resources, and stay updated with NSW-specific ADHD news and support services.',
    type: 'website',
    url: 'https://adhdnsw.org',
  },
}

export default async function HomePage() {
  // Fetch data for homepage
  let featuredProfessionals: Awaited<
    ReturnType<typeof DirectoryService.searchProfessionals>
  >
  let latestPosts: Awaited<ReturnType<typeof BlogService.getBlogPosts>>

  try {
    const results = await Promise.all([
      DirectoryService.searchProfessionals({
        limit: 3,
        sortBy: 'relevance',
        acceptingNewPatients: true,
      }),
      BlogService.getBlogPosts({ limit: 3, featured: true }),
    ])
    featuredProfessionals = results[0]
    latestPosts = results[1]
  } catch {
    // Default to empty data if fetch fails
    featuredProfessionals = {
      data: [],
      pagination: { total: 0, page: 1, limit: 3, totalPages: 0 },
    }
    latestPosts = {
      data: [],
      pagination: { total: 0, page: 1, limit: 3, totalPages: 0 },
    }
  }

  // Generate organization schema
  const orgSchema = SEOService.generateOrganizationSchema()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Your Guide to ADHD Support in NSW
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Find trusted ADHD specialists, access expert resources, and
              connect with support services across New South Wales.
            </p>

            {/* Quick Search */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
              <form className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search professionals by name or specialty..."
                    className="w-full py-3 pl-10 pr-4"
                  />
                </div>
                <div className="relative md:w-64">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Suburb or postcode"
                    className="w-full py-3 pl-10 pr-4"
                  />
                </div>
                <Button size="lg" type="submit">
                  Search Directory
                </Button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="text-muted-foreground">Popular:</span>
                <Link
                  href="/directory?services=psychiatrist"
                  className="text-primary hover:underline"
                >
                  ADHD Psychiatrist
                </Link>
                <Link
                  href="/directory?services=psychologist"
                  className="text-primary hover:underline"
                >
                  ADHD Psychologist
                </Link>
                <Link
                  href="/directory?location=Sydney"
                  className="text-primary hover:underline"
                >
                  Sydney
                </Link>
                <Link
                  href="/directory?telehealth=true"
                  className="text-primary hover:underline"
                >
                  Telehealth
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">
                  Verified Professionals
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">
                  Expert Articles
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">NSW</div>
                <div className="text-sm text-muted-foreground">
                  Wide Coverage
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Find the Right ADHD Support
          </h2>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Search & Filter</h3>
              <p className="text-muted-foreground">
                Find professionals by location, specialty, availability, and
                specific needs
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">View Profiles</h3>
              <p className="text-muted-foreground">
                Check qualifications, services, fees, and read detailed
                professional profiles
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Book Direct</h3>
              <p className="text-muted-foreground">
                Contact professionals directly through their preferred booking
                methods
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      {featuredProfessionals.data.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                Featured ADHD Professionals
              </h2>
              <Button variant="outline" asChild>
                <Link href="/directory">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredProfessionals.data.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Resources */}
      {latestPosts.data.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Latest ADHD Resources</h2>
              <Button variant="outline" asChild>
                <Link href="/blog">
                  All Articles
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {latestPosts.data.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Comprehensive ADHD Support Services
          </h2>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/directory?services=psychiatrist"
              className="rounded-lg bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <h3 className="mb-2 font-semibold">Psychiatrists</h3>
              <p className="text-sm text-muted-foreground">
                Medical specialists for diagnosis and medication management
              </p>
            </Link>
            <Link
              href="/directory?services=psychologist"
              className="rounded-lg bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <h3 className="mb-2 font-semibold">Psychologists</h3>
              <p className="text-sm text-muted-foreground">
                Therapy and behavioral strategies for ADHD management
              </p>
            </Link>
            <Link
              href="/directory?services=paediatrician"
              className="rounded-lg bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <h3 className="mb-2 font-semibold">Paediatricians</h3>
              <p className="text-sm text-muted-foreground">
                Specialized care for children and adolescents with ADHD
              </p>
            </Link>
            <Link
              href="/directory?services=adhd-coach"
              className="rounded-lg bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <h3 className="mb-2 font-semibold">ADHD Coaches</h3>
              <p className="text-sm text-muted-foreground">
                Practical life skills and organizational strategies
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Need Help Finding ADHD Support?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            Our directory makes it easy to find the right ADHD professional for
            your needs. Start your search today.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/directory">
                <Search className="mr-2 h-5 w-5" />
                Search Directory
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/blog/complete-guide-adhd-diagnosis-nsw">
                <BookOpen className="mr-2 h-5 w-5" />
                Diagnosis Guide
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Common Questions About ADHD in NSW
          </h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold">
                How do I get an ADHD diagnosis in NSW?
              </h3>
              <p className="text-muted-foreground">
                Start with your GP for a referral to a psychiatrist or
                paediatrician. The assessment process typically involves
                clinical interviews, questionnaires, and sometimes psychological
                testing.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold">
                Does Medicare cover ADHD assessments?
              </h3>
              <p className="text-muted-foreground">
                Medicare provides rebates for psychiatrist consultations with a
                referral. Psychological assessments may be partially covered
                under a Mental Health Care Plan.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold">
                What&apos;s the typical wait time for ADHD specialists in NSW?
              </h3>
              <p className="text-muted-foreground">
                Wait times vary: public system (6-12 months), private
                psychiatrists (2-4 months), telehealth options (2-6 weeks).
                Check individual profiles for current availability.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/blog?category=diagnosis-guides">
                Read More FAQs
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
