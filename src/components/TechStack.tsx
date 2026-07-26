import { useState } from "react";
import { motion } from "motion/react";
import { Cpu, ShieldCheck } from "lucide-react";

interface SkillItem {
  name: string;
  level: number;
  category: string;
}

const skills: SkillItem[] = [
  { name: "Generative AI", level: 95, category: "AI & LLMs" },
  { name: "Prompt Engineering", level: 92, category: "AI & LLMs" },
  { name: "Machine Learning", level: 90, category: "Core ML" },
  { name: "Python", level: 94, category: "Engineering" },
  { name: "C++", level: 88, category: "Engineering" },
  { name: "Leadership", level: 90, category: "Soft Skills" },
  { name: "Communication", level: 92, category: "Soft Skills" },
  { name: "Presentation", level: 86, category: "Soft Skills" },
];

export default function TechStack() {
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(skills[0]);

  // Radar Chart Calculations
  const cx = 200;
  const cy = 200;
  const radius = 140;
  const numSkills = skills.length;

  const getCoordinates = (index: number, levelPercent: number) => {
    const angle = (Math.PI * 2 * index) / numSkills - Math.PI / 2;
    const r = (radius * levelPercent) / 100;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Concentric background grid webs (25%, 50%, 75%, 100%)
  const gridRings = [0.25, 0.5, 0.75, 1.0];

  // Polygon points for skill levels
  const skillPolygonPoints = skills
    .map((s, i) => {
      const { x, y } = getCoordinates(i, s.level);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#00D2FF] mb-4">
          02 // Technical Core
        </h2>
        <p className="text-3xl sm:text-4xl font-medium">Skills Radar & Proficiency</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Radar SVG Visualization Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="lg:col-span-7 glass rounded-[2rem] p-6 sm:p-10 tech-border-glow relative overflow-hidden flex flex-col items-center justify-center"
        >
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="text-[#00D2FF]" size={20} />
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                RADAR_VECTOR_GRAPH
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#00D2FF] uppercase tracking-wider bg-[#00D2FF]/10 border border-[#00D2FF]/30 px-3 py-1 rounded-full">
              LIVE_EVALUATION
            </span>
          </div>

          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
              <defs>
                <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3A7BD5" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              {/* Concentric Web Rings */}
              {gridRings.map((percent, ringIdx) => {
                const points = skills
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, percent * 100);
                    return `${x},${y}`;
                  })
                  .join(" ");
                return (
                  <polygon
                    key={ringIdx}
                    points={points}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                    strokeDasharray={ringIdx === 3 ? "none" : "3,3"}
                  />
                );
              })}

              {/* Radial Axis Lines */}
              {skills.map((_, i) => {
                const { x, y } = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Animated Skill Level Polygon */}
              <motion.polygon
                points={skillPolygonPoints}
                fill="url(#radarFill)"
                stroke="#00D2FF"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                style={{ transformOrigin: "200px 200px" }}
              />

              {/* Skill Nodes & Labels */}
              {skills.map((s, i) => {
                const { x, y } = getCoordinates(i, s.level);
                const outer = getCoordinates(i, 115);
                const isSelected = activeSkill?.name === s.name;

                return (
                  <g
                    key={s.name}
                    className="cursor-pointer group"
                    onClick={() => setActiveSkill(s)}
                    onMouseEnter={() => setActiveSkill(s)}
                  >
                    {/* Glowing Vertex Node */}
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 7 : 5}
                      fill={isSelected ? "#00f2ff" : "#3A7BD5"}
                      stroke="#ffffff"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                      viewport={{ once: true }}
                      className="transition-all duration-300 filter drop-shadow-[0_0_8px_#00D2FF]"
                    />

                    {/* Skill Axis Label */}
                    <text
                      x={outer.x}
                      y={outer.y}
                      textAnchor={outer.x > cx + 10 ? "start" : outer.x < cx - 10 ? "end" : "middle"}
                      dominantBaseline="middle"
                      className={`text-[10px] font-mono transition-colors duration-300 ${
                        isSelected ? "fill-[#00D2FF] font-semibold text-glow" : "fill-zinc-400 group-hover:fill-white"
                      }`}
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </motion.div>

        {/* Skill Detail Panel & Quick Grid */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Skill Telemetry Box */}
          {activeSkill && (
            <motion.div
              key={activeSkill.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-[2rem] p-8 border border-[#00D2FF]/30 tech-border-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-[#00D2FF] uppercase tracking-widest px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/20">
                  {activeSkill.category}
                </span>
                <ShieldCheck size={18} className="text-[#00D2FF]" />
              </div>

              <h3 className="text-2xl font-medium mb-2">{activeSkill.name}</h3>
              
              <div className="space-y-2 mt-6">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Proficiency Threshold</span>
                  <span className="text-[#00D2FF] font-bold">{activeSkill.level}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeSkill.level}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] shadow-[0_0_10px_#00D2FF]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Interactive Skill Selector Pills */}
          <div className="glass rounded-[2rem] p-6 flex flex-wrap gap-2.5 border border-white/5">
            {skills.map((s) => (
              <button
                key={s.name}
                onClick={() => setActiveSkill(s)}
                onMouseEnter={() => setActiveSkill(s)}
                aria-label={`View ${s.name} skill level`}
                className={`text-xs font-mono px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                  activeSkill?.name === s.name
                    ? "bg-[#00f2ff]/10 border-[#00f2ff] text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Banner */}
      <div className="relative flex overflow-x-hidden mt-16 border-t border-white/5 pt-8">
        <div className="animate-marquee whitespace-nowrap flex gap-8 md:gap-16">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="flex gap-8 md:gap-16 items-center">
              {skills.map((s) => (
                <span
                  key={s.name}
                  onClick={() => setActiveSkill(s)}
                  className="text-2xl sm:text-3xl md:text-5xl font-medium text-zinc-800 hover:text-[#00D2FF] hover:text-glow transition-all duration-500 cursor-pointer"
                >
                  {s.name}
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
