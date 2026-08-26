import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, waitFor, within } from "storybook/test"
import { UserRoundIcon } from "lucide-react"

import { Icon } from "./icon"
import { Image } from "./image"

const meta = {
  title: "Components/Image",
  component: Image,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Holds its space while loading, degrades deliberately when the source is missing, and serves an asset matched to the screen.",
      },
    },
  },
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

/**
 * An inline SVG so the stories have a real, deterministic source — no network,
 * and the test can assert against something that genuinely loads.
 */
const SAMPLE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6750A4"/><stop offset="1" stop-color="#7D5260"/></linearGradient></defs><rect width="320" height="180" fill="url(#g)"/></svg>`,
  )

export const Default: Story = {
  args: {
    src: SAMPLE,
    alt: "A purple gradient",
    width: 320,
    height: 180,
    shape: "lg",
  },
}

/**
 * The box is reserved by the wrapper before the image exists. Letting the `img`
 * size itself is what produces the classic reflow — the page lays out at zero
 * height, then jumps when the bytes arrive, and jumps again for everything
 * below it.
 *
 * `aspectRatio` scales against the parent; `width`/`height` pin it.
 */
export const HoldsItsSpace: Story = {
  args: { src: SAMPLE, alt: "A purple gradient" },
  render: () => (
    <div className="flex flex-col gap-m3-lg">
      {(["16/9", "4/3", "1/1"] as const).map((ratio) => (
        <div key={ratio} className="flex items-center gap-m3-lg">
          <code className="text-m3-label-md text-muted-foreground w-16 shrink-0">
            {ratio}
          </code>
          <div className="w-64">
            <Image
              src={SAMPLE}
              alt="A purple gradient"
              aspectRatio={ratio}
              shape="md"
              data-testid={`ratio-${ratio}`}
            />
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!

    // The reserved box is the point, so measure it rather than trusting the
    // declaration: 256px wide at 16/9 is 144 tall whether or not anything
    // has loaded.
    const box = canvas.getByTestId("ratio-16/9").getBoundingClientRect()
    expect(Math.round(box.width / box.height), "16/9").toBe(2)
    expect(Math.round(box.height)).toBe(144)

    const square = canvas.getByTestId("ratio-1/1").getBoundingClientRect()
    expect(Math.round(square.width)).toBe(Math.round(square.height))

    // The image fills the reserved box and crops, so a wrong ratio is a crop
    // rather than a distortion.
    const [img] = canvas.getAllByRole("img", { name: "A purple gradient" })
    expect(view.getComputedStyle(img).objectFit).toBe("cover")
  },
}

/**
 * A missing or broken source gets a deliberate placeholder rather than the
 * browser's broken-image glyph. The fallback is decorative whatever the image
 * was — reading the `alt` text would describe a picture the user cannot see.
 */
export const Fallback: Story = {
  args: { src: SAMPLE, alt: "A purple gradient" },
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap gap-m3-lg">
      <div className="flex flex-col gap-m3-xs">
        <code className="text-m3-label-sm text-muted-foreground">no src</code>
        <Image
          alt="Nothing to show"
          width={160}
          height={160}
          shape="lg"
          data-testid="no-src"
        />
      </div>
      <div className="flex flex-col gap-m3-xs">
        <code className="text-m3-label-sm text-muted-foreground">
          broken src
        </code>
        <Image
          src="/does-not-exist.png"
          alt="A photograph that failed to load"
          width={160}
          height={160}
          shape="lg"
          data-testid="broken"
        />
      </div>
      <div className="flex flex-col gap-m3-xs">
        <code className="text-m3-label-sm text-muted-foreground">
          supplied fallback
        </code>
        <Image
          alt="Ada Lovelace"
          width={160}
          height={160}
          shape="full"
          fallback={
            <Icon size="xl">
              <UserRoundIcon />
            </Icon>
          }
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const [none] = canvas.getAllByTestId("no-src")
    expect(none).toHaveAttribute("data-state", "fallback")

    // The broken one has to actually fail first.
    const [broken] = canvas.getAllByTestId("broken")
    await waitFor(() => expect(broken).toHaveAttribute("data-state", "fallback"))
    expect(broken.querySelector("[data-slot=image-fallback]")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  },
}

/**
 * Extra sources by device pixel ratio go out as `srcset`, so the browser picks
 * by the viewer's actual screen — which is not something this component could
 * work out, and should not try to.
 */
export const Densities: Story = {
  args: {
    src: SAMPLE,
    alt: "A purple gradient",
    width: 160,
    height: 90,
    densities: { 2: SAMPLE, 3: SAMPLE },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole("img", { name: "A purple gradient" })
    expect(img.getAttribute("srcset")).toMatch(/ 2x, .* 3x$/)
  },
}

/**
 * A decorative image is marked, not left blank. `alt=""` plus `aria-hidden`
 * tells assistive technology to skip it; *omitting* alt entirely would have it
 * announced by file name, which is the worst of the three outcomes — so the
 * types make one of the two choices mandatory.
 */
export const Decorative: Story = {
  args: { src: SAMPLE, alt: "A purple gradient" },
  render: () => (
    <div className="flex items-center gap-m3-lg">
      <Image
        src={SAMPLE}
        decorative
        width={120}
        height={68}
        shape="sm"
        data-testid="decorative"
      />
      <p className="text-m3-body-md max-w-sm">
        The paragraph carries the meaning; the image beside it is texture. It is
        marked decorative so a screen reader skips it rather than describing it.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas
      .getByTestId("decorative")
      .querySelector("[data-slot=image-img]")!
    expect(img).toHaveAttribute("alt", "")
    expect(img).toHaveAttribute("aria-hidden", "true")
    expect(canvas.queryAllByRole("img")).toHaveLength(0)
  },
}

/** The corner steps, applied to the image and its fallback alike. */
export const Shapes: Story = {
  args: { src: SAMPLE, alt: "A purple gradient" },
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap items-end gap-m3-lg">
      {(["none", "sm", "lg", "xl", "full"] as const).map((shape) => (
        <div key={shape} className="flex flex-col items-center gap-m3-xs">
          <Image
            src={SAMPLE}
            alt="A purple gradient"
            width={96}
            height={96}
            shape={shape}
          />
          <code className="text-m3-label-sm text-muted-foreground">
            {shape}
          </code>
        </div>
      ))}
    </div>
  ),
}
