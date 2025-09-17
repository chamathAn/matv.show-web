import AnimeHero from "@/components/animes/anime-hero";
import AnimeList from "@/components/animes/anime-list";
import React from "react";

export default function page() {
  return (
    <main className="bg-background pb-[3.5625rem] container mx-auto overflow-clip ">
      <AnimeHero />
      <AnimeList />
    </main>
  );
}
