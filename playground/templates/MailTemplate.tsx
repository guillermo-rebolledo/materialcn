/**
 * Mail — the adaptive three-pane layout.
 *
 * The canonical Material case: a rail that changes shape across the size
 * classes, a selectable list, and a reading pane that only exists once there
 * is room for it. Selecting rows swaps the app bar for a contextual toolbar,
 * which is where the surface ramp and the overlay order have to agree.
 */
import { useEffect, useState } from "react"
import {
  ArchiveIcon,
  BellIcon,
  InboxIcon,
  MailPlusIcon,
  MenuIcon,
  MoreVerticalIcon,
  ReplyIcon,
  SearchIcon,
  SendIcon,
  StarIcon,
  Trash2Icon,
  UsersIcon,
  XIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterChip } from "@/components/ui/chip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ExtendedFAB, FAB } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import {
  List,
  ListItem,
  ListItemContent,
  ListItemHeadline,
  ListItemLeading,
  ListItemSupportingText,
  ListItemTrailing,
  ListSection,
  ListSubheader,
} from "@/components/ui/list"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import {
  NavigationRail,
  NavigationRailDestinations,
  NavigationRailFAB,
  NavigationRailItem,
  NavigationRailNotifications,
} from "@/components/ui/navigation-rail"
import {
  NotificationBadge,
  NotificationBadgeAnchor,
} from "@/components/ui/notification-badge"
import {
  SearchBar,
  SearchBarClear,
  SearchBarInput,
  SearchBarLeading,
  SearchBarTrailing,
} from "@/components/ui/search-bar"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup } from "@/components/ui/toggle-group"
import {
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarLabel,
} from "@/components/ui/toolbar"
import {
  TopAppBar,
  TopAppBarActions,
  TopAppBarNavigation,
  TopAppBarOverflow,
  TopAppBarTitle,
} from "@/components/ui/top-app-bar"
import { Toaster, toast } from "@/components/ui/toast"

const MAILBOXES: {
  value: string
  label: string
  icon: typeof InboxIcon
  unread?: number
}[] = [
  { value: "inbox", label: "Inbox", icon: InboxIcon, unread: 12 },
  { value: "starred", label: "Starred", icon: StarIcon },
  { value: "sent", label: "Sent", icon: SendIcon },
  { value: "groups", label: "Groups", icon: UsersIcon, unread: 3 },
]

const THREADS = [
  {
    id: "t1",
    from: "Ada Lovelace",
    initials: "AL",
    subject: "Analytical engine spec, second pass",
    preview:
      "The card ordering is settled. Two notes on the mill before we send it to print — the second one changes the carry.",
    time: "09:41",
    unread: true,
    starred: true,
    label: "unread",
  },
  {
    id: "t2",
    from: "Grace Hopper",
    initials: "GH",
    subject: "Compiler timings for the Friday build",
    preview:
      "Down to eleven minutes. The bottleneck moved to the linker, which nobody expected.",
    time: "08:02",
    unread: true,
    starred: false,
    label: "unread",
  },
  {
    id: "t3",
    from: "Katherine Johnson",
    initials: "KJ",
    subject: "Re: trajectory review",
    preview: "Checked the figures by hand. They agree to four decimals.",
    time: "Yesterday",
    unread: false,
    starred: true,
    label: "starred",
  },
  {
    id: "t4",
    from: "Radia Perlman",
    initials: "RP",
    subject: "Spanning tree, revised",
    preview: "The loop was in the bridge table, not the protocol.",
    time: "Yesterday",
    unread: false,
    starred: false,
    label: "read",
  },
  {
    id: "t5",
    from: "Margaret Hamilton",
    initials: "MH",
    subject: "Priority display, error 1202",
    preview:
      "The scheduler shed the low-priority jobs exactly as designed. Attaching the trace.",
    time: "Mon",
    unread: false,
    starred: false,
    label: "read",
  },
]

const FILTERS = [
  { value: "unread", label: "Unread" },
  { value: "starred", label: "Starred" },
  { value: "attachments", label: "Attachments" },
] as const

/**
 * The rail starts expanded where there is room for it and collapsed where
 * there is not, then stops following the window once the reader has an opinion.
 * A control that silently undoes what someone just pressed is worse than one
 * that never adapts at all.
 */
function useRailExpansion() {
  const query = "(min-width: 1200px)"
  const [expanded, setExpanded] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  )
  const [manual, setManual] = useState(false)

  useEffect(() => {
    if (manual) return
    const media = window.matchMedia(query)
    const onChange = () => setExpanded(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [manual])

  return {
    expanded,
    toggle: () => {
      setManual(true)
      setExpanded((value) => !value)
    },
  }
}

export function MailTemplate() {
  const { expanded, toggle: toggleRail } = useRailExpansion()
  const [mailbox, setMailbox] = useState<string>("inbox")
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [reading, setReading] = useState(THREADS[0].id)
  const [starred, setStarred] = useState<string[]>(
    THREADS.filter((thread) => thread.starred).map((thread) => thread.id),
  )

  const threads = THREADS.filter((thread) => {
    const matchesQuery = `${thread.from} ${thread.subject}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesFilter =
      filters.length === 0 ||
      filters.some((filter) => {
        if (filter === "starred") return starred.includes(thread.id)
        if (filter === "unread") return thread.unread
        return false
      })
    return matchesQuery && matchesFilter
  })

  const open = THREADS.find((thread) => thread.id === reading)!
  const selecting = selected.length > 0

  function toggleStar(id: string) {
    setStarred((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    )
  }

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    )
  }

  const destinations = MAILBOXES.map(({ value, label, icon: Glyph, unread }) => ({
    value,
    label,
    icon: <Glyph />,
    badge: unread ? (
      <NotificationBadge aria-label={`${unread} unread`} value={unread} />
    ) : undefined,
  }))

  return (
    <div className="bg-background text-foreground flex min-h-full flex-col">
      <div className="flex flex-1 flex-col m3-medium:flex-row">
        {/*
          One rail, not two. This was a collapsed copy and an expanded copy
          swapped by a media query, which made the expansion state a breakpoint
          rather than a control — and left the hamburger beside the title with
          nothing to toggle.

          Compact still drops the rail entirely for the bottom bar, which is
          what Material's size classes are for.
        */}
        <NavigationRail
          value={mailbox}
          onValueChange={setMailbox}
          expanded={expanded}
          onExpandedChange={toggleRail}
          className="max-m3-medium:hidden"
        >
          <NavigationRailFAB>
            {expanded ? (
              <ExtendedFAB label="Compose" color="tertiary">
                <MailPlusIcon />
              </ExtendedFAB>
            ) : (
              <FAB aria-label="Compose" color="tertiary">
                <MailPlusIcon />
              </FAB>
            )}
          </NavigationRailFAB>
          <NavigationRailDestinations>
            {destinations.map(({ badge, ...destination }) => (
              <NavigationRailItem
                key={destination.value}
                {...destination}
                /*
                  The expanded rail drops the unread badges.
                  `NavigationBarItem` pins the badge at `left-4` on a 24dp
                  icon, which is right for the stacked layout and lands on the
                  first letter of the label in the `row` layout the expanded
                  rail uses. Worth a library fix; not worth a broken-looking
                  demo in the meantime.
                */
                badge={expanded ? undefined : badge}
              />
            ))}
          </NavigationRailDestinations>
          <NavigationRailNotifications>
            <NotificationBadgeAnchor>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <BellIcon />
              </Button>
              <NotificationBadge />
            </NotificationBadgeAnchor>
          </NavigationRailNotifications>
        </NavigationRail>

        <div className="flex min-w-0 flex-1 flex-col">
          {/*
            Selection replaces the app bar rather than adding to it. Two bars
            stacked would push the list down by 64dp the moment a checkbox is
            ticked, which reads as the page jumping.
          */}
          {selecting ? (
            <Toolbar
              aria-label="Selection actions"
              color="vibrant"
              className="m-m3-lg"
            >
              <ToolbarGroup>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Clear selection"
                  onClick={() => setSelected([])}
                >
                  <XIcon />
                </Button>
              </ToolbarGroup>
              <ToolbarLabel>{selected.length} selected</ToolbarLabel>
              <ToolbarDivider />
              <ToolbarGroup>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Archive selected"
                  onClick={() => {
                    toast.add({
                      description: `${selected.length} archived`,
                      timeout: 4000,
                      actionProps: { children: "Undo" },
                    })
                    setSelected([])
                  }}
                >
                  <ArchiveIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete selected"
                  onClick={() => {
                    toast.add({
                      description: `${selected.length} deleted`,
                      timeout: 4000,
                    })
                    setSelected([])
                  }}
                >
                  <Trash2Icon />
                </Button>
              </ToolbarGroup>
            </Toolbar>
          ) : (
            <TopAppBar>
              {/*
                The slot stays so the title keeps its 56dp inset, but the
                button only appears where there is a rail for it to act on.
                Compact navigates with the bottom bar.
              */}
              <TopAppBarNavigation>
                <Button
                  variant="ghost"
                  size="icon"
                  className="max-m3-medium:hidden"
                  aria-expanded={expanded}
                  aria-label={
                    expanded ? "Collapse navigation" : "Expand navigation"
                  }
                  onClick={toggleRail}
                >
                  <MenuIcon />
                </Button>
              </TopAppBarNavigation>
              <TopAppBarTitle>
                {MAILBOXES.find((box) => box.value === mailbox)?.label}
              </TopAppBarTitle>
              <TopAppBarActions>
                <Avatar size="sm">
                  <AvatarFallback>GO</AvatarFallback>
                </Avatar>
                <TopAppBarOverflow>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="More actions"
                        />
                      }
                    >
                      <MoreVerticalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Mark all read</DropdownMenuItem>
                      <DropdownMenuItem>Manage labels</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TopAppBarOverflow>
              </TopAppBarActions>
            </TopAppBar>
          )}

          {/*
            The reading pane is a peer of the list only from `expanded` up.
            Below that the list is the whole screen — Material's list-detail
            pattern shows one or the other, never a squeezed pair.
          */}
          <div className="grid min-h-0 min-w-0 flex-1 gap-m3-lg p-m3-lg pb-m3-4xl m3-medium:pb-m3-lg m3-expanded:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="flex min-w-0 flex-col gap-m3-md">
              <SearchBar value={query} onValueChange={setQuery}>
                <SearchBarLeading>
                  <Icon size="md">
                    <SearchIcon />
                  </Icon>
                </SearchBarLeading>
                <SearchBarInput
                  aria-label="Search mail"
                  placeholder="Search mail"
                />
                <SearchBarTrailing>
                  <SearchBarClear />
                </SearchBarTrailing>
              </SearchBar>

              <ToggleGroup
                aria-label="Filter threads"
                multiple
                value={filters}
                onValueChange={setFilters}
              >
                {FILTERS.map((filter) => (
                  <FilterChip key={filter.value} value={filter.value}>
                    {filter.label}
                  </FilterChip>
                ))}
              </ToggleGroup>

              {threads.length === 0 ? (
                <p className="text-m3-body-md text-m3-on-surface-variant py-m3-3xl text-center">
                  Nothing matches those filters.
                </p>
              ) : (
                <List aria-label="Threads">
                  <ListSection aria-labelledby="mail-today">
                    <ListSubheader id="mail-today">This week</ListSubheader>
                    {threads.map((thread) => (
                      <ListItem
                        key={thread.id}
                        lines={3}
                        data-active={thread.id === reading || undefined}
                        className="rounded-m3-lg data-active:bg-m3-secondary-container data-active:text-m3-on-secondary-container"
                      >
                        {/*
                          `variant="avatar"` is a fixed 40dp box — right for an
                          avatar alone, too small for a checkbox beside one.
                          `control` sizes to its contents instead.
                        */}
                        <ListItemLeading
                          variant="control"
                          className="gap-m3-md"
                        >
                          <Checkbox
                            aria-label={`Select ${thread.subject}`}
                            checked={selected.includes(thread.id)}
                            onCheckedChange={() => toggle(thread.id)}
                          />
                          <Avatar size="sm">
                            <AvatarFallback>{thread.initials}</AvatarFallback>
                          </Avatar>
                        </ListItemLeading>
                        {/*
                          The row is not itself a button: it already holds a
                          checkbox, and an interactive control inside a button
                          is neither valid HTML nor reachable by keyboard. Only
                          the text opens the thread.
                        */}
                        <ListItemContent>
                          <button
                            type="button"
                            className="flex min-w-0 cursor-pointer flex-col items-start gap-m3-xs text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-m3-secondary"
                            onClick={() => setReading(thread.id)}
                          >
                            <ListItemHeadline
                              className={thread.unread ? "font-m3-emphasized" : undefined}
                            >
                              {thread.from}
                            </ListItemHeadline>
                            <ListItemSupportingText>
                              {thread.subject} — {thread.preview}
                            </ListItemSupportingText>
                          </button>
                        </ListItemContent>
                        {/*
                          A fixed-width timestamp, and a star that is always
                          rendered. The star used to exist only when set, so
                          every starred row pushed its own timestamp left and
                          the column zig-zagged down the list.
                        */}
                        <ListItemTrailing className="gap-m3-xs">
                          <span className="w-16 shrink-0 text-right text-m3-label-sm text-m3-on-surface-variant tabular-nums">
                            {thread.time}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-pressed={starred.includes(thread.id)}
                            aria-label={
                              starred.includes(thread.id)
                                ? `Unstar ${thread.subject}`
                                : `Star ${thread.subject}`
                            }
                            onClick={() => toggleStar(thread.id)}
                          >
                            {/*
                              The fill goes on the glyph, not the wrapper —
                              `Icon` renders a span around the svg, and
                              `fill-current` on that paints nothing.
                            */}
                            <Icon
                              size="sm"
                              className={
                                starred.includes(thread.id)
                                  ? "text-m3-primary [&>svg]:fill-current"
                                  : "text-m3-on-surface-variant"
                              }
                            >
                              <StarIcon />
                            </Icon>
                          </Button>
                        </ListItemTrailing>
                      </ListItem>
                    ))}
                  </ListSection>
                </List>
              )}
            </div>

            <article className="hidden min-w-0 flex-col gap-m3-lg rounded-m3-xl bg-m3-surface-container-low p-m3-xl m3-expanded:flex">
              <header className="flex flex-col gap-m3-sm">
                <h2 className="text-m3-headline-sm">{open.subject}</h2>
                <div className="flex items-center gap-m3-md">
                  <Avatar>
                    <AvatarFallback>{open.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-m3-title-sm">{open.from}</span>
                    <span className="text-m3-body-sm text-m3-on-surface-variant">
                      to me — {open.time}
                    </span>
                  </div>
                </div>
              </header>
              <Separator />
              <div className="flex flex-col gap-m3-md text-m3-body-lg">
                <p>{open.preview}</p>
                <p>
                  Everything above the fold is settled. The remaining question
                  is whether the change lands this week or waits for the next
                  cut, and that is a scheduling call rather than a technical
                  one.
                </p>
                <p className="text-m3-on-surface-variant">— {open.from}</p>
              </div>
              <footer className="flex flex-wrap gap-m3-sm">
                <Button variant="tonal">
                  <ReplyIcon />
                  Reply
                </Button>
                <Button variant="outline">Forward</Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    toast.add({ description: "Thread archived", timeout: 4000 })
                  }
                >
                  Archive
                </Button>
              </footer>
            </article>
          </div>
        </div>
      </div>

      <NavigationBar
        value={mailbox}
        onValueChange={setMailbox}
        className="fixed inset-x-0 bottom-0 m3-medium:hidden"
      >
        {destinations.map((destination) => (
          <NavigationBarItem key={destination.value} {...destination} />
        ))}
      </NavigationBar>

      <Toaster />
    </div>
  )
}
