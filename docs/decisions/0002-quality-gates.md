# ADR-0002: Quality Gates and CI/CD

**Date**: 2025-08-04  
**Status**: Accepted

## Context

Need automated quality checks to maintain code standards and prevent regressions.

## Decision

### Required Checks (Block PR Merge)

1. **Linting** - ESLint with TypeScript rules
   - Import order enforced
   - No unused variables
   - No any types

2. **Type Checking** - TypeScript strict mode
   - No implicit any
   - Strict null checks
   - No unchecked indexed access

3. **Unit Tests** - Vitest
   - Must maintain or increase coverage
   - All tests must pass

4. **Storybook Build** - No broken stories
   - Ensures component documentation stays current

5. **E2E Tests** - Playwright on preview URL
   - Happy path for critical user journeys
   - Run on Chrome, Firefox, Safari

### Automated Fixes

- Prettier on pre-commit via Husky
- ESLint autofix for simple issues
- Import sorting automatic

### Performance Budget

- Lighthouse score > 90 for performance
- Bundle size monitoring (future)

## Rationale

- Catch issues early and automatically
- Consistent code style across team
- Confidence in deployments
- Documentation stays in sync

## Consequences

- PRs take 5-10 minutes for all checks
- Developers must fix issues before merge
- Higher initial setup complexity
- Better long-term maintainability