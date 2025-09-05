import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";

type CompletedAnimesStore = {
  completedAnimes: AnimeFullDetailsType[];
  isCompletedAnimesFetched: boolean;
  fetchCompletedAnimes: () => void;
};

export const useCompletedAnimesStore = createStore<CompletedAnimesStore>()(
  (set) => ({
    completedAnimes: [],
    isCompletedAnimesFetched: false,

    fetchCompletedAnimes: async () => {
      try {
        // * Sample Ids for completed animes
        const animeIds = [20, 5114, 9253, 11061]; // Naruto, FMAB, Steins;Gate, Hunter x Hunter

        const animeRequests = animeIds.map((id) =>
          axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
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
