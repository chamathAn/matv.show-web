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
import { useMediaQuery } from "react-responsive";
import { Button } from "../ui/button";
import { RatingDisplay } from "@fluentui/react-rating";
export default function HomeHero() {
  // union type for movie, tvshow, and anime
  type CombinedRecommendationType =
    | MovieRecommendationType
    | AnimeFullDetailsType
    | TvshowRecommendationType;

  // check if device is md size
  const isMdSize = useMediaQuery({ query: "(max-width: 768px)" });

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
    <section className="text-foreground w-full h-fit relative rounded-b-xl border border-muted overflow-hidden">
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
      </div>

      {/* content */}
      <div className="flex flex-col gap-10 items-center min-h-[600px] z-10 relative pt-10">
        <div className="flex flex-col items-center gap-5">
          {/* title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-nebular text-foreground text-nowrap px-6">
            MATV SHOW
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium  text-center font-poppins max-w-5xl px-6">
            {
              "Uncover hand-picked anime, movies and tv shows you'll love. Our smart recommendation engine scans your taste and delivers top picks, no fluff, no ads, just binge-worthy suggestions. Ready to explore?"
            }
          </p>
          <Button className="font-poppins font-medium">Explore More</Button>
        </div>

        {/* hero bottom section */}
        <div
          className="md:bg-background flex-1 w-full flex flex-col items-center md:items-end justify-center gap-2 px-6 py-10"
          style={{
            clipPath: isMdSize
              ? ""
              : "polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        >
          {/* recommerndation title,catergory, and rating */}
          <div className="flex xl:flex-row flex-col-reverse gap-5 md:w-1/2 justify-between">
            <div className="flex flex-col gap-y-3 justify-start text-foreground font-poppins font-medium text-xs sm:text-sm xl:text-base">
              {currentRecommendation && (
                <>
                  <div className=" flex gap-1">
                    <span className="text-nowrap">Name :</span>
                    <h3 className="line-clamp-1">
                      {(
                        currentRecommendation as
                          | MovieRecommendationType
                          | AnimeFullDetailsType
                      ).title ||
                        (currentRecommendation as TvshowRecommendationType)
                          .name ||
                        ""}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-nowrap">Catergory :</span>
                    <span className="line-clamp-1">
                      {(
                        currentRecommendation as
                          | MovieRecommendationType
                          | TvshowRecommendationType
                      ).media_type || "anime"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-nowrap">Score :</span>
                    <RatingDisplay
                      compact
                      value={
                        (
                          currentRecommendation as
                            | MovieRecommendationType
                            | TvshowRecommendationType
                        ).vote_average ||
                        (currentRecommendation as AnimeFullDetailsType).score ||
                        0
                      }
                      size="medium"
                    />
                  </div>
                  <span className="text-foreground text-nowrap line-clamp-1">
                    {"vote_count" in currentRecommendation
                      ? currentRecommendation.vote_count.toLocaleString() +
                        " ratings"
                      : (
                          currentRecommendation as AnimeFullDetailsType
                        ).scored_by.toLocaleString() + " ratings"}
                  </span>
                </>
              )}
            </div>
            {/* carousel */}
            <div className="flex flex-col gap-y-2 items-start xl:items-end">
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
                          (
                            rec as
                              | MovieRecommendationType
                              | AnimeFullDetailsType
                          ).title ||
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
              <div className="flex gap-x-2">
                {scrollSnaps.map((_, index) => (
                  <DotButton
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    className={cn("border-muted border size-3 rounded-full ", {
                      "bg-accent size-3 rounded-full": index === selectedIndex,
                    })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
