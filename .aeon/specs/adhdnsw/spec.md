# ADHDNSW.org Feature Specification

## Overview
SEO-optimized platform for the ADHD community in New South Wales, featuring a searchable directory of professionals and informative blog content.

## Core Features

### 1. Professional Directory

#### User Stories
- As a person with ADHD, I want to find verified ADHD specialists near me
- As a parent, I want to filter professionals by service type and location
- As a user, I want to see availability and telehealth options

#### Acceptance Criteria
- AC-DIR-001: Given I'm on the directory page, When I search for a location, Then I see professionals within 50km
- AC-DIR-002: Given I apply filters, When results load, Then they match all selected criteria
- AC-DIR-003: Given I view a profile, When the page loads, Then I see complete contact and service information
- AC-DIR-004: Given I'm on mobile, When I browse, Then the interface is fully responsive

#### Professional Profile Fields
- Name and credentials
- Specializations (Adult ADHD, Pediatric, etc.)
- Service types (Assessment, Treatment, Coaching)
- Locations (primary and satellite offices)
- Telehealth availability
- Languages spoken
- NDIS registration status
- Booking/contact methods
- Wait times (if provided)
- Fees/bulk billing info

### 2. SEO-Optimized Blog

#### Content Categories
1. **Education & Guides**
   - Understanding ADHD symptoms
   - Diagnosis process in NSW
   - Treatment options
   - Medication guides
   - School support strategies

2. **NSW-Specific Content**
   - Healthcare system navigation
   - NDIS and ADHD
   - State education support
   - Local support groups
   - NSW policy updates

3. **Practical Resources**
   - Daily management tools
   - Workplace strategies
   - Study techniques
   - Family support guides
   - Crisis resources

#### SEO Requirements
- AC-SEO-001: All pages have unique meta titles and descriptions
- AC-SEO-002: Schema markup implemented for all content types
- AC-SEO-003: Page load speed < 3 seconds on mobile
- AC-SEO-004: Core Web Vitals pass all thresholds

### 3. Search & Discovery

#### Directory Search
- Location-based search (suburb, postcode, region)
- Service type filtering
- Specialization filtering
- Availability filtering
- Sort by distance/relevance

#### Site Search
- Full-text search across all content
- Search suggestions
- Popular searches display
- No results handling

## Technical Requirements

### Performance
- Lighthouse score > 90 for all metrics
- Image optimization with WebP
- Lazy loading for images
- CDN for static assets

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader optimization
- High contrast mode option
- Clear, simple language

### SEO Technical
- XML sitemap generation
- Robots.txt configuration
- Canonical URLs
- Open Graph tags
- Twitter Cards
- JSON-LD structured data

## High-Value Keywords (NSW Focus)

### Primary Keywords
- "ADHD specialist Sydney"
- "ADHD assessment NSW"
- "ADHD psychologist near me"
- "Adult ADHD diagnosis Sydney"
- "ADHD psychiatrist NSW"
- "ADHD support NSW"
- "ADHD medication Australia"

### Local Keywords
- "ADHD doctor [suburb]" (for major NSW suburbs)
- "ADHD testing [city]"
- "ADHD clinic Western Sydney"
- "ADHD services Newcastle"
- "ADHD help Wollongong"

### Long-tail Keywords
- "how to get ADHD diagnosis NSW"
- "ADHD assessment cost Sydney"
- "bulk billing ADHD psychiatrist NSW"
- "NDIS ADHD support NSW"
- "ADHD friendly schools Sydney"

## Content Plan

### Launch Content (10 Cornerstone Articles)
1. Complete Guide to ADHD Diagnosis in NSW
2. Finding the Right ADHD Specialist in Sydney
3. ADHD Medication in Australia: What You Need to Know
4. Navigating NDIS with ADHD in NSW
5. ADHD in the NSW Education System
6. Adult ADHD: Recognition and Support in NSW
7. ADHD Assessment Process and Costs
8. Telehealth Options for ADHD in Regional NSW
9. ADHD Support Groups and Communities in NSW
10. Managing ADHD at Work: NSW Resources

### Ongoing Content Calendar
- Weekly: News updates, policy changes
- Bi-weekly: Professional spotlights
- Monthly: In-depth guides, research summaries
- Quarterly: Community surveys, trend reports

## Analytics & Success Metrics

### KPIs
- Organic traffic growth (target: 50% in 6 months)
- Directory search usage (target: 1000+ searches/month)
- Professional profile views
- Contact form submissions
- Time on site (target: >3 minutes)
- Bounce rate (target: <40%)

### Tracking
- Google Analytics 4
- Google Search Console
- Microsoft Clarity (heatmaps)
- Directory interaction events
- Search query analysis