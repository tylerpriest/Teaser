import type { Meta, StoryObj } from '@storybook/react'
import { ProfessionalCard } from './ProfessionalCard'
import type { Professional } from '../../types'

const meta = {
  title: 'ADHDNSW/Directory/ProfessionalCard',
  component: ProfessionalCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfessionalCard>

export default meta
type Story = StoryObj<typeof meta>

const baseProfessional: Professional = {
  id: '1',
  slug: 'dr-sarah-chen',
  title: 'Dr',
  firstName: 'Sarah',
  lastName: 'Chen',
  credentials: ['MBBS', 'FRANZCP'],
  email: 'reception@drchenpsych.com.au',
  phone: '02 9999 9999',
  website: 'https://drchenpsych.com.au',
  isVerified: true,
  isActive: true,
  acceptsNewPatients: true,
  waitlistWeeks: 2,
  bio: 'Dr Sarah Chen is a consultant psychiatrist with over 15 years experience in ADHD diagnosis and treatment.',
  specializations: ['Adult ADHD', 'Women with ADHD', 'Anxiety and ADHD'],
  languages: ['English', 'Mandarin'],
  ndisRegistered: false,
  locations: [{
    id: '1',
    professionalId: '1',
    name: 'Sydney CBD Practice',
    streetAddress: '123 Macquarie Street',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    isPrimary: true,
    offersTelehealth: true,
  }],
  services: [
    {
      id: '1',
      slug: 'psychiatrist',
      name: 'Psychiatrist',
      category: 'medical',
      displayOrder: 1,
    },
    {
      id: '2',
      slug: 'telehealth',
      name: 'Telehealth Consultations',
      category: 'medical',
      displayOrder: 2,
    },
  ],
}

export const Default: Story = {
  args: {
    professional: baseProfessional,
  },
}

export const NotAcceptingPatients: Story = {
  args: {
    professional: {
      ...baseProfessional,
      acceptsNewPatients: false,
      waitlistWeeks: 8,
    },
  },
}

export const NDISRegistered: Story = {
  args: {
    professional: {
      ...baseProfessional,
      ndisRegistered: true,
    },
  },
}

export const Unverified: Story = {
  args: {
    professional: {
      ...baseProfessional,
      isVerified: false,
    },
  },
}

export const MultipleLocations: Story = {
  args: {
    professional: {
      ...baseProfessional,
      locations: [
        ...baseProfessional.locations,
        {
          id: '2',
          professionalId: '1',
          name: 'Parramatta Clinic',
          streetAddress: '456 Church Street',
          suburb: 'Parramatta',
          state: 'NSW',
          postcode: '2150',
          isPrimary: false,
          offersTelehealth: false,
        },
      ],
    },
  },
}

export const ManyServices: Story = {
  args: {
    professional: {
      ...baseProfessional,
      services: [
        ...baseProfessional.services,
        {
          id: '3',
          slug: 'adhd-assessment',
          name: 'ADHD Assessment',
          category: 'assessment',
          displayOrder: 3,
        },
        {
          id: '4',
          slug: 'medication-management',
          name: 'Medication Management',
          category: 'medical',
          displayOrder: 4,
        },
        {
          id: '5',
          slug: 'psychotherapy',
          name: 'Psychotherapy',
          category: 'therapy',
          displayOrder: 5,
        },
      ],
    },
  },
}