import { create } from "zustand";

type ModalState = {
  opened: boolean;
  open: () => void;
  close: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  opened: false,
  open: () => set({ opened: true }),
  close: () => set({ opened: false }),
}));

export const useNewsModalStore = create<ModalState>((set) => ({
  opened: false,
  open: () => set({ opened: true }),
  close: () => set({ opened: false }),
}));
