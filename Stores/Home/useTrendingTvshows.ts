import { TrendingTvShowsType } from "@/Shared/Types/tvshows-api.types";
import axios from "axios";
import { createStore } from "zustand";

type TrendingTvshowsStore = {
  trendingTvshows: TrendingTvShowsType[];
  isTrendingTvshowsFetched: boolean;
  fetchTrendingTvshows: () => void;
};

export const useTrendingTvshows = createStore<TrendingTvshowsStore>()(
  (set) => ({
    trendingTvshows: [],
    isTrendingTvshowsFetched: false,

    fetchTrendingTvshows: async () => {
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/trending/tv/day",
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
            },
          }
        );

        set({
          trendingTvshows: res.data.results,
          isTrendingTvshowsFetched: true,
        });
      } catch (error) {
        console.error("Error fetching trending TV shows:", error);
      }
    },
  })
);
