import axios from "axios";
import { createStore } from "zustand";
import { OneTvshowDetailsType } from "../../../../Shared/Types/tvshows-api.types";
import { useUserAllTvShowsStore } from "../../UserAll/useUserAllMATStore";

type WatchingTvshowsStore = {
  watchingTvshows: OneTvshowDetailsType[];
  isWatchingTvshowsFetched: boolean;
  fetchWatchingTvshows: () => void;
};

export const useWatchingTvshowsStore = createStore<WatchingTvshowsStore>()(
  (set) => ({
    watchingTvshows: [],
    isWatchingTvshowsFetched: false,

    fetchWatchingTvshows: async () => {
      try {
        await useUserAllTvShowsStore.getState().fetchUserTvShows();

        const watchingDBTvShows = useUserAllTvShowsStore
          .getState()
          .userAllTvShows.filter(
            (tvshow) => tvshow.tvShowStates === "watching"
          );

        const tvshowIds = watchingDBTvShows.map((tvshow) => tvshow.tvShowId);
        if (tvshowIds.length === 0) return;

        const tvRequests = tvshowIds.map((id) =>
          axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
            },
          })
        );

        const responses = await Promise.all(tvRequests);
        const tvData = responses.map((res) => res.data);

        set({ watchingTvshows: tvData, isWatchingTvshowsFetched: true });
      } catch (error) {
        console.error("Error fetching watching TV shows:", error);
      }
    },
  })
);
