"use client";

import { Grid, GridCol } from "@mantine/core";
import Image from "next/image";
import AutoImageSlide from "@/components/AutoImageSlide";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      gap={24}
      py={24}
      justify="center"
      columns={12}
      className="h-screen bg-background "
    >
      {children}
      <GridCol
        span={4}
        bg="primary"
        className="rounded-2xl relative overflow-hidden"
      >
        <Image
          src="/decoration.png"
          alt="Login Preview"
          width={350}
          height={350}
          quality={100}
          className="absolute bottom-0"
        />
        <AutoImageSlide />
      </GridCol>
    </Grid>
  );
}

export default AuthLayout;
