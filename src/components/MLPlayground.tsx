import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { RotateCcw, Play, PlusCircle, BrainCircuit } from "lucide-react";

interface Point {
  x: number; // Normalized -1 to 1
  y: number; // Normalized -1 to 1
  label: 0 | 1;
}

export default function MLPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([
    { x: -0.5, y: -0.4, label: 0 },
    { x: -0.6, y: 0.2, label: 0 },
    { x: -0.3, y: -0.7, label: 0 },
    { x: -0.4, y: 0.5, label: 0 },
    { x: 0.5, y: 0.4, label: 1 },
    { x: 0.6, y: -0.2, label: 1 },
    { x: 0.3, y: 0.7, label: 1 },
    { x: 0.4, y: -0.5, label: 1 },
  ]);
  const [activeClass, setActiveClass] = useState<0 | 1>(0);
  const [weights, setWeights] = useState<{ w0: number; w1: number; b: number }>({
    w0: 0.5,
    w1: -0.5,
    b: 0,
  });
  const [epochs, setEpochs] = useState(0);
  const [loss, setLoss] = useState(0.5);
  const [accuracy, setAccuracy] = useState(100);

  // Logistic Sigmoid
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, z))));

  // Run gradient descent step
  const trainModel = useCallback(() => {
    if (points.length === 0) return;

    let { w0, w1, b } = weights;
    const lr = 0.15;
    let totalLoss = 0;
    let correct = 0;

    for (let iter = 0; iter < 10; iter++) {
      let dw0 = 0;
      let dw1 = 0;
      let db = 0;
      totalLoss = 0;
      correct = 0;

      for (const p of points) {
        const z = w0 * p.x + w1 * p.y + b;
        const pred = sigmoid(z);
        const err = pred - p.label;

        dw0 += err * p.x;
        dw1 += err * p.y;
        db += err;

        // Binary cross-entropy loss
        const eps = 1e-7;
        const pLoss = - (p.label * Math.log(pred + eps) + (1 - p.label) * Math.log(1 - pred + eps));
        totalLoss += pLoss;

        if ((pred >= 0.5 && p.label === 1) || (pred < 0.5 && p.label === 0)) {
          correct++;
        }
      }

      const n = points.length;
      w0 -= (lr * dw0) / n;
      w1 -= (lr * dw1) / n;
      b -= (lr * db) / n;
    }

    setWeights({ w0, w1, b });
    setEpochs((prev) => prev + 10);
    setLoss(totalLoss / points.length);
    setAccuracy(Math.round((correct / points.length) * 100));
  }, [points, weights]);

  // Train automatically when points change
  useEffect(() => {
    trainModel();
  }, [points]);

  // Render decision boundary canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Probability Background Grid (Heatmap)
    const step = 8;
    const { w0, w1, b } = weights;

    for (let px = 0; px < width; px += step) {
      for (let py = 0; py < height; py += step) {
        // Map pixel to [-1, 1]
        const nx = (px / width) * 2 - 1;
        const ny = -((py / height) * 2 - 1);

        const z = w0 * nx + w1 * ny + b;
        const prob = sigmoid(z); // 0 to 1

        // Interpolate between Cyber Cyan (Class 0: rgba(0, 242, 255)) and Tech Blue (Class 1: rgba(58, 123, 213))
        const r = Math.round(0 * (1 - prob) + 58 * prob);
        const g = Math.round(242 * (1 - prob) + 123 * prob);
        const bl = Math.round(255 * (1 - prob) + 213 * prob);
        const alpha = 0.08 + Math.abs(prob - 0.5) * 0.12;

        ctx.fillStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
        ctx.fillRect(px, py, step, step);
      }
    }

    // 2. Draw Grid Lines & Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // 3. Draw Decision Boundary Line (w0 * x + w1 * y + b = 0)
    ctx.save();
    ctx.shadowColor = "#00D2FF";
    ctx.shadowBlur = 12;
    ctx.strokeStyle = "#00D2FF";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);

    ctx.beginPath();
    if (Math.abs(w1) > 0.001) {
      const x1 = -1;
      const y1 = (-w0 * x1 - b) / w1;
      const px1 = ((x1 + 1) / 2) * width;
      const py1 = ((-y1 + 1) / 2) * height;

      const x2 = 1;
      const y2 = (-w0 * x2 - b) / w1;
      const px2 = ((x2 + 1) / 2) * width;
      const py2 = ((-y2 + 1) / 2) * height;

      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
    } else if (Math.abs(w0) > 0.001) {
      const xVal = -b / w0;
      const px = ((xVal + 1) / 2) * width;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
    }
    ctx.stroke();
    ctx.restore();

    // 4. Draw Data Points
    points.forEach((p) => {
      const px = ((p.x + 1) / 2) * width;
      const py = ((-p.y + 1) / 2) * height;

      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = p.label === 0 ? "#00f2ff" : "#3A7BD5";
      ctx.shadowColor = p.label === 0 ? "#00f2ff" : "#3A7BD5";
      ctx.shadowBlur = 10;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    });
  }, [points, weights]);

  // Handle Canvas Click to add point
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const x = (px / rect.width) * 2 - 1;
    const y = -((py / rect.height) * 2 - 1);

    setPoints((prev) => [...prev, { x, y, label: activeClass }]);
    // Toggle active class automatically for smooth alternate addition
    setActiveClass((prev) => (prev === 0 ? 1 : 0));
  };

  const handleReset = () => {
    setPoints([]);
    setWeights({ w0: 0.1, w1: -0.1, b: 0 });
    setEpochs(0);
    setLoss(0);
    setAccuracy(100);
  };

  const handleAddPreset = () => {
    setPoints([
      { x: -0.5, y: -0.4, label: 0 },
      { x: -0.6, y: 0.2, label: 0 },
      { x: -0.3, y: -0.7, label: 0 },
      { x: -0.4, y: 0.5, label: 0 },
      { x: 0.5, y: 0.4, label: 1 },
      { x: 0.6, y: -0.2, label: 1 },
      { x: 0.3, y: 0.7, label: 1 },
      { x: 0.4, y: -0.5, label: 1 },
    ]);
  };

  return (
    <section id="playground" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#00D2FF] mb-4">
          01.5 // Interactive Model
        </h2>
        <p className="text-3xl sm:text-4xl font-medium">Gradient Descent Sandbox</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="glass rounded-[2rem] p-6 sm:p-10 tech-border-glow relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BrainCircuit className="text-[#00D2FF]" size={24} />
              <h3 className="text-xl sm:text-2xl font-medium">Logistic Decision Boundary</h3>
            </div>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              click to add points — watch the boundary learn
            </p>
          </div>

          {/* Class Selectors & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveClass(0)}
              aria-label="Select Class A (Cyber Cyan)"
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                activeClass === 0
                  ? "bg-[#00f2ff]/20 border-[#00f2ff] text-[#00f2ff] shadow-[0_0_12px_rgba(0,242,255,0.3)]"
                  : "border-white/10 text-zinc-400 hover:border-white/20"
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#00f2ff] mr-2" />
              Class A (Cyan)
            </button>

            <button
              onClick={() => setActiveClass(1)}
              aria-label="Select Class B (Tech Blue)"
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                activeClass === 1
                  ? "bg-[#3A7BD5]/30 border-[#3A7BD5] text-[#3A7BD5] shadow-[0_0_12px_rgba(58,123,213,0.3)]"
                  : "border-white/10 text-zinc-400 hover:border-white/20"
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#3A7BD5] mr-2" />
              Class B (Blue)
            </button>

            <button
              onClick={trainModel}
              aria-label="Train Model Step"
              className="px-4 py-2 rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 text-[#00f2ff] text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Play size={12} />
              Train Step
            </button>

            <button
              onClick={handleReset}
              aria-label="Reset Sandbox"
              className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <RotateCcw size={12} />
              Reset
            </button>

            {points.length === 0 && (
              <button
                onClick={handleAddPreset}
                aria-label="Load Sample Data"
                className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <PlusCircle size={12} />
                Load Presets
              </button>
            )}
          </div>
        </div>

        {/* Canvas & Metrics Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* Interactive Canvas */}
          <div className="lg:col-span-3 relative rounded-2xl border border-white/10 bg-black/60 overflow-hidden cursor-crosshair group min-h-[300px] sm:min-h-[380px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={380}
              onClick={handleCanvasClick}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 pointer-events-none text-[10px] font-mono text-zinc-500 bg-black/60 px-3 py-1 rounded-full border border-white/10">
              NEXT_POINT // CLASS_{activeClass === 0 ? "A (CYAN)" : "B (BLUE)"}
            </div>
          </div>

          {/* Realtime Model Metrics Panel */}
          <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between space-y-6">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00D2FF] mb-4">
                LIVE_TELEMETRY
              </p>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Training Loss</span>
                  <div className="text-2xl font-mono text-white font-medium">
                    {loss.toFixed(4)}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Accuracy</span>
                  <div className="text-2xl font-mono text-[#00f2ff] font-medium">
                    {accuracy}%
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Epochs / Step</span>
                  <div className="text-sm font-mono text-zinc-300">{epochs} ITERATIONS</div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Sample Size</span>
                  <div className="text-sm font-mono text-zinc-300">{points.length} DATA POINTS</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                WEIGHT_VECTOR
              </span>
              <div className="text-[11px] font-mono text-zinc-400 truncate">
                w1: {weights.w0.toFixed(2)} | w2: {weights.w1.toFixed(2)}
              </div>
              <div className="text-[11px] font-mono text-zinc-400 truncate">
                bias: {weights.b.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
