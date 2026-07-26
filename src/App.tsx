/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Experience from "./components/ImpactGrid";
import TechStack from "./components/TechStack";
import Certifications from "./components/Certifications";
import Footer from "./components/Footer";
import NeuralField from "./components/NeuralField";
import CursorFollower from "./components/CursorFollower";
import { motion, useScroll, useSpring } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative min-h-screen selection:bg-[#00D2FF] selection:text-black overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Background Engine */}
      <NeuralField />
      
      {/* Custom Cursor */}
      <CursorFollower />

      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.8%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />

      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <Projects />
        <Experience />
        <TechStack />
        <Certifications />
        <Footer />
      </div>
      
      {/* Vercel Web Analytics */}
      <Analytics />
      
      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </main>
  );
}
