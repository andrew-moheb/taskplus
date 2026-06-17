"use client";

import {
  Badge,
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import "@mantine/dates/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { useRequestStore } from "@/store/Requests";
import { formatDate } from "@/utils/date";
import { useUserStore } from "@/store/user";
import { useState } from "react";
import { notify } from "@/utils/toast";
import { convertTo12Hour } from "@/utils/time";

export default function RequestModal() {
  const { id } = useParams<{ id: string }>();
  // get request
  const { getRequestById, approve, reject } = useRequestStore();
  const request = getRequestById(id);
  const [managerNote, setManagerNote] = useState<string | undefined>(
    request.managerNote,
  );
  console.log("request", request);
  const [opened, { open, close }] = useDisclosure(true);
  const router = useRouter();
  const { currentUser } = useUserStore();

  const modalTitle = (
    <Group justify="space-between" style={{ flex: 1, marginRight: "1rem" }}>
      <Group gap="xs">
        <Text fw={500} size="lg" c="#234199">
          {currentUser?.role === "Manager" ? "Add Note" : "Request Details"}
        </Text>
        <Badge
          color={
            request?.requestStatus === "pending"
              ? "#F98016"
              : request?.requestStatus === "approved"
                ? "#3CAC04"
                : "#FF2F43"
          }
          variant="light"
        >
          {request?.requestStatus}
        </Badge>
      </Group>
    </Group>
  );

  // close function
  const handleClose = () => {
    router.push("/dashboard/my-requests");
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="90%"
      title={modalTitle}
      centered
    >
      {request?.kind === "leave" && (
        <Stack gap={16}>
          <Flex justify={"space-between"} gap={12}>
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"Leave Duration"}
              readOnly
              value={request.dayType}
            />
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"Leave Type"}
              readOnly
              value={request.leaveType}
            />
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"Start Date"}
              readOnly
              value={formatDate(request.startDate)}
            />
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"End Date"}
              readOnly
              value={formatDate(request.endDate)}
            />
          </Flex>
          <Flex gap={20}>
            <Textarea
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              label={"Request Reason"}
              rows={10}
              readOnly
              w={"50%"}
              value={request.reason}
              placeholder="Write reason here...."
              radius={8}
            />
            <Textarea
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              label={"Manager Note"}
              rows={10}
              w={"50%"}
              onChange={(e) => setManagerNote(e.target.value)}
              value={managerNote}
              placeholder="Manager Note...."
              radius={8}
              readOnly={currentUser?.role !== "Manager"}
            />
          </Flex>
        </Stack>
      )}

      {/* kind overtime */}
      {request?.kind === "overTime" && (
        <Stack gap={16}>
          <Flex justify={"space-between"} gap={12}>
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"Start Date"}
              readOnly
              value={formatDate(request.date)}
            />
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"Start Time"}
              readOnly
              value={convertTo12Hour(request.startTime)}
            />
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"End Time"}
              readOnly
              value={convertTo12Hour(request.endTime)}
            />
            {/* <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"End Date"}
              readOnly
              value={request.endDate}
            /> */}
          </Flex>
          <Flex gap={20}>
            <Textarea
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              label={"Request Reason"}
              rows={10}
              readOnly
              w={"50%"}
              value={request.reason}
              placeholder="Write reason here...."
              radius={8}
            />
            <Textarea
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              label={"Manager Note"}
              rows={10}
              w={"50%"}
              onChange={(e) => setManagerNote(e.target.value)}
              value={managerNote}
              placeholder="Manager Note...."
              radius={8}
              readOnly={currentUser?.role !== "Manager"}
            />
          </Flex>
        </Stack>
      )}

      {/* kind Remote work */}
      {request?.kind === "remoteWork" && (
        <Stack gap={16}>
          <Flex justify={"space-between"} gap={12}>
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"Start Date"}
              readOnly
              value={formatDate(request.date)}
            />
          </Flex>
          <Flex gap={20}>
            <Textarea
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              label={"Request Reason"}
              rows={10}
              readOnly
              w={"50%"}
              value={request.reason}
              placeholder="Write reason here...."
              radius={8}
            />
            <Textarea
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              label={"Manager Note"}
              rows={10}
              w={"50%"}
              onChange={(e) => setManagerNote(e.target.value)}
              value={managerNote}
              placeholder="Manager Note...."
              radius={8}
              readOnly={currentUser?.role !== "Manager"}
            />
          </Flex>
        </Stack>
      )}

      {/* kind Loan */}
      {request?.kind === "loan" && (
        <Stack gap={16}>
          <Flex gap={12}>
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"Loan Reason"}
              readOnly
              value={request.loanReason}
            />
            <TextInput
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
                input: {
                  border: "none",
                  padding: 0,
                  color: "#234199",
                },
              }}
              label={"Amount"}
              readOnly
              value={request.Amount}
            />
          </Flex>
          <Flex gap={20}>
            <Textarea
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              label={"Detailed Explanation"}
              rows={10}
              readOnly
              w={"50%"}
              value={request.detailedExplanation}
              placeholder="Write reason here...."
              radius={8}
            />
            <Textarea
              styles={{
                label: {
                  fontWeight: 500,
                  fontSize: "14px",
                  marginBottom: "8px",
                },
              }}
              label={"Manager Note"}
              rows={10}
              w={"50%"}
              onChange={(e) => setManagerNote(e.target.value)}
              value={managerNote}
              placeholder="Manager Note...."
              radius={8}
              readOnly={currentUser?.role !== "Manager"}
            />
          </Flex>
        </Stack>
      )}

      {/* manager role */}
      <Flex justify="flex-end" gap="12px" mt={20} px={24} pb={16}>
        {currentUser?.role === "Manager" && (
          <>
            {" "}
            <Button
              onClick={() => {
                reject(request?.id, request?.managerId, managerNote);
                handleClose();
                notify.fail("Request is rejected");
              }}
              c={"#FF2F43"}
              className="!bg-[#FF2F43]/10"
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                approve(request?.id, request?.managerId, managerNote);
                handleClose();
                notify.success("Request is approved");
              }}
              c={"#3CAC04"}
              className="!bg-[#3CAC04]/10"
            >
              Approve
            </Button>
          </>
        )}
      </Flex>
    </Modal>
  );
}
