"use client";

import { Flex, Text } from "@mantine/core";
import {
  MdDashboard,
  MdOutlineTask,
  MdLogout,
  MdSettings,
  MdCardGiftcard,
  MdNoteAdd,
} from "react-icons/md";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "../store/user";
import Link from "next/link";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <MdDashboard size={20} />,
    href: "/dashboard",
  },
  {
    label: "My Tasks",
    icon: <MdOutlineTask size={20} />,
    href: "/dashboard/my-tasks",
  },
  {
    label: "My Requests",
    icon: <MdNoteAdd size={20} />,
    href: "/dashboard/my-requests",
  },
  {
    label: "Coupons Store",
    icon: <MdCardGiftcard size={20} />,
    href: "/dashboard/coupons-store",
  },
  {
    label: "Settings",
    icon: <MdSettings size={20} />,
    href: "/dashboard/settings",
  },
];

export default function SideBar() {
  const router = useRouter();
  const pathName = usePathname();
  const { currentUser, signOut } = useUserStore();

  const handleLogout = () => {
    signOut();
    router.push("/auth");
  };

  return (
    <aside className="w-full h-[calc(100vh-48px)] rounded-xxl bg-white flex flex-col justify-between py-8  ">
      {/* Top — Logo + Nav */}
      <Flex direction="column">
        {/* Logo */}
        <div className="mx-auto mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            quality={100}
            height={30}
          />
        </div>
        <Flex direction={"column"} gap={12}>
          {navItems.map((item) => {
            const isActive = pathName === item.href;
            return (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-3 px-8 py-4  w-full transition-all duration-200
                ${
                  isActive
                    ? "bg-primary/10 text-primary  border-r-4 border-primary"
                    : "text-text-light hover:text-text-normal  hover:bg-gray-50"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </Flex>
      </Flex>
      {/* Bottom — Logout */}
      <Link
        href={"/auth"}
        onClick={handleLogout}
        className="flex items-center gap-3   px-8 py-4   text-error hover:bg-red-50 transition-all duration-200 w-full"
      >
        <MdLogout size={20} />
        <Text className="text-[16px]" fw={500} c="red">
          Logout
        </Text>
      </Link>
    </aside>
  );
}
