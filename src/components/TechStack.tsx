import { motion, useInView } from "motion/react";
import { useRef } from "react";

const skills = [
  "Generative AI", "Prompt Engineering", "Machine Learning", "C++", "Python", 
  "Communication", "Leadership", "Presentation Skills"
];

// Proficiency levels (0-100) driving the radar chart. Feel free to tune these.
const radarSkills = [
  { skill: "Machine Learning", level: 88 },
  { skill: "Generative AI", level: 90 },
  { skill: "Python", level: 92 },
  { skill: "Prompt Engineering", level: 85 },
  { skill: "C++", level: 70 },
  { skill: "Data Analysis", level: 80 }
];

const RADAR_SIZE = 420;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = RADAR_SIZE / 2 - 80;

function pointOnRadar(index: number, total: number, value: number) {
  // value is 0-1, angle starts at top (-90deg) and goes clockwise
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = RADAR_RADIUS * value;
  return {
    x: RADAR_CENTER + r * Math.cos(angle),
    y: RADAR_CENTER + r * Math.sin(angle),
    cos: Math.cos(angle)
  };
}

function SkillRadar() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });
  const total = radarSkills.length;

  const dataPoints = radarSkills.map((s, i) => pointOnRadar(i, total, s.level / 100));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const ringLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center px-6">
      <svg ref={ref} viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`} className="w-full max-w-sm">
        {/* concentric grid rings */}
        {ringLevels.map((lvl) => (
          <polygon
            key={lvl}
            points={radarSkills
              .map((_, i) => {
                const p = pointOnRadar(i, total, lvl);
                return `${p.x},${p.y}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}

        {/* spokes */}
        {radarSkills.map((_, i) => {
          const p = pointOnRadar(i, total, 1);
          return (
            <line
              key={i}
              x1={RADAR_CENTER}
              y1={RADAR_CENTER}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          );
        })}

        {/* animated data polygon, drawn outward from center */}
        <motion.polygon
          points={dataPath}
          fill="rgba(0, 242, 255, 0.15)"
          stroke="#00f2ff"
          strokeWidth={2}
          style={{ transformOrigin: `${RADAR_CENTER}px ${RADAR_CENTER}px`, filter: "drop-shadow(0 0 8px rgba(0,242,255,0.4))" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* data vertices */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#00f2ff"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* labels */}
        {radarSkills.map((s, i) => {
          const p = pointOnRadar(i, total, 1.2);
          const anchor = p.cos > 0.25 ? "start" : p.cos < -0.25 ? "end" : "middle";
          return (
            <text
              key={s.skill}
              x={p.x}
              y={p.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-zinc-400"
              style={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              {s.skill}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="py-24 border-y border-white/5 bg-white/[0.01]">
      <div className="px-6 max-w-7xl mx-auto mb-12">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#00D2FF] mb-4">03 // Technical Core</h2>
        <p className="text-3xl font-medium">Skills</p>
      </div>

      <div className="px-6 max-w-7xl mx-auto mb-16">
        <SkillRadar />
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
