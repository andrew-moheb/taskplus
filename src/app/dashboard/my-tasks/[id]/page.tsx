"use client";
import { notify } from "@/utils/toast";
import { useTaskStore } from "@/store/tasks";
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
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdDateRange } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { v4 } from "uuid";

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

function TaskDetails() {
  const { tasks, updateTask } = useTaskStore();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [opened, { open, close }] = useDisclosure(true);
  const existingTask = tasks.find((task) => task.id === id);

  // attachments may be stored as custom Attachment objects or File objects
  // use a flexible any[] type to accept either shape without type errors
  const [files, setFiles] = useState<any[]>(
    existingTask ? existingTask.attachments : [],
  );

  // use a loose any type for form data to avoid strict Task requirements when partially updating
  const [formData, setFormData] = useState<any>(existingTask);

  const handleChanges = (newfiles: File[]) => {
    if (!newfiles) return;
    setFiles((prevfiles) => [...prevfiles, ...newfiles]);
  };
  const openFile = (file: any) => {
    const newTab = window.open();
    if (!newTab) return;

    if (file.url) {
      newTab.location.href = file.url;
    } else {
      const url = URL.createObjectURL(file);
      newTab.location.href = url;
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const updateForm = (key: keyof typeof existingTask, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    if (existingTask) {
      updateTask(existingTask?.id, {
        title: formData.title.trim(),
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate,
        priority: formData.priority,
        attachments: files.map((file) => ({
          id: v4(),
          name: file.name,
          url: file.url ? file.url : URL.createObjectURL(file),
          type: file.type,
          size: file.size,
        })),
      });
    }

    close();
    router.back();
    notify.success("Task Updated successfully!");
  };

  const handleClose = () => {
    router.back();
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="90%"
      title="Add Task"
      centered
    >
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
              readOnly
              value={formData?.description}
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
                readOnly
                size="md"
                className="mb-8 "
                multiple
                value={null}
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
                  <Flex w="40%" key={index}>
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
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              placeholder="title"
              value={formData?.title}
              onChange={(e) => updateForm("title", e.target.value)}
              name="title"
              readOnly
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
              name="status"
              data={statusOptions}
              value={formData?.status}
              onChange={(val) => updateForm("status", val)}
              label="Status"
              placeholder="select Status"
            />

            <DateInput
              name="dueDate"
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              readOnly
              label={"Due Date"}
              placeholder="select date"
              size="md"
              radius={8}
              value={formData?.dueDate}
              onChange={(val) => updateForm("dueDate", val)}
              rightSection={<MdDateRange size={20} />}
            />
            <Select
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
              value={formData?.priority}
              onChange={(val) => updateForm("priority", val)}
              placeholder="select priority"
            />
          </Flex>
        </GridCol>
      </Grid>
      <Flex justify="flex-end" gap="12px" px={24} pb={16}>
        <Button variant="default" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleUpdate}>Save Edits</Button>
      </Flex>
    </Modal>
  );
}

export default TaskDetails;
