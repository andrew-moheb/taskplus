"use client";

import { Button, Flex, Text } from "@mantine/core";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Flex
      className="h-screen"
      direction={"column"}
      justify={"center"}
      align={"center"}
      gap={12}
    >
      <Text fz={24}>Something went wrong in the dashboard</Text>
      <Text fz={16}>{error.message}</Text>
      <Button onClick={() => reset()}>Try again</Button>
    </Flex>
  );
}
