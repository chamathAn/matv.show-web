import { OneTvshowDetailsType } from "@/Shared/Types/tvshows-api.types";
import axios from "axios";
import { createStore } from "zustand";

type RecentlyWatchedTvshowsStore = {
  recentlyWatchedTvshows: OneTvshowDetailsType[];
  isRecentlyWatchedTvshowsFetched: boolean;
  fetchRecentlyWatchedTvshows: () => void;
};

export const useRecentlyWatchedTvshowsStore =
  createStore<RecentlyWatchedTvshowsStore>()((set) => ({
    recentlyWatchedTvshows: [],
    isRecentlyWatchedTvshowsFetched: false,
    fetchRecentlyWatchedTvshows: async () => {
      try {
        const res = await axios.get("https://api.themoviedb.org/3/tv/248852", {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
          },
        });
        console.log("API Response:", res.data);
        set((state) => ({
          recentlyWatchedTvshows: [...state.recentlyWatchedTvshows, res.data],
          isRecentlyWatchedTvshowsFetched: true,
        }));
      } catch (error) {
        console.error("Error fetching recently watched tv shows:", error);
      }
    },
  }));
