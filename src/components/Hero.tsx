import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [text, setText] = useState("");
  const fullText = "Building Intelligent Solutions with AI, Machine Learning, and Generative AI.";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 50); // Faster typing
    return () => clearInterval(timer);
  }, []);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToExperience = () => {
    const element = document.getElementById('experience');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Neural Lines Effect */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-5xl"
      >
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter mb-8 leading-[0.85]">
          Shlok <span className="text-zinc-600">Shukla</span>
        </h1>
        
        <div className="min-h-[3rem]">
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-mono leading-relaxed px-4 sm:px-0">
            {text}<span className="animate-pulse text-[#00f2ff]">_</span>
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-6 px-6 sm:px-0"
        >
          <button 
            onClick={scrollToProjects}
            data-interactive
            data-hover-text="EXPLORE_IMPACT"
            className="group relative w-full sm:w-auto px-10 py-4 rounded-full overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f2ff] to-[#3A7BD5] transition-transform duration-300 group-hover:scale-105" />
            <span className="relative z-10 text-black font-semibold flex items-center justify-center gap-2">
              View Impact
            </span>
          </button>
          <button 
            onClick={scrollToExperience}
            data-interactive
            data-hover-text="VIEW_JOURNEY"
            className="w-full sm:w-auto px-10 py-4 rounded-full border border-white/10 hover:border-[#00f2ff]/50 hover:bg-[#00f2ff]/5 transition-all duration-300 text-white font-medium flex items-center justify-center"
          >
            Experience
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-30"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#00f2ff] to-transparent" />
      </motion.div>
    </section>
  );
}
