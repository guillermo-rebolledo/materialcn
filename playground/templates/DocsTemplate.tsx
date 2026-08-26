/**
 * Docs — the type scale carrying a page on its own.
 *
 * Almost no components: a nav, a trail, a table of contents, an accordion of
 * questions. That is the point. If the type scale, the measure, and the link
 * colour are wrong, there is nothing else on this page to hide behind.
 */
import { useState } from "react"
import {
  BookOpenIcon,
  CheckIcon,
  CopyIcon,
  HashIcon,
  PaletteIcon,
  RulerIcon,
  WavesIcon,
} from "lucide-react"

import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { Link } from "@/components/ui/link"
import {
  List,
  ListItem,
  ListItemContent,
  ListItemHeadline,
  ListItemLeading,
  ListItemSupportingText,
} from "@/components/ui/list"
import {
  SearchBar,
  SearchBarInput,
  SearchBarLeading,
} from "@/components/ui/search-bar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TopAppBar,
  TopAppBarActions,
  TopAppBarNavigation,
  TopAppBarTitle,
} from "@/components/ui/top-app-bar"
import { Toaster, toast } from "@/components/ui/toast"

const SECTIONS = [
  { id: "install", label: "Installation" },
  { id: "tokens", label: "The token layer" },
  { id: "theming", label: "Retheming" },
  { id: "faq", label: "Questions" },
]

const PILLARS = [
  {
    icon: PaletteIcon,
    title: "Colour",
    body: "49 roles, paired container to content, generated from the kit.",
  },
  {
    icon: RulerIcon,
    title: "Shape",
    body: "Ten steps from a square corner to a full pill.",
  },
  {
    icon: WavesIcon,
    title: "Motion",
    body: "Springs sampled into CSS linear() easings, spatial and effects.",
  },
]

const FAQ = [
  [
    "Do I have to patch the shadcn components?",
    "No — that is the point of the arrangement. The semantic variables shadcn already reads are pointed at Material roles, so stock shadcn markup renders as Material and retheming is a token edit.",
  ],
  [
    "Can I use Tailwind's own spacing scale?",
    "Yes. Both are the same 4dp unit; the difference is that the numeric utilities scale with the user's font size and the m3 ones do not. Reach for p-m3-* when a measurement has to match the kit exactly.",
  ],
  [
    "Why are the variants in separate files?",
    "React Fast Refresh. A cva() call builds a new object every time its module runs, so exporting one from a component file made every edit a full page reload.",
  ],
]

const INSTALL = {
  pnpm: "pnpm add materialcn",
  npm: "npm install materialcn",
  bun: "bun add materialcn",
}

export function DocsTemplate() {
  const [query, setQuery] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  function copy(command: string) {
    setCopied(command)
    toast.add({ description: "Command copied", timeout: 3000 })
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="bg-background text-foreground flex min-h-full flex-col">
      <TopAppBar>
        <TopAppBarNavigation>
          <Button variant="ghost" size="icon" aria-label="Documentation">
            <BookOpenIcon />
          </Button>
        </TopAppBarNavigation>
        <TopAppBarTitle>Documentation</TopAppBarTitle>
        <TopAppBarActions>
          <SearchBar
            className="hidden w-64 m3-medium:flex"
            value={query}
            onValueChange={setQuery}
          >
            <SearchBarLeading>
              <Icon size="md">
                <HashIcon />
              </Icon>
            </SearchBarLeading>
            <SearchBarInput aria-label="Search docs" placeholder="Search docs" />
          </SearchBar>
        </TopAppBarActions>
      </TopAppBar>

      {/*
        The table of contents is a sibling column, not a floating panel: it
        scrolls with the page below `large` and sticks above it, which is the
        cheapest correct behaviour and the one readers expect.
      */}
      <div className="mx-auto grid w-full max-w-5xl gap-m3-xl p-m3-lg m3-large:grid-cols-[minmax(0,1fr)_220px] m3-large:items-start">
        <main className="flex min-w-0 flex-col gap-m3-xl">
          <header className="flex flex-col gap-m3-md">
            <Breadcrumbs
              items={[
                { label: "Docs", href: "#" },
                { label: "Getting started", href: "#" },
                { label: "Overview" },
              ]}
            />
            <h1 className="text-m3-display-sm font-m3-emphasized">
              Material 3 Expressive, on shadcn
            </h1>
            {/* A measure, not a full-width paragraph — long lines are the
                single most common typography failure on a docs page. */}
            <p className="max-w-prose text-m3-body-lg text-m3-on-surface-variant">
              materialcn restyles the shadcn/ui primitives with Material 3
              Expressive tokens on Tailwind v4. You keep the shadcn API you
              already know, and the components pick up Material colour, shape,
              type, and motion from a single generated token layer.
            </p>
            <div className="flex flex-wrap gap-m3-sm">
              <Chip variant="secondary" size="sm">
                Tailwind v4
              </Chip>
              <Chip variant="secondary" size="sm">
                Base UI
              </Chip>
              <Chip variant="outline" size="sm">
                MIT
              </Chip>
            </div>
          </header>

          <section id="install" className="flex flex-col gap-m3-md">
            <h2 className="text-m3-headline-sm">Installation</h2>
            <p className="max-w-prose text-m3-body-lg">
              Add the package and import the stylesheet once, at the root of
              your app.
            </p>
            <Tabs defaultValue="pnpm">
              <TabsList variant="line">
                {Object.keys(INSTALL).map((manager) => (
                  <TabsTrigger key={manager} value={manager}>
                    {manager}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(INSTALL).map(([manager, command]) => (
                <TabsContent key={manager} value={manager} className="pt-m3-md">
                  <Card variant="filled">
                    <CardContent className="flex items-center justify-between gap-m3-md py-m3-md">
                      <code className="truncate text-m3-body-md">{command}</code>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Copy ${manager} command`}
                        onClick={() => copy(command)}
                      >
                        {copied === command ? <CheckIcon /> : <CopyIcon />}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          <Separator />

          <section id="tokens" className="flex flex-col gap-m3-md">
            <h2 className="text-m3-headline-sm">The token layer</h2>
            <p className="max-w-prose text-m3-body-lg">
              Three of the token families are generated from the official
              Material 3 design kit rather than transcribed from the docs site,
              so the numbers are the ones the kit actually ships.
            </p>
            <div className="grid gap-m3-md sm:grid-cols-3">
              {PILLARS.map(({ icon: Glyph, title, body }) => (
                <Card key={title} variant="outlined">
                  <CardContent className="flex flex-col gap-m3-sm py-m3-lg">
                    <Icon size="lg">
                      <Glyph />
                    </Icon>
                    <span className="text-m3-title-md">{title}</span>
                    <span className="text-m3-body-md text-m3-on-surface-variant">
                      {body}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          <section id="theming" className="flex flex-col gap-m3-md">
            <h2 className="text-m3-headline-sm">Retheming</h2>
            <p className="max-w-prose text-m3-body-lg">
              Because no component is patched for colour, changing the palette
              is an edit to the generator rather than a sweep through the
              component tree.
            </p>
            <List aria-label="Retheming steps">
              <ListItem lines={2}>
                <ListItemLeading>
                  <Icon size="md">
                    <PaletteIcon />
                  </Icon>
                </ListItemLeading>
                <ListItemContent>
                  <ListItemHeadline>Edit the source palette</ListItemHeadline>
                  <ListItemSupportingText>
                    scripts/generate-tokens.mjs holds the seed colours.
                  </ListItemSupportingText>
                </ListItemContent>
              </ListItem>
              <ListItem lines={2}>
                <ListItemLeading>
                  <Icon size="md">
                    <RulerIcon />
                  </Icon>
                </ListItemLeading>
                <ListItemContent>
                  <ListItemHeadline>Run the generator</ListItemHeadline>
                  <ListItemSupportingText>
                    pnpm tokens rewrites the four generated files.
                  </ListItemSupportingText>
                </ListItemContent>
              </ListItem>
              <ListItem lines={2}>
                <ListItemLeading>
                  <Icon size="md">
                    <WavesIcon />
                  </Icon>
                </ListItemLeading>
                <ListItemContent>
                  <ListItemHeadline>Check both schemes</ListItemHeadline>
                  <ListItemSupportingText>
                    The side-by-side stories render light and dark at once.
                  </ListItemSupportingText>
                </ListItemContent>
              </ListItem>
            </List>
          </section>

          <Separator />

          <section id="faq" className="flex flex-col gap-m3-md">
            <h2 className="text-m3-headline-sm">Questions</h2>
            <Accordion>
              {FAQ.map(([question, answer]) => (
                <AccordionItem key={question} value={question}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="max-w-prose text-m3-body-lg">{answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <footer className="flex flex-wrap items-center gap-m3-md pb-m3-3xl">
            <span className="text-m3-body-md text-m3-on-surface-variant">
              Found a problem with this page?
            </span>
            <Link href="#">Open an issue</Link>
          </footer>
        </main>

        <nav
          aria-label="On this page"
          className="hidden flex-col gap-m3-sm m3-large:sticky m3-large:top-m3-lg m3-large:flex"
        >
          <span className="text-m3-title-sm">On this page</span>
          {SECTIONS.map((section) => (
            <Link key={section.id} href={`#${section.id}`}>
              {section.label}
            </Link>
          ))}
        </nav>
      </div>

      <Toaster />
    </div>
  )
}
