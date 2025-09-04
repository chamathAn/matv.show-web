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
        // * sample ids
        const tvShowIds = [1396, 66732, 2316, 1668];

        const tvShowRequests = tvShowIds.map((id) =>
          axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
            },
          })
        );

        const responses = await Promise.all(tvShowRequests);

        const tvShowData = responses.map((res) => res.data);

        set({
          recentlyWatchedTvshows: tvShowData,
          isRecentlyWatchedTvshowsFetched: true,
        });
      } catch (error) {
        console.error("Error fetching recently watched tv shows:", error);
      }
    },
  }));
