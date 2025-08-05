// ADHDNSW.org Type Definitions

export interface Professional {
  id: string
  slug: string
  title: string
  firstName: string
  lastName: string
  credentials: string[]
  registrationNumber?: string
  email?: string
  phone?: string
  website?: string
  bookingUrl?: string
  
  // Verification
  isVerified: boolean
  verifiedAt?: Date
  
  // Status
  isActive: boolean
  acceptsNewPatients: boolean
  waitlistWeeks?: number
  
  // Profile
  bio?: string
  approach?: string
  specializations: string[]
  languages: string[]
  
  // NDIS
  ndisRegistered: boolean
  
  // SEO
  metaTitle?: string
  metaDescription?: string
  
  // Relations
  locations?: Location[]
  services?: ServiceType[]
  ageGroups?: AgeGroup[]
  paymentMethods?: PaymentMethod[]
}

export interface Location {
  id: string
  professionalId: string
  name: string
  streetAddress: string
  suburb: string
  state: string
  postcode: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  isPrimary: boolean
  offersTelehealth: boolean
}

export interface ServiceType {
  id: string
  slug: string
  name: string
  description?: string
  category: 'medical' | 'therapy' | 'coaching' | 'assessment'
  displayOrder: number
}

export interface AgeGroup {
  id: string
  slug: string
  name: string
  minAge?: number
  maxAge?: number
}

export interface PaymentMethod {
  id: string
  slug: string
  name: string
  description?: string
  bulkBillingAvailable?: boolean
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  featuredImage?: string
  
  // Author
  authorName: string
  authorBio?: string
  authorImage?: string
  
  // Status
  status: 'draft' | 'published' | 'archived'
  publishedAt?: Date
  
  // SEO
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  
  // Categorization
  isFeatured: boolean
  isEvergreen: boolean
  
  // Dates
  createdAt: Date
  updatedAt: Date
  
  // Relations
  categories?: BlogCategory[]
  tags?: BlogTag[]
}

export interface BlogCategory {
  id: string
  slug: string
  name: string
  description?: string
  parentId?: string
  displayOrder: number
  metaTitle?: string
  metaDescription?: string
}

export interface BlogTag {
  id: string
  slug: string
  name: string
}

// Search & Filter Types
export interface DirectorySearchParams {
  query?: string
  location?: string
  radius?: number
  services?: string[]
  ageGroups?: string[]
  languages?: string[]
  ndisOnly?: boolean
  telehealthOnly?: boolean
  acceptingNewPatients?: boolean
  sortBy?: 'relevance' | 'distance' | 'name'
  page?: number
  limit?: number
}

export interface BlogSearchParams {
  query?: string
  categories?: string[]
  tags?: string[]
  featured?: boolean
  page?: number
  limit?: number
}

// SEO Types
export interface SEOMetadata {
  title: string
  description: string
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    image?: string
    type?: string
  }
  twitter?: {
    card?: string
    title?: string
    description?: string
    image?: string
  }
  jsonLd?: any
}

// Response Types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface APIError {
  message: string
  code?: string
  field?: string
}