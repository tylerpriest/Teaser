'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">ADHD</span>
              <span className="text-2xl font-bold text-foreground ml-1">NSW</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setOpenSubmenu(item.name)}
                onMouseLeave={() => setOpenSubmenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center text-foreground hover:text-primary transition-colors py-2",
                    item.submenu && "pr-1"
                  )}
                >
                  {item.name}
                  {item.submenu && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Link>
                
                {/* Dropdown */}
                {item.submenu && openSubmenu === item.name && (
                  <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
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
          <div className="hidden md:flex items-center space-x-4">
            <Button size="sm" variant="outline" asChild>
              <Link href="/directory">
                <Search className="h-4 w-4 mr-2" />
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
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="pl-6">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                    <Search className="h-4 w-4 mr-2" />
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