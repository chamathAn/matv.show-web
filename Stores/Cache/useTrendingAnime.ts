import { createStore } from "zustand";
import Bottleneck from "bottleneck";
import { TrendingAnimeType } from "@/Shared/Types/anime-api.types";
import axios from "axios";

type TrendingAnime = {
  trendingAnimes: TrendingAnimeType[];
  fetchTrendingAnimes: () => Promise<void>;
  isTrendingAnimesFetched: boolean;
};
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});
export const useTrendingAnimes = createStore<TrendingAnime>()((set) => ({
  trendingAnimes: [],
  isTrendingAnimesFetched: false,
  fetchTrendingAnimes: async () => {
    try {
      const response = await limiter.schedule(() =>
        axios.get("https://api.jikan.moe/v4/top/anime")
      );
      set({
        trendingAnimes: response.data.data,
        isTrendingAnimesFetched: true,
      });
    } catch (error) {
      console.error("Error fetching trending animes:", error);
    }
  },
}));
