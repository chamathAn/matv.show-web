import Hero from "@/components/tv-shows/hero";
import TvShowsList from "@/components/tv-shows/tv-shows-list";
import React from "react";

export default function page() {
  return (
    <main className="bg-background pb-[3.5625rem] container mx-auto overflow-clip ">
      <Hero />
      <TvShowsList />
    </main>
  );
}
