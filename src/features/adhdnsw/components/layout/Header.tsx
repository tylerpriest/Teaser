'use client'

import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/shared/components/button'
import { cn } from '@/shared/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Directory',
    href: '/directory',
    submenu: [
      { name: 'All Professionals', href: '/directory' },
      { name: 'Psychiatrists', href: '/directory?services=psychiatrist' },
      { name: 'Psychologists', href: '/directory?services=psychologist' },
      { name: 'ADHD Coaches', href: '/directory?services=adhd-coach' },
      { name: 'Telehealth Options', href: '/directory?telehealth=true' },
    ],
  },
  {
    name: 'Resources',
    href: '/blog',
    submenu: [
      { name: 'All Articles', href: '/blog' },
      { name: 'Diagnosis Guides', href: '/blog?category=diagnosis-guides' },
      { name: 'Treatment Options', href: '/blog?category=treatment-options' },
      { name: 'Living with ADHD', href: '/blog?category=living-with-adhd' },
      { name: 'NSW News', href: '/blog?category=nsw-news' },
    ],
  },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">ADHD</span>
              <span className="ml-1 text-2xl font-bold text-foreground">
                NSW
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setOpenSubmenu(item.name)}
                onMouseLeave={() => setOpenSubmenu(null)}
              >
                <Link
                  href={item.href as Route}
                  className={cn(
                    'flex items-center py-2 text-foreground transition-colors hover:text-primary',
                    item.submenu && 'pr-1'
                  )}
                >
                  {item.name}
                  {item.submenu && <ChevronDown className="ml-1 h-4 w-4" />}
                </Link>

                {/* Dropdown */}
                {item.submenu && openSubmenu === item.name && (
                  <div className="absolute left-0 mt-0 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href as Route}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center space-x-4 md:flex">
            <Button size="sm" variant="outline" asChild>
              <Link href="/directory">
                <Search className="mr-2 h-4 w-4" />
                Find a Professional
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href as Route}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="pl-6">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href as Route}
                          className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-3 py-2">
                <Button size="sm" className="w-full" asChild>
                  <Link href="/directory">
                    <Search className="mr-2 h-4 w-4" />
                    Find a Professional
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
