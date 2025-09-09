"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useStore } from "zustand";
import { useTrendingAnimes } from "@/Stores/Cache/useTrendingAnime";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { DotButton, useDotButton } from "../sliders/EmblaCarouselDotButton";
import { cn } from "@/lib/utils";
import { RatingDisplay } from "@fluentui/react-rating";

export default function AnimeHero() {
  const [isImageLoaded, setImageLoaded] = useState(false);

  // ! trending animes store data
  const trendingAnimes = useStore(
    useTrendingAnimes,
    (state) => state.trendingAnimes
  );
  const isFetched = useStore(
    useTrendingAnimes,
    (state) => state.isTrendingAnimesFetched
  );
  const fetchtrendingAnimes = useTrendingAnimes.getState().fetchTrendingAnimes;

  // ! fetch trending animes if not already fetched
  useEffect(() => {
    if (!isFetched) {
      fetchtrendingAnimes();
    }
  }, [isFetched, fetchtrendingAnimes]);

  // carousel api
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  // handle carousel dots
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className="relative w-full overflow-hidden text-foreground">
      <div className="flex flex-col relative">
        {/* bg gradient */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t lg:from-5% from-background to-95% to-transparent z-10" />

        {/* carousel */}
        <Carousel
          plugins={[Autoplay({ delay: 5000 })]}
          opts={{ align: "start", loop: true }}
          setApi={setEmblaApi}
          orientation="horizontal"
          className="w-full h-fit"
        >
          <CarouselContent className="-mt-1 p-1 w-full mx-auto h-fit">
            {/* carousel items */}
            {trendingAnimes.slice(0, 5).map((rec, index) => (
              <CarouselItem key={index} className="pt-1 h-fit relative">
                <Image
                  onLoad={() => setImageLoaded(true)}
                  src={rec.images.jpg.image_url}
                  alt={rec.title || ""}
                  width={1000}
                  height={1000}
                  className="w-full h-[80vh] object-cover rounded-md"
                />

                {/* anime details */}
                {isImageLoaded && (
                  <div className="absolute gap-y-1 font-poppins text-shadow-lg/30 sm:gap-y-3 z-20 px-6 sm:px-0 sm:left-20 inset-0 shadow flex flex-col flex-center justify-center p-4">
                    <h1 className="text-lg sm:text-3xl lg:text-4xl font-bold">
                      {rec.title_english || rec.title}
                    </h1>
                    <p className="text-xs sm:text-sm italic line-clamp-2 xl:text-base max-w-xs">
                      {"Aired on: " + rec.year}
                    </p>
                    <p className="text-xs sm:text-sm line-clamp-3 xl:line-clamp-6 xl:text-base max-w-xs">
                      {rec.background}
                    </p>
                    <div className="flex gap-1 text-sm sm:text-base italic">
                      <span className="text-nowrap">Score :</span>
                      <RatingDisplay compact value={rec.score} size="medium" />
                    </div>
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* carousel navigation buttons */}
          <CarouselPrevious className="absolute hidden sm:flex border-accent left-5 top-1/2 z-50" />
          <CarouselNext className="absolute border-accent hidden sm:flex right-5 top-1/2 z-50" />
        </Carousel>

        {/* carousel dots */}
        <div className="absolute z-10 sm:bottom-10 lg:bottom-30 flex items-end justify-center size-full">
          <div className="flex gap-x-2">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={cn(
                  "border-accent border size-3 sm:size-4 rounded-full",
                  {
                    "bg-accent": index === selectedIndex,
                  }
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
