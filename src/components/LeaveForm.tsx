import { Flex, Group, Radio, Select, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { MdDateRange } from "react-icons/md";
import { leaveDayType, LeaveRequest, LeaveType } from "../store/Requests";
import { useAllManagers } from "@/utils/managers";

export const Intial_Leave_Form: LeaveRequest = {
  kind: "leave",
  dayType: "",
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: "",
  managerId: "",
};

const leave_Type = [
  { label: "annual", value: "annual" },
  { label: "sick", value: "sick" },
  { label: "unpaid", value: "unpaid" },
  { label: "maternity", value: "maternity" },
  { label: "paternity", value: "paternity" },
  { label: "emergency", value: "emergency" },
  { label: "other", value: "other" },
];

function LeaveForm({
  form,
  onChange,
}: {
  form: LeaveRequest;
  onChange: <K extends keyof LeaveRequest>(
    key: K,
    value: LeaveRequest[K],
  ) => void;
}) {
  return (
    <>
      <Radio.Group
        value={form.dayType}
        onChange={(v) => onChange("dayType", v as leaveDayType)}
        label="Leave Duration"
        styles={{
          label: {
            fontWeight: 500,
            fontSize: "14px",
            marginBottom: "8px",
          },
        }}
        withAsterisk
      >
        <Group mt="xs" gap={56}>
          <Radio value="Full Day" label="Full Day" />
          <Radio value="Partial Day" label="Partial Day" />
        </Group>
      </Radio.Group>
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
        value={form.leaveType}
        onChange={(v) => onChange("leaveType", v as LeaveType)}
        data={leave_Type}
        label="Leave Type"
        placeholder="select"
      />
      <Flex w={"100%"} className="gap-4">
        <DateInput
          required
          styles={{
            label: {
              fontWeight: 500,
              fontSize: "14px",
              marginBottom: "8px",
            },
          }}
          label={"Start Date"}
          value={form.startDate}
          onChange={(v) => onChange("startDate", v as string)}
          placeholder="select date"
          size="md"
          w={"50%"}
          radius={8}
          rightSection={<MdDateRange size={20} />}
        />

        <DateInput
          required
          styles={{
            label: {
              fontWeight: 500,
              fontSize: "14px",
              marginBottom: "8px",
            },
          }}
          label={"End Date"}
          onChange={(v) => onChange("endDate", v as string)}
          value={form.endDate}
          placeholder="select date"
          size="md"
          w={"50%"}
          radius={8}
          rightSection={<MdDateRange size={20} />}
        />
      </Flex>
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
          label={"Reason"}
          rows={10}
          value={form.reason}
          onChange={(e) => onChange("reason", e.target.value)}
          placeholder="Write reason here...."
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
          value={form.managerId}
          onChange={(v) => onChange("managerId", v as string)}
          data={useAllManagers()}
          label="Manager"
          placeholder="Assign To"
        />
      </Flex>
    </>
  );
}

export default LeaveForm;
