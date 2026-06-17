import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 } from "uuid";

export type RequestStatus = "pending" | "approved" | "rejected";

export type LeaveType =
  | "annual"
  | "sick"
  | "unpaid"
  | "maternity"
  | "paternity"
  | "emergency"
  | "other";

export type leaveDayType = "Full Day" | "Partial Day";

export type Kind = "leave" | "overTime" | "remoteWork" | "loan";

// first request type (leave)
export type LeaveRequest = {
  kind: "leave";
  dayType: leaveDayType | "";
  leaveType: LeaveType | "";
  startDate: string | "";
  endDate: string | "";
  reason: string | "";
  managerId: string;
};

// other request kinds

export type OverTime = {
  kind: "overTime";
  date: string;
  startTime: string | "";
  endTime: string | "";
  reason: string | "";
  managerId: string;
};

// Remote Work

export type RemoteWork = {
  kind: "remoteWork";
  date: string | "";
  reason: string | "";
  managerId: string;
};

export type Loan = {
  kind: "loan";
  loanReason: string | "";
  Amount: number | 0 | string;
  detailedExplanation: string;
  managerId: string;
};

export type RequestPayload = LeaveRequest | OverTime | RemoteWork | Loan;

// full record plus Meta Data
export type RequestRecord = RequestPayload & {
  id: string;
  userId: string; // link request with user
  requestStatus: RequestStatus;
  managerNote: string;
  reviewedBy: string;
  reviewedAt: string;
  createdAt: string;
};

interface RequestState {
  requests: RequestRecord[];

  // employee
  addRequest: (userId: string, payload: RequestPayload) => void;
  cancelRequest: (id: string) => void;
  getUserRequests: (userId: string) => RequestRecord[];
  getUserRequestByKind: (userId: string, kind: string) => RequestPayload[];

  // manager
  approve: (requestId: string, managerId: string, note?: string) => void;
  reject: (requestId: string, managerId: string, note?: string) => void;
  getPendingRequests: () => RequestRecord[];
  getByKind: (kind: string) => RequestRecord[];
  getAllRequests: (managerId: string) => RequestRecord[];
  getRequestById: (requestId: string) => RequestRecord | undefined;
}

export const useRequestStore = create<
  RequestState,
  [["zustand/persist", Partial<RequestState>]]
>(
  persist(
    (set, get) => ({
      requests: [],

      // AddRequest
      addRequest: (userId, request) => {
        const newRequest: RequestRecord = {
          ...request,
          id: v4(),
          userId,
          requestStatus: "pending",
          managerNote: "",
          reviewedBy: "",
          reviewedAt: "",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ requests: [...state.requests, newRequest] }));
      },

      // deleteRequest
      cancelRequest: (requestId: string) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === requestId && request.requestStatus === "pending"
              ? {
                  ...request,
                  requestStatus: "rejected",
                }
              : request,
          ),
        }));
      },

      // getuserRequest

      getUserRequests: (userId: string) =>
        get().requests.filter((r) => r.userId === userId),

      getUserRequestByKind: (userId, kind) =>
        get().requests.filter((r) => r.userId === userId && r.kind === kind),

      // managerHandlers

      approve: (requestId: string, managerId: string, note?: string) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  requestStatus: "approved",
                  reviewedBy: managerId,
                  reviewedAt: new Date().toISOString(),
                  managerNote: note ?? "",
                }
              : r,
          ),
        }));
      },

      reject: (requestId: string, managerId: string, note?: string) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  requestStatus: "rejected",
                  reviewedBy: managerId,
                  reviewedAt: new Date().toISOString(),
                  managerNote: note ?? "",
                }
              : r,
          ),
        }));
      },
      getByKind: (kind: string) =>
        get().requests.filter((r) => r.kind === kind),
      getPendingRequests: () =>
        get().requests.filter((r) => r.requestStatus === "pending"),
      getAllRequests: (managerId: string) =>
        get().requests.filter((r) => r.managerId === managerId),
      getRequestById: (requestId) =>
        get().requests.find((r) => r.id === requestId),
    }),
    {
      name: "requests-store",
      partialize: (state) => ({ requests: state.requests }),
    },
  ),
);
