import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap - ADHD NSW',
  description: 'Site navigation and directory of all pages on ADHD NSW.',
}

export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Site Map</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Main Pages</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/directory"
                  className="text-primary hover:underline"
                >
                  Professional Directory
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-primary hover:underline">
                  Blog & Resources
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Directory Filters</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/directory?services=psychiatrist"
                  className="text-primary hover:underline"
                >
                  Psychiatrists
                </Link>
              </li>
              <li>
                <Link
                  href="/directory?services=psychologist"
                  className="text-primary hover:underline"
                >
                  Psychologists
                </Link>
              </li>
              <li>
                <Link
                  href="/directory?services=paediatrician"
                  className="text-primary hover:underline"
                >
                  Paediatricians
                </Link>
              </li>
              <li>
                <Link
                  href="/directory?services=adhd-coach"
                  className="text-primary hover:underline"
                >
                  ADHD Coaches
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Popular Locations</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/directory?location=Sydney"
                  className="text-primary hover:underline"
                >
                  Sydney ADHD Services
                </Link>
              </li>
              <li>
                <Link
                  href="/directory?location=Newcastle"
                  className="text-primary hover:underline"
                >
                  Newcastle ADHD Services
                </Link>
              </li>
              <li>
                <Link
                  href="/directory?location=Wollongong"
                  className="text-primary hover:underline"
                >
                  Wollongong ADHD Services
                </Link>
              </li>
              <li>
                <Link
                  href="/directory?location=Central Coast"
                  className="text-primary hover:underline"
                >
                  Central Coast ADHD Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Legal & Support</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Use
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="text-primary hover:underline">
                  XML Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
