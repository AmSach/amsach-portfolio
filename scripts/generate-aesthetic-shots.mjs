import fs from "fs";
import path from "path";

const SHOTS_DIR = "E:/amsach-portfolio/site/shots";
if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Universal Terminal Shell Builder
function createTerminalSvg({ title, command, leftTitle, leftItems, rightTitle, rightContent, statusText, subText }) {
  const leftLines = leftItems.map((item, i) => {
    const y = 120 + i * 26;
    const color = item.color || "#94a3b8";
    const label = escapeXml(item.label || "");
    const val = escapeXml(item.value || "");
    return `    <text x="44" y="${y}" fill="${color}" font-family="monospace" font-size="12">${label}${val ? ` <tspan fill="#f1f5f9">${val}</tspan>` : ""}</text>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460" width="800" height="460">
  <defs>
    <linearGradient id="termGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0e1117"/>
      <stop offset="100%" stop-color="#080a0f"/>
    </linearGradient>
    <linearGradient id="cyanLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <linearGradient id="emeraldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>

  <!-- Background Shell -->
  <rect width="800" height="460" rx="10" fill="url(#termGrad)"/>
  <rect x="1" y="1" width="798" height="458" rx="9" fill="none" stroke="#1e2638" stroke-width="2"/>

  <!-- Window Header Bar -->
  <rect width="800" height="38" rx="10" fill="#131826"/>
  <rect x="0" y="37" width="800" height="1" fill="#1e2638"/>
  <circle cx="24" cy="19" r="5" fill="#ff5f56"/>
  <circle cx="42" cy="19" r="5" fill="#ffbd2e"/>
  <circle cx="60" cy="19" r="5" fill="#27c93f"/>
  <text x="400" y="23" text-anchor="middle" fill="#7a889b" font-family="monospace" font-size="12" letter-spacing="0.5">${escapeXml(title)}</text>

  <!-- Command Prompt Strip -->
  <rect x="28" y="50" width="744" height="32" rx="5" fill="#0b0e14" stroke="#192231"/>
  <text x="40" y="71" fill="#4ade80" font-family="monospace" font-size="12" font-weight="bold">$ <tspan fill="#e2e8f0" font-weight="normal">${escapeXml(command)}</tspan></text>

  <!-- Left Sidebar Pane -->
  <rect x="28" y="92" width="224" height="338" rx="6" fill="#0a0d13" stroke="#192231"/>
  <rect x="28" y="92" width="224" height="28" rx="6" fill="#111622"/>
  <text x="40" y="110" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold" letter-spacing="1">${escapeXml(leftTitle)}</text>
${leftLines}

  <!-- Right Visual / Graph Pane -->
  <rect x="264" y="92" width="508" height="338" rx="6" fill="#0a0d13" stroke="#192231"/>
  <rect x="264" y="92" width="508" height="28" rx="6" fill="#111622"/>
  <text x="278" y="110" fill="#a78bfa" font-family="monospace" font-size="11" font-weight="bold" letter-spacing="1">${escapeXml(rightTitle)}</text>
  
  <!-- Right Content Injected -->
${rightContent}

  <!-- Status Bar Footer in Right Pane -->
  <rect x="278" y="380" width="480" height="36" rx="4" fill="#0e131d" stroke="#192231"/>
  <text x="292" y="398" fill="#4ade80" font-family="monospace" font-size="11" font-weight="bold">${escapeXml(statusText)}</text>
  <text x="292" y="411" fill="#64748b" font-family="monospace" font-size="10">${escapeXml(subText)}</text>
</svg>`;
}

// 1. MAPLE
const mapleSvg = createTerminalSvg({
  title: "maple — sub-2-bpw moe expert pruning hud",
  command: "maple prune --model gemma-4-26b-a4b --target 1.48bpw --residency in-vram",
  leftTitle: "MOE EXPERT MANIFOLD",
  leftItems: [
    { label: "Architecture:", value: "Gemma 4 26B A4B", color: "#38bdf8" },
    { label: "Active Experts:", value: "16 / 128", color: "#94a3b8" },
    { label: "Top-k Retained:", value: "48 Experts", color: "#4ade80" },
    { label: "Dormant Excised:", value: "80 Experts", color: "#f87171" },
    { label: "Original Size:", value: "9.92 GB", color: "#94a3b8" },
    { label: "Pruned Size:", value: "4.75 GB (-52.1%)", color: "#4ade80" },
    { label: "Residency:", value: "100% in 6GB VRAM", color: "#fbbf24" },
    { label: "Generation:", value: "45.4 tok/s", color: "#4ade80" },
    { label: "PPL Delta:", value: "+0.08 on GSM8K", color: "#38bdf8" }
  ],
  rightTitle: "EXPERT SALIENCY DISTRIBUTION & LATENCY SPARKLINE",
  rightContent: `  <!-- Grid Lines -->
  <line x1="280" y1="180" x2="750" y2="180" stroke="#161e2e" stroke-dasharray="4,4"/>
  <line x1="280" y1="240" x2="750" y2="240" stroke="#161e2e" stroke-dasharray="4,4"/>
  <line x1="280" y1="300" x2="750" y2="300" stroke="#161e2e" stroke-dasharray="4,4"/>
  
  <!-- Expert Histogram Bars -->
  <rect x="290" y="160" width="12" height="150" fill="#38bdf8" rx="2"/>
  <rect x="306" y="145" width="12" height="165" fill="#38bdf8" rx="2"/>
  <rect x="322" y="130" width="12" height="180" fill="#4ade80" rx="2"/>
  <rect x="338" y="150" width="12" height="160" fill="#4ade80" rx="2"/>
  <rect x="354" y="170" width="12" height="140" fill="#38bdf8" rx="2"/>
  <rect x="370" y="210" width="12" height="100" fill="#818cf8" rx="2"/>
  <rect x="386" y="240" width="12" height="70" fill="#818cf8" rx="2"/>
  <rect x="402" y="270" width="12" height="40" fill="#475569" rx="2"/>
  <rect x="418" y="285" width="12" height="25" fill="#334155" rx="2"/>
  <rect x="434" y="295" width="12" height="15" fill="#334155" rx="2"/>
  <rect x="450" y="298" width="12" height="12" fill="#334155" rx="2"/>
  <text x="310" y="325" fill="#4ade80" font-family="monospace" font-size="10">Retained Top-k (Active)</text>
  <text x="420" y="325" fill="#64748b" font-family="monospace" font-size="10">Excised (Dormant)</text>

  <!-- Throughput Curve -->
  <polyline points="490,300 530,270 570,240 610,210 650,180 690,165 730,160" fill="none" stroke="url(#cyanLine)" stroke-width="3"/>
  <circle cx="730" cy="160" r="4" fill="#38bdf8"/>
  <text x="640" y="150" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">45.4 tok/s</text>
  <text x="490" y="315" fill="#64748b" font-family="monospace" font-size="9">CPU offload 12.1 tok/s</text>`,
  statusText: "✓ Pruning complete · Softmax invariance verified · GGUF exported",
  subText: "Target 1.48 BPW · Retains STEM/Code reasoning · Zero CPU PCIe stalls"
});
fs.writeFileSync(path.join(SHOTS_DIR, "maple.svg"), mapleSvg);

// 2. VOXELNAV
const voxelnavSvg = createTerminalSvg({
  title: "voxelnav — jetson nano edge telemetry (<100ms)",
  command: "ros2 launch voxelnav semantic_mapping.launch.py --resolution 0.05",
  leftTitle: "ACTIVE ROS2 TOPICS",
  leftItems: [
    { label: "● /ouster/points", value: "20.0 Hz", color: "#4ade80" },
    { label: "● /camera/depth", value: "30.0 Hz", color: "#4ade80" },
    { label: "● /voxel_grid", value: "148,200 voxels", color: "#38bdf8" },
    { label: "● /nav2/costmap", value: "10.0 Hz", color: "#4ade80" },
    { label: "Octree Resolution:", value: "5.0 cm", color: "#94a3b8" },
    { label: "VRAM Allocation:", value: "184 MB", color: "#94a3b8" },
    { label: "Inference Latency:", value: "24.1 ms", color: "#38bdf8" },
    { label: "Pipeline Frame:", value: "42.8 ms", color: "#4ade80" },
    { label: "Budget Ceiling:", value: "100.0 ms", color: "#fbbf24" }
  ],
  rightTitle: "PIPELINE BREAKDOWN & REAL-TIME VOXEL DENSITY",
  rightContent: `  <!-- Latency Bar Waterfall -->
  <text x="285" y="145" fill="#94a3b8" font-family="monospace" font-size="11">LiDAR Ingest (28.4k pts)</text>
  <rect x="460" y="135" width="80" height="12" rx="2" fill="#38bdf8"/>
  <text x="550" y="145" fill="#38bdf8" font-family="monospace" font-size="10">14.2ms</text>

  <text x="285" y="175" fill="#94a3b8" font-family="monospace" font-size="11">Octree Quantization</text>
  <rect x="460" y="165" width="48" height="12" rx="2" fill="#818cf8"/>
  <text x="518" y="175" fill="#818cf8" font-family="monospace" font-size="10">8.6ms</text>

  <text x="285" y="205" fill="#94a3b8" font-family="monospace" font-size="11">PointNet++ Semantic Pass</text>
  <rect x="460" y="195" width="102" height="12" rx="2" fill="#a78bfa"/>
  <text x="572" y="205" fill="#a78bfa" font-family="monospace" font-size="10">18.2ms</text>

  <text x="285" y="235" fill="#94a3b8" font-family="monospace" font-size="11">Costmap Inflation</text>
  <rect x="460" y="225" width="12" height="12" rx="2" fill="#4ade80"/>
  <text x="480" y="235" fill="#4ade80" font-family="monospace" font-size="10">1.8ms</text>

  <!-- Frame Latency Sparkline -->
  <line x1="285" y1="310" x2="745" y2="310" stroke="#161e2e"/>
  <polyline points="290,290 340,285 390,292 440,280 490,284 540,282 590,288 640,281 690,285 740,283" fill="none" stroke="url(#emeraldLine)" stroke-width="2.5"/>
  <text x="290" y="272" fill="#4ade80" font-family="monospace" font-size="11" font-weight="bold">Mean Frame Latency: 42.8ms (Jitter ±1.4ms)</text>
  <text x="630" y="325" fill="#64748b" font-family="monospace" font-size="9">Target: &lt;100ms</text>`,
  statusText: "✓ Real-time 3D voxel stream healthy · 0 dropped frames",
  subText: "C++20 lock-free ring buffer · ROS2 Humble · Jetson Nano Edge deployment"
});
fs.writeFileSync(path.join(SHOTS_DIR, "voxelnav.svg"), voxelnavSvg);

// 3. DECISION ENGINE
const decisionSvg = createTerminalSvg({
  title: "decision-engine — double ml causal elasticity & qre",
  command: "python -m decision_engine.dml --dataset transactions_50k.parquet --causal-markup",
  leftTitle: "ECONOMETRIC SPECIFICATION",
  leftItems: [
    { label: "Sample Cohort:", value: "50,000 Trans", color: "#38bdf8" },
    { label: "Estimator:", value: "Double/Debiased ML", color: "#94a3b8" },
    { label: "Own Price (ε_p):", value: "-1.42 (p<0.001)", color: "#4ade80" },
    { label: "Cross-Price (ε_xy):", value: "+0.38 (Substitutes)", color: "#38bdf8" },
    { label: "Optimal Markup:", value: "+41.2% over MC", color: "#fbbf24" },
    { label: "CLV Model:", value: "BG/NBD + Gamma", color: "#94a3b8" },
    { label: "Operating Float:", value: "-36.4 Days CCC", color: "#4ade80" },
    { label: "Hurdle RoIC:", value: "18.5% (Base: 24.2%)", color: "#4ade80" },
    { label: "Ostrom Kill Gates:", value: "3 Phased Triggers", color: "#a78bfa" }
  ],
  rightTitle: "CAUSAL DEMAND ELASTICITY & REVENUE FRONTIER",
  rightContent: `  <!-- Graph Coordinates -->
  <line x1="290" y1="330" x2="745" y2="330" stroke="#2a3447" stroke-width="1.5"/>
  <line x1="290" y1="130" x2="290" y2="330" stroke="#2a3447" stroke-width="1.5"/>

  <!-- Demand Curve (Cyan) -->
  <path d="M 310,160 Q 420,210 520,250 T 730,310" fill="none" stroke="url(#cyanLine)" stroke-width="3"/>
  <text x="320" y="150" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">Q(P) Causal Demand (ε = -1.42)</text>

  <!-- Revenue Frontier (Emerald) -->
  <path d="M 310,320 Q 480,140 680,320" fill="none" stroke="url(#emeraldLine)" stroke-width="2.5" stroke-dasharray="6,4"/>
  
  <!-- Optimal Peak Point -->
  <circle cx="485" cy="185" r="5" fill="#fbbf24"/>
  <line x1="485" y1="185" x2="485" y2="330" stroke="#fbbf24" stroke-dasharray="3,3"/>
  <text x="495" y="180" fill="#fbbf24" font-family="monospace" font-size="11" font-weight="bold">P* Optimal ($148.50)</text>

  <text x="610" y="270" fill="#4ade80" font-family="monospace" font-size="10">Gross Margin Peak</text>`,
  statusText: "✓ Causal elasticity identified · Unbiased via Neyman orthogonal residuals",
  subText: "Production B-School engine · BG/NBD cohort retention · Negative working capital float"
});
fs.writeFileSync(path.join(SHOTS_DIR, "decision-engine.svg"), decisionSvg);

// 4. LATENCY ENGINE
const latencySvg = createTerminalSvg({
  title: "latency-engine — c++20 lock-free order book stat-arb",
  command: "./bin/latency_engine --stat-arb --venues binance,coinbase --pin-core 3",
  leftTitle: "HFT ORDER BOOK TELEMETRY",
  leftItems: [
    { label: "Throughput:", value: "2,400,000 ticks/sec", color: "#4ade80" },
    { label: "Tick-to-Trade p50:", value: "420 ns", color: "#38bdf8" },
    { label: "Tick-to-Trade p95:", value: "780 ns", color: "#4ade80" },
    { label: "Tick-to-Trade p99:", value: "1.12 µs", color: "#fbbf24" },
    { label: "Ring Buffer:", value: "Lock-Free SPSC", color: "#94a3b8" },
    { label: "Allocations Hot:", value: "0 bytes (Zero-Copy)", color: "#4ade80" },
    { label: "Cross-Ven Spread:", value: "+14.2 bps", color: "#38bdf8" },
    { label: "Delta Exposure:", value: "0.00 (Delta-Neutral)", color: "#4ade80" },
    { label: "Core Pinning:", value: "CPU 3 (isolcpus)", color: "#a78bfa" }
  ],
  rightTitle: "NANOSECOND TICK LATENCY & CROSS-VENUE SPREAD",
  rightContent: `  <!-- Sparkline Waveform -->
  <line x1="285" y1="240" x2="745" y2="240" stroke="#161e2e"/>
  <polyline points="290,260 330,250 370,270 410,210 450,230 490,180 530,195 570,165 610,185 650,150 690,170 735,145" fill="none" stroke="url(#emeraldLine)" stroke-width="3"/>
  <polyline points="290,290 330,285 370,280 410,265 450,260 490,245 530,248 570,230 610,235 650,215 690,220 735,205" fill="none" stroke="url(#goldLine)" stroke-width="2" stroke-dasharray="5,4"/>

  <text x="290" y="145" fill="#4ade80" font-family="monospace" font-size="11" font-weight="bold">Spread Waveform: +14.2 bps</text>
  <text x="600" y="320" fill="#64748b" font-family="monospace" font-size="10">p50: 420ns · p95: 780ns</text>
  <rect x="290" y="335" width="445" height="24" rx="3" fill="#131926"/>
  <text x="300" y="351" fill="#38bdf8" font-family="monospace" font-size="11">Order Depth: Bids 14.8M | Asks 15.2M | Spread Arbitrage Locked</text>`,
  statusText: "✓ Lock-free ring buffer healthy · Zero memory allocations in hot path",
  subText: "C++20 modular engine · Linux epoll/kernel-bypass · Delta-neutral funding"
});
fs.writeFileSync(path.join(SHOTS_DIR, "latency-engine.svg"), latencySvg);

// 5. GHOSTPILOT
const ghostSvg = createTerminalSvg({
  title: "ghostpilot — gps-denied uav autonomy hud",
  command: "ros2 launch ghostpilot mission_vins.launch.py --mission \"corridor_recon_b\"",
  leftTitle: "UAV MISSION TELEMETRY",
  leftItems: [
    { label: "GNSS Fix:", value: "NO FIX (GPS-Denied)", color: "#f87171" },
    { label: "State Estimator:", value: "VINS-Mono VIO", color: "#4ade80" },
    { label: "Optical Flow:", value: "LOCKED (120 FPS)", color: "#4ade80" },
    { label: "Altitude AGL:", value: "2.45 m ± 0.02m", color: "#38bdf8" },
    { label: "Velocity Vector:", value: "[1.2, 0.4, 0.0] m/s", color: "#94a3b8" },
    { label: "Trajectory Drift:", value: "< 0.8% of path", color: "#4ade80" },
    { label: "Agentic Mission:", value: "Waypoint Seq #4", color: "#a78bfa" },
    { label: "Obstacle Avoid:", value: "Dynamic 3D Octree", color: "#38bdf8" },
    { label: "Failsafe Buffer:", value: "Autonomous Hover", color: "#fbbf24" }
  ],
  rightTitle: "3D VIO TRAJECTORY & SLAM ESTIMATION",
  rightContent: `  <!-- Grid & Path -->
  <line x1="290" y1="230" x2="745" y2="230" stroke="#161e2e" stroke-dasharray="4,4"/>
  <path d="M 310,280 C 370,160 440,300 520,180 S 640,240 720,150" fill="none" stroke="url(#cyanLine)" stroke-width="3"/>
  <circle cx="720" cy="150" r="6" fill="#4ade80"/>
  <text x="630" y="140" fill="#4ade80" font-family="monospace" font-size="11" font-weight="bold">UAV Position</text>

  <!-- Obstacle Clusters -->
  <rect x="420" y="190" width="24" height="24" rx="4" fill="#f87171" opacity="0.6"/>
  <text x="415" y="180" fill="#f87171" font-family="monospace" font-size="9">Obstacle</text>
  <rect x="560" y="210" width="28" height="28" rx="4" fill="#f87171" opacity="0.6"/>

  <text x="310" y="320" fill="#94a3b8" font-family="monospace" font-size="10">Planned: [A-01 -> B-04 -> C-08] · Collision Margin: 1.4m</text>`,
  statusText: "✓ Real-time waypoint tracking active · Collision avoidance 100% nominal",
  subText: "VINS-Mono visual inertial odometry · Nav2 LLM waypoint parser · PX4 flight stack"
});
fs.writeFileSync(path.join(SHOTS_DIR, "ghostpilot.svg"), ghostSvg);

// 6. KVQUANT
const kvquantSvg = createTerminalSvg({
  title: "kvquant — 70b kv cache compression benchmark",
  command: "python -m kvquant.eval --model llama-3-70b-instruct --context 32768",
  leftTitle: "ATTENTION CACHE PROFILE",
  leftItems: [
    { label: "Target Model:", value: "Llama-3 70B (32k)", color: "#38bdf8" },
    { label: "Base KV (FP16):", value: "28.2 GB (OOM Crash)", color: "#f87171" },
    { label: "KVQuant (2-bit):", value: "4.1 GB (Fits 8GB)", color: "#4ade80" },
    { label: "Compression:", value: "6.8x Memory Cut", color: "#4ade80" },
    { label: "Perplexity Delta:", value: "+0.04 (Wikitext-2)", color: "#38bdf8" },
    { label: "Decoding Speed:", value: "2.1x Acceleration", color: "#4ade80" },
    { label: "Outlier Channels:", value: "Preserved FP16", color: "#fbbf24" },
    { label: "SIMD Vector:", value: "AVX-512 / Metal", color: "#a78bfa" },
    { label: "Hardware Target:", value: "M-Series & 8GB RAM", color: "#94a3b8" }
  ],
  rightTitle: "MEMORY SCALING ACROSS CONTEXT WINDOW (32K TOKENS)",
  rightContent: `  <!-- Graph -->
  <line x1="290" y1="330" x2="745" y2="330" stroke="#2a3447"/>
  
  <!-- Base FP16 OOM Cliff -->
  <polyline points="310,300 400,240 480,180 560,130" fill="none" stroke="#f87171" stroke-width="3" stroke-dasharray="6,4"/>
  <text x="570" y="135" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold">28.2 GB (OOM Cliff)</text>

  <!-- KVQuant Bounded Line -->
  <polyline points="310,315 400,310 480,305 560,300 640,296 720,292" fill="none" stroke="url(#emeraldLine)" stroke-width="3"/>
  <circle cx="720" cy="292" r="5" fill="#4ade80"/>
  <text x="620" y="280" fill="#4ade80" font-family="monospace" font-size="11" font-weight="bold">KVQuant: 4.1 GB (Flat)</text>

  <rect x="290" y="165" width="220" height="42" rx="4" fill="#131926" stroke="#1e2638"/>
  <text x="300" y="182" fill="#fbbf24" font-family="monospace" font-size="10">Non-Uniform Quantization</text>
  <text x="300" y="198" fill="#94a3b8" font-family="monospace" font-size="9">Preserves outlier attention heads</text>`,
  statusText: "✓ Attention kernel vectorized via SIMD · 0 accuracy regression",
  subText: "Drop-in KV cache compressor · 70B inference on consumer laptops · Zero retraining"
});
fs.writeFileSync(path.join(SHOTS_DIR, "kvquant.svg"), kvquantSvg);

// 7. MIDDLEOUT LATTICE
const middleoutSvg = createTerminalSvg({
  title: "middleout-lattice — ms-cprc entropy coder benchmark",
  command: "./bin/middleout -c enwik9.raw --predictor multi-scale-context --level ultra",
  leftTitle: "LOSSLESS RATIO BENCHMARK",
  leftItems: [
    { label: "Corpus:", value: "enwik9 (1.00 GB)", color: "#38bdf8" },
    { label: "Zstd L22:", value: "2.48 bps (310 MB)", color: "#94a3b8" },
    { label: "Brotli L11:", value: "2.39 bps (298 MB)", color: "#94a3b8" },
    { label: "MS-CPRC (Ours):", value: "2.18 bps (272 MB)", color: "#4ade80" },
    { label: "Margin over Zstd:", value: "-12.2% Footprint", color: "#4ade80" },
    { label: "Decompress Rate:", value: "184 MB/sec", color: "#38bdf8" },
    { label: "Context Window:", value: "32 MB Ring Buffer", color: "#94a3b8" },
    { label: "Range Coder:", value: "Carry-Free 64-bit", color: "#fbbf24" },
    { label: "Validation:", value: "Bit-Identical (CRC32)", color: "#4ade80" }
  ],
  rightTitle: "PARETO COMPRESSION RATIO VS SPEED FRONTIER",
  rightContent: `  <!-- Pareto Frontier Plot -->
  <line x1="290" y1="330" x2="745" y2="330" stroke="#2a3447"/>
  <line x1="290" y1="130" x2="290" y2="330" stroke="#2a3447"/>
  
  <!-- Competitor Points -->
  <circle cx="420" cy="240" r="5" fill="#94a3b8"/>
  <text x="430" y="244" fill="#94a3b8" font-family="monospace" font-size="10">Zstd L22 (2.48 bps)</text>

  <circle cx="510" cy="210" r="5" fill="#818cf8"/>
  <text x="520" y="214" fill="#818cf8" font-family="monospace" font-size="10">Brotli L11 (2.39 bps)</text>

  <!-- Middleout Point -->
  <circle cx="620" cy="160" r="7" fill="#4ade80"/>
  <text x="632" y="164" fill="#4ade80" font-family="monospace" font-size="11" font-weight="bold">MS-CPRC (2.18 bps)</text>
  <text x="632" y="178" fill="#38bdf8" font-family="monospace" font-size="10">BEATS SOTA BY 8.8%</text>

  <rect x="300" y="150" width="180" height="40" rx="4" fill="#131926"/>
  <text x="310" y="168" fill="#fbbf24" font-family="monospace" font-size="10">Multi-Scale Predictive</text>
  <text x="310" y="182" fill="#64748b" font-family="monospace" font-size="9">Dynamic Markov transition</text>`,
  statusText: "✓ Lossless bit-identical roundtrip verified on Silesia & Calgary corpora",
  subText: "Pure C++ MS-CPRC range coder · Zero external dependencies · High-density entropy engine"
});
fs.writeFileSync(path.join(SHOTS_DIR, "middleout.svg"), middleoutSvg);

// 8. STEGACHIRP
const stegachirpSvg = createTerminalSvg({
  title: "stegachirp — ultrasonic fsk audio steganography",
  command: "python -m stegachirp encode carrier.wav payload.bin --freq 19500 --baud 480",
  leftTitle: "ACOUSTIC DSP PROFILE",
  leftItems: [
    { label: "Carrier Center:", value: "19,500 Hz (Inaudible)", color: "#38bdf8" },
    { label: "Modulation:", value: "4-FSK Manchester", color: "#4ade80" },
    { label: "Transmission:", value: "480 bps Acoustic", color: "#38bdf8" },
    { label: "Dependencies:", value: "Zero (Pure Stdlib)", color: "#4ade80" },
    { label: "Audible SNR Drop:", value: "< 0.01 dB (<18kHz)", color: "#4ade80" },
    { label: "Air-gap Range:", value: "Up to 8.5 Meters", color: "#fbbf24" },
    { label: "ECC Codec:", value: "Reed-Solomon (255,223)", color: "#94a3b8" },
    { label: "Payload BER:", value: "0.00% (Clean Air)", color: "#4ade80" },
    { label: "Cross-Platform:", value: "Linux, macOS, Win", color: "#94a3b8" }
  ],
  rightTitle: "FFT WATERFALL SPECTROGRAM & ACOUSTIC PASSBAND",
  rightContent: `  <!-- Spectrogram Area -->
  <rect x="290" y="140" width="455" height="150" rx="4" fill="#090c12" stroke="#161e2e"/>
  
  <!-- Audible Spectrum (Quiet) -->
  <line x1="300" y1="260" x2="520" y2="260" stroke="#334155" stroke-width="2"/>
  <text x="310" y="280" fill="#64748b" font-family="monospace" font-size="10">Audible Human Hearing (20Hz - 16kHz) · Silent</text>

  <!-- Ultrasonic Peak Band -->
  <path d="M 540,260 Q 600,160 620,150 T 700,260" fill="none" stroke="url(#purpleGrad)" stroke-width="3"/>
  <text x="590" y="142" fill="#c084fc" font-family="monospace" font-size="11" font-weight="bold">19.5 kHz FSK Carrier</text>

  <rect x="290" y="310" width="455" height="45" rx="4" fill="#131926"/>
  <text x="305" y="328" fill="#4ade80" font-family="monospace" font-size="11">Acoustic Air-Gap Channel Decoded: 100% Integrity</text>
  <text x="305" y="344" fill="#94a3b8" font-family="monospace" font-size="10">Ultrasonic data transmission without bluetooth or wifi</text>`,
  statusText: "✓ Payload extracted with 0 bit errors across air-gapped acoustic channel",
  subText: "Pure Python ultrasonic steganography · Zero numpy/scipy · Stdlib wave + math"
});
fs.writeFileSync(path.join(SHOTS_DIR, "stegachirp.svg"), stegachirpSvg);

// 9. UNLIMITED OCR
const ocrSvg = createTerminalSvg({
  title: "unlimited-ocr — zero-cloud local document engine",
  command: "unlimited-ocr process filing_10k.pdf --engine onnx-local --tables --threads 8",
  leftTitle: "OFFLINE OCR PIPELINE",
  leftItems: [
    { label: "Throughput:", value: "48 Pages / sec", color: "#4ade80" },
    { label: "Character Recall:", value: "99.4% Exact Match", color: "#4ade80" },
    { label: "Network Activity:", value: "0 bytes (100% Offline)", color: "#4ade80" },
    { label: "Layout Analysis:", value: "Table Grid + BBox", color: "#38bdf8" },
    { label: "Inference Engine:", value: "ONNX Runtime C++", color: "#94a3b8" },
    { label: "UI Layer:", value: "Electron Desktop", color: "#94a3b8" },
    { label: "Memory Peak:", value: "410 MB RSS", color: "#4ade80" },
    { label: "Export Formats:", value: "Markdown, JSON, CSV", color: "#fbbf24" },
    { label: "Privacy Status:", value: "Air-Gapped Sovereign", color: "#38bdf8" }
  ],
  rightTitle: "DOCUMENT LAYOUT BOUNDING BOX RECONSTRUCTION",
  rightContent: `  <!-- Document Layout Simulation -->
  <rect x="310" y="140" width="415" height="170" rx="4" fill="#111622" stroke="#1e2638"/>
  <rect x="330" y="155" width="180" height="16" fill="#38bdf8" opacity="0.3"/>
  <text x="335" y="167" fill="#38bdf8" font-family="monospace" font-size="9">BBox: Document Title [Conf 0.99]</text>
  
  <rect x="330" y="185" width="375" height="40" fill="#4ade80" opacity="0.2"/>
  <text x="335" y="200" fill="#4ade80" font-family="monospace" font-size="9">BBox: Paragraph Body [Conf 0.98]</text>

  <rect x="330" y="240" width="375" height="50" fill="#a78bfa" opacity="0.25"/>
  <text x="335" y="255" fill="#a78bfa" font-family="monospace" font-size="9">BBox: Financial Table 4x8 Grid [Conf 0.99]</text>

  <text x="310" y="335" fill="#4ade80" font-family="monospace" font-size="11" font-weight="bold">Page 1/48 processed in 21ms</text>`,
  statusText: "✓ 100% air-gapped document intelligence · Structured JSON/Markdown exported",
  subText: "Local OCR desktop app · Electron + ONNX high-precision Python engine"
});
fs.writeFileSync(path.join(SHOTS_DIR, "unlimited-ocr.svg"), ocrSvg);

// 10. ATTEMPT 3D ENGINE
const attempt3dSvg = createTerminalSvg({
  title: "attempt-3d-engine — pure c++ software rasterizer (400kb)",
  command: "./attempt3d --render-target software-fb --resolution 640x480 --lock-60fps",
  leftTitle: "3D RASTERIZER SPECS",
  leftItems: [
    { label: "Binary Footprint:", value: "398 KB Executable", color: "#4ade80" },
    { label: "Dependencies:", value: "0 (Pure C++ / Win32)", color: "#4ade80" },
    { label: "Pipeline:", value: "Software Z-Buffer", color: "#38bdf8" },
    { label: "Transforms:", value: "Homogeneous 4x4", color: "#94a3b8" },
    { label: "Rasterization:", value: "Barycentric Fixed-Pt", color: "#38bdf8" },
    { label: "Framerate:", value: "60 FPS Locked (CPU)", color: "#4ade80" },
    { label: "Shading:", value: "Gouraud + Directional", color: "#fbbf24" },
    { label: "BSP Trees:", value: "Active Occlusion", color: "#94a3b8" },
    { label: "Game Systems:", value: "Zombie FPS Gameplay", color: "#a78bfa" }
  ],
  rightTitle: "REAL-TIME CPU WIREFRAME MESH PROJECTION",
  rightContent: `  <!-- 3D Wireframe Wire Cube / Mesh -->
  <polygon points="460,150 560,170 560,270 460,250" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <polygon points="560,170 640,140 640,240 560,270" fill="none" stroke="#4ade80" stroke-width="2"/>
  <polygon points="460,150 540,120 640,140 560,170" fill="none" stroke="#a78bfa" stroke-width="2"/>
  <line x1="460" y1="250" x2="540" y2="220" stroke="#38bdf8" stroke-dasharray="3,3"/>
  <line x1="540" y1="120" x2="540" y2="220" stroke="#a78bfa" stroke-dasharray="3,3"/>
  <line x1="640" y1="240" x2="540" y2="220" stroke="#4ade80" stroke-dasharray="3,3"/>

  <text x="310" y="325" fill="#38bdf8" font-family="monospace" font-size="11">Vertex Transform: 1.8ms | Raster: 8.4ms | Frame: 10.2ms</text>`,
  statusText: "✓ Zero runtime dependencies · Pure Win32/X11 framebuffer blit",
  subText: "From-scratch 3D game engine & zombie FPS in pure C++ · Custom software renderer"
});
fs.writeFileSync(path.join(SHOTS_DIR, "attempt-3d.svg"), attempt3dSvg);

// 11. TALK - IIM BANGALORE
const iimbSvg = createTerminalSvg({
  title: "iim-bangalore — founder's dilemma & crown jewel case finals",
  command: "python -m valuation.stress_test --firm unicorn_deal --model dupont_lbo",
  leftTitle: "EXECUTIVE BOARDROOM DIAGNOSIS",
  leftItems: [
    { label: "Competition:", value: "IIM Bangalore Finals", color: "#38bdf8" },
    { label: "Track:", value: "Founder's Dilemma & Crown", color: "#fbbf24" },
    { label: "Strategy:", value: "Co-Lending + -36d Float", color: "#4ade80" },
    { label: "Unit CAC / LTV:", value: "₹1,200 / ₹5,800 (4.8x)", color: "#4ade80" },
    { label: "Working Capital:", value: "-₹7,370/unit Day 1 Cash", color: "#38bdf8" },
    { label: "Hurdle Rate:", value: "18.5% ROE", color: "#94a3b8" },
    { label: "Base Case ROE:", value: "24.2% Return", color: "#4ade80" },
    { label: "Downside Shock:", value: "-35% Demand (Holds)", color: "#4ade80" },
    { label: "Result:", value: "National Podium Finalist", color: "#fbbf24" }
  ],
  rightTitle: "DUPONT 3-TIER ROE DECOMPOSITION WATERFALL",
  rightContent: `  <!-- Financial Waterfall -->
  <rect x="290" y="140" width="80" height="30" fill="#38bdf8" rx="3"/>
  <text x="300" y="159" fill="#0b0e14" font-family="monospace" font-size="11" font-weight="bold">Net Margin</text>
  <text x="300" y="185" fill="#38bdf8" font-family="monospace" font-size="10">14.0% EBITDA</text>

  <text x="380" y="158" fill="#f1f5f9" font-family="monospace" font-size="16">×</text>

  <rect x="400" y="140" width="80" height="30" fill="#4ade80" rx="3"/>
  <text x="410" y="159" fill="#0b0e14" font-family="monospace" font-size="11" font-weight="bold">Asset Turn</text>
  <text x="410" y="185" fill="#4ade80" font-family="monospace" font-size="10">1.82x Velocity</text>

  <text x="490" y="158" fill="#f1f5f9" font-family="monospace" font-size="16">×</text>

  <rect x="510" y="140" width="85" height="30" fill="#fbbf24" rx="3"/>
  <text x="515" y="159" fill="#0b0e14" font-family="monospace" font-size="11" font-weight="bold">Fin Leverage</text>
  <text x="515" y="185" fill="#fbbf24" font-family="monospace" font-size="10">0.95x Solvency</text>

  <text x="605" y="158" fill="#f1f5f9" font-family="monospace" font-size="16">=</text>

  <rect x="625" y="135" width="115" height="40" fill="#10b981" rx="4"/>
  <text x="635" y="155" fill="#0b0e14" font-family="monospace" font-size="12" font-weight="bold">ROE: 24.2%</text>
  <text x="635" y="168" fill="#0b0e14" font-family="monospace" font-size="9">> 18.5% Hurdle</text>

  <rect x="290" y="220" width="450" height="120" rx="4" fill="#111622" stroke="#1e2638"/>
  <text x="305" y="245" fill="#4ade80" font-family="monospace" font-size="11" font-weight="bold">Defense Bank Sensitivity: Recommendation Holds</text>
  <text x="305" y="268" fill="#94a3b8" font-family="monospace" font-size="10">Under severe -35% unit contraction, ROE remains at 19.1%, safely above hurdle.</text>
  <text x="305" y="288" fill="#94a3b8" font-family="monospace" font-size="10">FLDG capital safety multiple: 21.4x over maximum credit loss.</text>`,
  statusText: "✓ Recommendation holds under severe macroeconomic stress · 1st Runner-up",
  subText: "IIM Bangalore National Finals · Decision-relevant pragmatism · Unassailable financial proofs"
});
fs.writeFileSync(path.join(SHOTS_DIR, "talk-iimb.svg"), iimbSvg);

// 12. TALK - IIM INDORE
const iimiSvg = createTerminalSvg({
  title: "iim-indore — strategic game theory & hackathon finals",
  command: "python -m game_theory.qre --players 4 --action-space continuous --rounds 100",
  leftTitle: "STRATEGIC WARFARE HUD",
  leftItems: [
    { label: "Competition:", value: "IIM Indore Finals", color: "#38bdf8" },
    { label: "Tracks:", value: "Enigma & Epinoia", color: "#fbbf24" },
    { label: "Governance:", value: "Ostrom 8 Principles", color: "#4ade80" },
    { label: "Opponent Model:", value: "Level-1 Herd Trap", color: "#f87171" },
    { label: "Our Flank:", value: "Asymmetric Arbitrage", color: "#4ade80" },
    { label: "Commons Pool:", value: "Regulated Quotas", color: "#38bdf8" },
    { label: "Defection Shield:", value: "Graduated Sanctions", color: "#fbbf24" },
    { label: "Equilibrium:", value: "Quantal Response (QRE)", color: "#a78bfa" },
    { label: "Result:", value: "National Finalist", color: "#fbbf24" }
  ],
  rightTitle: "PAYOFF MATRIX & NASH EQUILIBRIUM DYNAMICS",
  rightContent: `  <!-- Game Theory Graph -->
  <line x1="290" y1="330" x2="745" y2="330" stroke="#2a3447"/>
  <path d="M 310,310 Q 420,150 540,190 T 730,140" fill="none" stroke="url(#cyanLine)" stroke-width="3"/>
  <text x="320" y="160" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">Our Asymmetric Payoff Frontier</text>

  <!-- Competitor Herd Collapse -->
  <path d="M 310,240 Q 450,230 580,290 T 730,325" fill="none" stroke="#f87171" stroke-width="2.5" stroke-dasharray="5,4"/>
  <text x="600" y="315" fill="#f87171" font-family="monospace" font-size="10">Competitor Herd Collapse</text>

  <rect x="290" y="210" width="220" height="50" rx="4" fill="#131926"/>
  <text x="300" y="230" fill="#4ade80" font-family="monospace" font-size="11">Ostrom Governance Shield</text>
  <text x="300" y="248" fill="#94a3b8" font-family="monospace" font-size="9">Eliminates race-to-bottom price war</text>`,
  statusText: "✓ Dominant strategy verified · Unassailable counter-flank presented",
  subText: "IIM Indore Enigma (Strategy) & Epinoia (Tech) National Finals"
});
fs.writeFileSync(path.join(SHOTS_DIR, "talk-iimi.svg"), iimiSvg);

// 13. TALK - IIT BOMBAY
const iitbSvg = createTerminalSvg({
  title: "iit-bombay — techfest autonomous robotics runner-up",
  command: "ros2 launch rover_autonomy arena_navigation.launch.py --obstacles dynamic",
  leftTitle: "ARENA HARDWARE RUNNER-UP",
  leftItems: [
    { label: "Competition:", value: "IIT Bombay Techfest", color: "#38bdf8" },
    { label: "Rank:", value: "National Runner-up", color: "#fbbf24" },
    { label: "Platform:", value: "Custom 6x6 Ground Rover", color: "#4ade80" },
    { label: "Sensors:", value: "3D LiDAR, Depth, CAN", color: "#38bdf8" },
    { label: "Actuation:", value: "High-Torque BLDC", color: "#94a3b8" },
    { label: "Obstacle Course:", value: "Rubble, Inclines, Slits", color: "#fbbf24" },
    { label: "Lap Completion:", value: "2m 14s (Fastest Run)", color: "#4ade80" },
    { label: "Autonomy Level:", value: "Zero Human Teleop", color: "#4ade80" },
    { label: "System Uptime:", value: "100% under competition", color: "#38bdf8" }
  ],
  rightTitle: "ARENA TRAJECTORY & REAL-TIME LIDAR OBSTACLE MAP",
  rightContent: `  <!-- Rover Arena Simulation -->
  <rect x="290" y="140" width="455" height="170" rx="4" fill="#0b0e14" stroke="#161e2e"/>
  
  <!-- Arena Track -->
  <path d="M 310,280 L 420,180 L 530,260 L 640,160 L 710,210" fill="none" stroke="url(#emeraldLine)" stroke-width="3"/>
  <circle cx="710" cy="210" r="6" fill="#fbbf24"/>
  <text x="630" y="235" fill="#fbbf24" font-family="monospace" font-size="10">Rover Finish Line</text>

  <!-- Obstacle Markers -->
  <rect x="410" y="170" width="16" height="16" fill="#f87171" rx="2"/>
  <rect x="520" y="250" width="16" height="16" fill="#f87171" rx="2"/>
  <rect x="630" y="150" width="16" height="16" fill="#f87171" rx="2"/>
  <text x="310" y="160" fill="#38bdf8" font-family="monospace" font-size="10">3D LiDAR Point Cloud Mesh Ingested: 24,000 pts/sec</text>`,
  statusText: "✓ Hardware build verified under intense competition arena conditions",
  subText: "IIT Bombay Techfest National Runner-up · Autonomous edge robotics hardware"
});
fs.writeFileSync(path.join(SHOTS_DIR, "talk-iitb.svg"), iitbSvg);

// 14. TALK - IIT KANPUR & DELHI
const iitkSvg = createTerminalSvg({
  title: "iit-kanpur-delhi — techkriti 2nd runner-up & stratagize",
  command: "python -m supply_chain.milp_solver --network pan_india --optimize freight",
  leftTitle: "NATIONAL PODIUM HONORS",
  leftItems: [
    { label: "IIT Kanpur:", value: "Techkriti 2nd Runner-up", color: "#fbbf24" },
    { label: "IIT Delhi:", value: "Stratagize Finalist", color: "#38bdf8" },
    { label: "Focus:", value: "Robotics & Supply Chain", color: "#4ade80" },
    { label: "Optimization:", value: "MILP Freight Routing", color: "#38bdf8" },
    { label: "Cost Savings:", value: "-18.4% Logistics Cost", color: "#4ade80" },
    { label: "Node Network:", value: "48 Pan-India Hubs", color: "#94a3b8" },
    { label: "Hardware Rig:", value: "Document Scanner / Rover", color: "#fbbf24" },
    { label: "ISRO Antariksh:", value: "National Top-50", color: "#4ade80" },
    { label: "Execution:", value: "End-to-End Delivery", color: "#38bdf8" }
  ],
  rightTitle: "MILP LOGISTICS ROUTING & PARETO COST FRONTIER",
  rightContent: `  <!-- Network Map Flow -->
  <line x1="330" y1="180" x2="450" y2="150" stroke="#38bdf8" stroke-width="2"/>
  <line x1="450" y1="150" x2="570" y2="190" stroke="#4ade80" stroke-width="2"/>
  <line x1="570" y1="190" x2="690" y2="160" stroke="#fbbf24" stroke-width="2"/>
  
  <circle cx="330" cy="180" r="6" fill="#38bdf8"/>
  <text x="315" y="200" fill="#38bdf8" font-family="monospace" font-size="9">Hub Del</text>
  <circle cx="450" cy="150" r="6" fill="#4ade80"/>
  <text x="435" y="140" fill="#4ade80" font-family="monospace" font-size="9">Hub Kan</text>
  <circle cx="570" cy="190" r="6" fill="#fbbf24"/>
  <text x="555" y="210" fill="#fbbf24" font-family="monospace" font-size="9">Hub Mum</text>
  <circle cx="690" cy="160" r="6" fill="#a78bfa"/>
  <text x="675" y="150" fill="#a78bfa" font-family="monospace" font-size="9">Hub Blr</text>

  <rect x="290" y="240" width="455" height="90" rx="4" fill="#111622" stroke="#1e2638"/>
  <text x="305" y="265" fill="#4ade80" font-family="monospace" font-size="11" font-weight="bold">Freight Optimization: -18.4% Cost Reduction</text>
  <text x="305" y="285" fill="#94a3b8" font-family="monospace" font-size="10">Mixed-Integer Linear Program solved in 1.4s across 48 warehouse hubs.</text>
  <text x="305" y="305" fill="#fbbf24" font-family="monospace" font-size="10">IIT Kanpur Techkriti 2nd Runner-up & IIT Delhi Stratagize Finalist.</text>`,
  statusText: "✓ National podium finish · Engineering & analytics excellence",
  subText: "Robotics hardware & pan-India supply chain optimization"
});
fs.writeFileSync(path.join(SHOTS_DIR, "talk-iitk.svg"), iitkSvg);

console.log("Successfully generated all 14 dark terminal SVGs in", SHOTS_DIR);
