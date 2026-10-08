---
title: Production Readiness Next Steps
tags:
  - aksmed
  - kb
  - prod
aliases:
  - Production Push Checklist
  - Prod Readiness Checklist
---

# Production Readiness Next Steps

The focused checklist for getting `aksmed` from “working enough to demo” to “honestly trustworthy to use or release.”

> [!important]
> Keep this note short, prioritized, and honest.

## Priority Order

### 1. Core correctness

- [ ] Confirm the most important user-facing or operator-facing workflows behave correctly
- [ ] Close the biggest reliability or correctness gaps still known in the repo

### 2. Operational confidence

- [ ] Make sure debugging, status, or observability surfaces are good enough for real use
- [ ] Document any heavy verification or release checks that matter before wider use

### 3. Release confidence

- [ ] Confirm docs match shipped behavior
- [ ] Confirm what still blocks a broader rollout, release, or recommendation

## Production Exit Criteria

The repo is ready for a broader push when:

- [ ] critical workflows are trustworthy
- [ ] the biggest operational gaps are closed or explicitly accepted
- [ ] release blockers are visible and small enough to manage


## Hosted source checks

[CI checks](../docs/ci-checks.md) now define the reproducible source gate. Hosted acceptance is established by the checks on the exact PR commit; source changes alone do not prove release or deployment acceptance.
