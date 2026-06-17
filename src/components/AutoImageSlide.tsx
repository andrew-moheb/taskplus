"use client";
import { Flex } from "@mantine/core";
import Image from "next/image";
import React, { useEffect } from "react";

function AutoImageSlide() {
  const images = [
    {
      src: "/HeroImageOne.png",
      desc: `Welcome to Taskpulse Employee App! Discover 
      a place where your hard work is recognized and 
      rewarded! Join us in creating a vibrant, appreciative workplace culture`,
    },
    {
      src: "/HeroImageTwo.png",
      desc: `See your Impact! Explore your personal dashboard to monitor
       your recognitions and rewards. Engagewith a platform 
       that grows with you and elevates the entire team`,
    },
    {
      src: "/HeroImageThree.png",
      desc: `Turn hard work into rewards!
Complete tasks, achieve goals, and earn
 points with every mile covered. Redeem your points from a variety of rewards within the Taskpulse App. `,
    },
  ];

  const [Index, setIndex] = React.useState(0);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setIndex(currentIndex);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Flex
      direction="column"
      align="center"
      gap={0}
      className="h-[calc(100%-64px)]  bg-[#B7E9F640]/50 border-[#E4E4E4]/75 border absolute backdrop-blur left-8 top-8 rounded-2xl w-[calc(100%-64px)]  "
    >
      {images.map((img, i) => (
        <Image
          key={img.src}
          alt={`Slide ${i}`}
          src={img.src}
          width={380}
          height={400}
          priority={i === 0} // Load the first image immediately
          className={`transition-opacity duration-1000 mt-8 absolute ease-in-out ${
            Index === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <p className="text-white w-95 absolute bottom-8">{images[Index].desc}</p>
    </Flex>
  );
}

export default AutoImageSlide;
