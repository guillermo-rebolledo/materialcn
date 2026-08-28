import { useEffect, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { ThemeProvider } from "../theme-provider"
import { Button } from "./button"
import { Toaster, createToastManager, toast } from "./toast"

const meta = {
  title: "Components/Snackbar",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

function PlainTextDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Button
        onClick={() =>
          toast.add({
            description: "Changes saved",
            timeout: 0,
          })
        }
      >
        Save changes
      </Button>
      <Toaster />
    </div>
  )
}

/** A plain snackbar is announced politely and never takes focus from its trigger. */
export const PlainTextAndFocus: Story = {
  render: () => <PlainTextDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Save changes" })

    trigger.focus()
    await userEvent.keyboard("{Enter}")

    const message = await page.findByText("Changes saved")
    await expect(trigger).toHaveFocus()
    await expect(page.getByRole("region", { name: "Notifications" })).toHaveAttribute(
      "aria-live",
      "polite",
    )
    await waitFor(() =>
      expect(Math.round(message.closest('[data-slot="toast"]')!.getBoundingClientRect().height)).toBe(48),
    )
  },
}

function ActionDemo() {
  const [lastAction, setLastAction] = useState("No action yet")

  function showAction() {
    const id = toast.add({
      description: "Message archived",
      timeout: 0,
      actionProps: {
        children: "Undo",
        onClick: () => {
          setLastAction("Archive undone")
          toast.close(id)
        },
      },
    })
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-3">
        <Button onClick={showAction}>Show action</Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              description: "Draft discarded",
              timeout: 0,
              data: { dismissible: true },
            })
          }
        >
          Show dismissible
        </Button>
      </div>
      <output aria-live="polite">{lastAction}</output>
      <Toaster />
    </div>
  )
}

/** Actions and optional close controls work with both pointer and keyboard input. */
export const ActionAndDismissal: Story = {
  render: () => <ActionDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole("button", { name: "Show action" }))
    const undo = await page.findByRole("button", { name: "Undo" })
    await userEvent.click(undo)
    await expect(canvas.getByText("Archive undone")).toBeVisible()
    await waitFor(() => expect(page.queryByText("Message archived")).not.toBeInTheDocument())

    await userEvent.click(canvas.getByRole("button", { name: "Show dismissible" }))
    await page.findByText("Draft discarded")
    await waitFor(() => expect(page.getByText("Draft discarded")).toBeVisible())
    await userEvent.keyboard("{F6}")
    const region = page.getByRole("region", { name: "Notifications" })
    await expect(region).toHaveFocus()
    const snackbar = page.getByText("Draft discarded").closest('[data-slot="toast"]')
    if (!snackbar) throw new Error("Expected a rendered snackbar")
    await expect(snackbar).toHaveStyle({ outlineStyle: "solid" })
    await userEvent.keyboard("{Tab}")
    await waitFor(() => expect(snackbar).toHaveFocus())
    await userEvent.keyboard("{Tab}")
    const dismiss = page.getByRole("button", { name: "Dismiss notification" })
    await expect(dismiss).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(page.queryByText("Draft discarded")).not.toBeInTheDocument())
  },
}

function ImportantFeedbackDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Button
        variant="destructive"
        onClick={() =>
          toast.add({
            description: "Connection lost",
            priority: "high",
            timeout: 0,
            data: { dismissible: true },
          })
        }
      >
        Simulate connection loss
      </Button>
      <Toaster />
    </div>
  )
}

/** High-priority feedback receives an urgent announcement without taking focus. */
export const ImportantFeedback: Story = {
  render: () => <ImportantFeedbackDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Simulate connection loss" })

    await userEvent.click(trigger)
    const alert = await page.findByRole("alert")
    await expect(alert).toHaveTextContent("Connection lost")
    await expect(trigger).toHaveFocus()
  },
}

function StackDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Button
        onClick={() => {
          toast.add({ description: "First notification" })
          toast.add({ description: "Second notification" })
          toast.add({ description: "Third notification" })
        }}
      >
        Show stack
      </Button>
      <Toaster timeout={300} />
    </div>
  )
}

/** Hover and keyboard focus expand the stack and pause its dismissal timers. */
export const StackingPauseAndKeyboard: Story = {
  render: () => <StackDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Show stack" })

    await userEvent.click(trigger)
    const region = await page.findByRole("region", { name: "Notifications" })
    await waitFor(() => expect(region.querySelectorAll('[data-slot="toast"]')).toHaveLength(3))

    const frontmostToast = page.getByText("Third notification").closest('[data-slot="toast"]')
    if (!frontmostToast) throw new Error("Expected a rendered snackbar")
    await userEvent.hover(frontmostToast)
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    await expect(page.getByText("First notification")).toBeVisible()

    trigger.focus()
    await userEvent.keyboard("{F6}")
    await waitFor(() => expect(region).toHaveFocus())
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    await waitFor(() => expect(trigger).toHaveFocus())

    await userEvent.unhover(frontmostToast)
    await waitFor(
      () => expect(page.queryByText("Third notification")).not.toBeInTheDocument(),
      { timeout: 1500 },
    )
  },
}

function StackedPresentationDemo() {
  const [manager] = useState(() => createToastManager())

  useEffect(() => {
    const ids = ["First notification", "Second notification", "Third notification"].map(
      (description) => manager.add({ description, timeout: 0 }),
    )
    return () => ids.forEach((id) => manager.close(id))
  }, [manager])

  return <Toaster toastManager={manager} />
}

/** A persistent three-message stack for visual inspection of depth and expansion. */
export const StackedPresentation: Story = {
  render: () => <StackedPresentationDemo />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const region = await page.findByRole("region", { name: "Notifications" })
    await waitFor(() => expect(region.querySelectorAll('[data-slot="toast"]')).toHaveLength(3))
  },
}

function PresentationDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [manager] = useState(() => createToastManager())

  useEffect(() => {
    if (!container) return
    const id = manager.add({
      description: "Two-line feedback stays readable on a narrow viewport.",
      timeout: 0,
      actionProps: { children: "Undo" },
      data: { dismissible: true },
    })
    return () => manager.close(id)
  }, [container, manager])

  return (
    <div ref={setContainer} className="relative min-h-36 w-full">
      {container && (
        <Toaster
          toastManager={manager}
          portalProps={{ container }}
          viewportProps={{ className: "absolute" }}
        />
      )}
    </div>
  )
}

/** The same inverse color roles produce the kit presentation in light and dark schemes. */
export const LightAndDarkPresentation: Story = {
  parameters: { sideBySide: true },
  render: () => <PresentationDemo />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const snackbars = await page.findAllByRole("dialog")

    await expect(snackbars).toHaveLength(2)
    await waitFor(() => {
      for (const snackbar of snackbars) {
        expect(Math.round(snackbar.getBoundingClientRect().width)).toBeLessThanOrEqual(344)
        expect(Math.round(snackbar.getBoundingClientRect().height)).toBe(68)
      }
    })
  },
}

function DefaultPortalThemeDemo() {
  const [themeRoot, setThemeRoot] = useState<HTMLDivElement | null>(null)
  const [manager] = useState(() => createToastManager())

  useEffect(() => {
    if (!themeRoot) return
    const id = manager.add({ description: "Dark subtree notification", timeout: 0 })
    return () => manager.close(id)
  }, [manager, themeRoot])

  return (
    <div ref={setThemeRoot} className="min-h-24">
      {themeRoot && (
        <ThemeProvider defaultTheme="dark" storageKey={null} element={themeRoot}>
          <Toaster toastManager={manager} />
        </ThemeProvider>
      )}
    </div>
  )
}

/** A body-level portal retains the resolved theme of its provider subtree. */
export const DefaultPortalTheme: Story = {
  render: () => <DefaultPortalThemeDemo />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await page.findByText("Dark subtree notification")
    await waitFor(() => expect(page.getByText("Dark subtree notification")).toBeVisible())
    const portal = canvasElement.ownerDocument.querySelector('[data-slot="toast-portal"]')
    await expect(portal).toHaveClass("dark")
  },
}

function StackedActionDemo() {
  const [manager] = useState(() => createToastManager())

  useEffect(() => {
    const id = manager.add({
      description: "Your message could not be sent. Check the connection and try again.",
      timeout: 0,
      actionProps: { children: "Try again" },
      data: { layout: "stacked", dismissible: true },
    })
    return () => manager.close(id)
  }, [manager])

  return <Toaster toastManager={manager} />
}

/** Longer actions move below the message while preserving the 344dp Material surface. */
export const StackedAction: Story = {
  render: () => <StackedActionDemo />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const snackbar = await page.findByRole("dialog")

    await expect(snackbar).toHaveAttribute("data-layout", "stacked")
    await waitFor(() => {
      expect(Math.round(snackbar.getBoundingClientRect().width)).toBeLessThanOrEqual(344)
      expect(Math.round(snackbar.getBoundingClientRect().height)).toBe(112)
    })
  },
}
