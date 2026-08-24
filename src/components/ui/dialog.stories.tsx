import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The extra-large shape step (28dp), 24dp padding, and surface-container-high.
 * Material leans on the container ramp for depth, so the shadow stays light.
 */
export const Default: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="tonal">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset motion scheme?</DialogTitle>
          <DialogDescription>
            Every component will fall back to the standard springs. You can
            switch back to Expressive at any time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose render={<Button>Reset</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
