"use client";
import TvContentHero from "@/components/tv-shows/content/tv-content-hero";
import { useOneTvshowDetailsStore } from "@/Stores/Stale/Content/useOneTvshowDetailStore";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  // setting the id for fetching tv show in the useOneTvShowDetails store
  const { tvId } = useParams();
  useOneTvshowDetailsStore.setState({ tvId: tvId as string });

  return (
    <main className="bg-background pb-[3.5625rem] container mx-auto overflow-clip ">
      <TvContentHero />
    </main>
  );
}
