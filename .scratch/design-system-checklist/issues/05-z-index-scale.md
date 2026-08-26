# 05 — Z-index token scale

**What to build:** Overlays stack in a predictable, documented order. Today the
snackbar improvises its stacking with an inline calculation and the other
overlays rely on the underlying primitive library's internals, so there is no
answer to "does a tooltip render above a modal" other than trying it.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] A z-index scale is defined in the token layer covering the overlay layers
      the library ships: raised surfaces, sticky headers, menus, scrims, modals,
      snackbars, and tooltips.
- [x] The snackbar's stacking uses the scale, keeping its existing behaviour
      where later toasts sit above earlier ones.
- [x] Every other overlay component either uses the scale or is documented as
      deliberately delegating to the primitive library.
- [x] A story renders overlapping overlays together and demonstrates the
      documented order holds.
- [x] The README documents the scale and the order.
- [x] Typecheck, lint, build, and the story test run pass.
