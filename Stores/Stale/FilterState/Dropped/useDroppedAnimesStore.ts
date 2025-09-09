import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";
import { useUserAllAnimesStore } from "../../UserAll/useUserAllMATStore";

type DroppedAnimesStore = {
  droppedAnimes: AnimeFullDetailsType[];
  isDroppedAnimesFetched: boolean;
  fetchDroppedAnimes: () => void;
};

export const useDroppedAnimesStore = createStore<DroppedAnimesStore>()(
  (set) => ({
    droppedAnimes: [],
    isDroppedAnimesFetched: false,

    fetchDroppedAnimes: async () => {
      try {
        // fetch user anime from backend
        await useUserAllAnimesStore.getState().fetchUserAnimes();

        const planToWatchDBanimes = useUserAllAnimesStore
          .getState()
          .userAllAnimes.filter((anime) => anime.animeStates === "dropped");

        const animeIds = planToWatchDBanimes.map((anime) => anime.animeId);
        if (animeIds.length === 0) return; // if user has no anime, return

        const animeRequests = animeIds.map((id) =>
          axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
        );

        const responses = await Promise.all(animeRequests);
        const animeData = responses.map((res) => res.data.data);

        set({ droppedAnimes: animeData, isDroppedAnimesFetched: true });
      } catch (error) {
        console.error("Error fetching dropped animes:", error);
      }
    },
  })
);
