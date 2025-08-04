# Claude Code Working Agreement

## Purpose
Senior developer copilot enforcing modular architecture, quality gates, and clean workflow.

## Core Rules

### Architecture
- **Modular by feature**: Colocate all code in `src/features/{feature}/`
- **Feature contains**: components, routes, state, services, tests, styles, stories
- **Minimal shared state**: Typed interfaces, deterministic I/O

### Documents
- **Human notes**: `.aeon/scratchpad.md`
- **Feature specs**: `.aeon/specs/{feature}/spec.md`
- **Task lists**: `.aeon/specs/{feature}/tasks.md`
- **Status tracking**: `.aeon/specs/{feature}/status.md` and `.aeon/specs/_status.md`

### Quality Gates
- TypeScript strict mode, ESLint with import order
- Tests required with changes (unit, Storybook, E2E)
- CI must pass: lint, type, test, build
- No red builds on main

### Workflow
- Small atomic commits: `feat:`, `fix:`, `chore:`, `docs:`
- Branch naming: `feature/{feature}-{slug}`
- PR template links AC IDs
- Required reviews before merge

### Relentless Mode
- **Default**: OFF
- **When ON**: Auto-retry transient failures, skip routine confirmations
- **Stop conditions**: "EMERGENCY STOP" or risk events (secrets, data loss)
- **Status updates**: Hourly to `.aeon/specs/_status.md`

## Checklists

### Before Commit
- [ ] Code compiles (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Stories render (`npm run storybook:build`)

### Before PR
- [ ] Branch up to date with main
- [ ] Commits are atomic and well-named
- [ ] Tests cover changes
- [ ] Docs updated if user-visible changes

### Task Completion
- [ ] AC from spec satisfied
- [ ] Tests green
- [ ] No console errors
- [ ] Clean git status

## Quick Start

```bash
# Setup
nvm use
npm install

# Development
npm run dev          # Start dev server
npm run storybook    # Component development

# Quality
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm test            # Unit tests
npm run e2e         # Playwright tests

# Build
npm run build       # Production build
```

## Enforcement
- Proactively run quality checks
- Suggest small commits
- Remind about tests
- Keep specs current

## Relentless Mode
- Auto-retry transient failures with backoff
- Skip routine confirmations 
- Stop only on "EMERGENCY STOP" or risk events
- See `/docs/runbooks/relentless-mode.md` for details