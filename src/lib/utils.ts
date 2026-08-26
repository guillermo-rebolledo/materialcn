import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge has to be taught this library's theme keys, because two M3
 * namespaces collide inside Tailwind's `text-*` utility:
 *
 *   text-m3-label-lg        font-size  (from --text-m3-*)
 *   text-m3-on-primary      color      (from --color-m3-*)
 *
 * Left unconfigured, merge treats them as the same group and silently drops
 * whichever came first — which is how a filled button ends up with unreadable
 * label text. The validators below split them apart by name.
 */
const TYPE_ROLES = ["display", "headline", "title", "body", "label"] as const

const isM3FontSize = (value: string) =>
  TYPE_ROLES.some((role) => value.startsWith(`m3-${role}-`))

const isM3Color = (value: string) =>
  value.startsWith("m3-") && !isM3FontSize(value)

/**
 * The spacing scale has the same problem in a quieter form: `p-m3-lg` is not a
 * value tailwind-merge recognises, so it does not see it as conflicting with
 * `p-4` and keeps both — leaving CSS source order to decide a component's
 * padding, which is exactly what `cn` exists to prevent.
 */
const SPACE_STEPS = /^m3-(none|xs|sm|md|lg|xl|2xl|3xl|4xl)$/

const isM3Space = (value: string) => SPACE_STEPS.test(value)

/** Every Tailwind utility that draws from the spacing namespace. */
const SPACING_UTILITIES = [
  "p", "px", "py", "pt", "pr", "pb", "pl", "ps", "pe",
  "m", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me",
  "gap", "gap-x", "gap-y",
  "w", "h", "size", "min-w", "min-h", "max-w", "max-h",
  "inset", "inset-x", "inset-y", "top", "right", "bottom", "left",
] as const

const spacingGroups = Object.fromEntries(
  SPACING_UTILITIES.map((utility) => [utility, [{ [utility]: [isM3Space] }]]),
)

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [isM3FontSize] }],
      "text-color": [{ text: [isM3Color] }],
      "bg-color": [{ bg: [isM3Color] }],
      "border-color": [{ border: [isM3Color] }],
      "ring-color": [{ ring: [isM3Color] }],
      "outline-color": [{ outline: [isM3Color] }],
      "shadow-color": [{ shadow: [isM3Color] }],
      // M3 adds shape steps beyond Tailwind's built-in radius scale.
      rounded: [{ rounded: [(v: string) => v.startsWith("m3-")] }],
      shadow: [{ shadow: [(v: string) => /^m3-[0-5]$/.test(v)] }],
      ...spacingGroups,
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
