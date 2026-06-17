import { Box, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { MdOpenInNew } from "react-icons/md";

function NewsCard({
  title,
  date,
  description,
  url,
}: {
  title: string;
  date: string;
  description: string;
  url: string;
}) {
  return (
    <Box w={"48%"} px={16} py={20} className="border border-border rounded-xxl">
      <Stack gap={8}>
        <Group justify="space-between">
          <Text c={"#121212"} fz={16} fw={600}>
            {title}
          </Text>
          <Link href={url} target="_blank">
            <MdOpenInNew />
          </Link>
        </Group>
        <Text fz={12} c={"#b0b0b0"}>
          {date}
        </Text>
      </Stack>
      <Text fz={14} mt={12} c={"#888888"} lineClamp={5}>
        {description}
      </Text>
    </Box>
  );
}

export default NewsCard;
