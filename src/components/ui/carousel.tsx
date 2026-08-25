import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
} from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  CarouselContext,
  useCarousel,
  type CarouselApi,
} from "./carousel-context"

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]
type CarouselLayout =
  | "standard"
  | "multi-browse"
  | "hero"
  | "uncontained"
  | "full-screen"

type CarouselAccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: never; "aria-labelledby": string }

type CarouselProps = Omit<
  ComponentProps<"div">,
  "aria-label" | "aria-labelledby" | "role"
> &
  CarouselAccessibleName & {
    /** Material layout used to size and emphasize visible items. */
    layout?: CarouselLayout
    /** Embla options merged with the horizontal carousel defaults. */
    opts?: CarouselOptions
    /** Optional Embla plugins. */
    plugins?: CarouselPlugin
    /** Receives the Embla API after initialization. */
    setApi?: (api: CarouselApi) => void
  }

const carouselControlClassName =
  "absolute inset-y-0 my-auto touch-manipulation aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:bg-m3-on-surface/12 aria-disabled:text-m3-on-surface/38"

const horizontalArrowConsumerSelector = [
  "input",
  "textarea",
  "select",
  '[contenteditable]:not([contenteditable="false"])',
  '[role="combobox"]',
  '[role="menuitemradio"]',
  '[role="option"]',
  '[role="radio"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="tab"]',
  '[role="textbox"]',
].join(",")

function consumesHorizontalArrowKey(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(horizontalArrowConsumerSelector) !== null
  )
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setPrefersReducedMotion(query.matches)
    updatePreference()
    query.addEventListener("change", updatePreference)
    return () => query.removeEventListener("change", updatePreference)
  }, [])

  return prefersReducedMotion
}

/** A touch-enabled Material carousel powered by Embla. */
function Carousel({
  children,
  className,
  layout = "standard",
  onKeyDownCapture,
  opts,
  plugins,
  setApi,
  ...props
}: CarouselProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [carouselRef, api] = useEmblaCarousel(
    {
      align: "start",
      ...opts,
      axis: "x",
      ...(prefersReducedMotion ? { duration: 0 } : {}),
    },
    plugins,
  )
  const [selectedIndex, setSelectedIndex] = useState(opts?.startIndex ?? 0)
  const intendedIndex = useRef(opts?.startIndex ?? 0)
  const [canScrollPrevious, setCanScrollPrevious] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateSelection = useCallback((nextApi: CarouselApi) => {
    if (!nextApi) return
    const nextIndex = nextApi.selectedScrollSnap()
    intendedIndex.current = nextIndex
    setSelectedIndex(nextIndex)
    setCanScrollPrevious(nextApi.canScrollPrev())
    setCanScrollNext(nextApi.canScrollNext())
  }, [])

  const restoreSelection = useCallback(
    (nextApi: CarouselApi) => {
      if (!nextApi) return
      const lastSnap = nextApi.scrollSnapList().length - 1
      const nextIndex = Math.max(0, Math.min(intendedIndex.current, lastSnap))
      if (nextApi.selectedScrollSnap() !== nextIndex) {
        nextApi.scrollTo(nextIndex, true)
      }
      updateSelection(nextApi)
    },
    [updateSelection],
  )

  const scrollPrevious = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  const handleKeyDownCapture = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDownCapture?.(event)
      if (event.defaultPrevented) return
      if (consumesHorizontalArrowKey(event.target)) return

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrevious()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [onKeyDownCapture, scrollNext, scrollPrevious],
  )

  useEffect(() => {
    if (api && setApi) setApi(api)
  }, [api, setApi])

  useEffect(() => {
    if (!api) return

    const initialSelectionFrame = requestAnimationFrame(() =>
      updateSelection(api),
    )
    api.on("select", updateSelection)
    api.on("reInit", restoreSelection)

    return () => {
      cancelAnimationFrame(initialSelectionFrame)
      api.off("select", updateSelection)
      api.off("reInit", restoreSelection)
    }
  }, [api, restoreSelection, updateSelection])

  return (
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
      <div
        {...props}
        role="region"
        aria-roledescription="carousel"
        data-align={opts?.align === "center" ? "center" : "start"}
        data-layout={layout}
        data-reduced-motion={prefersReducedMotion || undefined}
        data-slot="carousel"
        onKeyDownCapture={handleKeyDownCapture}
        className={cn("m3-carousel relative w-full", className)}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  const { carouselRef, selectedIndex } = useCarousel()
  const slides = Children.toArray(children).filter(isValidElement)
  const slideCount = slides.length

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-viewport"
    >
      <div
        {...props}
        data-slot="carousel-content"
        className={cn("flex gap-2 px-4 py-2", className)}
      >
        {slides.map((child, index) => {
          const slide = child as ReactElement<ComponentProps<"div">>
          const accessibleName =
            slide.props["aria-label"] || slide.props["aria-labelledby"]
              ? undefined
              : `Slide ${index + 1} of ${slideCount}`

          return cloneElement(
            slide,
            {
              "aria-label": accessibleName ?? slide.props["aria-label"],
              "aria-current": selectedIndex === index ? "true" : undefined,
              "data-selected": selectedIndex === index ? "true" : undefined,
            } as ComponentProps<"div">,
          )
        })}
      </div>
    </div>
  )
}

function CarouselItem({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full overflow-hidden rounded-[28px]",
        className,
      )}
    />
  )
}

type CarouselControlDirection = "previous" | "next"

function CarouselControl({
  direction,
  "aria-label": ariaLabel,
  className,
  disabled,
  onClick,
  shape = "round",
  size = "icon",
  variant = "tonal",
  ...props
}: ComponentProps<typeof Button> & { direction: CarouselControlDirection }) {
  const carousel = useCarousel()
  const isPrevious = direction === "previous"
  const canScroll = isPrevious
    ? carousel.canScrollPrevious
    : carousel.canScrollNext
  const scroll = isPrevious ? carousel.scrollPrevious : carousel.scrollNext
  const Icon = isPrevious ? ChevronLeftIcon : ChevronRightIcon
  const isUnavailable = Boolean(disabled || !canScroll)

  return (
    <Button
      {...props}
      type="button"
      aria-label={
        ariaLabel ?? (isPrevious ? "Previous slide" : "Next slide")
      }
      data-slot={`carousel-${direction}`}
      variant={variant}
      shape={shape}
      size={size}
      className={cn(
        carouselControlClassName,
        isPrevious ? "left-6" : "right-6",
        className,
      )}
      disabled={disabled}
      aria-disabled={isUnavailable || undefined}
      onClick={(event) => {
        if (isUnavailable) {
          event.preventDefault()
          return
        }
        onClick?.(event)
        if (!event.defaultPrevented) scroll()
      }}
    >
      <Icon aria-hidden="true" />
    </Button>
  )
}

function CarouselPrevious(props: ComponentProps<typeof Button>) {
  return <CarouselControl {...props} direction="previous" />
}

function CarouselNext(props: ComponentProps<typeof Button>) {
  return <CarouselControl {...props} direction="next" />
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
}
export type {
  CarouselAccessibleName,
  CarouselApi,
  CarouselLayout,
  CarouselOptions,
  CarouselPlugin,
  CarouselProps,
}
