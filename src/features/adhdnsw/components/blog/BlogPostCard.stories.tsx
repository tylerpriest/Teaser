import type { Meta, StoryObj } from '@storybook/react'

import type { BlogPost } from '../../types'

import { BlogPostCard } from './BlogPostCard'

const meta = {
  title: 'ADHDNSW/Blog/BlogPostCard',
  component: BlogPostCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    featured: {
      control: 'boolean',
      description: 'Display as featured post with larger layout',
    },
  },
} satisfies Meta<typeof BlogPostCard>

export default meta
type Story = StoryObj<typeof meta>

const basePost: BlogPost = {
  id: '1',
  slug: 'complete-guide-adhd-diagnosis-nsw',
  title: 'Complete Guide to ADHD Diagnosis in NSW (2024)',
  excerpt: 'Everything you need to know about getting an ADHD diagnosis in New South Wales, including costs, wait times, and what to expect.',
  content: 'Full article content here...',
  featuredImage: '/images/blog/diagnosis-guide.jpg',
  authorName: 'ADHD NSW Editorial Team',
  status: 'published',
  publishedAt: new Date('2024-01-15'),
  isFeatured: true,
  isEvergreen: true,
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-15'),
  categories: [
    {
      id: '1',
      slug: 'diagnosis-guides',
      name: 'Diagnosis Guides',
      displayOrder: 1,
    },
  ],
  tags: [
    {
      id: '1',
      slug: 'diagnosis',
      name: 'diagnosis',
    },
    {
      id: '2',
      slug: 'nsw',
      name: 'NSW',
    },
  ],
}

export const Default: Story = {
  args: {
    post: basePost,
  },
}

export const Featured: Story = {
  args: {
    post: basePost,
    featured: true,
  },
}

export const WithoutImage: Story = {
  args: {
    post: {
      ...basePost,
      featuredImage: undefined,
    },
  },
}

export const MultipleCategories: Story = {
  args: {
    post: {
      ...basePost,
      categories: [
        ...basePost.categories,
        {
          id: '2',
          slug: 'treatment-options',
          name: 'Treatment Options',
          displayOrder: 2,
        },
        {
          id: '3',
          slug: 'living-with-adhd',
          name: 'Living with ADHD',
          displayOrder: 3,
        },
      ],
    },
  },
}

export const LongTitle: Story = {
  args: {
    post: {
      ...basePost,
      title: 'Understanding the Complete Process of Getting an ADHD Diagnosis in New South Wales: A Comprehensive Step-by-Step Guide for Adults and Children',
    },
  },
}

export const ShortExcerpt: Story = {
  args: {
    post: {
      ...basePost,
      excerpt: 'Quick guide to ADHD diagnosis in NSW.',
    },
  },
}

export const Draft: Story = {
  args: {
    post: {
      ...basePost,
      status: 'draft',
      publishedAt: undefined,
    },
  },
}