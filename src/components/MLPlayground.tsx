import { useRef, useState, useCallback, useEffect, type MouseEvent } from "react";
import { motion } from "motion/react";
import { RotateCcw, MousePointerClick } from "lucide-react";

type Point = { x: number; y: number; label: 0 | 1 };

const WIDTH = 600;
const HEIGHT = 380;

// Simple logistic regression, trained live in the browser via gradient descent.
// Coordinates are normalized to [-1, 1] before training for numerical stability.
function trainLogisticRegression(points: Point[], iterations = 400, lr = 0.5) {
  let w1 = 0, w2 = 0, b = 0;
  if (points.length === 0) return { w1, w2, b };

  const norm = points.map((p) => ({
    x: (p.x / WIDTH) * 2 - 1,
    y: (p.y / HEIGHT) * 2 - 1,
    label: p.label
  }));

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

  for (let iter = 0; iter < iterations; iter++) {
    let gw1 = 0, gw2 = 0, gb = 0;
    for (const p of norm) {
      const z = w1 * p.x + w2 * p.y + b;
      const pred = sigmoid(z);
      const err = pred - p.label;
      gw1 += err * p.x;
      gw2 += err * p.y;
      gb += err;
    }
    const n = norm.length;
    w1 -= (lr * gw1) / n;
    w2 -= (lr * gw2) / n;
    b -= (lr * gb) / n;
  }

  return { w1, w2, b };
}

export default function MLPlayground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [nextLabel, setNextLabel] = useState<0 | 1>(0);
  const [weights, setWeights] = useState({ w1: 0, w2: 0, b: 0 });
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    if (points.length < 2) {
      setWeights({ w1: 0, w2: 0, b: 0 });
      return;
    }
    setIsTraining(true);
    // Defer to keep click feedback snappy; training is fast but this avoids jank on rapid clicks
    const id = requestAnimationFrame(() => {
      const result = trainLogisticRegression(points);
      setWeights(result);
      setIsTraining(false);
    });
    return () => cancelAnimationFrame(id);
  }, [points]);

  const handleClick = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
      const y = ((e.clientY - rect.top) / rect.height) * HEIGHT;

      setPoints((prev) => [...prev, { x, y, label: nextLabel }]);
      setNextLabel((prev) => (prev === 0 ? 1 : 0));
    },
    [nextLabel]
  );

  const reset = () => {
    setPoints([]);
    setWeights({ w1: 0, w2: 0, b: 0 });
  };

  // Compute the boundary line: w1*nx + w2*ny + b = 0, in normalized space,
  // mapped back to two on-screen endpoints (solving for y at x = -1 and x = 1,
  // or falling back to a vertical line when w2 is ~0).
  const getBoundaryLine = () => {
    const { w1, w2, b } = weights;
    if (points.length < 2 || (Math.abs(w1) < 1e-6 && Math.abs(w2) < 1e-6)) return null;

    const toScreen = (nx: number, ny: number) => ({
      x: ((nx + 1) / 2) * WIDTH,
      y: ((ny + 1) / 2) * HEIGHT
    });

    if (Math.abs(w2) > 1e-6) {
      const y1 = -(w1 * -1 + b) / w2;
      const y2 = -(w1 * 1 + b) / w2;
      const p1 = toScreen(-1, y1);
      const p2 = toScreen(1, y2);
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    } else if (Math.abs(w1) > 1e-6) {
      const x1 = -(w2 * -1 + b) / w1;
      const x2 = -(w2 * 1 + b) / w1;
      const p1 = toScreen(x1, -1);
      const p2 = toScreen(x2, 1);
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    }
    return null;
  };

  const boundary = getBoundaryLine();
  const classAColor = "#00f2ff";
  const classBColor = "#3A7BD5";

  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#00D2FF] mb-4">
          01 // Model Playground
        </h2>
        <p className="text-3xl sm:text-4xl font-medium">Watch a Model Learn</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="glass rounded-[2rem] p-6 sm:p-10 tech-border-glow relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-zinc-400">
            <MousePointerClick size={16} className="text-[#00f2ff]" />
            <span>
              click to add a point — currently placing{" "}
              <span
                className="font-semibold"
                style={{ color: nextLabel === 0 ? classAColor : classBColor }}
              >
                class {nextLabel === 0 ? "A" : "B"}
              </span>
            </span>
          </div>
          <button
            onClick={reset}
            data-interactive
            data-hover-text="RESET_MODEL"
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[#00f2ff]/50 hover:bg-[#00f2ff]/5 transition-all duration-300 text-xs font-mono uppercase tracking-wider text-zinc-300"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            onClick={handleClick}
            data-interactive
            data-hover-text="ADD_POINT"
            className="w-full h-auto block cursor-crosshair touch-none"
            style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
          >
            {/* subtle grid */}
            <defs>
              <pattern id="mlGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={WIDTH} height={HEIGHT} fill="url(#mlGrid)" />

            {/* decision boundary */}
            {boundary && (
              <motion.line
                x1={boundary.x1}
                y1={boundary.y1}
                x2={boundary.x2}
                y2={boundary.y2}
                stroke="#00f2ff"
                strokeWidth={2}
                strokeDasharray="6 4"
                initial={false}
                animate={{ x1: boundary.x1, y1: boundary.y1, x2: boundary.x2, y2: boundary.y2 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: "drop-shadow(0 0 6px rgba(0,242,255,0.6))" }}
              />
            )}

            {/* points */}
            {points.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={7}
                fill={p.label === 0 ? classAColor : classBColor}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: 7, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                stroke="rgba(0,0,0,0.4)"
                strokeWidth={1.5}
              />
            ))}
          </svg>

          {points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-zinc-600 text-xs sm:text-sm font-mono text-center px-6">
                add a few points of each class — a logistic regression model
                <br className="hidden sm:block" />
                will fit a boundary between them, live, right in your browser
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: classAColor }} />
            Class A
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: classBColor }} />
            Class B
          </span>
          <span>{points.length} points</span>
          <span className={isTraining ? "text-[#00f2ff] animate-pulse" : ""}>
            {isTraining ? "training…" : points.length >= 2 ? "converged" : "waiting for data"}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
