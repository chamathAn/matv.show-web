"use client";

import StateFilter from "@/components/filter/state-filter";
import { Skeleton } from "@/components/ui/skeleton";
import useOneMovieDetails from "@/Hooks/useOneMovieDetails";
import useUserAllMovies from "@/Hooks/useUserAllMovies";
import { authClient } from "@/lib/auth-client";
import { FilterStatesType } from "@/Shared/Types/filter-states.types";
import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import { useUserAllMoviesStore } from "@/Stores/Stale/UserAll/useUserAllMATStore";
import { Rating } from "@fluentui/react-rating";
import axios from "axios";
import { BookHeart, Star, Vote } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function MovieContentHero() {
  const { data: session } = authClient.useSession();
  const { oneMovieDetails, isLoading } = useOneMovieDetails();

  // user all movies
  const { userAllMovies } = useUserAllMovies();

  // rating
  const [userRating, setUserRating] = useState(0);
  // progress state
  const [progressState, setProgressState] = useState<FilterStatesType | "">("");

  useEffect(() => {
    if (
      !session ||
      !oneMovieDetails ||
      oneMovieDetails === undefined ||
      !userAllMovies
    )
      return;
    const rawId = (oneMovieDetails as OneMovieDetailsType).id ?? null;

    if (!rawId) {
      // if no usable id bail out
      return;
    }

    const oneIdStr = String(rawId);

    // check if the anime is in the user's list
    const isMatched = userAllMovies.find((movie) => movie.movieId === oneIdStr);

    // setting the rating and progress state
    if (isMatched) {
      setUserRating(isMatched.movieRating);
      setProgressState(isMatched.movieStates as FilterStatesType);
    }
  }, [session, oneMovieDetails, userAllMovies]);

  // send update to backend
  const sendmovieUpdate = async ({
    movieRating,
    movieStates,
  }: {
    movieRating?: number;
    movieStates?: FilterStatesType | "";
  }) => {
    if (!session || !oneMovieDetails) return;

    const payload = {
      movieId: oneMovieDetails.id.toString(),
      userId: session?.user.id,
      movieRating: movieRating ?? userRating,
      movieStates: movieStates ?? progressState,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/movies/",
        payload,
        { withCredentials: true }
      );

      // refetch user movies after changes
      useUserAllMoviesStore.getState().fetchUserMovies();
      console.log(response.data);
    } catch (err) {
      console.error("Failed to update movie:", err);
    }
  };

  // handlers rating change
  const handleRatingChange = (_: any, data: { value: number }) => {
    setUserRating(data.value); // updating the rating state
    sendmovieUpdate({ movieRating: data.value }); // update the backend
  };

  // handle progress state
  const handleStateChange = (state: FilterStatesType) => {
    setProgressState(state); // updating the progress state
    sendmovieUpdate({ movieStates: state });
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
              `https://image.tmdb.org/t/p/original/${oneMovieDetails.backdrop_path}` ||
              ""
            }
            alt={oneMovieDetails.title || ""}
            width={1000}
            height={1000}
            className="w-auto h-full object-cover rounded-md"
          />

          {/* title and descriptions */}
          <div className="flex flex-col gap-5 py-3">
            <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold">
              {oneMovieDetails.title}
            </h1>
            <div className="grid grid-cols-3">
              {/* rating */}
              <div className="flex flex-col size-full items-center gap-2">
                <Star size={25} />
                <p className="text-xs sm:text-sm font-medium">
                  {oneMovieDetails.vote_average + "/10"}
                </p>
              </div>

              {/* vote count */}
              <div className="flex flex-col size-full items-center gap-2">
                <Vote size={25} />
                <p className="text-xs sm:text-sm font-medium">
                  {oneMovieDetails.vote_count + " votes"}
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
            <p className="text-sm sm:text-base">{oneMovieDetails.overview}</p>

            {/* give your rating */}
            <div className="flex flex-col sm:flex-row gap-5 justify-between">
              <Rating value={userRating} onChange={handleRatingChange} />

              {/* user movie progress state */}
              <div className="flex items-center justify-start gap-2 text-xs sm:text-sm xl:text-base font-medium">
                <StateFilter onChange={handleStateChange} />
                <span>{": " + progressState}</span>
              </div>
            </div>
            {/* genres */}
            <div className="flex flex-wrap gap-2 text-sm">
              {oneMovieDetails.genres &&
                oneMovieDetails.genres.map((genre) => (
                  <p key={genre.id}>{genre.name}</p>
                ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
