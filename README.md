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

Working *on* the library:

```bash
pnpm install
pnpm storybook   # component workshop at :6006
pnpm dev         # playground app at :5173
```

Using it in an app: see [Getting started](#getting-started).

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
| `pnpm check:contrast`  | Verifies every role pairing meets WCAG AA           |
| `pnpm registry`        | Regenerates `registry.json` from the source tree    |
| `pnpm registry:build`  | Flattens the registry into `public/r/` for serving  |
| `pnpm test:registry`   | Validates the registry against shadcn's own schemas |

## Releasing to npm

Publishing is tag-driven. `.github/workflows/publish.yml` typechecks, lints,
runs every story in a real Chromium, builds, and then publishes with npm
provenance — so a broken build cannot reach the registry.

```bash
npm version minor        # or patch / major — writes package.json and tags
git push --follow-tags
```

The workflow refuses to publish if the tag does not match `package.json`, and
needs an npm automation token in the `NPM_TOKEN` repository secret.

Two things the package layout has to get right, both found by installing a
`npm pack` tarball into a scratch Vite app:

- **A side-effect CSS import needs a type declaration.** `import
  "materialcn/styles.css"` is TS2882 in any consumer on `moduleResolution:
  bundler` unless a `.d.css.ts` sits where the `exports` map's `types`
  condition points. `styles.d.css.ts` is emitted by the build;
  `src/styles/fonts.d.css.ts` is committed, because fonts.css ships as source.
- **`files` excludes stories and MDX.** `src/` is shipped so
  `materialcn/tokens/*` and `materialcn/fonts.css` resolve, but the 64 story
  files are dead weight in a consumer's `node_modules`.

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

| Layer      | Source                          | Tailwind utilities                |
| ---------- | ------------------------------- | --------------------------------- |
| Color      | `styles/tokens/color.css` ⚙︎     | `bg-m3-*`, `text-m3-*`            |
| Shape      | `styles/tokens/shape.css`       | `rounded-m3-*`                    |
| Spacing    | `styles/tokens/spacing.css`     | `p-m3-*`, `gap-m3-*`, `size-m3-*` |
| Typography | `styles/tokens/typography.css` ⚙︎ | `text-m3-{role}-{size}`           |
| Elevation  | `styles/tokens/elevation.css`   | `shadow-m3-0` … `shadow-m3-5`     |
| Motion     | `styles/tokens/motion.css` ⚙︎    | `ease-m3-*`                       |
| State      | `styles/tokens/state.css`       | `m3-state-layer`                  |
| Stacking   | `styles/tokens/z-index.css`     | `z-(--m3-z-*)`                    |
| Layout     | `styles/tokens/layout.css` ⚙︎    | `m3-medium:` … `m3-extra-large:`  |

⚙︎ Generated. Edit `scripts/generate-tokens.mjs`, then `pnpm tokens`.

### Color

The default theme is the M3 baseline scheme (seed `#6750A4`), converted to
OKLCH. Roles come in container/content pairs — `primary` with `on-primary`,
`surface-container` with `on-surface`. Never mix a container from one pair with
content from another; the pairing is what guarantees contrast.

To retheme, replace the `LIGHT` and `DARK` maps in
`scripts/generate-tokens.mjs` and run `pnpm tokens`.

**Verify the palette after a retheme.** The Material roles are contrast-designed
by construction, but the palette is *generated* — which makes it exactly the
kind of thing an edit can regress silently. `pnpm check:contrast` measures every
text-bearing role pairing in both schemes and exits non-zero below WCAG AA:

```
pnpm tokens && pnpm check:contrast
```

It reads `tokens/color.css` rather than the hex maps, so it measures the colours
that actually ship, including the OKLCH conversion. Roles that are not text —
`shadow`, `scrim`, `surface-tint`, `outline-variant` — are excluded by name with
the reason recorded in the script, and `outline` is held to WCAG's 3:1 non-text
threshold. No pairing is exempted by lowering a threshold.

#### Choosing a colour role

The mechanism above says how the roles work. This says which one to reach for.

**Prefer the shadcn semantic name where one exists.** `bg-primary`,
`text-muted-foreground`, and `border` already resolve to Material roles, and
using them keeps a component readable to anyone who knows shadcn and portable to
a different token layer. Reach for `bg-m3-*` only for the parts of Material
shadcn has no concept of: tertiary, the surface-container ramp, `outline`, and
the fixed roles.

**Secondary vs tertiary.** Both are accents; the difference is what they are
accenting.

- **Secondary** is for the supporting controls in a flow the *primary* colour
  already owns — a filter chip beside a primary action, a selected tab, a
  toggle's on state. It is the same conversation at a lower volume.
- **Tertiary** is for something *outside* that conversation that needs to be
  told apart from it — a promotional badge, a category tag, an unrelated status.
  Its whole purpose is contrast against primary and secondary, so using it as a
  third shade of "important" wastes the one role that can say "different kind of
  thing".

If you are choosing between them because you want variety, you want secondary.
If you are choosing because the thing genuinely is not part of the primary flow,
you want tertiary.

**The surface-container ramp.** Five steps from `surface-container-lowest` to
`surface-container-highest`. They express *how far forward a surface sits*, not
how important it is, and the rule is that a surface goes one step above whatever
it sits on:

| Step                       | Typically                                 |
| -------------------------- | ----------------------------------------- |
| `surface`                  | The page                                  |
| `surface-container-lowest` | A card on a dark page                     |
| `surface-container-low`    | Cards, sheets                             |
| `surface-container`        | Menus, popovers, search bars              |
| `surface-container-high`   | Dialogs, and any surface above a menu     |
| `surface-container-highest` | The topmost thing on screen              |

Two mistakes to avoid: skipping steps (the ramp is closely spaced on purpose —
a jump reads as a different material, not a raised one), and using a container
step as an *accent*. A container that needs attention wants a colour role, not a
lighter grey.

Note that `surface-container-highest` is also what `--muted` resolves to, so a
muted region and a top-level surface are the same colour. That is deliberate,
and it is why the ramp expresses depth rather than emphasis.

**Outline vs outline-variant.** The distinction is whether the line is doing a
job:

- **`outline`** is a boundary the user has to find — a text field's border, a
  focus ring, an outlined button's edge. It meets the 3:1 non-text contrast
  threshold, and `pnpm check:contrast` holds it there.
- **`outline-variant`** is decorative — dividers between list rows, a card's
  edge, the track behind a progress bar. It sits at about 1.6:1 against surface
  and is *meant* to. Nothing that identifies a control may use it.

shadcn's `--border` points at `outline-variant` and `--input` at `outline`,
which is the same split under different names.

**How not to use the roles.**

- **Never add a `dark:` utility for colour.** Dark mode swaps token values, so a
  `dark:` colour override means the token layer is missing something — fix the
  token, not the component. (`dark:` for a non-colour property is fine, but rare
  enough to be worth a second look.)
- **Never mix a container from one pair with content from another.** `on-primary`
  on `secondary-container` is not a shade choice, it is a contrast failure that
  `check:contrast` does not cover, because nobody is supposed to write it.
- **Do not reach past the semantic layer to hardcode a hex**, even "just for
  this one". The whole promise is that retheming is a token edit, and one
  hardcoded value is the exception that makes a consumer test every screen.

### Typography

Five roles — display, headline, title, body, label — at three sizes each. Roles
carry meaning: pick by what the text *is*, not by how large you want it to look.

**Which roles are responsive.** Below the `expanded` window size class, every
**display** and **headline** role steps down one rung of the ladder — display-lg
renders at display-md's size, headline-sm at title-lg's. One rule applied
uniformly rather than a second hand-tuned scale, since the ladder's own steps
are already the sizes Material considers adjacent. Line height and tracking come
down with the size; leaving a 64dp line height under 45dp text is the usual way
a responsive scale goes wrong.

**Title, body, and label do not move.** They are reading and control text, and
shrinking them on a phone would tighten the measure on the screen where it is
already tightest.

Nothing in a consumer's markup changes: `text-m3-display-lg` is still the class,
it just resolves smaller on a narrow window — the same mechanism dark mode uses.

#### Choosing a type role

The size is a consequence of the role, not the reason for it. Pick by what the
text *is*:

| Role         | It is…                                                     |
| ------------ | ---------------------------------------------------------- |
| **display**  | The one thing a screen is *about* — a marketing headline, a big number in a dashboard. At most one per screen, often none. |
| **headline** | The heading of a screen or a major region. Short. |
| **title**    | The heading of a component or a group — a card's title, a dialog's heading, a list's section header. |
| **body**     | Anything the reader actually reads in sentences. |
| **label**    | Text *inside* a control, or a caption attached to one — button labels, chips, tabs, field helper text, timestamps. |

The tell for title vs body: a title names a thing, body says something about it.
The tell for label vs body: a label is part of a control's anatomy; if you could
delete the control and keep the text, it is body.

**Pairings that work.** Roles are designed to stack, so keep the steps adjacent:

- `headline-sm` + `body-md` — the default screen section.
- `title-md` + `body-md` — a card, a dialog, a list row with supporting text.
- `title-sm` + `body-sm` — a dense row, a table cell with a secondary line.
- `label-lg` + `body-sm` — a control with helper text beneath it.
- `display-sm` + `body-lg` — a hero, where the body has to hold its own against
  the display size.

Two steps apart usually reads as a mistake rather than as hierarchy — `display-lg`
over `body-sm` leaves a gap nothing bridges. And avoid two roles of the same
size doing different jobs in one block: `title-sm` and `label-lg` are both 14dp,
so putting them side by side gives you a distinction the reader cannot see.

**Emphasis.** Reach for the `emphasized` weight before reaching for a larger
role. Going up a step changes the structure of the page; going up a weight
changes only the emphasis, which is usually what was meant.


### Spacing

Every measurement in the Material kit is a multiple of **4dp**. The scale names
each multiple the kit actually uses for the job it does there:

| Step       | Value | Used for                                                |
| ---------- | ----- | ------------------------------------------------------- |
| `m3-xs`    | 4dp   | Icon-to-label gap in the densest controls               |
| `m3-sm`    | 8dp   | Gap inside a standard control; chip icon-to-label       |
| `m3-md`    | 12dp  | Dense inset — segmented segments, sheet internal spacing |
| `m3-lg`    | 16dp  | The default content inset — cards, sheets, list rows    |
| `m3-xl`    | 24dp  | Dialog padding; separation between sections of a screen |
| `m3-2xl`   | 32dp  | Expressive large-control padding                        |
| `m3-3xl`   | 48dp  | Large button padding; page-level separation             |
| `m3-4xl`   | 64dp  | Extra-large button padding                              |

Only `--m3-space-unit` is a chosen number; every step is `calc()`'d from it, so
a denser or looser system is one declaration rather than nine.

**When to use these over `p-4`.** Tailwind's numeric scale is the same 4dp unit
expressed in rem, so `p-4` and `p-m3-lg` agree at the default root font size.
They diverge when the reader scales their font: the numeric utilities grow with
it, these do not. Reach for `p-m3-*` when a measurement has to match the kit's
geometry exactly — a control's height, an icon's optical alignment — and for the
numeric utilities everywhere else.

> The shipped components still carry their spacing as numeric utilities. Moving
> them onto the scale is deliberate follow-up: it is a visual-diff-heavy change
> across every component, and keeping it out of the ticket that introduces the
> scale is what makes both reviewable.

### Stacking

Material describes *elevation* — shadow and surface tint — which says nothing
about paint order, so the z-index scale is the library's own:

| Token             | Value | Layer                                          |
| ----------------- | ----- | ---------------------------------------------- |
| `--m3-z-raised`   | 1     | A surface lifted within the normal flow        |
| `--m3-z-sticky`   | 100   | Headers and toolbars that outlast a scroll     |
| `--m3-z-scrim`    | 200   | The dimming layer a modal paints over the page |
| `--m3-z-modal`    | 300   | Dialogs and sheets                             |
| `--m3-z-menu`     | 400   | Menus, selects, popovers, date pickers         |
| `--m3-z-snackbar` | 500   | Transient messages                             |
| `--m3-z-tooltip`  | 600   | Tooltips                                       |

Apply them with Tailwind's custom-property shorthand: `z-(--m3-z-modal)`.

Two placements are deliberate and easy to get backwards:

- **Menus sit above modals.** A select inside a dialog portals to the body, so
  it is a *sibling* of the dialog rather than a descendant — give it a lower
  z-index and it renders behind the dialog that opened it. Nothing is lost,
  because a page under an open modal is inert and cannot have a menu open on it.
- **Tooltips sit above everything**, one step further along the same argument:
  a tooltip can be triggered from inside a dialog, a snackbar action, or a menu.

Steps are 100 apart so a consumer can slot a layer in without renumbering.

Every overlay the library ships uses the scale. The remaining bare `z-10`s —
the top app bar's rows, the select's scroll buttons, the notification badge over
an avatar — are stacking *within* a component's own context, not on the overlay
scale, and are deliberately left alone.

### Layout

Material picks a layout by **window size class**, not by pixel count. The five
classes get their own responsive variants, so a component can name the class it
is responding to:

| Class         | Variant           | Window width  | Typical device                     |
| ------------- | ----------------- | ------------- | ---------------------------------- |
| `compact`     | *(unprefixed)*    | 0–599dp       | Phone in portrait                  |
| `medium`      | `m3-medium:`      | 600–839dp     | Tablet in portrait, unfolded phone |
| `expanded`    | `m3-expanded:`    | 840–1199dp    | Tablet in landscape, small window  |
| `large`       | `m3-large:`       | 1200–1599dp   | Desktop                            |
| `extra-large` | `m3-extra-large:` | 1600dp and up | Ultra-wide desktop, TV             |

Material writes these bounds in dp; on the web a dp is a CSS pixel, so the two
are the same number.

The variants are mobile-first min-widths, so compact is the unprefixed base and
each later class overrides it — `p-4 m3-expanded:p-6`. An `m3-compact:` variant
does exist for symmetry, but being a min-width of 0 it matches at *every* width;
to style compact and nothing wider, negate the class above it:

```
max-m3-medium:hidden                  compact only
m3-medium:max-m3-expanded:grid-cols-2 medium only
```

Tailwind's stock `sm`/`md`/`lg` are left alone rather than remapped: `md` fires
at 768px, inside the medium class rather than on either edge, and silently
moving it would move every breakpoint in a consuming app too.

The same bounds are readable at runtime as `--m3-breakpoint-{class}`. Tailwind
substitutes the `@theme` values straight into `@media` parameters and never
emits them as custom properties, so script that needs a boundary reads these.

#### The responsive grid

Material's grid is not a column count — it is a column count, a gutter, and a
margin that all change together as the window crosses a class boundary:

| Class         | Columns | Gutter | Margin                     |
| ------------- | ------- | ------ | -------------------------- |
| `compact`     | 4       | 16dp   | 16dp                       |
| `medium`      | 8       | 16dp   | 32dp                       |
| `expanded`    | 12      | 24dp   | 24dp                       |
| `large`       | 12      | 24dp   | 200dp                      |
| `extra-large` | 12      | 24dp   | centred, 1128dp of content |

The numbers come from the `Examples/Layout grid` component set's Figma layout
grids in the official kit, not from the docs site — the two disagree about
medium. Note that the margin is not monotonic: a tablet in portrait gets more
room per column than a landscape one. At large the margin jumps to 200dp, and at
extra-large the grid stops stretching and centres 12 columns of 72dp; both exist
so a line of body text does not run the full width of a television.

Because the three move together, they are one set of variables redefined per
class rather than five separate sets — which is what lets `m3-grid` carry no
media query of its own:

```jsx
<div className="m3-grid">
  <main className="col-span-full m3-expanded:col-span-8">…</main>
  <aside className="col-span-full m3-expanded:col-span-4">…</aside>
</div>
```

Children are placed with Tailwind's own `col-span-*`, stepped per class wherever
the span should change. Spans are not clamped to the column count: `col-span-8`
on a 4-column compact grid overflows, which is why the span usually needs a step
of its own.

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

`useTheme()` returns `{ theme, resolvedTheme, setTheme, palette, setPalette }`.
On `"system"` it deliberately sets no class, letting the CSS media query take
over — which is what keeps a server-rendered page from flashing the wrong
scheme.

### Palettes

The stylesheet ships more than one scheme. Setting `data-palette` re-points
every role beneath it:

```html
<html data-palette="ocean">
```

| id         | Key hue | Notes                                   |
| ---------- | ------- | --------------------------------------- |
| *(unset)*  | 294°    | The kit's baseline violet — the default |
| `ocean`    | 250°    | Blue                                    |
| `forest`   | 150°    | Green                                   |
| `ember`    | 55°     | Orange                                  |
| `rose`     | 15°     | Red-pink                                |

`ThemeProvider` sets the attribute for you, and it is orthogonal to light and
dark: each palette carries both schemes, so switching one never disturbs the
other.

```tsx
const { palette, setPalette } = useTheme()

<button onClick={() => setPalette("ocean")}>Ocean</button>
```

Because the attribute is a plain CSS selector rather than a build flag, it also
works on a **subtree** — a preview pane, or a swatch in a picker that has to
draw its own palette:

```tsx
<span data-palette="forest" className="size-4 rounded-m3-full bg-m3-primary" />
```

That works because the Tailwind color utilities are declared `@theme inline`,
so `bg-m3-primary` compiles to `var(--m3-primary)` and resolves wherever it
lands rather than at build time.

#### How the palettes are derived

The baseline is the Figma kit's, verbatim. The rest are **hue rotations of it**
in OKLCH: every role keeps its lightness and its chroma, and only the hue
moves. That is what preserves the things the baseline was verified for — the
surface ramp keeps its steps, and every container keeps its distance from the
content role that pairs with it.

Two corrections are applied on top, both in `scripts/generate-tokens.mjs`:

- **Error stays red.** It is the one family whose colour carries meaning rather
  than brand; a green delete confirmation is a worse interface however well it
  matches.
- **Contrast is repaired where a rotation costs it.** WCAG's relative luminance
  is hue-weighted — green carries far more of it than blue at the same
  lightness — so a pairing that clears AA in violet can fall under it in green.
  The generator walks the affected content role's lightness until it clears,
  and prints every nudge it made.

`pnpm check:contrast` then verifies the emitted CSS rather than trusting any of
that: 430 pairings across the baseline and all four palettes, light and dark.

Adding a palette is one line in `PALETTES` and `pnpm tokens`. The generator
emits the CSS *and* `src/lib/palettes.ts`, so the list a theme
switcher iterates cannot drift from the list the stylesheet actually contains.

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

## Iconography

Icons are sized and coloured through the `Icon` component, not per call site.

```jsx
<Icon size="sm"><PlusIcon /></Icon>          decorative — hidden from screen readers
<Icon label="Delete"><Trash2Icon /></Icon>   named — the icon is the only meaning
```

**Style.** Outlined, 2dp stroke, 24dp grid, square-ish terminals — Material
Symbols' defaults, which Lucide matches closely enough to mix without the seam
showing. Do not mix outlined and filled sets in one product; filled reads as
selected, so a filled glyph beside an outlined one implies a state that is not
there.

**Size.** The steps are the kit's optical pairings, not a doubling scale:

| Size | Value | Sits beside                                                |
| ---- | ----- | ---------------------------------------------------------- |
| `xs` | 18dp  | Chips and dense controls set in label-large                |
| `sm` | 20dp  | Buttons at label-large and title-medium                    |
| `md` | 24dp  | The default — icon buttons, list rows, app bars, navigation |
| `lg` | 32dp  | Buttons set in headline-large                              |
| `xl` | 40dp  | Extra-large controls                                       |

**Colour.** Icons take `currentColor`. There is deliberately no `color` prop —
one would let an icon disagree with the label it sits beside. Set a text colour
on the icon only when it is *meant* to differ.

**Naming.** Name by purpose, not by picture. The component that deletes
something imports a "delete" icon; that it happens to be drawn as a bin is an
implementation detail of the icon set, and naming it `TrashCan` means every
future search for "delete" misses it. The same rule governs `label`: "Delete",
never "Trash can".

**Reserved icons.** One glyph per action, so a user who learns a symbol learns
it once:

| Action           | Icon           | Action          | Icon            |
| ---------------- | -------------- | --------------- | --------------- |
| Close, dismiss   | `X`            | Confirm         | `Check`         |
| Back             | `ArrowLeft`    | Expand          | `ChevronDown`   |
| More actions     | `MoreVertical` | Opens elsewhere | `ExternalLink`  |
| Search           | `Search`       | Information     | `Info`          |
| Add, create      | `Plus`         | Warning         | `TriangleAlert` |
| Delete           | `Trash2`       | Error           | `CircleAlert`   |
| Edit             | `Pencil`       | Settings        | `Settings`      |

**Interactivity.** `Icon` renders a `span` and takes no press handling. An icon
that does something is an icon inside a `Button` or a `Link` — that is where the
target size, the focus ring, and the accessible role come from, and an icon that
grew its own would give you two competing versions of each.

> The shipped components still import from the icon set directly. Migrating them
> onto `Icon` is deliberate follow-up.

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

## Getting started

From nothing to a themed screen. Every step below was run against an empty Vite
project rather than written from memory, and the app quoted in step 3 is the one
that was built.

One caveat on that: the package is not published yet, so the verification run
installed it from `pnpm pack` output rather than from the registry. Everything
downstream of the install — the stylesheet wiring, the `@source` line, the
provider, the build — is exactly what was run.

### 1. Install

```bash
pnpm add materialcn react react-dom
pnpm add -D tailwindcss @tailwindcss/vite
```

Tailwind is not strictly required — `materialcn/styles.css` already contains
every utility the components use — but you want it as soon as you write any
markup of your own. See [Without Tailwind](#without-tailwind) below.

### 2. Wire the stylesheet

```css
/* src/index.css */
@import "tailwindcss";
@import "materialcn/styles.css";
@source "../node_modules/materialcn/dist";
```

The `@source` line is what lets you write `bg-m3-tertiary-container` or
`m3-expanded:grid-cols-3` in *your* markup: Tailwind only generates a class it
has seen, and by default it does not look inside `node_modules`.

Add the Tailwind plugin to your bundler:

```js
// vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({ plugins: [react(), tailwindcss()] })
```

### 3. Render a screen

```jsx
// src/App.jsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ThemeProvider,
  useTheme,
} from "materialcn"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant="tonal"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      Switch to {resolvedTheme === "dark" ? "light" : "dark"}
    </Button>
  )
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <main className="bg-background text-foreground min-h-svh p-8">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Hello, Material</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-m3-body-md">A card, a button, and a theme switch.</p>
            <ThemeToggle />
          </CardContent>
        </Card>
      </main>
    </ThemeProvider>
  )
}
```

Two things are doing work in that snippet:

- **`ThemeProvider`** puts the scheme class on `<html>` and persists the choice.
  `defaultTheme="system"` follows the OS until the user picks. It is only needed
  if you want a *switchable* theme — the tokens already follow
  `prefers-color-scheme` without it.
- **`bg-background text-foreground`** are shadcn's semantic names, pointed at
  Material roles. Nothing in that markup mentions a colour, which is the point:
  retheming does not touch it.

### 4. Optional: self-hosted Roboto Flex

```jsx
import "materialcn/fonts.css"
```

Deliberately opt-in. Bundling six woff2 subsets into the main stylesheet would
force them on every consumer and defeat `unicode-range` subsetting. Without it,
the type scale falls back to the system UI font — everything still works, the
letterforms are just not Roboto Flex.

### Supported browsers

The floor comes from CSS the library actually emits, not from a policy:

| Feature                     | Where it is used                          | Chrome | Safari | Firefox |
| --------------------------- | ----------------------------------------- | ------ | ------ | ------- |
| `oklch()`                   | Every colour role                         | 111    | 15.4   | 113     |
| `color-mix()`               | State layers, disabled content             | 111    | 16.2   | 113     |
| `linear()` easing           | The spring curves                          | 113    | 17.2   | 112     |
| `@container`                | Carousel, responsive component geometry    | 105    | 16     | 110     |
| `:has()`                    | Variant geometry across most components    | 105    | 15.4   | 121     |
| `@property`                 | Tailwind v4's own output                   | 85     | 16.4   | 128     |

Which gives:

**Chrome / Edge 113+ · Safari 17.2+ · Firefox 128+**

By OS, the Safari row is the binding one: **macOS 14.2+** and **iOS/iPadOS
17.2+** (December 2023). Chromium on Android follows the Chrome number.

`linear()` is the newest requirement, and it is not cosmetic — it is how the M3
Expressive spring curves are expressed, since CSS has no `spring()`. On an older
engine the easings fall back to linear interpolation: everything still animates,
it just loses the overshoot that makes Expressive expressive.

Firefox 128 comes from Tailwind v4 rather than from anything here.

## Consuming the package

There are two ways in. Install the npm package and import components from it,
or use materialcn as a **shadcn registry** and copy the source into your own
project, the way you would any other shadcn component.

```ts
import { Button, ThemeProvider } from "materialcn"
import "materialcn/styles.css"
import "materialcn/fonts.css" // optional: self-hosted Roboto Flex
```

The registry and a live demo of the screens below are published at
<https://guillermo-rebolledo.github.io/materialcn/>.

### As a shadcn registry

```bash
npx shadcn registry add @materialcn=https://guillermo-rebolledo.github.io/materialcn/r/{name}.json
npx shadcn add @materialcn/button
```

Or, without registering the namespace, by URL:

```bash
npx shadcn add https://guillermo-rebolledo.github.io/materialcn/r/button.json
```

Either one copies `button.tsx` and its variants into your `components/ui`,
installs Base UI, and merges the whole M3 token layer into the stylesheet your
`components.json` points at — so the button renders as Material immediately,
and every `bg-primary` you already had renders as Material too.

The token layer arrives as one item, `@materialcn/materialcn-theme`, which
every component depends on. Add it on its own to retheme an existing shadcn
project without taking any components:

```bash
npx shadcn add @materialcn/materialcn-theme
```

The tokens are merged into your CSS rather than imported from a file, because
the registry cannot know where your stylesheet lives. One consequence: the
explanatory comments in `src/styles/tokens/` do not survive the trip. Read them
here.

Roboto Flex is installed but not loaded — add `import
"@fontsource-variable/roboto-flex"` to your entry point, or point
`--m3-font-plain` and `--m3-font-brand` at a font of your own.

### Without Tailwind

`dist/styles.css` carries the tokens, the `@theme` mapping, and every utility
the components use, so consumers without Tailwind still get a working
stylesheet — the components render correctly, you just cannot add `m3-`
utilities of your own. Consumers who *do* use Tailwind should scan the package
so their own markup can use them:

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

### Search views

`SearchView` combines the controlled SearchBar query with Material List results
in either a `docked` or `full-screen` presentation. Arrow keys transfer focus
from the query to enabled results, Enter selects, and Escape dismisses and
restores focus.

```tsx
<SearchView
  open={open}
  onOpenChange={setOpen}
  value={query}
  onValueChange={setQuery}
  onSelect={openDestination}
  presentation="docked"
>
  <SearchViewBar>
    <SearchBarInput aria-label="Search destinations" />
  </SearchViewBar>
  <SearchViewContent state="results">
    <SearchViewList aria-label="Destinations">
      <SearchViewItem value="Oaxaca">Oaxaca</SearchViewItem>
    </SearchViewList>
  </SearchViewContent>
</SearchView>
```

Use `SearchViewMessage` for loading, empty, and error feedback. Result and
suggestion rows compose the existing List item content slots.

### Date pickers

`DatePicker` provides a controlled docked field/calendar. `DatePickerDialog`
reuses the calendar in modal calendar or input mode, while `DateRangePicker`
uses `{ start, end }` values and explicit confirmation. All accept a locale,
date constraints, and an unavailable-date predicate without coupling to a form
library.

### Time pickers

`TimePicker` is a controlled segmented keyboard entry component. Its
presentation-independent `{ hour, minute }` value stays in 24-hour terms while
`mode="12-hour"` adds an AM/PM control. `parseTime`, `formatTime`, and
`isValidTime` are exported for form adapters and alternate presentations.
`DialTimePicker` presents that same value in an accessible dialog, and
`TimeDial` is available when an application already owns the surrounding
modal. Native dial buttons support pointer, touch, and roving arrow-key focus.

### Floating action buttons

`FAB` supplies icon-only small, medium, and large actions and requires an
accessible name. `ExtendedFAB` requires a visible `label`. Both expose Material
surface, primary, secondary, and tertiary colors plus round and square
expressive shapes while reusing Button interaction behavior.
`FABMenu` adds controlled or uncontrolled expansion, labeled `FABMenuAction`
slots, four anchored placements, scrim dismissal, contained focus, and focus
restoration to the primary `FABMenuTrigger`.

### Application bars

`TopAppBar` provides small, medium, and large shells with explicit navigation,
title, actions, avatar/custom-content, and overflow slots. Supply `scrolled`
from the application’s own scroll observer to raise the bar without coupling
the component to a page container.
`BottomAppBar` is a responsive 80dp action surface with `BottomAppBarActions`
and an optional `BottomAppBarFAB` slot. `safeArea` adds the platform bottom
inset without fixing the bar to an application shell.

### Navigation

`NavigationBar` owns no route state: pass `value` and `onValueChange`, then
compose link or button `NavigationBarItem`s with icons, labels, and optional
NotificationBadges. Horizontal and vertical modes share arrow, Home, and End
keyboard navigation and selected links expose `aria-current="page"`.
`NavigationRail` reuses that controlled destination model in a compact 80dp
rail, with stable menu, FAB, destination, and notification regions.
Pass controlled `expanded` and `onExpandedChange` props to switch that same
rail to its 360dp persistent-label layout; `NavigationRailExpansionToggle`
wires the state without mixing menu and destination keyboard behavior.

### Toolbars

`Toolbar` composes existing Button, ToggleGroup, ButtonGroup, Separator,
DropdownMenu, and FAB primitives through labeled group, divider, overflow, and
FAB slots. Standard and expressive presentations share arrow-key ordering;
overflow focus restoration remains owned by DropdownMenu.

### Text fields

`TextField` unifies outlined and filled, single-line and multiline controls.
Leading/trailing content, prefix/suffix text, support/error messages, counters,
disabled/read-only state, and controlled or uncontrolled values share one API.
Multiline uses `InputGroupTextarea`, not a nested raw control.

TabsList variants are documented as `primary`, `secondary`, and `segmented`;
legacy `line` and `default` names remain compatible. Horizontal and vertical
orientations continue to use the same TabsTrigger and TabsContent semantics.

Use `Tooltip` only for non-interactive hints. `RichTooltip` uses the Popover
foundation for a title, supporting description, and action region, with hover,
focus, Escape/outside dismissal, collision placement, and focus restoration.

`Separator` supports `full`, `inset`, and `middle-inset` horizontal variants
plus vertical orientation. Use `decorative` for purely visual rules and
`SeparatorSubhead` for a semantic heading-and-divider composition.

`Slider` now accepts `size="small|medium|large"` and
`variant="standard|centered"`, with optional tick and value indicators.
Single/range and horizontal/vertical inputs keep Base UI dragging, keyboard,
disabled, and accessible-value behavior.

`SheetContent side="bottom"` uses the Material modal bottom-sheet shape,
surface, scrim, elevation, and 412×480dp maximum geometry. Compose
`SheetHandle`, `SheetHeader`, `SheetBody`, and `SheetFooter` for the standard
layout. `SheetHandle` is presentation-only and deliberately exposes no drag
semantics; products that require swipe-to-dismiss physics should adopt the
shadcn Drawer/Vaul foundation instead of layering gestures onto Dialog state.

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
in place. The component backlog through the Material bottom-sheet refinement
is implemented; remaining compatibility coverage and deferred kit content are
tracked in `docs/component-backlog.md`.
