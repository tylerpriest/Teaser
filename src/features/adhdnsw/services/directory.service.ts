import type {
  Professional,
  Location,
  DirectorySearchParams,
  PaginatedResponse,
  ServiceType,
  AgeGroup,
} from '../types'

import { supabase } from '@/shared/services/supabase'

export class DirectoryService {
  /**
   * Search professionals with filters and location-based sorting
   */
  static async searchProfessionals(
    params: DirectorySearchParams
  ): Promise<PaginatedResponse<Professional>> {
    const {
      query,
      location,
      radius = 50,
      services = [],
      ageGroups = [],
      languages = [],
      ndisOnly = false,
      telehealthOnly = false,
      acceptingNewPatients = false,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = params

    // Start with base query
    let queryBuilder = supabase
      .from('professionals')
      .select(`
        *,
        locations!inner(
          id,
          name,
          street_address,
          suburb,
          state,
          postcode,
          latitude,
          longitude,
          is_primary,
          offers_telehealth
        ),
        professional_services!inner(
          service_type:service_types(
            id,
            slug,
            name,
            category
          )
        ),
        professional_age_groups!inner(
          age_group:age_groups(
            id,
            slug,
            name
          )
        ),
        professional_payment_methods!inner(
          payment_method:payment_methods(
            id,
            slug,
            name
          ),
          bulk_billing_available
        )
      `, { count: 'exact' })
      .eq('is_active', true)

    // Apply filters
    if (acceptingNewPatients) {
      queryBuilder = queryBuilder.eq('accepts_new_patients', true)
    }

    if (ndisOnly) {
      queryBuilder = queryBuilder.eq('ndis_registered', true)
    }

    if (telehealthOnly) {
      queryBuilder = queryBuilder.eq('locations.offers_telehealth', true)
    }

    // Service type filter
    if (services.length > 0) {
      queryBuilder = queryBuilder.in(
        'professional_services.service_type.slug',
        services
      )
    }

    // Age group filter
    if (ageGroups.length > 0) {
      queryBuilder = queryBuilder.in(
        'professional_age_groups.age_group.slug',
        ageGroups
      )
    }

    // Language filter
    if (languages.length > 0) {
      queryBuilder = queryBuilder.contains('languages', languages)
    }

    // Full text search
    if (query) {
      queryBuilder = queryBuilder.textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english',
      })
    }

    // Location-based filtering
    if (location && radius) {
      // This would require PostGIS extension and custom RPC function
      // For now, we'll filter by suburb/postcode
      queryBuilder = queryBuilder.or(
        `locations.suburb.ilike.%${location}%,locations.postcode.eq.${location}`
      )
    }

    // Apply pagination
    const offset = (page - 1) * limit
    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    // Apply sorting
    switch (sortBy) {
      case 'name':
        queryBuilder = queryBuilder.order('last_name').order('first_name')
        break
      case 'distance':
        // Would require PostGIS distance calculation
        queryBuilder = queryBuilder.order('locations.suburb')
        break
      case 'relevance':
      default:
        if (query) {
          // Results are already ordered by relevance from text search
        } else {
          queryBuilder = queryBuilder.order('is_verified', { ascending: false })
        }
    }

    const { data, error, count } = await queryBuilder

    if (error) {
      throw new Error(`Failed to search professionals: ${error.message}`)
    }

    // Transform the data
    const professionals = this.transformProfessionalData(data || [])

    return {
      data: professionals,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    }
  }

  /**
   * Get a single professional by slug
   */
  static async getProfessionalBySlug(slug: string): Promise<Professional | null> {
    const { data, error } = await supabase
      .from('professionals')
      .select(`
        *,
        locations(
          *
        ),
        professional_services(
          service_type:service_types(*)
        ),
        professional_age_groups(
          age_group:age_groups(*)
        ),
        professional_payment_methods(
          payment_method:payment_methods(*),
          bulk_billing_available
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching professional:', error)
      return null
    }

    return this.transformProfessional(data)
  }

  /**
   * Get nearby professionals based on coordinates
   */
  static async getNearbyProfessionals(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    limit: number = 10
  ): Promise<Professional[]> {
    // This would use PostGIS ST_DWithin function via RPC
    const { data, error } = await supabase.rpc('get_nearby_professionals', {
      lat: latitude,
      lng: longitude,
      radius_meters: radiusKm * 1000,
      result_limit: limit,
    })

    if (error) {
      console.error('Error fetching nearby professionals:', error)
      return []
    }

    return this.transformProfessionalData(data || [])
  }

  /**
   * Get all service types
   */
  static async getServiceTypes(): Promise<ServiceType[]> {
    const { data, error } = await supabase
      .from('service_types')
      .select('*')
      .order('display_order')

    if (error) {
      console.error('Error fetching service types:', error)
      return []
    }

    return data || []
  }

  /**
   * Get all age groups
   */
  static async getAgeGroups(): Promise<AgeGroup[]> {
    const { data, error } = await supabase
      .from('age_groups')
      .select('*')
      .order('min_age')

    if (error) {
      console.error('Error fetching age groups:', error)
      return []
    }

    return data || []
  }

  /**
   * Transform raw database data to Professional type
   */
  private static transformProfessional(data: Record<string, unknown>): Professional {
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      firstName: data.first_name,
      lastName: data.last_name,
      credentials: data.credentials || [],
      registrationNumber: data.registration_number,
      email: data.email,
      phone: data.phone,
      website: data.website,
      bookingUrl: data.booking_url,
      isVerified: data.is_verified,
      verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined,
      isActive: data.is_active,
      acceptsNewPatients: data.accepts_new_patients,
      waitlistWeeks: data.waitlist_weeks,
      bio: data.bio,
      approach: data.approach,
      specializations: data.specializations || [],
      languages: data.languages || [],
      ndisRegistered: data.ndis_registered,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      locations: data.locations?.map(this.transformLocation),
      services: (data.professional_services as Record<string, unknown>[])?.map((ps: Record<string, unknown>) => ps.service_type),
      ageGroups: (data.professional_age_groups as Record<string, unknown>[])?.map((pa: Record<string, unknown>) => pa.age_group),
      paymentMethods: (data.professional_payment_methods as Record<string, unknown>[])?.map((pp: Record<string, unknown>) => ({
        ...pp.payment_method,
        bulkBillingAvailable: pp.bulk_billing_available,
      })),
    }
  }

  private static transformProfessionalData(data: Record<string, unknown>[]): Professional[] {
    return data.map(this.transformProfessional)
  }

  private static transformLocation(data: Record<string, unknown>): Location {
    return {
      id: data.id,
      professionalId: data.professional_id,
      name: data.name,
      streetAddress: data.street_address,
      suburb: data.suburb,
      state: data.state,
      postcode: data.postcode,
      latitude: data.latitude,
      longitude: data.longitude,
      phone: data.phone,
      email: data.email,
      isPrimary: data.is_primary,
      offersTelehealth: data.offers_telehealth,
    }
  }
}