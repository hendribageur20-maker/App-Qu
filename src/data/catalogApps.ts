export interface CatalogApp {
  id: string;
  title: string;
  category: string;
  version: string;
  description: string;
  fileName: string;
  iconType: 'sofa' | 'calculator' | 'monitor' | 'book' | 'sparkles';
  theme: 'amber' | 'blue' | 'purple' | 'emerald';
  highlights: string[];
  htmlCode: string;
}

export interface TutorialArticle {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  summary: string;
  content: string[];
  samplePrompt: string;
}

export interface VideoTutorialItem {
  id: string;
  title: string;
  duration: string;
  level: string;
  embedUrl: string;
  description: string;
  keyTakeaways: string[];
}

export const INITIAL_CATALOG_APPS: CatalogApp[] = [
  {
    id: 'kayuqu-furnitur-studio',
    title: 'KayuQu Furnitur Studio',
    category: 'Web 3D App',
    version: 'v2.4 Stable',
    description:
      'Aplikasi desain furnitur berbasis web dengan visualisasi 3D dan kalkulasi estimasi material otomatis.',
    fileName: 'kayuqu-furnitur-studio.html',
    iconType: 'sofa',
    theme: 'amber',
    highlights: [
      'Visualisasi 3D Isometrik Interaktif (Putar 360° & Zoom)',
      'Kustomisasi Ukuran Panjang, Lebar, Tinggi & Jenis Kayu',
      'Kalkulasi RAB & Kebutuhan Lembar Material Otomatis',
    ],
    htmlCode: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KayuQu Furnitur Studio v2.4 — Web 3D & Estimasi Material</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: linear-gradient(90deg, #1e293b 0%, #0f172a 100%);
      border-bottom: 1px solid #334155;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: #fef3c7; color: #b45309;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 18px;
    }
    .brand h1 { font-size: 18px; font-weight: 700; color: #f8fafc; }
    .brand span { font-size: 12px; color: #94a3b8; }
    .workspace {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 20px;
      padding: 20px;
      flex: 1;
    }
    @media (max-width: 900px) {
      .workspace { grid-template-columns: 1fr; }
    }
    .viewport-card {
      background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
      border: 1px solid #334155;
      border-radius: 16px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      min-height: 460px;
    }
    .viewport-top {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
    }
    .preset-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .preset-btn {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid #475569;
      color: #cbd5e1;
      padding: 7px 13px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.15s;
    }
    .preset-btn.active, .preset-btn:hover {
      background: #d97706;
      border-color: #f59e0b;
      color: #fff;
    }
    canvas {
      width: 100%;
      height: 360px;
      cursor: grab;
      display: block;
    }
    canvas:active { cursor: grabbing; }
    .viewport-footer {
      padding: 12px 20px;
      background: rgba(15, 23, 42, 0.8);
      border-top: 1px solid #1e293b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #94a3b8;
    }
    .panel {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .panel h2 { font-size: 15px; font-weight: 700; color: #f8fafc; border-bottom: 1px solid #334155; padding-bottom: 10px; }
    .control-group { display: flex; flex-direction: column; gap: 6px; }
    .control-label { display: flex; justify-content: space-between; font-size: 13px; color: #cbd5e1; }
    .control-label strong { color: #fbbf24; font-family: monospace; }
    input[type="range"] { width: 100%; accent-color: #f59e0b; cursor: pointer; }
    select {
      width: 100%;
      padding: 9px 12px;
      border-radius: 8px;
      background: #0f172a;
      border: 1px solid #475569;
      color: #f8fafc;
      font-size: 13px;
    }
    .rab-box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .rab-row { display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; }
    .rab-row.total {
      border-top: 1px dashed #334155;
      padding-top: 10px;
      margin-top: 4px;
      font-size: 16px;
      font-weight: 700;
      color: #34d399;
    }
    .btn-action {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 11px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: 0.15s;
    }
    .btn-action:hover { background: #1d4ed8; }
    .toast {
      display: none;
      background: #065f46;
      color: #d1fae5;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-icon">KQ</div>
      <div>
        <h1>KayuQu Furnitur Studio</h1>
        <span>Visualisasi 3D Interaktif & Kalkulator Estimasi Material Otomatis</span>
      </div>
    </div>
    <div style="font-size:12px; color:#fbbf24; font-family:monospace;">v2.4 Stable · 3D Engine Ready</div>
  </header>

  <div class="workspace">
    <div class="viewport-card">
      <div class="viewport-top">
        <div class="preset-tabs">
          <button class="preset-btn active" onclick="setModel('meja', this)">Meja Kerja</button>
          <button class="preset-btn" onclick="setModel('rak', this)">Rak Buku 4 Susun</button>
          <button class="preset-btn" onclick="setModel('lemari', this)">Kabinet Credenza</button>
        </div>
        <button class="preset-btn" onclick="resetCamera()">Reset Sudut 3D</button>
      </div>

      <canvas id="canvas3d" width="800" height="420"></canvas>

      <div class="viewport-footer">
        <span>Geser (Drag) kanvas untuk memutar objek 3D secara real-time</span>
        <span id="angleInfo" style="font-family:monospace;">Rotasi: 35° | Kemiringan: 22°</span>
      </div>
    </div>

    <div class="panel">
      <h2>Parameter Dimensi & Material</h2>

      <div class="control-group">
        <div class="control-label"><span>Panjang (cm)</span><strong id="valP">140 cm</strong></div>
        <input type="range" id="inP" min="80" max="240" value="140" oninput="updateDesign()" />
      </div>

      <div class="control-group">
        <div class="control-label"><span>Lebar / Kedalaman (cm)</span><strong id="valL">65 cm</strong></div>
        <input type="range" id="inL" min="40" max="120" value="65" oninput="updateDesign()" />
      </div>

      <div class="control-group">
        <div class="control-label"><span>Tinggi (cm)</span><strong id="valT">75 cm</strong></div>
        <input type="range" id="inT" min="50" max="200" value="75" oninput="updateDesign()" />
      </div>

      <div class="control-group">
        <div class="control-label"><span>Jenis Material Kayu</span></div>
        <select id="inMaterial" onchange="updateDesign()">
          <option value="jati" data-price="420000" data-color="#b45309">Kayu Jati Perhutani Solid (Rp 420.000/m²)</option>
          <option value="mahoni" data-price="290000" data-color="#9a3412">Kayu Mahoni Oven (Rp 290.000/m²)</option>
          <option value="multipleks" data-price="210000" data-color="#d97706">Multipleks 18mm + HPL Taco (Rp 210.000/m²)</option>
          <option value="sungkai" data-price="340000" data-color="#ca8a04">Kayu Sungkai Natural (Rp 340.000/m²)</option>
        </select>
      </div>

      <h2>Estimasi Kebutuhan Material & RAB</h2>
      <div class="rab-box">
        <div class="rab-row"><span>Luas Permukaan Kayu</span><strong id="outArea" style="color:#f8fafc">0 m²</strong></div>
        <div class="rab-row"><span>Estimasi Lembar Papan</span><strong id="outSheets" style="color:#f8fafc">0 Lembar</strong></div>
        <div class="rab-row"><span>Biaya Bahan Baku Utama</span><strong id="outMatCost" style="color:#f8fafc">Rp 0</strong></div>
        <div class="rab-row"><span>Finishing & Hardware (20%)</span><strong id="outFinCost" style="color:#f8fafc">Rp 0</strong></div>
        <div class="rab-row total"><span>Total Estimasi Produksi</span><span id="outTotal">Rp 0</span></div>
      </div>

      <button class="btn-action" onclick="copyRab()">Salin Ringkasan RAB Produksi</button>
      <div id="toast" class="toast">Ringkasan RAB berhasil disalin ke clipboard!</div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('canvas3d');
    const ctx = canvas.getContext('2d');
    let modelType = 'meja';
    let rotY = 0.6;
    let rotX = 0.38;
    let isDragging = false;
    let lastX = 0, lastY = 0;

    canvas.addEventListener('mousedown', (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      rotY += (e.clientX - lastX) * 0.01;
      rotX = Math.max(-0.2, Math.min(1.1, rotX + (e.clientY - lastY) * 0.01));
      lastX = e.clientX; lastY = e.clientY;
      document.getElementById('angleInfo').textContent =
        'Rotasi: ' + Math.round((rotY * 180) / Math.PI) + '° | Kemiringan: ' + Math.round((rotX * 180) / Math.PI) + '°';
      drawScene();
    });

    function setModel(type, btn) {
      modelType = type;
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (type === 'meja') {
        document.getElementById('inP').value = 140;
        document.getElementById('inL').value = 65;
        document.getElementById('inT').value = 75;
      } else if (type === 'rak') {
        document.getElementById('inP').value = 100;
        document.getElementById('inL').value = 40;
        document.getElementById('inT').value = 165;
      } else {
        document.getElementById('inP').value = 160;
        document.getElementById('inL').value = 50;
        document.getElementById('inT').value = 85;
      }
      updateDesign();
    }

    function resetCamera() {
      rotY = 0.6; rotX = 0.38;
      updateDesign();
    }

    function project(x, y, z) {
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;
      const y2 = y * cosX - z1 * sinX;
      const scale = 420 / (420 + z1 * 0.4);
      return {
        x: canvas.width / 2 + x1 * scale,
        y: canvas.height / 2 - y2 * scale + 25
      };
    }

    function drawBox(cx, cy, cz, w, h, d, color) {
      const hw = w / 2, hh = h / 2, hd = d / 2;
      const v = [
        [cx - hw, cy - hh, cz - hd], [cx + hw, cy - hh, cz - hd],
        [cx + hw, cy + hh, cz - hd], [cx - hw, cy + hh, cz - hd],
        [cx - hw, cy - hh, cz + hd], [cx + hw, cy - hh, cz + hd],
        [cx + hw, cy + hh, cz + hd], [cx - hw, cy + hh, cz + hd]
      ].map(p => project(p[0], p[1], p[2]));

      const faces = [
        { idx: [0, 1, 2, 3], shade: 0.85 },
        { idx: [4, 5, 6, 7], shade: 0.95 },
        { idx: [0, 1, 5, 4], shade: 0.7 },
        { idx: [3, 2, 6, 7], shade: 1.12 },
        { idx: [1, 2, 6, 5], shade: 0.8 },
        { idx: [0, 3, 7, 4], shade: 0.75 }
      ];

      faces.forEach(f => {
        ctx.beginPath();
        ctx.moveTo(v[f.idx[0]].x, v[f.idx[0]].y);
        for (let i = 1; i < 4; i++) ctx.lineTo(v[f.idx[i]].x, v[f.idx[i]].y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
    }

    function drawScene() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const P = Number(document.getElementById('inP').value);
      const L = Number(document.getElementById('inL').value);
      const T = Number(document.getElementById('inT').value);
      const sel = document.getElementById('inMaterial');
      const color = sel.options[sel.selectedIndex].getAttribute('data-color') || '#b45309';

      // Floor grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      for (let g = -160; g <= 160; g += 40) {
        const p1 = project(g, -T / 2, -160), p2 = project(g, -T / 2, 160);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        const p3 = project(-160, -T / 2, g), p4 = project(160, -T / 2, g);
        ctx.beginPath(); ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
      }

      if (modelType === 'meja') {
        const legW = 8;
        drawBox(-P/2 + legW, 0, -L/2 + legW, legW, T, legW, '#475569');
        drawBox(P/2 - legW, 0, -L/2 + legW, legW, T, legW, '#475569');
        drawBox(-P/2 + legW, 0, L/2 - legW, legW, T, legW, '#475569');
        drawBox(P/2 - legW, 0, L/2 - legW, legW, T, legW, '#475569');
        drawBox(0, T/2 - 4, 0, P, 8, L, color);
      } else if (modelType === 'rak') {
        drawBox(-P/2 + 4, 0, 0, 6, T, L, color);
        drawBox(P/2 - 4, 0, 0, 6, T, L, color);
        for (let i = 0; i < 4; i++) {
          const yPos = -T/2 + 12 + (i * (T - 24) / 3);
          drawBox(0, yPos, 0, P, 5, L, color);
        }
      } else {
        drawBox(0, 0, 0, P, T * 0.75, L, color);
        drawBox(-P/3, -T * 0.42, 0, 8, T * 0.2, 8, '#334155');
        drawBox(P/3, -T * 0.42, 0, 8, T * 0.2, 8, '#334155');
      }
    }

    function formatRp(num) {
      return 'Rp ' + Math.round(num).toLocaleString('id-ID');
    }

    function updateDesign() {
      const P = Number(document.getElementById('inP').value);
      const L = Number(document.getElementById('inL').value);
      const T = Number(document.getElementById('inT').value);
      document.getElementById('valP').textContent = P + ' cm';
      document.getElementById('valL').textContent = L + ' cm';
      document.getElementById('valT').textContent = T + ' cm';

      const sel = document.getElementById('inMaterial');
      const pricePerM2 = Number(sel.options[sel.selectedIndex].getAttribute('data-price'));

      const multiplier = modelType === 'meja' ? 1.6 : modelType === 'rak' ? 2.8 : 3.4;
      const areaM2 = ((P * L + P * T * 0.6) / 10000) * multiplier;
      const sheets = Math.max(1, Math.ceil(areaM2 / 2.97));
      const matCost = areaM2 * pricePerM2;
      const finCost = matCost * 0.2;
      const total = matCost + finCost;

      document.getElementById('outArea').textContent = areaM2.toFixed(2) + ' m²';
      document.getElementById('outSheets').textContent = sheets + ' Lembar (122x244cm)';
      document.getElementById('outMatCost').textContent = formatRp(matCost);
      document.getElementById('outFinCost').textContent = formatRp(finCost);
      document.getElementById('outTotal').textContent = formatRp(total);

      drawScene();
    }

    function copyRab() {
      const toast = document.getElementById('toast');
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 2500);
    }

    updateDesign();
  </script>
</body>
</html>`,
  },
  {
    id: 'kalkulator-pintar-ai',
    title: 'Kalkulator Pintar AI',
    category: 'Utility App',
    version: 'v1.1 Ready',
    description:
      'Alat hitung cerdas dengan integrasi logika instan untuk keperluan bisnis dan produktivitas harian.',
    fileName: 'kalkulator-pintar-ai.html',
    iconType: 'calculator',
    theme: 'blue',
    highlights: [
      'Mode Kalkulator Standar, Ilmiah & Riwayat Perhitungan',
      'Kalkulator HPP, Margin Keuntungan & Harga Jual UMKM',
      'Analisis Logika Instan & Rekomendasi Target Penjualan',
    ],
    htmlCode: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kalkulator Pintar AI v1.1 — Bisnis & Produktivitas</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      padding: 24px;
    }
    .app-shell {
      max-width: 920px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .topbar {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      color: #fff;
      padding: 20px 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .topbar h1 { font-size: 20px; font-weight: 800; }
    .topbar p { font-size: 13px; opacity: 0.88; margin-top: 2px; }
    .mode-tabs {
      display: flex;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 8px 20px;
      gap: 10px;
    }
    .tab-btn {
      border: none;
      background: transparent;
      padding: 10px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      color: #475569;
      cursor: pointer;
    }
    .tab-btn.active {
      background: #2563eb;
      color: #fff;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 24px;
      padding: 24px;
    }
    @media (max-width: 768px) {
      .content-grid { grid-template-columns: 1fr; }
    }
    .calc-display {
      background: #0f172a;
      color: #f8fafc;
      padding: 20px;
      border-radius: 14px;
      text-align: right;
      margin-bottom: 14px;
    }
    .calc-expr { font-size: 13px; color: #94a3b8; min-height: 20px; font-family: monospace; }
    .calc-val { font-size: 32px; font-weight: 800; font-family: monospace; margin-top: 4px; word-break: break-all; }
    .keypad {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .key {
      padding: 15px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      cursor: pointer;
      transition: 0.12s;
    }
    .key:hover { background: #e2e8f0; }
    .key.op { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
    .key.eq { background: #2563eb; color: #fff; border-color: #2563eb; grid-column: span 2; }
    .key.clear { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
    .card-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card-box h3 { font-size: 15px; color: #0f172a; }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label { font-size: 12px; font-weight: 600; color: #475569; }
    .field input {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      font-size: 14px;
    }
    .insight-box {
      background: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 13px;
      color: #1e3a8a;
      line-height: 1.5;
    }
    .history-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 220px;
      overflow-y: auto;
    }
    .history-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      font-family: monospace;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <div class="topbar">
      <div>
        <h1>Kalkulator Pintar AI</h1>
        <p>Logika hitung instan untuk HPP bisnis UMKM, margin laba, dan kalkulasi cepat</p>
      </div>
      <span style="background:rgba(255,255,255,0.18); padding:6px 12px; border-radius:8px; font-size:12px; font-weight:700;">v1.1 Ready</span>
    </div>

    <div class="mode-tabs">
      <button class="tab-btn active" onclick="switchTab('standar', this)">Kalkulator Cepat & Riwayat</button>
      <button class="tab-btn" onclick="switchTab('bisnis', this)">Kalkulator HPP & Margin Bisnis</button>
    </div>

    <div id="tab-standar" class="content-grid">
      <div>
        <div class="calc-display">
          <div class="calc-expr" id="expr">Siap menghitung</div>
          <div class="calc-val" id="screen">0</div>
        </div>
        <div class="keypad">
          <button class="key clear" onclick="clearScreen()">AC</button>
          <button class="key op" onclick="press('(')">(</button>
          <button class="key op" onclick="press(')')">)</button>
          <button class="key op" onclick="press('/')">÷</button>
          <button class="key" onclick="press('7')">7</button>
          <button class="key" onclick="press('8')">8</button>
          <button class="key" onclick="press('9')">9</button>
          <button class="key op" onclick="press('*')">×</button>
          <button class="key" onclick="press('4')">4</button>
          <button class="key" onclick="press('5')">5</button>
          <button class="key" onclick="press('6')">6</button>
          <button class="key op" onclick="press('-')">−</button>
          <button class="key" onclick="press('1')">1</button>
          <button class="key" onclick="press('2')">2</button>
          <button class="key" onclick="press('3')">3</button>
          <button class="key op" onclick="press('+')">+</button>
          <button class="key" onclick="press('0')">0</button>
          <button class="key" onclick="press('.')">.</button>
          <button class="key eq" onclick="calculate()">= Hitung</button>
        </div>
      </div>

      <div class="card-box">
        <h3>Riwayat & Analisis Logika AI</h3>
        <div class="insight-box" id="aiSmartNote">
          Masukkan angka atau rumus di samping. Kalkulator ini otomatis mencatat riwayat dan menghitung persentase PPN 11% dari hasil akhir Anda.
        </div>
        <ul class="history-list" id="historyList">
          <li class="history-item"><span>150000 * 1.25</span><strong>187.500</strong></li>
        </ul>
      </div>
    </div>

    <div id="tab-bisnis" class="content-grid" style="display:none;">
      <div class="card-box">
        <h3>Simulasi HPP & Harga Jual Produk</h3>
        <div class="field">
          <label>Modal Bahan Baku per Porsi / Unit (Rp)</label>
          <input type="number" id="modalBahan" value="18000" oninput="hitungBisnis()" />
        </div>
        <div class="field">
          <label>Biaya Kemasan & Operasional per Unit (Rp)</label>
          <input type="number" id="modalOps" value="4500" oninput="hitungBisnis()" />
        </div>
        <div class="field">
          <label>Target Margin Keuntungan (%)</label>
          <input type="number" id="targetMargin" value="40" oninput="hitungBisnis()" />
        </div>
        <div class="field">
          <label>Target Penjualan Harian (Unit)</label>
          <input type="number" id="targetUnit" value="35" oninput="hitungBisnis()" />
        </div>
      </div>

      <div class="card-box">
        <h3>Hasil Rekomendasi Pintar</h3>
        <div class="history-item"><span>Total HPP per Unit</span><strong id="resHpp">Rp 22.500</strong></div>
        <div class="history-item"><span>Rekomendasi Harga Jual</span><strong id="resJual" style="color:#2563eb;">Rp 31.500</strong></div>
        <div class="history-item"><span>Laba Bersih per Unit</span><strong id="resLabaUnit" style="color:#16a34a;">Rp 9.000</strong></div>
        <div class="history-item"><span>Potensi Laba Bulanan (30 Hari)</span><strong id="resLabaBulan" style="color:#16a34a;">Rp 9.450.000</strong></div>
        <div class="insight-box" id="bisnisInsight"></div>
      </div>
    </div>
  </div>

  <script>
    let current = '';
    function press(ch) {
      current += ch;
      document.getElementById('screen').textContent = current;
    }
    function clearScreen() {
      current = '';
      document.getElementById('screen').textContent = '0';
      document.getElementById('expr').textContent = 'Siap menghitung';
    }
    function calculate() {
      if (!current) return;
      try {
        const result = Function('"use strict";return (' + current + ')')();
        const formatted = Number(result).toLocaleString('id-ID');
        document.getElementById('expr').textContent = current + ' =';
        document.getElementById('screen').textContent = formatted;

        const ppn = Math.round(result * 0.11).toLocaleString('id-ID');
        document.getElementById('aiSmartNote').innerHTML =
          '<strong>Analisis Instan:</strong> Hasil = <b>' + formatted + '</b>. Jika ditambah PPN 11% (+Rp ' + ppn + '), total tagihan menjadi <b>Rp ' + Math.round(result * 1.11).toLocaleString('id-ID') + '</b>.';

        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = '<span>' + current + '</span><strong>' + formatted + '</strong>';
        document.getElementById('historyList').prepend(li);
        current = String(result);
      } catch (e) {
        document.getElementById('screen').textContent = 'Error';
        current = '';
      }
    }
    function switchTab(mode, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-standar').style.display = mode === 'standar' ? 'grid' : 'none';
      document.getElementById('tab-bisnis').style.display = mode === 'bisnis' ? 'grid' : 'none';
      if (mode === 'bisnis') hitungBisnis();
    }
    function hitungBisnis() {
      const bahan = Number(document.getElementById('modalBahan').value) || 0;
      const ops = Number(document.getElementById('modalOps').value) || 0;
      const margin = Number(document.getElementById('targetMargin').value) || 0;
      const unit = Number(document.getElementById('targetUnit').value) || 0;

      const hpp = bahan + ops;
      const jual = Math.ceil((hpp * (1 + margin / 100)) / 500) * 500;
      const labaUnit = jual - hpp;
      const labaBulan = labaUnit * unit * 30;

      document.getElementById('resHpp').textContent = 'Rp ' + hpp.toLocaleString('id-ID');
      document.getElementById('resJual').textContent = 'Rp ' + jual.toLocaleString('id-ID');
      document.getElementById('resLabaUnit').textContent = 'Rp ' + labaUnit.toLocaleString('id-ID');
      document.getElementById('resLabaBulan').textContent = 'Rp ' + labaBulan.toLocaleString('id-ID');
      document.getElementById('bisnisInsight').innerHTML =
        'Dengan margin <b>' + margin + '%</b> (dibulatkan ke Rp ' + jual.toLocaleString('id-ID') + '), Anda memperoleh keuntungan bersih <b>Rp ' + (labaUnit * unit).toLocaleString('id-ID') + '/hari</b> dari penjualan ' + unit + ' unit.';
    }
    hitungBisnis();
  </script>
</body>
</html>`,
  },
  {
    id: 'salonqu-business-web',
    title: 'SalonQu Manajemen Studio',
    category: 'Business Web',
    version: 'v1.5 Stable',
    description:
      'Sistem kasir POS, manajemen antrean booking pelanggan, dan rekap omzet harian untuk bisnis jasa & salon masa kini.',
    fileName: 'salonqu-manajemen-studio.html',
    iconType: 'monitor',
    theme: 'purple',
    highlights: [
      'Kasir POS Layanan Jasa & Paket Treatment Otomatis',
      'Pencatatan Antrean Pelanggan & Pemilihan Kapster/Stylist',
      'Rekap Pendapatan Harian & Cetak Struk Digital',
    ],
    htmlCode: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SalonQu Manajemen Studio v1.5 — Business Web</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #faf5ff; color: #1e1b4b; padding: 20px; }
    .container { max-width: 980px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
      color: #fff;
      padding: 20px 24px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: #fff;
      border: 1px solid #e9d5ff;
      padding: 16px;
      border-radius: 14px;
    }
    .stat-card span { font-size: 12px; color: #6b7280; }
    .stat-card strong { display: block; font-size: 22px; margin-top: 4px; color: #5b21b6; font-family: monospace; }
    .main-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; }
    @media (max-width: 780px) { .main-grid, .stats-bar { grid-template-columns: 1fr; } }
    .card { background: #fff; border: 1px solid #e9d5ff; border-radius: 16px; padding: 20px; }
    .card h2 { font-size: 16px; margin-bottom: 14px; color: #4c1d95; }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
    .form-group input, .form-group select {
      width: 100%; padding: 10px; border: 1px solid #d8b4fe; border-radius: 8px; font-size: 13px;
    }
    .btn {
      width: 100%; background: #7c3aed; color: #fff; border: none; padding: 11px;
      border-radius: 10px; font-weight: 700; cursor: pointer;
    }
    .btn:hover { background: #6d28d9; }
    .queue-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px; border: 1px solid #f3e8ff; border-radius: 10px; margin-bottom: 10px; background: #fdfaff;
    }
    .status-btn {
      background: #10b981; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>SalonQu Manajemen Studio 1.5</h1>
        <p style="font-size:13px; opacity:0.9;">Sistem Kasir & Antrean Pelanggan Salon Masa Kini</p>
      </div>
      <div style="font-family:monospace; font-size:13px;">Business Web Ready</div>
    </div>

    <div class="stats-bar">
      <div class="stat-card"><span>Total Omzet Hari Ini</span><strong id="omzetVal">Rp 435.000</strong></div>
      <div class="stat-card"><span>Pelanggan Terlayani</span><strong id="countVal">3 Pelanggan</strong></div>
      <div class="stat-card"><span>Kapster Aktif</span><strong>4 Stylist</strong></div>
    </div>

    <div class="main-grid">
      <div class="card">
        <h2>Tambah Booking / Transaksi Baru</h2>
        <div class="form-group">
          <label>Nama Pelanggan</label>
          <input type="text" id="custName" placeholder="Contoh: Kak Rina Putri" />
        </div>
        <div class="form-group">
          <label>Pilih Layanan Treatment</label>
          <select id="serviceSelect">
            <option value="Potong Rambut + Wash & Blow" data-price="85000">Potong Rambut + Wash & Blow — Rp 85.000</option>
            <option value="Creambath Royal Spa" data-price="120000">Creambath Royal Spa — Rp 120.000</option>
            <option value="Hair Coloring Premium" data-price="230000">Hair Coloring Premium — Rp 230.000</option>
            <option value="Keratin Smooth Therapy" data-price="310000">Keratin Smooth Therapy — Rp 310.000</option>
          </select>
        </div>
        <div class="form-group">
          <label>Pilih Stylist / Kapster</label>
          <select id="stylistSelect">
            <option value="Stylist Maya">Stylist Maya</option>
            <option value="Stylist রেজা (Reza)">Stylist Reza</option>
            <option value="Stylist Dinda">Stylist Dinda</option>
          </select>
        </div>
        <button class="btn" onclick="addBooking()">+ Masukkan ke Antrean & Kasir</button>
      </div>

      <div class="card">
        <h2>Daftar Antrean & Transaksi Hari Ini</h2>
        <div id="queueList"></div>
      </div>
    </div>
  </div>

  <script>
    let bookings = [
      { name: 'Kak Nadia', service: 'Creambath Royal Spa', stylist: 'Stylist Maya', price: 120000, done: true },
      { name: 'Kak Siska', service: 'Keratin Smooth Therapy', stylist: 'Stylist Dinda', price: 315000, done: true },
      { name: 'Kak Putri', service: 'Potong Rambut + Wash & Blow', stylist: 'Stylist Reza', price: 85000, done: false }
    ];

    function render() {
      const list = document.getElementById('queueList');
      list.innerHTML = '';
      let omzet = 0;
      let doneCount = 0;

      bookings.forEach((b, idx) => {
        if (b.done) { omzet += b.price; doneCount++; }
        const div = document.createElement('div');
        div.className = 'queue-item';
        div.innerHTML =
          '<div><strong>' + b.name + '</strong> <span style="font-size:12px; color:#6b7280;">(' + b.stylist + ')</span>' +
          '<div style="font-size:12px; color:#4c1d95; margin-top:2px;">' + b.service + ' · <b>Rp ' + b.price.toLocaleString('id-ID') + '</b></div></div>' +
          (b.done
            ? '<span style="font-size:12px; color:#059669; font-weight:700;">Lunas / Selesai</span>'
            : '<button class="status-btn" onclick="markDone(' + idx + ')">Selesaikan & Bayar</button>');
        list.appendChild(div);
      });

      document.getElementById('omzetVal').textContent = 'Rp ' + omzet.toLocaleString('id-ID');
      document.getElementById('countVal').textContent = doneCount + ' Pelanggan';
    }

    function addBooking() {
      const nameInput = document.getElementById('custName');
      const name = nameInput.value.trim() || 'Pelanggan Walk-in';
      const sel = document.getElementById('serviceSelect');
      const service = sel.value;
      const price = Number(sel.options[sel.selectedIndex].getAttribute('data-price'));
      const stylist = document.getElementById('stylistSelect').value;

      bookings.unshift({ name, service, stylist, price, done: false });
      nameInput.value = '';
      render();
    }

    function markDone(i) {
      bookings[i].done = true;
      render();
    }

    render();
  </script>
</body>
</html>`,
  },
  {
    id: 'belajar-sama-ai-portal',
    title: 'Belajar Bikin App dengan AI',
    category: 'EdTech Web',
    version: 'v1.2 Ready',
    description:
      'Template portal edukasi interaktif dari repositori Belajar-sama-ai lengkap dengan modul prompt, video tutorial, dan artikel pilihan.',
    fileName: 'index.html',
    iconType: 'book',
    theme: 'emerald',
    highlights: [
      'Versi Interaktif dari GitHub hendribageur20-maker/Belajar-sama-ai',
      'Dilengkapi Simulasi Prompt Builder & Unduh Starter Kit',
      'Siap Diunduh sebagai index.html untuk GitHub Pages',
    ],
    htmlCode: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Belajar Membuat App dengan AI - Panduan & Tools</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f6f9;
      color: #1e293b;
      line-height: 1.6;
    }
    .container {
      width: 90%;
      max-width: 860px;
      margin: auto;
      overflow: hidden;
    }
    header {
      background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
      color: #ffffff;
      padding: 36px 0;
      text-align: center;
    }
    header h1 { margin: 0 0 8px 0; font-size: 28px; }
    header p { margin: 0; opacity: 0.92; }
    nav {
      background: #0f172a;
      padding: 12px 0;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    nav a {
      color: #ffffff;
      text-decoration: none;
      margin: 0 15px;
      font-size: 14px;
      font-weight: bold;
    }
    nav a:hover { color: #60a5fa; }
    main { padding: 24px 0; }
    .card {
      background: #ffffff;
      padding: 24px;
      margin-bottom: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }
    .card h2 {
      color: #1d4ed8;
      margin-top: 0;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 10px;
      font-size: 20px;
    }
    .download-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      padding: 14px 16px;
      margin-bottom: 12px;
      border-radius: 8px;
      border-left: 4px solid #2563eb;
      gap: 12px;
    }
    .download-box p { margin: 4px 0 0 0; font-size: 13px; color: #64748b; }
    .btn {
      background: #16a34a;
      color: white;
      padding: 9px 16px;
      text-decoration: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn:hover { background: #15803d; }
    .prompt-sim {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 16px;
      border-radius: 10px;
      margin-top: 12px;
    }
    .prompt-sim select, .prompt-sim input {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid #93c5fd;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .video-container {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      height: 0;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .video-container iframe {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
    }
    .article-item h3 { margin-bottom: 5px; color: #0f172a; }
    .article-item .date { font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 8px; }
    hr { border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0; }
    footer {
      text-align: center;
      padding: 24px;
      background: #0f172a;
      color: #fff;
      margin-top: 30px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>Belajar Bikin App dengan AI</h1>
      <p>Platform belajar mandiri membuat aplikasi, tutorial video, dan download template gratis.</p>
    </div>
  </header>

  <nav>
    <div class="container">
      <a href="#pengantar">Pengantar</a>
      <a href="#simulasi">Latihan Prompt</a>
      <a href="#download">Free App / HTML</a>
      <a href="#video">Video Tutorial</a>
      <a href="#artikel">Artikel Pilihan</a>
    </div>
  </nav>

  <main class="container">
    <section id="pengantar" class="card">
      <h2>Apa itu AI App Builder?</h2>
      <p>Sekarang, siapa pun bisa membuat aplikasi menggunakan bantuan <em>Artificial Intelligence</em> (AI). Cukup berikan perintah teks (prompt), dan AI akan membantu merancang logika, desain, hingga kode pemrogramannya tanpa harus jago koding dari nol.</p>
      <div id="simulasi" class="prompt-sim">
        <strong>Simulasi Penyusun Prompt Otomatis:</strong>
        <div style="margin-top:8px;">
          <select id="jenisApp" onchange="buatPrompt()">
            <option value="Aplikasi Kasir UMKM">Aplikasi Kasir UMKM</option>
            <option value="Kalkulator Keuntungan Bisnis">Kalkulator Keuntungan Bisnis</option>
            <option value="Katalog Produk Toko Online">Katalog Produk Toko Online</option>
          </select>
          <button class="btn" onclick="salinPrompt()">Salin Prompt</button>
        </div>
        <p id="hasilPrompt" style="font-family:monospace; font-size:13px; background:#fff; padding:10px; border-radius:6px; margin-top:8px;"></p>
      </div>
    </section>

    <section id="download" class="card">
      <h2>Free App HTML / Starter</h2>
      <p>Unduh contoh project aplikasi atau kode sumber siap pakai secara gratis untuk bahan latihan Anda:</p>
      <div class="download-box">
        <div>
          <strong>Template Web Kalkulator AI (HTML/JS)</strong>
          <p>Contoh kode sumber aplikasi sederhana berbasis web siap dijalankan di browser.</p>
        </div>
        <button class="btn" onclick="alert('Gunakan tombol Download di bar atas untuk mengunduh file HTML!')">Siap Diunduh</button>
      </div>
      <div class="download-box">
        <div>
          <strong>Template Katalog App Qu Group (HTML5)</strong>
          <p>Template dashboard katalog aplikasi lengkap dengan Live Preview modal.</p>
        </div>
        <button class="btn" onclick="alert('Tersedia di menu Export GitHub index.html!')">Tersedia</button>
      </div>
    </section>

    <section id="video" class="card">
      <h2>Video Tutorial & YouTube</h2>
      <p>Tonton panduan visual langkah demi langkah seputar pembuatan aplikasi dengan AI:</p>
      <div class="video-container">
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
      </div>
    </section>

    <section id="artikel" class="card">
      <h2>Artikel & Tips Terbaru</h2>
      <article class="article-item">
        <h3>3 Cara Mudah Berikan Prompt ke AI untuk Membuat Script Aplikasi</h3>
        <p class="date">Dipublikasikan: 17 September 2026</p>
        <p>Pelajari cara menyusun kalimat perintah (prompt) yang jelas: sebutkan Tujuan Aplikasi, Daftar Fitur Utama, dan Desain Antarmuka agar AI memberikan hasil kode program yang minim error.</p>
      </article>
      <hr>
      <article class="article-item">
        <h3>Mengapa Laptop Spek Rendah Tetap Bisa Belajar Koding dengan AI</h3>
        <p class="date">Dipublikasikan: 15 September 2026</p>
        <p>Memanfaatkan tools berbasis cloud dan browser membuat Anda tidak perlu menginstal software berat di laptop ber-RAM kecil.</p>
      </article>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2026 App Qu Group & Belajar App AI. Dibuat dengan semangat berkarya.</p>
    </div>
  </footer>

  <script>
    function buatPrompt() {
      var jenis = document.getElementById('jenisApp').value;
      document.getElementById('hasilPrompt').textContent =
        'Buatkan aplikasi web single-file HTML5 untuk "' + jenis + '" dengan tampilan modern, responsif di HP, memiliki fitur tambah data, hitung otomatis, dan tombol simpan.';
    }
    function salinPrompt() {
      var teks = document.getElementById('hasilPrompt').textContent;
      navigator.clipboard.writeText(teks);
      alert('Prompt berhasil disalin!');
    }
    buatPrompt();
  </script>
</body>
</html>`,
  },
];

export const TUTORIAL_ARTICLES: TutorialArticle[] = [
  {
    id: 'prompt-3-langkah',
    title: '3 Cara Mudah Berikan Prompt ke AI untuk Membuat Script Aplikasi',
    date: '17 September 2026',
    readTime: '4 menit baca',
    category: 'Teknik Prompting',
    summary:
      'Pelajari cara menyusun kalimat perintah (prompt) yang jelas agar AI memberikan hasil kode program yang minim error dan langsung siap dijalankan.',
    content: [
      'Banyak pemula bingung mengapa hasil kode dari AI terkadang tidak sesuai harapan atau tombolnya belum berfungsi. Rahasianya terletak pada struktur kalimat perintah (prompt) yang kita berikan.',
      'Langkah 1 — Tentukan Peran & Format File: Mintalah AI membuat aplikasi dalam format "Single-File HTML5" (HTML, CSS, dan JavaScript digabung dalam satu file index.html) agar mudah di-preview dan diunggah ke GitHub Pages.',
      'Langkah 2 — Rinci Fitur Interaktif: Jangan hanya menulis "buat aplikasi kasir". Tuliskan secara spesifik: "Sediakan input nama barang, harga, jumlah, hitung total otomatis dalam Rupiah, dan tampilkan daftar riwayat transaksi."',
      'Langkah 3 — Gunakan Live Preview Sebelum Download: Uji seluruh tombol di jendela Live Preview (Desktop & Mobile). Jika ada warna atau rumus yang kurang pas, minta AI memperbaiki bagian tersebut sebelum Anda mengunduh file index.html.',
    ],
    samplePrompt:
      'Buatkan aplikasi web single-file HTML5 untuk Kasir Warung Kopi dengan daftar menu, keranjang pesanan, hitung kembalian otomatis dalam Rupiah, dan fitur cetak struk.',
  },
  {
    id: 'laptop-spek-rendah',
    title: 'Mengapa Laptop Spek Rendah Tetap Bisa Belajar Koding dengan AI',
    date: '15 September 2026',
    readTime: '3 menit baca',
    category: 'Tips Perangkat',
    summary:
      'Memanfaatkan tools berbasis cloud dan browser membuat Anda tidak perlu menginstal software berat di laptop ber-RAM kecil atau bahkan dari smartphone.',
    content: [
      'Dulu, untuk membuat aplikasi Anda harus menginstal IDE berat dan emulator yang membutuhkan RAM 16GB. Kini, seluruh proses pemrosesan AI dan kompilasi berjalan di server cloud.',
      'Dengan alur kerja App Qu Group dan GitHub, Anda cukup membuka browser, mengetik ide aplikasi di menu Tools AI, mengujinya secara langsung melalui fitur Live Preview, lalu mengunduh file index.html yang ukurannya hanya beberapa Kilobyte.',
      'File index.html yang telah Anda unduh bisa langsung dibuka di browser apa pun tanpa koneksi internet atau diunggah ke repositori GitHub Anda (seperti Belajar-sama-ai) agar bisa diakses oleh siapa saja secara online.',
    ],
    samplePrompt:
      'Buatkan aplikasi web ringan pengelola jadwal belajar harian dan timer Pomodoro dengan tampilan bersih yang cepat dibuka di HP maupun laptop.',
  },
  {
    id: 'cara-upload-github',
    title: 'Panduan Upload File index.html ke GitHub & Aktifkan GitHub Pages',
    date: '22 September 2026',
    readTime: '5 menit baca',
    category: 'Panduan Hosting',
    summary:
      'Langkah demi langkah mengunggah hasil download index.html dari App Qu Group ke repositori GitHub Belajar-sama-ai agar bisa diakses publik.',
    content: [
      'Setelah Anda mencoba aplikasi di Live Preview dan menekan tombol "Download index.html", Anda memiliki file web mandiri yang siap dipublikasikan gratis menggunakan GitHub.',
      '1. Buka repositori GitHub Anda (contoh: github.com/hendribageur20-maker/Belajar-sama-ai).',
      '2. Klik tombol "Add file" -> "Upload files", lalu pilih file index.html yang baru saja Anda unduh dari App Qu Group.',
      '3. Klik "Commit changes" di bagian bawah halaman. Untuk mengaktifkan link website publik, buka tab Settings -> Pages -> pilih branch "main" -> klik Save.',
    ],
    samplePrompt:
      'Buatkan landing page portofolio katalog aplikasi AI modern dengan tombol preview interaktif dan daftar kontak WhatsApp.',
  },
];

export const VIDEO_TUTORIALS: VideoTutorialItem[] = [
  {
    id: 'vid-1',
    title: 'Dasar Membuat Web App Pertama dengan AI (Tanpa Koding Manual)',
    duration: '12:40',
    level: 'Pemula',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description:
      'Panduan lengkap dari nol merancang ide, menulis prompt, menguji di Live Preview, hingga mengunduh file index.html siap pakai.',
    keyTakeaways: [
      'Memahami struktur satu file index.html (HTML + CSS + JS)',
      'Cara menguji tampilan responsif Desktop & HP di Live Preview',
      'Cara menyimpan dan mengunggah aplikasi ke GitHub',
    ],
  },
  {
    id: 'vid-2',
    title: 'Membuat Kalkulator Bisnis & Kasir UMKM Berbasis Web dengan AI',
    duration: '15:15',
    level: 'Menengah',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description:
      'Studi kasus membangun aplikasi Kalkulator Pintar AI dan SalonQu Manajemen Studio dengan logika perhitungan Rupiah otomatis.',
    keyTakeaways: [
      'Menambahkan rumus kalkulasi HPP & margin otomatis',
      'Membuat tabel transaksi dinamis tanpa database rumit',
      'Kustomisasi warna dan identitas brand App Qu Group',
    ],
  },
];

/**
 * Generates a 100% standalone single-file `index.html` of the entire App Qu Group platform
 * (including Katalog, Tools AI Prompt Builder, Tutorial, Tentang, and an interactive Live Preview modal before download)
 * so the user can directly upload it to https://github.com/hendribageur20-maker/Belajar-sama-ai/blob/main/index.html
 */
export function buildMasterAppQuGroupHtml(apps: CatalogApp[]): string {
  const serializedApps = JSON.stringify(
    apps.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      version: a.version,
      description: a.description,
      fileName: a.fileName,
      theme: a.theme,
      htmlCode: a.htmlCode,
    }))
  ).replace(/<\/script>/gi, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App Qu Group — Katalog Web App & Belajar Sama AI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: #f3f6fb;
      color: #0f172a;
      line-height: 1.5;
    }
    .hero-bar {
      background: linear-gradient(90deg, #1737c9 0%, #2448e6 60%, #1d35b8 100%);
      color: #fff;
      padding: 22px 24px;
    }
    .container { max-width: 1120px; margin: 0 auto; }
    .hero-inner { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .logo-q {
      width: 44px; height: 44px; border-radius: 14px; background: #fff; color: #1d4ed8;
      display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 22px;
    }
    .brand h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
    .nav-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
      margin: 24px auto;
    }
    @media (max-width: 768px) { .nav-grid { grid-template-columns: repeat(2, 1fr); } }
    .nav-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px 16px;
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      cursor: pointer; transition: 0.15s; font-weight: 700; font-size: 14px; color: #1e293b;
    }
    .nav-card:hover { border-color: #93c5fd; transform: translateY(-1px); }
    .nav-card.active {
      background: #1d58e8; border-color: #1d58e8; color: #fff;
      box-shadow: 0 10px 24px rgba(29, 88, 232, 0.25);
    }
    .section-head {
      display: flex; justify-content: space-between; align-items: center; margin: 24px 0 16px;
    }
    .section-head h2 { font-size: 20px; font-weight: 800; }
    .app-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
    @media (max-width: 820px) { .app-grid { grid-template-columns: 1fr; } }
    .app-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 24px;
      display: flex; flex-direction: column; justify-content: space-between; gap: 16px;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
    }
    .card-top { display: flex; justify-content: space-between; align-items: center; }
    .icon-box {
      width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 18px;
    }
    .cat-label { font-size: 12px; font-weight: 700; color: #475569; }
    .app-card h3 { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
    .app-card p { font-size: 14px; color: #64748b; }
    .card-foot {
      border-top: 1px solid #f1f5f9; padding-top: 14px;
      display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;
    }
    .ver-text { font-size: 12px; color: #94a3b8; font-weight: 600; }
    .btn-group { display: flex; gap: 8px; }
    .btn-preview {
      background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;
      padding: 9px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; cursor: pointer;
    }
    .btn-open {
      background: #1d58e8; color: #fff; border: none;
      padding: 9px 18px; border-radius: 999px; font-size: 13px; font-weight: 700; cursor: pointer;
    }
    /* Modal Live Preview */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75);
      display: none; align-items: center; justify-content: center; z-index: 100; padding: 16px;
    }
    .modal-box {
      background: #fff; width: 100%; max-width: 1100px; height: 88vh; border-radius: 20px;
      display: flex; flex-direction: column; overflow: hidden;
    }
    .modal-header {
      padding: 14px 20px; background: #0f172a; color: #fff;
      display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
    }
    .modal-body { flex: 1; background: #cbd5e1; display: flex; justify-content: center; overflow: hidden; }
    .modal-body iframe { width: 100%; height: 100%; border: none; background: #fff; transition: width 0.2s; }
    .btn-dl { background: #16a34a; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
    .btn-close { background: #334155; color: #fff; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <header class="hero-bar">
    <div class="container hero-inner">
      <div class="brand">
        <div class="logo-q">Q</div>
        <h1>App Qu Group</h1>
      </div>
      <div style="font-size:13px; opacity:0.9;">Katalog Web App & Live Preview Sebelum Download</div>
    </div>
  </header>

  <main class="container">
    <div class="nav-grid">
      <button class="nav-card active" onclick="showTab('katalog', this)"><span>Katalog</span></button>
      <button class="nav-card" onclick="showTab('tools', this)"><span>Tools AI</span></button>
      <button class="nav-card" onclick="showTab('tutorial', this)"><span>Tutorial</span></button>
      <button class="nav-card" onclick="showTab('tentang', this)"><span>Tentang</span></button>
    </div>

    <section id="sec-katalog">
      <div class="section-head">
        <h2>Daftar Web App Qu Group</h2>
        <span style="font-size:14px; color:#64748b;" id="appCountLabel"></span>
      </div>
      <div class="app-grid" id="catalogGrid"></div>
    </section>

    <section id="sec-tools" style="display:none; margin-bottom:40px;">
      <div class="app-card">
        <h3>Generator Prompt AI App Builder</h3>
        <p>Susun perintah teks (prompt) terstruktur untuk membuat aplikasi web HTML/JS baru dengan AI.</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
          <input id="ideaInput" type="text" placeholder="Ketik ide aplikasi, misal: Kasir Laundry Kiloan..." style="flex:1; padding:12px; border:1px solid #cbd5e1; border-radius:10px;" />
          <button class="btn-open" onclick="generatePromptIdea()">Buat Prompt</button>
        </div>
        <pre id="promptOutput" style="background:#0f172a; color:#f8fafc; padding:16px; border-radius:12px; font-size:13px; white-space:pre-wrap; margin-top:10px;">Ketik ide aplikasi di atas lalu klik Buat Prompt.</pre>
      </div>
    </section>

    <section id="sec-tutorial" style="display:none; margin-bottom:40px;">
      <div class="app-card" style="margin-bottom:20px;">
        <h3>Video Tutorial Pembuatan Aplikasi dengan AI</h3>
        <p>Panduan langkah demi langkah merancang aplikasi web, melakukan Live Preview, dan mengunduh kode sumber HTML.</p>
        <div style="position:relative; padding-bottom:56.25%; height:0; border-radius:12px; overflow:hidden; background:#000; margin-top:10px;">
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute; inset:0; width:100%; height:100%; border:0;" allowfullscreen></iframe>
        </div>
      </div>
    </section>

    <section id="sec-tentang" style="display:none; margin-bottom:40px;">
      <div class="app-card">
        <h3>Tentang App Qu Group & Belajar Sama AI</h3>
        <p>Platform ekosistem katalog aplikasi web mandiri, template siap pakai, dan edukasi pemrograman berbantuan AI. Setiap aplikasi dilengkapi fitur Live Preview interaktif sebelum Anda mengunduh file HTML-nya.</p>
      </div>
    </section>
  </main>

  <div class="modal-backdrop" id="previewModal">
    <div class="modal-box">
      <div class="modal-header">
        <div>
          <strong id="modalTitle" style="font-size:15px;">Live Preview</strong>
          <span id="modalVer" style="font-size:12px; color:#94a3b8; margin-left:8px;"></span>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <button class="btn-close" onclick="setViewport('100%')">Desktop</button>
          <button class="btn-close" onclick="setViewport('390px')">HP / Mobile</button>
          <button class="btn-dl" onclick="downloadCurrentApp()">Download .HTML</button>
          <button class="btn-close" onclick="closePreview()">Tutup ✕</button>
        </div>
      </div>
      <div class="modal-body">
        <iframe id="previewFrame"></iframe>
      </div>
    </div>
  </div>

  <script>
    const APPS = ${serializedApps};
    let activeApp = null;

    function renderApps() {
      document.getElementById('appCountLabel').textContent = APPS.length + ' Aplikasi Aktif';
      const grid = document.getElementById('catalogGrid');
      grid.innerHTML = '';
      APPS.forEach((app, idx) => {
        const bgMap = { amber: '#fef3c7', blue: '#dbeafe', purple: '#f3e8ff', emerald: '#d1fae5' };
        const fgMap = { amber: '#b45309', blue: '#1d4ed8', purple: '#7e22ce', emerald: '#047857' };
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML =
          '<div>' +
            '<div class="card-top" style="margin-bottom:16px;">' +
              '<div class="icon-box" style="background:' + (bgMap[app.theme] || '#dbeafe') + '; color:' + (fgMap[app.theme] || '#1d4ed8') + ';">' + app.title.substring(0,2).toUpperCase() + '</div>' +
              '<span class="cat-label">' + app.category + '</span>' +
            '</div>' +
            '<h3>' + app.title + '</h3>' +
            '<p>' + app.description + '</p>' +
          '</div>' +
          '<div class="card-foot">' +
            '<span class="ver-text">' + app.version + '</span>' +
            '<div class="btn-group">' +
              '<button class="btn-preview" onclick="openPreview(' + idx + ')">Live Preview</button>' +
              '<button class="btn-open" onclick="openPreview(' + idx + ')">Buka App →</button>' +
            '</div>' +
          '</div>';
        grid.appendChild(card);
      });
    }

    function openPreview(index) {
      activeApp = APPS[index];
      document.getElementById('modalTitle').textContent = 'Live Preview: ' + activeApp.title;
      document.getElementById('modalVer').textContent = activeApp.version;
      const frame = document.getElementById('previewFrame');
      frame.style.width = '100%';
      frame.srcdoc = activeApp.htmlCode;
      document.getElementById('previewModal').style.display = 'flex';
    }

    function setViewport(w) {
      document.getElementById('previewFrame').style.width = w;
    }

    function closePreview() {
      document.getElementById('previewModal').style.display = 'none';
      document.getElementById('previewFrame').srcdoc = '';
    }

    function downloadCurrentApp() {
      if (!activeApp) return;
      const blob = new Blob([activeApp.htmlCode], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeApp.fileName || 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function showTab(tab, btn) {
      document.querySelectorAll('.nav-card').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ['katalog', 'tools', 'tutorial', 'tentang'].forEach(t => {
        document.getElementById('sec-' + t).style.display = t === tab ? 'block' : 'none';
      });
    }

    function generatePromptIdea() {
      const val = document.getElementById('ideaInput').value.trim() || 'Aplikasi Kasir & Inventori Toko';
      document.getElementById('promptOutput').textContent =
        'Buatkan aplikasi web single-file HTML5 lengkap (HTML, CSS modern, dan JavaScript interaktif) untuk "' + val + '".\\n' +
        'Sertakan fitur: 1) Input data baru & kalkulasi otomatis dalam Rupiah, 2) Tabel daftar data yang rapi & responsif di HP, 3) Ringkasan laporan di bagian atas.';
    }

    renderApps();
  </script>
</body>
</html>`;
}
