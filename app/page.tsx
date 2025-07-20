import HomeHero from "@/components/home/home-hero";
import HomePlanToWatch from "@/components/home/home-plan-to-watch";
import HomeRecentWatch from "@/components/home/home-recent-watch";

export default function Home() {
  return (
    <main className="bg-background container mx-auto overflow-clip ">
      <HomeHero />
      <HomeRecentWatch />
      <HomePlanToWatch />
    </main>
  );
}
