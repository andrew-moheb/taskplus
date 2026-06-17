"use client";

import { giftType } from "@/app/dashboard/coupons-store/page";
import { Card, Text, Group, Stack, ActionIcon, Box } from "@mantine/core";
import Image from "next/image";
import { MdOpenInNew } from "react-icons/md";

interface GiftCardProps {
  id: number;
  brandLogo: string;
  amount?: number;
  pointsRequired: number;
  currency: string;
  description: string;
  handleGiftSelect: (gift: giftType) => void;
}

export default function GiftCard({
  handleGiftSelect,
  brandLogo = "",
  amount = 10,
  pointsRequired = 200,
  currency = "$",
  id = 0,
  description,
}: GiftCardProps) {
  return (
    <Card
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
      shadow="md"
      radius="xl"
      withBorder
      className="p-4 relative w-[18%] bg-white border-[#e7e7e7] transition duration-200 ease-in-out cursor-pointer"
    >
      {/* Hang tag notch */}
      <Box
        style={{
          position: "absolute",
          top: -1,
          left: "50%",
          transform: "translateX(-50%)",
          width: 36,
          height: 20,
          background: "#f5f5f5",
          border: "1px solid #e7e7e7",
          borderBottom: "none",
          borderRadius: "0 0 100px 100px / 0 0 20px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: "1.5px solid #ccc",
            background: "#fff",
          }}
        />
      </Box>

      {/* External link icon */}
      <ActionIcon
        variant="subtle"
        color="blue"
        size="sm"
        style={{ position: "absolute", top: 12, right: 12 }}
        aria-label="Open"
        onClick={() =>
          handleGiftSelect({
            id,
            brandLogo,
            amount,
            pointsRequired,
            currency,
            description,
          })
        }
      >
        <MdOpenInNew />
      </ActionIcon>

      {/* Card content */}
      <Stack gap="xs" align="center" mt={8}>
        {/* Brand logo */}
        <div className="w-33.25 h-25 relative flex items-center ">
          <Image
            src={brandLogo}
            alt={"test"}
            width={133}
            height={100}
            className="rounded-lg"
            quality={100}
            loading="lazy"
          />
        </div>

        {/* Amount */}
        <Text fw={600} className="text-text text-[16px]">
          {currency}
          {amount} Gift Card
        </Text>

        {/* Divider */}
        <Box
          style={{
            width: "100%",
            height: 1,
            background: "#f0f0f0",
            margin: "4px 0",
          }}
        />

        {/* Points */}
        <Text
          size="sm"
          fw={500}
          className="!text-text-normal !hover:text-underline"
        >
          {pointsRequired} Points to redeem
        </Text>
      </Stack>
    </Card>
  );
}
