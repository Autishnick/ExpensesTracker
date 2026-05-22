import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/lib/api";

interface UserWithPassword extends User {
  password?: string; // Keep password optional in the type for safety
}

interface AuthState {
  currentUser: User | null;
  users: UserWithPassword[];
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Client-side cookie helpers
const setSessionCookie = (username: string) => {
  if (typeof window === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  // Store encoded username in cookie
  document.cookie = `family-tracker-session=${encodeURIComponent(
    username
  )};path=/;expires=${date.toUTCString()};SameSite=Strict`;
};

const deleteSessionCookie = () => {
  if (typeof window === "undefined") return;
  document.cookie = "family-tracker-session=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;SameSite=Strict";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isHydrated: false,
      setHydrated: (state) => set({ isHydrated: state }),

      login: async (username, password) => {
        // Simulate a slight delay for better UX (loading spinners)
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const { users } = get();
        const foundUser = users.find(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        );

        if (!foundUser) {
          return { success: false, error: "Користувача не знайдено" };
        }

        if (foundUser.password !== password) {
          return { success: false, error: "Неправильний пароль" };
        }

        const user: User = { id: foundUser.id, username: foundUser.username };
        set({ currentUser: user });
        setSessionCookie(user.username);
        return { success: true };
      },

      register: async (username, password) => {
        await new Promise((resolve) => setTimeout(resolve, 850));

        const { users } = get();
        const exists = users.some(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        );

        if (exists) {
          return { success: false, error: "Користувач з таким ім'ям вже існує" };
        }

        const newUser: UserWithPassword = {
          id: Math.random().toString(36).substring(2, 9),
          username,
          password,
        };

        const updatedUsers = [...users, newUser];
        const user: User = { id: newUser.id, username: newUser.username };

        set({ users: updatedUsers, currentUser: user });
        setSessionCookie(user.username);
        return { success: true };
      },

      logout: () => {
        set({ currentUser: null });
        deleteSessionCookie();
      },
    }),
    {
      name: "family-tracker-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
