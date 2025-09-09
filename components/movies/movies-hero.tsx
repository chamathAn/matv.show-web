"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useStore } from "zustand";
import { useTrendingMovies } from "@/Stores/Cache/useTrendingMovies";
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

export default function MoviesHero() {
  const [isImageLoaded, setImageLoaded] = useState(false);

  // ! trending movies store data
  const trendingMovies = useStore(
    useTrendingMovies,
    (state) => state.trendingMovies
  );
  const isFetched = useStore(
    useTrendingMovies,
    (state) => state.isTrendingMoviesFetched
  );
  const fetchTrendingMovies = useTrendingMovies.getState().fetchTrendingMovies;

  // ! fetch trending movies if not already fetched
  useEffect(() => {
    if (!isFetched) {
      fetchTrendingMovies();
    }
  }, [isFetched, fetchTrendingMovies]);

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
            {trendingMovies.slice(0, 5).map((rec, index) => (
              <CarouselItem key={index} className="pt-1 h-fit relative">
                <Image
                  onLoad={() => setImageLoaded(true)}
                  src={`https://image.tmdb.org/t/p/original${rec.backdrop_path}`}
                  alt={rec.title || ""}
                  width={1000}
                  height={1000}
                  className="w-full rounded-md"
                  blurDataURL={`https://image.tmdb.org/t/p/original${rec.backdrop_path}`}
                  placeholder="blur"
                />

                {/* tv show details */}
                {isImageLoaded && (
                  <div className="absolute gap-y-1 font-poppins text-shadow-lg/30 sm:gap-y-3 z-20 px-6 sm:px-0 sm:left-20 inset-0 shadow flex flex-col flex-center justify-center p-4">
                    <h1 className="text-lg sm:text-3xl lg:text-4xl font-bold">
                      {rec.title}
                    </h1>
                    <p className="text-xs sm:text-sm italic line-clamp-2 xl:text-base max-w-xs">
                      {"Released on: " + rec.release_date}
                    </p>
                    <p className="text-xs sm:text-sm line-clamp-3 xl:line-clamp-6 xl:text-base max-w-xs">
                      {rec.overview}
                    </p>
                    <div className="flex gap-1 text-sm sm:text-base italic">
                      <span className="text-nowrap">Score :</span>
                      <RatingDisplay
                        compact
                        value={rec.vote_average}
                        size="medium"
                      />
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
