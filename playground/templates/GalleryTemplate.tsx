/**
 * Gallery — elevation and the surface ramp against real pictures.
 *
 * Cards on a plain background are easy; cards over imagery are where the
 * container ramp has to do its job. This is also the only template that
 * exercises the carousel layouts and the image aspect-ratio box, and the one
 * place a loading state is worth showing as skeletons rather than a spinner.
 */
import { useState } from "react"
import {
  ArrowLeftIcon,
  DownloadIcon,
  HeartIcon,
  ImageIcon,
  PlusIcon,
  Share2Icon,
  SlidersHorizontalIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AssistChip, Chip, FilterChip } from "@/components/ui/chip"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  FABMenu,
  FABMenuAction,
  FABMenuContent,
  FABMenuTrigger,
} from "@/components/ui/fab-menu"
import { Icon } from "@/components/ui/icon"
import { Image } from "@/components/ui/image"
import {
  RichTooltip,
  RichTooltipActions,
  RichTooltipContent,
  RichTooltipDescription,
  RichTooltipTitle,
  RichTooltipTrigger,
} from "@/components/ui/rich-tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHandle,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup } from "@/components/ui/toggle-group"
import {
  TopAppBar,
  TopAppBarActions,
  TopAppBarNavigation,
  TopAppBarTitle,
} from "@/components/ui/top-app-bar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster, toast } from "@/components/ui/toast"
import { gradient } from "./placeholders"

const FEATURED = [
  { title: "Oaxaca", caption: "Culture and cuisine" },
  { title: "Mérida", caption: "History and architecture" },
  { title: "Bacalar", caption: "Lagoon and nature" },
  { title: "Guanajuato", caption: "Colour and tunnels" },
]

const ALBUM = [
  { title: "Rooftops at dusk", tag: "recent" },
  { title: "Market, second aisle", tag: "recent" },
  { title: "The long staircase", tag: "favourites" },
  { title: "Blue hour, north pier", tag: "favourites" },
  { title: "Fog over the ridge", tag: "shared" },
  { title: "Two chairs", tag: "shared" },
  { title: "Tiled courtyard", tag: "recent" },
  { title: "Window seat", tag: "favourites" },
]

const TAGS = [
  { value: "recent", label: "Recent" },
  { value: "favourites", label: "Favourites" },
  { value: "shared", label: "Shared" },
]

export function GalleryTemplate() {
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [liked, setLiked] = useState<string[]>(["Two chairs"])
  const [columns, setColumns] = useState([4])

  const photos = ALBUM.filter(
    (photo) => tags.length === 0 || tags.includes(photo.tag),
  )

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
        <TopAppBarTitle>Library</TopAppBarTitle>
        <TopAppBarActions>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle loading state"
                  onClick={() => setLoading((value) => !value)}
                />
              }
            >
              <ImageIcon />
            </TooltipTrigger>
            <TooltipContent>Toggle loading state</TooltipContent>
          </Tooltip>

          {/* The view options are a bottom sheet rather than a menu: the
              column slider needs width a menu row does not have. */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="View options" />
              }
            >
              <SlidersHorizontalIcon />
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHandle />
              <SheetHeader>
                <SheetTitle>View options</SheetTitle>
                <SheetDescription>
                  Applies to this album only.
                </SheetDescription>
              </SheetHeader>
              <SheetBody className="flex flex-col gap-m3-lg">
                <div className="flex flex-col gap-m3-sm">
                  <span className="text-m3-title-sm">Columns</span>
                  <Slider
                    aria-label="Columns"
                    min={2}
                    max={6}
                    step={1}
                    showTicks
                    showValue
                    value={columns}
                    onValueChange={(next) =>
                      setColumns(Array.isArray(next) ? [...next] : [next])
                    }
                  />
                </div>
              </SheetBody>
              <SheetFooter>
                <SheetClose render={<Button>Done</Button>} />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </TopAppBarActions>
      </TopAppBar>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-m3-xl p-m3-lg pb-m3-4xl">
        <section className="flex flex-col gap-m3-md">
          <h2 id="gallery-featured" className="text-m3-headline-sm">
            Featured
          </h2>
          {/*
            `hero` puts one large slide beside a peek of the next, which is
            what makes a carousel read as a carousel without arrows on touch.
          */}
          <Carousel
            aria-labelledby="gallery-featured"
            layout="hero"
            /* The hero layout sizes its own slides, so on a wide window the
               track ends long before the viewport does and the controls
               would sit alone at the far edge. */
            className="max-w-2xl"
          >
            <CarouselContent>
              {FEATURED.map((place, index) => (
                <CarouselItem key={place.title} aria-label={place.title}>
                  <div className="relative h-full overflow-hidden rounded-m3-xl">
                    <Image
                      src={gradient(index)}
                      alt={`${place.title} — ${place.caption}`}
                      aspectRatio="4/3"
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-m3-xs bg-m3-scrim/45 p-m3-lg text-white">
                      <span className="text-m3-title-md">{place.title}</span>
                      <span className="text-m3-body-sm">{place.caption}</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section className="flex flex-col gap-m3-md">
          <div className="flex flex-wrap items-center justify-between gap-m3-md">
            <h2 className="text-m3-headline-sm">All photos</h2>
            <div className="flex items-center gap-m3-sm">
              <Chip variant="outline" size="sm">
                {photos.length} items
              </Chip>
              <RichTooltip>
                <RichTooltipTrigger
                  render={<Button variant="ghost" size="sm">About albums</Button>}
                />
                <RichTooltipContent>
                  <RichTooltipTitle>Albums</RichTooltipTitle>
                  <RichTooltipDescription>
                    Photos can belong to more than one album. Removing one from
                    an album does not delete it.
                  </RichTooltipDescription>
                  <RichTooltipActions>
                    <Button variant="ghost" size="sm">
                      Learn more
                    </Button>
                  </RichTooltipActions>
                </RichTooltipContent>
              </RichTooltip>
            </div>
          </div>

          <ToggleGroup
            aria-label="Filter photos"
            multiple
            value={tags}
            onValueChange={setTags}
          >
            {TAGS.map((tag) => (
              <FilterChip key={tag.value} value={tag.value}>
                {tag.label}
              </FilterChip>
            ))}
          </ToggleGroup>

          {loading ? (
            <div
              aria-busy
              aria-label="Loading photos"
              className="grid grid-cols-2 gap-m3-md sm:grid-cols-3 m3-expanded:grid-cols-4"
            >
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="flex flex-col gap-m3-sm">
                  <Skeleton shape="large" className="aspect-square w-full" />
                  <Skeleton text="body-sm" className="w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="grid gap-m3-md"
              // The column count is a runtime choice from the sheet, so it
              // cannot be a Tailwind class — Tailwind only emits what it can
              // read in the source.
              style={{
                gridTemplateColumns: `repeat(${columns[0]}, minmax(0, 1fr))`,
              }}
            >
              {photos.map((photo, index) => (
                <Card key={photo.title} variant="filled" className="overflow-hidden">
                  <Image
                    src={gradient(index + 2)}
                    alt={photo.title}
                    aspectRatio="1/1"
                    className="w-full object-cover"
                  />
                  <CardContent className="flex items-center justify-between gap-m3-sm py-m3-md">
                    <span className="truncate text-m3-body-md">
                      {photo.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={
                        liked.includes(photo.title)
                          ? `Unlike ${photo.title}`
                          : `Like ${photo.title}`
                      }
                      aria-pressed={liked.includes(photo.title)}
                      onClick={() =>
                        setLiked((current) =>
                          current.includes(photo.title)
                            ? current.filter((title) => title !== photo.title)
                            : [...current, photo.title],
                        )
                      }
                    >
                      <Icon
                        size="sm"
                        className={
                          liked.includes(photo.title)
                            ? "text-m3-error"
                            : undefined
                        }
                      >
                        <HeartIcon />
                      </Icon>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {photos.length === 0 && !loading ? (
            <div className="flex flex-col items-center gap-m3-md py-m3-4xl">
              <Icon size="xl">
                <ImageIcon />
              </Icon>
              <p className="text-m3-title-md">No photos with those tags</p>
              <AssistChip onClick={() => setTags([])}>
                Clear filters
              </AssistChip>
            </div>
          ) : null}
        </section>
      </main>

      {/* The FAB menu sits above the content rather than in a bar, which is
          the pattern Material uses when the screen has no bottom bar. */}
      <div className="fixed right-m3-lg bottom-m3-lg">
        <FABMenu placement="top-end">
          <FABMenuTrigger aria-label="Add to library">
            <PlusIcon />
          </FABMenuTrigger>
          <FABMenuContent>
            <FABMenuAction
              label="Upload"
              onClick={() =>
                toast.add({ description: "Upload started", timeout: 4000 })
              }
            >
              <DownloadIcon />
            </FABMenuAction>
            <FABMenuAction
              label="Share album"
              onClick={() =>
                toast.add({ description: "Share link copied", timeout: 4000 })
              }
            >
              <Share2Icon />
            </FABMenuAction>
          </FABMenuContent>
        </FABMenu>
      </div>

      <Toaster />
    </div>
  )
}
