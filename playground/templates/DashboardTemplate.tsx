/**
 * Dashboard — cards on a grid, and the progress family at real sizes.
 *
 * There is no table or chart primitive in the library, so this deliberately
 * builds its "chart" out of tokens rather than pretending otherwise: bars are
 * `Progress`, the ring is `CircularProgress`, and the tabular data is a list.
 * If the library ever grows a data table, this is the screen that wants it.
 */
import { useState } from "react"
import {
  ArrowLeftIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  DownloadIcon,
  RefreshCwIcon,
  TrendingUpIcon,
} from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Icon } from "@/components/ui/icon"
import { Link } from "@/components/ui/link"
import {
  List,
  ListItem,
  ListItemContent,
  ListItemHeadline,
  ListItemLeading,
  ListItemOverline,
  ListItemSupportingText,
  ListItemTrailing,
} from "@/components/ui/list"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Paginator } from "@/components/ui/paginator"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from "@/components/ui/toast"
import {
  TopAppBar,
  TopAppBarActions,
  TopAppBarNavigation,
  TopAppBarTitle,
} from "@/components/ui/top-app-bar"

const METRICS = [
  { label: "Active users", value: "18,204", delta: 12.4, up: true },
  { label: "Sessions", value: "42,881", delta: 3.1, up: true },
  { label: "Error rate", value: "0.42%", delta: 0.8, up: false },
  { label: "p95 latency", value: "184 ms", delta: 5.6, up: false },
]

const CHANNELS = [
  { label: "Direct", share: 44 },
  { label: "Search", share: 31 },
  { label: "Referral", share: 16 },
  { label: "Social", share: 9 },
]

const RELEASES = [
  {
    version: "2.14.0",
    when: "2 hours ago",
    note: "Token generator now emits the surface ramp.",
    state: "Shipped",
  },
  {
    version: "2.13.2",
    when: "Yesterday",
    note: "Fixed the state layer crescent on bordered variants.",
    state: "Shipped",
  },
  {
    version: "2.13.1",
    when: "3 days ago",
    note: "Reverted the spatial spring on the press morph.",
    state: "Reverted",
  },
  {
    version: "2.13.0",
    when: "5 days ago",
    note: "Navigation rail expansion toggle.",
    state: "Shipped",
  },
]

export function DashboardTemplate() {
  const [range, setRange] = useState("7d")
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)

  return (
    <div className="bg-background text-foreground flex min-h-full flex-col">
      <TopAppBar>
        {/*
          The small app bar reserves a 56dp leading slot, so a bar without a
          navigation icon starts its title 4dp from the edge. This is that
          slot, not decoration.
        */}
        <TopAppBarNavigation>
          <Button variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeftIcon />
          </Button>
        </TopAppBarNavigation>
        <TopAppBarTitle>Overview</TopAppBarTitle>
        <TopAppBarActions>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Refresh"
            onClick={() => {
              setRefreshing(true)
              setTimeout(() => {
                setRefreshing(false)
                toast.add({ description: "Data refreshed", timeout: 4000 })
              }, 1400)
            }}
          >
            <RefreshCwIcon />
          </Button>
          <Button variant="tonal">
            <DownloadIcon />
            Export
          </Button>
        </TopAppBarActions>
      </TopAppBar>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-m3-xl p-m3-lg">
        <div className="flex flex-wrap items-center justify-between gap-m3-md">
          <Breadcrumbs
            items={[
              { label: "Workspace", href: "#" },
              { label: "Analytics", href: "#" },
              { label: "Overview" },
            ]}
          />
          <ButtonGroup aria-label="Date range" variant="connected">
            {["24h", "7d", "30d"].map((option) => (
              <Button
                key={option}
                variant={range === option ? "tonal" : "outline"}
                size="sm"
                aria-pressed={range === option}
                onClick={() => setRange(option)}
              >
                {option}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <Alert severity="info">
          <AlertTitle>Sampling is on</AlertTitle>
          <AlertDescription>
            Above 10 million events the figures are estimated from a 10%
            sample. <Link href="#">How sampling works</Link>.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="tonal">
              Use full data
            </Button>
          </AlertAction>
        </Alert>

        {/*
          Four tiles that stay four tiles: `auto-fit` would let one sit alone
          on a row at awkward widths, and a metric row reads as a set.
        */}
        <section
          aria-label="Key metrics"
          className="grid grid-cols-2 gap-m3-md m3-expanded:grid-cols-4"
        >
          {METRICS.map((metric) => (
            <Card key={metric.label} variant="filled">
              <CardContent className="flex flex-col gap-m3-sm py-m3-lg">
                <span className="text-m3-label-lg text-m3-on-surface-variant">
                  {metric.label}
                </span>
                <span className="text-m3-headline-md">
                  {refreshing ? (
                    <LoadingIndicator size="inline" aria-label="Loading" />
                  ) : (
                    metric.value
                  )}
                </span>
                <span
                  className={
                    metric.up
                      ? "flex items-center gap-m3-xs text-m3-label-md text-m3-primary"
                      : "flex items-center gap-m3-xs text-m3-label-md text-m3-error"
                  }
                >
                  <Icon size="xs">
                    {metric.up ? <ArrowUpRightIcon /> : <ArrowDownRightIcon />}
                  </Icon>
                  {metric.delta}% vs previous {range}
                </span>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid gap-m3-lg m3-expanded:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] m3-expanded:items-start">
          <Card>
            <CardHeader>
              <CardTitle>Traffic by channel</CardTitle>
              <CardDescription>
                Share of sessions over the last {range}.
              </CardDescription>
              <CardAction>
                <Chip variant="secondary" size="sm">
                  <TrendingUpIcon data-icon="inline-start" />
                  Up 4%
                </Chip>
              </CardAction>
            </CardHeader>
            <CardContent>
              {/*
                A bar chart made of determinate progress bars. Not a chart
                library — but the shape is right, and every colour comes from
                the same token layer as the rest of the page.
              */}
              <Tabs defaultValue="share">
                <TabsList variant="primary">
                  <TabsTrigger value="share">Share</TabsTrigger>
                  <TabsTrigger value="quality">Quality</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="share"
                  className="flex flex-col gap-m3-lg pt-m3-lg"
                >
                  {CHANNELS.map((channel) => (
                    <Progress key={channel.label} value={channel.share}>
                      <ProgressLabel>{channel.label}</ProgressLabel>
                      <ProgressValue />
                    </Progress>
                  ))}
                </TabsContent>
                <TabsContent
                  value="quality"
                  className="flex flex-col gap-m3-lg pt-m3-lg"
                >
                  {CHANNELS.map((channel, index) => (
                    <Progress
                      key={channel.label}
                      variant="wavy"
                      value={60 + index * 9}
                    >
                      <ProgressLabel>{channel.label} engagement</ProgressLabel>
                      <ProgressValue />
                    </Progress>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Error budget</CardTitle>
              <CardDescription>Resets on the 1st.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-m3-lg">
              <CircularProgress
                value={68}
                variant="wavy"
                thickness={8}
                aria-label="68 percent of the error budget remains"
              />
              <p className="text-m3-body-md text-m3-on-surface-variant text-center">
                68% remaining — about 21 minutes of downtime before the budget
                is spent.
              </p>
              <Separator />
              <div className="flex w-full items-center justify-between">
                <span className="text-m3-label-lg">Burn rate</span>
                <Chip variant="secondary" size="sm">
                  1.2×
                </Chip>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Releases</CardTitle>
            <CardDescription>
              The list stands in for a data table, which the library does not
              have yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-m3-md">
            <List aria-label="Releases">
              {RELEASES.map((release) => (
                <ListItem key={release.version} lines={3}>
                  <ListItemLeading>
                    <Icon size="md">
                      <TrendingUpIcon />
                    </Icon>
                  </ListItemLeading>
                  <ListItemContent>
                    <ListItemOverline>{release.when}</ListItemOverline>
                    <ListItemHeadline>v{release.version}</ListItemHeadline>
                    <ListItemSupportingText>
                      {release.note}
                    </ListItemSupportingText>
                  </ListItemContent>
                  <ListItemTrailing>
                    <Chip
                      size="sm"
                      variant={
                        release.state === "Shipped" ? "secondary" : "destructive"
                      }
                    >
                      {release.state}
                    </Chip>
                  </ListItemTrailing>
                </ListItem>
              ))}
            </List>
            <Paginator
              page={page}
              totalPages={7}
              onPageChange={setPage}
              className="justify-start"
            />
          </CardContent>
        </Card>
      </main>

      <Toaster />
    </div>
  )
}
