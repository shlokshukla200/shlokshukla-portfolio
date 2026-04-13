import { motion } from "motion/react";
import { Briefcase, Calendar, MapPin, ChevronRight } from "lucide-react";

const experiences = [
  {
    role: "Campus Ambassador",
    company: "GeeksforGeeks",
    period: "January 2026 — Present",
    location: "Jaipur, India",
    highlights: [
      "Spearheaded the coordination and execution of an offline guest session featuring the CEO of GeeksforGeeks.",
      "Acted as the primary liaison to organise a campus hackathon with over 200 participants from across the city.",
      "Mentored peers on mastering Data Structures, Algorithms, and technical interview preparation.",
      "Strategised campus-wide outreach programs to increase student engagement with technical contests."
    ]
  },
  {
    role: "Machine Learning Intern",
    company: "LaunchED Global",
    period: "September 2025 — October 2025",
    location: "Remote",
    highlights: [
      "Developed and deployed a comprehensive suite of 10 machine learning projects applying supervised learning.",
      "Implemented core ML algorithms including Random Forest, KNN, and Time Series.",
      "Performed data preprocessing and feature engineering to optimise model performance and mitigate overfitting."
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mb-16">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#00D2FF] mb-4">02 // Professional Path</h2>
        <p className="text-3xl font-medium">Experience Timeline</p>
      </div>

      <div className="relative space-y-12">
        {/* Timeline Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#00D2FF]/50 via-white/10 to-transparent" />

        {experiences.map((exp, i) => (
          <motion.div 
            key={exp.company}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
            viewport={{ once: true }}
            data-interactive
            data-hover-text={exp.company === "GeeksforGeeks" ? "LEADERSHIP_ROLE" : "ML_INTERNSHIP"}
            className="relative pl-8 sm:pl-12 group"
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-[#030303] border border-white/20 flex items-center justify-center z-10 group-hover:border-[#00D2FF] transition-colors duration-500">
              <div className="w-2 h-2 rounded-full bg-white group-hover:bg-[#00D2FF] group-hover:shadow-[0_0_10px_#00D2FF] transition-all duration-500" />
            </div>

            <div className={`glass rounded-[2rem] p-8 sm:p-10 hover:bg-white/[0.05] transition-all duration-500 tech-border-glow ${exp.company === "GeeksforGeeks" ? 'border-[#00f2ff]/30 shadow-[0_0_20px_rgba(0,242,255,0.05)]' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-medium text-white">{exp.role}</h3>
                    {exp.company === "GeeksforGeeks" && (
                      <span className="px-3 py-1 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[10px] font-mono text-[#00f2ff] uppercase tracking-wider">
                        Leadership
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <span className="text-[#00f2ff] font-mono text-sm tracking-tight">{exp.company}</span>
                    <span className="text-zinc-800">•</span>
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <MapPin size={12} className="text-[#00f2ff]" />
                      {exp.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00f2ff]/5 border border-[#00f2ff]/20 text-[10px] font-mono text-[#00f2ff] uppercase tracking-widest h-fit">
                  <Calendar size={12} />
                  {exp.period}
                </div>
              </div>

              <ul className="space-y-5">
                {exp.highlights.map((item, idx) => (
                  <li key={idx} className="flex gap-4 text-sm text-zinc-400 leading-relaxed group/item">
                    <ChevronRight size={18} className={`shrink-0 mt-0.5 group-hover/item:translate-x-1 transition-transform ${exp.company === "GeeksforGeeks" ? 'text-[#00f2ff]' : 'text-[#00D2FF]'}`} />
                    <span className="group-hover/item:text-zinc-200 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
