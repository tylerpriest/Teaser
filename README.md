# ADHDNSW.org

A comprehensive SEO-optimized platform for the ADHD community in New South Wales, featuring a searchable directory of professionals and expert resources.

## Quick Start

```bash
# Install dependencies
nvm use
npm install

# Start development server
npm run dev

# Run tests
npm test          # Unit tests
npm run e2e       # E2E tests

# Component development
npm run storybook
```

## Architecture

This project follows a modular-by-feature architecture where all related code is colocated:

```
src/features/
  auth/
    components/     # React components
    routes/         # Next.js routes
    state/          # State management
    services/       # API and business logic
    tests/          # Unit tests
    styles/         # Component styles
    stories/        # Storybook stories
```

## Development Workflow

1. Create feature branch: `git checkout -b feature/{feature}-{slug}`
2. Write tests first (TDD)
3. Implement feature
4. Run quality checks: `npm run lint && npm run typecheck && npm test`
5. Create PR with linked acceptance criteria

## Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript type checking
- `npm test` - Run unit tests with Vitest
- `npm run e2e` - Run E2E tests with Playwright
- `npm run storybook` - Start Storybook for component development

## Documentation

- Architecture decisions: `/docs/decisions/`
- Runbooks: `/docs/runbooks/`
- Feature specs: `.aeon/specs/{feature}/`

## CI/CD

All PRs must pass:
- Linting (ESLint)
- Type checking (TypeScript)
- Unit tests (Vitest)
- Storybook build
- E2E tests (Playwright)

Preview deployments are created for each PR on Vercel.

**Note**: GitHub Actions workflow files are in `/docs/github-workflows/` and need to be manually copied to `.github/workflows/` due to permission restrictions.

## Environment Setup

Required environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Vercel (for CI/CD)
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
```

## Features

- 🔍 **Searchable Directory**: Find ADHD professionals by location, specialty, and availability
- 📚 **Resource Hub**: Expert articles, guides, and NSW-specific ADHD information
- 📱 **Mobile-Friendly**: Fully responsive design for all devices
- 🚀 **Fast & SEO-Optimized**: Built for performance and search visibility
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 🗺️ **Location-Based**: Find professionals near you with distance filtering

## Project Status

✅ Phase 1 Complete:
- Professional directory with advanced filtering
- SEO-optimized blog system
- Structured data implementation
- Mobile-responsive design
- Core Web Vitals optimization

🚧 Phase 2 (Planned):
- User accounts and saved searches
- Professional profile management
- Review system
- Email notifications