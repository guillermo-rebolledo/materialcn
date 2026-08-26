# Design system checklist — tickets

Derived from `docs/checklist-gaps.md`. One file per ticket, numbered in
dependency order (blockers first). Every ticket is `ready-for-agent`.

Only 03 and 04 have blockers — the rest can be picked up in any order, so the
frontier is wide from the start.

## Foundations — token layer

| # | Ticket | Blocked by |
| - | ------ | ---------- |
| 01 | Window size class breakpoint tokens | — |
| 02 | Spacing scale and 4dp unit tokens | — |
| 03 | Responsive grid tokens | 01 |
| 04 | Responsive typography scale | 01 |
| 05 | Z-index token scale | — |
| 06 | Contrast verification for the generated palette | — |

## Components that don't exist

| # | Ticket | Blocked by |
| - | ------ | ---------- |
| 07 | Icon (and the iconography guidance) | — |
| 08 | Link | — |
| 09 | Alert | — |
| 10 | Breadcrumbs | — |
| 11 | Pagination | — |
| 12 | Image | — |

Icon deliberately does **not** block 08–12: they can use the icon library
directly the way every existing component does, and migrate onto Icon later.

## Existing components — missing checklist items

| # | Ticket | Blocked by |
| - | ------ | ---------- |
| 13 | Button loading state | — |
| 14 | Skeleton: reduced motion, sizes, shapes, stories | — |
| 15 | Tooltip open delay | — |
| 16 | Calendar locale-aware week start | — |
| 17 | Dropdown hover trigger | — |
| 18 | Badge sizes | — |

## Documentation

| # | Ticket | Blocked by |
| - | ------ | ---------- |
| 19 | Colour and typography usage guidelines | — |
| 20 | Component reference documentation | — |
| 21 | Getting started guide and support floor | — |
| 22 | Contribution guidelines and release hygiene | — |
| 23 | Realistic playground screen | — (best after 08, 09, 12) |
