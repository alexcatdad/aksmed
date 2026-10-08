# Hosted CI checks

GitHub Actions checks the exact pull-request head or main-branch push commit on GitHub-hosted Ubuntu with Bun 1.4.2. It installs locked dependencies, runs the existing Biome check, checks the strict TypeScript configuration and builds the Vite application.

Reproduce from the repository root:

```sh
bun install --frozen-lockfile --ignore-scripts
bun run check
bun run typecheck
bun run build
git diff --check
```

The checks workflow has read-only repository permissions and no deployment job. The existing Pages deployment workflow remains separate; a successful build does not establish browser acceptance.
