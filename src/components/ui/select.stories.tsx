import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** The menu surface is surface-container with the extra-small shape step. */
export const Default: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <Select defaultValue="expressive">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Motion scheme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="expressive">Expressive</SelectItem>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="reduced">Reduced</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}
