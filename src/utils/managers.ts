import { useUserStore } from "@/store/user";

export const useAllManagers = () => {
  const { users } = useUserStore();
  const managersData = users
    .filter((u) => u.role === "Manager")
    .map((u) => ({
      label: u.firstname,
      value: u.id,
    }));

  return managersData;
};
