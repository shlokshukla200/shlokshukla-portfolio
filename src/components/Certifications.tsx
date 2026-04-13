import { Award, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const certs = [
  { name: "Google Prompting Essentials", issuer: "Coursera", date: "2025" },
  { name: "Machine Learning Internship", issuer: "LaunchED Global", date: "2025" },
  { name: "Oracle AI Foundations Associate", issuer: "Oracle", date: "2025" },
  { name: "Business English", issuer: "Infosys Springboard", date: "2025" },
];

export default function Certifications() {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#00D2FF] mb-4">03 // Proof of Competence</h2>
        <p className="text-3xl font-medium">Verified Credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {certs.map((cert, i) => (
          <motion.div 
            key={cert.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            viewport={{ once: true }}
            className="group relative p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 tech-border-glow"
          >
            <div className="mb-10">
              <div className="w-14 h-14 rounded-2xl bg-[#00D2FF]/5 border border-[#00D2FF]/10 flex items-center justify-center mb-8 group-hover:border-[#00D2FF]/30 transition-colors duration-500">
                <Award className="text-[#00D2FF]/60 group-hover:text-[#00D2FF] transition-colors duration-500" size={28} />
              </div>
              <h3 className="text-xl font-medium mb-3 leading-tight group-hover:text-white transition-colors">{cert.name}</h3>
              <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em]">{cert.issuer}</p>
            </div>

            <div className="flex items-center gap-2.5 text-[10px] font-mono text-zinc-600 group-hover:text-[#00D2FF]/60 transition-colors">
              <CheckCircle2 size={14} className="text-[#00D2FF]/40" />
              <span>VERIFIED_STATUS // {cert.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
