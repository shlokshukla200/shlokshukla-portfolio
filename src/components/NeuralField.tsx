import { useEffect, useRef } from "react";

export default function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 800;
    const mouse = { x: -1000, y: -1000, active: false };
    const clusterRadius = 150;
    const clusterStrength = 0.08;

    let globalOpacity = 0;
    const startTime = Date.now();
    const delay = 3000; // 3 seconds delay
    const fadeDuration = 1500; // 1.5 seconds fade in

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseColor: string;
      activeColor: string;
      isClustered: boolean;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.2 + 0.2;
        this.baseColor = "rgba(0, 242, 255, 0.2)"; // Cyber Cyan
        this.activeColor = "rgba(75, 0, 130, 0.6)"; // Deep Indigo
        this.isClustered = false;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Boundary wrap
        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;

        // Clustering Interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < clusterRadius) {
          this.isClustered = true;
          // Target position on a circle around the mouse
          const angle = Math.atan2(dy, dx);
          const targetX = mouse.x - Math.cos(angle) * (clusterRadius * 0.6);
          const targetY = mouse.y - Math.sin(angle) * (clusterRadius * 0.6);
          
          this.x += (targetX - this.x) * clusterStrength;
          this.y += (targetY - this.y) * clusterStrength;
          
          // Orbital velocity
          this.vx += Math.cos(angle + Math.PI / 2) * 0.1;
          this.vy += Math.sin(angle + Math.PI / 2) * 0.1;
        } else {
          this.isClustered = false;
          // Friction to return to normal speed
          this.vx *= 0.98;
          this.vy *= 0.98;
        }
      }

      draw() {
        if (!ctx || globalOpacity <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Apply global opacity to the colors
        const color = this.isClustered ? this.activeColor : this.baseColor;
        // Extract rgba components and multiply alpha by globalOpacity
        const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgba) {
          const r = rgba[1];
          const g = rgba[2];
          const b = rgba[3];
          const a = rgba[4] ? parseFloat(rgba[4]) : 1;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * globalOpacity})`;
        } else {
          ctx.fillStyle = color;
        }
        
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      // Update global opacity based on time
      const elapsed = Date.now() - startTime;
      if (elapsed > delay) {
        globalOpacity = Math.min(1, (elapsed - delay) / fadeDuration);
      } else {
        globalOpacity = 0;
      }

      // Deep Obsidian Background
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Particles
      if (globalOpacity > 0) {
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}

