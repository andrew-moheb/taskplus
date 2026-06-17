"use client";

import { Button, Card, Flex, Text } from "@mantine/core";
import { RequestRecord } from "@/store/Requests";
import { formatDate } from "@/utils/date";

// ─── Helper ───────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

function RequestCard({
  seeRequest,
  request,
}: {
  seeRequest: (id: string) => void;
  request: RequestRecord;
}) {
  return (
    <Card
      radius="xl"
      withBorder
      shadow="xs"
      style={{
        borderColor: "#e7e7e7",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 20px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        (e.currentTarget as HTMLDivElement).style.transform = "";
      }}
      className="p-4"
    >
      {/* ── Top row: status badge + menu ───────────────────────────────────── */}
      <Flex justify="space-between" align="center" mb="md">
        <Text
          c={"#756EF3"}
          fw={"semibold"}
          px={10}
          py={4}
          className="bg-[#756EF3]/10 rounded-[12px] !font-semibold"
        >
          {formatDate(request.createdAt)}
        </Text>
        <Text
          c={
            request?.requestStatus === "pending"
              ? "#F98016"
              : request?.requestStatus === "approved"
                ? "#3CAC04"
                : "#FF2F43"
          }
          fw={"semibold"}
          px={10}
          py={4}
          className={`${request?.requestStatus === "pending" ? "bg-[#F98016]/10" : request?.requestStatus === "approved" ? "bg-[#3CAC04]/10" : "bg-[#FF2F43]/10"} rounded-4xl`}
        >
          {request.requestStatus.charAt(0).toUpperCase() +
            request.requestStatus.slice(1)}
        </Text>
      </Flex>

      <Text
        fw={500}
        size="md"
        mb="sm"
        lineClamp={2}
        style={{ lineHeight: 1.45, color: "#1a1a2e" }}
      >
        {request.kind} Request
      </Text>

      <Flex align="center" justify={"space-between"} gap={6} mb="md">
        <Text size="sm" c="dimmed" truncate={true} w={"60%"}>
          Reason: {request.kind !== "loan" ? request.reason : ""}
        </Text>
        <Button
          variant="light"
          radius="xl"
          size="xs"
          color="violet"
          onClick={() => seeRequest(request.id)}
          style={{ fontWeight: 600, fontSize: "12px" }}
        >
          See Request
        </Button>
      </Flex>
    </Card>
  );
}

export default RequestCard;
