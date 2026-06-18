"use client";
import { notify } from "@/utils/toast";
import { useTaskStore } from "@/store/tasks";
import { useUserStore } from "@/store/user";
import {
  Button,
  FileInput,
  Flex,
  Grid,
  GridCol,
  Modal,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { MdDateRange, MdPerson } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { v4 } from "uuid";
import "@mantine/dates/styles.css";

// Types
type Priority = "low" | "medium" | "high";
type Status = "todo" | "inprogress" | "completed";

// statusOptions
type statusOptiontype = {
  label: string;
  value: string;
  color: string;
};

const statusOptions: statusOptiontype[] = [
  {
    label: "todo",
    value: "todo",
    color: "#ff2f43",
  },
  { label: "inprogress", value: "inprogress", color: "#f98016" },
  { label: "completed", value: "completed", color: "#3cac04" },
];

// priotiry Options

type priorityOptionType = {
  label: string;
  value: string;
};

const priorityOptions: priorityOptionType[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const pointsOptions = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
  { label: "40", value: "40" },
  { label: "50", value: "50" },
];

const intialFormData = {
  title: "",
  description: "",
  status: "todo" as Status | null,
  dueDate: null as string | null,
  priority: null as Priority | null,
  points: null as string | null,
  assignTo: null as string | null,
};

function AddTaskModal({
  open,
  close,
  opened,
}: {
  open: () => void;
  close: () => void;
  opened: boolean;
}) {
  // global States
  const { currentUser, users } = useUserStore();
  const { addTask } = useTaskStore();
  const [assignedUser, setAssignedUser] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState(intialFormData);

  // file helpers
  const handleChanges = (newfiles: File[]) => {
    if (!newfiles) return;
    setFiles((prevfiles) => [...prevfiles, ...newfiles]);
  };

  const openFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  // form helpers

  const updateForm = <K extends keyof typeof intialFormData>(
    key: K,
    value: (typeof intialFormData)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData(intialFormData);
    setFiles([]);
  };

  // add task
  const handleSubmit = () => {
    if (!currentUser || !formData.title.trim()) return;

    addTask({
      userId: assignedUser as string,
      title: formData.title.trim(),
      description: formData.description,
      status: formData.status,
      dueDate: formData.dueDate,
      priority: formData.priority,
      points: formData.points ? Number(formData.points) : null,
      attachments: files.map((file) => ({
        id: v4(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
      })),
      pointsAwarded: false,
    });

    resetForm();
    close();
    notify.success("Task Added successfully!");
  };

  return (
    <Modal opened={opened} onClose={close} size="90%" title="Add Task" centered>
      <Grid columns={10} p={24}>
        <GridCol
          span={6}
          className="rounded-2xl border border-border"
          py={24}
          px={20}
        >
          <Flex direction={"column"} className="gap-4">
            <Textarea
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              required
              value={formData.description}
              onChange={(e) => updateForm("description", e.target.value)}
              label={"Task Description"}
              rows={10}
              name="description"
              placeholder="What should be done and any important details?"
              radius={8}
            />
            <Stack gap={"8px"}>
              <FileInput
                label="Attachments"
                placeholder="+ upload Attachments"
                w={"100%"}
                size="md"
                className="mb-8 "
                multiple
                value={undefined}
                onChange={handleChanges}
                h={"48px"}
                radius={12}
                styles={{
                  label: {
                    fontWeight: 500,
                    fontSize: "14px",
                    marginBottom: "8px",
                  },
                }}
              />
              <Flex wrap={"wrap"} gap={"12px"}>
                {files.map((file, index) => (
                  <Flex w="40%" key={file.name}>
                    <Button
                      variant="outline"
                      onClick={() => openFile(file)}
                      key={index}
                      className="relative"
                      w={"100%"}
                    >
                      {file.name}
                    </Button>
                    <TiDelete
                      size={24}
                      className="text-error z-20 relative  right-7 -top-2 bg-white rounded-full cursor-pointer"
                      onClick={() => handleRemoveFile(file)}
                    />
                  </Flex>
                ))}
              </Flex>
            </Stack>
          </Flex>
        </GridCol>
        <GridCol span={4} p={24} className="rounded-2xl border border-border">
          <Flex direction={"column"} className="gap-4">
            <TextInput
              required
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              placeholder="title"
              value={formData.title}
              onChange={(e) => updateForm("title", e.target.value)}
              name="title"
              label={"Task Title"}
              size="md"
              radius={8}
            />
            <Select
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              size="md"
              required
              name="status"
              data={statusOptions}
              value={formData.status}
              onChange={(val) => updateForm("status", val as Status | null)}
              label="Status"
              placeholder="select Status"
            />

            <DateInput
              required
              name="dueDate"
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              label={"Due Date"}
              placeholder="select date"
              size="md"
              radius={8}
              value={formData.dueDate}
              onChange={(val) => updateForm("dueDate", val)}
              rightSection={<MdDateRange size={20} />}
            />

            <Select
              required
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              name="priority"
              size="md"
              data={priorityOptions}
              label="Priority"
              value={formData.priority}
              onChange={(val) => updateForm("priority", val as Priority | null)}
              placeholder="select priority"
            />
            <Select
              required
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              name="points"
              size="md"
              data={pointsOptions}
              label="Points"
              value={formData.points}
              onChange={(val) => updateForm("points", val)}
              placeholder="select points"
            />
            <Select
              required
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              name="assigneduser"
              label={"Assign to"}
              data={users.map((user) => ({
                label: `${user.firstname} ${user.lastname} ${user.firstname === currentUser?.firstname ? "(Me)" : ""}`,
                value: user.id,
                role: user.role,
              }))}
              value={assignedUser}
              onChange={setAssignedUser}
              placeholder="assign to"
              size="md"
              radius={8}
              rightSection={<MdPerson size={20} />}
            />
          </Flex>
        </GridCol>
      </Grid>
      <Flex justify="flex-end" gap="12px" px={24} pb={16}>
        <Button variant="default" onClick={close}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add Task</Button>
      </Flex>
    </Modal>
  );
}

export default AddTaskModal;
