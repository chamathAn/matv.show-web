import { OneTvshowDetailsType } from "@/Shared/Types/tvshows-api.types";
import axios from "axios";
import { createStore } from "zustand";

type OneTvshowDetails = {
  loading: boolean;
  tvId: string;
  oneTvshowdetails: OneTvshowDetailsType;
  isOneTvshowDetialsFetched: boolean;
  fetchOneTvshowDetails: () => Promise<void>;
};

export const useOneTvshowDetailsStore = createStore<OneTvshowDetails>(
  (set) => ({
    loading: false,
    tvId: "",
    oneTvshowdetails: Object.create(null),
    isOneTvshowDetialsFetched: false,
    fetchOneTvshowDetails: async () => {
      try {
        set({ loading: true });
        const res = await axios.get(
          ` https://api.themoviedb.org/3/tv/${
            useOneTvshowDetailsStore.getState().tvId
          }`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
            },
          }
        );
        set({
          oneTvshowdetails: res.data,
          isOneTvshowDetialsFetched: true,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching one tvshow details:", error);
      }
    },
  })
);
