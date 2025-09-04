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
import { useAnimeRecommendationStore } from "@/Stores/Stale/Recommendation/useAnimeRecommendationStore";
import { useStore } from "zustand";
import Image from "next/image";
import { useMovieRecommendationStore } from "@/Stores/Stale/Recommendation/useMovieRecommendationStore";
import { MovieRecommendationType } from "@/Shared/Types/movie-api.types";
import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import { useTvshowRecommendationStore } from "@/Stores/Stale/Recommendation/useTvshowsRecommendationStore";
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
    <section className="relative w-full overflow-hidden border text-foreground h-fit rounded-b-xl border-muted">
      {/* bg */}
      <div className="absolute top-0 left-0 w-full h-full bg-muted">
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
            <div className="absolute inset-0 w-full h-full bg-background/80 backdrop-blur-2xl" />
          </>
        )}
      </div>

      {/* content */}
      <div className="flex flex-col gap-10 items-center min-h-[600px] z-10 relative pt-10">
        <div className="flex flex-col items-center gap-5">
          {/* title */}
          <h1 className="px-6 text-4xl font-bold sm:text-5xl lg:text-7xl font-nebular text-foreground text-nowrap">
            MATV SHOW
          </h1>
          <p className="max-w-5xl px-6 text-xs font-medium text-center text-muted-foreground sm:text-sm font-poppins">
            {
              "Uncover hand-picked anime, movies and tv shows you'll love. Our smart recommendation engine scans your taste and delivers top picks, no fluff, no ads, just binge-worthy suggestions. Ready to explore?"
            }
          </p>
          <Button className="font-medium font-poppins">Explore More</Button>
        </div>

        {/* hero bottom section */}
        <div
          className="flex flex-col items-center justify-center flex-1 w-full gap-2 px-6 py-10 md:bg-background md:items-end"
          style={{
            clipPath: isMdSize
              ? ""
              : "polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        >
          {/* recommerndation title,catergory, and rating */}
          <div className="flex flex-col-reverse justify-between gap-5 xl:flex-row md:w-1/2">
            <div className="flex flex-col justify-start text-xs font-medium gap-y-3 text-foreground font-poppins sm:text-sm xl:text-base">
              {currentRecommendation && (
                <>
                  <div className="flex gap-1 ">
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
            <div className="flex flex-col items-start gap-y-2 xl:items-end">
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
                        className="object-cover border-2 rounded-md h-52 border-ring"
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
