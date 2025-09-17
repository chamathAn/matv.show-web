import { createStore } from "zustand";
import axios from "axios";
import { AnimeFullDetailsType } from "@/Shared/Types/anime-api.types";
import Bottleneck from "bottleneck";

type AnimeRecommendationStore = {
  fullAnimeDetails: AnimeFullDetailsType[];
  isAnimeRecommendationFetched: boolean;
  fetchAnimeRecommendation: () => Promise<void>;
};
// rate limit
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

export const useAnimeRecommendationStore =
  createStore<AnimeRecommendationStore>((set) => ({
    animeRecommendation: [],
    fullAnimeDetails: [],
    isAnimeRecommendationFetched: false,
    fetchAnimeRecommendation: async () => {
      try {
        // fetching anime recommendations
        const animeRes = await limiter.schedule(() =>
          axios.get("https://api.jikan.moe/v4/anime/39535/recommendations")
        );

        // fetching full details of recommended animes
        const fullDetArr = [];
        for (let i = 0; i < 2; i++) {
          const res = await limiter.schedule(() =>
            axios.get(
              `https://api.jikan.moe/v4/anime/${animeRes.data.data[i].entry.mal_id}/full`
            )
          );

          fullDetArr.push(res.data.data);
        }
        set({
          fullAnimeDetails: fullDetArr,
          isAnimeRecommendationFetched: true,
        });
      } catch (error) {
        console.log(error);
      }
    },
  }));
