/**
 * One product-shaped screen.
 *
 * The stories exercise each component alone. Nothing in the repo puts a
 * navigation rail, a list, a search bar, a form, and a snackbar in the same
 * layout at the same time — which is where spacing, elevation, and overlay
 * ordering problems actually surface.
 *
 * It lives in `playground/` rather than `src/`, so it stays out of the
 * published package: `package.json` ships `src`, and this is a demo, not API.
 *
 * Responsive behaviour is exercised across the real window size classes rather
 * than at one width — the navigation moves from a bottom bar to a docked rail
 * to an expanded rail, and the content goes from one column to two.
 */
import { useState } from "react"
import {
  ArchiveIcon,
  BellIcon,
  FolderIcon,
  InboxIcon,
  MenuIcon,
  MoonIcon,
  MoreVerticalIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  Trash2Icon,
} from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import { Image } from "@/components/ui/image"
import { Link } from "@/components/ui/link"
import {
  List,
  ListItem,
  ListItemContent,
  ListItemHeadline,
  ListItemLeading,
  ListItemSupportingText,
  ListItemTrailing,
} from "@/components/ui/list"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import {
  NavigationRail,
  NavigationRailDestinations,
  NavigationRailExpansionToggle,
  NavigationRailItem,
  NavigationRailMenu,
} from "@/components/ui/navigation-rail"
import { Paginator } from "@/components/ui/paginator"
import {
  SearchBar,
  SearchBarInput,
  SearchBarLeading,
} from "@/components/ui/search-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { TextField } from "@/components/ui/text-field"
import { Toaster, toast } from "@/components/ui/toast"
import hero from "./assets/hero.png"

const DESTINATIONS = [
  { value: "inbox", label: "Inbox", icon: InboxIcon },
  { value: "projects", label: "Projects", icon: FolderIcon },
  { value: "archive", label: "Archive", icon: ArchiveIcon },
  { value: "settings", label: "Settings", icon: SettingsIcon },
] as const

const THREADS = [
  {
    id: 1,
    from: "Ada Lovelace",
    subject: "Analytical engine spec, second pass",
    preview: "The card ordering is settled. Two notes on the mill before we print.",
    unread: true,
  },
  {
    id: 2,
    from: "Grace Hopper",
    subject: "Compiler timings",
    preview: "Down to eleven minutes. The bottleneck moved to the linker.",
    unread: true,
  },
  {
    id: 3,
    from: "Katherine Johnson",
    subject: "Re: trajectory review",
    preview: "Checked the figures by hand. They agree to four decimals.",
    unread: false,
  },
  {
    id: 4,
    from: "Radia Perlman",
    subject: "Spanning tree, revised",
    preview: "The loop was in the bridge table, not the protocol.",
    unread: false,
  },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <Icon size="sm">{dark ? <SunIcon /> : <MoonIcon />}</Icon>
    </Button>
  )
}

export function ProductScreen() {
  const [destination, setDestination] = useState<string>("inbox")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [notifications, setNotifications] = useState(true)
  const [replyTo, setReplyTo] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)

  const threads = THREADS.filter((thread) =>
    `${thread.from} ${thread.subject}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <div className="flex flex-1 flex-col m3-medium:flex-row">
        {/*
          Compact gets a bottom bar; medium and up get the rail, which expands
          at `large` where there is room for labels beside the icons. Three
          different navigations rather than one that shrinks, which is what
          Material's size classes are for.
        */}
        <NavigationRail
          value={destination}
          onValueChange={setDestination}
          expanded={false}
          className="max-m3-medium:hidden m3-large:hidden"
        >
          <NavigationRailMenu aria-label="Open navigation">
            <Icon size="md">
              <MenuIcon />
            </Icon>
          </NavigationRailMenu>
          <NavigationRailDestinations>
            {DESTINATIONS.map(({ value, label, icon: Glyph }) => (
              <NavigationRailItem
                key={value}
                value={value}
                label={label}
                icon={<Glyph />}
              />
            ))}
          </NavigationRailDestinations>
        </NavigationRail>

        <NavigationRail
          value={destination}
          onValueChange={setDestination}
          expanded
          className="hidden m3-large:flex"
        >
          <NavigationRailExpansionToggle aria-label="Collapse navigation" />
          <NavigationRailDestinations>
            {DESTINATIONS.map(({ value, label, icon: Glyph }) => (
              <NavigationRailItem
                key={value}
                value={value}
                label={label}
                icon={<Glyph />}
              />
            ))}
          </NavigationRailDestinations>
        </NavigationRail>

        <main className="flex min-w-0 flex-1 flex-col gap-m3-lg p-m3-lg pb-m3-4xl m3-medium:pb-m3-lg">
          <header className="flex flex-col gap-m3-md">
            <Breadcrumbs
              items={[
                { label: "Workspace", href: "#" },
                { label: "Engineering", href: "#" },
                { label: "Inbox" },
              ]}
            />
            <div className="flex flex-wrap items-center gap-m3-md">
              {/* The value lives on the root, not the input — the clear
                  affordance and the submit handler both need it. */}
              <SearchBar
                className="min-w-0 flex-1"
                value={query}
                onValueChange={setQuery}
              >
                <SearchBarLeading>
                  <Icon size="md">
                    <SearchIcon />
                  </Icon>
                </SearchBarLeading>
                <SearchBarInput
                  aria-label="Search threads"
                  placeholder="Search threads"
                />
              </SearchBar>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="sm" />}
                  aria-label="More actions"
                >
                  <Icon size="sm">
                    <MoreVerticalIcon />
                  </Icon>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLoading((v) => !v)}>
                    Toggle loading state
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      toast.add({ description: "Nothing to archive", timeout: 4000 })
                    }
                  >
                    Archive all
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <Alert severity="warning">
            <AlertTitle>Storage is nearly full</AlertTitle>
            <AlertDescription>
              You are using 94% of your quota. Older threads will stop syncing
              once it is reached. <Link href="#">Read about quotas</Link>.
            </AlertDescription>
            <AlertAction>
              <Button size="sm">Manage storage</Button>
            </AlertAction>
          </Alert>

          {/*
            One column when compact, two once there is room. The list is the
            wider of the two — the aside is metadata, not a peer.
          */}
          <div className="grid min-w-0 gap-m3-lg m3-expanded:grid-cols-[2fr_1fr]">
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>Threads</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-m3-md">
                {loading ? (
                  <div
                    aria-busy
                    aria-label="Loading threads"
                    className="flex flex-col gap-m3-lg"
                  >
                    {[0, 1, 2].map((row) => (
                      <div key={row} className="flex items-center gap-m3-md">
                        <Skeleton shape="circle" className="size-10" />
                        <div className="flex flex-1 flex-col gap-m3-xs">
                          <Skeleton text="title-md" className="w-1/2" />
                          <Skeleton text="body-sm" className="w-4/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : threads.length === 0 ? (
                  <p className="text-m3-body-md text-m3-on-surface-variant py-m3-xl text-center">
                    No threads match “{query}”.
                  </p>
                ) : (
                  <List>
                    {threads.map((thread) => (
                      <ListItem key={thread.id}>
                        <ListItemLeading>
                          <Icon size="md">
                            <InboxIcon />
                          </Icon>
                        </ListItemLeading>
                        <ListItemContent>
                          <ListItemHeadline>{thread.subject}</ListItemHeadline>
                          <ListItemSupportingText>
                            {thread.from} — {thread.preview}
                          </ListItemSupportingText>
                        </ListItemContent>
                        <ListItemTrailing>
                          {thread.unread ? (
                            <Badge size="sm">New</Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={`Delete ${thread.subject}`}
                              onClick={() =>
                                toast.add({
                                  description: "Thread deleted",
                                  timeout: 4000,
                                })
                              }
                            >
                              <Icon size="sm">
                                <Trash2Icon />
                              </Icon>
                            </Button>
                          )}
                        </ListItemTrailing>
                      </ListItem>
                    ))}
                  </List>
                )}

                <Paginator
                  page={page}
                  totalPages={12}
                  onPageChange={setPage}
                  className="justify-start"
                />
              </CardContent>
            </Card>

            <div className="flex min-w-0 flex-col gap-m3-lg">
              <Card>
                <CardHeader>
                  <CardTitle>Reply</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-m3-lg">
                  <TextField
                    label="Message"
                    multiline
                    rows={4}
                    value={replyTo}
                    onValueChange={setReplyTo}
                    supportingText="Sent as Ada Lovelace"
                    maxLength={280}
                  />
                  <div className="flex items-center justify-between gap-m3-md">
                    <label className="text-m3-body-md flex items-center gap-m3-sm">
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                      Notify me
                    </label>
                    <Button
                      loading={sending}
                      disabled={replyTo.trim().length === 0}
                      onClick={() => {
                        setSending(true)
                        setTimeout(() => {
                          setSending(false)
                          setReplyTo("")
                          toast.add({
                            description: "Reply sent",
                            timeout: 4000,
                          })
                        }, 1200)
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workspace</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-m3-md">
                  <Image
                    src={hero}
                    alt="The engineering workspace banner"
                    aspectRatio="16/9"
                    shape="lg"
                  />
                  <p className="text-m3-body-md text-m3-on-surface-variant">
                    Four members, two integrations.{" "}
                    <Link href="#">Manage access</Link>.
                  </p>
                  <div className="flex items-center gap-m3-sm">
                    <Icon size="sm" label="Notifications enabled">
                      <BellIcon />
                    </Icon>
                    <span className="text-m3-body-sm text-m3-on-surface-variant">
                      {notifications ? "Notifications on" : "Notifications off"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Compact only: the rail is hidden below `medium`, and this replaces it. */}
      <NavigationBar
        value={destination}
        onValueChange={setDestination}
        className="fixed inset-x-0 bottom-0 m3-medium:hidden"
      >
        {DESTINATIONS.map(({ value, label, icon: Glyph }) => (
          <NavigationBarItem
            key={value}
            value={value}
            label={label}
            icon={<Glyph />}
          />
        ))}
      </NavigationBar>

      <Toaster />
    </div>
  )
}
