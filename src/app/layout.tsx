import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/features/adhdnsw/components/layout/Header'
import { Footer } from '@/features/adhdnsw/components/layout/Footer'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://adhdnsw.org'),
  title: {
    default: 'ADHD NSW - Find ADHD Specialists & Resources in New South Wales',
    template: '%s | ADHD NSW',
  },
  description: 'Comprehensive directory of ADHD professionals, latest news, and expert resources for ADHD support in NSW. Find psychiatrists, psychologists, and coaches near you.',
  keywords: ['ADHD', 'NSW', 'ADHD specialist', 'ADHD psychiatrist', 'ADHD psychologist', 'ADHD diagnosis', 'ADHD treatment', 'New South Wales'],
  authors: [{ name: 'ADHD NSW' }],
  creator: 'ADHD NSW',
  publisher: 'ADHD NSW',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://adhdnsw.org',
    siteName: 'ADHD NSW',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'ADHD NSW - Your Guide to ADHD Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@adhdnsw',
    creator: '@adhdnsw',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}