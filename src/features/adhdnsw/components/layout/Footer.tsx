import Link from 'next/link'

import { Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  directory: [
    { name: 'Find Professionals', href: '/directory' },
    { name: 'Psychiatrists', href: '/directory?services=psychiatrist' },
    { name: 'Psychologists', href: '/directory?services=psychologist' },
    { name: 'Telehealth Options', href: '/directory?telehealth=true' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Diagnosis Guides', href: '/blog?category=diagnosis-guides' },
    { name: 'Treatment Info', href: '/blog?category=treatment-options' },
    { name: 'NDIS & ADHD', href: '/blog/adhd-ndis-support-nsw' },
  ],
  about: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
  ],
  locations: [
    { name: 'Sydney', href: '/directory?location=Sydney' },
    { name: 'Newcastle', href: '/directory?location=Newcastle' },
    { name: 'Wollongong', href: '/directory?location=Wollongong' },
    { name: 'Central Coast', href: '/directory?location=Central Coast' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">ADHD</span>
              <span className="text-2xl font-bold text-primary ml-1">NSW</span>
            </Link>
            <p className="text-sm mb-4">
              Your trusted guide to ADHD support services and professionals across New South Wales.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/adhdnsw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/adhdnsw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@adhdnsw.org"
                className="hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Directory */}
          <div>
            <h3 className="text-white font-semibold mb-4">Directory</h3>
            <ul className="space-y-2">
              {footerLinks.directory.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Areas</h3>
            <ul className="space-y-2">
              {footerLinks.locations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name} ADHD Services
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                <a
                  href="mailto:info@adhdnsw.org"
                  className="text-sm hover:text-white transition-colors"
                >
                  info@adhdnsw.org
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">1300 ADHD NSW</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Serving all of<br />New South Wales
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} ADHD NSW. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm hover:text-white transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                href="/sitemap"
                className="text-sm hover:text-white transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-6 text-xs text-gray-500">
            <p>
              The information on this website is for general informational purposes only 
              and should not be considered medical advice. Always consult with qualified 
              healthcare professionals for diagnosis and treatment of ADHD.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}