"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useStore } from "zustand";
import { useRecentlyWatchedMoviesStore } from "@/Stores/Home/useRecentlyWatchedMoviesStore";
import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import Image from "next/image";

export default function HomeRecentWatch() {
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
          <h5 className="font-medium hover:underline hover:cursor-pointer">
            Movie
          </h5>

          <Separator orientation="vertical" />
          <h5 className="font-medium hover:underline hover:cursor-pointer">
            TV Series
          </h5>
          <Separator orientation="vertical" />
          <h5 className="font-medium hover:underline hover:cursor-pointer">
            Anime
          </h5>
        </div>
      </div>

      {/* recent movies */}
      <ScrollArea className="w-full rounded-md whitespace-nowrap">
        <div className="flex pb-4 space-x-4 h-fit w-max">
          {recenltyWatchedMovies &&
            recenltyWatchedMovies.map((movie, i) => (
              <Card
                key={i}
                className="py-0 bg-transparent border-0 rounded-md size-fit"
              >
                <CardContent className="w-32 px-0 sm:w-40 h-44 sm:h-60">
                  <Image
                    className="object-cover w-full h-full rounded-md "
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    width={500}
                    height={500}
                    blurDataURL={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    placeholder="blur"
                  />
                </CardContent>
                <CardFooter className="flex items-center justify-center font-medium font-poppins">
                  <span className="text-xs text-center sm:text-sm">
                    {movie.title}
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
