"use client";

import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "“This tool made studying so much easier! Flashcards and quizzes helped me ace my exams.”",
    name: "Sophia Perez",
    title: "Student @ MIT",
    avatarImg: avatar1,
  },
  {
    text: "“The AI-powered quizzes are spot on! They saved me hours of manual note-making.”",
    name: "Jamie Lee",
    title: "CS Major @ Stanford",
    avatarImg: avatar2,
  },
  {
    text: "“I love the matching game mode. It makes learning fun and engaging!”",
    name: "Alisa Hester",
    title: "High School Student",
    avatarImg: avatar3,
  },
  {
    text: "“This Quizlet alternative is next-level! The Google Gemini API-generated questions are accurate.”",
    name: "Alec Whitten",
    title: "Educator @ Harvard",
    avatarImg: avatar4,
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials-section" className="py-20 md:py-24">
      <div className="container">
        <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter">
        What Learners Say
        </h2>
        <p className="text-white/70 text-lg md:text-xl mt-5 tracking-tight text-center max-w-sm mx-auto">
        Our AI-powered study tools help students and educators master any
        subject effortlessly.
        </p>
        <div className="overflow-hidden mt-10 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <motion.div
            initial={{ translateX: "-50%" }}
            animate={{ translateX: "0" }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20, // Adjust duration for desired speed
            }}
            className="flex gap-5 flex-none"
            style={{ width: "200%" }} // Ensure the container is twice the width
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="border border-white/15 p-6 md:p-10 rounded-xl bg-[linear-gradient(to_bottom_left,rgb(140,69,266,.3),black)] max-w-xs md:max-w-md flex-none"
              >
                <div className="text-lg md:text-2xl tracking-tight text-white/90">
                  {testimonial.text}
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <div className="relative">
                    <Image
                      className="rounded-lg h-11 w-11 grayscale"
                      src={testimonial.avatarImg}
                      alt={`Avatar for ${testimonial.name}`}
                    />
                  </div>
                  <div>
                    <div className="text-white/90">{testimonial.name}</div>
                    <div className="text-white/50 text-sm">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
