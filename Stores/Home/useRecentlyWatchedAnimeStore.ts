import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";

type RecentlyWatchedAnimesStore = {
  recentlyWatchedAnimes: AnimeFullDetailsType[];
  isRecentlyWatchedAnimesFetched: boolean;
  fetchRecentlyWatchedAnimes: () => void;
};

export const useRecentlyWatchedAnimesStore =
  createStore<RecentlyWatchedAnimesStore>()((set) => ({
    recentlyWatchedAnimes: [],
    isRecentlyWatchedAnimesFetched: false,

    fetchRecentlyWatchedAnimes: async () => {
      try {
        // * this is how it should fetch the ids of recently watched ones
        const animeIds = [39535, 20, 5114, 30276]; // Example MAL IDs

        const animeRequests = animeIds.map((id) =>
          axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
        );

        const responses = await Promise.all(animeRequests);

        const animeData = responses.map((res) => res.data.data);

        set({
          recentlyWatchedAnimes: animeData,
          isRecentlyWatchedAnimesFetched: true,
        });
      } catch (error) {
        console.error("Error fetching recently watched animes:", error);
      }
    },
  }));
