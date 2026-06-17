"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import { MdDeleteOutline, MdMoreVert, MdOpenInNew } from "react-icons/md";
import { BsChevronDown } from "react-icons/bs";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high";
type Status = "todo" | "inprogress" | "completed";

type Task = {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  points: number;
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string }
> = {
  todo: { label: "To-do", color: "#ff2f43", bg: "#fff0f0" },
  inprogress: { label: "In Progress", color: "#f98016", bg: "#fff9db" },
  completed: { label: "Completed", color: "#3cac04", bg: "#ebfbee" },
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low", color: "#2f9e44" },
  medium: { label: "Medium", color: "#f08c00" },
  high: { label: "High", color: "#e03131" },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  onDelete,
  onSeeDetails,
  onStatusChange,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onSeeDetails: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}) {
  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];

  const otherStatuses = (Object.keys(STATUS_CONFIG) as Status[]).filter(
    (s) => s !== task.status,
  );

  return (
    <Card
      radius="xl"
      p="lg"
      withBorder
      shadow="xs"
      style={{
        borderColor: "#e7e7e7",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 20px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        (e.currentTarget as HTMLDivElement).style.transform = "";
      }}
    >
      {/* ── Top row: status badge + menu ───────────────────────────────────── */}
      <Flex justify="space-between" align="center" mb="md">
        {/* Status badge — clickable dropdown to change status */}
        <Menu shadow="md" radius="md" width={160}>
          <Menu.Target>
            <Badge
              variant="light"
              radius="xl"
              size="lg"
              style={{
                background: status.bg,
                color: status.color,
                border: `1px solid ${status.color}22`,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "12px",
                paddingLeft: "12px",
              }}
              rightSection={<BsChevronDown size={11} />}
            >
              {status.label}
            </Badge>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Move to</Menu.Label>
            {otherStatuses.map((s) => (
              <Menu.Item
                key={s}
                onClick={() => onStatusChange(task.id, s)}
                style={{ color: STATUS_CONFIG[s].color, fontWeight: 500 }}
              >
                {STATUS_CONFIG[s].label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        {/* 3-dot menu */}
        <Menu shadow="md" radius="md" width={160}>
          <Menu.Target>
            <Box
              style={{
                cursor: "pointer",
                color: "#adb5bd",
                padding: "4px",
                borderRadius: "6px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  "#f1f3f5")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  "transparent")
              }
            >
              <MdMoreVert size={20} />
            </Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<MdOpenInNew size={15} />}
              onClick={() => onSeeDetails(task.id)}
            >
              See Details
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<MdDeleteOutline size={15} />}
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      {/* ── Title ──────────────────────────────────────────────────────────── */}
      <Text
        fw={500}
        size="md"
        mb="sm"
        lineClamp={2}
        style={{ lineHeight: 1.45, color: "#1a1a2e" }}
      >
        {task.title}
      </Text>

      {/* ── Deadline ───────────────────────────────────────────────────────── */}
      <Group justify="space-between" align="center" mb="md">
        <Flex align="center" justify="center" gap={6}>
          <Text size="sm" c="dimmed">
            Due Date :
          </Text>
          <Text
            size="sm"
            fw={400}
            style={{
              color:
                new Date(task.dueDate) < new Date() &&
                task.status !== "completed"
                  ? "#e03131"
                  : "#2f9e44",
            }}
          >
            {formatDate(task.dueDate)}
          </Text>
        </Flex>
        <Badge
          gradient={{ from: "blue", to: "cyan", deg: 90 }}
          variant="gradient"
          fw={600}
          py={12}
          px={12}
          radius="xl"
          fz={12}
        >
          Task Points : {task.points}
        </Badge>
      </Group>

      <Divider mb="md" color="#f1f3f5" />

      {/* ── Bottom row: priority + see details button ───────────────────────── */}
      <Flex justify="space-between" align="center">
        {/* Priority */}
        <Flex align="center" gap={6}>
          <Text size="sm" fw={600} style={{ color: priority.color }}>
            {priority.label}
          </Text>
        </Flex>

        {/* See details */}
        <Button
          variant="light"
          radius="xl"
          size="xs"
          color="violet"
          onClick={() => onSeeDetails(task.id)}
          style={{ fontWeight: 600, fontSize: "12px" }}
        >
          See Details
        </Button>
      </Flex>
    </Card>
  );
}

export default TaskCard;
