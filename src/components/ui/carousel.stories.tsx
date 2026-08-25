import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Card, CardContent, CardHeader, CardTitle } from "./card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel"

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  args: {
    "aria-label": "Carousel",
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

function DestinationCard({ name }: { name: string }) {
  return (
    <Card className="@container h-full">
      <CardHeader className="@max-[100px]:hidden">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="@max-[160px]:hidden">
        Featured destination
      </CardContent>
    </Card>
  )
}

/** Controls expose the selected slide and stop at finite carousel boundaries. */
export const Controls: Story = {
  render: () => (
    <Carousel
      aria-label="Featured destinations"
      className="max-w-[412px]"
      layout="multi-browse"
    >
      <CarouselContent>
        {[
          "Mexico City",
          "Oaxaca",
          "Mérida",
          "Guadalajara",
        ].map((name) => (
          <CarouselItem key={name} aria-label={name}>
            <DestinationCard name={name} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const carousel = canvas.getByRole("region", {
      name: "Featured destinations",
    })
    const slides = within(carousel).getAllByRole("group")
    const previous = within(carousel).getByRole("button", {
      name: "Previous slide",
    })
    const next = within(carousel).getByRole("button", { name: "Next slide" })
    const track = carousel.querySelector<HTMLElement>(
      '[data-slot="carousel-content"]',
    )!

    await expect(slides).toHaveLength(4)
    await expect(slides[0]).toHaveAttribute("aria-current", "true")
    await expect(previous).toHaveAttribute("aria-disabled", "true")

    await userEvent.click(next)

    await waitFor(() => expect(slides[1]).toHaveAttribute("aria-current", "true"))
    await expect(previous).not.toHaveAttribute("aria-disabled")

    await new Promise((resolve) => setTimeout(resolve, 350))
    await expect(slides[1]).toHaveAttribute("aria-current", "true")
    await expect(previous).not.toHaveAttribute("aria-disabled")
    await expect(track.style.transform).not.toBe("translate3d(0px, 0px, 0px)")
  },
}

/** Arrow navigation works while a control is focused without stealing focus. */
export const KeyboardNavigation: Story = {
  render: () => (
    <Carousel
      aria-label="Keyboard destinations"
      className="max-w-[412px]"
      layout="multi-browse"
    >
      <CarouselContent>
        <CarouselItem aria-label="Puebla">
          <DestinationCard name="Puebla" />
          <input aria-label="Filter Puebla" defaultValue="abc" />
        </CarouselItem>
        {["Querétaro", "Monterrey", "Tijuana"].map((name) => (
          <CarouselItem key={name} aria-label={name}>
            <DestinationCard name={name} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const carousel = canvas.getByRole("region", {
      name: "Keyboard destinations",
    })
    const slides = within(carousel).getAllByRole("group")
    const next = within(carousel).getByRole("button", { name: "Next slide" })
    const input = within(carousel).getByRole("textbox", {
      name: "Filter Puebla",
    }) as HTMLInputElement

    input.focus()
    input.setSelectionRange(0, 0)
    await userEvent.keyboard("{ArrowRight}")

    await expect(input.selectionStart).toBe(1)
    await expect(slides[0]).toHaveAttribute("aria-current", "true")

    next.focus()
    await expect(next).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")

    await waitFor(() => expect(slides[1]).toHaveAttribute("aria-current", "true"))
    await expect(next).toHaveFocus()
  },
}

function layoutItems(count: number) {
  return Array.from({ length: count }, (_, index) => (
    <CarouselItem key={index} aria-label={`Item ${index + 1}`}>
      <DestinationCard name={`Item ${index + 1}`} />
    </CarouselItem>
  ))
}

/** Every public layout reproduces the mobile and tablet geometry extracted from the kit. */
export const Layouts: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-[412px]">
        <Carousel aria-label="Standard carousel" layout="standard">
          <CarouselContent>
            {layoutItems(5)}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="w-[412px]">
        <Carousel aria-label="Multi-browse carousel" layout="multi-browse">
          <CarouselContent>
            {layoutItems(5)}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="w-[412px]">
        <Carousel aria-label="Hero carousel" layout="hero">
          <CarouselContent>
            {layoutItems(4)}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="w-[412px]">
        <Carousel aria-label="Uncontained carousel" layout="uncontained">
          <CarouselContent>
            {layoutItems(5)}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="h-[480px] w-[412px]">
        <Carousel
          aria-label="Full-screen carousel"
          className="h-full"
          layout="full-screen"
        >
          <CarouselContent>
            {layoutItems(3)}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="w-[600px]">
        <Carousel
          aria-label="Tablet multi-browse carousel"
          layout="multi-browse"
        >
          <CarouselContent>
            {layoutItems(5)}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const itemWidths = (name: string) =>
      within(canvas.getByRole("region", { name }))
        .getAllByRole("group")
        .map((item) => item.getBoundingClientRect().width)

    const standard = itemWidths("Standard carousel")
    const multiBrowse = itemWidths("Multi-browse carousel")
    const hero = itemWidths("Hero carousel")
    const uncontained = itemWidths("Uncontained carousel")
    const tablet = itemWidths("Tablet multi-browse carousel")
    const uncontainedCarousel = canvas.getByRole("region", {
      name: "Uncontained carousel",
    })
    const uncontainedViewport = uncontainedCarousel.querySelector<HTMLElement>(
      '[data-slot="carousel-viewport"]',
    )!
    const uncontainedThird = within(uncontainedCarousel).getAllByRole("group")[2]
    const visibleUncontainedThird =
      Math.min(
        uncontainedThird.getBoundingClientRect().right,
        uncontainedViewport.getBoundingClientRect().right,
      ) - uncontainedThird.getBoundingClientRect().left
    const fullScreenItem = within(
      canvas.getByRole("region", { name: "Full-screen carousel" }),
    ).getAllByRole("group")[0]

    await expect(standard[0]).toBeCloseTo(362.224, 1)
    await expect(standard[1]).toBeCloseTo(270.674, 1)
    await expect(standard[2]).toBeCloseTo(204, 1)
    await expect(multiBrowse.slice(0, 3)).toEqual([188, 120, 56])
    await expect(hero.slice(0, 2)).toEqual([316, 56])
    await expect(uncontained.slice(0, 3)).toEqual([154, 154, 154])
    await expect(visibleUncontainedThird).toBe(72)
    await expect(tablet.slice(0, 4)).toEqual([184, 184, 120, 56])
    await expect(
      within(
        canvas.getByRole("region", { name: "Standard carousel" }),
      ).getAllByRole("group")[0].getBoundingClientRect().height,
    ).toBe(204)
    await expect(
      within(
        canvas.getByRole("region", { name: "Multi-browse carousel" }),
      ).getAllByRole("group")[0].getBoundingClientRect().height,
    ).toBe(205)
    await expect(
      within(
        canvas.getByRole("region", {
          name: "Tablet multi-browse carousel",
        }),
      ).getAllByRole("group")[0].getBoundingClientRect().height,
    ).toBe(204)
    await expect(fullScreenItem.getBoundingClientRect().width).toBe(412)
    await expect(fullScreenItem.getBoundingClientRect().height).toBe(480)
  },
}

/** Pointer dragging advances the same public selection state as the controls. */
export const PointerDragging: Story = {
  render: () => (
    <Carousel
      aria-label="Draggable destinations"
      className="max-w-[412px]"
      layout="uncontained"
    >
      <CarouselContent data-testid="drag-track">
        {layoutItems(5)}
      </CarouselContent>
    </Carousel>
  ),
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== "test") return

    const { commands } = await import("vitest/browser")
    const carousel = within(canvasElement).getByRole("region", {
      name: "Draggable destinations",
    })
    const slides = within(carousel).getAllByRole("group")

    await commands.dragPointer('[data-testid="drag-track"]', -220, 0)

    await waitFor(() => expect(slides[1]).toHaveAttribute("aria-current", "true"))
  },
}

/** Touch swiping uses the native gesture path rather than a mouse-event proxy. */
export const TouchGestures: Story = {
  render: () => (
    <Carousel
      aria-label="Touch destinations"
      className="max-w-[412px]"
      layout="uncontained"
    >
      <CarouselContent data-testid="touch-track">
        {layoutItems(5)}
      </CarouselContent>
    </Carousel>
  ),
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== "test") return

    const { commands } = await import("vitest/browser")
    const carousel = within(canvasElement).getByRole("region", {
      name: "Touch destinations",
    })
    const slides = within(carousel).getAllByRole("group")

    await commands.dragTouch('[data-testid="touch-track"]', -180, 0)

    await waitFor(() => expect(slides[1]).toHaveAttribute("aria-current", "true"))
  },
}

/** Reduced motion removes both item morphing and inertial control movement. */
export const ReducedMotion: Story = {
  render: () => (
    <Carousel
      aria-label="Reduced-motion destinations"
      className="max-w-[412px]"
      layout="multi-browse"
    >
      <CarouselContent>{layoutItems(5)}</CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== "test") return

    const { commands } = await import("vitest/browser")
    const carousel = within(canvasElement).getByRole("region", {
      name: "Reduced-motion destinations",
    })
    const track = carousel.querySelector<HTMLElement>(
      '[data-slot="carousel-content"]',
    )!
    const firstSlide = within(carousel).getAllByRole("group")[0]
    const next = within(carousel).getByRole("button", { name: "Next slide" })

    await commands.emulateReducedMotion(true)
    try {
      await waitFor(() =>
        expect(getComputedStyle(firstSlide).transitionDuration).toBe("0s"),
      )

      await userEvent.click(next)
      const slides = within(carousel).getAllByRole("group")
      await waitFor(() =>
        expect(slides[1]).toHaveAttribute("aria-current", "true"),
      )
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      )
      const settledTransform = track.style.transform
      await new Promise((resolve) => setTimeout(resolve, 100))

      await expect(track.style.transform).toBe(settledTransform)
    } finally {
      await commands.emulateReducedMotion(false)
    }
  },
}

/** Slides receive useful position names when consumers do not provide one. */
export const AccessibleSlideNames: Story = {
  render: () => (
    <Carousel aria-label="Named carousel" className="max-w-[412px]">
      <CarouselContent>
        {false}
        {Array.from({ length: 3 }, (_, index) => (
          <CarouselItem key={index}>
            <DestinationCard name={`Destination ${index + 1}`} />
          </CarouselItem>
        ))}
        {null}
      </CarouselContent>
    </Carousel>
  ),
  play: async ({ canvasElement }) => {
    const carousel = within(canvasElement).getByRole("region", {
      name: "Named carousel",
    })

    await expect(
      within(carousel).getByRole("group", { name: "Slide 1 of 3" }),
    ).toHaveAttribute("aria-current", "true")
    await expect(
      within(carousel).getByRole("group", { name: "Slide 3 of 3" }),
    ).toBeVisible()
  },
}

/** Centered hero emphasis and controls retain semantic roles in light and dark themes. */
export const CenteredHeroThemes: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <Carousel
      aria-label="Centered hero destinations"
      className="max-w-[412px]"
      layout="hero"
      opts={{ align: "center", startIndex: 1 }}
    >
      <CarouselContent>
        {["San Miguel", "Bacalar", "Todos Santos", "Valle de Bravo"].map(
          (name) => (
            <CarouselItem key={name} aria-label={name}>
              <DestinationCard name={name} />
            </CarouselItem>
          ),
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const carousels = canvas.getAllByRole("region", {
      name: "Centered hero destinations",
    })
    const selectedSlides = carousels.map((carousel) =>
      within(carousel).getByRole("group", { name: "Bacalar" }),
    )
    const nextControls = carousels.map((carousel) =>
      within(carousel).getByRole("button", { name: "Next slide" }),
    )

    await waitFor(() =>
      expect(selectedSlides[0]).toHaveAttribute("aria-current", "true"),
    )
    for (const slide of selectedSlides) {
      await waitFor(() =>
        expect(slide.getBoundingClientRect().width).toBe(252),
      )
    }
    await expect(getComputedStyle(nextControls[0]).backgroundColor).not.toBe(
      getComputedStyle(nextControls[1]).backgroundColor,
    )
  },
}
