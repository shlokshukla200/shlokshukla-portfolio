/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import MLPlayground from "./components/MLPlayground";
import Experience from "./components/ImpactGrid";
import TechStack from "./components/TechStack";
import Certifications from "./components/Certifications";
import Footer from "./components/Footer";
import NeuralField from "./components/NeuralField";
import CursorFollower from "./components/CursorFollower";
import { motion, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function ScrollTrainingProgress({ scrollYProgress }: { scrollYProgress: any }) {
  const [loss, setLoss] = useState("2.50");
  const [epoch, setEpoch] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    // Map scroll 0 -> 1 to Loss 2.50 -> 0.02 and Epoch 1 -> 100
    const currentLoss = Math.max(0.02, 2.50 - latest * 2.48).toFixed(2);
    const currentEpoch = Math.min(100, Math.max(1, Math.floor(latest * 99) + 1));
    setLoss(currentLoss);
    setEpoch(currentEpoch);
  });

  return (
    <div className="fixed top-4 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#00D2FF]/30 text-[10px] font-mono text-[#00D2FF] uppercase tracking-wider shadow-[0_0_15px_rgba(0,210,255,0.15)] pointer-events-none">
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
        EPOCH {epoch}/100
      </span>
      <span className="text-zinc-600">|</span>
      <span>LOSS: {loss}</span>
    </div>
  );
}

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

      {/* Training Progress Telemetry Readout */}
      <ScrollTrainingProgress scrollYProgress={scrollYProgress} />

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
        <MLPlayground />
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
