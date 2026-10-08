---
title: Decision Log
tags:
  - aksmed
  - kb
  - decisions
aliases:
  - ADR Log
  - Decision Register
---

# Decision Log

The running log of decisions that materially affect `aksmed`.

## How To Use This Note

- add an entry when a decision changes architecture, delivery posture, source-of-truth policy, or release posture
- include the decision, why it was made, and what it implies
- link the deeper canonical doc when one exists


## 2026-10-08: Public hosted CI

Check locked dependencies, existing Biome rules, the strict TypeScript configuration and the Vite build on GitHub-hosted Ubuntu for exact pull-request heads and main pushes. Keep Pages publication in the existing separate workflow. See [CI checks](../docs/ci-checks.md).
