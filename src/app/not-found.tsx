import { Box, Flex, Group, Text } from "@mantine/core";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

export default function NotFound() {
  return (
    <Flex
      align={"center"}
      justify={"center"}
      className="h-screen"
      direction={"column"}
      gap={12}
    >
      <Text fz={24}>Page Not Found</Text>
      <Text fz={16}>Sorry, we couldn&apos;t find what you were looking for.</Text>
      <Link href="/dashboard">
        <Group gap={8}>
          <MdArrowBack size={20} />
          <Text c={"primary"}>Go back to dashboard</Text>
        </Group>
      </Link>
    </Flex>
  );
}
