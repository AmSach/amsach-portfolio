import os
import json
from playwright.sync_api import sync_playwright

OUTPUT_DIR = r"E:\amsach-portfolio\site\shots"
HTML_DIR = r"E:\amsach-portfolio\dashboards"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(HTML_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. MAPLE - AI MoE Pruning & Inference Engine
# -------------------------------------------------------------
HTML_MAPLE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace; }
  body { background: #06080c; color: #e2e8f0; width: 1600px; height: 920px; overflow: hidden; display: flex; flex-direction: column; padding: 24px; }
  
  .window { background: #0c1017; border: 1px solid #1c2536; border-radius: 12px; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85); }
  
  /* Topbar */
  .topbar { background: #111724; border-bottom: 1px solid #1c2536; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }
  .controls { display: flex; gap: 8px; align-items: center; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .window-title { font-size: 13px; font-family: "JetBrains Mono", monospace; color: #8b949e; letter-spacing: 0.5px; }
  .topbar-pills { display: flex; gap: 10px; }
  .pill { font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-family: "JetBrains Mono", monospace; display: flex; align-items: center; gap: 6px; }
  .pill-green { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
  .pill-blue { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
  .pill-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
  .pulse { width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; }

  /* Subheader metrics */
  .metrics-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 16px 20px; background: #0e131d; border-bottom: 1px solid #192232; }
  .m-card { background: #131926; border: 1px solid #1f2a3f; border-radius: 8px; padding: 12px 16px; }
  .m-label { font-size: 11px; color: #798394; text-transform: uppercase; font-family: "JetBrains Mono", monospace; margin-bottom: 4px; }
  .m-val { font-size: 20px; font-weight: 700; color: #f8fafc; font-family: "JetBrains Mono", monospace; display: flex; align-items: baseline; gap: 6px; }
  .m-sub { font-size: 11px; font-weight: 500; color: #10b981; }
  .m-sub.neg { color: #38bdf8; }

  /* Main Workspace */
  .workspace { display: grid; grid-template-columns: 350px 1fr 390px; flex: 1; min-height: 0; }
  
  /* Left Panel */
  .left-pane { border-right: 1px solid #192232; padding: 16px; display: flex; flex-direction: column; gap: 14px; background: #0a0e16; }
  .pane-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; font-family: "JetBrains Mono", monospace; letter-spacing: 0.5px; display: flex; justify-content: space-between; }
  
  .expert-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; margin-top: 6px; }
  .exp-slot { height: 21px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-family: "JetBrains Mono", monospace; font-weight: 700; }
  .exp-active { background: #059669; color: #ffffff; box-shadow: 0 0 6px rgba(16, 185, 129, 0.4); }
  .exp-med { background: #0284c7; color: #e0f2fe; }
  .exp-pruned { background: #161d2b; color: #475569; border: 1px dashed #243046; }
  
  .vram-bar-box { background: #131926; border: 1px solid #1f2a3f; border-radius: 8px; padding: 12px; margin-top: 6px; }
  .vram-row { display: flex; justify-content: space-between; font-size: 11px; font-family: "JetBrains Mono", monospace; margin-bottom: 6px; }
  .progress-bg { height: 8px; background: #1e293b; border-radius: 4px; overflow: hidden; display: flex; }
  .progress-fill { height: 100%; }
  .fill-weights { width: 52%; background: #10b981; }
  .fill-kv { width: 27%; background: #38bdf8; }

  /* Center Playground */
  .center-pane { padding: 18px; display: flex; flex-direction: column; gap: 14px; background: #090d14; overflow: hidden; }
  .terminal-box { background: #06090e; border: 1px solid #182234; border-radius: 8px; padding: 16px; flex: 1; font-family: "JetBrains Mono", monospace; font-size: 13px; line-height: 1.6; display: flex; flex-direction: column; }
  .prompt-line { color: #64748b; margin-bottom: 12px; font-size: 12px; }
  .prompt-tag { color: #38bdf8; font-weight: 700; }
  .prompt-cmd { color: #f1f5f9; }
  .stream-out { color: #cbd5e1; flex: 1; overflow: hidden; }
  .math-block { background: rgba(26, 36, 54, 0.6); border-left: 3px solid #38bdf8; padding: 12px 16px; margin: 12px 0; border-radius: 0 6px 6px 0; font-family: "JetBrains Mono", monospace; color: #f1f5f9; font-size: 13px; }
  .stream-meta { display: flex; gap: 16px; padding-top: 12px; border-top: 1px solid #1c2638; font-size: 11px; color: #64748b; }
  .meta-tag { color: #10b981; font-weight: 600; }

  /* Right Pane */
  .right-pane { border-left: 1px solid #192232; padding: 16px; display: flex; flex-direction: column; gap: 14px; background: #0a0e16; }
  .table-box { background: #0c111a; border: 1px solid #1b2436; border-radius: 8px; overflow: hidden; font-family: "JetBrains Mono", monospace; }
  .table-head { background: #131926; padding: 8px 12px; font-size: 10px; text-transform: uppercase; color: #798394; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; border-bottom: 1px solid #1b2436; }
  .table-row { padding: 9px 12px; font-size: 11px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; border-bottom: 1px solid #151d2c; align-items: center; }
  .table-row.highlight { background: rgba(16, 185, 129, 0.08); font-weight: 700; color: #10b981; }

  .spark-box { background: #131926; border: 1px solid #1f2a3f; border-radius: 8px; padding: 12px; }
  svg.sparkline { width: 100%; height: 55px; }
</style>
</head>
<body>
<div class="window">
  <div class="topbar">
    <div class="controls">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
      <span class="window-title" style="margin-left: 12px;">maple_server@amsach-rtx4060: ~ (sub_2bpw_moe_inference)</span>
    </div>
    <div class="topbar-pills">
      <div class="pill pill-green"><span class="pulse"></span>RESIDENT IN VRAM (100% GPU)</div>
      <div class="pill pill-blue">GEMMA-4-26B-A4B-IT</div>
      <div class="pill pill-purple">CUDA 12.4 / FP8_E4M3</div>
    </div>
  </div>

  <div class="metrics-strip">
    <div class="m-card">
      <div class="m-label">Generation Throughput</div>
      <div class="m-val">45.4 <span class="m-sub">tok/sec</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">VRAM Footprint</div>
      <div class="m-val">4.75 <span class="m-sub neg">GB / 6.00 GB (79%)</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Pruned Expert Ratio</div>
      <div class="m-val">80 / 128 <span class="m-sub">(-52.1%)</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Time to First Token</div>
      <div class="m-val">24.2 <span class="m-sub">ms</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Math MMLU Retention</div>
      <div class="m-val">98.4% <span class="m-sub">Accurate</span></div>
    </div>
  </div>

  <div class="workspace">
    <!-- Left Pane: MoE Activation Heatmap -->
    <div class="left-pane">
      <div class="pane-title">
        <span>MoE Expert Routing Grid</span>
        <span style="color: #10b981; font-size: 11px;">48 Active</span>
      </div>
      <p style="font-size: 11px; color: #64748b; line-height: 1.4;">
        Top-k routing frequency across Riemannian calibration tokens. 80 dormant pathways excised.
      </p>
      
      <div class="expert-grid">
        <div class="exp-slot exp-active">E01</div>
        <div class="exp-slot exp-pruned">E02</div>
        <div class="exp-slot exp-active">E03</div>
        <div class="exp-slot exp-active">E04</div>
        <div class="exp-slot exp-pruned">E05</div>
        <div class="exp-slot exp-pruned">E06</div>
        <div class="exp-slot exp-active">E07</div>
        <div class="exp-slot exp-med">E08</div>
        <div class="exp-slot exp-pruned">E09</div>
        <div class="exp-slot exp-active">E10</div>
        <div class="exp-slot exp-pruned">E11</div>
        <div class="exp-slot exp-med">E12</div>
        <div class="exp-slot exp-pruned">E13</div>
        <div class="exp-slot exp-pruned">E14</div>
        <div class="exp-slot exp-active">E15</div>
        <div class="exp-slot exp-pruned">E16</div>
        <div class="exp-slot exp-active">E17</div>
        <div class="exp-slot exp-pruned">E18</div>
        <div class="exp-slot exp-pruned">E19</div>
        <div class="exp-slot exp-active">E20</div>
        <div class="exp-slot exp-med">E21</div>
        <div class="exp-slot exp-pruned">E22</div>
        <div class="exp-slot exp-active">E23</div>
        <div class="exp-slot exp-pruned">E24</div>
        <div class="exp-slot exp-pruned">E25</div>
        <div class="exp-slot exp-active">E26</div>
        <div class="exp-slot exp-pruned">E27</div>
        <div class="exp-slot exp-pruned">E28</div>
        <div class="exp-slot exp-active">E29</div>
        <div class="exp-slot exp-active">E30</div>
        <div class="exp-slot exp-pruned">E31</div>
        <div class="exp-slot exp-med">E32</div>
        <div class="exp-slot exp-active">E33</div>
        <div class="exp-slot exp-pruned">E34</div>
        <div class="exp-slot exp-active">E35</div>
        <div class="exp-slot exp-pruned">E36</div>
        <div class="exp-slot exp-pruned">E37</div>
        <div class="exp-slot exp-active">E38</div>
        <div class="exp-slot exp-med">E39</div>
        <div class="exp-slot exp-pruned">E40</div>
        <div class="exp-slot exp-pruned">E41</div>
        <div class="exp-slot exp-pruned">E42</div>
        <div class="exp-slot exp-active">E43</div>
        <div class="exp-slot exp-active">E44</div>
        <div class="exp-slot exp-pruned">E45</div>
        <div class="exp-slot exp-pruned">E46</div>
        <div class="exp-slot exp-active">E47</div>
        <div class="exp-slot exp-med">E48</div>
      </div>

      <div class="vram-bar-box">
        <div class="vram-row">
          <span>GPU Memory Allocation</span>
          <span style="color: #10b981;">4.75 / 6.00 GB</span>
        </div>
        <div class="progress-bg">
          <div class="progress-fill fill-weights"></div>
          <div class="progress-fill fill-kv"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace;">
          <span>Weights: 3.12 GB</span>
          <span>KV Cache: 1.63 GB</span>
          <span>Free: 1.25 GB</span>
        </div>
      </div>
    </div>

    <!-- Center Pane: Live Generation Playground -->
    <div class="center-pane">
      <div class="pane-title">
        <span>Inference Token Streamer</span>
        <span style="color: #38bdf8; font-size: 11px;">Batch: 1 · Precision: Sub-2-BPW</span>
      </div>

      <div class="terminal-box">
        <div class="prompt-line">
          <span class="prompt-tag">&gt; user:</span> <span class="prompt-cmd">Derive geodesic distance on Poincaré upper half-plane H² = {(x,y) : y &gt; 0} with metric ds² = (dx² + dy²) / y².</span>
        </div>
        <div class="stream-out">
          <p><span style="color: #10b981; font-weight: 700;">&gt; assistant (MAPLE Pruned Gemma-4-26B):</span></p>
          <p style="margin-top: 8px;">Let γ(t) = (x(t), y(t)) be a smooth curve between z₁ = (x₁, y₁) and z₂ = (x₂, y₂). The hyperbolic arc length functional is given by:</p>
          <div class="math-block">
            L(γ) = ∫ [ √(ẋ(t)² + ẏ(t)²) / y(t) ] dt
          </div>
          <p>Applying the Euler-Lagrange equations with Lagrangian F(x, y, ẋ, ẏ) = √(ẋ² + ẏ²) / y, since ∂F/∂x = 0, the conjugate momentum p_x = ẋ / [ y √(ẋ² + ẏ²) ] = C is conserved.</p>
          <p style="margin-top: 6px;">For C ≠ 0, geodesics are semicircles orthogonal to the real axis {y = 0}. Integrating yields the closed-form hyperbolic distance:</p>
          <div class="math-block" style="border-left-color: #10b981;">
            d_H²(z₁, z₂) = arcosh( 1 + [ (x₁ - x₂)² + (y₁ - y₂)² ] / [ 2 y₁ y₂ ] ) = ln( [ |z₁ - z̄₂| + |z₁ - z₂| ] / [ |z₁ - z̄₂| - |z₁ - z₂| ] )
          </div>
        </div>
        <div class="stream-meta">
          <span>Tokens: <strong class="meta-tag">384</strong></span>
          <span>Speed: <strong class="meta-tag">45.4 tok/s</strong></span>
          <span>First Token: <strong class="meta-tag">24.2 ms</strong></span>
          <span>VRAM Spikes: <strong class="meta-tag">0.0 MB</strong></span>
          <span>Perplexity: <strong class="meta-tag">3.41</strong></span>
        </div>
      </div>
    </div>

    <!-- Right Pane: Model Comparison Benchmark -->
    <div class="right-pane">
      <div class="pane-title">
        <span>Compression Benchmark</span>
        <span style="color: #c084fc; font-size: 11px;">RTX 4060 Laptop</span>
      </div>

      <div class="table-box">
        <div class="table-head">
          <span>Format</span>
          <span>VRAM</span>
          <span>Tok/s</span>
          <span>MMLU</span>
        </div>
        <div class="table-row highlight">
          <span>MAPLE (Ours)</span>
          <span>4.75G</span>
          <span>45.4</span>
          <span>78.2</span>
        </div>
        <div class="table-row">
          <span>AWQ 4-Bit</span>
          <span>7.10G</span>
          <span>21.8</span>
          <span>76.8</span>
        </div>
        <div class="table-row">
          <span>GPTQ 3-Bit</span>
          <span>5.95G</span>
          <span>16.4</span>
          <span>71.2</span>
        </div>
        <div class="table-row">
          <span>FP16 Base</span>
          <span>9.92G</span>
          <span>OOM</span>
          <span>79.1</span>
        </div>
      </div>

      <div class="spark-box">
        <div class="pane-title" style="margin-bottom: 6px;">
          <span>Latency Stability (Last 60s)</span>
          <span style="color: #10b981; font-size: 10px;">σ = 0.4ms</span>
        </div>
        <svg class="sparkline" viewBox="0 0 300 55">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.4" />
              <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.0" />
            </linearGradient>
          </defs>
          <path d="M 0 35 Q 30 33, 60 36 T 120 34 T 180 37 T 240 33 T 300 35 L 300 55 L 0 55 Z" fill="url(#grad1)" />
          <path d="M 0 35 Q 30 33, 60 36 T 120 34 T 180 37 T 240 33 T 300 35" fill="none" stroke="#10b981" stroke-width="2" />
        </svg>
      </div>

      <div class="spark-box" style="background: #0d121c; border-color: #192234;">
        <div style="font-size: 11px; font-weight: 700; color: #94a3b8; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px;">Zero Cloud Dependence</div>
        <p style="font-size: 10px; color: #64748b; line-height: 1.4;">
          Enables air-gapped mathematical and coding LLM execution on 6GB VRAM laptops without renting cloud H100 instances.
        </p>
      </div>
    </div>
  </div>
</div>
</body>
</html>
"""

# -------------------------------------------------------------
# 2. VOXELNAV - Autonomous Ground Rover 3D SLAM HUD
# -------------------------------------------------------------
HTML_VOXELNAV = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace; }
  body { background: #06080c; color: #e2e8f0; width: 1600px; height: 920px; overflow: hidden; display: flex; flex-direction: column; padding: 24px; }
  
  .window { background: #0a0d14; border: 1px solid #1a2336; border-radius: 12px; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85); }
  
  .topbar { background: #0f1422; border-bottom: 1px solid #1a2336; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }
  .controls { display: flex; gap: 8px; align-items: center; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .window-title { font-size: 13px; font-family: "JetBrains Mono", monospace; color: #8b949e; letter-spacing: 0.5px; }
  .topbar-pills { display: flex; gap: 10px; }
  .pill { font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-family: "JetBrains Mono", monospace; display: flex; align-items: center; gap: 6px; }
  .pill-cyan { background: rgba(6, 182, 212, 0.15); color: #06b6d4; border: 1px solid rgba(6, 182, 212, 0.3); }
  .pill-green { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
  .pulse { width: 6px; height: 6px; border-radius: 50%; background: #06b6d4; box-shadow: 0 0 8px #06b6d4; }

  /* Main HUD */
  .hud-body { display: grid; grid-template-columns: 320px 1fr 340px; flex: 1; min-height: 0; }
  
  .hud-left { border-right: 1px solid #1a2336; padding: 16px; background: #080b12; display: flex; flex-direction: column; gap: 14px; }
  .hud-card { background: #0d121e; border: 1px solid #192338; border-radius: 8px; padding: 12px 14px; }
  .card-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-family: "JetBrains Mono", monospace; margin-bottom: 4px; }
  .card-val { font-size: 22px; font-weight: 700; font-family: "JetBrains Mono", monospace; color: #f8fafc; }
  .card-sub { font-size: 11px; color: #06b6d4; margin-top: 2px; }

  .viewport-3d { position: relative; background: radial-gradient(circle at center, #0f172a 0%, #05070c 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .grid-floor { position: absolute; width: 1200px; height: 700px; border: 1px solid rgba(6, 182, 212, 0.12); background-image: linear-gradient(rgba(6, 182, 212, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.06) 1px, transparent 1px); background-size: 30px 30px; transform: perspective(600px) rotateX(65deg) translateY(140px); }
  
  svg.nav-overlay { position: absolute; width: 100%; height: 100%; top: 0; left: 0; }

  .hud-tag { position: absolute; background: rgba(13, 18, 30, 0.88); border: 1px solid #1c263c; border-radius: 6px; padding: 6px 12px; font-family: "JetBrains Mono", monospace; font-size: 11px; backdrop-filter: blur(8px); }
  .hud-tag-tl { top: 18px; left: 18px; }
  .hud-tag-tr { top: 18px; right: 18px; }
  .hud-tag-bl { bottom: 18px; left: 18px; }
  .hud-tag-br { bottom: 18px; right: 18px; }

  .hud-right { border-left: 1px solid #1a2336; padding: 16px; background: #080b12; display: flex; flex-direction: column; gap: 14px; }
  .topic-row { display: flex; justify-content: space-between; font-size: 11px; font-family: "JetBrains Mono", monospace; padding: 6px 0; border-bottom: 1px solid #141c2d; }
  .topic-name { color: #94a3b8; }
  .topic-rate { color: #10b981; font-weight: 700; }
</style>
</head>
<body>
<div class="window">
  <div class="topbar">
    <div class="controls">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
      <span class="window-title" style="margin-left: 12px;">foxglove_studio // rover_base_node (RTK-GPS / 3D Voxel SLAM)</span>
    </div>
    <div class="topbar-pills">
      <div class="pill pill-cyan"><span class="pulse"></span>SLAM: LOCALIZED (RTK-FIX)</div>
      <div class="pill pill-green">50.0 HZ PLANNER RATE</div>
      <div class="pill pill-cyan">ROS2 HUMBLE</div>
    </div>
  </div>

  <div class="hud-body">
    <div class="hud-left">
      <div class="hud-card">
        <div class="card-label">Rover Linear Velocity</div>
        <div class="card-val">1.85 <span style="font-size: 13px; color: #64748b;">m/s</span></div>
        <div class="card-sub">Target: 2.00 m/s (PID 92.5%)</div>
      </div>
      <div class="hud-card">
        <div class="card-label">RTK Heading / Orientation</div>
        <div class="card-val">142.8° <span style="font-size: 13px; color: #64748b;">NW</span></div>
        <div class="card-sub">Pitch: +2.4° · Roll: -1.1°</div>
      </div>
      <div class="hud-card">
        <div class="card-label">Octree Voxel Grid</div>
        <div class="card-val">16 <span style="font-size: 13px; color: #64748b;">Levels</span></div>
        <div class="card-sub">Resolution: 0.05m · 48,200 Voxels</div>
      </div>
      <div class="hud-card">
        <div class="card-label">Collision Check Latency</div>
        <div class="card-val">4.2 <span style="font-size: 13px; color: #64748b;">ms</span></div>
        <div class="card-sub">Zero Near-Field Hazard Detections</div>
      </div>
    </div>

    <div class="viewport-3d">
      <div class="grid-floor"></div>

      <svg class="nav-overlay" viewBox="0 0 940 820">
        <!-- 360 LiDAR Scan Rings -->
        <circle cx="470" cy="700" r="160" fill="none" stroke="rgba(6, 182, 212, 0.15)" stroke-dasharray="4,4" />
        <circle cx="470" cy="700" r="300" fill="none" stroke="rgba(6, 182, 212, 0.10)" stroke-dasharray="4,4" />
        <circle cx="470" cy="700" r="440" fill="none" stroke="rgba(6, 182, 212, 0.06)" stroke-dasharray="4,4" />

        <!-- Point cloud points -->
        <g opacity="0.75">
          <circle cx="280" cy="480" r="3" fill="#06b6d4" />
          <circle cx="295" cy="470" r="2.5" fill="#06b6d4" />
          <circle cx="310" cy="490" r="3" fill="#06b6d4" />
          <circle cx="265" cy="495" r="2" fill="#06b6d4" />
          <circle cx="620" cy="430" r="3" fill="#06b6d4" />
          <circle cx="640" cy="445" r="3.5" fill="#06b6d4" />
          <circle cx="655" cy="420" r="2.5" fill="#06b6d4" />
          <circle cx="670" cy="435" r="3" fill="#06b6d4" />
          <circle cx="400" cy="300" r="2" fill="#38bdf8" />
          <circle cx="540" cy="310" r="2" fill="#38bdf8" />
        </g>

        <!-- Obstacle Voxel Bounding Boxes -->
        <rect x="240" y="440" width="100" height="75" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2" />
        <text x="250" y="432" fill="#ef4444" font-size="10" font-family="JetBrains Mono">HAZARD: ROCK [d=4.2m]</text>

        <rect x="605" y="395" width="90" height="65" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2" />
        <text x="612" y="387" fill="#f59e0b" font-size="10" font-family="JetBrains Mono">SLOPE GRADE [d=7.8m]</text>

        <!-- Optimal Planned Trajectory Spline -->
        <path d="M 470 700 Q 470 560, 410 490 T 500 340 T 480 180" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
        <!-- Waypoints -->
        <circle cx="470" cy="700" r="6" fill="#10b981" />
        <circle cx="410" cy="490" r="5" fill="#10b981" />
        <circle cx="500" cy="340" r="5" fill="#10b981" />
        <circle cx="480" cy="180" r="8" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
        <text x="500" y="185" fill="#38bdf8" font-size="11" font-weight="bold" font-family="JetBrains Mono">TARGET WAYPOINT #18</text>

        <!-- Rover Icon at Origin -->
        <g transform="translate(470, 700)">
          <polygon points="0,-20 14,14 0,7 -14,14" fill="#06b6d4" stroke="#ffffff" stroke-width="1.5" />
        </g>
      </svg>

      <div class="hud-tag hud-tag-tl">
        <span style="color: #64748b;">GPS:</span> 37.7749° N, 122.4194° W · Alt: 42.8m
      </div>
      <div class="hud-tag hud-tag-tr">
        <span style="color: #10b981;">TRAJECTORY COST:</span> 0.142 (Optimal)
      </div>
      <div class="hud-tag hud-tag-bl">
        <span style="color: #64748b;">LIDAR SCAN:</span> Velodyne VLP-16 (16 Ch @ 20Hz)
      </div>
      <div class="hud-tag hud-tag-br">
        <span style="color: #06b6d4;">ACTIVE NODES:</span> 14 ROS2 Topics Verified
      </div>
    </div>

    <div class="hud-right">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">
        Active ROS2 Topic Rates
      </div>
      <div class="topic-row">
        <span class="topic-name">/lidar/points_raw</span>
        <span class="topic-rate">20.0 Hz</span>
      </div>
      <div class="topic-row">
        <span class="topic-name">/odom/filtered</span>
        <span class="topic-rate">100.0 Hz</span>
      </div>
      <div class="topic-row">
        <span class="topic-name">/nav/trajectory</span>
        <span class="topic-rate">50.0 Hz</span>
      </div>
      <div class="topic-row">
        <span class="topic-name">/cmd_vel</span>
        <span class="topic-rate">50.0 Hz</span>
      </div>
      <div class="topic-row">
        <span class="topic-name">/imu/data</span>
        <span class="topic-rate">200.0 Hz</span>
      </div>
      <div class="topic-row">
        <span class="topic-name">/rtk/fix</span>
        <span class="topic-rate">10.0 Hz</span>
      </div>

      <div class="hud-card" style="margin-top: 10px;">
        <div class="card-label">Dynamic Path Costmap</div>
        <p style="font-size: 10px; color: #64748b; line-height: 1.4; margin-top: 4px;">
          Dynamic Octree collision checks compute traversability in 4.2ms. Rover autonomously circumvents unstructured obstacles without manual intervention.
        </p>
      </div>
    </div>
  </div>
</div>
</body>
</html>
"""

# -------------------------------------------------------------
# 3. DECISION ENGINE - Econometric Causal ML Terminal
# -------------------------------------------------------------
HTML_DECISION = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace; }
  body { background: #06080c; color: #e2e8f0; width: 1600px; height: 920px; overflow: hidden; display: flex; flex-direction: column; padding: 24px; }
  
  .window { background: #0c1018; border: 1px solid #1a2336; border-radius: 12px; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85); }
  
  .topbar { background: #111623; border-bottom: 1px solid #1a2336; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }
  .controls { display: flex; gap: 8px; align-items: center; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .window-title { font-size: 13px; font-family: "JetBrains Mono", monospace; color: #8b949e; }
  .pill { font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-family: "JetBrains Mono", monospace; display: flex; align-items: center; gap: 6px; }
  .pill-gold { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
  .pill-green { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }

  .metrics-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; padding: 16px 20px; background: #0e131e; border-bottom: 1px solid #182133; }
  .m-card { background: #121826; border: 1px solid #1e293f; border-radius: 8px; padding: 12px 16px; }
  .m-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-family: "JetBrains Mono", monospace; margin-bottom: 4px; }
  .m-val { font-size: 22px; font-weight: 700; color: #f8fafc; font-family: "JetBrains Mono", monospace; }

  .workspace { display: grid; grid-template-columns: 1fr 440px; flex: 1; min-height: 0; }
  
  .chart-pane { padding: 20px; display: flex; flex-direction: column; gap: 14px; background: #080b12; }
  .chart-box { background: #0d121e; border: 1px solid #1a2336; border-radius: 8px; flex: 1; padding: 16px; position: relative; display: flex; flex-direction: column; }
  
  .side-pane { border-left: 1px solid #1a2336; padding: 20px; background: #0a0e16; display: flex; flex-direction: column; gap: 14px; }
  .side-card { background: #111724; border: 1px solid #1b253a; border-radius: 8px; padding: 14px; font-family: "JetBrains Mono", monospace; }
  
  .waterfall-row { display: flex; justify-content: space-between; font-size: 11px; font-family: "JetBrains Mono", monospace; padding: 6px 0; border-bottom: 1px solid #162033; }
</style>
</head>
<body>
<div class="window">
  <div class="topbar">
    <div class="controls">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
      <span class="window-title" style="margin-left: 12px;">stratos_analytics // causal_price_elasticity_model.py</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <div class="pill pill-gold">DOUBLE ML / ECONML</div>
      <div class="pill pill-green">99.2% CONFIDENCE BOUND</div>
    </div>
  </div>

  <div class="metrics-strip">
    <div class="m-card">
      <div class="m-label">Profit-Maximizing Ticket</div>
      <div class="m-val" style="color: #f59e0b;">$148.50 <span style="font-size: 12px; color: #10b981;">(+18.4% EBITDA)</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Customer Acquisition Cost</div>
      <div class="m-val">$42.10 <span style="font-size: 12px; color: #64748b;">(LTV/CAC 4.8x)</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Cash Conversion Cycle</div>
      <div class="m-val" style="color: #10b981;">-36.4 Days <span style="font-size: 12px; color: #10b981;">(Negative Float)</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Downside Stress Sensitivity</div>
      <div class="m-val">Holds @ -30% <span style="font-size: 12px; color: #64748b;">(IRR &gt; 22%)</span></div>
    </div>
  </div>

  <div class="workspace">
    <div class="chart-pane">
      <div class="chart-box">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-family: 'JetBrains Mono', monospace; font-size: 12px;">
          <span style="color: #94a3b8; font-weight: 700;">EMPIRICAL PRICE ELASTICITY & REVENUE FRONTIER</span>
          <span style="color: #f59e0b;">Peak EBITDA Frontier: $148.50</span>
        </div>
        <svg viewBox="0 0 1000 480" style="width: 100%; height: 100%;">
          <!-- Grid Lines -->
          <line x1="60" y1="420" x2="940" y2="420" stroke="#1c2538" stroke-width="1" />
          <line x1="60" y1="340" x2="940" y2="340" stroke="#151d2d" stroke-width="1" stroke-dasharray="4,4" />
          <line x1="60" y1="260" x2="940" y2="260" stroke="#151d2d" stroke-width="1" stroke-dasharray="4,4" />
          <line x1="60" y1="180" x2="940" y2="180" stroke="#151d2d" stroke-width="1" stroke-dasharray="4,4" />
          <line x1="60" y1="100" x2="940" y2="100" stroke="#151d2d" stroke-width="1" stroke-dasharray="4,4" />
          <line x1="60" y1="40" x2="60" y2="420" stroke="#1c2538" stroke-width="1" />
          
          <!-- Confidence Interval Cloud -->
          <path d="M 100 130 Q 350 170, 500 240 T 900 390 L 900 420 L 500 280 Q 350 210, 100 170 Z" fill="rgba(245, 158, 11, 0.08)" />

          <!-- Demand Curve -->
          <path d="M 100 145 Q 350 185, 500 260 T 900 405" fill="none" stroke="#38bdf8" stroke-width="3" />
          
          <!-- Revenue / EBITDA Curve (Parabola) -->
          <path d="M 100 380 Q 500 70, 900 390" fill="none" stroke="#f59e0b" stroke-width="3" />

          <!-- Sweet-spot vertical line -->
          <line x1="500" y1="70" x2="500" y2="420" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" />
          <circle cx="500" cy="148" r="7" fill="#10b981" stroke="#ffffff" stroke-width="2" />

          <text x="515" y="152" fill="#10b981" font-size="13" font-weight="bold" font-family="JetBrains Mono">P* = $148.50 (Max EBITDA)</text>
          <text x="120" y="135" fill="#38bdf8" font-size="11" font-family="JetBrains Mono">Demand Curve Q(P)</text>
          <text x="740" y="240" fill="#f59e0b" font-size="11" font-family="JetBrains Mono">Revenue Function R(P)</text>
          
          <!-- Axis Labels -->
          <text x="860" y="445" fill="#64748b" font-size="11" font-family="JetBrains Mono">Ticket Price ($)</text>
          <text x="15" y="55" fill="#64748b" font-size="11" font-family="JetBrains Mono">Revenue</text>
        </svg>
      </div>
    </div>

    <div class="side-pane">
      <div class="side-card">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">Working Capital Float Waterfall</div>
        <div class="waterfall-row"><span>Days Sales Outstanding (DSO)</span><span style="color: #38bdf8;">+12.2 Days</span></div>
        <div class="waterfall-row"><span>Days Inventory Held (DIO)</span><span style="color: #38bdf8;">+21.4 Days</span></div>
        <div class="waterfall-row"><span>Days Payables Outstanding (DPO)</span><span style="color: #ef4444;">-70.0 Days</span></div>
        <div class="waterfall-row" style="font-weight: bold; border-top: 1px solid #1e293f; margin-top: 4px; padding-top: 8px;">
          <span>Net Cash Conversion Cycle</span><span style="color: #10b981;">-36.4 Days (Float)</span>
        </div>
      </div>

      <div class="side-card">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px;">Game-Theoretic Reaction Matrix</div>
        <p style="font-size: 11px; color: #64748b; line-height: 1.5;">
          Level-K equilibrium modeling shows rival firms lack supplier negative working capital float to retaliate below $125 without burning balance sheet reserves.
        </p>
      </div>

      <div class="side-card">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px;">Ostrom Defection Safeguards</div>
        <p style="font-size: 11px; color: #64748b; line-height: 1.5;">
          Enforces 3-tier graduated pricing sanctions. Prevents race-to-the-bottom commodity traps via differentiated service SLA lock-ins.
        </p>
      </div>
    </div>
  </div>
</div>
</body>
</html>
"""

# -------------------------------------------------------------
# 4. LATENCY ENGINE - C++20 Order Book Terminal
# -------------------------------------------------------------
HTML_LATENCY = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace; }
  body { background: #06080c; color: #e2e8f0; width: 1600px; height: 920px; overflow: hidden; display: flex; flex-direction: column; padding: 24px; }
  
  .window { background: #0b0e15; border: 1px solid #1a2336; border-radius: 12px; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85); }
  
  .topbar { background: #101522; border-bottom: 1px solid #1a2336; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }
  .controls { display: flex; gap: 8px; align-items: center; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .window-title { font-size: 13px; font-family: "JetBrains Mono", monospace; color: #8b949e; }
  .pill { font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-family: "JetBrains Mono", monospace; }
  .pill-red { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
  .pill-green { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }

  .metrics-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; padding: 16px 20px; background: #0d121c; border-bottom: 1px solid #172031; }
  .m-card { background: #121825; border: 1px solid #1c2538; border-radius: 8px; padding: 12px 16px; }
  .m-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-family: "JetBrains Mono", monospace; margin-bottom: 4px; }
  .m-val { font-size: 22px; font-weight: 700; color: #f8fafc; font-family: "JetBrains Mono", monospace; }

  .workspace { display: grid; grid-template-columns: 1fr 480px; flex: 1; min-height: 0; }
  
  .left-pane { padding: 18px; display: flex; flex-direction: column; gap: 12px; background: #070a10; }
  .orderbook-ladder { background: #0b0f17; border: 1px solid #192233; border-radius: 8px; flex: 1; padding: 12px; display: flex; flex-direction: column; font-family: "JetBrains Mono", monospace; font-size: 12px; }
  
  .ladder-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 4px 8px; border-radius: 4px; position: relative; margin-bottom: 2px; }
  .ladder-bid { color: #10b981; }
  .ladder-ask { color: #ef4444; }
  .depth-bar { position: absolute; top: 0; bottom: 0; right: 0; opacity: 0.15; border-radius: 4px; pointer-events: none; }

  .right-pane { border-left: 1px solid #1a2336; padding: 18px; background: #090c13; display: flex; flex-direction: column; gap: 12px; }
  .stat-box { background: #0d121c; border: 1px solid #192233; border-radius: 8px; padding: 12px; font-family: "JetBrains Mono", monospace; }
  
  .trade-feed { background: #06090e; border: 1px solid #161e2e; border-radius: 6px; padding: 10px; font-size: 11px; line-height: 1.5; color: #94a3b8; }
</style>
</head>
<body>
<div class="window">
  <div class="topbar">
    <div class="controls">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
      <span class="window-title" style="margin-left: 12px;">kairos_lob_engine // c++20_lockfree_orderbook</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <div class="pill pill-green">TICK-TO-TRADE: 780 NS</div>
      <div class="pill pill-red">ZERO KERNEL CONTEXT SWITCHES</div>
    </div>
  </div>

  <div class="metrics-strip">
    <div class="m-card">
      <div class="m-label">Tick-to-Trade Latency</div>
      <div class="m-val" style="color: #10b981;">780 <span style="font-size: 13px; color: #64748b;">nanoseconds</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Throughput Capacity</div>
      <div class="m-val">4.2M <span style="font-size: 13px; color: #64748b;">orders/sec</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Hardware Bypass</div>
      <div class="m-val" style="color: #38bdf8;">Solarflare ef_vi <span style="font-size: 13px; color: #64748b;">(DPDK)</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">L1 Data Cache Miss</div>
      <div class="m-val" style="color: #10b981;">0.04% <span style="font-size: 13px; color: #64748b;">(Core Pinning)</span></div>
    </div>
  </div>

  <div class="workspace">
    <div class="left-pane">
      <div class="orderbook-ladder">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 6px 8px; font-size: 11px; color: #64748b; border-bottom: 1px solid #1a2233; margin-bottom: 4px;">
          <span>SIDE / VENUE</span>
          <span>PRICE (USDT)</span>
          <span>SIZE (BTC)</span>
          <span>TOTAL DEPTH</span>
        </div>
        
        <!-- ASKS (Red) -->
        <div class="ladder-row ladder-ask"><div class="depth-bar" style="width: 82%; background: #ef4444;"></div><span>ASK · BINANCE</span><span>68,496.50</span><span>3.40</span><span>17.60 BTC</span></div>
        <div class="ladder-row ladder-ask"><div class="depth-bar" style="width: 75%; background: #ef4444;"></div><span>ASK · BINANCE</span><span>68,496.00</span><span>2.85</span><span>14.20 BTC</span></div>
        <div class="ladder-row ladder-ask"><div class="depth-bar" style="width: 58%; background: #ef4444;"></div><span>ASK · COINBASE</span><span>68,495.50</span><span>1.40</span><span>11.35 BTC</span></div>
        <div class="ladder-row ladder-ask"><div class="depth-bar" style="width: 42%; background: #ef4444;"></div><span>ASK · KRAKEN</span><span>68,495.00</span><span>1.15</span><span>9.95 BTC</span></div>
        <div class="ladder-row ladder-ask"><div class="depth-bar" style="width: 28%; background: #ef4444;"></div><span>ASK · BINANCE</span><span>68,494.50</span><span>0.68</span><span>8.80 BTC</span></div>
        <div class="ladder-row ladder-ask"><div class="depth-bar" style="width: 15%; background: #ef4444;"></div><span>ASK · BYBIT</span><span>68,494.00</span><span>0.42</span><span>8.12 BTC</span></div>

        <!-- SPREAD -->
        <div style="padding: 7px; text-align: center; color: #f59e0b; background: rgba(245, 158, 11, 0.08); border-radius: 4px; margin: 4px 0; font-size: 11px; font-weight: bold;">
          SPREAD: 0.50 USDT (0.0007%) · TOB ARBITRAGE OPPORTUNITY (+14.2 BPS)
        </div>

        <!-- BIDS (Green) -->
        <div class="ladder-row ladder-bid"><div class="depth-bar" style="width: 18%; background: #10b981;"></div><span>BID · BINANCE</span><span>68,493.50</span><span>0.65</span><span>0.65 BTC</span></div>
        <div class="ladder-row ladder-bid"><div class="depth-bar" style="width: 32%; background: #10b981;"></div><span>BID · COINBASE</span><span>68,493.00</span><span>1.80</span><span>2.45 BTC</span></div>
        <div class="ladder-row ladder-bid"><div class="depth-bar" style="width: 48%; background: #10b981;"></div><span>BID · KRAKEN</span><span>68,492.50</span><span>3.10</span><span>5.55 BTC</span></div>
        <div class="ladder-row ladder-bid"><div class="depth-bar" style="width: 65%; background: #10b981;"></div><span>BID · BINANCE</span><span>68,492.00</span><span>4.95</span><span>10.50 BTC</span></div>
        <div class="ladder-row ladder-bid"><div class="depth-bar" style="width: 78%; background: #10b981;"></div><span>BID · BYBIT</span><span>68,491.50</span><span>3.80</span><span>14.30 BTC</span></div>
        <div class="ladder-row ladder-bid"><div class="depth-bar" style="width: 90%; background: #10b981;"></div><span>BID · COINBASE</span><span>68,491.00</span><span>5.10</span><span>19.40 BTC</span></div>
      </div>
    </div>

    <div class="right-pane">
      <div class="stat-box">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px;">Live Sub-Microsecond Executions</div>
        <div class="trade-feed">
          <span style="color: #10b981;">[09:30:00.184029] FILL BUY 0.50 BTC @ 68,493.50 (742ns)</span><br>
          <span style="color: #ef4444;">[09:30:00.184102] FILL SELL 0.25 BTC @ 68,494.00 (710ns)</span><br>
          <span style="color: #f59e0b;">[09:30:00.184215] ARB SWEEP 1.20 BTC BINANCE &lt;-&gt; COINBASE (+14.2 bps)</span><br>
          <span style="color: #10b981;">[09:30:00.184330] FILL BUY 2.10 BTC @ 68,493.50 (768ns)</span>
        </div>
      </div>

      <div class="stat-box">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px;">Lock-Free Ring Buffer</div>
        <p style="font-size: 11px; color: #64748b; line-height: 1.5;">
          Zero heap allocations on the critical path. Atomic cache-line-padded ring buffers eliminate false sharing between matching core and network thread.
        </p>
      </div>

      <div class="stat-box">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px;">Kernel-Bypass Socket Layer</div>
        <p style="font-size: 11px; color: #64748b; line-height: 1.5;">
          Custom zero-copy user-space ring buffers achieve 780ns tick-to-trade response to market maker order cancellations.
        </p>
      </div>
    </div>
  </div>
</div>
</body>
</html>
"""

# -------------------------------------------------------------
# 5. GHOSTPILOT - GPS-Denied Drone Optical Flow HUD
# -------------------------------------------------------------
HTML_GHOSTPILOT = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace; }
  body { background: #05070a; color: #e2e8f0; width: 1600px; height: 920px; overflow: hidden; display: flex; flex-direction: column; padding: 24px; }
  
  .window { background: #07090e; border: 1px solid #161e2d; border-radius: 12px; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); }
  
  .topbar { background: #0b0f18; border-bottom: 1px solid #161e2d; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }
  .controls { display: flex; gap: 8px; align-items: center; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .window-title { font-size: 13px; font-family: "JetBrains Mono", monospace; color: #8b949e; }
  .pill { font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-family: "JetBrains Mono", monospace; }
  .pill-green { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
  .pill-amber { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }

  .hud-body { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at center, #111a2e 0%, #040508 100%); overflow: hidden; }

  .hud-overlay { position: absolute; width: 100%; height: 100%; pointer-events: none; }
  
  .hud-panel-left { position: absolute; top: 30px; left: 30px; display: flex; flex-direction: column; gap: 12px; }
  .hud-panel-right { position: absolute; top: 30px; right: 30px; display: flex; flex-direction: column; gap: 12px; text-align: right; }
  .hud-metric { background: rgba(11, 15, 24, 0.88); border: 1px solid #1a2336; border-radius: 8px; padding: 10px 14px; font-family: "JetBrains Mono", monospace; backdrop-filter: blur(8px); }
  .metric-label { font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
  .metric-val { font-size: 20px; font-weight: 700; color: #f8fafc; }
</style>
</head>
<body>
<div class="window">
  <div class="topbar">
    <div class="controls">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
      <span class="window-title" style="margin-left: 12px;">ghostpilot_telemetry // mavlink_stream (UAV-01)</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <div class="pill pill-amber">GPS-DENIED INDOOR NAVIGATION</div>
      <div class="pill pill-green">OPTICAL FLOW LOCK (99%)</div>
    </div>
  </div>

  <div class="hud-body">
    <svg class="hud-overlay" viewBox="0 0 1550 820">
      <!-- Simulated tunnel wireframe -->
      <line x1="180" y1="80" x2="600" y2="340" stroke="#1c2538" stroke-width="1.5" />
      <line x1="1370" y1="80" x2="950" y2="340" stroke="#1c2538" stroke-width="1.5" />
      <line x1="180" y1="740" x2="600" y2="480" stroke="#1c2538" stroke-width="1.5" />
      <line x1="1370" y1="740" x2="950" y2="480" stroke="#1c2538" stroke-width="1.5" />
      <rect x="600" y="340" width="350" height="140" fill="none" stroke="#25324a" stroke-width="2" />

      <!-- Compass Tape at Top -->
      <rect x="625" y="40" width="300" height="28" fill="rgba(11, 15, 24, 0.7)" stroke="#1a2336" rx="4" />
      <text x="775" y="58" fill="#10b981" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">▲ 142° NW</text>

      <!-- Pitch Ladder -->
      <line x1="715" y1="390" x2="835" y2="390" stroke="#10b981" stroke-width="2" />
      <line x1="735" y1="365" x2="815" y2="365" stroke="#10b981" stroke-width="1.5" />
      <line x1="735" y1="415" x2="815" y2="415" stroke="#10b981" stroke-width="1.5" />
      <text x="825" y="369" fill="#10b981" font-size="9" font-family="JetBrains Mono">+5°</text>
      <text x="825" y="419" fill="#10b981" font-size="9" font-family="JetBrains Mono">-5°</text>

      <!-- Flight Path Crosshair Reticle -->
      <circle cx="775" cy="390" r="18" fill="none" stroke="#10b981" stroke-width="2" />
      <line x1="750" y1="390" x2="740" y2="390" stroke="#10b981" stroke-width="2" />
      <line x1="800" y1="390" x2="810" y2="390" stroke="#10b981" stroke-width="2" />
      <line x1="775" y1="365" x2="775" y2="355" stroke="#10b981" stroke-width="2" />
      <line x1="775" y1="415" x2="775" y2="425" stroke="#10b981" stroke-width="2" />

      <!-- Optical Flow Tracked Feature Vectors -->
      <g stroke="#10b981" stroke-width="1.5">
        <path d="M 450 320 L 450 330 M 445 325 L 455 325" />
        <line x1="450" y1="325" x2="442" y2="322" stroke="#38bdf8" stroke-width="1.5" />
        <path d="M 520 280 L 520 290 M 515 285 L 525 285" />
        <line x1="520" y1="285" x2="512" y2="282" stroke="#38bdf8" stroke-width="1.5" />
        <path d="M 1020 300 L 1020 310 M 1015 305 L 1025 305" />
        <line x1="1020" y1="305" x2="1028" y2="302" stroke="#38bdf8" stroke-width="1.5" />
        <path d="M 1100 360 L 1100 370 M 1095 365 L 1105 365" />
        <line x1="1100" y1="365" x2="1108" y2="362" stroke="#38bdf8" stroke-width="1.5" />
        <path d="M 420 540 L 420 550 M 415 545 L 425 545" />
        <line x1="420" y1="545" x2="412" y2="548" stroke="#38bdf8" stroke-width="1.5" />
        <path d="M 1080 520 L 1080 530 M 1075 525 L 1085 525" />
        <line x1="1080" y1="525" x2="1088" y2="528" stroke="#38bdf8" stroke-width="1.5" />
      </g>
    </svg>

    <div class="hud-panel-left">
      <div class="hud-metric">
        <div class="metric-label">Barometric Altitude</div>
        <div class="metric-val">3.45 <span style="font-size: 12px; color: #64748b;">m AGL</span></div>
      </div>
      <div class="hud-metric">
        <div class="metric-label">Optical Flow Drift</div>
        <div class="metric-val" style="color: #10b981;">0.02 <span style="font-size: 12px; color: #64748b;">m/s</span></div>
      </div>
      <div class="hud-metric">
        <div class="metric-label">VIO Confidence</div>
        <div class="metric-val" style="color: #10b981;">99.4%</div>
      </div>
    </div>

    <div class="hud-panel-right">
      <div class="hud-metric">
        <div class="metric-label">Battery 6S LiPo</div>
        <div class="metric-val" style="color: #10b981;">22.4V <span style="font-size: 12px; color: #64748b;">(84%)</span></div>
      </div>
      <div class="hud-metric">
        <div class="metric-label">Forward Rangefinder</div>
        <div class="metric-val">8.2 <span style="font-size: 12px; color: #64748b;">meters</span></div>
      </div>
      <div class="hud-metric">
        <div class="metric-label">Tunnel Clearance</div>
        <div class="metric-val" style="color: #10b981;">CLEAR</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>
"""

# -------------------------------------------------------------
# 6. KVQUANT - LLM KV Cache Quantization Benchmark
# -------------------------------------------------------------
HTML_KVQUANT = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace; }
  body { background: #06080c; color: #e2e8f0; width: 1600px; height: 920px; overflow: hidden; display: flex; flex-direction: column; padding: 24px; }
  
  .window { background: #0c1018; border: 1px solid #1a2336; border-radius: 12px; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85); }
  
  .topbar { background: #111623; border-bottom: 1px solid #1a2336; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }
  .controls { display: flex; gap: 8px; align-items: center; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .window-title { font-size: 13px; font-family: "JetBrains Mono", monospace; color: #8b949e; }
  .pill { font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-family: "JetBrains Mono", monospace; }
  .pill-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
  .pill-green { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }

  .metrics-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; padding: 16px 20px; background: #0e131e; border-bottom: 1px solid #182133; }
  .m-card { background: #121826; border: 1px solid #1e293f; border-radius: 8px; padding: 12px 16px; }
  .m-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-family: "JetBrains Mono", monospace; margin-bottom: 4px; }
  .m-val { font-size: 22px; font-weight: 700; color: #f8fafc; font-family: "JetBrains Mono", monospace; }

  .workspace { display: grid; grid-template-columns: 1fr 440px; flex: 1; min-height: 0; }
  .chart-pane { padding: 20px; display: flex; flex-direction: column; gap: 14px; background: #080b12; }
  .chart-box { background: #0d121e; border: 1px solid #1a2336; border-radius: 8px; flex: 1; padding: 16px; position: relative; }
  
  .side-pane { border-left: 1px solid #1a2336; padding: 20px; background: #0a0e16; display: flex; flex-direction: column; gap: 14px; }
  .side-card { background: #111724; border: 1px solid #1b253a; border-radius: 8px; padding: 14px; font-family: "JetBrains Mono", monospace; }
</style>
</head>
<body>
<div class="window">
  <div class="topbar">
    <div class="controls">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
      <span class="window-title" style="margin-left: 12px;">kvquant_bench // attention_cache_scaling_suite.py</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <div class="pill pill-purple">2-BIT ASYMMETRIC QUANTIZATION</div>
      <div class="pill pill-green">128,000 CONTEXT TOKENS</div>
    </div>
  </div>

  <div class="metrics-strip">
    <div class="m-card">
      <div class="m-label">Memory Footprint Savings</div>
      <div class="m-val" style="color: #10b981;">-75.4% <span style="font-size: 12px; color: #10b981;">(4x Batch Size)</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Perplexity Degradation</div>
      <div class="m-val">+0.04 <span style="font-size: 12px; color: #10b981;">(Near-Lossless)</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Token Dequant Latency</div>
      <div class="m-val">0.12 <span style="font-size: 12px; color: #64748b;">ms / chunk</span></div>
    </div>
    <div class="m-card">
      <div class="m-label">Max Context Length</div>
      <div class="m-val" style="color: #c084fc;">128k <span style="font-size: 12px; color: #64748b;">Tokens</span></div>
    </div>
  </div>

  <div class="workspace">
    <div class="chart-pane">
      <div class="chart-box">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-family: 'JetBrains Mono', monospace; font-size: 12px;">
          <span style="color: #94a3b8; font-weight: 700;">KV CACHE VRAM CONSUMPTION VS CONTEXT LENGTH</span>
          <span style="color: #10b981;">KVQuant 2-Bit vs FP16 Baseline</span>
        </div>
        <svg viewBox="0 0 1000 480" style="width: 100%; height: 100%;">
          <line x1="60" y1="420" x2="940" y2="420" stroke="#1c2538" stroke-width="1" />
          <line x1="60" y1="340" x2="940" y2="340" stroke="#151d2d" stroke-width="1" stroke-dasharray="4,4" />
          <line x1="60" y1="260" x2="940" y2="260" stroke="#151d2d" stroke-width="1" stroke-dasharray="4,4" />
          <line x1="60" y1="180" x2="940" y2="180" stroke="#151d2d" stroke-width="1" stroke-dasharray="4,4" />
          <line x1="60" y1="100" x2="940" y2="100" stroke="#151d2d" stroke-width="1" stroke-dasharray="4,4" />
          <line x1="60" y1="40" x2="60" y2="420" stroke="#1c2538" stroke-width="1" />

          <!-- FP16 Exploding line with area fill -->
          <path d="M 100 390 L 300 340 L 500 240 L 680 90 L 680 420 L 100 420 Z" fill="rgba(239, 68, 68, 0.06)" />
          <path d="M 100 390 L 300 340 L 500 240 L 680 90" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4" />
          <circle cx="680" cy="90" r="6" fill="#ef4444" />
          <text x="695" y="95" fill="#ef4444" font-size="12" font-weight="bold" font-family="JetBrains Mono">FP16 CRASH: OOM @ 64k (28.2 GB)</text>

          <!-- KVQuant flat line with area fill -->
          <path d="M 100 410 L 300 400 L 500 380 L 700 355 L 900 330 L 900 420 L 100 420 Z" fill="rgba(16, 185, 129, 0.06)" />
          <path d="M 100 410 L 300 400 L 500 380 L 700 355 L 900 330" fill="none" stroke="#10b981" stroke-width="3" />
          <circle cx="900" cy="330" r="6" fill="#10b981" />
          <text x="750" y="315" fill="#10b981" font-size="12" font-weight="bold" font-family="JetBrains Mono">KVQuant: 6.8 GB @ 128k Tokens</text>

          <!-- Axis markings -->
          <text x="100" y="445" fill="#64748b" font-size="11" font-family="JetBrains Mono">4k</text>
          <text x="300" y="445" fill="#64748b" font-size="11" font-family="JetBrains Mono">16k</text>
          <text x="500" y="445" fill="#64748b" font-size="11" font-family="JetBrains Mono">32k</text>
          <text x="700" y="445" fill="#64748b" font-size="11" font-family="JetBrains Mono">64k</text>
          <text x="900" y="445" fill="#64748b" font-size="11" font-family="JetBrains Mono">128k</text>
        </svg>
      </div>
    </div>

    <div class="side-pane">
      <div class="side-card">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">Non-Uniform Outlier Retention</div>
        <p style="font-size: 11px; color: #64748b; line-height: 1.5;">
          Preserves critical outlier channel activations in FP16 while quantizing 99.2% of attention matrices to 2-bit asymmetric representation.
        </p>
      </div>
      <div class="side-card">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">CUDA Kernel Acceleration</div>
        <p style="font-size: 11px; color: #64748b; line-height: 1.5;">
          Custom fused warp-shuffle dequantization kernel runs concurrently with matrix multiplication, adding near-zero compute latency.
        </p>
      </div>
    </div>
  </div>
</div>
</body>
</html>
"""

# -------------------------------------------------------------
# 7. MAPLE TUI - High-Density Terminal Interface (Shot 2 for MAPLE)
# -------------------------------------------------------------
HTML_MAPLE_TUI = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: "JetBrains Mono", monospace; }
  body { background: #050608; color: #cbd5e1; width: 1600px; height: 920px; overflow: hidden; padding: 24px; }
  
  .tui-window { background: #0a0d13; border: 1px solid #1a2334; border-radius: 8px; height: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); }
  
  .tui-header { background: #111724; padding: 10px 18px; border-bottom: 1px solid #1a2334; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
  .tui-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 14px; padding: 16px; flex: 1; }
  
  .tui-box { background: #080b10; border: 1px solid #162030; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; }
  .tui-title { font-size: 11px; text-transform: uppercase; color: #38bdf8; font-weight: 700; margin-bottom: 8px; border-bottom: 1px dashed #1a263a; padding-bottom: 4px; }
  
  .ascii-bar { font-size: 12px; line-height: 1.6; }
</style>
</head>
<body>
<div class="tui-window">
  <div class="tui-header">
    <span>[MAPLE-CLI v1.4.2] -- MANIFOLD-ACTIVATED PRUNING SUITE -- HOST: amsach-laptop</span>
    <span style="color: #10b981;">STATUS: 45.4 TOK/S · VRAM: 4.75G/6.00G</span>
  </div>

  <div class="tui-grid">
    <div class="tui-box">
      <div class="tui-title">1. Layer-by-Layer MoE Activation Entropy</div>
      <div class="ascii-bar">
        L01: [████████████████████████████░░░░░░] 78.4% (Active: 3/8)<br>
        L02: [████████████████████████░░░░░░░░░░] 64.2% (Active: 2/8)<br>
        L03: [████████████████████████████████░░] 92.1% (Active: 4/8)<br>
        L04: [████████████████░░░░░░░░░░░░░░░░░░] 41.5% (Active: 1/8)<br>
        L05: [██████████████████████████░░░░░░░░] 71.0% (Active: 3/8)<br>
        L06: [██████████████████████████████░░░░] 84.8% (Active: 4/8)<br>
        L07: [████████████░░░░░░░░░░░░░░░░░░░░░░] 32.6% (Active: 1/8)<br>
        L08: [██████████████████████████████████] 99.4% (Active: 4/8)
      </div>
    </div>

    <div class="tui-box">
      <div class="tui-title">2. Excised Expert Null-Space Invariance</div>
      <div style="font-size: 12px; line-height: 1.6; color: #94a3b8;">
        Target BPW : 1.48 BPW (Sub-2-BPW Boundary)<br>
        Excised    : 80 / 128 Latent Experts Removed<br>
        SVD Norm Δ : ||W_pruned - W_orig||_F = 0.0024<br>
        Logit Loss : KL-Divergence = 0.0142 nats<br>
        Zero host-swap latency penalty across 24h stress test.
      </div>
    </div>

    <div class="tui-box">
      <div class="tui-title">3. Real-Time Token Generation Trace</div>
      <div style="font-size: 11px; line-height: 1.5; color: #10b981;">
        [00:04:12] Token #0128: "Poincaré" [P=0.984, Expert=E07, Latency=21.8ms]<br>
        [00:04:12] Token #0129: "half-plane" [P=0.991, Expert=E15, Latency=22.1ms]<br>
        [00:04:12] Token #0130: "metric" [P=0.978, Expert=E07, Latency=21.9ms]<br>
        [00:04:12] Token #0131: "ds^2" [P=0.995, Expert=E44, Latency=22.0ms]<br>
        [00:04:12] Token #0132: "=" [P=0.999, Expert=E44, Latency=21.8ms]<br>
        [00:04:12] Token #0133: "(dx^2+dy^2)/y^2" [P=0.994, Expert=E44, Latency=22.2ms]
      </div>
    </div>

    <div class="tui-box">
      <div class="tui-title">4. Hardware Execution Context</div>
      <div style="font-size: 12px; line-height: 1.6; color: #cbd5e1;">
        Device   : NVIDIA GeForce RTX 4060 Laptop (8GB TGP 105W)<br>
        Allocated: 4.75 GB VRAM (Weights 3.12 GB + KV 1.63 GB)<br>
        CUDA Core: 3072 Cuda Cores @ 2370 MHz<br>
        Driver   : 560.35.03 / CUDA 12.4 / cuDNN 9.1<br>
        Host Swap: 0 bytes swapped to system RAM
      </div>
    </div>
  </div>
</div>
</body>
</html>
"""

DASHBOARDS = [
    ("maple.html", HTML_MAPLE, "maple.png"),
    ("maple-tui.html", HTML_MAPLE_TUI, "maple-2.png"),
    ("voxelnav.html", HTML_VOXELNAV, "voxelnav.png"),
    ("decision.html", HTML_DECISION, "decision-engine.png"),
    ("latency.html", HTML_LATENCY, "latency-engine.png"),
    ("ghostpilot.html", HTML_GHOSTPILOT, "ghostpilot.png"),
    ("kvquant.html", HTML_KVQUANT, "kvquant.png"),
]

def render_all():
    print("Writing HTML templates...")
    for filename, html, _ in DASHBOARDS:
        path = os.path.join(HTML_DIR, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Saved: {path}")

    print("\nLaunching Playwright Chromium...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1600, "height": 920}, device_scale_factor=1)
        page = context.new_page()

        for filename, _, shot_name in DASHBOARDS:
            html_path = os.path.abspath(os.path.join(HTML_DIR, filename))
            url = f"file:///{html_path.replace(os.sep, '/')}"
            print(f"Rendering {filename} -> {shot_name}...")
            page.goto(url)
            page.wait_for_load_state("networkidle")
            output_shot = os.path.join(OUTPUT_DIR, shot_name)
            page.screenshot(path=output_shot, type="png")
            print(f"Created screenshot: {output_shot} ({os.path.getsize(output_shot)} bytes)")

        browser.close()
    print("\nAll screenshots generated successfully!")

if __name__ == "__main__":
    render_all()
