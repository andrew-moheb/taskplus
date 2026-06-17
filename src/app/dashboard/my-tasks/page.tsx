"use client";

import {
  Button,
  Flex,
  Divider,
  TextInput,
  Select,
  Grid,
  GridCol,
  Text,
} from "@mantine/core";
import { CiFilter, CiSearch } from "react-icons/ci";
import { MdOutlineSearch, MdSort, MdViewKanban } from "react-icons/md";
import AddTaskModal from "@/components/AddTaskModal";
import { ToastContainer } from "react-toastify";
import { useTaskStore } from "@/store/tasks";
import TaskCard from "@/components/TaskCard";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useUserStore } from "@/store/user";
import KanbanColumn from "@/components/KanbanColumn";
import { useModalStore } from "@/store/Modal";

type filterOption = {
  label: string;
  value: string;
  color: string;
};

type sortOption = {
  label: string;
  value: string;
};

const filterOptions: filterOption[] = [
  {
    label: "todo",
    value: "todo",
    color: "#ff2f43",
  },
  { label: "inprogress", value: "inprogress", color: "#f98016" },
  { label: "completed", value: "completed", color: "#3cac04" },
];

const sortOptions: sortOption[] = [
  {
    label: "Newest First",
    value: "new",
  },
  {
    label: "Oldest First",
    value: "old",
  },
];

// kanbanboard cols
type Status = "todo" | "inprogress" | "completed";

export const COLUMNS: {
  id: Status;
  label: string;
  accent: string;
  lightBg: string;
}[] = [
  { id: "todo", label: "To Do", accent: "#e03131", lightBg: "#fff0f0" },
  {
    id: "inprogress",
    label: "In Progress",
    accent: "#f08c00",
    lightBg: "#fff9db",
  },
  {
    id: "completed",
    label: "Completed",
    accent: "#2f9e44",
    lightBg: "#ebfbee",
  },
];

function Tasks() {
  const { opened, open, close } = useModalStore();
  const { tasks, getUserTasks, deleteTask, updateStatus } = useTaskStore();
  const { currentUser } = useUserStore();
  const router = useRouter();
  const [filteredStatus, setFilteredStatus] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>("new");
  const [kanbanview, setKanbanView] = useState(false);

  // userTasks
  const userTasks = currentUser
    ? getUserTasks(currentUser.id).sort((a, b) => {
        if (sortValue === "new") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortValue === "old") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return 0;
      })
    : [];

  // filtereredTasks
  const filteredTasks = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();

    return userTasks.filter((task) => {
      const searchMatches =
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm);

      const filteredMaches = filteredStatus
        ? task.status === filteredStatus
        : true;

      return searchMatches && filteredMaches;
    });
  }, [searchQuery, tasks, filteredStatus, sortValue]);

  const seeTaskDetails = (id: string) => {
    router.push(`/dashboard/my-tasks/${id}`);
  };

  return (
    <>
      {/* TaskModal */}
      <AddTaskModal open={open} close={close} opened={opened} />
      {/* page content */}
      <Flex
        direction={"column"}
        gap={24}
        className="bg-white  w-full rounded-3xl  overflow-y-auto"
      >
        {/* header */}
        <Flex
          direction={"column"}
          gap={24}
          className="sticky top-0 p-6 z-30 bg-white"
        >
          <Flex justify={"space-between"}>
            <h1 className="text-2xl font-semibold ">My Tasks</h1>
            <Flex gap={20}>
              <Button
                variant={"outline"}
                onClick={() => setKanbanView(!kanbanview)}
                className="font-medium!"
              >
                {kanbanview ? (
                  "All Tasks "
                ) : (
                  <div className="flex gap-2 items-center justify-center">
                    <MdViewKanban size={20} />
                    <span>Kanbanview</span>
                  </div>
                )}
              </Button>
              <Button onClick={open} className="font-medium!">
                + Add Task
              </Button>
            </Flex>
          </Flex>
          {/* divider */}
          <Divider />
          <Flex gap={16}>
            <TextInput
              type="search"
              onChange={(e) => setSearchQuery(e.target.value)}
              radius={12}
              size="md"
              leftSection={<MdOutlineSearch size={20} />}
              placeholder="Search By Title or Description"
              className="w-[80%]"
            />
            <Select
              size="md"
              data={filterOptions}
              onChange={(val) => setFilteredStatus(val ?? undefined)}
              placeholder="Filter"
              className="w-[20%] !placeholder:text-text"
              leftSection={<CiFilter size={20} />}
            />
            <Select
              size="md"
              data={sortOptions}
              value={sortValue}
              onChange={(val) => setSortValue(val ?? "new")}
              placeholder="Sort"
              className="w-[20%] !placeholder:text-text"
              leftSection={<MdSort size={20} />}
            />
          </Flex>
        </Flex>
        <ToastContainer />
        {/* cards grid */}

        {filteredTasks.length === 0 && (
          <Flex align={"center"} gap={12} justify={"center"}>
            {" "}
            <CiSearch size={24} color="#121212" />{" "}
            <Text>No Tasks Found Add Some</Text>
          </Flex>
        )}

        {kanbanview ? (
          <Flex gap={16} align={"flex-start"} px={24} pb={24}>
            {COLUMNS.map((col) => (
              <KanbanColumn
                col={col}
                key={col.id}
                tasks={filteredTasks.filter((task) => task.status === col.id)}
                seeTaskDetails={seeTaskDetails}
              />
            ))}
          </Flex>
        ) : (
          <Grid columns={12} className="pr-6 pl-6 pb-6 pt-0">
            {filteredTasks.map((task) => (
              <GridCol span={4} key={task.createdAt}>
                <TaskCard
                  task={task}
                  onDelete={deleteTask}
                  onSeeDetails={seeTaskDetails}
                  onStatusChange={updateStatus}
                />
              </GridCol>
            ))}
          </Grid>
        )}
      </Flex>
    </>
  );
}

export default Tasks;
