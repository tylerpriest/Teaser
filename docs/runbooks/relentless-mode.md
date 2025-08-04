# Relentless Mode Runbook

## Purpose
Keep momentum when stalls or flaky steps slow progress.

## Toggle
`relentless=true|false` in prompts and tasks

## When ON

### Behaviors
- Skip routine confirmations, fill gaps with logged assumptions
- Auto retry transient failures up to 3 attempts with backoff
- If Claude Code or tools stall, re-issue the last step with context, then move on after two retries
- Post hourly short status updates to `.aeon/specs/_status.md`

### Stop Conditions
- The exact phrase **EMERGENCY STOP**
- Any secrets or security risk
- Destructive operations without backup
- Data loss risk

## Escalation
1. Open an issue with error details
2. Write a brief note to `.aeon/scratchpad.md`
3. Tag the affected feature
4. Pause that lane

## Examples

### Normal Flow
```
Task: Update auth flow
Relentless: false
> Asks for confirmation at each major step
> Stops on first error for investigation
```

### Relentless Flow
```
Task: Update auth flow
Relentless: true
> Assumes reasonable defaults
> Retries npm install if network fails
> Continues through lint warnings
> Only stops on EMERGENCY STOP or security risk
```

## Monitoring

Check `.aeon/specs/_status.md` for:
- Hourly progress updates
- Retry attempts logged
- Assumptions made
- Any escalations