import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FormEvent,
} from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"
import { SearchBarContext, useSearchBar } from "./search-bar-context"

type SearchBarBaseProps = Omit<
  ComponentProps<"form">,
  "defaultValue" | "onSubmit"
> & {
  disabled?: boolean
  invalid?: boolean
  onClear?: () => void
  onSubmit?: (value: string, event: FormEvent<HTMLFormElement>) => void
  readOnly?: boolean
}

type SearchBarValueProps =
  | {
      defaultValue?: string
      onValueChange?: (value: string) => void
      value?: never
    }
  | {
      defaultValue?: never
      onValueChange: (value: string) => void
      value: string
    }

type SearchBarProps = SearchBarBaseProps & SearchBarValueProps

type SearchBarInputAccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: never; "aria-labelledby": string }

type SearchBarInputProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  | "aria-label"
  | "aria-labelledby"
  | "defaultValue"
  | "disabled"
  | "onChange"
  | "readOnly"
  | "type"
  | "value"
> &
  SearchBarInputAccessibleName & {
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  }

function assignInputRef(
  ref: SearchBarInputProps["ref"],
  node: HTMLInputElement | null,
) {
  if (typeof ref === "function") ref(node)
  else if (ref) ref.current = node
}

function SearchBar({
  "aria-label": ariaLabel = "Search",
  children,
  className,
  defaultValue = "",
  disabled = false,
  invalid = false,
  onClear,
  onSubmit,
  onValueChange,
  readOnly = false,
  value: valueProp,
  ...props
}: SearchBarProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const value = valueProp ?? uncontrolledValue

  const setValue = useCallback(
    (nextValue: string) => {
      if (valueProp === undefined) setUncontrolledValue(nextValue)
      onValueChange?.(nextValue)
    },
    [onValueChange, valueProp],
  )

  const clear = useCallback(() => {
    setValue("")
    onClear?.()
    inputRef.current?.focus()
  }, [onClear, setValue])

  const setInputNode = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
  }, [])

  return (
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
      <form
        {...props}
        role="search"
        aria-label={ariaLabel}
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        data-slot="search-bar"
        className={cn("w-full", className)}
        onSubmit={(event) => {
          event.preventDefault()
          if (disabled || readOnly) return
          onSubmit?.(value, event)
        }}
      >
        <fieldset className="contents" disabled={disabled}>
          <InputGroup
            className={cn(
              "h-14 rounded-[28px] border border-transparent bg-m3-surface-container-high px-1 shadow-m3-1",
              "transition-[box-shadow,border-color] duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast)",
              "focus-within:shadow-m3-2 hover:not-has-disabled:shadow-m3-2",
              "has-[[aria-invalid=true]]:border-m3-error has-[[aria-invalid=true]]:shadow-m3-0",
              "has-disabled:cursor-not-allowed has-disabled:bg-m3-on-surface/12 has-disabled:shadow-m3-0",
            )}
          >
            {children}
          </InputGroup>
        </fieldset>
      </form>
    </SearchBarContext.Provider>
  )
}

function SearchBarInput({
  className,
  onChange,
  ref,
  ...props
}: SearchBarInputProps) {
  const context = useSearchBar()

  return (
    <InputGroupInput
      {...props}
      ref={(node) => {
        context.setInputNode(node)
        assignInputRef(ref, node)
      }}
      type="search"
      value={context.value}
      disabled={context.disabled}
      readOnly={context.readOnly}
      aria-invalid={context.invalid || undefined}
      className={cn(
        "h-full appearance-none px-0 text-m3-body-lg text-foreground placeholder:text-muted-foreground disabled:text-m3-on-surface/38",
        "[&::-webkit-search-cancel-button]:hidden",
        className,
      )}
      onChange={(event) => {
        onChange?.(event)
        if (!event.defaultPrevented) context.setValue(event.currentTarget.value)
      }}
    />
  )
}

function SearchBarLeading({ className, ...props }: ComponentProps<"div">) {
  return (
    <InputGroupAddon
      {...props}
      align="inline-start"
      data-slot="search-bar-leading"
      className={cn("size-12 [&>svg]:size-6", className)}
    />
  )
}

function SearchBarTrailing({ className, ...props }: ComponentProps<"div">) {
  return (
    <InputGroupAddon
      {...props}
      align="inline-end"
      data-slot="search-bar-trailing"
      className={cn("min-h-12 gap-0 [&>svg]:size-6", className)}
    />
  )
}

function SearchBarClear({
  "aria-label": ariaLabel = "Clear search",
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const context = useSearchBar()
  if (!context.value) return null

  return (
    <Button
      {...props}
      type="button"
      aria-label={ariaLabel}
      data-slot="search-bar-clear"
      disabled={context.disabled}
      size="icon"
      variant="ghost"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.clear()
      }}
    >
      <XIcon aria-hidden="true" />
    </Button>
  )
}

function SearchBarSubmit({
  "aria-label": ariaLabel = "Submit search",
  children,
  disabled,
  ...props
}: ComponentProps<typeof Button>) {
  const context = useSearchBar()

  return (
    <Button
      {...props}
      type="submit"
      aria-label={ariaLabel}
      data-slot="search-bar-submit"
      disabled={disabled || context.disabled || context.readOnly}
      size="icon"
      variant="ghost"
    >
      {children ?? <SearchIcon aria-hidden="true" />}
    </Button>
  )
}

export {
  SearchBar,
  SearchBarClear,
  SearchBarInput,
  SearchBarLeading,
  SearchBarSubmit,
  SearchBarTrailing,
}
export type { SearchBarInputProps, SearchBarProps }
