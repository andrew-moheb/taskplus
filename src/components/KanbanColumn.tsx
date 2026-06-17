"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/tasks";

import { useUserStore } from "@/store/useUserStore";
import { COLUMNS } from "../app/dashboard/my-tasks/page";
import type { Task } from "../store/tasks";
import { Flex } from "@mantine/core";
import TaskCard from "./TaskCard";
import { notify } from "@/utils/toast";

function KanbanColumn({
  col,
  tasks,
  seeTaskDetails,
}: {
  col: (typeof COLUMNS)[0];
  tasks: Task[];
  seeTaskDetails: (id: string) => void;
}) {
  const { updateTask, updateStatus, deleteTask } = useTaskStore();
  const [dragOver, setDragOver] = useState(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) updateStatus(taskId, col.id);
    setDragOver(false);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      style={{
        flex: 1,
        minHeight: "520px",
        borderRadius: "20px",
        padding: "16px",
        background: dragOver ? col.lightBg : "white",
        border: dragOver ? `2px dashed ${col.accent}` : "2px solid #e7e7e7",
        transition: "all 0.15s ease",
        cursor: "draggle",
      }}
    >
      {/* Header */}
      <Flex align="center" gap={8} mb={16} px={4}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: col.accent,
          }}
        />
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          {col.label}
        </p>
        <div
          style={{
            marginLeft: "auto",
            background: col.accent,
            color: "white",
            borderRadius: "50%",
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
          }}
        >
          {tasks.length}
        </div>
      </Flex>

      {/* Cards */}
      <Flex direction="column" gap={12}>
        {tasks.length === 0 && (
          <Flex
            justify="center"
            align="center"
            style={{
              border: "2px dashed #e5e7eb",
              borderRadius: "16px",
              padding: "48px 0",
              color: "#d1d5db",
              fontSize: "12px",
            }}
          >
            Drop here
          </Flex>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
            style={{ cursor: "grab" }}
          >
            <TaskCard
              task={task}
              onDelete={deleteTask}
              onSeeDetails={seeTaskDetails}
              onStatusChange={updateTask}
            />
          </div>
        ))}
      </Flex>
    </div>
  );
}

export default KanbanColumn;
