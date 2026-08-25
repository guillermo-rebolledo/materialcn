import {
  useCallback,
  useEffect,
  useRef,
  useContext,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
} from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { List, ListItem } from "./list"
import { SearchBar, type SearchBarProps } from "./search-bar"
import {
  SearchViewContentContext,
  SearchViewContext,
  useSearchView,
  type SearchViewState,
} from "./search-view-context"

type SearchViewPresentation = "docked" | "full-screen"

type SearchViewProps = Omit<
  ComponentProps<"section">,
  "defaultValue" | "onSelect"
> & {
  onOpenChange: (open: boolean) => void
  onSelect?: (value: string) => void
  onValueChange: (value: string) => void
  open: boolean
  presentation?: SearchViewPresentation
  value: string
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}

function SearchView({
  "aria-label": ariaLabel = "Search",
  children,
  className,
  onKeyDown,
  onOpenChange,
  onSelect,
  onValueChange,
  open,
  presentation = "docked",
  ref,
  value,
  ...props
}: SearchViewProps) {
  const rootRef = useRef<HTMLElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  useEffect(() => {
    let frame = 0
    if (open && !wasOpenRef.current) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
      frame = requestAnimationFrame(() => {
        rootRef.current
          ?.querySelector<HTMLInputElement>('[data-slot="input-group-control"]')
          ?.focus()
      })
    } else if (!open && wasOpenRef.current) {
      returnFocusRef.current?.focus()
    }
    wasOpenRef.current = open
    return () => cancelAnimationFrame(frame)
  }, [open])

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === "Escape") {
      event.preventDefault()
      close()
      return
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return
    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-slot="search-view-item"]:not(:disabled):not([aria-disabled="true"])',
      ) ?? [],
    )
    if (!items.length) return

    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement)
    const inputFocused =
      document.activeElement?.getAttribute("data-slot") ===
      "input-group-control"
    if (!inputFocused && currentIndex < 0) return

    event.preventDefault()
    const nextIndex = inputFocused
      ? event.key === "ArrowDown"
        ? 0
        : items.length - 1
      : event.key === "ArrowDown"
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length
    items[nextIndex]?.focus()
  }

  if (!open) return null

  return (
    <SearchViewContext.Provider
      value={{ close, onSelect, setValue: onValueChange, value }}
    >
      <section
        {...props}
        ref={(node) => {
          rootRef.current = node
          assignRef(ref, node)
        }}
        aria-label={ariaLabel}
        data-presentation={presentation}
        data-slot="search-view"
        className={cn(
          "flex max-w-full flex-col overflow-hidden bg-m3-surface-container-high text-foreground shadow-m3-3",
          "data-[presentation=docked]:w-[360px] data-[presentation=docked]:rounded-m3-md",
          "data-[presentation=full-screen]:h-full data-[presentation=full-screen]:w-full data-[presentation=full-screen]:rounded-none",
          "motion-reduce:transition-none",
          className,
        )}
        onKeyDown={handleKeyDown}
      >
        {children}
      </section>
    </SearchViewContext.Provider>
  )
}

function SearchViewBar({ className, ...props }: Omit<SearchBarProps, "value" | "defaultValue" | "onValueChange">) {
  const context = useSearchView()
  return (
    <SearchBar
      {...props}
      value={context.value}
      onValueChange={context.setValue}
      className={cn(
        "shrink-0 [&_[data-slot=input-group]]:shadow-m3-0",
        "in-data-[presentation=docked]:[&_[data-slot=input-group]]:rounded-m3-md",
        "in-data-[presentation=full-screen]:[&_[data-slot=input-group]]:rounded-none",
        className,
      )}
    />
  )
}

function SearchViewContent({
  className,
  state = "results",
  ...props
}: ComponentProps<"div"> & { state?: SearchViewState }) {
  return (
    <SearchViewContentContext.Provider value={state}>
      <div
        {...props}
        data-slot="search-view-content"
        data-state={state}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain py-1",
          "in-data-[presentation=docked]:max-h-[194px]",
          className,
        )}
      />
    </SearchViewContentContext.Provider>
  )
}

function SearchViewList({ className, ...props }: ComponentProps<typeof List>) {
  return (
    <List
      {...props}
      role="listbox"
      data-slot="search-view-list"
      className={cn("py-1", className)}
    />
  )
}

type SearchViewItemProps = Omit<ComponentProps<"button">, "value"> & {
  lines?: 1 | 2 | 3
  value: string
}

function SearchViewItem({
  children,
  disabled,
  lines = 1,
  onClick,
  value,
  ...props
}: SearchViewItemProps) {
  const context = useSearchView()
  const ariaDisabled =
    props["aria-disabled"] === true || props["aria-disabled"] === "true"
  return (
    <ListItem
      lines={lines}
      wrapperRole="presentation"
      render={
        <button
          {...props}
          type="button"
          role="option"
          tabIndex={-1}
          data-slot="search-view-item"
          data-value={value}
          disabled={disabled}
          aria-selected={false}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            if (disabled || ariaDisabled) return
            onClick?.(event)
            if (event.defaultPrevented) return
            context.onSelect?.(value)
            context.close()
          }}
        />
      }
    >
      {children}
    </ListItem>
  )
}

function SearchViewClose({
  "aria-label": ariaLabel = "Close search",
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const context = useSearchView()
  return (
    <Button
      {...props}
      type="button"
      aria-label={ariaLabel}
      data-slot="search-view-close"
      size="icon"
      variant="ghost"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.close()
      }}
    />
  )
}

function SearchViewMessage({
  className,
  role,
  ...props
}: ComponentProps<"div">) {
  const state = useContext(SearchViewContentContext)
  return (
    <div
      {...props}
      role={role ?? (state === "error" ? "alert" : "status")}
      data-slot="search-view-message"
      className={cn(
        "flex min-h-32 items-center justify-center px-6 text-center text-m3-body-md text-muted-foreground",
        state === "error" && "text-m3-error",
        className,
      )}
    />
  )
}

export {
  SearchView,
  SearchViewBar,
  SearchViewClose,
  SearchViewContent,
  SearchViewItem,
  SearchViewList,
  SearchViewMessage,
  type SearchViewPresentation,
  type SearchViewProps,
  type SearchViewState,
}
