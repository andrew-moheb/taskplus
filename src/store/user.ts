import { create } from "zustand";
import { v4 } from "uuid";
import { persist } from "zustand/middleware";

export type UserType = {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  password: string;
  points: number | null;
};

interface UsersState {
  users: UserType[];
  currentUser: UserType | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  saveNewPassword: boolean;
  signUp: (
    firstname: string,
    lastname: string,
    role: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updatePassword: (email: string, newpassword: string) => Promise<boolean>;
  updateUser: (
    useremail: string,
    firstname: string,
    lastname: string,
    role: string,
    newemail: string,
  ) => Promise<boolean>;
  addPoints: (userId: string, points: number) => void;
  redeemCoupon: (userId: string, cost: number) => boolean;
  clearError: () => void;
}

export const useUserStore = create<
  UsersState,
  [["zustand/persist", Partial<UsersState>]]
>(
  persist(
    (set, get) => ({
      // STATES
      users: [],
      currentUser: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      saveNewPassword: false,

      // ACTIONS
      signUp: async (firstname, lastname, role, email, password) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const existingUser = get().users.find((user) => user.email === email);
        if (existingUser) {
          set({ error: "User Already Exists", isLoading: false });
          return false;
        }

        const newUser: UserType = {
          id: v4(),
          firstname,
          lastname,
          role,
          email,
          password,
          points: 0,
        };

        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
          isLoading: false,
        }));

        return true;
      },

      // Sign in
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        // simulating Api delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const existingUser = get().users.find((user) => user.email === email);
        if (existingUser && existingUser.password === password) {
          set({
            isAuthenticated: true,
            isLoading: false,
            currentUser: existingUser,
          });
          return true;
        } else {
          set({
            error: "InCorrect Email or Password",
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      // SignOut
      signOut: () => {
        set({ currentUser: null, isAuthenticated: false, error: null });
      },

      // updatePassword

      updatePassword: async (email, newpassword) => {
        set({ isLoading: true, error: null });
        // simulating Api delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set((state) => ({
          users: state.users.map((user) =>
            user.email === email ? { ...user, password: newpassword } : user,
          ),
          isLoading: false,
          saveNewPassword: true,
        }));

        return true;
      },

      updateUser: async (useremail, firstname, lastname, role, newemail) => {
        set({ isLoading: true, error: null });
        // simulating Api delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set((state) => ({
          users: state.users.map((user) =>
            user.email === useremail
              ? { ...user, firstname, lastname, role, email: newemail }
              : user,
          ),

          currentUser:
            state.currentUser?.email === useremail
              ? {
                  ...state.currentUser,
                  firstname,
                  lastname,
                  role,
                  email: newemail,
                }
              : state.currentUser,
          isLoading: false,
        }));

        return true;
      },

      addPoints: (userId, points) =>
        set((state) => {
          if (points < 0) points === 0;
          const apply = (u: UserType) =>
            u.id === userId ? { ...u, points: (u.points ?? 0) + points } : u;

          return {
            users: state.users.map(apply),
            currentUser: state.currentUser
              ? apply(state.currentUser)
              : state.currentUser,
          };
        }),

      redeemCoupon: (userId, cost) => {
        const user = get().currentUser;
        if (!user || user.id !== userId) return false;
        if ((user.points ?? 0) < cost) return false; // 👈 parentheses

        const apply = (u: UserType) =>
          u.id === userId ? { ...u, points: (u.points ?? 0) - cost } : u;

        set((state) => ({
          users: state.users.map(apply),
          currentUser: state.currentUser
            ? apply(state.currentUser)
            : state.currentUser,
        }));

        return true;
      },

      // Clear Error
      clearError: () => set({ error: null }),
    }),
    {
      name: "user-store", // localStorage key
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
