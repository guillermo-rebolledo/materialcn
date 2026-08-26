import { useState } from "react"
import { ImageOffIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Icon } from "./icon"
import { imageVariants } from "./image-variants"
import type { ImageProps } from "./image.types"

/**
 * An image that holds its space, degrades deliberately, and serves an asset
 * matched to the screen.
 *
 * The box is reserved by the wrapper, from `width`/`height` or `aspectRatio`,
 * before the image exists. Letting the `img` size itself is what produces the
 * classic reflow: the page lays out at zero height, then jumps when the bytes
 * land — and jumps again for every image below it.
 */
function Image({
  alt,
  aspectRatio,
  className,
  crossOrigin,
  decorative,
  decoding,
  densities,
  fallback,
  fetchPriority,
  height,
  loading,
  onError,
  onLoad,
  referrerPolicy,
  shape,
  sizes,
  src,
  style,
  width,
  ...props
}: ImageProps) {
  const [failed, setFailed] = useState(false)

  /*
   * A new source deserves a fresh attempt, or one broken image poisons the
   * slot for every image that later occupies it. Adjusting during render
   * rather than in an effect: an effect would paint one frame of the previous
   * image's failure state against the new source.
   */
  const [attempted, setAttempted] = useState(src)
  if (attempted !== src) {
    setAttempted(src)
    setFailed(false)
  }

  const srcSet = densities
    ? Object.entries(densities)
        .map(([ratio, url]) => `${url} ${ratio}x`)
        .join(", ")
    : undefined

  const showFallback = !src || failed

  /*
   * The remaining props land on the *wrapper*, not on the `img`.
   *
   * The wrapper is the thing that exists in every state; the `img` is not
   * there at all while the fallback is showing. Putting an `id`, a
   * `data-testid`, or an `aria-describedby` on the image would make it come
   * and go with the bytes — so only genuinely image-loading attributes are
   * destructured above and forwarded inward.
   */
  return (
    <span
      data-slot="image"
      data-state={showFallback ? "fallback" : "loaded"}
      className={cn(imageVariants({ shape }), className)}
      style={{ width, height, aspectRatio, ...style }}
      {...props}
    >
      {showFallback ? (
        fallback === false ? null : (
          <span
            data-slot="image-fallback"
            // Decorative whatever the image was: the `alt` text describes a
            // picture that is not there, and reading it out would describe
            // something the user cannot see.
            aria-hidden
            className="text-m3-on-surface-variant absolute inset-0 grid place-items-center"
          >
            {fallback ?? (
              <Icon size="md">
                <ImageOffIcon />
              </Icon>
            )}
          </span>
        )
      ) : (
        <img
          data-slot="image-img"
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={decorative ? "" : alt}
          aria-hidden={decorative || undefined}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          crossOrigin={crossOrigin}
          referrerPolicy={referrerPolicy}
          // The wrapper owns the box; the image fills it and crops rather than
          // stretching, so a wrong aspect ratio is a crop and not a distortion.
          className="size-full object-cover"
          onLoad={onLoad}
          onError={(event) => {
            setFailed(true)
            onError?.(event)
          }}
        />
      )}
    </span>
  )
}

export { Image, imageVariants }
export type { ImageProps }
