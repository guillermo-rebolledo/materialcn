import { useId, useState, type ComponentProps, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Field, FieldDescription, FieldError } from "./field"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from "./input-group"

/**
 * Material 3 text field.
 *
 * Kit geometry (Text fields page): 56dp tall, 16dp horizontal padding,
 * body-large content. The label lives *inside* the field and floats — onto
 * the outline as a 12/16 label in a Surface-filled notch for the outlined
 * style, or to the top of the tinted container for the filled style — when the
 * field is focused or holds a value.
 *
 * The outline carries the state: 1dp Outline at rest, 1dp On Surface on hover,
 * 3dp Primary when focused, 3dp Error when invalid. Extra weight is painted as
 * an inset shadow so the text never reflows. The filled style keeps only the
 * bottom "active indicator" (1dp → 3dp). Disabled fields tint the filled
 * container On Surface at 4% and leave the outlined one unfilled at 12%.
 */
type TextFieldVariant = "outlined" | "filled"

type TextFieldBaseProps = Omit<ComponentProps<"div">, "defaultValue" | "onChange"> & {
  autoComplete?: string
  disabled?: boolean
  error?: string
  invalid?: boolean
  label: string
  leading?: ReactNode
  maxLength?: number
  multiline?: boolean
  name?: string
  placeholder?: string
  prefix?: ReactNode
  readOnly?: boolean
  rows?: number
  suffix?: ReactNode
  supportingText?: ReactNode
  trailing?: ReactNode
  variant?: TextFieldVariant
}

type TextFieldValueProps =
  | { defaultValue?: string; onValueChange?: (value: string) => void; value?: never }
  | { defaultValue?: never; onValueChange: (value: string) => void; value: string }

type TextFieldProps = TextFieldBaseProps & TextFieldValueProps

// Tailwind only generates classes it can read literally, so every variant
// string below is spelled out rather than assembled.
function TextField({
  autoComplete,
  className,
  defaultValue = "",
  disabled = false,
  error,
  invalid = false,
  label,
  leading,
  maxLength,
  multiline = false,
  name,
  onValueChange,
  placeholder,
  prefix,
  readOnly = false,
  rows = 3,
  suffix,
  supportingText,
  trailing,
  value: valueProp,
  variant = "outlined",
  ...props
}: TextFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const value = valueProp ?? uncontrolledValue
  const id = useId()
  const errorId = `${id}-error`
  const helpId = `${id}-help`
  const describedBy = error ? errorId : supportingText || maxLength ? helpId : undefined
  const showError = invalid || Boolean(error)
  const setValue = (next: string) => {
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }
  const controlProps = {
    id,
    name,
    value,
    disabled,
    readOnly,
    maxLength,
    // A space keeps `:placeholder-shown` meaningful when no placeholder is
    // given; a real placeholder is only revealed once the label has floated.
    placeholder: placeholder || " ",
    autoComplete,
    "aria-invalid": showError || undefined,
    "aria-describedby": describedBy,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(event.target.value),
  }
  const filled = variant === "filled"
  const controlClassName = cn(
    "placeholder:text-transparent focus:placeholder:text-m3-on-surface-variant",
    // Filled: the value sits under the floated label.
    filled && !multiline && "pt-5 pb-1",
    filled && multiline && "pt-6",
    multiline && !filled && "pt-5",
  )

  return (
    <Field
      {...props}
      data-slot="text-field"
      data-invalid={showError || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-variant={variant}
      className={cn("gap-0", className)}
    >
      <InputGroup
        data-variant={variant}
        data-populated={value.length > 0 || undefined}
        className={cn(
          "text-foreground transition-[border-color,box-shadow,background-color] duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) motion-reduce:transition-none",
          filled
            ? [
                "rounded-t-m3-xs bg-m3-surface-container-highest",
                // Active indicator: the 1dp bottom rule that grows to 3dp.
                "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-m3-on-surface-variant",
                "after:transition-[height,background-color] after:duration-(--m3-spring-effects-fast-duration) after:ease-(--m3-spring-effects-fast)",
                !disabled && "hover:after:bg-m3-on-surface",
                "has-[[data-slot=input-group-control]:focus-visible]:after:h-[3px] has-[[data-slot=input-group-control]:focus-visible]:after:bg-m3-primary",
                showError && "after:h-[3px] after:bg-m3-error hover:after:bg-m3-error has-[[aria-invalid=true]]:after:bg-m3-error",
                disabled && "bg-m3-on-surface/4 after:bg-m3-on-surface/38",
              ]
            : [
                "rounded-m3-xs border border-m3-outline bg-transparent",
                !disabled && "hover:border-m3-on-surface",
                "has-[[data-slot=input-group-control]:focus-visible]:border-m3-primary has-[[data-slot=input-group-control]:focus-visible]:shadow-[inset_0_0_0_2px_var(--m3-primary)]",
                showError && "border-m3-error shadow-[inset_0_0_0_2px_var(--m3-error)] hover:border-m3-error has-[[aria-invalid=true]]:border-m3-error has-[[aria-invalid=true]]:shadow-[inset_0_0_0_2px_var(--m3-error)]",
                disabled && "border-m3-on-surface/12 hover:border-m3-on-surface/12",
              ],
        )}
      >
        {leading && <InputGroupAddon align="inline-start" className="min-h-14 px-3 [&>svg]:size-6">{leading}</InputGroupAddon>}
        {prefix && <InputGroupAddon align="inline-start" className={cn("pl-3 text-m3-body-lg", filled && "pt-4")}>{prefix}</InputGroupAddon>}
        <label
          htmlFor={id}
          data-slot="text-field-label"
          className={cn(
            "pointer-events-none absolute z-10 max-w-[calc(100%-32px)] truncate text-m3-body-lg text-m3-on-surface-variant",
            "transition-[top,left,font-size,line-height,color,translate] duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) motion-reduce:transition-none",
            // Resting position: at the text baseline, after any leading icon.
            leading ? "left-12" : "left-4",
            multiline ? "top-4" : "top-1/2 -translate-y-1/2",
            // Floated position: 12/16 type, Primary while focused.
            "group-focus-within/input-group:text-m3-body-sm group-data-populated/input-group:text-m3-body-sm",
            "group-focus-within/input-group:text-m3-primary",
            filled
              ? "group-focus-within/input-group:top-2 group-focus-within/input-group:translate-y-0 group-data-populated/input-group:top-2 group-data-populated/input-group:translate-y-0"
              : [
                  // Outlined: a Surface-filled notch straddling the border.
                  "group-focus-within/input-group:top-0 group-focus-within/input-group:-translate-y-1/2 group-focus-within/input-group:left-3 group-focus-within/input-group:px-1 group-focus-within/input-group:bg-m3-surface",
                  "group-data-populated/input-group:top-0 group-data-populated/input-group:-translate-y-1/2 group-data-populated/input-group:left-3 group-data-populated/input-group:px-1 group-data-populated/input-group:bg-m3-surface",
                ],
            showError && "text-m3-error group-focus-within/input-group:text-m3-error",
            disabled && "text-m3-on-surface/38",
          )}
        >
          {label}
        </label>
        {multiline ? (
          <InputGroupTextarea {...controlProps} rows={rows} className={controlClassName} />
        ) : (
          <InputGroupInput {...controlProps} className={controlClassName} />
        )}
        {suffix && <InputGroupAddon align="inline-end" className={cn("pr-3 text-m3-body-lg", filled && "pt-4")}>{suffix}</InputGroupAddon>}
        {trailing && (
          <InputGroupAddon align="inline-end" className={cn("min-h-14 px-3 [&>svg]:size-6", showError && "text-m3-error")}>
            {trailing}
          </InputGroupAddon>
        )}
      </InputGroup>
      {(supportingText || maxLength) && (
        <div id={helpId} className="flex justify-between gap-4 px-4 pt-1">
          {supportingText ? <FieldDescription className="text-m3-body-sm">{supportingText}</FieldDescription> : <span />}
          {maxLength && <span className="shrink-0 text-m3-body-sm text-muted-foreground">{value.length} / {maxLength}</span>}
        </div>
      )}
      {error && <FieldError id={errorId} className="px-4 pt-1 text-m3-body-sm">{error}</FieldError>}
    </Field>
  )
}

export { TextField, type TextFieldProps, type TextFieldVariant }
