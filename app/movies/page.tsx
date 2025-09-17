export const dynamic = "force-dynamic";
import MoviesList from "@/components/movies/movie-list";
import MoviesHero from "@/components/movies/movies-hero";
import React from "react";

export default function page() {
  return (
    <main className="bg-background pb-[3.5625rem] container mx-auto overflow-clip ">
      <MoviesHero />
      <MoviesList />
    </main>
  );
}
