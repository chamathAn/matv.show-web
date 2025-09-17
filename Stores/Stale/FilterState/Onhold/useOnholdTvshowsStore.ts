import axios from "axios";
import { createStore } from "zustand";
import { OneTvshowDetailsType } from "../../../../Shared/Types/tvshows-api.types";
import { useUserAllTvShowsStore } from "../../UserAll/useUserAllMATStore";

type OnholdTvshowsStore = {
  onholdTvshows: OneTvshowDetailsType[];
  isOnholdTvshowsFetched: boolean;
  fetchOnholdTvshows: () => void;
};

export const useOnholdTvshowsStore = createStore<OnholdTvshowsStore>()(
  (set) => ({
    onholdTvshows: [],
    isOnholdTvshowsFetched: false,

    fetchOnholdTvshows: async () => {
      try {
        await useUserAllTvShowsStore.getState().fetchUserTvShows();

        const onholdDBTvShows = useUserAllTvShowsStore
          .getState()
          .userAllTvShows.filter((tvshow) => tvshow.tvShowStates === "onhold");

        const tvshowIds = onholdDBTvShows.map((tvshow) => tvshow.tvShowId);
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

        set({ onholdTvshows: tvData, isOnholdTvshowsFetched: true });
      } catch (error) {
        console.error("Error fetching onhold TV shows:", error);
      }
    },
  })
);
