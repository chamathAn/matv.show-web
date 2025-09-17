import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";
import { useUserAllAnimesStore } from "../../UserAll/useUserAllMATStore";
import Bottleneck from "bottleneck";

type OnholdAnimesStore = {
  onholdAnimes: AnimeFullDetailsType[];
  isOnholdAnimesFetched: boolean;
  fetchOnholdAnimes: () => void;
};
// rate limit
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

export const useOnholdAnimesStore = createStore<OnholdAnimesStore>()((set) => ({
  onholdAnimes: [],
  isOnholdAnimesFetched: false,

  fetchOnholdAnimes: async () => {
    try {
      // fetch user anime from backend
      await useUserAllAnimesStore.getState().fetchUserAnimes();

      const planToWatchDBanimes = useUserAllAnimesStore
        .getState()
        .userAllAnimes.filter((anime) => anime.animeStates === "onhold");

      const animeIds = planToWatchDBanimes.map((anime) => anime.animeId);
      if (animeIds.length === 0) return; // if user has no anime, return

      const animeRequests = animeIds.map((id) =>
        limiter.schedule(() =>
          axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
        )
      );

      const responses = await Promise.all(animeRequests);
      const animeData = responses.map((res) => res.data.data);

      set({ onholdAnimes: animeData, isOnholdAnimesFetched: true });
    } catch (error) {
      console.error("Error fetching onhold animes:", error);
    }
  },
}));
