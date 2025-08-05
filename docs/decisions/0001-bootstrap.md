# ADR-0001: Bootstrap Architecture Decisions

**Date**: 2025-08-04  
**Status**: Accepted

## Context

Setting up a new production-ready web application with modern tooling and best practices.

## Decisions

### Framework: Next.js 14 with App Router
- **Rationale**: Industry standard, excellent DX, built-in optimizations, TypeScript first
- **Trade-offs**: Larger bundle than minimal frameworks, opinionated structure

### Architecture: Modular by Feature
- **Structure**: `src/features/{feature}/` contains all related code
- **Rationale**: Better scalability, clear boundaries, easier to understand
- **Components**: components, routes, state, services, tests, styles, stories colocated

### Testing Strategy
- **Unit**: Vitest for speed and compatibility
- **Integration**: Storybook for component testing
- **E2E**: Playwright for cross-browser testing
- **Rationale**: Comprehensive coverage, fast feedback, visual testing

### State Management: React Context + Hooks
- **Rationale**: Built-in, simple for most cases, can add Zustand later if needed
- **Pattern**: Feature-local state, minimal global state

### Styling: Tailwind CSS + ShadCN
- **Rationale**: Utility-first, consistent design system, accessible components
- **Trade-offs**: Learning curve for Tailwind classes

### Backend: Supabase
- **Rationale**: PostgreSQL, real-time, auth built-in, generous free tier
- **Alternative considered**: Custom Node.js API (more work, more control)

### CI/CD: GitHub Actions + Vercel
- **Rationale**: Native GitHub integration, preview deployments, zero config
- **Jobs**: Parallel lint, type, test, build checks

## Assumptions

1. Team is familiar with React and TypeScript
2. Project needs auth and real-time features
3. SEO and performance are priorities
4. Mobile-first responsive design required

## Consequences

- Developers must learn Next.js App Router patterns
- All features follow the same structure
- Tests are required for all changes
- Preview deployments for every PR