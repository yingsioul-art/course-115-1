/* 藥動學 互動工具：一室模型血中濃度模擬器（疊加原理） */
window.TOOLS = window.TOOLS || {};
(function () {
  // 單一劑量在時間 t（距給藥）的濃度
  function single(t, S) {
    if (t < 0) return 0;
    const k = S.cl / S.vd;
    if (S.route === "iv") return S.dose / S.vd * Math.exp(-k * t);
    if (S.route === "inf") {
      const T = Math.min(S.tinf, S.tau), R = S.dose / T;
      return t <= T ? R / S.cl * (1 - Math.exp(-k * t)) : R / S.cl * (1 - Math.exp(-k * T)) * Math.exp(-k * (t - T));
    }
    const ka = S.ka, tt = Math.max(0, t - S.lag);
    if (Math.abs(ka - k) < 1e-6) return S.F * S.dose * k * tt * Math.exp(-k * tt) / S.vd;
    return S.F * S.dose * ka / (S.vd * (ka - k)) * (Math.exp(-k * tt) - Math.exp(-ka * tt));
  }
  function conc(t, S) {
    let c = 0;
    for (let i = 0; i < S.n; i++) c += single(t - i * S.tau, S);
    if (S.ldOn) c += S.ld / S.vd * Math.exp(-(S.cl / S.vd) * t); // 負荷劑量以 IV bolus 給
    return c;
  }
  const PRESETS = [
    { t: "基本：IV bolus 單劑", d: "Vd 50 L、CL 5 L/h → k＝0.1、t½≈6.9 h。看看半對數座標是不是一條直線。", s: { route: "iv", dose: 500, vd: 50, cl: 5, n: 1, tau: 12, ldOn: false, log: false } },
    { t: "多次給藥：蓄積到穩定態", d: "q6h（τ≈t½）重複 10 劑，谷底逐次墊高；蓄積因子≈2。", s: { route: "iv", dose: 500, vd: 50, cl: 5, n: 10, tau: 6, ldOn: false, log: false, mtc: 25 } },
    { t: "定速輸注 → 加上負荷劑量", d: "連續輸注（每 12 h 輸 12 h）要 4–5 個 t½ 才到 Css；打開負荷劑量（LD＝Vd×Css）立刻到位。", s: { route: "inf", dose: 600, tinf: 12, tau: 12, n: 6, vd: 50, cl: 5, ldOn: true, ld: 500, log: false } },
    { t: "口服：緩釋錠 vs 被磨粉", d: "先跑 ka＝0.15（緩釋），按「保留曲線」，再把 ka 拉到 3（磨粉＝瞬間釋出），看 Cmax 是否越過 MTC。", s: { route: "po", dose: 600, F: 0.8, ka: 0.15, lag: 0, vd: 50, cl: 5, n: 1, tau: 12, ldOn: false, log: false, mtc: 8, mec: 2 } },
    { t: "Flip-flop（ka＜k）", d: "ka＝0.05 小於 k＝0.2：切到半對數座標，末端斜率其實是 ka。", s: { route: "po", dose: 500, F: 1, ka: 0.05, lag: 0, vd: 25, cl: 5, n: 1, tau: 24, ldOn: false, log: true } },
    { t: "葡萄柚汁：F 變 3 倍", d: "某 CYP3A4 受質 F＝0.2；保留曲線後把 F 拉到 0.6，AUC 與 Cmax 都變 3 倍，t½ 不變。", s: { route: "po", dose: 400, F: 0.2, ka: 1, lag: 0, vd: 50, cl: 5, n: 6, tau: 12, ldOn: false, log: false, mec: 1, mtc: 5 } },
    { t: "腎功能下降：CL 減半", d: "保留曲線後把 CL 從 5 降到 2.5：t½ 加倍、穩定態濃度加倍、到穩定態更慢。", s: { route: "iv", dose: 500, vd: 50, cl: 5, n: 12, tau: 8, ldOn: false, log: false, mtc: 25 } },
  ];
  const DEF = { route: "iv", dose: 500, vd: 50, cl: 5, ka: 1, F: 1, lag: 0, tinf: 1, tau: 12, n: 1, ld: 500, ldOn: false, mec: 4, mtc: 15, tmax: 0, log: false };
  const CTRL = [
    ["dose", "每次劑量 (mg)", 10, 2000, 10, "all"],
    ["vd", "Vd (L)", 5, 300, 1, "all"],
    ["cl", "CL (L/h)", 0.5, 30, 0.1, "all"],
    ["ka", "ka (1/h)", 0.02, 5, 0.01, "po"],
    ["F", "F 生體可用率", 0.05, 1, 0.01, "po"],
    ["lag", "Lag time (h)", 0, 3, 0.1, "po"],
    ["tinf", "每次輸注時間 (h)", 0.25, 24, 0.25, "inf"],
    ["n", "給藥次數", 1, 20, 1, "all"],
    ["tau", "給藥間隔 τ (h)", 1, 48, 1, "all"],
    ["ld", "負荷劑量 (mg)", 0, 3000, 10, "all"],
    ["mec", "MEC (mg/L)", 0, 50, 0.5, "all"],
    ["mtc", "MTC (mg/L)", 0, 100, 0.5, "all"],
  ];
  TOOLS.sim = function (main, U) {
    const S = Object.assign({}, DEF, U.load("sim", {}));
    let ghost = null;
    main.innerHTML = `<div class="card"><h2>📈 血中濃度模擬器（一室模型）</h2><div class="muted small">k＝CL/Vd、t½＝0.693/k；多次給藥用疊加原理相加。先選一個情境，照說明操作，再自己亂玩。對應講義：PK 參數第 2–9 頁。</div>
      <div class="filters" style="margin-top:8px"><select id="sp"><option value="">— 選一個情境 —</option>${PRESETS.map((p, i) => `<option value="${i}">${U.esc(p.t)}</option>`).join("")}</select></div>
      <div class="explain" id="spd" style="display:none"></div></div>
      <div class="lab-grid"><div class="card">
        <div style="margin-bottom:8px"><span class="seg" id="sr"><button data-r="iv">IV bolus</button><button data-r="inf">IV 輸注</button><button data-r="po">口服</button></span></div>
        <div class="ctrl" id="sc"></div>
        <div style="margin-top:8px"><label><input type="checkbox" id="sld"> 開始時先給負荷劑量（IV）</label>　<button class="btn small" id="sldc">依 LD＝Vd×Css 帶入</button></div>
        <div style="margin-top:6px"><label><input type="checkbox" id="slog"> 半對數座標（log C）</label></div>
      </div>
      <div class="card"><div id="sv"></div>
        <div class="slide-nav"><button class="btn small" id="sg">📌 保留目前曲線比較</button><button class="btn small" id="sgc">清除比較</button><button class="btn small" id="sreset">全部重設</button></div>
        <div class="kv" id="sk"></div><p class="small muted" id="smsg"></p></div></div>`;
    const draw = () => {
      U.save("sim", S);
      [...U.$("#sr").children].forEach((b) => b.classList.toggle("on", b.dataset.r === S.route));
      U.$("#sld").checked = S.ldOn; U.$("#slog").checked = S.log;
      const k = S.cl / S.vd, th = 0.693 / k;
      const tEnd = Math.min(400, Math.max((S.n - 1) * S.tau + 5 * th, S.route === "po" ? (S.n - 1) * S.tau + 5 * Math.max(th, 0.693 / S.ka) : 0, 12));
      const N = 500, pts = [];
      for (let i = 0; i <= N; i++) { const t = tEnd * i / N; pts.push([t, conc(t, S)]); }
      const gpts = ghost ? ghost.pts.filter((p) => p[0] <= tEnd) : null;
      const cmax = Math.max(...pts.map((p) => p[1]));
      const ymaxRaw = Math.max(cmax, gpts ? Math.max(...gpts.map((p) => p[1])) : 0, S.mtc || 0) * 1.1 || 1;
      const W = 640, H = 330, P = { l: 52, r: 14, t: 12, b: 34 };
      const sx = (t) => P.l + t / tEnd * (W - P.l - P.r);
      const ymin = S.log ? Math.max(ymaxRaw / 1e3, 1e-3) : 0;
      const sy = S.log ? (c) => H - P.b - (Math.log10(Math.max(c, ymin)) - Math.log10(ymin)) / (Math.log10(ymaxRaw) - Math.log10(ymin)) * (H - P.t - P.b)
                       : (c) => H - P.b - c / ymaxRaw * (H - P.t - P.b);
      let s = `<svg class="chart" viewBox="0 0 ${W} ${H}">`;
      if (S.mtc > 0 || S.mec > 0) {
        const top = S.mtc > 0 ? sy(Math.min(S.mtc, ymaxRaw)) : P.t, bot = sy(Math.max(S.mec, ymin));
        s += `<rect x="${P.l}" y="${top}" width="${W - P.l - P.r}" height="${Math.max(0, bot - top)}" fill="var(--ok)" opacity=".1"/>`;
        if (S.mtc > 0) s += `<line x1="${P.l}" x2="${W - P.r}" y1="${sy(S.mtc)}" y2="${sy(S.mtc)}" stroke="var(--bad)" stroke-dasharray="5 4"/><text x="${W - P.r - 4}" y="${sy(S.mtc) - 4}" text-anchor="end" style="fill:var(--bad)">MTC ${S.mtc}</text>`;
        if (S.mec > 0) s += `<line x1="${P.l}" x2="${W - P.r}" y1="${sy(S.mec)}" y2="${sy(S.mec)}" stroke="var(--ok)" stroke-dasharray="5 4"/><text x="${W - P.r - 4}" y="${sy(S.mec) + 14}" text-anchor="end" style="fill:var(--ok)">MEC ${S.mec}</text>`;
      }
      const yt = S.log ? [...Array(4)].map((_, i) => ymaxRaw / 10 ** i).filter((v) => v >= ymin) : [0, .25, .5, .75, 1].map((f) => f * ymaxRaw);
      yt.forEach((v) => (s += `<line x1="${P.l}" x2="${W - P.r}" y1="${sy(v)}" y2="${sy(v)}" stroke="currentColor" opacity=".07"/><text x="${P.l - 6}" y="${sy(v) + 4}" text-anchor="end">${v >= 10 ? v.toFixed(0) : v.toPrecision(2)}</text>`));
      const step = tEnd > 200 ? 48 : tEnd > 80 ? 24 : tEnd > 30 ? 6 : tEnd > 12 ? 2 : 1;
      for (let t = 0; t <= tEnd; t += step) s += `<text x="${sx(t)}" y="${H - P.b + 16}" text-anchor="middle">${t}</text>`;
      s += `<text x="${W / 2}" y="${H - 4}" text-anchor="middle">時間 (h)</text><text x="12" y="${H / 2}" transform="rotate(-90 12 ${H / 2})" text-anchor="middle">濃度 (mg/L)</text>`;
      for (let i = 0; i < S.n; i++) { const t = i * S.tau; if (t <= tEnd) s += `<line x1="${sx(t)}" x2="${sx(t)}" y1="${H - P.b}" y2="${H - P.b + 5}" stroke="var(--warn)" stroke-width="2"/>`; }
      const path = (arr) => arr.map((p, i) => (i ? "L" : "M") + sx(p[0]).toFixed(1) + "," + sy(p[1]).toFixed(1)).join("");
      if (gpts) s += `<path d="${path(gpts)}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 4"/>`;
      s += `<path d="${path(pts)}" fill="none" stroke="var(--accent)" stroke-width="2.6"/></svg>`;
      U.$("#sv").innerHTML = s;
      // 指標
      let tpk = 0; pts.forEach((p) => { if (p[1] === cmax) tpk = p[0]; });
      const auc1 = (S.route === "po" ? S.F : 1) * S.dose / S.cl;
      const R = 1 / (1 - Math.exp(-k * S.tau));
      const cssAvg = (S.route === "po" ? S.F : 1) * S.dose / (S.cl * S.tau);
      const over = pts.filter((p) => S.mtc > 0 && p[1] > S.mtc).length / pts.length * tEnd;
      U.$("#sk").innerHTML = `<div>k (1/h)<b>${k.toFixed(3)}</b></div><div>t½ (h)<b>${th.toFixed(1)}</b></div><div>Cmax (mg/L)<b>${cmax.toFixed(2)}</b></div><div>Tmax (h)<b>${tpk.toFixed(1)}</b></div>
        <div>單劑 AUC<b>${auc1.toFixed(1)}</b></div><div>蓄積因子 R<b>${R.toFixed(2)}</b></div><div>持續給藥平均 Css<b>${cssAvg.toFixed(2)}</b></div><div>90% 穩定態需<b>${(3.32 * th).toFixed(1)} h</b></div>`;
      const msgs = [];
      if (S.mtc > 0 && over > 0) msgs.push(`⚠️ 約有 ${over.toFixed(1)} 小時超過 MTC。`);
      if (S.route === "po" && S.ka < k) msgs.push("🔁 目前 ka＜k：flip-flop，末端斜率反映的是吸收。");
      if (S.n > 1 && (S.n - 1) * S.tau < 3.32 * th) msgs.push("⏳ 最後一劑時還沒到 90% 穩定態，可以增加給藥次數看看。");
      if (ghost) msgs.push(`虛線＝保留的曲線（Cmax ${ghost.cmax.toFixed(2)}）。`);
      U.$("#smsg").textContent = msgs.join("　");
    };
    const build = () => {
      U.$("#sc").innerHTML = CTRL.filter((c) => c[5] === "all" || c[5] === S.route).map(([key, lab, mn, mx, st]) =>
        `<label>${lab}</label><input type="range" data-k="${key}" min="${mn}" max="${mx}" step="${st}" value="${S[key]}"><output id="so_${key}">${S[key]}</output>`).join("");
      draw();
    };
    U.$("#sc").addEventListener("input", (e) => {
      const key = e.target.dataset.k; if (!key) return;
      S[key] = +e.target.value; U.$("#so_" + key).textContent = e.target.value; draw();
    });
    U.$("#sr").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; S.route = b.dataset.r; build(); };
    U.$("#sld").onchange = (e) => { S.ldOn = e.target.checked; draw(); };
    U.$("#slog").onchange = (e) => { S.log = e.target.checked; draw(); };
    U.$("#sldc").onclick = () => { S.ld = Math.round(S.vd * (S.route === "po" ? S.F : 1) * S.dose / (S.cl * S.tau)); S.ldOn = true; U.toast(`LD＝${S.ld} mg`); build(); };
    U.$("#sg").onclick = () => {
      const k = S.cl / S.vd, th = 0.693 / k, tEnd = 400, pts = [];
      for (let i = 0; i <= 1600; i++) { const t = tEnd * i / 1600; pts.push([t, conc(t, S)]); }
      ghost = { pts, cmax: Math.max(...pts.map((p) => p[1])) }; draw();
    };
    U.$("#sgc").onclick = () => { ghost = null; draw(); };
    U.$("#sreset").onclick = () => { Object.assign(S, DEF); ghost = null; U.$("#spd").style.display = "none"; U.$("#sp").value = ""; build(); };
    U.$("#sp").onchange = (e) => {
      const p = PRESETS[+e.target.value]; if (!p) return;
      Object.assign(S, DEF, p.s); ghost = null;
      U.$("#spd").style.display = ""; U.$("#spd").textContent = "👉 " + p.d; build();
    };
    build();
  };
})();
