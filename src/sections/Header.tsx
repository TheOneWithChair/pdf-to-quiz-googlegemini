"use client";

import LogoIcon from "@/assets/logo.svg";
import MenuIcon from "@/assets/icon-menu.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Header = () => {
  const handleScrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="py-4 border-b border-white/15 md:border-none sticky top-0 z-10">
      <div className="absolute inset-0 backdrop-blur -z-10 md:hidden"></div>
      <div className="container">
        <div className="flex justify-between items-center md:border border-white/15 md:p-2.5 rounded-xl max-w-2xl mx-auto relative">
          <div className="absolute inset-0 backdrop-blur -z-10 hidden md:block"></div>
          <div onClick={handleScrollToTop} className="cursor-pointer">
            <div className="border h-10 w-10 rounded-lg inline-flex justify-center items-center border-white/15">
              <LogoIcon className="h-8 w-8 " />
            </div>
          </div>
          <div className="hidden md:block">
            <nav className="flex gap-8 text-white/70 text-sm">
              <a
                href="#features"
                className="hover:text-white transition"
                onClick={handleScrollToFeatures}
              >
                Features
              </a>
              <a href="#testimonials-section" className="hover:text-white transition">
                Testimonials
              </a>
              <a href="#call-to-action-section" className="hover:text-white transition">
                More
              </a>
              
            </nav>
          </div>
          <div className="flex gap-4 items-center">
  <Link href="/api/quiz">
    <Button>Get Started</Button>
  </Link>
  <MenuIcon className="md:hidden" />
</div>
        </div>
      </div>
    </header>
  );
};
