"use client";

import NewsCard from "@/components/NewsCard";
import RequestCard from "@/components/RequestCard";
import ProgressRing from "@/components/RingProgress";
import { useRequestStore } from "@/store/Requests";
import { Status, useTaskStore } from "@/store/tasks";
import { useUserStore } from "@/store/user";
import { calculateTaskPercentage } from "@/utils/percentage";
import { Box, Button, Flex, Group, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { BsPlus } from "react-icons/bs";
import { Carousel } from "@mantine/carousel";
import AddRequestModal from "@/components/AddRequestModal";
import { useNewsModalStore, useModalStore } from "@/store/Modal";
import { ToastContainer } from "react-toastify";
import { News } from "@/dummyData";
import NewsModal from "@/components/NewsModal";

function Dashboard() {
  const status = [
    { label: "todo", color: "#ff2f43" },
    { label: "inprogress", color: "#f98016" },
    { label: "completed", color: "#3cac04" },
  ];
  const {
    opened: requestOpened,
    open: openRequest,
    close: closeRequest,
  } = useModalStore();

  const {
    opened: newsOpened,
    open: openNews,
    close: closeNews,
  } = useNewsModalStore();

  const { currentUser } = useUserStore();
  const { getTotalTasksByUser, getTotalUserTasksByType } = useTaskStore();
  const { getUserRequests } = useRequestStore();
  const userRequests = getUserRequests(currentUser?.id as string);
  const router = useRouter();

  const handleTaskPercentage = (status: Status): number => {
    if (!currentUser) return 0;
    const type = getTotalUserTasksByType(currentUser.id as string, status);
    const total = getTotalTasksByUser(currentUser?.id as string);

    return calculateTaskPercentage(type, total);
  };

  const seeRequest = (id: string) => {
    router.push(`/dashboard/my-requests/${id}`);
  };

  return (
    <Stack gap={16} className="h-screen overflow-y-auto">
      <Flex gap={16}>
        <Box
          w={"50%"}
          pt={24}
          pl={24}
          pr={24}
          pb={44}
          className="rounded-3xl"
          bg={"white"}
        >
          <Flex direction={"column"} gap={2}>
            <Text fw={500} fz={16} c={"#121212"}>
              Tasks
            </Text>
            <Text fw={400} fz={14} c={"#888888"}>
              Follow up with your tasks progress.
            </Text>
          </Flex>
          <Group mt={52} justify="space-between" gap={16}>
            {status.map((st) => (
              <ProgressRing
                key={st.label}
                taskNumber={getTotalUserTasksByType(
                  currentUser?.id as string,
                  st.label as Status,
                )}
                sectionPercentage={handleTaskPercentage(st.label as Status)}
                taskName={st.label}
                color={st.color}
              />
            ))}
          </Group>
        </Box>
        <Box
          w={"50%"}
          pt={24}
          pl={24}
          pr={24}
          pb={44}
          className="rounded-3xl"
          bg={"white"}
        >
          <Flex justify={"space-between"}>
            <Flex direction={"column"} gap={2}>
              <Text fw={500} fz={16} c={"#121212"}>
                Requests
              </Text>
              <Text fw={400} fz={14} c={"#888888"}>
                Your approved and pending requests.
              </Text>
            </Flex>
            <Button
              variant="transparent"
              styles={{
                section: {
                  marginRight: 4, // default is usually ~8px
                },
              }}
              leftSection={<BsPlus size={24} />}
              onClick={openRequest}
            >
              Create Request
            </Button>
          </Flex>
          {userRequests.length === 0 ? (
            <Flex align={"center"} justify={"center"} h={"100%"}>
              <Text>No Requests yet</Text>
            </Flex>
          ) : (
            <Carousel
              height={200}
              slideSize="70%"
              slideGap={16}
              mt={20}
              p={0}
              emblaOptions={{
                loop: true,
                align: "center",
                slidesToScroll: 1,
                dragFree: true,
              }}
            >
              {userRequests.map((req, i) => (
                <Carousel.Slide key={i} className="my-auto">
                  <RequestCard request={req} seeRequest={seeRequest} />
                </Carousel.Slide>
              ))}
            </Carousel>
          )}
        </Box>
      </Flex>
      <Box
        w={"100%"}
        pt={24}
        pl={24}
        pr={24}
        pb={44}
        className="rounded-3xl"
        bg={"white"}
      >
        <Group justify="space-between">
          <Flex direction={"column"} gap={2}>
            <Text fw={500} fz={16} c={"#121212"}>
              News
            </Text>
            <Text fw={400} fz={14} c={"#888888"}>
              Everything new in the company will be here
            </Text>
          </Flex>
          {/* <Button variant="transparent" fw={500} onClick={openNews}>
            View All
          </Button> */}
        </Group>
        <NewsModal opened={newsOpened} close={closeNews} />
        <AddRequestModal opened={requestOpened} close={closeRequest} />
        <ToastContainer />
        <Group mt={52} gap={16}>
          {News.map((item, i) => (
            <NewsCard
              key={i}
              title={item.title}
              date={item.date}
              description={item.description}
              url={item.url}
            />
          ))}
        </Group>
      </Box>
    </Stack>
  );
}

export default Dashboard;
