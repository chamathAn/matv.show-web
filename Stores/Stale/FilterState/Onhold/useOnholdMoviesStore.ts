import { OneMovieDetailsType } from "@/Shared/Types/movie-api.types";
import axios from "axios";
import { createStore } from "zustand";

type OnholdMoviesStore = {
  onholdMovies: OneMovieDetailsType[];
  isOnholdMoviesFetched: boolean;
  fetchOnholdMovies: () => void;
};

export const useOnholdMoviesStore = createStore<OnholdMoviesStore>()((set) => ({
  onholdMovies: [],
  isOnholdMoviesFetched: false,

  fetchOnholdMovies: async () => {
    try {
      // * Sample onhold movie IDs
      const movieIds = [680, 500, 27205, 155]; // Pulp Fiction, Reservoir Dogs, The Dark Knight, The Dark Knight Rises

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

      set({ onholdMovies: movieData, isOnholdMoviesFetched: true });
    } catch (error) {
      console.error("Error fetching onhold movies:", error);
    }
  },
}));
