"use client";

import { Flex, Stack, Textarea, TextInput } from "@mantine/core";
import { formatDate } from "@/utils/date";
import { useUserStore } from "@/store/user";
import type { RequestRecord } from "@/store/Requests";

type LeaveRecord = Extract<RequestRecord, { kind: "leave" }>;

function leaveRequestReadonly({
  request,
  managerNote,
  setManagerNote,
}: {
  request: LeaveRecord;
  managerNote: string | undefined;
  setManagerNote: (val: string) => void;
}) {
  const { currentUser } = useUserStore();

  return (
    <Stack gap={16}>
      <Flex justify={"space-between"} gap={12}>
        <TextInput
          styles={{
            label: { fontWeight: 500, fontSize: "14px", marginBottom: "8px" },
            input: { border: "none", padding: 0, color: "#234199" },
          }}
          label={"Leave Duration"}
          readOnly
          value={request.dayType}
        />
        <TextInput
          styles={{
            label: { fontWeight: 500, fontSize: "14px", marginBottom: "8px" },
            input: { border: "none", padding: 0, color: "#234199" },
          }}
          label={"Leave Type"}
          readOnly
          value={request.leaveType}
        />
        <TextInput
          styles={{
            label: { fontWeight: 500, fontSize: "14px", marginBottom: "8px" },
            input: { border: "none", padding: 0, color: "#234199" },
          }}
          label={"Start Date"}
          readOnly
          value={formatDate(request.startDate)}
        />
        <TextInput
          styles={{
            label: { fontWeight: 500, fontSize: "14px", marginBottom: "8px" },
            input: { border: "none", padding: 0, color: "#234199" },
          }}
          label={"End Date"}
          readOnly
          value={request.endDate}
        />
      </Flex>
      <Flex gap={20}>
        <Textarea
          styles={{
            label: { fontWeight: 500, fontSize: "14px", marginBottom: "8px" },
          }}
          label={"Reason"}
          rows={10}
          readOnly
          w={"50%"}
          value={request.reason}
          placeholder="Write reason here...."
          radius={8}
        />
        <Textarea
          styles={{
            label: { fontWeight: 500, fontSize: "14px", marginBottom: "8px" },
          }}
          label={"Manager Note"}
          rows={10}
          w={"50%"}
          onChange={(e) => setManagerNote(e.target.value)}
          value={request.managerNote || managerNote}
          placeholder="Manager Note...."
          radius={8}
          readOnly={currentUser?.role !== "Manager"}
        />
      </Flex>
    </Stack>
  );
}

export default leaveRequestReadonly;
