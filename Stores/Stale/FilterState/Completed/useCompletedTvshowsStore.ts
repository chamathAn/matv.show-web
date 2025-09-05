import axios from "axios";
import { createStore } from "zustand";
import { OneTvshowDetailsType } from "../../../../Shared/Types/tvshows-api.types";
import { useUserAllTvShowsStore } from "../../UserAll/useUserAllMATStore";

type CompletedTvshowsStore = {
  completedTvshows: OneTvshowDetailsType[];
  isCompletedTvshowsFetched: boolean;
  fetchCompletedTvshows: () => void;
};

export const useCompletedTvshowsStore = createStore<CompletedTvshowsStore>()(
  (set) => ({
    completedTvshows: [],
    isCompletedTvshowsFetched: false,

    fetchCompletedTvshows: async () => {
      try {
        // fetch user tv shows from backend
        await useUserAllTvShowsStore.getState().fetchUserTvShows();

        const completedDBTvShows = useUserAllTvShowsStore
          .getState()
          .userAllTvShows.filter(
            (tvshow) => tvshow.tvShowStates === "complete"
          );

        const tvshowIds = completedDBTvShows.map((tvshow) => tvshow.tvShowId);
        if (tvshowIds.length === 0) return; // if user has no tv shows, return

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

        set({
          completedTvshows: tvData,
          isCompletedTvshowsFetched: true,
        });
      } catch (error) {
        console.error("Error fetching completed TV shows:", error);
      }
    },
  })
);
