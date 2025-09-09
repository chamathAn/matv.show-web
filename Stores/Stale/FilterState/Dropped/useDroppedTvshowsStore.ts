import axios from "axios";
import { createStore } from "zustand";
import { OneTvshowDetailsType } from "../../../../Shared/Types/tvshows-api.types";
import { useUserAllTvShowsStore } from "../../UserAll/useUserAllMATStore";

type DroppedTvshowsStore = {
  droppedTvshows: OneTvshowDetailsType[];
  isDroppedTvshowsFetched: boolean;
  fetchDroppedTvshows: () => void;
};

export const useDroppedTvshowsStore = createStore<DroppedTvshowsStore>()(
  (set) => ({
    droppedTvshows: [],
    isDroppedTvshowsFetched: false,

    fetchDroppedTvshows: async () => {
      try {
        await useUserAllTvShowsStore.getState().fetchUserTvShows();

        const droppedDBTvShows = useUserAllTvShowsStore
          .getState()
          .userAllTvShows.filter((tvshow) => tvshow.tvShowStates === "dropped");

        const tvshowIds = droppedDBTvShows.map((tvshow) => tvshow.tvShowId);
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

        set({ droppedTvshows: tvData, isDroppedTvshowsFetched: true });
      } catch (error) {
        console.error("Error fetching dropped TV shows:", error);
      }
    },
  })
);
