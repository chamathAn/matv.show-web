"use client";

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
import useOneAnimeDetails from "@/Hooks/useOneAnimeDetails";
import useUserAllAnimes from "@/Hooks/useUserAllAnimes";
import { authClient } from "@/lib/auth-client";
import axios from "axios";
import { useUserAllAnimesStore } from "@/Stores/Stale/UserAll/useUserAllMATStore";

export default function AnimeEpisodes() {
  const { data: session } = authClient.useSession();

  // user all animes
  const { userAllAnimes } = useUserAllAnimes();

  // anime details + episodes
  const { oneAnimeDetails, isLoading, allEpisodes } = useOneAnimeDetails();

  // state for episodes progress
  const [episodeStates, setEpisodeStates] = useState<{
    [key: string]: FilterStatesType | "";
  }>({});

  // check if anime exists in user's list and set episode states
  useEffect(() => {
    if (!session || !userAllAnimes || !allEpisodes || !oneAnimeDetails) return;

    const matched = userAllAnimes.find(
      (a) => a.animeId === String(oneAnimeDetails?.mal_id)
    );

    if (matched && matched.episodeStates != null) {
      setEpisodeStates(matched.episodeStates);
    }
  }, [session, userAllAnimes, allEpisodes, oneAnimeDetails]);

  // send states changes to backend
  const sendEpisodeStatesUpdate = async (states?: {
    [key: string]: FilterStatesType | "";
  }) => {
    if (!session || !oneAnimeDetails || !allEpisodes) return;

    const payload = {
      animeId: String(oneAnimeDetails.mal_id),
      userId: session.user.id,
      episodeStates: states ?? episodeStates,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/animes/`,
        payload,
        { withCredentials: true }
      );

      // refetch user animes after changes
      useUserAllAnimesStore.getState().fetchUserAnimes();
      console.log("Episode states updated:", res.data);
    } catch (err) {
      console.error("Failed to update anime episode states:", err);
    }
  };

  // handle user episode progress state
  const handleStateChange = (episodeKey: string, state: FilterStatesType) => {
    setEpisodeStates((prev) => {
      const next = { ...prev, [episodeKey]: state };
      sendEpisodeStatesUpdate(next);
      return next;
    });
  };

  return (
    <section className="relative mt-10 px-6 sm:px-0 font-poppins w-full flex flex-col gap-y-5 z-20 overflow-hidden text-foreground">
      {/* anime title */}
      <h2 className="text-lg font-semibold sm:text-2xl">
        {(oneAnimeDetails.title as string) || ""}
      </h2>

      {/* loading skeleton */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-48 w-full rounded-md" />
        </div>
      ) : (
        <>
          {Array.isArray(allEpisodes) && allEpisodes.length > 0 ? (
            <Accordion type="multiple" className="space-y-2">
              {allEpisodes.map((episode, i) => {
                // use mal_id or fallback for episode key
                const episodeKey = episode.mal_id
                  ? String(episode.mal_id)
                  : `${episode.title ?? "ep"}-${i}`;
                const currentEpisodeState = episodeStates[episodeKey];

                return (
                  <AccordionItem key={i} value={episodeKey}>
                    <AccordionTrigger className="text-sm sm:text-base">
                      {episode.title ?? `Episode ${i + 1}`}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-3">
                        {/* episode info */}
                        <div className="text-xs sm:text-sm">
                          {episode.title_romanji && (
                            <div className="text-muted-foreground">
                              {episode.title_romanji}
                            </div>
                          )}
                          <div className="mt-1">
                            <span className="font-medium">Aired:</span>{" "}
                            <span>{episode.aired ?? "Unknown"}</span>
                          </div>
                          <div>
                            <span className="font-medium">Score:</span>{" "}
                            <span>{episode.score ?? "N/A"}</span>
                          </div>
                          <div>
                            <span className="font-medium">Flags:</span>{" "}
                            <span>
                              {episode.filler ? "Filler " : ""}
                              {episode.recap ? "Recap" : ""}
                              {!episode.filler && !episode.recap ? "None" : ""}
                            </span>
                          </div>
                          {episode.url && (
                            <div className="mt-1">
                              <a
                                href={episode.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-sm"
                              >
                                View on MyAnimeList
                              </a>
                            </div>
                          )}
                        </div>

                        {/* user episode progress state */}
                        <div className="mt-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                            <StateFilter
                              onChange={(state: string) =>
                                handleStateChange(
                                  episodeKey,
                                  state as FilterStatesType
                                )
                              }
                            />
                            {currentEpisodeState && (
                              <span>{": " + currentEpisodeState}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="text-sm text-muted-foreground">
              No episode data available.
            </div>
          )}
        </>
      )}
    </section>
  );
}
