# 13 — Button loading state

**What to build:** A button that shows the user their action is in flight,
without the button changing size as it does — a resizing button moves everything
around it and can shift the pointer off its own target mid-click.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] A loading button renders a progress indicator and is non-interactive while
      loading.
- [x] The button's width and height are identical loading and not loading, at
      every size the button supports.
- [x] The state is announced to assistive technology as busy rather than only
      being conveyed visually.
- [x] Loading is visually distinct from disabled.
- [x] The indicator honours the reduced-motion preference in the same way as the
      library's existing progress components.
- [x] Stories cover the loading state at every button size and variant,
      including a light/dark side-by-side case.
- [x] Typecheck, lint, build, and the story test run pass.
