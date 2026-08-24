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
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
