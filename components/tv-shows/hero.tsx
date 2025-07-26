"use client";
import { useTrendingTvshows } from "@/Stores/Cache/useTrendingTvshows";
import Image from "next/image";
import React, { useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { DotButton, useDotButton } from "../sliders/EmblaCarouselDotButton";
import { cn } from "@/lib/utils";
import { RatingDisplay } from "@fluentui/react-rating";
export default function Hero() {
  // TODO: handle API call call here since API calls are not working properly with Promise.allSetteled()

  // conditional fetch for all neccessary apis
  Promise.allSettled([
    // !useTrendingTvshows.getState().isTrendingTvshowsFetched &&
    useTrendingTvshows.getState().fetchTrendingTvshows(),
  ]);

  const currentTrendingTvshow = useTrendingTvshows.getState().trendingTvshows;

  // carousel api
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  ////const [currentEmblaCard, setCurrentEmblaCard] = useState(0);

  //// useEffect(() => {
  ////   if (!emblaApi) {
  ////     return;
  ////   }
  ////   setCurrentEmblaCard(emblaApi.selectedScrollSnap() + 1);

  ////   emblaApi.on("select", () => {
  ////     setCurrentEmblaCard(emblaApi.selectedScrollSnap() + 1);
  ////   });
  //// }, [emblaApi]);
  //// handle carousel dots
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  //// console.log(useStore(useTrendingTvshows, (state) => state.trendingTvshows));
  return (
    <section className="relative w-full h-screen overflow-hidden text-foreground rounded-xl ">
      {/* carousel */}
      <div className="flex flex-col relative">
        {/* bg gradient */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t lg:from-5% from-background to-95% to-transparent z-10" />
        <Carousel
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setEmblaApi}
          orientation="horizontal"
          className="w-full h-fit"
        >
          <CarouselContent className="-mt-1 p-1 w-auto mx-auto h-fit">
            {/* carousel items  */}
            {currentTrendingTvshow.slice(0, 5).map((rec, index) => (
              <CarouselItem key={index} className="pt-1 h-auto relative">
                <Image
                  src={
                    `https://image.tmdb.org/t/p/original${rec.backdrop_path}` ||
                    ""
                  }
                  alt={rec.name || ""}
                  width={1000}
                  height={1000}
                  className=" w-full rounded-md "
                  blurDataURL={`https://image.tmdb.org/t/p/original${rec.backdrop_path}`}
                />

                {/* tv show details */}
                <div className="absolute gap-y-1 font-poppins text-shadow-lg/30 sm:gap-y-3 z-20 px-6 sm:px-0 sm:left-20 inset-0 shadow flex flex-col flex-center justify-center p-4">
                  <h1 className="text-lg sm:text-3xl lg:text-4xl  font-bold">
                    {rec.name}
                  </h1>
                  <p className="text-xs sm:text-sm italic line-clamp-2 xl:text-base max-w-xs">
                    {"Firstly Aired on: " + rec.first_air_date}
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
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* carousel prev and next buttons */}
          <CarouselPrevious className="absolute hidden sm:flex border-accent left-5 top-1/2 z-50" />
          <CarouselNext className="absolute border-accent hidden sm:flex right-5 top-1/2 z-50" />
        </Carousel>

        {/* carousel dots */}
        <div className="absolute z-10 sm:bottom-10 flex items-end justify-center size-full">
          <div className="flex gap-x-2 ">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={cn(
                  "border-accent border size-3 sm:size-4 rounded-full ",
                  {
                    "bg-accent size-3 sm:size-4 rounded-full":
                      index === selectedIndex,
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
