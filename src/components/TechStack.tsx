import { motion } from "motion/react";

const skills = [
  "GenAI", "Prompt Engineering", "Machine Learning", "Random Forest", "Logistic Regression", 
  "Linear Regression", "Exploratory Data Analysis", "Python", "C++", 
  "Video Editing"
];

export default function TechStack() {
  return (
    <section className="py-24 border-y border-white/5 bg-white/[0.01]">
      <div className="px-6 max-w-7xl mx-auto mb-12">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#00D2FF] mb-4">02 // Technical Core</h2>
        <p className="text-3xl font-medium">Skills</p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="py-12 animate-marquee whitespace-nowrap flex gap-8 md:gap-16">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="flex gap-8 md:gap-16 items-center">
              {skills.map((skill) => (
                <span 
                  key={skill} 
                  className="text-3xl sm:text-4xl md:text-7xl font-medium text-zinc-900 hover:text-[#00D2FF] hover:text-glow transition-all duration-500 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}} />
    </section>
  );
}
