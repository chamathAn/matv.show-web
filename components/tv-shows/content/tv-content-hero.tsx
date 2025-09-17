"use client";

import StateFilter from "@/components/filter/state-filter";
import { Skeleton } from "@/components/ui/skeleton";
import useOneTvshowDetails from "@/Hooks/useOneTvshowDetails";
import useUserAllTvShows from "@/Hooks/useUserAllTvShows";
import { authClient } from "@/lib/auth-client";
import { FilterStatesType } from "@/Shared/Types/filter-states.types";
import { OneTvshowDetailsType } from "@/Shared/Types/tvshows-api.types";
import { useUserAllTvShowsStore } from "@/Stores/Stale/UserAll/useUserAllMATStore";
import { Rating } from "@fluentui/react-rating";
import axios from "axios";
import { BookHeart, Star, Vote } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";

export default function TvContentHero() {
  const { data: session } = authClient.useSession();
  const { OneTvshowDetails, isLoading } = useOneTvshowDetails();

  // user all tv shows
  const { userAllTvShows } = useUserAllTvShows();

  // rating
  const [userRating, setUserRating] = useState(0);
  // progress state
  const [progressState, setProgressState] = useState<FilterStatesType | "">("");

  useEffect(() => {
    if (
      !session ||
      !OneTvshowDetails ||
      OneTvshowDetails === undefined ||
      !userAllTvShows
    )
      return;

    const rawId = (OneTvshowDetails as OneTvshowDetailsType).id ?? null;

    if (!rawId) {
      // if no usable id bail out
      return;
    }

    const oneIdStr = String(rawId);

    // check if the tv show is in the user's list
    const isMatched = userAllTvShows.find(
      (tvShow) => tvShow.tvShowId === oneIdStr
    );

    // setting the rating and progress state
    if (isMatched) {
      setUserRating(isMatched.tvShowRating);
      setProgressState(isMatched.tvShowStates as FilterStatesType);
    }
  }, [session, OneTvshowDetails, userAllTvShows]);

  // send update to backend
  const sendTvShowUpdate = async ({
    tvShowRating,
    tvShowStates,
  }: {
    tvShowRating?: number;
    tvShowStates?: FilterStatesType | "";
  }) => {
    if (!session || !OneTvshowDetails) return;

    const payload = {
      tvShowId: OneTvshowDetails.id.toString(),
      userId: session?.user.id,
      tvShowRating: tvShowRating ?? userRating,
      tvShowStates: tvShowStates ?? progressState,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/tv-shows/",
        payload,
        { withCredentials: true }
      );

      // refetch user tv shows after changes
      useUserAllTvShowsStore.getState().fetchUserTvShows();
      console.log(response.data);
    } catch (err) {
      console.error("Failed to update tv show:", err);
    }
  };

  // handlers rating change
  const handleRatingChange = (_: any, data: { value: number }) => {
    setUserRating(data.value); // updating the rating state
    sendTvShowUpdate({ tvShowRating: data.value }); // update the backend
  };

  // handle progress state
  const handleStateChange = (state: FilterStatesType) => {
    setProgressState(state); // updating the progress state
    sendTvShowUpdate({ tvShowStates: state });
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
            src={
              `https://image.tmdb.org/t/p/original/${OneTvshowDetails.backdrop_path}` ||
              ""
            }
            alt={OneTvshowDetails.name || ""}
            width={1000}
            height={1000}
            className="w-auto h-full object-cover rounded-md"
          />

          {/* title and descriptions */}
          <div className="flex flex-col gap-5 py-3">
            <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold">
              {OneTvshowDetails.name}
            </h1>
            <div className="grid grid-cols-3">
              {/* rating */}
              <div className="flex flex-col size-full items-center gap-2">
                <Star size={25} />
                <p className="text-xs sm:text-sm font-medium">
                  {OneTvshowDetails.vote_average + "/10"}
                </p>
              </div>

              {/* vote count */}
              <div className="flex flex-col size-full items-center gap-2">
                <Vote size={25} />
                <p className="text-xs sm:text-sm font-medium">
                  {OneTvshowDetails.vote_count + " votes"}
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
            <p className="text-sm sm:text-base">{OneTvshowDetails.overview}</p>

            {/* give your rating */}
            <div className="flex flex-col sm:flex-row gap-5 justify-between">
              <Rating value={userRating} onChange={handleRatingChange} />

              {/* user tv show progress state */}
              <div className="flex items-center justify-start gap-2 text-xs sm:text-sm xl:text-base font-medium">
                <StateFilter onChange={handleStateChange} />
                <span>{": " + progressState}</span>
              </div>
            </div>
            {/* genres */}
            <div className="flex flex-wrap gap-2 text-sm">
              {OneTvshowDetails.genres &&
                OneTvshowDetails.genres.map((genre) => (
                  <p key={genre.id}>{genre.name}</p>
                ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
