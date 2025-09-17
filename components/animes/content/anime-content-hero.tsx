"use client";

import StateFilter from "@/components/filter/state-filter";
import { Skeleton } from "@/components/ui/skeleton";
import useOneAnimeDetails from "@/Hooks/useOneAnimeDetails";

import useUserAllAnimes from "@/Hooks/useUserAllAnimes";
import { authClient } from "@/lib/auth-client";
import { FilterStatesType } from "@/Shared/Types/filter-states.types";
import { useUserAllAnimesStore } from "@/Stores/Stale/UserAll/useUserAllMATStore";
import { Rating } from "@fluentui/react-rating";
import axios from "axios";
import { BookHeart, Star, Vote } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FP from "@/app/assets/FallbackPreview.png";
export default function AnimeContentHero() {
  const { data: session } = authClient.useSession();
  const { oneAnimeDetails, isLoading } = useOneAnimeDetails();

  // user all animes
  const { userAllAnimes } = useUserAllAnimes();

  // rating
  const [userRating, setUserRating] = useState(0);
  // progress state
  const [progressState, setProgressState] = useState<FilterStatesType | "">("");

  useEffect(() => {
    if (
      !session ||
      !oneAnimeDetails ||
      oneAnimeDetails === undefined ||
      !userAllAnimes
    )
      return;

    // check if the anime is in the user's list
    const isMatched = userAllAnimes.find(
      (anime) => String(anime.animeId) === String(oneAnimeDetails?.mal_id)
    );

    // setting the rating and progress state
    if (isMatched) {
      setUserRating(isMatched.animeRating);
      setProgressState(isMatched.animeStates as FilterStatesType);
    }
  }, [session, oneAnimeDetails, userAllAnimes]);

  // send update to backend
  const sendanimeUpdate = async ({
    animeRating,
    animeStates,
  }: {
    animeRating?: number;
    animeStates?: FilterStatesType | "";
  }) => {
    if (!session || !oneAnimeDetails) return;

    const payload = {
      animeId: oneAnimeDetails.mal_id + "",
      userId: session?.user.id,
      animeRating: animeRating ?? userRating,
      animeStates: animeStates ?? progressState,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/animes/",
        payload,
        { withCredentials: true }
      );

      // refetch user tv shows after changes
      useUserAllAnimesStore.getState().fetchUserAnimes();
    } catch (err) {
      console.error("Failed to update anime:", err);
    }
  };

  // handlers rating change
  const handleRatingChange = (_: any, data: { value: number }) => {
    setUserRating(data.value); // updating the rating state
    sendanimeUpdate({ animeRating: data.value }); // update the backend
  };

  // handle progress state
  const handleStateChange = (state: FilterStatesType) => {
    setProgressState(state); // updating the progress state
    sendanimeUpdate({ animeStates: state });
  };

  return (
    <section className="relative w-full  gap-5 sm:grid grid-cols-[1fr_2fr] overflow-hidden text-foreground font-poppins px-6 sm:px-0">
      {isLoading ? (
        <>
          <Skeleton className="h-[400px] w-full rounded-md" />
          <div className="flex flex-col gap-5">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </>
      ) : (
        <>
          {/* image */}
          <Image
            src={(oneAnimeDetails.images?.jpg?.image_url as string) || FP}
            alt={(oneAnimeDetails.title as string) || ""}
            width={1000}
            height={1000}
            className="w-auto h-full object-cover rounded-md"
          />

          {/* title and descriptions */}
          <div className="flex flex-col gap-5 py-3">
            <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold">
              {oneAnimeDetails.title as string}
            </h1>
            <div className="grid grid-cols-3">
              {/* rating */}
              <div className="flex flex-col size-full items-center gap-2">
                <Star size={25} />
                <p className="text-xs sm:text-sm font-medium">
                  {oneAnimeDetails.score + "/10"}
                </p>
              </div>

              {/* vote count */}
              <div className="flex flex-col size-full items-center gap-2">
                <Vote size={25} />
                <p className="text-xs sm:text-sm font-medium">
                  {oneAnimeDetails.popularity + " votes"}
                </p>
              </div>

              {/* your rating */}
              <div className="flex flex-col size-full items-center gap-2">
                <BookHeart size={25} />
                <p className="text-xs sm:text-sm font-medium">
                  {userRating + " Your rating"}
                </p>
              </div>
            </div>

            {/* overview */}
            <p className="text-sm sm:text-base">
              {oneAnimeDetails.background as string}
            </p>

            {/* give your rating */}
            <div className="flex flex-col sm:flex-row gap-5 justify-between">
              <Rating value={userRating} onChange={handleRatingChange} />

              {/* user tv show progress state */}
              <div className="flex items-center justify-start gap-2 text-xs sm:text-sm xl:text-base font-medium">
                <StateFilter onChange={handleStateChange} />
                {progressState && <span>{": " + progressState}</span>}
              </div>
            </div>
            {/* genres */}
            <div className="flex flex-wrap gap-2 text-sm"></div>
          </div>
        </>
      )}
    </section>
  );
}
