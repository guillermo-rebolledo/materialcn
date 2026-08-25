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

From the Expressive `Button` sets on the Buttons page (the 24dp-padded,
icon-reduced button only survives on the deprecated internal canvas).

| Variant | Container | Content |
| ------- | --------- | ------- |
| Filled | Primary | On Primary |
| Tonal | Secondary Container | On Secondary Container |
| Elevated | Surface Container Low + level 1 (no hover lift) | Primary |
| Outlined | transparent + 1px Outline Variant (all states) | On Surface Variant |
| Text | transparent | Primary |

Padding is symmetric whether or not a leading icon is present, and text
buttons use the same padding as filled ones. Disabled containers are On
Surface at **10%**, content at 38%.

| Size | Height | Padding | Gap | Type |
| ---- | ------ | ------- | --- | ---- |
| XSmall | 32 | 12 | 4 | label-large |
| Small | 40 | 16 | 8 | label-large |
| Medium | 56 | 24 | 8 | title-medium (16/24 Medium) |
| Large | 96 | 48 | 12 | headline-small (24/32 **Regular**) |
| XLarge | 136 | 64 | 16 | headline-large (32/40 **Regular**) |

Icon buttons keep a 24dp icon at Small (40) and Medium (56); XSmall uses 20.

## Toggle button

Unselected: Surface Container / On Surface Variant. Selected: **Primary / On
Primary**, and the shape swaps — round toggles settle from a pill to the 12dp
corner (16 at Medium), square toggles go the other way. The outlined toggle
inverts to Inverse Surface / Inverse On Surface with the stroke removed.

The segmented button is a different component: 12dp segment padding, a single
shared Outline stroke, Secondary Container / On Secondary Container when
selected, and an 18dp leading check.

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
| Unselected | Surface Container Highest + 2px Outline | 16dp, Outline (On Surface Variant while interacting) |
| Selected | Primary | 24dp, On Primary (Primary Container while interacting) |
| Pressed | — | 28dp, inset 2dp when unselected |

The handle carries a 40dp state layer.

## Checkbox

18dp box, radius **2** (not the 4dp xs step), 2px On Surface Variant stroke
that darkens to On Surface while interacting; Primary filled when selected or
indeterminate. Every selection control carries a 40dp circular state layer
(8 / 10 / 10 %) and a 3dp Secondary focus ring around it. 48dp touch target.

## Radio

20dp, 2px Outline ring; selected draws a 10dp Primary dot. Same 40dp state
layer and focus ring as the checkbox. 48dp touch target.

## Chip

Height 32, radius 8, gap 8, label-large, 18dp icons. Padding 16 label-only, 8
with an icon. Assist labels are On Surface; filter, suggestion and input
labels are On Surface Variant. Input chips have no container fill unless
selected (Secondary Container, no stroke) and a 12dp leading inset without an
icon. `Style=Elevated` is Surface Container Low at level 1 (level 2 pressed).

## Card

Radius 12.

| Variant | Container |
| ------- | --------- |
| Elevated | Surface Container Low + elevation 1 |
| Filled | Surface Container Highest |
| Outlined | Surface + 1px Outline Variant |

## Dialog

Radius 28 (extra-large), padding 24, headline 24/32, Surface Container High.
The content stack (optional 24dp Secondary icon → headline → supporting text)
is 16dp apart and centred when an icon is present.

## Side sheet

320dp wide, Surface Container Low, 16dp corners on the inner edge, elevation
1, title-large Regular in On Surface Variant. The scrim is the Scrim role at
32% with no blur; the bottom sheet's drag handle is 32 × 4dp Outline.

## Avatar

The generic avatar is 40dp with no stroke.

## Bottom sheet

The modal bottom sheet is 412dp wide and up to 480dp tall, with 28dp top
corners, 16dp content padding, 12dp internal spacing, Surface Container Low,
elevation 3, and a 32×4dp visual drag handle. The scrim uses the semantic Scrim
role at 32% opacity. Short content may reduce the height; long content scrolls
inside the body while the header and actions remain visible.

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

| Size | Track | Handle |
| ---- | ----- | ------ |
| XSmall | 16 | 44 |
| Small | 24 | 44 |
| Medium | 40 | 52 |
| Large | 56 | 68 |
| XLarge | 96 | 108 |

The handle is a 4dp-wide, 2dp-radius bar (2dp wide while dragged) with a real
**6dp** gap on either side. Active and inactive tracks are separate shapes:
outer ends fully round, handle-facing ends 2dp. Stop indicators are 4dp
Primary dots; the value indicator is a 44dp Inverse Surface pill with
label-large text.

## Progress

Linear: 4dp thickness, full radius, 4dp gap between the active indicator and the
remaining track, with a stop dot at the end.

Circular progress uses a round-capped Primary indicator over a Secondary
Container track. Determinate indicators leave a 4dp gap on both sides of the
remaining track; indeterminate indicators keep the track visible while the
active arc grows, contracts, and advances clockwise.

Linear indicator width animates on the effects spring (width is clamped).

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
| Disabled | 1dp On Surface at 12%, no container (filled: On Surface at 4%) |

The error outline is 3dp even when unfocused. The label lives inside the
field and floats — onto the outline as a 12/16 label in a Surface-filled notch
(outlined), or to the top of the container (filled) — when focused or
populated. Filled fields express focus and error only through the bottom
active indicator (1dp → 3dp).

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

The menu is 208dp wide at **elevation level 3**, with a **16dp** outer radius
holding 8dp-radius group cards 2dp apart. Section labels are label-large at
full opacity. Focus is a 2dp Secondary stroke 4dp outside the state layer. Each item occupies a 48dp row: its
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
icon buttons retain the existing 40dp Material button target. The search bar
carries **no elevation** in any state.

Populated, navigation, voice, avatar, disabled, and error compositions keep the
same outer geometry. Disabled state removes elevation and uses the disabled
surface/content roles; invalid state uses the error outline without changing
layout. SearchBar controls only its query and form interactions—docked and
full-screen result surfaces belong to SearchView.

## Search view

The kit's docked search view is two frames: the 28dp search bar, a 2dp gap,
then a 360dp-wide `Surface Container High` list with a 12dp radius and a 192dp
scrolling region. Neither frame is elevated. The full-screen
presentation fills its caller-provided viewport and removes the outer radius;
both presentations preserve the SearchBar's 56dp row and List item geometry.

SearchView deliberately keeps query and visibility controlled. This lets one
model survive responsive switches between docked and full-screen presentation.
Recent, suggestion, loading, result, empty, and error content all occupy the
same live content region without replacing the search control.

## Date picker

The desktop docked picker is 360dp wide with a 16dp container radius and a
`Surface Container High` fill. The calendar grid uses **48dp** rows and
columns with a 40dp visual circle centred in each cell, label-medium weekday
headers in On Surface, body-large numerals, and pill-shaped label-large
month/year menu buttons. Range bands span the full 48dp column so they read as
continuous. The modal header is 120dp: a label-medium supporting label above a
headline-large selected date, closed by a 1dp Outline Variant rule; local
actions put Clear leading and Cancel / OK trailing. Selected, today, outside-month, disabled, and unavailable dates use the
same grid geometry so state changes never reflow the calendar.

Modal day pickers use the kit's 360dp shell and reuse that same grid. Input
modals use a 328dp content measure inside the responsive dialog shell. Range
selection adds endpoint circles and a secondary-container band without
changing day target size; incomplete ranges preserve only the start endpoint.

## Time picker

Keyboard time entry uses 96 × 72dp hour and minute segments (8dp corners,
Surface Container Highest, display-medium numerals, Primary Container while
focused) around a fixed 24dp separator column, with a 52 × 72dp outlined
period selector (title-medium, Tertiary Container when selected) in 12-hour
mode. The public value is always `{ hour, minute }` in 24-hour terms, so
keyboard and dial presentations share constraints, formatting, and errors.
The dial presentation uses 96 × 80dp display-large segments and a 256dp
circular surface with 48dp body-large numeral targets on a 104dp ring, a 2dp
Primary clock hand from the 8dp centre dot, and a 72dp-radius inner ring for
13–00 in 24-hour mode. Effects transitions are removed under reduced motion.

## Floating action buttons

From the kit's `FAB` / `Extended FAB` sets on the Buttons page. The 40dp
"small" FAB and the `surface` colour only survive on the deprecated internal
canvas and are not part of the current scale.

| Size | Box | Icon | Corner | Extended padding | Extended gap | Extended type |
| ---- | --- | ---- | ------ | ---------------- | ------------ | ------------- |
| Default | 56 | 24 | 16 | 16 | 8 | title-medium (16/24 Medium) |
| Medium | 80 | 28 | 20 | 26 | 12 | title-large (22/28 Regular) |
| Large | 96 | 36 | 28 | 28 (30 vertical) | 16 | headline-small (24/32 Regular) |

Six colours: Primary / Secondary / Tertiary (plain role container, `On <role>`
content) and their `Container` counterparts. All rest at **elevation level 3**
and rise to **level 4** on hover. The pressed variants keep the resting corner
radius — the FAB does not morph like the buttons do.

FAB menus stack 56dp pill actions (24dp horizontal padding, 8dp icon gap,
title-medium label, `<colour> Container` fill) 4dp apart and 8dp from a 56dp
*round* FAB in the plain colour role. The scrim uses the shared scrim role at
32%; entrance uses the fast effects motion and disappears under reduced
motion.

## App bars

Top app bars are 64dp small, **112dp** medium, and **120dp** large, with 4dp
inline padding and a 4dp gap so the title starts 56dp in. Medium titles use
headline-small 12dp above the lower edge; large titles use headline-medium.
The caller owns scroll observation and supplies `scrolled`, which switches the
fill from Surface to Surface Container — the kit carries no elevation on
either state. Bottom app bars are 80dp high, **Surface Container**, square
and unelevated, with a 4dp leading / 16dp trailing inset and 8dp between
actions. Actions keep 48dp targets; the optional FAB occupies the trailing
region without changing source or focus order.

## Navigation bar

From the kit's `Navigation Bar` sets and `Building Blocks/Navigation bars`
nav items on the Navigation page. The bar is **64dp** tall (the 80dp bar is the
deprecated internal-canvas one) with a Surface Container fill and three to six
equal destinations.

| Item | Box | Indicator | Content | Label |
| ---- | --- | --------- | ------- | ----- |
| Vertical (stacked) | 104 × 64, 6dp vertical padding | 56 × 32 pill, 4dp gap to label | 24dp icon | label-medium (12/16 Medium) |
| Horizontal (inline) | 92 × 64 | 92 × 40 pill, 16 × 8 padding, 4dp gap | 24dp icon + label inside | label-medium |
| Label hidden | 104 × 64, 4dp vertical padding | 56 × 56 circle | 24dp icon | — |

Selected: Secondary Container indicator, On Secondary Container icon, and a
**Secondary** caption (On Secondary Container when the caption sits inside the
indicator). Unselected: On Surface Variant. Hover/focus/press state layers
(8 / 10 / 10 %) paint on the indicator only. Focus is a 3dp Secondary stroke
inset 3dp with a 12dp radius. Large badges are 16dp Error circles at the top
trailing corner of the icon; small badges are 6dp dots.

## Navigation rail

From `Navigation Rail` / `Navigation Rail: Expanded` on the Navigation page.

| | Compact | Expanded (docked) |
| - | ------- | ----------------- |
| Width | **96** | **220** |
| Padding | 44 top, 56 bottom | 44 top, 20 sides and bottom |
| Menu + FAB | 56dp icon button and 56dp FAB, 4dp apart | same, with a 104 × 56 Extended FAB |
| Gap to destinations | 40 | 40 |
| Destination | the navigation bar's vertical nav item, 4dp apart | 56dp pill row, 16dp padding, 8dp gap, label-large, no gap |

Compact destinations show their captions by default; hiding them switches to
the 56dp circular indicator and a tooltip. The floating expanded rail adds a
Surface Container fill with 16dp corners. Expansion changes only width and
layout; destination identity, focusable nodes, selection and badges persist.

## Toolbar

Every toolbar is 64dp. `Floating` has **32dp** corners, 12 × 8dp padding, a
4dp gap and elevation level 3; `Docked` is flat, square and full-width with
12 × 16dp padding and an 8dp gap. `Standard` colour is Surface Container,
`Vibrant` is Primary Container. Both retain source order across action,
toggle, connected-control, divider, overflow, and FAB slots. Arrow keys move
among enabled controls while composed menus continue to own popup focus.

## Tabs

Primary tabs use a 48dp row (64dp with a stacked icon: 10 / 8 padding, 2dp
gap) and a 3dp rounded indicator as wide as the **label**, not the trigger.
Secondary tabs keep the 48dp row, the same title-small labels, and a square
2dp indicator spanning the full trigger. Segmented tabs retain their tonal active pill. All
three presentations share the same Base UI tab/panel semantics and orientation.

## Tooltips

Plain hints retain their 24dp-high inverse-surface treatment and carry no
caret. Rich tooltips use a collision-aware Popover foundation, a 312dp width,
12dp corners, 12 / 16 / 8dp padding, a title-small On Surface Variant
subhead 4dp above the body, Surface Container fill, and elevation level 2. They can contain
title, body, and actions and therefore expose dialog rather than tooltip
semantics.

## Dividers

Material dividers are 1dp Outline Variant rules. Full width uses the entire
container, inset begins 16dp from the leading edge, and middle-inset leaves
16dp at both edges — on either axis. The subhead composition stacks the rule
above a title-small On Surface Variant heading with 4dp between them and
16dp side padding.

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
