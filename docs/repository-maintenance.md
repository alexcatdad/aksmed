# Repository maintenance

The `check` job runs locked installation, Biome, TypeScript and Vite checks.
Superseded PR checks may be cancelled; unique main/manual run groups preserve
queued and running checks. Pages publication is not cancelled by that PR rule.
Pages still publishes only on
main pushes, serializes deployments, and grants Pages/OIDC writes only to deploy.
Its build uses the same Bun 1.4.2 version as source checks. Source checks do not
replace browser acceptance or successful Pages publication.

Dependabot checks Actions and the root Bun text lockfile weekly. Compatible Bun
updates are grouped; majors remain separate. Every update needs review and actual
CI results. Version-update configuration does not authorize automatic merging.

## Shared audit and ruleset tooling

Use a checkout of `alexcatdad/ci-actions` at reviewed commit
`3c711660203519dc638c0295cbd75434ced073f0`. Keep reports outside this checkout:

```sh
set -eu
umask 077
test "$(git -C /path/to/ci-actions rev-parse HEAD)" = 3c711660203519dc638c0295cbd75434ced073f0
test -z "$(git -C /path/to/ci-actions status --porcelain --untracked-files=all)"
bun /path/to/ci-actions/scripts/audit-repository.ts --repo alexcatdad/aksmed > /private/review/aksmed-audit.json
```

Audit exit 2 means incomplete evidence, including an unavailable classic-protection
API. Inspect observations; it is not a security grade. Do not copy account reports
or credentials into this repository.

[main.json](../.github/rules/main.json) is an inert proposed ruleset: PR required,
zero approving reviews, resolved threads, up-to-date `check` from GitHub Actions
(integration 15368), no force pushes/deletion and no bypass actors. Committing the
file does not apply it. Preserve any controls added independently.

After a fresh representative PR has successful checks, generate a plan using its
number and review the exact payload, target, baseline and hash separately:

```sh
set -eu
umask 077
test "$(git -C /path/to/ci-actions rev-parse HEAD)" = 3c711660203519dc638c0295cbd75434ced073f0
test -z "$(git -C /path/to/ci-actions status --porcelain --untracked-files=all)"
bun /path/to/ci-actions/scripts/create-ruleset.ts plan --repo alexcatdad/aksmed --rules /path/to/aksmed/.github/rules/main.json --evidence-pr PR_NUMBER > /private/review/aksmed-plan.json
```

Only an explicitly approved plan may be applied. Recollect after drift; never
silently replace the baseline or bypass a failed/missing check. Existing same-name
rulesets require separate review. GitHub writes are not atomic with prior reads;
coordinate one writer and inspect uncertain outcomes before retrying.
