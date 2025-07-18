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
import { useMovieRecommendationStore } from "@/Stores/useMovieRecommendationStore";
import { MovieRecommendationType } from "@/Shared/Types/movie-api.types";
import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import { useTvshowRecommendationStore } from "@/Stores/useTvshowsRecommendationStore";
import { TvshowRecommendationType } from "@/Shared/Types/tvshows-api.types";

export default function HomeHero() {
  // union type for movie, tvshow, and anime
  type CombinedRecommendationType =
    | MovieRecommendationType
    | AnimeFullDetailsType
    | TvshowRecommendationType;

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

  // fetch tv show recommendations
  const tvshowRecommendation = useStore(
    useTvshowRecommendationStore,
    (state) => state.tvshowRecommendation
  );
  useEffect(() => {
    if (useTvshowRecommendationStore.getState().isTvshowRecommendationFetched)
      return;
    useTvshowRecommendationStore.getState().fetchTvshowRecommendation();
  }, []);

  // fetch movie recommendations
  const movieRecommendation = useStore(
    useMovieRecommendationStore,
    (state) => state.movieRecommendation
  );
  useEffect(() => {
    if (useMovieRecommendationStore.getState().isMovieRecommendationFetched)
      return;
    useMovieRecommendationStore.getState().fetchMovieRecommendation();
  }, []);

  // fetch anime recommendations
  const animeRecommendation = useStore(
    useAnimeRecommendationStore,
    (state) => state.fullAnimeDetails
  );
  useEffect(() => {
    if (useAnimeRecommendationStore.getState().isAnimeRecommendationFetched)
      return;
    useAnimeRecommendationStore.getState().fetchAnimeRecommendation();
  }, []);

  // combine movies, tvshows, and animes into a single array
  const combinedRecommendation: CombinedRecommendationType[] = useMemo(
    () => [
      ...movieRecommendation,
      ...animeRecommendation,
      ...tvshowRecommendation,
    ],
    [movieRecommendation, animeRecommendation, tvshowRecommendation]
  );

  const getImageUrl = (item: CombinedRecommendationType) => {
    if ("backdrop_path" in item) {
      return `https://image.tmdb.org/t/p/original${item.backdrop_path}`; // Movie
    } else if (item.images?.jpg?.image_url) {
      return item.images.jpg.image_url; // Anime
    } else {
      return "";
    }
  };

  // current recommendation
  const currentRecommendation: CombinedRecommendationType =
    combinedRecommendation[
      currentEmblaCard - 1 === -1 ? 0 : currentEmblaCard - 1
    ];
  return (
    <section className="text-foreground w-full h-fit relative">
      {/* bg */}
      <div className="absolute bg-muted top-0 left-0 w-full h-full">
        {currentRecommendation && (
          <>
            <Image
              src={getImageUrl(currentRecommendation)}
              alt={
                (
                  currentRecommendation as
                    | MovieRecommendationType
                    | AnimeFullDetailsType
                ).title ||
                (currentRecommendation as TvshowRecommendationType).name ||
                ""
              }
              fill
              placeholder="blur"
              className="object-cover"
              blurDataURL={getImageUrl(currentRecommendation)}
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
            {combinedRecommendation.map((rec, index) => (
              <CarouselItem key={index} className="pt-1">
                <Image
                  src={getImageUrl(rec)}
                  alt={
                    (rec as MovieRecommendationType | AnimeFullDetailsType)
                      .title ||
                    (rec as TvshowRecommendationType).name ||
                    ""
                  }
                  width={500}
                  height={500}
                  className="object-cover h-52 rounded-md border-2 border-ring"
                  blurDataURL={getImageUrl(rec)}
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
