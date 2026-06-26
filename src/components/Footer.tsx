import { useState } from "react";
import { Copy, Check, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "shlokshukla200@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="py-24 px-4 sm:px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-6xl font-medium mb-8 leading-tight">
            Let's build. <br />
            <span className="text-zinc-500">Connect.</span>
          </h2>
          
          <div className="flex gap-6">
            <a 
              href="https://linkedin.com/in/shlokshukla200" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://github.com/shlokshukla200" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
            >
              <Github size={20} />
            </a>
            <a 
              href="mailto:shlokshukla200@gmail.com" 
              className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-end items-start md:items-end">
          <div className="space-y-8 w-full max-w-md">
            <div className="group cursor-pointer" onClick={copyEmail}>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2">Direct Contact</p>
              <div className="flex items-center justify-between py-4 border-b border-white/10 group-hover:border-white transition-colors">
                <span className="text-xl font-medium">{email}</span>
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="text-emerald-500" size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="text-zinc-500 group-hover:text-white transition-colors" size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              <span>© 2026 SHLOK SHUKLA</span>
              <span>Let’s build the future of AI together</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
