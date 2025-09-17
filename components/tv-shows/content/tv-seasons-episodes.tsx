"use client";
import useOneTvshowDetails from "@/Hooks/useOneTvshowDetails";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StateFilter from "@/components/filter/state-filter";
import { FilterStatesType } from "@/Shared/Types/filter-states.types";
import { Skeleton } from "@/components/ui/skeleton";
import useUserAllTvShows from "@/Hooks/useUserAllTvShows";
import { authClient } from "@/lib/auth-client";
import axios from "axios";
import { useUserAllTvShowsStore } from "@/Stores/Stale/UserAll/useUserAllMATStore";
import { OneTvshowDetailsType } from "@/Shared/Types/tvshows-api.types";

export default function TvSeasonsEpisodes() {
  const { data: session } = authClient.useSession();

  // user all tv shows
  const { userAllTvShows } = useUserAllTvShows();

  // tv show season details
  const { isLoading, allSeasons, OneTvshowDetails } = useOneTvshowDetails();

  const [episodeStates, setEpisodeStates] = useState<{
    [key: string]: FilterStatesType | "";
  }>({});

  useEffect(() => {
    if (!session || !userAllTvShows || !allSeasons) return;
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

    // setting the progress state
    if (isMatched && isMatched.episodeStates != null) {
      setEpisodeStates(isMatched.episodeStates);
    }
  }, [session, userAllTvShows, allSeasons, OneTvshowDetails]);

  // send states changes to backend
  const sendEpisodeStatesUpdate = async (states?: {
    [key: string]: FilterStatesType | "";
  }) => {
    if (!session || !OneTvshowDetails || !allSeasons) return;

    const payload = {
      tvShowId: OneTvshowDetails.id.toString(),
      userId: session?.user.id,
      episodeStates: states ?? episodeStates,
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

  // handle user tv show episode progress state
  const handleStateChange = (episodeName: string, state: FilterStatesType) => {
    setEpisodeStates((prevStates) => {
      const newStates = { ...prevStates, [episodeName]: state };

      sendEpisodeStatesUpdate(newStates);
      return newStates;
    });
  };
  return (
    <section className="relative mt-10 px-6 sm:px-0 font-poppins w-full flex flex-col gap-y-5 z-20 overflow-hidden text-foreground">
      {/* accordion */}
      {isLoading ? (
        <div className="flex flex-col gap-5">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ) : (
        allSeasons.map((season, i) => (
          <Accordion key={i} type="single" collapsible>
            <AccordionItem value={season.name}>
              <AccordionTrigger className="text-lg pl-2 sm:pl-4 bg-gradient-to-r from-accent to-transparent">
                {season.name}
              </AccordionTrigger>
              <AccordionContent>
                {/* episodes */}
                <Accordion type="multiple" className="ml-10">
                  {season.episodes.map((episode, i) => {
                    const currentEpisodeState = episodeStates[episode.name];
                    return (
                      <AccordionItem key={i} value={episode.name}>
                        <AccordionTrigger>{episode.name}</AccordionTrigger>
                        <AccordionContent>
                          <p>{episode.overview}</p>

                          {/* user tv show progress state */}
                          <div className="mt-4">
                            <div className="flex items-center justify-start gap-2 text-xs sm:text-sm xl:text-base font-medium">
                              <StateFilter
                                onChange={(state: string) =>
                                  handleStateChange(
                                    episode.name,
                                    state as FilterStatesType
                                  )
                                }
                              />
                              {
                                // show progress state
                                currentEpisodeState && (
                                  <span>{": " + currentEpisodeState}</span>
                                )
                              }
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))
      )}
    </section>
  );
}
