# Hosted CI checks

GitHub Actions checks pull requests and main-branch pushes on GitHub-hosted Ubuntu with Bun 1.4.2. It installs locked dependencies, runs the existing Biome check and builds the Vite application.

Reproduce from the repository root:

```sh
bun install --frozen-lockfile --ignore-scripts
bun run check
bun run build
git diff --check
```

The checks workflow has read-only repository permissions and no deployment job. The existing Pages deployment workflow remains separate; a successful build does not establish browser acceptance.
