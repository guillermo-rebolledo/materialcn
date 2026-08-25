# materialcn

A React component library with [Material 3 Expressive][m3] design, built on
[shadcn/ui][shadcn] primitives, [Base UI][baseui], and Tailwind v4.

[m3]: https://m3.material.io
[shadcn]: https://ui.shadcn.com
[baseui]: https://base-ui.com

## The idea

shadcn/ui is the backbone. Material is a token layer underneath it.

shadcn components read semantic CSS variables (`--primary`, `--card`,
`--border`). Those variables are pointed at Material 3 color roles:

```css
--primary: var(--m3-primary);
--card: var(--m3-surface-container-low);
--border: var(--m3-outline-variant);
```

So an unmodified `Button` from the shadcn registry already renders as Material,
and re-theming is a token edit rather than a component rewrite. Components that
want the parts of Material shadcn has no concept of — tertiary colors, the
surface-container ramp, the shape scale, spring motion — reach for the
`m3-` utilities directly.

## Quick start

```bash
pnpm install
pnpm storybook   # component workshop at :6006
pnpm dev         # playground app at :5173
```

## Scripts

| Script                 | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `pnpm dev`             | Playground app (`playground/`)                      |
| `pnpm storybook`       | Storybook on port 6006                              |
| `pnpm build`           | Library build → `dist/`                             |
| `pnpm build-storybook` | Static Storybook → `storybook-static/`              |
| `pnpm test`            | Runs every story in a real browser via Vitest       |
| `pnpm typecheck`       | `tsc -b`                                            |
| `pnpm lint`            | oxlint                                              |
| `pnpm tokens`          | Regenerates the generated token files               |

## Layout

```
src/
  components/ui/      shadcn components (added by the shadcn CLI)
  components/         library components (ThemeProvider, …)
  foundations/        token documentation stories
  styles/
    tokens/           the M3 token layer
    theme.css         maps tokens onto Tailwind's @theme namespaces
    fonts.css         optional self-hosted Roboto Flex
  index.css           stylesheet entry point
  index.ts            library entry point
playground/           dev app, not published
scripts/              token generator
```

## Tokens

| Layer      | Source                          | Tailwind utilities            |
| ---------- | ------------------------------- | ----------------------------- |
| Color      | `styles/tokens/color.css` ⚙︎     | `bg-m3-*`, `text-m3-*`        |
| Shape      | `styles/tokens/shape.css`       | `rounded-m3-*`                |
| Typography | `styles/tokens/typography.css`  | `text-m3-{role}-{size}`       |
| Elevation  | `styles/tokens/elevation.css`   | `shadow-m3-0` … `shadow-m3-5` |
| Motion     | `styles/tokens/motion.css` ⚙︎    | `ease-m3-*`                   |
| State      | `styles/tokens/state.css`       | `m3-state-layer`              |

⚙︎ Generated. Edit `scripts/generate-tokens.mjs`, then `pnpm tokens`.

### Color

The default theme is the M3 baseline scheme (seed `#6750A4`), converted to
OKLCH. Roles come in container/content pairs — `primary` with `on-primary`,
`surface-container` with `on-surface`. Never mix a container from one pair with
content from another; the pairing is what guarantees contrast.

To retheme, replace the `LIGHT` and `DARK` maps in
`scripts/generate-tokens.mjs` and run `pnpm tokens`.

### Light and dark

Dark mode re-points the same variable names, so **no component needs a `dark:`
utility to change color**. Three strategies work at once:

| Selector               | When it applies                          |
| ---------------------- | ---------------------------------------- |
| `:root`                | Light — the default                      |
| `.dark`                | Explicit dark, set by a theme toggle     |
| `prefers-color-scheme` | OS preference, unless `.light` opts out  |

`.dark` is deliberately *not* root-scoped, so a subtree can carry its own
scheme — a dark navbar on a light page, or a light/dark preview pair.

> One rule matters when extending the token layer: any selector that redefines
> an `--m3-*` role must also re-declare the semantic aliases that read it. A
> `var()` is substituted where it is *declared*, not where it is used, so a lone
> `:root` declaration of `--background: var(--m3-surface)` resolves once against
> the light value and inherits that fixed color into `.dark` subtrees. The
> generator emits the alias block under `:root, .dark` for exactly this reason.

Use the `ThemeProvider` for a runtime toggle:

```tsx
import { ThemeProvider, useTheme } from "materialcn"

<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>
```

`useTheme()` returns `{ theme, resolvedTheme, setTheme }`. On `"system"` it
deliberately sets no class, letting the CSS media query take over — which is
what keeps a server-rendered page from flashing the wrong scheme.

### Motion

Material 3 Expressive replaced fixed bezier curves with spring physics. CSS has
no `spring()`, so `pnpm tokens` samples a damped harmonic oscillator and emits
each spring as a `linear()` easing — a real spring response, usable on any
animatable property.

```css
transition-property: transform;
transition-timing-function: var(--m3-spring-spatial-default);
transition-duration: var(--m3-spring-spatial-default-duration);
```

Always pair an easing with its matching `-duration`; otherwise the curve gets
cut off mid-flight.

- **Spatial** springs move things and overshoot ~9% before settling. That bounce
  is the Expressive scheme's personality, not decoration.
- **Effects** springs animate color and opacity and are critically damped — they
  must never overshoot.

Both the `expressive` and `standard` schemes are emitted. Switch the whole
library over by re-pointing six aliases:

```css
:root {
  --m3-spring-spatial-default: var(--m3-spring-standard-spatial-default);
  --m3-spring-spatial-default-duration: var(--m3-spring-standard-spatial-default-duration);
  /* …and the other four */
}
```

Under `prefers-reduced-motion: reduce` every spring collapses to a 1ms linear
step, so no component needs to check the media query itself.

### State layers

Material expresses hover/focus/press as a translucent layer of the *content*
color over the container, rather than a different background per state. The
`m3-state-layer` utility implements that in one class:

```tsx
<button className="m3-state-layer bg-m3-primary-container text-m3-on-primary-container rounded-m3-full px-6 py-3">
  Press me
</button>
```

## A note on file layout

Variant objects (`buttonVariants`, …) live in sibling `*-variants.ts` files and
are re-exported from the component, so imports are unchanged:

```ts
import { Button, buttonVariants } from "materialcn"
```

The split exists so React Fast Refresh keeps working — a module stops being a
hot boundary as soon as it exports a non-component whose identity changes on
re-evaluation, which is exactly what `cva()` produces.

## Adding components

```bash
pnpm dlx shadcn@latest add <component>
```

Components land in `src/components/ui`. Export them from `src/index.ts`, and add
a `*.stories.tsx` beside the component — `pnpm test` renders every story in a
real browser, so a story doubles as a smoke test.

## Consuming the package

```ts
import { Button, ThemeProvider } from "materialcn"
import "materialcn/styles.css"
import "materialcn/fonts.css" // optional: self-hosted Roboto Flex
```

`dist/styles.css` carries the tokens, the `@theme` mapping, and every utility
the components use, so consumers without Tailwind still get a working
stylesheet. Consumers who *do* use Tailwind and want to write `m3-` utilities in
their own markup should scan the package instead:

```css
@import "tailwindcss";
@import "materialcn/styles.css";
@source "../node_modules/materialcn/dist";
```

Font loading is kept out of `styles.css` on purpose — bundling six woff2 subsets
into the library stylesheet would force them on every consumer and defeat
`unicode-range` subsetting.

### Button groups

Use `ButtonGroup` for related actions that do not represent a selection.
`standard` groups keep their buttons separate, while `connected` groups share
edges and coordinate their first, middle, and last shapes.

```tsx
import { Button, ButtonGroup } from "materialcn"

<ButtonGroup
  aria-label="Document actions"
  variant="standard"
  size="sm"
  shape="round"
  buttonVariant="outline"
>
  <Button>Share</Button>
  <Button>Archive</Button>
</ButtonGroup>

<ButtonGroup
  aria-label="View actions"
  variant="connected"
  size="lg"
  shape="square"
  orientation="vertical"
>
  <Button>List</Button>
  <Button>Grid</Button>
</ButtonGroup>
```

The group provides `size`, `shape`, and `buttonVariant` defaults to its child
buttons; an explicit prop on a child wins. Connected groups default to the
tonal (`secondary`) button variant. Use `ToggleGroup` instead when one or more
items can be selected.

### Split buttons

`SplitButton` pairs one immediate action with a trailing Material action menu.
Compose its menu with the existing `DropdownMenu` primitives; the trigger owns
menu opening and the leading action never opens it.

```tsx
import { PlusIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  SplitButton,
  SplitButtonAction,
  SplitButtonTrigger,
} from "materialcn"

<SplitButton aria-label="Create actions" size="sm" variant="tonal">
  <SplitButtonAction onClick={createDocument}>
    <PlusIcon aria-hidden="true" data-icon="inline-start" />
    Create
  </SplitButtonAction>
  <DropdownMenu>
    <SplitButtonTrigger aria-label="More create actions" />
    <DropdownMenuContent align="end">
      <DropdownMenuGroup>
        <DropdownMenuItem>Create folder</DropdownMenuItem>
        <DropdownMenuItem>Import file</DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</SplitButton>
```

The supported color variants are `default` (filled), `tonal`, `outline`, and
`elevated`. Sizes follow the Button scale from `xs` through `2xl`, with
`default` as an alias for `sm`. Both the group and menu trigger require an
accessible name. Setting `disabled` on `SplitButton` disables both segments;
an individual segment can also be disabled on its own.

### Snackbars

Mount one `Toaster` near the application root, then use the exported imperative
manager from anywhere in the app. The message belongs in `description` because
a Material snackbar is one text block rather than a heading and supporting-text
pair.

```tsx
import { Toaster, toast } from "materialcn"

function App() {
  return (
    <>
      <button
        onClick={() => {
          const id = toast.add({
            description: "Message archived",
            actionProps: {
              children: "Undo",
              onClick: () => toast.close(id),
            },
            data: { dismissible: true },
          })
        }}
      >
        Archive
      </button>
      <Toaster />
    </>
  )
}
```

`data.dismissible` adds the trailing close control. Use
`data.layout: "stacked"` for a longer action that belongs below the message,
`timeout: 0` for persistent feedback, and `priority: "high"` only when the
message warrants an urgent announcement. Timeouts pause while the snackbar
stack is hovered or keyboard-focused; `F6` moves focus to the notification
region without stealing it when a snackbar first appears.

### Circular progress

Pass a value for determinate progress or omit it for an indeterminate
indicator. Every indicator needs an accessible name. Values are clamped to the
`min`/`max` range, which defaults to 0–100.

```tsx
import { CircularProgress } from "materialcn"

<CircularProgress aria-label="Upload progress" value={65} />
<CircularProgress
  aria-label="Loading results"
  thickness={8}
  variant="wavy"
/>
```

`variant` accepts `"flat"` or `"wavy"`, and `thickness` accepts `4` or `8`.
Their kit-defined outer sizes are 40/44dp for flat and 48/52dp for wavy. The
active arc uses Primary, the track uses Secondary Container, and `disabled`
switches both strokes to disabled On Surface roles. Indeterminate motion
becomes a static partial arc when reduced motion is requested.

### Loading indicator

Use the expressive loading indicator for an indeterminate wait where the
shape-morphing Material treatment is more appropriate than progress. It is a
named `status` and defaults to the accessible label `"Loading"`.

```tsx
import { LoadingIndicator } from "materialcn"

<LoadingIndicator aria-label="Loading results" />
<LoadingIndicator aria-label="Refreshing" contained />
<LoadingIndicator aria-label="Saving" size="inline" />
```

The standalone size uses the kit's 48dp container and 38dp active shape. The
inline size scales those to 24dp and 19dp for text-adjacent contexts.
`contained` paints a Primary Container circle with an On Primary Container
shape; otherwise the shape uses Primary. Reduced motion freezes the first,
recognizable shape. If nearby visible copy already communicates the loading
state, set `aria-hidden="true"` to avoid a duplicate status announcement.

### Lists

`ListItem` keeps a semantic list-item wrapper and uses Base UI's `render` prop
for the row action, so navigation remains an anchor and commands remain native
buttons. Density belongs to the list and does not change the content slots.

```tsx
import {
  List,
  ListItem,
  ListItemContent,
  ListItemHeadline,
  ListItemLeading,
  ListItemSupportingText,
  ListItemTrailing,
} from "materialcn"

<List density="-2" aria-label="Folders">
  <ListItem lines={2} render={<a href="/archive" />}>
    <ListItemLeading variant="icon">{/* 24dp icon */}</ListItemLeading>
    <ListItemContent>
      <ListItemHeadline>Archive</ListItemHeadline>
      <ListItemSupportingText>Updated yesterday</ListItemSupportingText>
    </ListItemContent>
    <ListItemTrailing>24 files</ListItemTrailing>
  </ListItem>
</List>
```

Available densities are `"default"`, `"-2"`, and `"-4"`; `lines` accepts
`1`, `2`, or `3`. Use `ListSection` with an accessible `ListSubheader` for
grouped content. `ListItemLeading` supports `icon`, `avatar`, `media`, and
`control` presentations, while trailing slots can compose the exported
Checkbox, RadioGroupItem, and Switch controls.

### Carousels

The Material carousel composes the shadcn/Embla interaction primitive with the
responsive item emphasis from the design kit. Give every carousel an
accessible name; slides receive positional names automatically unless they
provide `aria-label` or `aria-labelledby`.

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "materialcn"

<Carousel aria-label="Featured destinations" layout="multi-browse">
  <CarouselContent>
    {destinations.map((destination) => (
      <CarouselItem key={destination.id} aria-label={destination.name}>
        <img src={destination.image} alt="" />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

`layout` accepts `"standard"` (the kit's multi-aspect-ratio sequence),
`"multi-browse"`, `"hero"`, `"uncontained"`, and `"full-screen"`. Pass
`opts={{ align: "center", startIndex: 1 }}` for the centered hero
presentation. Embla options, plugins, and `setApi` remain available for
advanced composition.

Previous and next controls stay focusable at a finite boundary and communicate
their unavailable state with `aria-disabled`. Arrow keys work while focus is
inside the carousel, pointer and touch dragging are enabled by default, and
reduced-motion preferences remove both inertial control movement and item-size
morphing.

### Search bars

`SearchBar` is a controlled or uncontrolled search form. Its compound slots
keep navigation and trailing actions composable without coupling the input to
suggestions or result state.

```tsx
import {
  SearchBar,
  SearchBarClear,
  SearchBarInput,
  SearchBarLeading,
  SearchBarTrailing,
} from "materialcn"
import { SearchIcon } from "lucide-react"

<SearchBar defaultValue="" onSubmit={(query) => runSearch(query)}>
  <SearchBarLeading>
    <SearchIcon aria-hidden="true" />
  </SearchBarLeading>
  <SearchBarInput aria-label="Search destinations" />
  <SearchBarTrailing>
    <SearchBarClear />
  </SearchBarTrailing>
</SearchBar>
```

Use `value` with `onValueChange` for controlled state. `invalid`, `disabled`,
`onClear`, and custom Button, voice, avatar, or navigation content in either
slot remain independent of any future SearchView result model.

## Where the specs come from

The token values and component geometry are not hand-copied from the docs site —
they are extracted from the official **Material 3 Design Kit** Figma file. A
`.fig` is a zip whose `canvas.fig` uses Figma's "fig-kiwi" format: a
self-describing Kiwi schema followed by a zstd-compressed document. Because the
schema is self-describing, `tools/fig-decode.mjs` can decode the whole file
without knowing Figma's internals:

```bash
node tools/fig-decode.mjs "Material 3 Design Kit (Community).fig" /tmp/m3
node tools/fig-tokens.mjs /tmp/m3 > /tmp/m3/tokens.json   # variable collections
node tools/fig-report.mjs /tmp/m3 '^Switch$'              # component geometry
```

`docs/m3-specs.md` records the numbers that came out of it.

## Status

Tokens, theming, the shadcn bridge, Storybook, tests, and the library build are
in place, and every primitive listed above is drawn to the Material spec.

Not yet built: the components Material has and shadcn does not — FAB and FAB
menu, navigation bar and rail, app bars, and the connected button group. The
`m3-` token layer is what those would be built on.
