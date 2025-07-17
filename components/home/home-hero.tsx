"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import {
  DotButton,
  useDotButton,
} from "@/components/sliders/EmblaCarouselDotButton";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useAnimeRecommendationStore } from "@/Stores/useAnimeRecommendationStore";
import { useStore } from "zustand";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomeHero() {
  // carousel api
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  const [currentEmblaCard, setCurrentEmblaCard] = useState(0);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    setCurrentEmblaCard(emblaApi.selectedScrollSnap() + 1);

    emblaApi.on("select", () => {
      setCurrentEmblaCard(emblaApi.selectedScrollSnap() + 1);
    });
  }, [emblaApi]);

  // handle carousel dots
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  // fetch movie recommendations
  // const movieRes = useAPI(
  //   "https://api.themoviedb.org/3/movie/597/recommendations",
  //   {
  //     method: "GET",
  //     headers: {
  //       accept: "application/json",
  //       Authorization:
  //         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNjVjNjIyMGYzYWZmMDQxMjFiMmY3ZmQwNzhhZjViOSIsIm5iZiI6MTc1MjY1MzUxOC4yODksInN1YiI6IjY4Nzc1ZWNlODYxN2IzNzI3ZTQzZDNkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.K-AlBuMwacj8nVaXlphgmVsChqt_s99eR0TO7fBqEOI",
  //     },
  //   }
  // );

  // fetch anime recommendations
  const animeRecommendation = useStore(
    useAnimeRecommendationStore,
    (state) => state.animeRecommendation
  );
  useEffect(() => {
    if (useAnimeRecommendationStore.getState().isAnimeRecommendationFetched)
      return;
    useAnimeRecommendationStore.getState().fetchAnimeRecommendation();
  }, []);

  // fitering the animes
  const filteredAnimes = useMemo(() => {
    return [...animeRecommendation.slice(0, 5)];
  }, [animeRecommendation]);
  return (
    <section className="text-foreground w-full h-fit relative">
      {/* bg */}
      <div className="absolute bg-muted top-0 left-0 w-full h-full">
        {filteredAnimes.length > 0 && (
          <>
            <Image
              src={
                filteredAnimes[
                  currentEmblaCard - 1 === -1 ? 0 : currentEmblaCard - 1
                ].entry.images.jpg.image_url
              }
              alt={
                filteredAnimes[
                  currentEmblaCard - 1 === -1 ? 0 : currentEmblaCard - 1
                ].entry.title
              }
              fill
              placeholder="blur"
              className=" object-cover rounded-md border-2 border-ring"
              blurDataURL={
                filteredAnimes[
                  currentEmblaCard - 1 === -1 ? 0 : currentEmblaCard - 1
                ].entry.images.jpg.image_url
              }
            />
            <div className="bg-background/80 absolute inset-0 w-full h-full backdrop-blur-2xl" />
          </>
        )}
        <span className="text-3xl font-semibold z-20 relative">
          {currentEmblaCard}
        </span>
      </div>

      {/* content */}
      <div className="flex flex-col gap-2 items-end justify-center min-h-screen z-10 relative">
        {/* carousel */}
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setEmblaApi}
          orientation="vertical"
          className="w-full max-w-xs"
        >
          <CarouselContent className="-mt-1 h-[14rem] p-0.5">
            {filteredAnimes.map((anime, index) => (
              <CarouselItem key={index} className="pt-1">
                <Image
                  src={anime.entry.images.jpg.image_url}
                  alt={anime.entry.title}
                  width={500}
                  height={500}
                  className=" object-cover h-52 rounded-md border-2 border-ring"
                  blurDataURL={anime.entry.images.jpg.image_url}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* carousel dots */}
        <div className="flex gap-x-2 ">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                "border-foreground/15 border size-3 rounded-full ",
                {
                  "bg-accent size-3 rounded-full": index === selectedIndex,
                }
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
