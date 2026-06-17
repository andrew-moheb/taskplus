import { OverTime } from "@/store/Requests";
import { Flex, Select, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { MdDateRange } from "react-icons/md";
import TimePicker from "./TimePicker";
import { getAllManagers } from "@/utils/managers";

export const Intial_OverTime_Form: OverTime = {
  kind: "overTime",
  date: "",
  startTime: "",
  endTime: "",
  reason: "",
  managerId: "",
};

function OverTimeForm({
  form,
  onChange,
}: {
  form: OverTime;
  onChange: <K extends keyof OverTime>(key: K, value: OverTime[K]) => void;
}) {
  return (
    <>
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
        value={form.date}
        onChange={(v) => onChange("date", v as string)}
        placeholder="select date"
        size="md"
        w={"100%"}
        radius={8}
        rightSection={<MdDateRange size={20} />}
      />
      <Flex w={"100%"} className="gap-4">
        <TimePicker
          onChange={(v) => onChange("startTime", v as string)}
          value={form.startTime}
          label="Start Time"
        />
        <TimePicker
          onChange={(v) => onChange("endTime", v as string)}
          value={form.endTime}
          label="End Time"
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
          data={getAllManagers()}
          label="Manager"
          placeholder="Assign To"
        />
      </Flex>
    </>
  );
}

export default OverTimeForm;
