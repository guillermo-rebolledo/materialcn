import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b border-m3-outline-variant", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex min-h-14 flex-1 cursor-pointer items-center justify-between gap-4 rounded-m3-xs border border-transparent px-4 py-2 text-left text-m3-body-lg text-m3-on-surface outline-none transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) hover:not-aria-disabled:bg-m3-on-surface/8 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-m3-secondary aria-disabled:pointer-events-none aria-disabled:text-m3-on-surface/38 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-6 **:data-[slot=accordion-trigger-icon]:text-m3-on-surface-variant",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
        <ChevronUpIcon data-slot="accordion-trigger-icon" className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      // Base UI measures the panel into `--accordion-panel-height`; the panel
      // itself transitions between 0 and that height on the effects spring.
      className="h-(--accordion-panel-height) overflow-hidden text-m3-body-lg transition-[height] duration-(--m3-spring-effects-default-duration) ease-(--m3-spring-effects-default) data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"
      {...props}
    >
      <div
        className={cn(
          "px-4 pt-0 pb-4 text-m3-on-surface-variant [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-m3-primary [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
