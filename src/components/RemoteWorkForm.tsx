import type { RemoteWork } from "@/store/Requests";
import { useAllManagers } from "@/utils/managers";
import { Flex, Select, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { MdDateRange } from "react-icons/md";

export const Intial_RemoteWork_Form: RemoteWork = {
  kind: "remoteWork",
  date: "",
  reason: "",
  managerId: "",
};

function RemoteWorkForm({
  form,
  onChange,
}: {
  form: RemoteWork;
  onChange: <K extends keyof RemoteWork>(key: K, value: RemoteWork[K]) => void;
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
        label={"Date"}
        value={form.date}
        onChange={(v) => onChange("date", v as string)}
        placeholder="select date"
        size="md"
        w={"100%"}
        radius={8}
        rightSection={<MdDateRange size={20} />}
      />

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

export default RemoteWorkForm;
