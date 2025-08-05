import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Professional } from '../../types'

import { ProfessionalCard } from './ProfessionalCard'

const mockProfessional: Professional = {
  id: '1',
  slug: 'dr-jane-smith',
  title: 'Dr',
  firstName: 'Jane',
  lastName: 'Smith',
  credentials: ['MBBS', 'FRANZCP'],
  email: 'jane@example.com',
  phone: '02 9999 9999',
  website: 'https://example.com',
  isVerified: true,
  isActive: true,
  acceptsNewPatients: true,
  waitlistWeeks: 2,
  bio: 'Experienced ADHD specialist',
  specializations: ['Adult ADHD', 'Women with ADHD'],
  languages: ['English'],
  ndisRegistered: true,
  locations: [{
    id: '1',
    professionalId: '1',
    name: 'Main Practice',
    streetAddress: '123 Main St',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    isPrimary: true,
    offersTelehealth: true,
  }],
  services: [{
    id: '1',
    slug: 'psychiatrist',
    name: 'Psychiatrist',
    category: 'medical',
    displayOrder: 1,
  }],
}

describe('ProfessionalCard', () => {
  it('renders professional name and credentials', () => {
    render(<ProfessionalCard professional={mockProfessional} />)
    
    expect(screen.getByText('Dr Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('MBBS, FRANZCP')).toBeInTheDocument()
  })

  it('shows verified badge when professional is verified', () => {
    render(<ProfessionalCard professional={mockProfessional} />)
    
    expect(screen.getByLabelText('Verified professional')).toBeInTheDocument()
  })

  it('displays location information', () => {
    render(<ProfessionalCard professional={mockProfessional} />)
    
    expect(screen.getByText('Sydney, NSW 2000')).toBeInTheDocument()
    expect(screen.getByText('Telehealth available')).toBeInTheDocument()
  })

  it('shows accepting new patients status', () => {
    render(<ProfessionalCard professional={mockProfessional} />)
    
    expect(screen.getByText('Accepting new patients')).toBeInTheDocument()
    expect(screen.getByText('2 week wait')).toBeInTheDocument()
  })

  it('displays NDIS badge when registered', () => {
    render(<ProfessionalCard professional={mockProfessional} />)
    
    expect(screen.getByText('NDIS Registered')).toBeInTheDocument()
  })

  it('renders View Profile link', () => {
    render(<ProfessionalCard professional={mockProfessional} />)
    
    const link = screen.getByRole('link', { name: 'View Profile' })
    expect(link).toHaveAttribute('href', '/professionals/dr-jane-smith')
  })
})