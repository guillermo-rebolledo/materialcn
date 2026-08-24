import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <Accordion defaultValue={["color"]} className="w-96">
      {[
        ["color", "Color", "49 roles, paired container-to-content."],
        ["shape", "Shape", "Ten steps from 0 to a full pill."],
        ["motion", "Motion", "Springs sampled into CSS linear() easings."],
      ].map(([value, title, body]) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent>{body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}
