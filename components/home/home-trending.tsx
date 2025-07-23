"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useStore } from "zustand";
import { useTrendingMovies } from "@/Stores/Home/useTrendingMovies";
import { TrendingMoviesType } from "@/Shared/Types/movie-api.types";
import Image from "next/image";
import { TrendingTvShowsType } from "@/Shared/Types/tvshows-api.types";
import { useTrendingTvshows } from "@/Stores/Home/useTrendingTvshows";
import clsx from "clsx";
import { useTrendingAnimes } from "@/Stores/Home/useTrendingAnime";
import { TrendingAnimeType } from "@/Shared/Types/anime-api.types";

export default function HomeTrending() {
  const [chosenMediaType, setChosenMediaType] = useState<
    "movies" | "tvshows" | "animes"
  >("movies"); // tv shows, movies, animes filter

  // fetch trending tv shows
  const trendingTvShows: TrendingTvShowsType[] = useStore(
    useTrendingTvshows,
    (state) => state.trendingTvshows
  );
  useEffect(() => {
    if (useTrendingTvshows.getState().isTrendingTvshowsFetched) return;
    useTrendingTvshows.getState().fetchTrendingTvshows();
  }, []);

  // fetch trending movies
  const trendingMovies: TrendingMoviesType[] = useStore(
    useTrendingMovies,
    (state) => state.trendingMovies
  );
  useEffect(() => {
    if (useTrendingMovies.getState().isTrendingMoviesFetched) return;
    useTrendingMovies.getState().fetchTrendingMovies();
  }, []);

  // fetch trending animes
  const trendingAnimes: TrendingAnimeType[] = useStore(
    useTrendingAnimes,
    (state) => state.trendingAnimes
  );
  useEffect(() => {
    if (useTrendingAnimes.getState().isTrendingAnimesFetched) return;
    useTrendingAnimes.getState().fetchTrendingAnimes();
  }, []);

  // combine tv shows, movies and animes
  const combinedTrendingObj = useMemo(() => {
    return {
      tvshows: [...trendingTvShows.slice(0, 5)],
      movies: [...trendingMovies.slice(0, 5)],
      animes: [...trendingAnimes.slice(0, 5)],
    };
  }, [trendingTvShows, trendingMovies, trendingAnimes]);

  // dynamic list of trending media
  const currentList = combinedTrendingObj[chosenMediaType] || [];

  const getImageUrl = (
    item: TrendingAnimeType | TrendingMoviesType | TrendingTvShowsType
  ) => {
    if ("backdrop_path" in item && item.backdrop_path) {
      return `https://image.tmdb.org/t/p/original${item.backdrop_path}`; // Movie/TV Show
    } else if ((item as TrendingAnimeType).images?.jpg?.image_url) {
      return (item as TrendingAnimeType).images.jpg.image_url; // Anime
    } else {
      return "";
    }
  };

  return (
    <section className="w-full px-6 pt-10 space-y-5 text-foreground h-fit sm:px-0">
      {/* trending titles, and filters */}
      <div className="flex flex-col items-start justify-between w-full h-fit sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold leading-loose font-roboto text-nowrap sm:text-3xl lg:text-4xl">
            Trending Now
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

      {/* trending media */}
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
                        : (x as TrendingAnimeType).title || ""
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
                      : (x as TrendingAnimeType).title || ""}
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
