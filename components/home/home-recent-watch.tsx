"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useStore } from "zustand";
import { useRecentlyWatchedMoviesStore } from "@/Stores/Stale/RecentlyWatched/useRecentlyWatchedMoviesStore";
import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import Image from "next/image";
import { OneTvshowDetailsType } from "@/Shared/Types/tvshows-api.types";
import { useRecentlyWatchedTvshowsStore } from "@/Stores/Stale/RecentlyWatched/useRecentlyWatchedTvshowsStore";
import clsx from "clsx";
import { useRecentlyWatchedAnimesStore } from "@/Stores/Stale/RecentlyWatched/useRecentlyWatchedAnimeStore";
import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";

export default function HomeRecentWatch() {
  // ! checkout the useRecentlyWatchedAnimesStore to see how to fetch recently watched animes/ movies/tv shows's id from backend

  const [chosenMediaType, setChosenMediaType] = useState<
    "movies" | "tvshows" | "animes"
  >("movies"); // tv shows, movies, animes filter

  // fetch recently watched tv shows
  const recenltyWatchedTvShows: OneTvshowDetailsType[] = useStore(
    useRecentlyWatchedTvshowsStore,
    (state) => state.recentlyWatchedTvshows
  );
  useEffect(() => {
    if (
      useRecentlyWatchedTvshowsStore.getState().isRecentlyWatchedTvshowsFetched
    )
      return;
    useRecentlyWatchedTvshowsStore.getState().fetchRecentlyWatchedTvshows();
  }, []);

  // fetch recently watched movies
  const recenltyWatchedMovies: OneMovieDetailsType[] = useStore(
    useRecentlyWatchedMoviesStore,
    (state) => state.recentlyWatchedMovies
  );
  useEffect(() => {
    if (useRecentlyWatchedMoviesStore.getState().isRecentlyWatchedMoviesFetched)
      return;
    useRecentlyWatchedMoviesStore.getState().fetchRecentlyWatchedMovies();
  }, []);

  // fetch recently watched animes
  const recentlyWatchedAnimes: AnimeFullDetailsType[] = useStore(
    useRecentlyWatchedAnimesStore,
    (state) => state.recentlyWatchedAnimes
  );
  useEffect(() => {
    if (useRecentlyWatchedAnimesStore.getState().isRecentlyWatchedAnimesFetched)
      return;
    useRecentlyWatchedAnimesStore.getState().fetchRecentlyWatchedAnimes();
  }, []);

  // combine tv shows, movies and animes
  const combinedRecentlyWatchedObj = useMemo(() => {
    return {
      tvshows: [...recenltyWatchedTvShows],
      movies: [...recenltyWatchedMovies],
      animes: [...recentlyWatchedAnimes],
    };
  }, [recenltyWatchedTvShows, recenltyWatchedMovies, recentlyWatchedAnimes]);

  // dynamic list of recently watched
  const currentList = combinedRecentlyWatchedObj[chosenMediaType] || [];

  const getImageUrl = (
    item: AnimeFullDetailsType | OneMovieDetailsType | OneTvshowDetailsType
  ) => {
    if ("backdrop_path" in item) {
      return `https://image.tmdb.org/t/p/original${item.backdrop_path}`; // Movie
    } else if (item.images?.jpg?.image_url) {
      return item.images.jpg.image_url; // Anime
    } else {
      return "";
    }
  };
  return (
    <section className="w-full px-6 pt-10 space-y-5 text-foreground h-fit sm:px-0">
      {/* recently watched titles, and filters */}
      <div className="flex flex-col items-start justify-between w-full h-fit sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold leading-loose font-roboto text-nowrap sm:text-3xl lg:text-4xl">
            Recently Watched
          </h3>
          <Button
            variant={"secondary"}
            className="hidden text-xs sm:text-sm md:block"
          >
            See all
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

      {/* recent movies */}
      <ScrollArea className="w-full rounded-md whitespace-nowrap">
        <div className="flex pb-4 space-x-4 h-fit w-max">
          {currentList &&
            currentList.map((x, i) => (
              <Card
                key={i}
                className="w-32 py-0 bg-transparent border-0 rounded-md sm:w-40 "
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
                        : "title" in x
                        ? (x as AnimeFullDetailsType).title
                        : ""
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
                      : "title" in x
                      ? (x as AnimeFullDetailsType).title
                      : ""}
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
