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

## Slider

Total heights: XS 44 · S 44 · M 52 · L 68. Active/inactive track radius 2,
separated by a 4dp gap around the handle. The Expressive handle is a 4dp-wide
pill rather than a circle.

## Progress

Linear: 4dp thickness, full radius, 4dp gap between the active indicator and the
remaining track, with a stop dot at the end.

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

56dp for a single line, 16dp horizontal padding, 8dp vertical.

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
