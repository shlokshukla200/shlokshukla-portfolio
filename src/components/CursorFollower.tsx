import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export default function CursorFollower() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState("");
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [data-interactive]');
      
      if (isInteractive) {
        setIsHovered(true);
        const text = isInteractive.getAttribute('data-hover-text') || "";
        setHoverText(text);
      } else {
        setIsHovered(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="relative flex items-center justify-center"
      >
        {/* Main Reticle */}
        <motion.div
          animate={{
            width: isHovered ? 80 : 40,
            height: isHovered ? 80 : 40,
            rotate: isHovered ? 90 : 0,
          }}
          className="absolute border border-[#00D2FF]/50 rounded-full flex items-center justify-center"
        >
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-[#00D2FF]/20" />
          <div className="absolute h-full w-[1px] bg-[#00D2FF]/20" />
          
          {/* Corners */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D2FF]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00D2FF]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00D2FF]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00D2FF]" />
        </motion.div>

        {/* Center Dot */}
        <div className="w-1 h-1 bg-[#00D2FF] rounded-full shadow-[0_0_10px_#00D2FF]" />

        {/* Hover Text */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: isHovered && hoverText ? 1 : 0,
            x: isHovered && hoverText ? 50 : 20
          }}
          className="absolute left-0 whitespace-nowrap"
        >
          <span className="text-[10px] font-mono text-[#00D2FF] uppercase tracking-widest bg-black/50 px-2 py-1 rounded border border-[#00D2FF]/20">
            {hoverText || "Processing..."}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
