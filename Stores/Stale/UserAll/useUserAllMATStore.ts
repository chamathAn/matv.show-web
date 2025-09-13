// useUserAllTvShows.ts

import axios from "axios";
import { create } from "zustand";
import { userLogStore } from "./userLogStore";

interface UserAllTvShowsState {
  loading: boolean;
  userAllTvShows: [];
  isUserTvShowsFetched: boolean;
  fetchUserTvShows: () => Promise<void>;
}

interface UserAllMoviesState {
  loading: boolean;
  userAllMovies: [];
  isUserMoviesFetched: boolean;
  fetchUserMovies: () => Promise<void>;
}

interface UserAllAnimesState {
  loading: boolean;
  userAllAnimes: [];
  isUserAnimesFetched: boolean;
  fetchUserAnimes: () => Promise<void>;
}

// Zustand Store for TV Shows
export const useUserAllTvShowsStore = create<UserAllTvShowsState>((set) => ({
  loading: false,
  isUserTvShowsFetched: false,
  userAllTvShows: [],
  fetchUserTvShows: async () => {
    try {
      if (!userLogStore.getState().isUserLoggedIn) return;
      set({ loading: true });
      const res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/tv-shows/",
        { withCredentials: true }
      );
      set({
        userAllTvShows: res.data,
        isUserTvShowsFetched: true,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching TV Shows:", error);
      set({ loading: false });
    }
  },
}));

// Zustand Store for Movies
export const useUserAllMoviesStore = create<UserAllMoviesState>((set) => ({
  loading: false,
  isUserMoviesFetched: false,
  userAllMovies: [],
  fetchUserMovies: async () => {
    if (!userLogStore.getState().isUserLoggedIn) return;
    try {
      set({ loading: true });
      const res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/movies/",
        { withCredentials: true }
      );
      set({
        userAllMovies: res.data,
        isUserMoviesFetched: true,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching Movies:", error);
      set({ loading: false });
    }
  },
}));

// Zustand Store for Animes
export const useUserAllAnimesStore = create<UserAllAnimesState>((set) => ({
  loading: false,
  isUserAnimesFetched: false,
  userAllAnimes: [],
  fetchUserAnimes: async () => {
    if (!userLogStore.getState().isUserLoggedIn) return;
    try {
      set({ loading: true });
      const res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/animes/",
        { withCredentials: true }
      );
      set({
        userAllAnimes: res.data,
        isUserAnimesFetched: true,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching Animes:", error);
      set({ loading: false });
    }
  },
}));
