import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";
import { useUserAllAnimesStore } from "../../UserAll/useUserAllMATStore";
import Bottleneck from "bottleneck";

type CompletedAnimesStore = {
  completedAnimes: AnimeFullDetailsType[];
  isCompletedAnimesFetched: boolean;
  fetchCompletedAnimes: () => void;
};
// rate limit
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

export const useCompletedAnimesStore = createStore<CompletedAnimesStore>()(
  (set) => ({
    completedAnimes: [],
    isCompletedAnimesFetched: false,

    fetchCompletedAnimes: async () => {
      try {
        // fetch user anime from backend
        await useUserAllAnimesStore.getState().fetchUserAnimes();

        const planToWatchDBanimes = useUserAllAnimesStore
          .getState()
          .userAllAnimes.filter((anime) => anime.animeStates === "completed");

        const animeIds = planToWatchDBanimes.map((anime) => anime.animeId);
        if (animeIds.length === 0) return; // if user has no anime, return

        const animeRequests = animeIds.map((id) =>
          limiter.schedule(() =>
            axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
          )
        );

        const responses = await Promise.all(animeRequests);

        const animeData = responses.map((res) => res.data.data);

        set({
          completedAnimes: animeData,
          isCompletedAnimesFetched: true,
        });
      } catch (error) {
        console.error("Error fetching completed animes:", error);
      }
    },
  })
);
