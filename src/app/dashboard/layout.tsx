"use client";
import SideBar from "@/components/SideBar";
import { useUserStore } from "@/store/user";
import { Avatar, Badge, Flex, Grid, GridCol, Text } from "@mantine/core";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUserStore();
  return (
    <Grid
      columns={12}
      gap={"24px"}
      className="!p-6 !h-screen !overflow-hidden !m-0 bg-background"
    >
      <GridCol span={2}>
        <SideBar />
      </GridCol>
      <GridCol
        span={10}
        className="w-full flex flex-col gap-6 h-[calc(100vh-48px)]"
      >
        <Flex justify={"space-between"} align={"center"}>
          <Badge
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
            size="lg"
            py={16}
            fw={500}
          >
            Your Points {currentUser?.points}
          </Badge>
          <Flex gap={12} justify={"end"} align={"center"}>
            <Avatar
              className="rounded-4xl"
              name={currentUser?.firstname}
              color="initials"
            />
            <Flex direction={"column"} gap={0}>
              <Text fw={500} c={"#121212"}>
                {currentUser?.firstname} {currentUser?.lastname}
              </Text>
              <Text fw={400} c={"#888888"} fz={14}>
                {currentUser?.role}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        {children}
      </GridCol>
    </Grid>
  );
}

export default DashboardLayout;
