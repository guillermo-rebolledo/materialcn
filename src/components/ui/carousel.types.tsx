import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselLayout,
} from "../../index"

const layouts: CarouselLayout[] = [
  "standard",
  "multi-browse",
  "hero",
  "uncontained",
  "full-screen",
]

function CarouselTypeChecks() {
  return (
    <>
      {/* @ts-expect-error Carousel requires an accessible name. */}
      <Carousel>
        <CarouselContent>
          <CarouselItem>Unlabeled carousel</CarouselItem>
        </CarouselContent>
      </Carousel>

      <h2 id="featured-carousel">Featured places</h2>
      <Carousel aria-labelledby="featured-carousel" layout="hero">
        <CarouselContent>
          <CarouselItem>Mexico City</CarouselItem>
          <CarouselItem>Oaxaca</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Carousel
        aria-label="Invalid carousel"
        // @ts-expect-error Carousel only accepts Material layout names.
        layout="stacked"
      >
        <CarouselContent />
      </Carousel>
    </>
  )
}

void layouts
void CarouselTypeChecks
