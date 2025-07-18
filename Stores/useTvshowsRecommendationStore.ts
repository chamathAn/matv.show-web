import { TvshowRecommendationType } from "@/Shared/Types/tvshows-api.types";
import axios from "axios";
import { createStore } from "zustand";

type TvshowRecommendationStore = {
  tvshowRecommendation: TvshowRecommendationType[];
  isTvshowRecommendationFetched: boolean;
  fetchTvshowRecommendation: () => Promise<void>;
};

export const useTvshowRecommendationStore =
  createStore<TvshowRecommendationStore>((set) => ({
    tvshowRecommendation: [],
    isTvshowRecommendationFetched: false,
    fetchTvshowRecommendation: async () => {
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/tv/1396/recommendations",
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
            },
          }
        );
        set({
          tvshowRecommendation: res.data.results.slice(0, 2),
          isTvshowRecommendationFetched: true,
        });
      } catch (error) {
        console.error("Error fetching tvshow recommendation:", error);
      }
    },
  }));
