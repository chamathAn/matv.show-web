import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";
import { useUserAllAnimesStore } from "../../UserAll/useUserAllMATStore";

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
        // fetch user anime from backend
        await useUserAllAnimesStore.getState().fetchUserAnimes();

        const planToWatchDBanimes = useUserAllAnimesStore
          .getState()
          .userAllAnimes.filter((anime) => anime.animeStates === "planToWatch");

        const animeIds = planToWatchDBanimes.map((anime) => anime.animeId);
        if (animeIds.length === 0) return; // if user has no anime, return

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
