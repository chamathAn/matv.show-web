"use client";
import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import {
  ChartNoAxesColumn,
  GripHorizontal,
  Handshake,
  House,
  PanelTopClose,
  PanelTopOpen,
  Popcorn,
  ScanFace,
  Target,
  Tv,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { userLogStore } from "@/Stores/Stale/UserAll/userLogStore";
import { usePlanToWatchAnimesStore } from "@/Stores/Stale/FilterState/PlanToWatch/usePlanToWatchAnimes";
import { usePlanToWatchMoviesStore } from "@/Stores/Stale/FilterState/PlanToWatch/usePlanToWatchMovieStore";
import { usePlanToWatchTvshowsStore } from "@/Stores/Stale/FilterState/PlanToWatch/usePlanToWatchTvshowsStore";
import { useCompletedAnimesStore } from "@/Stores/Stale/FilterState/Completed/useCompletedAnimes";
import { useCompletedMoviesStore } from "@/Stores/Stale/FilterState/Completed/useCompletedMovieStore";
import { useCompletedTvshowsStore } from "@/Stores/Stale/FilterState/Completed/useCompletedTvshowsStore";
import { useDroppedAnimesStore } from "@/Stores/Stale/FilterState/Dropped/useDroppedAnimesStore";
import { useDroppedMoviesStore } from "@/Stores/Stale/FilterState/Dropped/useDroppedMoviesStore";
import { useDroppedTvshowsStore } from "@/Stores/Stale/FilterState/Dropped/useDroppedTvshowsStore";
import { useOnholdAnimesStore } from "@/Stores/Stale/FilterState/Onhold/useOnholdAnimesStore";
import { useOnholdMoviesStore } from "@/Stores/Stale/FilterState/Onhold/useOnholdMoviesStore";
import { useWatchingAnimesStore } from "@/Stores/Stale/FilterState/Watching/useWatchingAnimesStore";
import { useWatchingMoviesStore } from "@/Stores/Stale/FilterState/Watching/useWatchingMoviesStore";
import { useWatchingTvshowsStore } from "@/Stores/Stale/FilterState/Watching/useWatchingTvshowsStore";
import { useOnholdTvshowsStore } from "@/Stores/Stale/FilterState/Onhold/useOnholdTvshowsStore";

const navItems = [
  { href: "/", label: "Home", icon: <House width={20} height={20} /> },
  {
    href: "/overview",
    label: "Overview",
    icon: <Target width={20} height={20} />,
  },
  {
    href: "/animes",
    label: "Anime",
    icon: <ScanFace width={20} height={20} />,
  },
  {
    href: "/movies",
    label: "Movies",
    icon: <Popcorn width={20} height={20} />,
  },
  { href: "/tv-shows", label: "TV Shows", icon: <Tv width={20} height={20} /> },
  {
    href: "/stats",
    label: "Stats",
    icon: <ChartNoAxesColumn width={20} height={20} />,
  },
  {
    href: "/network",
    label: "Network",
    icon: <Handshake width={20} height={20} />,
  },
];
export default function Header() {
  // handle sign in
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL as string,
    });
  };
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    refetch();
  };

  if (error) {
    toast.error("Event has been created");
  }

  // refetch plan to watch animes, tv shows, movies
  const reFetchAnimeMovieTvStateData = () => {
    //  refetch plan to watch animes, tv shows, movies
    usePlanToWatchAnimesStore.getState().fetchPlanToWatchAnimes();
    usePlanToWatchMoviesStore.getState().fetchPlanToWatchMovies();
    usePlanToWatchTvshowsStore.getState().fetchPlanToWatchTvshows();

    // refetch completed animes, tv shows, movies
    useCompletedAnimesStore.getState().fetchCompletedAnimes();
    useCompletedMoviesStore.getState().fetchCompletedMovies();
    useCompletedTvshowsStore.getState().fetchCompletedTvshows();

    useDroppedAnimesStore.getState().fetchDroppedAnimes();
    useDroppedMoviesStore.getState().fetchDroppedMovies();
    useDroppedTvshowsStore.getState().fetchDroppedTvshows();

    useOnholdAnimesStore.getState().fetchOnholdAnimes();
    useOnholdMoviesStore.getState().fetchOnholdMovies();
    useOnholdTvshowsStore.getState().fetchOnholdTvshows();

    useWatchingAnimesStore.getState().fetchWatchingAnimes();
    useWatchingMoviesStore.getState().fetchWatchingMovies();
    useWatchingTvshowsStore.getState().fetchWatchingTvshows();
  };

  useEffect(() => {
    if (session) {
      userLogStore.setState({ isUserLoggedIn: true });
      reFetchAnimeMovieTvStateData();
    } else userLogStore.setState({ isUserLoggedIn: false });
  }, [isPending, session]);
  return (
    <>
      <header className="px-6 sm:px-0 h-full font-roboto flex flex-col container mx-auto overflow-clip">
        {/* header */}
        <div className="flex flex-col sm:flex-row bg-background gap-y-3 sm:h-20 py-5 sm:py-0 relative sm:justify-between items-center">
          {/* header tilte (logo) */}
          <h1 className="text-2xl text-nowrap sm:text-3xl font-bold font-nebular">
            {"MATV SHOW"}
          </h1>
          {/* profile image and username */}
          {isPending ? (
            <div className="flex gap-x-5  justify-center items-center">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-24 h-7" />
            </div>
          ) : session ? (
            <div className="flex gap-x-5 justify-center items-center">
              <Image
                src={session?.user.image || ""}
                alt=""
                width={100}
                height={100}
                className="rounded-full w-7 h-7"
              />
              <span className="sm:text-lg text-nowrap font-bold">
                {session?.user.name || ""}
              </span>
              <Button
                variant={"outline"}
                className="text-xs sm:text-sm text-nowrap"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant={"outline"}
              className="text-xs sm:text-sm"
              onClick={handleSignIn}
            >
              <Icon
                icon="flat-color-icons:google"
                className="hidden sm:block"
              />
              {"Sign In With Google"}
            </Button>
          )}
        </div>
      </header>
      {/* navigation */}
      <Navigation />
      <MobibleNavigation />
    </>
  );
}

// navigation
const Navigation = () => {
  const pathname = usePathname();

  // handle nav animation
  const [isOpen, setIsOpen] = useState(true);
  const { scrollY } = useScroll();
  const preRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - preRef.current;
    if (y < 200) return;
    // open when user scroll up
    if (diff < 10) {
      setIsOpen(true);
      preRef.current = y;
    }

    // close right after user scroll down
    if (diff > 0) {
      setIsOpen(false);
      preRef.current = y;
    }
  });

  return (
    <motion.div
      animate={isOpen ? "visible" : "hidden"}
      variants={{
        hidden: {
          y: "-75%",
        },
        visible: {
          y: "0%",
        },
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="z-50 hidden justify-center items-center container mx-auto overflow-clip sticky top-0 w-full sm:flex flex-col"
    >
      {/* nav items */}
      <nav className="grid  w-full border-b  backdrop-blur bg-background/60  grid-cols-7  rounded-b-md ">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex text-xs flex-col gap-y-1 py-2 items-center justify-center",
              {
                "text-accent":
                  (href === "/" && pathname === "/") ||
                  (href !== "/" && pathname.startsWith(href)),

                "transition-all duration-300": true,
              }
            )}
          >
            {icon}
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {/* nav drag indicator */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="py px-5 hover:cursor-pointer flex rounded-b-xl  justify-center items-center bg-background border-b text-foreground"
      >
        <GripHorizontal />
      </div>
    </motion.div>
  );
};

// mobile navigation
const MobibleNavigation = () => {
  const pathname = usePathname();

  const [isMoreTabOpen, setIsMoreTabOpen] = useState(false);
  return (
    <div className="z-50  w-full sm:hidden fixed bottom-0">
      {/* top nav items */}
      <motion.nav
        variants={{
          hidden: {
            y: "100%",
            opacity: 0,
          },
          visible: {
            y: "0%",
            opacity: 1,
          },
        }}
        transition={{
          duration: 0.2,
        }}
        animate={isMoreTabOpen ? "visible" : "hidden"}
        className="grid  w-full border-t  backdrop-blur bg-background/60 grid-cols-5 rounded-t-md "
      >
        {/* navigation itemns from tv shows to network */}
        {navItems.slice(4, 7).map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex text-xs flex-col gap-y-1 py-2 items-center text-nowrap justify-center",
              {
                "text-accent":
                  (href === "/" && pathname === "/") ||
                  (href !== "/" && pathname.startsWith(href)),

                "transition-all duration-300": true,
              }
            )}
          >
            {icon}
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </motion.nav>

      {/* bottom nav items */}
      <nav
        className={clsx(
          "grid w-full backdrop-blur transition bg-background/60 grid-cols-5 rounded-t-md ",
          {
            "border-t": !isMoreTabOpen,
          }
        )}
      >
        {/* navigation itemns from home to movies */}
        {navItems.slice(0, 4).map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex text-xs flex-col gap-y-1 py-2 items-center text-nowrap justify-center",
              {
                "text-accent": href === pathname,

                "transition-all duration-300": true,
              }
            )}
          >
            {icon}
            <span className="font-medium">{label}</span>
          </Link>
        ))}

        {/* more button */}
        <div
          onClick={() => setIsMoreTabOpen(!isMoreTabOpen)}
          className="flex text-xs hover:cursor-pointer flex-col gap-y-1 py-2 items-center text-nowrap justify-center"
        >
          {isMoreTabOpen ? (
            <PanelTopOpen width={20} height={20} />
          ) : (
            <PanelTopClose width={20} height={20} />
          )}
          <span className="font-medium">{"More"}</span>
        </div>
      </nav>
    </div>
  );
};
