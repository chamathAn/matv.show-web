import { createStore } from "zustand";
import axios from "axios";

type AnimeRecommendationStore = {
  animeRecommendation: [];
  isAnimeRecommendationFetched: boolean;
  fetchAnimeRecommendation: () => Promise<void>;
  setAnimeRecommendation: (data: []) => void;
};

export const useAnimeRecommendationStore =
  createStore<AnimeRecommendationStore>((set) => ({
    animeRecommendation: [],
    isAnimeRecommendationFetched: false,
    fetchAnimeRecommendation: async () => {
      try {
        const animeRes = await axios.get(
          "https://api.jikan.moe/v4/anime/39535/recommendations"
        );
        set({
          animeRecommendation: animeRes.data.data,
          isAnimeRecommendationFetched: true,
        });
      } catch (error) {
        console.log(error);
      }
    },
    setAnimeRecommendation: () => {
      return;
    },
  }));
