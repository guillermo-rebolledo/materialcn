# Publish materialcn as a shadcn registry

**Status:** done — `pnpm registry:build`, hosted by `.github/workflows/registry.yml`
**Source:** https://ui.shadcn.com/docs/registry/getting-started, /registry/registry-item-json, /registry/registry-index

## Goal

`npx shadcn add @materialcn/button` installs a Material 3 button into any
shadcn project, tokens and all.

## What the spec requires

1. **`registry.json` at the repo root** — `$schema`, `name` (the namespace),
   `homepage`, `items[]`. Each item carries `name`, `type`, `title`,
   `description`, `files[]` (`path` + `type`, optional `target`). May be split
   with `include: ["src/components/ui/registry.json", …]`; paths are then
   relative to the file that declares them.
2. **`shadcn build`** flattens it to `public/r/*.json` — one JSON per item plus
   the index. `shadcn@4.19` is already a devDependency, so this is a script
   line, not a new tool.
3. **Served over HTTPS, flat**: `https://<host>/registry.json` and
   `https://<host>/<item>.json` at the same level. Static hosting is fine.
   Consumers register the namespace with
   `shadcn registry add @materialcn=https://<host>/r/{name}.json`.
4. **Directory listing** (optional, gets us into `shadcn search`): PR to
   `shadcn-ui/ui` editing `apps/v4/registry/directory.json`, validated with
   `pnpm validate:registries`. Requires the registry to be open source and
   public, and the published `files` array must **not** carry a `content`
   property.

## What was built

- `scripts/generate-registry.mjs` writes `registry.json`; `pnpm registry:build`
  flattens it into `public/r/`. 66 items.
- `scripts/lib/registry-items.mjs` cuts the items out of the source tree and
  reads both dependency lists from the imports.
- `scripts/lib/css-to-registry.mjs` encodes the stylesheet as the CLI's
  CSS-in-JSON.
- `scripts/lib/registry-metadata.mjs` holds the one hand-written part: a title
  and description per item. The generator fails when one is missing.
- `.github/workflows/registry.yml` publishes `public/` to GitHub Pages.

## Work

### 1. Fix imports that cannot resolve in a consumer project

Half of this turned out not to be needed. `*.types.tsx` are **compile-time
fixtures**, not shipped source — they assert that bad props fail to typecheck,
and nothing imports them. They are excluded alongside the stories, so their
`@/index` imports never reach a consumer. (`*.types.ts`, without the `x`, *is*
real source and ships.)

What did need fixing: `palettes.ts` moved from `src/styles/tokens/` to
`src/lib/`, and its two importers now use `@/lib/palettes`. A
`../styles/tokens/` specifier has nothing to resolve against once the file is
copied into a consumer project; `@/lib/` is rewritten to whatever
components.json declares.

These resolve as-is and needed no change: `@/lib/utils`, `@/components/ui/*`,
`@/components/theme-context`, and bare relative siblings like `./button` —
every file of an area lands in one directory.

### 2. Author the items

Derived, not authored. A component owns its `-variants` / `-context` / `-utils`
/ `-manager` / `.types` siblings — until a second item imports one, at which
point the shared file is promoted to an item of its own.

That rule exists because of a cycle: ButtonGroup provides
`button-group-context`, Button consumes it, and the context reads Button's
variants. Bundled, `button` and `button-group` import each other and installing
either drags in the other. Promotion runs to a fixpoint, and `findCycle` fails
the build if a cycle survives.

The exception is a helper that imports its own component back —
`time-picker-utils` takes TimePicker's types while TimePicker calls into it.
Splitting those only moves the cycle, so they ship together.

### 3. Ship `src/lib/utils.ts` as a `registry:lib` item

Not stock shadcn: it carries the tailwind-merge configuration for the `m3-*`
namespaces. Without it, `text-m3-label-lg` and `text-m3-on-primary` collapse
into one group and filled buttons render with unreadable labels.

No item sets an explicit `target`. The CLI already routes each file by its
type — `registry:lib` to the `lib` alias, `registry:ui` to the `ui` alias — so
`@/lib/utils` resolves wherever components.json points it.

The ticket originally wanted this forced onto every component. It is a real
import instead: the components that call `cn` pick it up on their own, and the
handful that never do are spared. Only the token layer is forced, and only onto
items that render markup — otherwise `shadcn add @materialcn/utils` would drag
in the whole stylesheet.

### 4. Ship the token layer

The ticket recommended shipping the token CSS as files plus a `css` block of
`@import`s. That does not work: the `@import` is written into the consumer's
own stylesheet, whose path is whatever `components.json` says — `src/index.css`
in one project, `app/globals.css` in another — so no relative specifier
resolves, and Tailwind has no project-root-relative form.

So the whole stylesheet is inlined as CSS-in-JSON, converted from the CSS
itself rather than hand-translated, which keeps it in step with the generator.
2,215 lines become 36 `css` keys and 187 `cssVars.theme` entries.

One constraint the CLI does not document: **a declaration directly inside an
at-rule throws**. The CLI treats an at-rule's children as selectors and writes
a stray declaration out as `.temp{<value>}`, which fails to parse mid-install.
`@theme` is the exception — it goes through `cssVars.theme`, which the CLI
writes into the project's `@theme inline`. The converter throws on any other
case rather than shipping a registry that dies halfway through an install.

Verified in a scratch project: `m3-medium:` still compiles to
`@media (width >= 600px)`, and our `dark` variant — the one with the
`prefers-color-scheme` fallback — wins over the plain
`@custom-variant dark (&:is(.dark *))` the CLI injects.

### 5. Declare dependencies per item

Read from the imports and pinned to what this repo builds against.

`registryDependencies` must be **absolute URLs**. A bare `"button"` resolves
against *shadcn's* registry — the first install attempt failed with
`https://ui.shadcn.com/r/styles/new-york-v4/button-group-context.json was not
found`. A relative `"./button.json"` is read from the consumer's working
directory, not from the URL the item came from. `@materialcn/button` works only
once the consumer has registered the namespace, which breaks `shadcn add <url>`
for anyone who has not. The host lives in `REGISTRY_URL` in
`scripts/generate-registry.mjs`.

## Constraint to encode

A consumer who installs `button` without the token layer gets a mis-themed
result, and one who installs it without the tailwind-merge config gets an
illegible one. Make the theme item and the lib item `registryDependencies` of
every component.

## Verified

`pnpm test` validates the generated registry against the CLI's own zod schemas,
and checks the directory's rules: flat, every item titled and described, and no
inlined `content` in the catalogue. That last rule governs the `registry.json`
served at the root — the per-item JSON `shadcn build` writes does carry file
content, which is how a consumer gets the source.

Installed for real from a local server into two scratch projects — by URL and
by namespace. `shadcn add @materialcn/text-field @materialcn/theme-provider
@materialcn/split-button` resolved the whole graph to 18 files, and the
consumer project typechecks clean.

## Still to do

- Enable GitHub Pages for the repo with "GitHub Actions" as the source. Until
  then the URLs baked into the items 404. If the registry is hosted somewhere
  other than `guillermo-rebolledo.github.io/materialcn`, change `REGISTRY_URL`
  in `scripts/generate-registry.mjs` and re-run `pnpm registry:build`.
- Optional, for discoverability in `shadcn search`: PR `apps/v4/registry/
  directory.json` in `shadcn-ui/ui`, validated with `pnpm validate:registries`.
