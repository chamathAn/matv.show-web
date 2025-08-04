"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useOneTvshowDetails from "@/Hooks/useOneTvshowDetails";
import { Rating } from "@fluentui/react-rating";
import { BookHeart, Star, Vote } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function TvContentHero() {
  const { OneTvshowDetails, isLoading } = useOneTvshowDetails();

  // user rating manage
  const [userRating, setUserRating] = useState(0);
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
              `https://image.tmdb.org/t/p/original/${OneTvshowDetails.poster_path}` ||
              ""
            }
            alt={OneTvshowDetails.name || ""}
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-md"
          />

          {/* title and descriptions */}
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-bold">{OneTvshowDetails.name}</h1>
            <div className="grid grid-cols-3">
              {/* rating */}
              <div className="flex flex-col size-full items-center gap-2">
                <Star size={25} />
                <p className="text-sm font-medium">
                  {OneTvshowDetails.vote_average + "/10"}
                </p>
              </div>

              {/* vote count */}
              <div className="flex flex-col size-full items-center gap-2">
                <Vote size={25} />
                <p className="text-sm font-medium">
                  {OneTvshowDetails.vote_count + " votes"}
                </p>
              </div>

              {/* your rating */}
              <div className="flex flex-col size-full items-center gap-2">
                <BookHeart size={25} />
                <p className="text-sm font-medium">
                  {userRating + " Your rating"}
                </p>
              </div>
            </div>

            {/* overview */}
            <p>{OneTvshowDetails.overview}</p>

            {/* give your rating */}
            <div className="flex justify-between items-center">
              <Rating
                value={userRating}
                onChange={(_, data) => setUserRating(data.value)}
              />
              <Button variant="outline">Rate</Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
