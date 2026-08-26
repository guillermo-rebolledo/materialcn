# 002 — Memoize compound-component context values

- **Status**: TODO
- **Commit**: 8872ab1
- **Severity**: HIGH
- **Category**: Performance
- **Rule**: `react-doctor/jsx-no-constructed-context-values`
- **Estimated scope**: 9 files, 10 edit sites, ~40 lines net

## Problem

Every compound component in this library builds its context `value` as an object
literal placed directly in the JSX attribute. The literal gets a fresh identity
on every render of the container, so **all** consumers of that context re-render
whenever the container renders — even when nothing they read has changed.

This is a published library, so the fan-out is every consuming application.

The ten sites, verbatim:

    // src/components/ui/search-bar.tsx:105 — current  (re-renders per keystroke)
    <SearchBarContext.Provider
      value={{
        clear,
        disabled,
        invalid,
        readOnly,
        setInputNode,
        setValue,
        value,
      }}
    >

    // src/components/ui/search-view.tsx:118 — current  (re-renders per keystroke)
    <SearchViewContext.Provider
      value={{ close, onSelect, setValue: onValueChange, value }}
    >

    // src/components/ui/carousel.tsx:185 — current  (re-renders per Embla "select")
    <CarouselContext.Provider
      value={{
        api,
        canScrollNext,
        canScrollPrevious,
        carouselRef,
        scrollNext,
        scrollPrevious,
        selectedIndex,
      }}
    >

    // src/components/ui/navigation-bar.tsx:90 — current  (re-renders per route change)
    <NavigationContext.Provider value={{ focusValue: focusValue ?? value, itemLayout, onValueChange, setFocusValue, value }}>

    // src/components/ui/navigation-rail.tsx:43-44 — current  (two providers, wrapping TooltipProvider)
    <NavigationContext.Provider value={{ onValueChange, value }}>
      <NavigationRailContext.Provider value={{ expanded, onExpandedChange }}>
        <TooltipProvider>

    // src/components/ui/fab-menu.tsx:57 — current
    <FABMenuContext.Provider value={{ close, color, focusTrigger, open, setTriggerNode, toggle }}>

    // src/components/ui/rich-tooltip.tsx:67 — current
    <RichTooltipContext.Provider value={{ cancelClose, closeSoon, noteFocus, openNow, setTriggerNode }}>

    // src/components/ui/toggle-group.tsx:58 — current
    <ToggleGroupContext.Provider
      value={{ variant, size, shape, spacing, orientation }}
    >

    // src/components/ui/button-group.tsx:70 — current
    <ButtonGroupContext.Provider
      value={{ shape, size, variant: resolvedButtonVariant }}
    >

**Why the fix is a real win here, not cosmetic.** The members of every one of
these values are already stable. `search-bar`, `search-view`, `fab-menu`,
`rich-tooltip` and `carousel` wrap every handler in `useCallback`;
`navigation-bar` passes the raw `useState` setter `setFocusValue`;
`toggle-group` and `button-group` pass through props only. Wrapping the object
is the only thing missing — no new `useCallback` is needed anywhere.

The worst two are `search-bar.tsx:105` and `search-view.tsx:118`: `value` is
input state, so the container re-renders on every keystroke, and today that
re-renders every consumer including those that read only `disabled` or `clear`.
Next worst is `navigation-rail.tsx:43-44`, whose two providers wrap a
`TooltipProvider`, so one rail render invalidates every tooltip beneath it.

## Target

Canonical recipe, `react-doctor/jsx-no-constructed-context-values`, verbatim:

> Wrap the value in `useMemo` (objects/arrays) or `useCallback` (functions)
> keyed on its real dependencies:
> `const value = useMemo(() => ({ user, theme }), [user, theme]); return <Ctx.Provider value={value}>`.
> If the value never depends on render state, hoist it to a module-level
> constant instead. Avoid passing inline `{}`/`[]`/arrow functions directly to
> `value`, since each render creates a new identity and re-renders every
> consumer.

Applied. Declare the memo immediately before the `return`, and pass the
identifier:

    // src/components/ui/search-bar.tsx — target
    const contextValue = useMemo(
      () => ({
        clear,
        disabled,
        invalid,
        readOnly,
        setInputNode,
        setValue,
        value,
      }),
      [clear, disabled, invalid, readOnly, setInputNode, setValue, value],
    )

    return (
      <SearchBarContext.Provider value={contextValue}>

    // src/components/ui/search-view.tsx — target
    const contextValue = useMemo(
      () => ({ close, onSelect, setValue: onValueChange, value }),
      [close, onSelect, onValueChange, value],
    )

    // src/components/ui/carousel.tsx — target
    const contextValue = useMemo(
      () => ({
        api,
        canScrollNext,
        canScrollPrevious,
        carouselRef,
        scrollNext,
        scrollPrevious,
        selectedIndex,
      }),
      [
        api,
        canScrollNext,
        canScrollPrevious,
        carouselRef,
        scrollNext,
        scrollPrevious,
        selectedIndex,
      ],
    )

    // src/components/ui/navigation-bar.tsx — target
    const contextValue = useMemo(
      () => ({ focusValue: focusValue ?? value, itemLayout, onValueChange, setFocusValue, value }),
      [focusValue, itemLayout, onValueChange, setFocusValue, value],
    )

    // src/components/ui/navigation-rail.tsx — target (TWO memos)
    const navigationValue = useMemo(
      () => ({ onValueChange, value }),
      [onValueChange, value],
    )
    const railValue = useMemo(
      () => ({ expanded, onExpandedChange }),
      [expanded, onExpandedChange],
    )

    return (
      <NavigationContext.Provider value={navigationValue}>
        <NavigationRailContext.Provider value={railValue}>

    // src/components/ui/fab-menu.tsx — target
    const contextValue = useMemo(
      () => ({ close, color, focusTrigger, open, setTriggerNode, toggle }),
      [close, color, focusTrigger, open, setTriggerNode, toggle],
    )

    // src/components/ui/rich-tooltip.tsx — target
    const contextValue = useMemo(
      () => ({ cancelClose, closeSoon, noteFocus, openNow, setTriggerNode }),
      [cancelClose, closeSoon, noteFocus, openNow, setTriggerNode],
    )

    // src/components/ui/toggle-group.tsx — target
    const contextValue = useMemo(
      () => ({ variant, size, shape, spacing, orientation }),
      [variant, size, shape, spacing, orientation],
    )

    // src/components/ui/button-group.tsx — target
    const contextValue = useMemo(
      () => ({ shape, size, variant: resolvedButtonVariant }),
      [shape, size, resolvedButtonVariant],
    )

Note the `navigation-bar` dependency array lists `focusValue`, not
`focusValue ?? value` — depend on the raw inputs, never on the computed
expression.

Note the `search-view` dependency array lists `onValueChange` (the prop that
`setValue` aliases), not `setValue`.

## Repo conventions to follow

- **Two in-repo exemplars already do exactly this. Imitate them, do not invent
  a new shape:**
  - `src/components/theme-provider.tsx:65`
  - `src/components/ui/progress.tsx:51`
- `progress.tsx` names the binding `context`; `theme-provider.tsx` names it
  `value`. Either is fine — pick one per file and stay consistent within it.
  The name `contextValue` above avoids shadowing the existing `value` prop that
  most of these components already have in scope. **In `search-bar`,
  `search-view`, `navigation-bar`, `navigation-rail` and `toggle-group` a local
  named `value` already exists — you must not shadow it.**
- Import `useMemo` from `react` alongside the existing hook imports. Several of
  these files import hooks individually (`import { useCallback, useRef, useState } from "react"`);
  match the file's existing import style, and note `carousel.tsx` and
  `progress.tsx` use the `React.` namespace instead.
- Leave the `.Provider` form as-is. `progress.tsx` and `theme-provider.tsx` use
  React 19's context-as-provider (`<Ctx value={…}>`) while these files use
  `<Ctx.Provider value={…}>`. Converting them is a separate refactor — do not
  mix it into this change.

## Steps

1. For each of the 9 files, add the `useMemo` import if absent.
2. Declare the memo directly above the component's `return`, using the exact
   target code above. In `navigation-rail.tsx`, add **two** memos.
3. Replace the inline literal in the JSX attribute with the identifier.
4. Verify each dependency array is complete and lists raw inputs rather than
   computed expressions. Do NOT add `useCallback` to any handler — they are
   already stable; confirm this per file rather than assuming.
5. In `search-view.tsx`, note the early `if (!open) return null` at line 115
   sits above the return. The `useMemo` must go **above** that early return, or
   it violates the rules of hooks. This is the one file where placement is not
   mechanical — check it explicitly.
6. Re-read the diff and remove unrelated churn.

## Boundaries

- Do NOT change any context's shape, field names, or public component API.
- Do NOT add `useCallback` anywhere. If a handler turns out to be genuinely
  unstable, STOP and report it — that is a different finding.
- Do NOT convert `.Provider` to the React 19 context-as-provider form.
- Do NOT touch `carousel.tsx:165` (the `setApi` effect). It carries three
  other diagnostics that were reviewed and rejected as over-reported.
- Do NOT memoize anything that is not a context value.
- STOP if the code has drifted from commit `8872ab1`; report the drift.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope changed` reports zero
    `jsx-no-constructed-context-values`, and the score does not regress.
  - `pnpm typecheck && pnpm build` pass.
  - `pnpm test` passes — every story renders in real Chromium.
- **Evidence gate (required by the rule).** This rule is classed
  *Evidence-required risk*: source code, runtime behavior, and measurement.
  Syntax alone does not justify the edit. Before/after in React DevTools:
  1. Open the `SearchBar` story. Enable "Highlight updates".
  2. Type five characters. **Before**: sibling subtrees that do not read `value`
     flash on each keystroke. **After**: they do not.
  3. Record a Profiler commit for the same five keystrokes before and after and
     confirm the committed-component count dropped.
  4. Repeat on the `NavigationRail` story, watching the tooltips beneath it.
  - If the measurement shows no improvement for a given component, record that
    occurrence as **Needs evidence** and revert that file rather than keeping a
    change that buys nothing.
- **Behavior check**: In the SearchBar, SearchView, Carousel, NavigationBar,
  NavigationRail, FABMenu, RichTooltip, ToggleGroup and ButtonGroup stories —
  typing, clearing, arrow-key navigation, carousel scrolling, tooltip
  open/close, and group selection all behave exactly as before.
- **Done when**: the diagnostic is clear, score is not lower, all checks pass,
  and the Profiler shows a measured drop in committed components for at least
  `SearchBar` and `NavigationRail`.

## Note for later

This rule is **disabled when the React Compiler is enabled** (`hasReactCompiler`
is currently `false`). If this project ever adopts the Compiler, these memos
become redundant and can be removed wholesale.
