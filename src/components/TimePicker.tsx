import { ActionIcon } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useRef } from "react";
import { CiClock2 } from "react-icons/ci";

function TimePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
    >
      <CiClock2 size={16} />
    </ActionIcon>
  );

  return (
    <TimeInput
      styles={{
        label: {
          fontWeight: 500,
          fontSize: "14px",
          marginBottom: "8px",
        },
      }}
      size="md"
      required
      w={"50%"}
      radius={8}
      label={label}
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rightSection={pickerControl}
    />
  );
}

export default TimePicker;
