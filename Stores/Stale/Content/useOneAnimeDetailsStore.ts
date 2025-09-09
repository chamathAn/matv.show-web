import {
  OneAnimeDetailsType,
  OneAnimeEpisodesType,
} from "@/Shared/Types/anime-api.types";
import axios from "axios";
import { createStore } from "zustand";

type AnimeEpisode = OneAnimeEpisodesType["data"][0];

type OneAnimeDetails = {
  loading: boolean;
  animeId: string;
  oneAnimeDetails: OneAnimeDetailsType | Record<string, unknown>;
  isOneAnimeDetailsFetched: boolean;
  allEpisodes: AnimeEpisode[];
  fetchOneAnimeDetails: () => Promise<void>;
};

export const useOneAnimeDetailsStore = createStore<OneAnimeDetails>((set) => ({
  loading: false,
  animeId: "",
  oneAnimeDetails: Object.create(null),
  allEpisodes: [],
  isOneAnimeDetailsFetched: false,

  fetchOneAnimeDetails: async () => {
    try {
      set({ loading: true });

      const id = useOneAnimeDetailsStore.getState().animeId;
      if (!id) {
        console.error("animeId is not set on useOneAnimeDetailsStore");
        set({ loading: false });
        return;
      }

      const detailsRes = await axios.get(
        `https://api.jikan.moe/v4/anime/${id}/full`
      );

      const detailsData = detailsRes.data?.data;
      set({ oneAnimeDetails: detailsData ?? {} });

      useOneAnimeDetailsStore.getState().allEpisodes.length = 0;

      const episodesFirstRes = await axios.get(
        `https://api.jikan.moe/v4/anime/${id}/episodes`
      );
      const firstPage: OneAnimeEpisodesType = episodesFirstRes.data;
      if (Array.isArray(firstPage?.data)) {
        useOneAnimeDetailsStore.getState().allEpisodes.push(...firstPage.data);
      }

      const lastPage = firstPage?.pagination?.last_visible_page ?? 1;

      for (let page = 2; page <= lastPage; page++) {
        const pageRes = await axios.get(
          `https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`
        );
        const pageData: OneAnimeEpisodesType = pageRes.data;
        if (Array.isArray(pageData?.data)) {
          useOneAnimeDetailsStore.getState().allEpisodes.push(...pageData.data);
        }
      }

      set({ isOneAnimeDetailsFetched: true, loading: false });
    } catch (error) {
      console.error("Error fetching one anime details:", error);
      set({ loading: false });
    }
  },
}));
