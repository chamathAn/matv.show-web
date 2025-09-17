import { create } from "zustand";

interface UserLogStateProps {
  isUserLoggedIn: boolean;
}

// Zustand Store User Log state
export const userLogStore = create<UserLogStateProps>(() => ({
  isUserLoggedIn: false,
}));
