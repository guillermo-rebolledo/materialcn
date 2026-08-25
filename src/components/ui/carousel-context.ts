import { createContext, useContext } from "react"
import type { UseEmblaCarouselType } from "embla-carousel-react"

type CarouselApi = UseEmblaCarouselType[1]

type CarouselContextValue = {
  api: CarouselApi
  canScrollNext: boolean
  canScrollPrevious: boolean
  carouselRef: UseEmblaCarouselType[0]
  scrollNext: () => void
  scrollPrevious: () => void
  selectedIndex: number
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

export { CarouselContext, useCarousel }
export type { CarouselApi, CarouselContextValue }
