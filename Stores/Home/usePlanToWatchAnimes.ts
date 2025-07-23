import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";

type PlanToWatchAnimesStore = {
  planToWatchAnimes: AnimeFullDetailsType[];
  isPlanToWatchAnimesFetched: boolean;
  fetchPlanToWatchAnimes: () => void;
};

export const usePlanToWatchAnimesStore = createStore<PlanToWatchAnimesStore>()(
  (set) => ({
    planToWatchAnimes: [],
    isPlanToWatchAnimesFetched: false,

    fetchPlanToWatchAnimes: async () => {
      try {
        // * Sampel Ids
        const animeIds = [1, 5114, 11061, 16498];

        const animeRequests = animeIds.map((id) =>
          axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
        );

        const responses = await Promise.all(animeRequests);

        const animeData = responses.map((res) => res.data.data);

        set({
          planToWatchAnimes: animeData,
          isPlanToWatchAnimesFetched: true,
        });
      } catch (error) {
        console.error("Error fetching plan to watch animes:", error);
      }
    },
  })
);
