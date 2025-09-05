import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";

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
        // * Sample dropped anime IDs
        const animeIds = [21, 813, 5114, 11757]; // e.g., One Piece, Death Note, FMAB, Code Geass

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
