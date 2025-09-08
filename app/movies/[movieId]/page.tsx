"use client";
import MovieContentHero from "@/components/movies/content/MovieContentHero";
import { useOneMovieDetailsStore } from "@/Stores/Stale/Content/useOneMovieDetailsStore";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  // setting the id for fetching movie in the useOneTvShowDetails store
  const { movieId } = useParams();
  useOneMovieDetailsStore.setState({
    movieId: movieId as string,
    isOneMovieDetailsFetched: false,
  });
  // router.refresh();
  return (
    <main className="bg-background pb-[3.5625rem] container mx-auto overflow-clip ">
      <MovieContentHero />
    </main>
  );
}
