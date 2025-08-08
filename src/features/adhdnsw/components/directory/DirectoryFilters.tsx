'use client'

import { Search, MapPin, Filter, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/shared/components/button'
import { cn } from '@/shared/lib/utils'

import type { ServiceType, AgeGroup } from '../../types'

interface DirectoryFiltersProps {
  services: ServiceType[]
  ageGroups: AgeGroup[]
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

export interface FilterState {
  query: string
  location: string
  services: string[]
  ageGroups: string[]
  ndisOnly: boolean
  telehealthOnly: boolean
  acceptingNewPatients: boolean
}

const initialFilters: FilterState = {
  query: '',
  location: '',
  services: [],
  ageGroups: [],
  ndisOnly: false,
  telehealthOnly: false,
  acceptingNewPatients: false,
}

export function DirectoryFilters({ 
  services, 
  ageGroups, 
  onFiltersChange,
  className 
}: DirectoryFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleService = (serviceSlug: string) => {
    const newServices = filters.services.includes(serviceSlug)
      ? filters.services.filter(s => s !== serviceSlug)
      : [...filters.services, serviceSlug]
    updateFilter('services', newServices)
  }

  const toggleAgeGroup = (ageGroupSlug: string) => {
    const newAgeGroups = filters.ageGroups.includes(ageGroupSlug)
      ? filters.ageGroups.filter(a => a !== ageGroupSlug)
      : [...filters.ageGroups, ageGroupSlug]
    updateFilter('ageGroups', newAgeGroups)
  }

  const clearFilters = () => {
    setFilters(initialFilters)
    onFiltersChange(initialFilters)
  }

  const activeFilterCount = 
    filters.services.length + 
    filters.ageGroups.length + 
    (filters.ndisOnly ? 1 : 0) + 
    (filters.telehealthOnly ? 1 : 0) + 
    (filters.acceptingNewPatients ? 1 : 0)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="relative sm:w-64">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Suburb or postcode..."
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
          {/* Service Types */}
          <div>
            <h3 className="font-medium mb-3">Service Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {services.map(service => (
                <label
                  key={service.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.services.includes(service.slug)}
                    onChange={() => toggleService(service.slug)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{service.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Age Groups */}
          <div>
            <h3 className="font-medium mb-3">Age Groups</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ageGroups.map(ageGroup => (
                <label
                  key={ageGroup.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.ageGroups.includes(ageGroup.slug)}
                    onChange={() => toggleAgeGroup(ageGroup.slug)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{ageGroup.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <h3 className="font-medium mb-3">Additional Options</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.acceptingNewPatients}
                  onChange={(e) => updateFilter('acceptingNewPatients', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Accepting new patients</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.telehealthOnly}
                  onChange={(e) => updateFilter('telehealthOnly', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Offers telehealth</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ndisOnly}
                  onChange={(e) => updateFilter('ndisOnly', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">NDIS registered only</span>
              </label>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filter Pills */}
      {activeFilterCount > 0 && !showAdvanced && (
        <div className="flex flex-wrap gap-2">
          {filters.services.map(serviceSlug => {
            const service = services.find(s => s.slug === serviceSlug)
            return service ? (
              <span
                key={serviceSlug}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-sm"
              >
                {service.name}
                <button
                  onClick={() => toggleService(serviceSlug)}
                  className="hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ) : null
          })}
          
          {filters.acceptingNewPatients && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-sm">
              Accepting patients
              <button
                onClick={() => updateFilter('acceptingNewPatients', false)}
                className="hover:text-green-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.telehealthOnly && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-sm">
              Telehealth
              <button
                onClick={() => updateFilter('telehealthOnly', false)}
                className="hover:text-blue-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.ndisOnly && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-sm">
              NDIS only
              <button
                onClick={() => updateFilter('ndisOnly', false)}
                className="hover:text-purple-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}