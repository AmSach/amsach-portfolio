import fs from "fs";
import path from "path";

const SHOTS_DIR = "E:/amsach-portfolio/site/shots";
if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function createExecutiveHud({
  title,
  subtitle,
  badgeText,
  badgeColor = "#38bdf8",
  stat1Title,
  stat1Value,
  stat1Sub,
  stat2Title,
  stat2Value,
  stat2Sub,
  stat3Title,
  stat3Value,
  stat3Sub,
  visualContent,
  takeawayTitle,
  takeawayText
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460" width="800" height="460">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0e121a"/>
      <stop offset="100%" stop-color="#080a0f"/>
    </linearGradient>
    <linearGradient id="cyanGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <linearGradient id="emeraldGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
    <linearGradient id="goldGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="roseGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f87171"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
  </defs>

  <!-- Outer Frame Background -->
  <rect width="800" height="460" rx="10" fill="url(#bgGrad)"/>
  <rect x="1" y="1" width="798" height="458" rx="9" fill="none" stroke="#1e2738" stroke-width="2"/>

  <!-- Top Header Bar -->
  <rect width="800" height="52" rx="10" fill="#131926"/>
  <rect x="0" y="51" width="800" height="1" fill="#1e2738"/>
  
  <!-- Terminal Dot Controls -->
  <circle cx="26" cy="26" r="6" fill="#ff5f56"/>
  <circle cx="46" cy="26" r="6" fill="#ffbd2e"/>
  <circle cx="66" cy="26" r="6" fill="#27c93f"/>

  <!-- Main Title & Subtitle -->
  <text x="96" y="27" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="bold">${escapeXml(title)}</text>
  <text x="96" y="42" fill="#64748b" font-family="monospace" font-size="11">${escapeXml(subtitle)}</text>

  <!-- Top Right Verified Badge -->
  <rect x="580" y="14" width="194" height="24" rx="12" fill="#0f172a" stroke="${badgeColor}" stroke-width="1.2"/>
  <circle cx="594" cy="26" r="4" fill="${badgeColor}"/>
  <text x="606" y="30" fill="${badgeColor}" font-family="monospace" font-size="11" font-weight="bold">${escapeXml(badgeText)}</text>

  <!-- Top 3 Stat Summary Cards -->
  <!-- Card 1 -->
  <rect x="26" y="66" width="236" height="82" rx="8" fill="#0c1017" stroke="#1e293b"/>
  <text x="42" y="88" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="11" font-weight="600" text-transform="uppercase" letter-spacing="0.5">${escapeXml(stat1Title)}</text>
  <text x="42" y="118" fill="#38bdf8" font-family="monospace" font-size="20" font-weight="bold">${escapeXml(stat1Value)}</text>
  <text x="42" y="136" fill="#64748b" font-family="-apple-system, sans-serif" font-size="11">${escapeXml(stat1Sub)}</text>

  <!-- Card 2 -->
  <rect x="282" y="66" width="236" height="82" rx="8" fill="#0c1017" stroke="#1e293b"/>
  <text x="298" y="88" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="11" font-weight="600" text-transform="uppercase" letter-spacing="0.5">${escapeXml(stat2Title)}</text>
  <text x="298" y="118" fill="#34d399" font-family="monospace" font-size="20" font-weight="bold">${escapeXml(stat2Value)}</text>
  <text x="298" y="136" fill="#64748b" font-family="-apple-system, sans-serif" font-size="11">${escapeXml(stat2Sub)}</text>

  <!-- Card 3 -->
  <rect x="538" y="66" width="236" height="82" rx="8" fill="#0c1017" stroke="#1e293b"/>
  <text x="554" y="88" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="11" font-weight="600" text-transform="uppercase" letter-spacing="0.5">${escapeXml(stat3Title)}</text>
  <text x="554" y="118" fill="#fbbf24" font-family="monospace" font-size="20" font-weight="bold">${escapeXml(stat3Value)}</text>
  <text x="554" y="136" fill="#64748b" font-family="-apple-system, sans-serif" font-size="11">${escapeXml(stat3Sub)}</text>

  <!-- Center Visual Display Area -->
  <rect x="26" y="160" width="748" height="226" rx="8" fill="#0b0e14" stroke="#192231"/>
${visualContent}

  <!-- Bottom Takeaway Banner -->
  <rect x="26" y="396" width="748" height="48" rx="6" fill="#0d1420" stroke="#1d283a"/>
  <circle cx="48" cy="420" r="10" fill="#10b981" opacity="0.2"/>
  <path d="M 44,420 L 47,423 L 52,417" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
  <text x="68" y="416" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold">${escapeXml(takeawayTitle)}</text>
  <text x="68" y="432" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="11">${escapeXml(takeawayText)}</text>
</svg>`;
}

// 1. MAPLE
const mapleSvg = createExecutiveHud({
  title: "MAPLE // Sub-2-BPW MoE Pruning Engine",
  subtitle: "Manifold-Activated Pruning of Latent Experts for Local LLM Serving",
  badgeText: "65★ GITHUB · 300+ DOWNLOADS",
  badgeColor: "#fbbf24",
  stat1Title: "MODEL SIZE REDUCTION",
  stat1Value: "9.92 GB ➔ 4.75 GB",
  stat1Sub: "52.1% Smaller (1.48 Bits/Weight)",
  stat2Title: "GENERATION THROUGHPUT",
  stat2Value: "45.4 words / sec",
  stat2Sub: "100% In-VRAM on 6GB Laptop GPU",
  stat3Title: "CLOUD COST REQUIRED",
  stat3Value: "$0 / month",
  stat3Sub: "Replaces $10,000 Cloud GPU Servers",
  visualContent: `  <!-- Left: Memory Footprint Bar Comparison -->
  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Memory Footprint Comparison (Gemma 4 26B)</text>
  
  <!-- Baseline Bar -->
  <text x="50" y="224" fill="#94a3b8" font-family="monospace" font-size="11">Standard MoE Model (Uncompressed)</text>
  <rect x="50" y="232" width="340" height="24" rx="4" fill="#334155"/>
  <text x="310" y="248" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold">9.92 GB (OOM Crash on 6GB GPU)</text>

  <!-- MAPLE Bar -->
  <text x="50" y="280" fill="#38bdf8" font-family="monospace" font-size="11">MAPLE Pruned Model (Our System)</text>
  <rect x="50" y="288" width="163" height="24" rx="4" fill="url(#emeraldGlow)"/>
  <text x="225" y="304" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">4.75 GB (Fits 6GB GPU with 1.25 GB Free)</text>

  <!-- Pipeline Badges -->
  <rect x="50" y="336" width="105" height="30" rx="5" fill="#1e293b"/>
  <text x="60" y="355" fill="#94a3b8" font-family="monospace" font-size="11">128 Experts</text>

  <text x="165" y="355" fill="#64748b" font-family="monospace" font-size="14">➔</text>

  <rect x="185" y="336" width="115" height="30" rx="5" fill="#1e293b"/>
  <text x="195" y="355" fill="#38bdf8" font-family="monospace" font-size="11">Saliency Filter</text>

  <text x="310" y="355" fill="#64748b" font-family="monospace" font-size="14">➔</text>

  <rect x="330" y="336" width="140" height="30" rx="5" fill="#064e3b" stroke="#10b981"/>
  <text x="340" y="355" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">48 Active Experts</text>

  <!-- Divider -->
  <line x1="495" y1="180" x2="495" y2="365" stroke="#1e293b"/>

  <!-- Right: Real-time Speedup Graph -->
  <text x="515" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Inference Speedup Curve</text>
  
  <polyline points="520,320 560,290 600,240 640,210 680,185 730,175" fill="none" stroke="url(#cyanGlow)" stroke-width="3.5"/>
  <circle cx="730" cy="175" r="5" fill="#38bdf8"/>
  <text x="660" y="165" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">45.4 tok/s</text>

  <polyline points="520,335 560,330 600,325 640,320 680,315 730,310" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4"/>
  <text x="520" y="350" fill="#64748b" font-family="monospace" font-size="10">CPU Offload Baseline: 12.1 tok/s</text>

  <rect x="515" y="240" width="220" height="48" rx="6" fill="#131c2e" stroke="#25354e"/>
  <text x="528" y="258" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">3.75x Faster Generation</text>
  <text x="528" y="274" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">Zero PCIe bus stalls · Softmax invariant</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Enables students, researchers, and everyday developers to run massive 26-billion parameter AI models directly on their personal laptops without renting cloud servers."
});
fs.writeFileSync(path.join(SHOTS_DIR, "maple.svg"), mapleSvg);

// 2. VOXELNAV
const voxelnavSvg = createExecutiveHud({
  title: "VoxelNav // Real-Time 3D Spatial Vision for Autonomous Robots",
  subtitle: "Sparse Bayesian Octree Voxel Mapping for Edge Robotics Hardware",
  badgeText: "26★ GITHUB · ROS2 HUMBLE",
  badgeColor: "#38bdf8",
  stat1Title: "FRAME PROCESSING TIME",
  stat1Value: "42.8 ms",
  stat1Sub: "Well Below 100ms Real-Time Limit",
  stat2Title: "SPATIAL RESOLUTION",
  stat2Value: "148,200 Voxels",
  stat2Sub: "5cm Grid Quantization Accuracy",
  stat3Title: "EDGE HARDWARE TARGET",
  stat3Value: "$99 Jetson Nano",
  stat3Sub: "Only 184 MB VRAM Consumption",
  visualContent: `  <!-- Left: Sensor Fusion Pipeline -->
  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Sensor Ingestion to Obstacle Avoidance Pipeline</text>
  
  <text x="50" y="228" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="11">LiDAR & Depth Cameras (28,400 raw points/frame)</text>
  <rect x="50" y="236" width="120" height="14" rx="3" fill="#38bdf8"/>
  <text x="180" y="248" fill="#38bdf8" font-family="monospace" font-size="11">14.2ms</text>

  <text x="50" y="276" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="11">Octree 3D Quantization (148.2k voxels)</text>
  <rect x="50" y="284" width="75" height="14" rx="3" fill="#818cf8"/>
  <text x="135" y="296" fill="#818cf8" font-family="monospace" font-size="11">8.6ms</text>

  <text x="50" y="324" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="11">Semantic Classification & Nav2 Costmap</text>
  <rect x="50" y="332" width="170" height="14" rx="3" fill="#34d399"/>
  <text x="230" y="344" fill="#34d399" font-family="monospace" font-size="11">20.0ms</text>

  <!-- Divider -->
  <line x1="495" y1="180" x2="495" y2="365" stroke="#1e293b"/>

  <!-- Right: 3D Rover Trajectory Visual -->
  <text x="515" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Real-Time Obstacle Traversal</text>

  <!-- 3D Obstacle Field -->
  <rect x="540" y="225" width="22" height="22" rx="3" fill="#ef4444" opacity="0.8"/>
  <text x="532" y="218" fill="#f87171" font-family="monospace" font-size="9">Obstacle</text>

  <rect x="650" y="260" width="26" height="26" rx="3" fill="#ef4444" opacity="0.8"/>
  <text x="642" y="253" fill="#f87171" font-family="monospace" font-size="9">Obstacle</text>

  <!-- Rover Path -->
  <path d="M 525,320 Q 580,240 620,290 T 730,220" fill="none" stroke="url(#emeraldGlow)" stroke-width="3.5"/>
  <circle cx="730" cy="220" r="6" fill="#fbbf24"/>
  <text x="670" y="210" fill="#fbbf24" font-family="monospace" font-size="11" font-weight="bold">Rover Target</text>

  <rect x="515" y="325" width="230" height="38" rx="6" fill="#131c2e" stroke="#25354e"/>
  <text x="528" y="342" fill="#34d399" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">42.8ms Total Latency</text>
  <text x="528" y="355" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">23 FPS continuous streaming with zero frame drops</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Gives delivery robots and autonomous rovers real-time 3D vision to dodge obstacles without crashing, running smoothly on low-cost hardware."
});
fs.writeFileSync(path.join(SHOTS_DIR, "voxelnav.svg"), voxelnavSvg);

// 3. DECISION ENGINE
const decisionSvg = createExecutiveHud({
  title: "Decision Analytics // Causal ML & Profit Maximization Engine",
  subtitle: "Double/Debiased Machine Learning & Dynamic Game-Theoretic Pricing",
  badgeText: "50,000 TRANSACTIONS TESTED",
  badgeColor: "#34d399",
  stat1Title: "OPTIMAL PROFIT-MAXIMIZING PRICE",
  stat1Value: "$148.50 / unit",
  stat1Sub: "+41.2% Gross Margin Expansion",
  stat2Title: "MEASURED PRICE ELASTICITY",
  stat2Value: "ε = -1.42",
  stat2Sub: "Statistically Significant (p < 0.001)",
  stat3Title: "OPERATING FLOAT GENERATED",
  stat3Value: "-36.4 Days CCC",
  stat3Sub: "Free Working Capital Float for Growth",
  visualContent: `  <!-- Left: Demand & Profit Peak Graph -->
  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Causal Demand Curve & Revenue Frontier</text>
  
  <line x1="60" y1="340" x2="460" y2="340" stroke="#334155"/>
  <line x1="60" y1="210" x2="60" y2="340" stroke="#334155"/>
  
  <!-- Demand Curve (Cyan) -->
  <path d="M 80,230 Q 180,260 280,290 T 440,330" fill="none" stroke="url(#cyanGlow)" stroke-width="3"/>
  <text x="90" y="225" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">Q(P) Demand Curve (ε = -1.42)</text>

  <!-- Profit Peak (Emerald) -->
  <path d="M 80,335 Q 260,195 440,335" fill="none" stroke="url(#emeraldGlow)" stroke-width="2.5" stroke-dasharray="5,3"/>
  <circle cx="260" cy="235" r="6" fill="#fbbf24"/>
  <line x1="260" y1="235" x2="260" y2="340" stroke="#fbbf24" stroke-dasharray="3,3"/>
  <text x="270" y="235" fill="#fbbf24" font-family="monospace" font-size="12" font-weight="bold">P* = $148.50 (Max Profit Peak)</text>

  <!-- Divider -->
  <line x1="495" y1="180" x2="495" y2="365" stroke="#1e293b"/>

  <!-- Right: Working Capital Breakdown -->
  <text x="515" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Working Capital Float & Retention</text>

  <rect x="515" y="215" width="230" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="233" fill="#34d399" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">-36 Days Cash Float</text>
  <text x="528" y="248" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">Customers pay before suppliers are owed</text>

  <rect x="515" y="268" width="230" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="286" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">BG/NBD Customer Lifetime Value</text>
  <text x="528" y="301" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">Accurately predicts 12-month cohort churn</text>

  <rect x="515" y="321" width="230" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="339" fill="#fbbf24" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">Ostrom Defection Shield</text>
  <text x="528" y="354" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">3 quantitative kill-gates prevent price wars</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Helps executive boards and businesses find the exact price that maximizes profit without alienating customers or burning marketing budgets."
});
fs.writeFileSync(path.join(SHOTS_DIR, "decision-engine.svg"), decisionSvg);

// 4. LATENCY ENGINE
const latencySvg = createExecutiveHud({
  title: "Latency Engine // Sub-Microsecond HFT Arbitrage System",
  subtitle: "C++20 Lock-Free Order Book Processing & Cross-Venue Execution",
  badgeText: "780ns EXECUTION LATENCY",
  badgeColor: "#34d399",
  stat1Title: "TICK-TO-TRADE LATENCY",
  stat1Value: "780 nanoseconds",
  stat1Sub: "Faster than One Single Microsecond",
  stat2Title: "FEED INGESTION THROUGHPUT",
  stat2Value: "2.4M ticks / sec",
  stat2Sub: "Zero Memory Allocations in Hot Path",
  stat3Title: "CROSS-EXCHANGE SPREAD",
  stat3Value: "+14.2 bps",
  stat3Sub: "Delta-Neutral Arbitrage Capture",
  visualContent: `  <!-- Left: Nanosecond Speed Waveform -->
  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Order Book Feed & Trade Latency (Nanoseconds)</text>
  
  <line x1="60" y1="330" x2="460" y2="330" stroke="#334155"/>
  <polyline points="70,300 130,270 190,290 250,230 310,250 370,195 430,210" fill="none" stroke="url(#emeraldGlow)" stroke-width="3"/>
  <circle cx="370" cy="195" r="5" fill="#34d399"/>
  <text x="310" y="185" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">p50: 420ns · p95: 780ns</text>

  <rect x="60" y="210" width="180" height="38" rx="6" fill="#131c2e" stroke="#25354e"/>
  <text x="72" y="228" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">Lock-Free SPSC Ring Buffer</text>
  <text x="72" y="241" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">Linux CPU core pinning (isolcpus)</text>

  <!-- Divider -->
  <line x1="495" y1="180" x2="495" y2="365" stroke="#1e293b"/>

  <!-- Right: Arbitrage Spread Capture -->
  <text x="515" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Binance vs Coinbase Arbitrage Spread</text>

  <rect x="515" y="215" width="230" height="44" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="234" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">Binance Ask: $64,210.50</text>
  <text x="528" y="250" fill="#94a3b8" font-family="monospace" font-size="11">Coinbase Bid: $64,219.60 (+14.2 bps)</text>

  <rect x="515" y="272" width="230" height="44" rx="6" fill="#064e3b" stroke="#10b981"/>
  <text x="528" y="291" fill="#34d399" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold">Arbitrage Executed in 780ns</text>
  <text x="528" y="306" fill="#ecfdf5" font-family="-apple-system, sans-serif" font-size="10">Zero directional market risk (Delta = 0.00)</text>

  <text x="515" y="352" fill="#94a3b8" font-family="monospace" font-size="11">✓ Live cross-venue order books synchronized</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Captures crypto price discrepancies across worldwide exchanges in less than one millionth of a second with zero directional risk."
});
fs.writeFileSync(path.join(SHOTS_DIR, "latency-engine.svg"), latencySvg);

// 5. GHOSTPILOT
const ghostSvg = createExecutiveHud({
  title: "GhostPilot // GPS-Denied Autonomous UAV Flight System",
  subtitle: "Visual-Inertial Odometry & Autonomous Agentic Mission Planning",
  badgeText: "6★ GITHUB · PX4 / ROS2",
  badgeColor: "#38bdf8",
  stat1Title: "GPS SATELLITE RELIANCE",
  stat1Value: "0% (Zero Fix)",
  stat1Sub: "100% Visual-Inertial Indoor Odometry",
  stat2Title: "CAMERA OPTICAL FLOW",
  stat2Value: "120 FPS Locked",
  stat2Sub: "Trajectory Drift < 0.8% of Total Path",
  stat3Title: "MISSION CONTROL PARSER",
  stat3Value: "Natural English",
  stat3Sub: "Translates AI Commands to Flight Waypoints",
  visualContent: `  <!-- Left: Flight Telemetry & Corridor Path -->
  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Indoor Corridor Trajectory (Zero GPS Available)</text>
  
  <path d="M 60,330 C 120,240 180,310 240,220 S 360,280 440,195" fill="none" stroke="url(#cyanGlow)" stroke-width="3.5"/>
  <circle cx="440" cy="195" r="6" fill="#34d399"/>
  <text x="370" y="185" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">UAV Position</text>

  <!-- Obstacle Markers -->
  <rect x="180" y="240" width="20" height="20" rx="3" fill="#ef4444" opacity="0.8"/>
  <rect x="310" y="230" width="24" height="24" rx="3" fill="#ef4444" opacity="0.8"/>
  <text x="170" y="235" fill="#f87171" font-family="monospace" font-size="9">Obstacle</text>
  <text x="300" y="225" fill="#f87171" font-family="monospace" font-size="9">Obstacle</text>

  <rect x="50" y="325" width="220" height="38" rx="6" fill="#131c2e" stroke="#25354e"/>
  <text x="62" y="342" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">Altitude: 2.45m AGL (Locked)</text>
  <text x="62" y="355" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">VINS-Mono visual inertial state estimator</text>

  <!-- Divider -->
  <line x1="495" y1="180" x2="495" y2="365" stroke="#1e293b"/>

  <!-- Right: Agentic Mission Parser -->
  <text x="515" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Natural-Language Mission Execution</text>

  <rect x="515" y="215" width="230" height="48" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="233" fill="#fbbf24" font-family="monospace" font-size="10">User Input Command:</text>
  <text x="528" y="249" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">"Survey corridor B and avoid pillars"</text>

  <text x="625" y="280" fill="#64748b" font-family="monospace" font-size="14">▼</text>

  <rect x="515" y="295" width="230" height="52" rx="6" fill="#064e3b" stroke="#10b981"/>
  <text x="528" y="313" fill="#34d399" font-family="monospace" font-size="10">Generated Flight Waypoints:</text>
  <text x="528" y="329" fill="#f1f5f9" font-family="monospace" font-size="11">WP[0]: x=2.4m, y=1.2m, z=2.0m</text>
  <text x="528" y="342" fill="#34d399" font-family="monospace" font-size="10">✓ 100% collision-free margin verified</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Allows autonomous drones to safely navigate inside factories, collapsed tunnels, and GPS-denied buildings where satellite navigation is impossible."
});
fs.writeFileSync(path.join(SHOTS_DIR, "ghostpilot.svg"), ghostSvg);

// 6. KVQUANT
const kvquantSvg = createExecutiveHud({
  title: "KVQuant // 70-Billion Parameter Attention Memory Compressor",
  subtitle: "Non-Uniform 2-Bit Key-Value Cache Quantization for Consumer Hardware",
  badgeText: "7★ GITHUB · PYTORCH",
  badgeColor: "#34d399",
  stat1Title: "MEMORY USAGE (32K CONTEXT)",
  stat1Value: "28.2 GB ➔ 4.1 GB",
  stat1Sub: "6.8x Massive Memory Reduction",
  stat2Title: "HARDWARE REQUIRED",
  stat2Value: "8 GB RAM Laptop",
  stat2Sub: "Unlocks 70B Models on Everyday PCs",
  stat3Title: "REASONING ACCURACY REGRESSION",
  stat3Value: "+0.04 PPL",
  stat3Sub: "Virtually Identical to Full-Precision AI",
  visualContent: `  <!-- Left: Memory Cliff Comparison -->
  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Conversation Memory Scaling (Llama-3 70B)</text>
  
  <text x="50" y="224" fill="#94a3b8" font-family="monospace" font-size="11">Standard FP16 Attention Cache</text>
  <rect x="50" y="232" width="340" height="24" rx="4" fill="#334155"/>
  <text x="310" y="248" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold">28.2 GB (Crashes 8GB Laptops)</text>

  <text x="50" y="280" fill="#38bdf8" font-family="monospace" font-size="11">KVQuant 2-Bit Cache (Our System)</text>
  <rect x="50" y="288" width="80" height="24" rx="4" fill="url(#emeraldGlow)"/>
  <text x="140" y="304" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">4.1 GB (Runs on 8GB RAM Laptops)</text>

  <rect x="50" y="330" width="340" height="34" rx="6" fill="#131c2e" stroke="#25354e"/>
  <text x="62" y="352" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">Outlier Channel Protection: Preserves precision on critical attention heads</text>

  <!-- Divider -->
  <line x1="495" y1="180" x2="495" y2="365" stroke="#1e293b"/>

  <!-- Right: Context Window Length -->
  <text x="515" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Memory Across Long Context Windows</text>

  <polyline points="520,320 570,260 620,200 660,150" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,4"/>
  <text x="670" y="155" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold">Crash (28 GB)</text>

  <polyline points="520,325 570,320 620,315 670,310 730,305" fill="none" stroke="url(#emeraldGlow)" stroke-width="3.5"/>
  <circle cx="730" cy="305" r="5" fill="#34d399"/>
  <text x="640" y="295" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">4.1 GB Flat</text>

  <rect x="515" y="225" width="230" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="243" fill="#fbbf24" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">32,000 Token Context Window</text>
  <text x="528" y="258" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">2.1x faster token decoding on Apple Silicon & Intel</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Enables students and professionals to run massive, state-of-the-art 70-billion parameter AI models on their personal laptops without running out of memory."
});
fs.writeFileSync(path.join(SHOTS_DIR, "kvquant.svg"), kvquantSvg);

// 7. MIDDLEOUT LATTICE
const middleoutSvg = createExecutiveHud({
  title: "Middleout Lattice // Lossless Data Compression Engine",
  subtitle: "Multi-Scale Context-Predictive Range Coder (MS-CPRC) in Modern C++",
  badgeText: "1★ GITHUB · C++20",
  badgeColor: "#34d399",
  stat1Title: "COMPRESSION PERFORMANCE",
  stat1Value: "2.18 bits / byte",
  stat1Sub: "Beats Zstandard L22 (2.48 bps) and Brotli",
  stat2Title: "FOOTPRINT REDUCTION",
  stat2Value: "-12.2% Smaller",
  stat2Sub: "Smaller than Industry-Standard Files",
  stat3Title: "DECOMPRESSION SPEED",
  stat3Value: "184 MB / sec",
  stat3Sub: "Fast Multi-Threaded Streaming Decompress",
  visualContent: `  <!-- Bar chart comparison -->
  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Lossless Compression Ratio on enwik9 Corpus (Lower is Better)</text>

  <text x="50" y="230" fill="#94a3b8" font-family="monospace" font-size="11">Standard Zstandard L22</text>
  <rect x="50" y="238" width="320" height="24" rx="4" fill="#334155"/>
  <text x="380" y="254" fill="#94a3b8" font-family="monospace" font-size="11">2.48 bits/byte (310 MB)</text>

  <text x="50" y="280" fill="#94a3b8" font-family="monospace" font-size="11">Google Brotli L11</text>
  <rect x="50" y="288" width="300" height="24" rx="4" fill="#475569"/>
  <text x="360" y="304" fill="#94a3b8" font-family="monospace" font-size="11">2.39 bits/byte (298 MB)</text>

  <text x="50" y="330" fill="#38bdf8" font-family="monospace" font-size="11">Middleout Lattice (Our MS-CPRC Engine)</text>
  <rect x="50" y="338" width="240" height="24" rx="4" fill="url(#emeraldGlow)"/>
  <text x="300" y="354" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">2.18 bits/byte (272 MB) · Beats SOTA</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Compresses large enterprise files, archives, and datasets 12% smaller than standard industry tools, saving cloud storage and bandwidth."
});
fs.writeFileSync(path.join(SHOTS_DIR, "middleout.svg"), middleoutSvg);

// 8. STEGACHIRP
const stegachirpSvg = createExecutiveHud({
  title: "StegaChirp // Ultrasonic Acoustic Steganography System",
  subtitle: "Pure-Python 4-FSK Audio Carrier Encoding with Zero Dependencies",
  badgeText: "3★ GITHUB · PURE PYTHON",
  badgeColor: "#34d399",
  stat1Title: "ULTRASONIC FREQUENCY",
  stat1Value: "19,500 Hz",
  stat1Sub: "100% Inaudible to Human Hearing",
  stat2Title: "DATA BITRATE",
  stat2Value: "480 bps Acoustic",
  stat2Sub: "Transmits Files Across Air-Gapped Rooms",
  stat3Title: "EXTERNAL DEPENDENCIES",
  stat3Value: "Zero (0 libraries)",
  stat3Sub: "Pure Python Standard Library (no numpy/scipy)",
  visualContent: `  <!-- Spectrogram visual -->
  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Audio Spectrum Analysis: Clean Air-Gapped Transmission</text>

  <rect x="50" y="215" width="400" height="140" rx="6" fill="#0c1017" stroke="#1e293b"/>
  
  <!-- Audible range silent -->
  <rect x="65" y="310" width="250" height="30" fill="#1e293b"/>
  <text x="75" y="330" fill="#64748b" font-family="monospace" font-size="11">Audible Spectrum (0 - 16 kHz): Dead Silent</text>

  <!-- Ultrasonic Peak -->
  <path d="M 320,335 Q 360,230 380,225 T 440,335" fill="none" stroke="url(#cyanGlow)" stroke-width="3"/>
  <text x="345" y="218" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">19.5 kHz FSK Data Tone</text>

  <!-- Divider -->
  <line x1="495" y1="180" x2="495" y2="365" stroke="#1e293b"/>

  <rect x="515" y="225" width="230" height="48" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="244" fill="#34d399" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">Air-Gapped Room Transmission</text>
  <text x="528" y="260" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">Sends files through ordinary laptop speakers</text>

  <rect x="515" y="285" width="230" height="48" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="304" fill="#fbbf24" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">Reed-Solomon Error Correction</text>
  <text x="528" y="320" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">Zero bit errors even with background room noise</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Allows secure computer data transmission across air-gapped rooms through sound waves without requiring Wi-Fi, Bluetooth, or cables."
});
fs.writeFileSync(path.join(SHOTS_DIR, "stegachirp.svg"), stegachirpSvg);

// 9. UNLIMITED OCR
const ocrSvg = createExecutiveHud({
  title: "Unlimited OCR // Private 100% Offline Document Intelligence",
  subtitle: "Local Desktop OCR Application for Financial Documents & Tables",
  badgeText: "100% AIR-GAPPED PRIVACY",
  badgeColor: "#34d399",
  stat1Title: "PROCESSING THROUGHPUT",
  stat1Value: "48 Pages / sec",
  stat1Sub: "Processes Complete Books & Annual Reports",
  stat2Title: "CHARACTER ACCURACY",
  stat2Value: "99.4% Recall",
  stat2Sub: "Extracts Tables, Columns & Bounding Boxes",
  stat3Title: "NETWORK CALLS MADE",
  stat3Value: "0 Bytes (Offline)",
  stat3Sub: "Zero Data Sent to Cloud or Third Parties",
  visualContent: `  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Air-Gapped Document Layout Analysis</text>
  
  <rect x="50" y="215" width="400" height="145" rx="6" fill="#0c1017" stroke="#1e293b"/>
  
  <!-- Document Simulation -->
  <rect x="70" y="230" width="180" height="18" fill="#38bdf8" opacity="0.3"/>
  <text x="80" y="243" fill="#38bdf8" font-family="monospace" font-size="10">Document Header [100% Confidence]</text>

  <rect x="70" y="258" width="360" height="40" fill="#34d399" opacity="0.2"/>
  <text x="80" y="280" fill="#34d399" font-family="monospace" font-size="10">Paragraph Body Text & Footnotes [99.4% Confidence]</text>

  <rect x="70" y="308" width="360" height="40" fill="#a78bfa" opacity="0.25"/>
  <text x="80" y="330" fill="#a78bfa" font-family="monospace" font-size="10">Financial Multi-Column Table Grid [Exported to CSV]</text>

  <!-- Divider -->
  <line x1="495" y1="180" x2="495" y2="365" stroke="#1e293b"/>

  <rect x="515" y="225" width="230" height="58" rx="6" fill="#064e3b" stroke="#10b981"/>
  <text x="528" y="245" fill="#34d399" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold">Zero Cloud Privacy Risk</text>
  <text x="528" y="262" fill="#ecfdf5" font-family="-apple-system, sans-serif" font-size="10">Legal contracts, tax returns, and medical filings remain 100% local on your computer</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Turns paper scans and PDFs into searchable, editable text entirely on your own laptop without exposing private financial documents to the cloud."
});
fs.writeFileSync(path.join(SHOTS_DIR, "unlimited-ocr.svg"), ocrSvg);

// 10. ATTEMPT 3D ENGINE
const attempt3dSvg = createExecutiveHud({
  title: "Attempt 3D // From-Scratch Pure C++ 3D Game Engine",
  subtitle: "398KB Executable with Software Rasterizer, 3D Math & Zombie FPS",
  badgeText: "398KB BINARY · ZERO LIBS",
  badgeColor: "#fbbf24",
  stat1Title: "EXECUTABLE SIZE",
  stat1Value: "398 Kilobytes",
  stat1Sub: "Smaller than a Single Photo",
  stat2Title: "RENDER PERFORMANCE",
  stat2Value: "60 FPS Locked",
  stat2Sub: "Pure CPU Software Rasterizer (No GPU needed)",
  stat3Title: "EXTERNAL DEPENDENCIES",
  stat3Value: "0 Frameworks",
  stat3Sub: "Built Entirely from Scratch in Pure C++",
  visualContent: `  <text x="50" y="195" fill="#f1f5f9" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold">Pure CPU Software Rasterization & 3D Math</text>
  
  <!-- 3D Cube Wireframe -->
  <polygon points="180,240 280,260 280,340 180,320" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
  <polygon points="280,260 360,230 360,310 280,340" fill="none" stroke="#34d399" stroke-width="2.5"/>
  <polygon points="180,240 260,210 360,230 280,260" fill="none" stroke="#fbbf24" stroke-width="2.5"/>

  <text x="70" y="355" fill="#94a3b8" font-family="monospace" font-size="11">Vertex Transform: 1.8ms · Raster: 8.4ms · Frame: 10.2ms</text>

  <!-- Divider -->
  <line x1="495" y1="180" x2="495" y2="365" stroke="#1e293b"/>

  <rect x="515" y="225" width="230" height="52" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="244" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">Custom 3D Math Pipeline</text>
  <text x="528" y="260" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">Matrices, vectors, perspective clipping, and Z-buffer</text>

  <rect x="515" y="288" width="230" height="52" rx="6" fill="#0f172a" stroke="#1e293b"/>
  <text x="528" y="307" fill="#34d399" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold">Playable Zombie FPS Game</text>
  <text x="528" y="323" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="10">Enemy AI, collision detection, and raycast shooting</text>`,
  takeawayTitle: "The Plain-English Impact",
  takeawayText: "Demonstrates deep low-level computer science mastery: building an entire 3D graphics pipeline and playable game from zero external code in a 398KB file."
});
fs.writeFileSync(path.join(SHOTS_DIR, "attempt-3d.svg"), attempt3dSvg);

console.log("Successfully generated all redesigned Executive HUD SVGs!");
