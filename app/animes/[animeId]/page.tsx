"use client";
import AnimeContentHero from "@/components/animes/content/anime-content-hero";
import AnimeEpisodes from "@/components/animes/content/anime-episodes";
import TvContentHero from "@/components/tv-shows/content/tv-content-hero";
import TvSeasonsEpisodes from "@/components/tv-shows/content/tv-seasons-episodes";
import { useOneAnimeDetailsStore } from "@/Stores/Stale/Content/useOneAnimeDetailsStore";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  // setting the id for fetching anime from store
  const { animeId } = useParams();
  useOneAnimeDetailsStore.setState({
    animeId: animeId as string,
    isOneAnimeDetailsFetched: false,
    allEpisodes: [],
  });
  // router.refresh();
  return (
    <main className="bg-background pb-[3.5625rem] container mx-auto overflow-clip ">
      <AnimeContentHero />
      <AnimeEpisodes />
    </main>
  );
}
