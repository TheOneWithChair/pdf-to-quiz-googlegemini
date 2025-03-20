"use client";

import { Button } from "@/components/ui/button";
import StartsBg from "@/assets/stars.png";
import gridLines from "@/assets/grid-lines.png";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import React, { RefObject, useRef, useEffect } from "react";
import Link from "next/link";

const useRelativeMousePosition = (to: RefObject<HTMLElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const updateMousePosition = (event: MouseEvent) => {
    if (!to.current) return;
    const { top, left } = to.current.getBoundingClientRect();
    mouseX.set(event.x - left);
    mouseY.set(event.y - top);
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return [mouseX, mouseY];
};

export const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const borderedDivRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundPositionY = useTransform(
    scrollYProgress,
    [0, 1],
    [-300, 300]
  );

  const [mouseX, mouseY] = useRelativeMousePosition(borderedDivRef);
  const maskImage = useMotionTemplate`radial-gradient(50% 50% at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <section id="call-to-action-section" className="py-20 md:py-24" ref={sectionRef}>
      <div className="container">
        <motion.div
          ref={borderedDivRef}
          className="border border-white/25 py-24 rounded-xl overflow-hidden relative group shadow-lg"
          animate={{ backgroundPositionX: StartsBg.width }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          style={{
            backgroundPositionY,
            backgroundImage: `url(${StartsBg.src})`,
          }}
        >
          {/* Background Effects */}
          <div
            className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay [mask-image:radial-gradient(50%_50%_at_50%_35%,black,transparent)] group-hover:opacity-0 transition duration-700"
            style={{
              backgroundImage: `url(${gridLines.src})`,
            }}
          ></div>
          <motion.div
            className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay opacity-0 group-hover:opacity-100 transition duration-700"
            style={{
              maskImage,
              backgroundImage: `url(${gridLines.src})`,
            }}
          ></motion.div>

          {/* Content */}
          <div className="relative text-center">
            <h2 className="text-5xl md:text-6xl max-w-xl mx-auto tracking-tighter font-semibold text-white">
              AI-Powered Learning for Everyone.
            </h2>
            <p className="text-lg text-white/80 max-w-lg mx-auto mt-5 px-4">
              Transform your study habits with AI-generated flashcards, quizzes,
              and games. Learn smarter, not harder.
            </p>
            <div className="flex justify-center mt-8">
              <Link href="/api/quiz">
                <Button className="px-6 py-3 text-lg font-semibold border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300">
                  Start Learning Now
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
