import { v4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./user";
import { notify } from "@/utils/toast";

export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "inprogress" | "completed";

export type Attachment = {
  id: string;
  name: string; // original file name
  url: string; // base64 or object URL
  type: string; // "image/png", "application/pdf", etc.
  size: number; // in bytes
};

export type Task = {
  id: string;
  userId: string; // link task to specific user
  priority: Priority | null;
  title: string;
  description: string;
  status: Status | null;
  dueDate: string | null; // Daily due date / target date
  createdAt: string;
  points: number | null;
  attachments: Attachment[];
  pointsAwarded: boolean; // check if it is awarded once
};

interface TaskState {
  tasks: Task[];

  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateStatus: (id: string, status: Status) => void;
  getUserTasks: (userId: string) => Task[];
  addAttachments: (taskId: string, attachment: Omit<Attachment, "id">) => void;
  removeAttachments: (taskId: string, attachmentId: string) => void;
  getTotalTasksByUser: (userId: string) => number;
  getTotalUserTasksByType: (userId: string, status: Status) => number;
}

export const useTaskStore = create<
  TaskState,
  [["zustand/persist", Partial<TaskState>]]
>(
  persist(
    (set, get) => ({
      //States
      tasks: [],

      // ACTIONS

      // addTask
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: v4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      // updateTasks
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            return t.id === id ? { ...t, ...updates } : t;
          }),
        }));
      },

      // deleteTasks;
      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      // updateStatus

      updateStatus: (id, status) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const wasCompleted = task.status === "completed";
        const nowCompleted = status === "completed";

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: status } : t,
          ),
        }));

        const { addPoints } = useUserStore.getState();
        // add once logic
        if (!wasCompleted && nowCompleted && !task.pointsAwarded) {
          addPoints(task.userId, task.points ?? 0);
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, pointsAwarded: true } : t,
            ),
          }));
        }

        // reclaim logic
        if (wasCompleted && !nowCompleted && task.pointsAwarded) {
          addPoints(task.userId, -(task.points ?? 0));
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, pointsAwarded: false } : t,
            ),
          }));
        }

        notify.success("Status Updated successfully!");
      },

      // getUserTasks

      getUserTasks: (userId) => {
        return get().tasks.filter((task) => task.userId === userId);
      },

      // addAttachments

      addAttachments: (taskId, attachment) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  attachments: [...t.attachments, { ...attachment, id: v4() }],
                }
              : t,
          ),
        }));
      },

      // removeAttachments
      removeAttachments: (taskId, attachmentId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  attachments: t.attachments.filter(
                    (att) => att.id !== attachmentId,
                  ),
                }
              : t,
          ),
        }));
      },

      // get all userTasks
      getTotalTasksByUser: (userId: string) => {
        return get().tasks.filter((task) => task.userId === userId).length;
      },

      getTotalUserTasksByType: (userId: string, status: string) => {
        const userTasks = get().getUserTasks(userId);
        return userTasks.filter((task) => task.status === status).length;
      },
    }),
    {
      name: "tasks-store",
      partialize: (state) => ({ tasks: state.tasks }), // only persist tasks, not functions
    },
  ),
);
