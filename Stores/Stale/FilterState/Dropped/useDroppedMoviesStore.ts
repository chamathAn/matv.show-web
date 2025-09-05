import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";

type DroppedMoviesStore = {
  droppedMovies: OneMovieDetailsType[];
  isDroppedMoviesFetched: boolean;
  fetchDroppedMovies: () => void;
};

export const useDroppedMoviesStore = createStore<DroppedMoviesStore>()(
  (set) => ({
    droppedMovies: [],
    isDroppedMoviesFetched: false,

    fetchDroppedMovies: async () => {
      try {
        // * Sample dropped movie IDs
        const movieIds = [13, 769, 550, 122]; // e.g., Fast & Furious, Titanic, Fight Club, The Lord of the Rings

        const movieRequests = movieIds.map((id) =>
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer " + process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
            },
          })
        );

        const responses = await Promise.all(movieRequests);
        const movieData = responses.map((res) => res.data);

        set({ droppedMovies: movieData, isDroppedMoviesFetched: true });
      } catch (error) {
        console.error("Error fetching dropped movies:", error);
      }
    },
  })
);
