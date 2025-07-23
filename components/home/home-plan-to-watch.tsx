"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useStore } from "zustand";
import { usePlanToWatchMoviesStore } from "@/Stores/Home/usePlanToWatchMovieStore";
import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import Image from "next/image";
import { OneTvshowDetailsType } from "@/Shared/Types/tvshows-api.types";

import clsx from "clsx";
import { usePlanToWatchAnimesStore } from "@/Stores/Home/usePlanToWatchAnimes";
import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import { usePlanToWatchTvshowsStore } from "@/Stores/Home/usePlanToWatchTvshowsStore";

export default function HomePlanToWatch() {
  const [chosenMediaType, setChosenMediaType] = useState<
    "movies" | "tvshows" | "animes"
  >("movies"); // tv shows, movies, animes filter

  // fetch plan to watch tv shows
  const planToWatchTvShows: OneTvshowDetailsType[] = useStore(
    usePlanToWatchTvshowsStore,
    (state) => state.planToWatchTvshows
  );
  useEffect(() => {
    if (usePlanToWatchTvshowsStore.getState().isPlanToWatchTvshowsFetched)
      return;
    usePlanToWatchTvshowsStore.getState().fetchPlanToWatchTvshows();
  }, []);

  // fetch plan to watch movies
  const planToWatchMovies: OneMovieDetailsType[] = useStore(
    usePlanToWatchMoviesStore,
    (state) => state.planToWatchMovies
  );
  useEffect(() => {
    if (usePlanToWatchMoviesStore.getState().isPlanToWatchMoviesFetched) return;
    usePlanToWatchMoviesStore.getState().fetchPlanToWatchMovies();
  }, []);

  // fetch plan to watch animes
  const planToWatchAnimes: AnimeFullDetailsType[] = useStore(
    usePlanToWatchAnimesStore,
    (state) => state.planToWatchAnimes
  );
  useEffect(() => {
    if (usePlanToWatchAnimesStore.getState().isPlanToWatchAnimesFetched) return;
    usePlanToWatchAnimesStore.getState().fetchPlanToWatchAnimes();
  }, []);

  // combine tv shows, movies and animes
  const combinedPlanToWatchObj = useMemo(() => {
    return {
      tvshows: [...planToWatchTvShows],
      movies: [...planToWatchMovies],
      animes: [...planToWatchAnimes],
    };
  }, [planToWatchTvShows, planToWatchMovies, planToWatchAnimes]);

  // dynamic list of plan to watch
  const currentList = combinedPlanToWatchObj[chosenMediaType] || [];

  const getImageUrl = (
    item: AnimeFullDetailsType | OneMovieDetailsType | OneTvshowDetailsType
  ) => {
    if ("backdrop_path" in item) {
      return `https://image.tmdb.org/t/p/original${item.backdrop_path}`; // Movie or TV show
    } else if (item.images?.jpg?.image_url) {
      return item.images.jpg.image_url; // Anime
    } else {
      return "";
    }
  };

  return (
    <section className="w-full px-6 pt-10 space-y-5 text-foreground h-fit sm:px-0">
      {/* plan to watch titles and filters */}
      <div className="flex flex-col items-start justify-between w-full h-fit sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold leading-loose font-roboto text-nowrap sm:text-3xl lg:text-4xl">
            Plan to Watch
          </h3>
          <Button
            variant={"secondary"}
            className="hidden text-xs sm:text-sm md:block"
          >
            More to watch
          </Button>
        </div>

        <div className="flex items-center h-6 gap-5 text-xs font-poppins sm:text-sm xl:text-base">
          <h5
            className={clsx(
              "font-medium hover:underline hover:cursor-pointer",
              { underline: chosenMediaType === "movies" }
            )}
            onClick={() => setChosenMediaType("movies")}
          >
            Movie
          </h5>

          <Separator orientation="vertical" />
          <h5
            className={clsx(
              "font-medium hover:underline hover:cursor-pointer",
              { underline: chosenMediaType === "tvshows" }
            )}
            onClick={() => setChosenMediaType("tvshows")}
          >
            TV Series
          </h5>
          <Separator orientation="vertical" />
          <h5
            className={clsx(
              "font-medium hover:underline hover:cursor-pointer",
              { underline: chosenMediaType === "animes" }
            )}
            onClick={() => setChosenMediaType("animes")}
          >
            Anime
          </h5>
        </div>
      </div>

      {/* plan to watch list */}
      <ScrollArea className="w-full rounded-md whitespace-nowrap">
        <div className="flex pb-4 space-x-4 h-fit w-max">
          {currentList &&
            currentList.map((x, i) => (
              <Card
                key={i}
                className="w-32 py-0 bg-transparent border-0 rounded-md sm:w-40"
              >
                <CardContent className="px-0 h-44 sm:h-60">
                  <Image
                    className="object-cover w-full h-full rounded-md "
                    src={getImageUrl(x)}
                    alt={
                      "title" in x
                        ? x.title
                        : "name" in x
                        ? x.name
                        : (x as AnimeFullDetailsType).title || ""
                    }
                    width={500}
                    height={500}
                    blurDataURL={getImageUrl(x)}
                    placeholder="blur"
                  />
                </CardContent>
                <CardFooter className="flex items-center justify-center font-medium font-poppins">
                  <span className="text-xs text-center sm:text-sm line-clamp-1">
                    {"title" in x
                      ? x.title
                      : "name" in x
                      ? x.name
                      : (x as AnimeFullDetailsType).title || ""}
                  </span>
                </CardFooter>
              </Card>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
