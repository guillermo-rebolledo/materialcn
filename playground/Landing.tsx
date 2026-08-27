import { useState } from "react"
import { ArrowRightIcon, CheckIcon, CopyIcon, SwatchBookIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { cardVariants } from "@/components/ui/card-variants"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

import { TEMPLATES } from "./templates"

const INSTALL_COMMAND = "npx shadcn add @materialcn/button"

/**
 * The published landing page, and the playground's own index.
 *
 * The template screens are the honest showcase: a token gallery proves the
 * roles exist, but only a real screen shows them competing for one layout.
 * They lead, and the gallery is one more card among them rather than the first
 * thing a visitor meets.
 */
export function Landing() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-m3-2xl px-m3-lg py-m3-2xl">
      <header className="flex flex-col gap-m3-md">
        <h1 className="text-m3-display-sm text-m3-on-surface">
          Material 3 Expressive for shadcn/ui
        </h1>
        <p className="max-w-2xl text-m3-body-lg text-m3-on-surface-variant">
          Base UI primitives restyled with M3 tokens taken from the official Figma kit.
          Stock shadcn markup renders as Material, so retheming is a token edit rather
          than a rewrite.
        </p>
        <InstallCommand />
      </header>

      <section className="flex flex-col gap-m3-md">
        <h2 className="text-m3-title-md text-m3-on-surface-variant">Screens</h2>
        {/*
          Each card is a link, not a button with a click handler: a visitor
          should be able to middle-click a screen into a new tab, and the hash
          is a real address.
        */}
        {/* Material's window size classes, not Tailwind's stock scale: mixing
            the two leaves the winner down to which breakpoint Tailwind emits
            last. */}
        <div className="grid gap-m3-md m3-medium:grid-cols-2 m3-expanded:grid-cols-3">
          {TEMPLATES.map((entry) => (
            <ScreenCard
              key={entry.id}
              href={`#/t/${entry.id}`}
              title={entry.title}
              blurb={entry.blurb}
            />
          ))}
          <ScreenCard
            href="#/gallery"
            title="Token gallery"
            blurb="Every colour role, type step, and elevation level at once."
            icon={<SwatchBookIcon />}
          />
        </div>
      </section>
    </div>
  )
}

function ScreenCard({
  href,
  title,
  blurb,
  icon,
}: {
  href: string
  title: string
  blurb: string
  icon?: React.ReactNode
}) {
  return (
    /*
      The anchor carries the card's own styling rather than wrapping a Card:
      `interactive` puts the state layer and the focus ring on the element it
      is applied to, and that has to be the thing the keyboard actually lands
      on. Wrapping would give the card a second tab stop.
    */
    <a
      href={href}
      className={cn(cardVariants({ variant: "filled", interactive: true }), "h-full")}
    >
      <CardContent className="flex flex-1 flex-col gap-m3-xs">
        <div className="flex items-center gap-m3-sm">
          {icon ? <Icon className="text-m3-primary">{icon}</Icon> : null}
          <CardTitle className="text-m3-title-md">{title}</CardTitle>
        </div>
        <CardDescription className="flex-1">{blurb}</CardDescription>
        <span className="mt-m3-sm flex items-center gap-m3-xs text-m3-label-lg text-m3-primary">
          Open
          <Icon size="sm">
            <ArrowRightIcon />
          </Icon>
        </span>
      </CardContent>
    </a>
  )
}

function InstallCommand() {
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex w-fit items-center gap-m3-sm rounded-m3-lg bg-m3-surface-container-high py-m3-xs pl-m3-lg pr-m3-xs">
      <code className="font-mono text-m3-body-md text-m3-on-surface">
        {INSTALL_COMMAND}
      </code>
      <Button
        variant="ghost"
        size="xs"
        aria-label={copied ? "Copied" : "Copy install command"}
        onClick={() => {
          // Clipboard access can be refused (an insecure origin, a denied
          // permission). The command is on screen either way, so there is
          // nothing to recover from — just don't claim it was copied.
          navigator.clipboard
            ?.writeText(INSTALL_COMMAND)
            .then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            })
            .catch(() => {})
        }}
      >
        <Icon size="sm">{copied ? <CheckIcon /> : <CopyIcon />}</Icon>
      </Button>
    </div>
  )
}
