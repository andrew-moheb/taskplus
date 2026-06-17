import { fail } from "assert";
import { toast, Zoom } from "react-toastify";

const playSound = () => {
  const audio = new Audio("/sounds/successSound.mp3");
  audio.play();
};

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 2000,
      theme: "light",
      transition: Zoom,
      onOpen: playSound,
    }),
  fail: (message: string) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 2000,
      theme: "light",
      transition: Zoom,
      onOpen: playSound,
    });
  },
};
