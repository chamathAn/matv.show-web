import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";

type WatchingAnimesStore = {
  watchingAnimes: AnimeFullDetailsType[];
  isWatchingAnimesFetched: boolean;
  fetchWatchingAnimes: () => void;
};

export const useWatchingAnimesStore = createStore<WatchingAnimesStore>()(
  (set) => ({
    watchingAnimes: [],
    isWatchingAnimesFetched: false,

    fetchWatchingAnimes: async () => {
      try {
        // * Sample watching anime IDs
        const animeIds = [1, 5114, 11061, 16498]; // Cowboy Bebop, FMAB, Hunter x Hunter, Fairy Tail

        const animeRequests = animeIds.map((id) =>
          axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
        );

        const responses = await Promise.all(animeRequests);
        const animeData = responses.map((res) => res.data.data);

        set({ watchingAnimes: animeData, isWatchingAnimesFetched: true });
      } catch (error) {
        console.error("Error fetching watching animes:", error);
      }
    },
  })
);
