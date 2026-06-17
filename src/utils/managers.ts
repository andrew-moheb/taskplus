import { useUserStore } from "@/store/user";

export const getAllManagers = () => {
  const { users } = useUserStore();
  const managersData = users
    .filter((u) => u.role === "Manager")
    .map((u) => ({
      label: u.firstname,
      value: u.id,
    }));

  return managersData;
};
