import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";

type OnholdAnimesStore = {
  onholdAnimes: AnimeFullDetailsType[];
  isOnholdAnimesFetched: boolean;
  fetchOnholdAnimes: () => void;
};

export const useOnholdAnimesStore = createStore<OnholdAnimesStore>()((set) => ({
  onholdAnimes: [],
  isOnholdAnimesFetched: false,

  fetchOnholdAnimes: async () => {
    try {
      // * Sample onhold anime IDs
      const animeIds = [16498, 11061, 20, 9253]; // Fairy Tail, Hunter x Hunter, Naruto, Steins;Gate

      const animeRequests = animeIds.map((id) =>
        axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
      );

      const responses = await Promise.all(animeRequests);
      const animeData = responses.map((res) => res.data.data);

      set({ onholdAnimes: animeData, isOnholdAnimesFetched: true });
    } catch (error) {
      console.error("Error fetching onhold animes:", error);
    }
  },
}));
