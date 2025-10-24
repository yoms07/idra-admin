"use client";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/sections/Hero";
import { Team } from "@/components/landing/sections/Team";
import { About } from "@/components/landing/sections/About";
import Feature from "@/components/landing/sections/Features";
import { Products } from "@/components/landing/sections/Products";
import { Testimonial } from "@/components/landing/sections/Testimonial";
import { AccountAbstraction } from "@/components/landing/sections/AA";
import { Docs } from "@/components/landing/sections/Docs";
import "../components/landing/theme.css";
import { Testimonial2 } from "@/components/landing/sections/Testimonial2";

export default function Home() {
  return (
    <div className="bg-landing-background">
      <Header />
      <Hero />
      <About />
      <Products />
      <Testimonial />
      <AccountAbstraction />
      <Docs />
      <Testimonial2 />
      <Footer />
    </div>
  );
}
