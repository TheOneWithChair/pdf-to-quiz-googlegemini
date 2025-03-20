"use client";

import { Button } from "@/components/ui/button";
import StartsBg from "@/assets/stars.png";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import Link from "next/link";

export const Hero = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundPositionY = useTransform(
    scrollYProgress,
    [0, 1],
    [-300, 300]
  );

  return (
    <motion.section
      ref={sectionRef}
      className="relative h-[492px] md:h-[800px] flex items-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_90%,transparent)]"
      style={{
        position: "relative", // Ensure the section has a non-static position
        backgroundImage: `url(${StartsBg.src})`,
        backgroundPositionY,
      }}
      animate={{
        backgroundPositionX: StartsBg.width,
      }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 110,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)]"></div>
      {/* start planet */}
      <div className="absolute h-64 w-64 md:h-96 md:w-96 bg-purple-500 rounded-full border border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(50%_50%_at_16.8%_16.3%,white,rgb(184,148,255)_37.7%,rgb(42,0,66))] shadow-[-20px_-20px_50px_rgb(255,255,255,.5),-20px_-20px_80px_rgb(255,255,255,.1),0_0_50px_rgb(140,69,255)]"></div>
      {/* end planet  */}
      {/* start ring 1 */}
      <motion.div
        style={{
          translateY: "-50%",
          translateX: "-50%",
        }}
        animate={{
          rotate: "1turn",
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[344px] w-[344px] md:h-[580px] md:w-[580px] border opacity-20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute h-2 w-2 top-1/2 left-0 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute h-2 w-2 top-0 left-1/2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute h-5 w-5 top-1/2 left-full border border-white rounded-full -translate-x-1/2 -translate-y-1/2 inline-flex justify-center items-center ">
          <div className="h-2 w-2 bg-white rounded-full"></div>
        </div>
      </motion.div>
      {/* end ring 1 */}
      {/* start ring 2 */}
      <motion.div
        animate={{
          rotate: "-1turn",
        }}
        style={{
          translateY: "-50%",
          translateX: "-50%",
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[444px] w-[444px] md:h-[780px] md:w-[780px] rounded-full border border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed"
      ></motion.div>
      {/* end ring 2 */}
      {/* start ring 3 */}
      <motion.div
        animate={{
          rotate: "1turn",
        }}
        style={{
          translateY: "-50%",
          translateX: "-50%",
        }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[544px] w-[544px] md:h-[980px] md:w-[980px] rounded-full opacity-20 border border-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
      >
        <div className="absolute h-2 w-2 top-1/2 left-0 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute h-2 w-2 top-1/2 left-full bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </motion.div>
      {/* end ring 3 */}
      <div className="container relative mt-16">
        <h2 className="text-5xl md:text-[140px] md:leading-none font-semibold tracking-tighter bg-white bg-[radial-gradient(100%_100%_at_top_left,white,white,rgb(74,32,136,.5))] text-transparent bg-clip-text text-center">
          AI-Powered Quiz Learning
        </h2>
        <p className="text-lg md:text-xl max-w-xl mx-auto text-white/70 mt-5 text-center">
          Generate flashcards, quizzes, and matching games from any PDF. Learn
          smarter, not harder.
        </p>
        <div className="flex justify-center mt-5">
          <Link href="/api/quiz">
            <Button className="px-6 py-3 text-lg font-semibold border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300">
              Try Now
            </Button>
          </Link>
        </div>

      </div>
    </motion.section>
  );
};
