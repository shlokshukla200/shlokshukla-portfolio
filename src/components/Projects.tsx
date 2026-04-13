import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { ExternalLink, Github, Globe, ArrowRight, Cpu, Activity, Database } from "lucide-react";

const projects = [
  {
    title: "LighthouseAI",
    subtitle: "Student Academic Performance Predictor",
    description: "Developed a predictive platform to address the academic 'black box' challenge, enabling students to quantify the impact of sleep, screen time, attendance, and study habits on GPA. Engineered a 'What-If Simulator' for scenario modelling.",
    link: "https://project-lighthouseai.vercel.app",
    tags: ["Predictive Modeling", "React", "Data Science"],
    type: "Web App",
    icon: <Activity size={20} />,
    hasScan: true,
    accuracy: "Mean Avg Error = ±4.6%",
    hoverText: "SIMULATE_SCENARIO"
  },
  {
    title: "Soumya AI",
    subtitle: "Anonymous Healthcare Assistant",
    description: "Designed and deployed an anonymous, AI-powered healthcare solution to predict a skin disease and suggest its remedies, mental health support and overcome barriers caused by social stigma. Provides immediate, judgment-free guidance.",
    link: "https://soumyaai.vercel.app",
    tags: ["Generative AI", "Healthcare", "NLP"],
    type: "AI Assistant",
    icon: <Cpu size={20} />,
    hasScan: true,
    hoverText: "INITIATE_DIAGNOSIS"
  },
  {
    title: "CTC Predictor",
    subtitle: "Corporate Salary Estimation Model",
    description: "Developed an XGBoost-based regression model to predict candidate compensation by analysing professional profiles, experience, education, and performance metrics. Deployed as an interactive Streamlit app.",
    link: "https://salary-predictor-shlok.streamlit.app",
    tags: ["XGBoost", "Streamlit", "Regression"],
    type: "ML Model",
    accuracy: "R2 Score = 0.9",
    icon: <Database size={20} />,
    hoverText: "PREDICT_COMPENSATION"
  },
  {
    title: "Student Stress Prediction",
    subtitle: "Classification Model",
    description: "Engineered a multi-class classification model using Random Forest to categorise student stress levels based on 20 psychological and academic variables. Achieved an 87% prediction accuracy rate.",
    link: "https://github.com/shlokshukla200/ML-Random_Forest",
    tags: ["Random Forest", "Python", "Scikit-Learn"],
    type: "Research",
    accuracy: "Accuracy = 87%",
    icon: <Activity size={20} />,
    hoverText: "ANALYZE_STRESS"
  },
  {
    title: "Puran Vani",
    subtitle: "Generative AI Implementation Project",
    description: "A content creation initiative leveraging Generative AI to digitize and visualize Indian mythological heritage (Shiv Puran & Sanatan Dharma) for a modern audience. Utilized ChatGPT, Gemini, Luvoice, DupDub, and Filmora.",
    link: "https://www.youtube.com/@puranvani11",
    tags: ["GenAI", "Prompt Engineering", "Video Editing"],
    type: "Content Creation",
    icon: <Cpu size={20} />,
    hoverText: "GENERATE_HERITAGE"
  },
  {
    title: "Skill Audit Report Portal",
    subtitle: "Institutional Intelligence",
    description: "SAR is an AI-driven portal that automates student gap analysis and predicts placement readiness through data-backed insights. It identifies specific skill deficits to suggest personalized remedial actions, transforming raw academic data into actionable institutional intelligence. I am currently leading its end-to-end development and deployment at SKIT Jaipur.",
    link: "",
    tags: ["AI", "Data Analytics", "Education"],
    type: "AI Intelligence",
    icon: <Database size={20} />,
    hasScan: true,
    hoverText: "AUDIT_SYSTEM"
  }
];

function ProjectCard({ project, index }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable 3D tilt on touch devices to prevent scroll interference
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1]
      }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      data-interactive
      data-hover-text={project.hoverText}
      className={`group relative glass rounded-[2rem] p-8 sm:p-10 flex flex-col justify-between hover:bg-white/[0.06] transition-all duration-500 overflow-hidden tech-border-glow ${project.featured ? 'md:col-span-2 border-[#00f2ff]/30 shadow-[0_0_30px_rgba(0,242,255,0.1)]' : ''}`}
    >
      {/* Scanning Effect */}
      {project.hasScan && (
        <div className="scanning-line hidden group-hover:block pointer-events-none" />
      )}

      <div style={{ transform: "translateZ(50px)" }}>
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${project.featured ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/50' : 'bg-[#00D2FF]/10 border border-[#00D2FF]/20 text-[#00D2FF]'}`}>
              {project.icon}
            </div>
            <div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                {project.type}
              </div>
            </div>
          </div>
          {project.link ? (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-[#00f2ff] hover:border-[#00f2ff]/50 hover:bg-[#00f2ff]/10 transition-all duration-300"
            >
              {project.link.includes('github') ? <Github size={20} /> : <Globe size={20} />}
            </a>
          ) : (
            <div className="px-4 py-1.5 rounded-full bg-[#00f2ff]/5 border border-[#00f2ff]/20 text-[10px] font-mono text-[#00f2ff] uppercase tracking-wider">
              In Development
            </div>
          )}
        </div>
        
        <h3 className={`text-2xl sm:text-3xl font-medium mb-3 transition-colors duration-300 ${project.link ? 'group-hover:text-[#00f2ff]' : ''}`}>
          {project.title}
        </h3>
        <p className="text-xs text-zinc-500 font-mono mb-6 uppercase tracking-widest">{project.subtitle}</p>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {project.description}
          {project.accuracy && (
            <span className="block mt-4 font-mono text-[#00f2ff] text-[10px] relative uppercase tracking-wider">
              PERFORMANCE_METRIC
              <span className="block mt-1 text-xs animate-pulse text-glow normal-case tracking-normal">
                {project.accuracy}
              </span>
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-3" style={{ transform: "translateZ(30px)" }}>
        {project.tags.map(tag => (
          <span key={tag} className="text-[10px] font-mono text-zinc-500 border border-white/5 px-3 py-1.5 rounded-lg bg-white/[0.02]">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#00D2FF] mb-4">01 // Selected Projects</h2>
        <p className="text-3xl sm:text-4xl font-medium">Engineering Solutions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
