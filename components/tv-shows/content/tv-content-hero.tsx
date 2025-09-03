"use client";

import StateFilter from "@/components/filter/state-filter";
import { Skeleton } from "@/components/ui/skeleton";
import useOneTvshowDetails from "@/Hooks/useOneTvshowDetails";
import { authClient } from "@/lib/auth-client";
import { FilterStatesType } from "@/Shared/Types/filter-states.types";
import { Rating } from "@fluentui/react-rating";
import axios from "axios";
import { BookHeart, Star, Vote } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function TvContentHero() {
  const { data: session } = authClient.useSession(); // access the session data
  const { OneTvshowDetails, isLoading } = useOneTvshowDetails();

  // user rating manage
  const [userRating, setUserRating] = useState(0);

  // progress state
  const [progressState, setProgressState] = useState<FilterStatesType | "">("");

  // handle user tv show progress and rating state with backend
  useEffect(() => {
    if (session && OneTvshowDetails) {
      async function handleTvShowDataChange() {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/tv-shows/",
          {
            tvShowId: OneTvshowDetails.id.toString(),
            userId: session?.user.id,
            tvShowRating: userRating,
            tvShowStates: progressState,
          },
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
      }
      handleTvShowDataChange();
    }
  }, [progressState, userRating]);
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
              <Rating
                value={userRating}
                onChange={(_, data) => setUserRating(data.value)}
              />

              {/* user tv show progress state */}
              <div className="flex justify-start">
                <StateFilter
                  onChange={(state: string) =>
                    setProgressState(state as FilterStatesType)
                  }
                />
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
