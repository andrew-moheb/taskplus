"use client";

import GiftCard from "@/components/giftCard";
import { gifts } from "@/dummyData";
import { useUserStore } from "@/store/user";

import { notify } from "@/utils/toast";
import { Button, Divider, Drawer, Flex, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

export type giftType = {
  id: number;
  brandLogo: string;
  amount: number;
  pointsRequired: number;
  currency: string;
  description: string;
};

export default function Coupons() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedGift, setSelectedGift] = useState<giftType | null>(null);
  const { currentUser, redeemCoupon } = useUserStore();

  const handleGiftClick = (gift: giftType) => {
    setSelectedGift(gift);
    open();
  };

  const handleCouponRedeem = () => {
    if (!currentUser || !selectedGift) return;
    const success = redeemCoupon(currentUser.id, selectedGift.pointsRequired);

    if (success) {
      notify.success(`Coupon redeemed successfully!`);
      close();
    } else {
      notify.fail(`You don't have enough points for this reward!`);
    }
  };

  const redeemTest = () => {
    const result =
      (currentUser?.points ?? 0) < (selectedGift?.pointsRequired ?? 0);
    return result;
  };

  return (
    <>
      <Drawer
        offset={24}
        position="right"
        opened={opened}
        onClose={close}
        title="Reward Overview"
        radius="24px"
        padding="24px"
        styles={{
          title: {
            fontSize: "18px",
            fontWeight: 500,
          },
        }}
      >
        <Stack justify={"space-between"}>
          <Stack gap={16} style={{ flex: 1 }}>
            <div className="w-full border rounded-2xl border-[#E7E7E7] h-32.5 relative flex justify-around items-center">
              <Image
                src={selectedGift?.brandLogo}
                alt={selectedGift?.description}
                width={200}
                quality={100}
                height={130}
              />
            </div>
            <Flex
              align={"center"}
              justify="center"
              bg="#FAFAFB"
              w="100%"
              py={14}
              className="rounded-2xl border border-dashed border-border!"
            >
              <Text c="primary" fw={800}>
                {selectedGift?.currency} {selectedGift?.amount} Gift Card
              </Text>
            </Flex>
            <Flex
              align={"center"}
              justify="center"
              p={16}
              style={{ flex: 1 }}
              className="rounded-2xl border border-border!"
            >
              <Text className="text-[14px]!">{selectedGift?.description}</Text>
            </Flex>
          </Stack>

          <Button
            className="text-[16px] font-medium! hover:opacity-90!"
            color="primary"
            size="md"
            disabled={redeemTest()}
            onClick={handleCouponRedeem}
          >
            Redeem for {selectedGift?.pointsRequired} Points
          </Button>
          {redeemTest() ? (
            <Text c={"red"}>Your can't redeem this coupon</Text>
          ) : (
            ""
          )}
        </Stack>
      </Drawer>

      <Flex
        direction={"column"}
        gap={24}
        className="sticky top-0 p-6 z-30 rounded-3xl bg-white"
      >
        <Flex justify={"space-between"}>
          <h1 className="text-2xl font-semibold ">My Coupons</h1>
          <Flex gap={20} />
        </Flex>
        {/* divider */}
        <Divider />
        <Flex gap={"2.5%"} mt={26} wrap={"wrap"}>
          {gifts.map((gift) => (
            <GiftCard
              handleGiftSelect={handleGiftClick}
              key={gift.id}
              id={gift.id}
              brandLogo={gift.brandLogo}
              amount={gift.amount}
              pointsRequired={gift.pointsRequired}
              currency={gift.currency}
              description={gift.description}
            />
          ))}
        </Flex>
      </Flex>
      <ToastContainer />
    </>
  );
}
