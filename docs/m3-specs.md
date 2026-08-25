# M3 spec reference

Measurements pulled from the official **Material 3 Design Kit (Community)**
Figma file, decoded with `tools/fig-decode.mjs`. Regenerate with:

```bash
node tools/fig-decode.mjs "<path>/Material 3 Design Kit (Community).fig" /tmp/m3
node tools/fig-tokens.mjs /tmp/m3 > /tmp/m3/tokens.json   # variable collections
node tools/fig-report.mjs /tmp/m3 '^Switch$'              # component geometry
```

Sizes are dp (== px at 1×). Color names are M3 roles.

## Shape scale

Confirmed against the kit's `Corner/*` variables.

| Token | dp |
| ----- | -- |
| None | 0 |
| Extra-small | 4 |
| Small | 8 |
| Medium | 12 |
| Large | 16 |
| Large-increased | 20 |
| Extra-large | 28 |
| Extra-large-increased | 32 |
| Extra-extra-large | 48 |
| Full | pill |

## State layers

The kit defines exactly three opacities, applied as the *content* color over
the container: **8%** (hover), **10%** (focus / pressed), **16%** (dragged).

## Button

Height 40, radius full, gap 8, label-large (14/20 Medium).

| Variant | Container | Content | Padding |
| ------- | --------- | ------- | ------- |
| Filled | Primary | On Primary | 24 |
| Tonal | Secondary Container | On Secondary Container | 24 |
| Elevated | Surface Container Low + level 1 | Primary | 24 |
| Outlined | transparent + 1px Outline | Primary | 24 |
| Text | transparent | Primary | 12 |

With a leading icon the leading padding drops to 16 (Text: 12/16).

Expressive size scale (heights): XS 32 · S 40 · M 56 · L 96 · XL 136.
Type follows: XS/S label-large, M title-medium (16/24), L headline-small
(24/32), XL headline-large (32/40).

## Button group

Button groups contain related actions without adding selection state. Standard
groups preserve each button's complete shape; connected groups use a 2dp gap
and coordinate the outer and shared corners. Selection remains the
responsibility of `ToggleGroup`.

Standard-group spacing follows the kit:

| API size | Button height | Group minimum | Gap | Axis padding |
| -------- | ------------- | ------------- | --- | ------------ |
| `xs` | 32 | 48 | 18 | 9 |
| `sm` / `default` | 40 | 48 | 12 | 6 |
| `lg` | 56 | 56 | 8 | 0 |
| `xl` | 96 | 96 | 8 | 0 |
| `2xl` | 136 | 136 | 8 | 0 |

Connected-group corner geometry is:

| API size | Rest / disabled inner | Hover / focus / pressed inner | Round outer |
| -------- | --------------------- | ----------------------------- | ----------- |
| `xs` | 4 | 12 | 16 |
| `sm` / `default` | 8 | 12 | 20 |
| `lg` | 8 | 16 | 28 |
| `xl` | 16 | 28 | 48 |
| `2xl` | 20 | 32 | 68 |

Square connected groups use the inner radius on their outer ends. Horizontal
groups apply the outer shape to the first and last inline edges; the vertical
orientation mirrors that rule on the block axis. XS and S connected horizontal
groups retain a 48dp minimum touch-target height.

## Split button

The split button composes a leading immediate action and a trailing action-menu
trigger with a 2dp gap. Its segment proportions differ from the equal columns
of a general connected button group.

| API size | Group min | Segment height | Trigger width | Outer radius | Rest / focus inner | Hover / press inner | Action gap | Action padding | Action / trigger icon |
| -------- | --------- | -------------- | ------------- | ------------ | ------------------ | ------------------- | ---------- | -------------- | --------------------- |
| `xs` | 48 | 32 | 48 | 16 | 4 | 8 | 4 | 12 | 20 / 22 |
| `sm` / `default` | 48 | 40 | 48 | 20 | 4 | 12 | 8 | 16 | 20 / 22 |
| `lg` | 56 | 56 | 56 | 28 | 4 | 12 | 8 | 24 | 24 / 26 |
| `xl` | 96 | 96 | 96 | 48 | 8 | 20 | 12 | 48 | 32 / 38 |
| `2xl` | 136 | 136 | 136 | 68 | 12 | 20 | 16 | 64 | 40 / 50 |

The outer inline corners stay at the outer radius. Hover and held press soften
only the shared edge; focus retains the resting inner radius. While the menu is
open, the trailing segment becomes a fully rounded selected shape. Filled,
tonal, outlined, and elevated treatments reuse the corresponding Button color
roles and state layers.

## Switch

Track 52×32, radius full.

| | Track | Handle |
| - | ----- | ------ |
| Unselected | Surface Container Highest + 2px Outline | 16dp, Outline |
| Selected | Primary | 24dp, On Primary |
| Pressed | — | 28dp |

## Checkbox

18dp box, radius 2, 2px Outline unselected / Primary filled when selected.
48dp touch target.

## Radio

20dp, 2px Outline ring; selected draws a 10dp Primary dot. 48dp touch target.

## Chip

Height 32, radius 8, gap 8, label-large. Padding 16 label-only, 8 with an icon.

## Card

Radius 12.

| Variant | Container |
| ------- | --------- |
| Elevated | Surface Container Low + elevation 1 |
| Filled | Surface Container Highest |
| Outlined | Surface + 1px Outline Variant |

## Dialog

Radius 28 (extra-large), padding 24, headline 24/32, Surface Container High.

## Tooltip

Plain: Inverse Surface container, Inverse On Surface label, body-small (12/16),
radius 4.

## Snackbar

The current kit uses a 344dp-wide Inverse Surface container with Inverse On
Surface body-medium text (14/20 Regular), 4dp corners, and elevation 3. The
same semantic inverse roles swap automatically in dark mode.

| Layout | Height | Horizontal padding | Vertical padding |
| ------ | ------ | ------------------ | ---------------- |
| One line | 48 | 16 | 14 |
| Two lines | 68 | 16 | 14 |
| Two lines + longer action | 112 | 16 message / 8 action row | 14 message |

The inline action is a 40dp inverse text button with 12dp horizontal padding
and label-large text. The optional close affordance occupies a 48dp touch
target. Inline controls follow the message without a separate gap between the
action and close control; longer actions move into a trailing row.

## Slider

Total heights: XS 44 · S 44 · M 52 · L 68. Active/inactive track radius 2,
separated by a 4dp gap around the handle. The Expressive handle is a 4dp-wide
pill rather than a circle.

## Progress

Linear: 4dp thickness, full radius, 4dp gap between the active indicator and the
remaining track, with a stop dot at the end.

Circular progress uses a round-capped Primary indicator over a Secondary
Container track. Determinate indicators leave a 4dp gap on both sides of the
remaining track; indeterminate indicators keep the track visible while the
active arc grows, contracts, and advances clockwise.

| Circular variant | 4dp stroke | 8dp stroke |
| ---------------- | ---------- | ---------- |
| Flat | 40 × 40dp | 44 × 44dp |
| Wavy | 48 × 48dp | 52 × 52dp |

The Expressive wavy form uses six radial lobes on a 20dp centreline with ±2dp
radial amplitude. Under reduced motion, an
indeterminate indicator keeps a static partial arc so it still communicates
ongoing work without continuous rotation.

## Loading indicator

The expressive loading indicator occupies a 48 × 48dp standalone container
with a 38 × 38dp active shape. The library also provides a proportional 24dp
inline container with a 19dp active shape for text-adjacent waiting states.

The uncontained active shape uses Primary. The contained treatment fills the
48dp circular container with Primary Container and paints the shape with On
Primary Container. Both treatments morph through the kit's seven authored
shapes in the prototype order: Step 1 → 2 → 3 → 4 → 5 → 7 → 6. Each transition
lasts 400ms and uses `cubic-bezier(0.2, 0, 0, 1)`. Reduced motion freezes the
recognizable first shape rather than removing the loading affordance.

## Text field (outlined)

56dp tall, radius 4, 16dp horizontal padding. The outline carries the state —
there is no separate focus ring:

| State | Outline |
| ----- | ------- |
| Enabled | 1dp Outline |
| Hovered | 1dp On Surface |
| Focused | 3dp Primary |
| Error | 1dp Error, 3dp when focused |
| Disabled | 1dp On Surface at 12% |

Strokes are `INSIDE`-aligned in the kit, so a CSS border of the same weight
matches — but growing a border reflows the text, which is why the focused
weight is painted as an inset shadow instead.

Supporting text: 16dp padding, body-small, On Surface Variant.

Filled fields keep the 56dp single-line measure but replace the full outline
with `Surface Container Highest`, 4dp top corners, and a 1dp bottom rule.
Multiline fields use the same InputGroup control slot with a 96dp minimum
content area; leading/trailing icons, prefixes, suffixes, counters, and support
or error text preserve 16dp supporting insets.

## Wavy progress (Expressive)

The active indicator is a travelling sine. From the kit's `wave-increment`
vectors:

| | |
| - | - |
| Box height | 12dp |
| Wavelength | 40dp (a 20dp half-wavelength segment also exists) |
| Centreline | 6dp peak-to-peak, i.e. ±3 amplitude |
| Stroke | 4dp, or 8dp for the thick variant |
| Cap | round |
| Colour | Primary |

At 0% the kit swaps in a flat `40×0` segment, so the wave collapses to a line.

Implemented as a repeating CSS mask rather than an inline path: the tile runs
**peak to peak**, where the tangent is horizontal, so a butt cap lands exactly
on the tile edge and the repeat is seamless at any width. The inactive rule has
to start after the indicator — a full-width rule shows through the troughs.

## Menu

The current Expressive menu set is separate from Select and has two themes:

| Theme | Menu container | Selected item | Selected content |
| ----- | -------------- | ------------- | ---------------- |
| Standard | Surface Container Low | Tertiary Container | On Tertiary Container |
| Vibrant | Tertiary Container | Tertiary | On Tertiary |

The menu is 208dp wide with an 8dp outer radius when it contains multiple
groups (4dp for the single-group example). Each item occupies a 48dp row: its
44dp state-layer container is inset 4dp horizontally and 2dp vertically, with
12dp horizontal content padding, an 8dp gap, 20dp leading/trailing elements,
and label-large text (14/20 Medium). Selected items use a 12dp radius.

## Select

The baseline value-selection popup uses Surface Container, radius 4, item
height 48, 12dp horizontal padding, and body-large text. It remains distinct
from the action-menu composition above.

## List item

List items use 16dp horizontal padding and a 16dp gap between leading,
content, and trailing slots. Density changes only the vertical geometry; the
content structure and type roles stay the same.

| Density | One line | Two lines | Three lines |
| ------- | -------- | --------- | ----------- |
| Default | 56 | 72 | 88 |
| -2 | 48 | 64 | 80 |
| -4 | 40 | 56 | 72 |

The headline uses body-large (16/24 Regular), supporting text uses body-medium
(14/20 Regular), overlines use label-medium (12/16 Medium), and trailing
metadata uses label-small (11/16 Medium). Leading icons are 24dp, avatars are
40dp, and image media is 56dp. Three-line items with both an overline and
two-line supporting text grow beyond the baseline height rather than clipping
content; the default-density kit example is 104dp with 12dp vertical padding.

## Carousel

The responsive carousel component sets in the kit use a 16dp horizontal inset,
8dp vertical inset, 8dp item gap, and 28dp item radius. Mobile multi-browse,
hero, and uncontained examples occupy 412 × 221dp with 205dp-tall items; the
mobile standard example and every tablet example use 220dp shells with 204dp
items. The one-pixel difference belongs to the source component rather than a
separate public size.

| Layout | Mobile visible widths | Tablet visible widths |
| ------ | --------------------- | --------------------- |
| Standard / multi-aspect ratio | 362.224, 270.674, 204, 153.249, 116 | same sequence |
| Multi-browse | 188, 120, 56 | 184, 184, 120, 56 |
| Hero | 316, 56 | 184, 184, 120, 56 |
| Center-aligned hero | 56, 252, 56 | 184, 184, 120, 56 |
| Uncontained | 154, 154, then 72 visible | 162.667 × 3, then 72 visible |
| Full screen | one 412 × 892 item | — |

Multi-browse and hero widths move with the selected snap so the emphasized
item remains the current item. Uncontained items keep equal intrinsic widths;
the 72dp value is the visible portion clipped by the viewport, not a smaller
content item. Full-screen items inherit the available viewport height instead
of fixing a device-specific 892dp height.

Item-size morphs use the effects spring because flex basis is clamped. Embla
owns spatial drag and swipe movement. Under reduced motion the item transition
is removed and Embla is reinitialized with zero movement duration.

## Search bar

The kit's Search bar is 360 × 56dp with a 28dp container radius, 4dp outer
inset, body-large input text (16/24 Regular), and `Surface Container High`
fill. Leading and trailing regions occupy the inset 48dp touch area while their
icon buttons retain the existing 40dp Material button target. The default
container uses elevation level 1 and rises to level 2 for hover or focus.

Populated, navigation, voice, avatar, disabled, and error compositions keep the
same outer geometry. Disabled state removes elevation and uses the disabled
surface/content roles; invalid state uses the error outline without changing
layout. SearchBar controls only its query and form interactions—docked and
full-screen result surfaces belong to SearchView.

## Search view

The kit's docked search view uses a 360dp-wide `Surface Container High`
container with a 12dp outer radius. Its 56dp search row leaves 194dp for the
scrolling suggestion or result region in the 250dp final state. The full-screen
presentation fills its caller-provided viewport and removes the outer radius;
both presentations preserve the SearchBar's 56dp row and List item geometry.

SearchView deliberately keeps query and visibility controlled. This lets one
model survive responsive switches between docked and full-screen presentation.
Recent, suggestion, loading, result, empty, and error content all occupy the
same live content region without replacing the search control.

## Date picker

The desktop docked picker is 360dp wide with a 16dp container radius and a
`Surface Container High` fill. The calendar uses seven 40dp day targets inside
12dp horizontal padding and keeps its localized month/year controls in a 56dp
header. Selected, today, outside-month, disabled, and unavailable dates use the
same grid geometry so state changes never reflow the calendar.

Modal day pickers use the kit's 360dp shell and reuse that same grid. Input
modals use a 328dp content measure inside the responsive dialog shell. Range
selection adds endpoint circles and a secondary-container band without
changing day target size; incomplete ranges preserve only the start endpoint.

## Time picker

Keyboard time entry uses separate 80 × 64dp hour and minute segments with a
14dp gap region for the separator and an adjacent 56dp period control in
12-hour mode. The public value is always `{ hour, minute }` in 24-hour terms,
so keyboard and dial presentations share constraints, formatting, and errors.
The clock dial uses a 256dp circular surface with 36dp numeral targets. Twelve-
hour mode uses the outer ring; 24-hour mode adds a 72dp-radius inner ring for
13–00. Effects transitions are removed under reduced motion.

## Floating action buttons

FABs follow the kit's 40, 56, and 96dp square scale with 12, 16, and 28dp
resting corners; round alternatives use half-height radii. Extended FABs are
56dp high with 16dp horizontal padding and a 12dp icon gap, or 96dp high with
28dp padding and a 16dp gap. Surface, primary, secondary, and tertiary
container roles all share elevation level 2, rising to level 3 on hover.
FAB menus keep 12dp between their 48dp labeled secondary actions and 16dp
between the action stack and primary FAB. The scrim uses the shared scrim role
at 32%; entrance uses the fast effects motion and disappears under reduced
motion.

## App bars

Top app bars are 64dp small, 116dp medium, and 160dp large. Medium titles use
headline-small at the lower edge; large titles use headline-medium. The caller
owns scroll observation and supplies `scrolled`, which switches the bar from
Surface to Surface Container and elevation level 2 without changing geometry.
Bottom app bars are 80dp high at the 412dp reference width, with a 16dp outer
radius and Secondary Container fill. Actions keep 48dp targets; the optional
FAB occupies the trailing region without changing source or focus order.

## Navigation bar

The reference navigation bar is 412 × 80dp and accepts three to five equal
destinations. Each item keeps a 64 × 32dp selected indicator around the 24dp
icon and a label-small destination name. The vertical presentation reuses the
same 80dp measure and selection model rather than introducing separate items.
The compact navigation rail is 80dp wide with 4dp inline padding. Its menu and
FAB regions precede a flexible vertical destination list; compact destinations
hide labels visually and expose them through focus/hover tooltips.
Expanded rails use a 360dp container and convert the same destinations to 56dp
horizontal rows with persistent labels. Expansion changes only width and
layout; destination identity, focusable nodes, selection, and badges persist.

## Toolbar

Standard toolbars use a 64dp minimum height and 16dp container radius;
expressive toolbars use 96dp and 28dp. Both retain source order across action,
toggle, connected-control, divider, overflow, and FAB slots. Arrow keys move
among enabled controls while composed menus continue to own popup focus.

## Tabs

Primary tabs use a 48dp row and 3dp full-trigger indicator. Secondary tabs
keep the 48dp row but use body-medium labels and a 2dp indicator inset 16dp
from the trigger edges. Segmented tabs retain their tonal active pill. All
three presentations share the same Base UI tab/panel semantics and orientation.

## Tooltips

Plain hints retain their 24dp-high inverse-surface treatment. Rich tooltips use
a collision-aware Popover foundation, a maximum 320dp width, 12dp corners,
16dp padding, Surface Container fill, and elevation level 2. They can contain
title, body, and actions and therefore expose dialog rather than tooltip
semantics.

## Dividers

Material dividers are 1dp Outline Variant rules. Full width uses the entire
container, inset begins 16dp from the leading edge, and middle-inset leaves
16dp at both edges. Vertical dividers keep the same 1dp measure. The subhead
composition uses a title-small heading in a 48dp row followed by a decorative
rule.

## Slider variants

The Material slider size scale uses 4, 8, and 16dp tracks with 32, 40, and
44dp handles; every handle retains a minimum 48dp invisible touch target.
Centered sliders paint the active segment between the midpoint and the single
value. Standard sliders retain min-to-value and range indicators. Horizontal
and vertical geometry, ticks, value labels, dragging, and keyboard increments
share the same Base UI value model.

## Button shape morph on press

Expressive buttons tighten their corners while pressed. The *classic* M3 set
(the `Configuration=` / `Style=` axis) does **not** — it keeps the pill. Only
the Expressive sets (`Type=` × `Size=`) morph, and label, icon, and toggle
buttons all share one table:

| Size | Round: rest → pressed | Square: rest → pressed |
| ---- | --------------------- | ---------------------- |
| XSmall (32) | full → 8 | 12 → 8 |
| Small (40) | full → 8 | 12 → 8 |
| Medium (56) | full → 12 | 16 → 12 |
| Large (96) | full → 16 | 28 → 16 |
| XLarge (136) | full → 16 | 28 → 16 |

## Implementing the morph in CSS

Two traps, both of which produce a visibly broken press animation:

- **Easing.** The morph must not ride a spatial spring. Those overshoot ~9%, and
  an overshoot on `border-radius` interpolates below the target into negative
  values, which CSS clamps to 0 — the button flicks through a hard-cornered
  rectangle. Use the critically damped effects spring.
- **Start value.** Write the resting pill radius as half the height (20px for a
  40dp button), not as a `full` / 9999px sentinel. Interpolating from 9999px
  means the perceptible range is crossed in the last 0.1% of the curve.

## State layer geometry

The state layer covers the **border box**, not the padding box. Sizing it with
`inset: 0` puts it on the padding box while `border-radius: inherit` gives it
the border-box radius — the corners then disagree, and on a bordered variant a
pale crescent appears between the outline and the wash. `inset: -1px` against a
1px border makes the two boxes identical.

A negative `z-index` paints the layer above the element's own border, which is
correct here: in Material the wash covers the whole container shape, outline
included.

## Button padding

Contained variants (filled / tonal / elevated / outlined) use 24dp; the text
variant uses 12dp. A leading icon drops the leading padding to 16dp (text: 12).
