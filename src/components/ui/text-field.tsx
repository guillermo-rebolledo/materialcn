import { useId, useState, type ComponentProps, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Field, FieldDescription, FieldError, FieldLabel } from "./field"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from "./input-group"

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
    placeholder,
    autoComplete,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(event.target.value),
  }

  return (
    <Field
      {...props}
      data-slot="text-field"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-variant={variant}
      className={cn("gap-1.5", className)}
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup
        data-variant={variant}
        className={cn(
          "overflow-hidden text-foreground transition-[border-color,box-shadow]",
          "has-[[aria-invalid=true]]:border-m3-error",
          "has-[[data-slot=input-group-control]:focus-visible]:border-m3-primary has-[[data-slot=input-group-control]:focus-visible]:shadow-[inset_0_0_0_2px_var(--m3-primary)]",
          variant === "outlined"
            ? "rounded-m3-xs border border-m3-outline bg-transparent"
            : "rounded-t-m3-xs border-0 border-b border-m3-on-surface-variant bg-m3-surface-container-highest",
          disabled && "border-m3-on-surface/12 bg-m3-on-surface/12",
        )}
      >
        {leading && <InputGroupAddon align="inline-start" className="min-h-14 px-3 [&>svg]:size-6">{leading}</InputGroupAddon>}
        {prefix && <InputGroupAddon align="inline-start" className="pl-3 text-m3-body-lg">{prefix}</InputGroupAddon>}
        {multiline ? (
          <InputGroupTextarea {...controlProps} rows={rows} />
        ) : (
          <InputGroupInput {...controlProps} />
        )}
        {suffix && <InputGroupAddon align="inline-end" className="pr-3 text-m3-body-lg">{suffix}</InputGroupAddon>}
        {trailing && <InputGroupAddon align="inline-end" className="min-h-14 px-1 [&>svg]:size-6">{trailing}</InputGroupAddon>}
      </InputGroup>
      {(supportingText || maxLength) && (
        <div id={helpId} className="flex justify-between gap-4 px-4">
          {supportingText ? <FieldDescription>{supportingText}</FieldDescription> : <span />}
          {maxLength && <span className="shrink-0 text-m3-body-sm text-muted-foreground">{value.length} / {maxLength}</span>}
        </div>
      )}
      {error && <FieldError id={errorId} className="px-4">{error}</FieldError>}
    </Field>
  )
}

export { TextField, type TextFieldProps, type TextFieldVariant }
