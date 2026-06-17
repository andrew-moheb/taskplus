import { Group, RingProgress, Stack, Text } from "@mantine/core";

function ProgressRing({
  sectionPercentage,
  taskName,
  taskNumber,
  color,
}: {
  sectionPercentage: number;
  taskName: string;
  taskNumber: number;
  color: string;
}) {
  return (
    <Stack align="center" gap="xs">
      <RingProgress
        size={120}
        thickness={10}
        roundCaps
        sections={[{ value: sectionPercentage, color: color }]}
        label={
          <Text fz={16} fw={600} size="lg" ta="center" c={"#121212"}>
            {sectionPercentage}%
          </Text>
        }
      />

      <Group gap={8}>
        <Text c="#888888" fw={400} fz={12}>
          {taskName}
        </Text>
        <Text fw={500} fz={14} c={"#121212"}>
          {taskNumber}
        </Text>
      </Group>
    </Stack>
  );
}

export default ProgressRing;
