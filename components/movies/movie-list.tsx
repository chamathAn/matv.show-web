"use client";

import React, { useMemo, useState } from "react";
import StateFilter from "../filter/state-filter";
import { Separator } from "../ui/separator";
import clsx from "clsx";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import useTrendingMediaData from "@/Hooks/useTrendingMediaData";
import { FilterStatesType } from "@/Shared/Types/filter-states.types";
import { useQueryState } from "nuqs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import Link from "next/link";
import usePlanToWatchData from "@/Hooks/FilterState/PlanToWatch/usePlanToWatchData";
import useCompletedData from "@/Hooks/FilterState/Completed/useCompletedData";
import useDroppedData from "@/Hooks/FilterState/Dropped/useDroppedData";
import useOnholdData from "@/Hooks/FilterState/Onhold/useOnholdData";
import useWatchingData from "@/Hooks/FilterState/Watching/useWatchingData";
export default function MoviesList() {
  const { trendingMovies } = useTrendingMediaData(); // trending movies
  const [chosenMediaType, setChosenMediaType] = useState<
    "trending" | "new-release" | "aired-this-week" | ""
  >("");

  // user movie progress state
  const [chosenState, setChosenState] = useQueryState<FilterStatesType | "">(
    "state",
    { defaultValue: "" }
  );
  // fetch state data
  const planToWatchData = usePlanToWatchData();
  const completedData = useCompletedData();
  const droppedData = useDroppedData();
  const onholdData = useOnholdData();
  const watchingData = useWatchingData();

  // pagination settings
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 30;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // select items based on chosenState
  const filteredMovies = useMemo(() => {
    switch (chosenState) {
      case "planToWatch":
        return planToWatchData.planToWatchMovies;
      case "complete":
        return completedData.completedMovies;
      case "dropped":
        return droppedData.droppedMovies;
      case "onhold":
        return onholdData.onholdMovies;
      case "watching":
        return watchingData.watchingMovies;
      default:
        return trendingMovies.slice(0, 20);
    }
  }, [
    chosenState,
    planToWatchData.planToWatchMovies,
    completedData.completedMovies,
    droppedData.droppedMovies,
    onholdData.onholdMovies,
    watchingData.watchingMovies,
    trendingMovies,
  ]);

  // setting the filtered movies
  const currentItems = filteredMovies.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <section className="relative mt-10 px-6 sm:px-0 font-poppins w-full flex flex-col gap-y-5 lg:-mt-20 z-20 overflow-hidden text-foreground">
      {/* title */}
      <h2 className="text-lg font-semibold sm:text-2xl">movies</h2>

      {/* filters */}
      <div className="flex flex-col gap-1 items-start justify-between w-full h-fit sm:flex-row sm:items-center">
        {/* user movie progress state */}
        <StateFilter
          onChange={(state: string) =>
            setChosenState(state as FilterStatesType)
          }
        />

        {/* general static filters */}
        <div className="flex items-center h-6 gap-5 text-xs sm:text-sm xl:text-base">
          <h5
            className={clsx(
              "font-medium hover:underline hover:cursor-pointer",
              { underline: chosenMediaType === "trending" }
            )}
            onClick={() => setChosenMediaType("trending")}
          >
            Trending
          </h5>
          <Separator orientation="vertical" />
          <h5
            className={clsx(
              "font-medium hover:underline hover:cursor-pointer",
              { underline: chosenMediaType === "new-release" }
            )}
            onClick={() => setChosenMediaType("new-release")}
          >
            New Release
          </h5>
          <Separator orientation="vertical" />
          <h5
            className={clsx(
              "font-medium hover:underline hover:cursor-pointer",
              { underline: chosenMediaType === "aired-this-week" }
            )}
            onClick={() => setChosenMediaType("aired-this-week")}
          >
            Aired This Week
          </h5>
        </div>
      </div>

      {/* movie list */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 h-fit w-full">
        {currentItems.map((rec, i) => (
          <Link key={i} href={`/movies/${rec.id}`}>
            <Card className="py-0 bg-transparent border-0 rounded-md">
              <CardContent className="px-0 h-44 sm:h-60">
                <Image
                  className="object-cover w-full h-full rounded-md"
                  src={`https://image.tmdb.org/t/p/original${rec.backdrop_path}`}
                  alt={rec.title || ""}
                  width={500}
                  height={500}
                  blurDataURL={`https://image.tmdb.org/t/p/original${rec.backdrop_path}`}
                  placeholder="blur"
                />
              </CardContent>
              <CardFooter className="flex items-center justify-center font-medium font-poppins">
                <span className="text-xs text-center sm:text-sm line-clamp-1">
                  {rec.title || ""}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* pagination */}
      <PaginationComponent
        totalItems={trendingMovies.slice(0, 20).length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </section>
  );
}

function PaginationComponent({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}) {
  const pages = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pages.push(i);
  }

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    console.log(currentPage);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={""}
              onClick={() => handlePreviousPage()}
            />
          </PaginationItem>
        )}

        {pages.map((page: number) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={""}
              onClick={() => setCurrentPage(page)}
              className={
                page === currentPage ? "border border-border-softBeige" : ""
              }
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage === pages.length || pages.length <= 2 ? (
          <PaginationItem></PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currentPage < pages.length && (
          <PaginationItem>
            <PaginationNext href={""} onClick={() => handleNextPage()} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
