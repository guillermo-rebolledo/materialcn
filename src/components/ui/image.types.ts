import type * as React from "react"

/** The shape steps an image can be masked to. */
export type ImageShape =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full"

type Base = Omit<React.ComponentProps<"img">, "alt" | "srcSet"> & {
  /**
   * Additional sources by device pixel ratio — `{ 2: "…@2x.png" }`. Emitted as
   * `srcset`, so the browser picks by the viewer's actual screen rather than by
   * anything this component would have to guess.
   */
  densities?: Partial<Record<2 | 3, string>>
  /**
   * Holds the box before the image arrives. Either give both `width` and
   * `height`, or an `aspectRatio` that scales against the parent's width.
   */
  aspectRatio?: React.CSSProperties["aspectRatio"]
  /** Masks the image, using the library's corner steps. */
  shape?: ImageShape
  /**
   * Drawn when `src` is missing or fails to load. Defaults to a placeholder
   * surface with an icon; pass your own node, or `false` for an empty box.
   */
  fallback?: React.ReactNode | false
}

/**
 * The alt text is required, and deliberately so — an image with no `alt` at all
 * is announced by its file name, which is the worst of the three outcomes.
 */
type Meaningful = Base & { alt: string; decorative?: false }

/**
 * A decorative image says nothing a screen reader needs. Marking it is not the
 * same as forgetting to: this sets `alt=""` and hides it, which is what tells
 * assistive technology to skip it rather than to guess.
 */
type Decorative = Base & { decorative: true; alt?: never }

export type ImageProps = Meaningful | Decorative
