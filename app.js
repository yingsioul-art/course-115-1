/* 115-1 修課互動教材：共用引擎
   資料來源：window.COURSE（data_*.js）、window.ALIGN（align_*.js，錄音對齊，可缺）
   路由：#home #pre #lec/<id>/<page> #map #gl #quiz #case #wrong #tool/<id> */
(function () {
  const C = window.COURSE;
  const ALIGN = window.ALIGN || {};
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const main = $("main");
  document.title = C.title;
  $("#courseTitle").textContent = C.title;

  // ---------- 本機儲存（失敗時退回記憶體） ----------
  const mem = {};
  const KEY = (k) => `c115:${C.id}:${k}`;
  const load = (k, d) => { try { const v = localStorage.getItem(KEY(k)); return v ? JSON.parse(v) : d; } catch (e) { return mem[k] ?? d; } };
  const save = (k, v) => { mem[k] = v; try { localStorage.setItem(KEY(k), JSON.stringify(v)); } catch (e) {} };

  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 1800);
  }
  const fmt = (sec) => { sec = Math.max(0, Math.floor(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0"); };
  const lecById = (id) => C.lectures.find((l) => l.id === id);
  const allQs = () => C.questions.concat(...C.cases.map((cs) => cs.qs.map((q) => ({ ...q, caseId: cs.id }))));
  const qById = (id) => allQs().find((q) => q.id === id);

  // ---------- 錯題本 ----------
  function recordAnswer(q, ok) {
    const w = load("wrong", {});
    if (ok) { if (w[q.id]) { w[q.id].streak = (w[q.id].streak || 0) + 1; if (w[q.id].streak >= 2) delete w[q.id]; } }
    else { w[q.id] = { n: (w[q.id]?.n || 0) + 1, streak: 0, t: Date.now() }; }
    save("wrong", w);
    const st = load("stats", {}); st[q.id] = ok ? "ok" : "bad"; save("stats", st);
  }
  function refLink(ref) {
    if (!ref) return "";
    const [lid, p] = ref; const L = lecById(lid); if (!L) return "";
    const a = window.PUBLIC ? null : ALIGN[lid]?.pages?.[p];
    return `<a href="#lec/${lid}/${p}">📖 ${esc(L.short || L.title)} 第 ${p} 頁</a>${a ? ` <span class="pill">🎧 ${fmt(a.s)}</span>` : ""}`;
  }

  // ---------- 單題元件 ----------
  function renderQ(q, host, opts = {}) {
    const box = document.createElement("div"); box.className = "card q";
    const L = lecById(q.lec);
    box.innerHTML = `<div class="small muted">${opts.num ? `第 ${opts.num} 題　` : ""}<span class="pill">${esc(q.lv)}</span>${L ? `<span class="pill warn">${esc(L.short)}</span>` : ""}</div>
      <div class="stem">${q.q}</div><div class="opts"></div><div class="fb"></div>`;
    const oh = $(".opts", box);
    const order = q.opts.map((_, i) => i);
    if (!q.fixed) for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    order.forEach((i, k) => {
      const b = document.createElement("button"); b.className = "opt";
      b.innerHTML = `${"ABCDE"[k]}. ${q.opts[i]}`;
      b.onclick = () => {
        const ok = i === q.a;
        [...oh.children].forEach((x) => (x.disabled = true));
        b.classList.add(ok ? "right" : "wrong");
        if (!ok) oh.children[order.indexOf(q.a)].classList.add("right");
        recordAnswer(q, ok);
        $(".fb", box).innerHTML = `<div class="explain"><b>${ok ? "✅ 答對" : "❌ 再想想"}</b>　${q.ex}<div class="small" style="margin-top:4px">${refLink(q.ref)}</div></div>`;
        opts.onAnswer && opts.onAnswer(ok);
      };
      oh.appendChild(b);
    });
    host.appendChild(box);
    return box;
  }

  // ---------- 首頁 ----------
  function viewHome() {
    const w = load("wrong", {}), st = load("stats", {});
    const total = allQs().length, done = Object.keys(st).length;
    const badge = (id) => {
      if (id === "wrong") return Object.keys(w).length ? `<span class="pill bad badge">${Object.keys(w).length} 題</span>` : "";
      if (id === "quiz") return `<span class="pill badge">${done}/${total}</span>`;
      if (id === "pre") return load("pre", null) ? `<span class="pill ok badge">已完成</span>` : "";
      return "";
    };
    main.innerHTML = `<div class="card"><h2>${esc(C.title)}</h2><div class="muted">${C.intro}</div>
      <div class="progress" style="margin-top:10px"><div style="width:${total ? (100 * done / total).toFixed(0) : 0}%"></div></div>
      <div class="small muted">已作答 ${done} / ${total} 題</div></div>
      <div class="tiles">${C.tiles.map((t) => `<a class="tile" href="#${t.href}">${badge(t.href)}<div class="ic">${t.icon}</div><div class="tt">${esc(t.title)}</div><div class="ds">${t.desc}</div></a>`).join("")}</div>
      <h3>📚 講義單元</h3>
      <div class="tiles">${C.lectures.map((L) => {
        const al = ALIGN[L.id];
        const aud = window.PUBLIC ? `<span class="pill">公開版：講義與原音僅本機版</span>` : L.audio ? (al ? `<span class="pill ok">🎧 原音已對齊</span>` : `<span class="pill warn">🎧 錄音轉檔中</span>`) : `<span class="pill">無錄音</span>`;
        return `<a class="tile" href="#lec/${L.id}/1"><div class="ic">${L.icon}</div><div class="tt">${esc(L.title)}</div><div class="ds">${esc(L.date)}｜${L.pages} 頁<br>${aud}</div></a>`;
      }).join("")}</div>`;
  }

  // ---------- 前測 ----------
  function viewPre() {
    main.innerHTML = `<div class="card"><h2>🧭 前測診斷</h2><div class="muted">${C.pre.intro}</div></div><div id="pq"></div><div id="pres"></div>`;
    const res = {}; let n = 0;
    C.pre.ids.forEach((id, i) => {
      const q = qById(id);
      renderQ(q, $("#pq"), { num: i + 1, onAnswer: (ok) => {
        res[id] = ok; n++;
        if (n === C.pre.ids.length) showPre(res);
      } });
    });
  }
  function showPre(res) {
    const by = {};
    for (const id in res) { const q = qById(id); (by[q.lec] ||= { ok: 0, n: 0 }); by[q.lec].n++; if (res[id]) by[q.lec].ok++; }
    save("pre", { t: Date.now(), by });
    const rows = C.lectures.filter((L) => by[L.id]).map((L) => {
      const b = by[L.id], r = b.ok / b.n;
      const tag = r === 1 ? `<span class="pill ok">可以跳著看</span>` : r >= .5 ? `<span class="pill warn">挑重點頁看</span>` : `<span class="pill bad">建議從頭看</span>`;
      return `<tr><td>${esc(L.title)}</td><td>${b.ok}/${b.n}</td><td>${tag}</td><td><a href="#lec/${L.id}/1">前往</a></td></tr>`;
    }).join("");
    $("#pres").innerHTML = `<div class="card"><h3>診斷結果</h3><table class="gl-table"><tr><th>單元</th><th>答對</th><th>建議</th><th></th></tr>${rows}</table>
      <p class="small muted">答錯的題目已經放進錯題本，看完講義再回來做一次，連續答對兩次就會自動移出。</p></div>`;
    $("#pres").scrollIntoView({ behavior: "smooth" });
  }

  // ---------- 講義＋原音 ----------
  let audioEl = null, stopAt = null;
  function viewLecPublic(L, page) {
    const keys = L.keys || {};
    const ps = Object.keys(keys).map(Number).sort((a, b) => a - b);
    main.innerHTML = `<div class="card"><h2>${L.icon} ${esc(L.title)}</h2><div class="muted small">${esc(L.date)}｜共 ${L.pages} 頁。公開版不含講義頁面與上課錄音（課程資料不公開），這裡列出各頁重點整理；完整講義與老師原音請用本機版。</div>
      <div class="filters" style="margin-top:8px">${C.lectures.map((x) => `<a class="btn small" href="#lec/${x.id}/1" style="${x.id === L.id ? "border-color:var(--accent)" : ""}">${esc(x.short)}</a>`).join("")}</div></div>
      ${ps.length ? ps.map((p) => `<div class="card" id="kp${p}"><h3 style="margin-top:0">📌 第 ${p} 頁</h3>${keys[p]}${relatedQs(L.id, p).replace('class="card"', 'class=""')}</div>`).join("") : `<div class="card muted">這份講義尚未整理重點。</div>`}`;
    const target = document.getElementById("kp" + page);
    if (target && page > 1) setTimeout(() => target.scrollIntoView({ block: "start" }), 0);
  }
  function viewLec(lid, page) {
    const L = lecById(lid); if (!L) return viewHome();
    if (window.PUBLIC) return viewLecPublic(L, +page || 1);
    page = Math.min(Math.max(1, +page || 1), L.pages);
    const al = ALIGN[lid];
    const notes = load("notes", {});
    const pad = (p) => String(p).padStart(3, "0");
    const thumbs = Array.from({ length: L.pages }, (_, i) => i + 1).map((p) =>
      `<button data-p="${p}" class="${p === page ? "on" : ""}"><img loading="lazy" style="aspect-ratio:${L.ar || "4/3"}" src="pages/${lid}/p${pad(p)}.jpg" alt="第${p}頁"><span class="no">${p}</span>${al?.pages?.[p] ? '<span class="aud">🎧</span>' : ""}${notes[lid + ":" + p] ? '<span class="aud" style="top:22px">📝</span>' : ""}</button>`).join("");
    const pa = al?.pages?.[page];
    const key = (L.keys || {})[page];
    let audioHtml;
    if (!L.audio) audioHtml = `<div class="muted small">這份講義沒有錄音。</div>`;
    else if (!al) audioHtml = `<div class="muted small">錄音正在轉逐字稿、對齊頁碼，完成後這裡會出現「老師講這頁」的原音片段。</div>`;
    else if (!pa) audioHtml = `<div class="muted small">這一頁老師沒有停留講解（或對齊不到），可以用下方完整錄音自行跳轉。</div><audio id="au" controls preload="none" src="${al.audio}"></audio>`;
    else audioHtml = `<div><button class="btn primary" id="playSeg">▶ 播放老師講這頁</button> <span class="pill">${fmt(pa.s)}–${fmt(pa.e)}</span><span class="pill">${Math.round((pa.e - pa.s) / 60)} 分鐘</span></div>
        <audio id="au" controls preload="metadata" src="${al.audio}" style="margin-top:8px"></audio>
        <div class="small muted">播完這頁的段落會自動暫停。速度：<span class="seg" id="rate">${[1, 1.25, 1.5, 1.75, 2].map((r) => `<button data-r="${r}">${r}×</button>`).join("")}</span></div>
        <h3>逐字稿（自動轉錄，術語請以講義為準）</h3><div class="transcript" id="tr">${(pa.lines || []).map(([t, s]) => `<span class="ts" data-t="${t}">[${fmt(t)}]</span> ${esc(s)}`).join("\n")}</div>`;
    main.innerHTML = `<div class="lec-wrap">
      <div class="thumbs" id="thumbs">${thumbs}</div>
      <div>
        <div class="slide-nav"><button class="btn small" id="prev">◀ 上一頁</button><b>${esc(L.title)}　第 ${page} / ${L.pages} 頁</b><button class="btn small" id="next">下一頁 ▶</button></div>
        <div class="slide"><img src="pages/${lid}/p${pad(page)}.jpg" alt="${esc(L.title)} 第${page}頁"></div>
      </div>
      <div class="side">
        ${key ? `<div class="card"><h3 style="margin-top:0">📌 這頁的重點</h3>${key}</div>` : ""}
        <div class="card"><h3 style="margin-top:0">🎧 原音</h3>${audioHtml}</div>
        <div class="card"><h3 style="margin-top:0">📝 我的筆記</h3><textarea class="note" id="note" placeholder="用自己的話寫下：這頁跟我在臨床看到的什麼有關？">${esc(notes[lid + ":" + page] || "")}</textarea>
          <div class="small muted">自動存在這台電腦的瀏覽器裡。</div></div>
        ${relatedQs(lid, page)}
      </div></div>`;
    $("#thumbs").onclick = (e) => { const b = e.target.closest("button"); if (b) location.hash = `lec/${lid}/${b.dataset.p}`; };
    $("#prev").onclick = () => page > 1 && (location.hash = `lec/${lid}/${page - 1}`);
    $("#next").onclick = () => page < L.pages && (location.hash = `lec/${lid}/${page + 1}`);
    $("#thumbs .on")?.scrollIntoView({ block: "nearest", inline: "nearest" });
    $("#note").oninput = (e) => { const n = load("notes", {}); const k = lid + ":" + page; if (e.target.value.trim()) n[k] = e.target.value; else delete n[k]; save("notes", n); };
    audioEl = $("#au"); stopAt = null;
    if (audioEl) {
      const rate = +load("rate", 1); audioEl.playbackRate = rate;
      const rs = $("#rate");
      if (rs) {
        const mark = () => [...rs.children].forEach((b) => b.classList.toggle("on", +b.dataset.r === audioEl.playbackRate));
        mark(); rs.onclick = (e) => { const b = e.target.closest("button"); if (!b) return; audioEl.playbackRate = +b.dataset.r; save("rate", +b.dataset.r); mark(); };
      }
      audioEl.addEventListener("timeupdate", () => { if (stopAt && audioEl.currentTime >= stopAt) { audioEl.pause(); stopAt = null; } });
      const seek = (t, end) => { const go = () => { audioEl.currentTime = t; stopAt = end || null; audioEl.play(); }; if (audioEl.readyState >= 1) go(); else { audioEl.addEventListener("loadedmetadata", go, { once: true }); audioEl.load(); } };
      if (pa) $("#playSeg").onclick = () => seek(pa.s, pa.e);
      const tr = $("#tr"); if (tr) tr.onclick = (e) => { const s = e.target.closest(".ts"); if (s) seek(+s.dataset.t, pa.e); };
    }
  }
  function relatedQs(lid, page) {
    const qs = allQs().filter((q) => q.ref && q.ref[0] === lid && q.ref[1] === page);
    if (!qs.length) return "";
    return `<div class="card"><h3 style="margin-top:0">🧪 這頁的相關題目</h3>${qs.map((q) => `<div class="small">・<a href="#quiz?id=${q.id}">${esc(q.q.replace(/<[^>]+>/g, "").slice(0, 40))}…</a></div>`).join("")}</div>`;
  }

  // ---------- 自我檢測 ----------
  function viewQuiz(params) {
    const only = params.get("id");
    const lvs = ["全部", ...new Set(C.questions.map((q) => q.lv))];
    const lecs = C.lectures.filter((L) => C.questions.some((q) => q.lec === L.id));
    main.innerHTML = `<div class="card"><h2>🧪 分層自我檢測</h2><div class="muted small">三個層次：<b>概念</b>（說得出意義）→ <b>計算</b>（算得出來）→ <b>判讀</b>（看圖表、看情境做判斷）。答錯自動進錯題本。</div></div>
      <div class="filters"><label>單元 <select id="fl"><option value="">全部</option>${lecs.map((L) => `<option value="${L.id}">${esc(L.short)}</option>`).join("")}</select></label>
      <label>層次 <select id="fv">${lvs.map((v) => `<option>${v}</option>`).join("")}</select></label>
      <label><input type="checkbox" id="fu"> 只出沒做過的</label>
      <button class="btn small" id="fgo">重新出題</button></div><div id="qhost"></div>`;
    const run = () => {
      const st = load("stats", {});
      let qs = only ? [qById(only)] : C.questions.filter((q) => (!$("#fl").value || q.lec === $("#fl").value) && ($("#fv").value === "全部" || q.lv === $("#fv").value) && (!$("#fu").checked || !st[q.id]));
      const h = $("#qhost"); h.innerHTML = "";
      if (!qs.length) { h.innerHTML = `<div class="card muted">這個條件下沒有題目了 🎉</div>`; return; }
      let ok = 0, n = 0;
      const score = document.createElement("div"); score.className = "card small"; h.appendChild(score);
      const upd = () => (score.innerHTML = `共 ${qs.length} 題｜已答 ${n}｜答對 ${ok}`); upd();
      qs.forEach((q, i) => renderQ(q, h, { num: i + 1, onAnswer: (r) => { n++; if (r) ok++; upd(); } }));
    };
    ["fl", "fv", "fu"].forEach((id) => ($("#" + id).onchange = run));
    $("#fgo").onclick = run; run();
  }

  // ---------- 臨床情境 ----------
  function viewCase() {
    main.innerHTML = `<div class="card"><h2>🏥 臨床情境題</h2><div class="muted small">${C.caseIntro}</div></div><div id="ch"></div>`;
    const h = $("#ch");
    C.cases.forEach((cs) => {
      const d = document.createElement("details"); d.className = "card";
      d.innerHTML = `<summary><b>${cs.icon || "🩺"} ${esc(cs.title)}</b>　<span class="small muted">${cs.qs.length} 題</span></summary><div class="story" style="margin-top:10px">${cs.story}</div><div class="cq"></div>${cs.debrief ? `<details style="margin-top:8px"><summary>💬 反思：回到自己的臨床</summary><div>${cs.debrief}</div></details>` : ""}`;
      d.addEventListener("toggle", () => { if (d.open && !d.dataset.done) { d.dataset.done = 1; cs.qs.forEach((q, i) => renderQ({ ...q, caseId: cs.id }, $(".cq", d), { num: i + 1 })); } });
      h.appendChild(d);
    });
  }

  // ---------- 錯題本 ----------
  function viewWrong() {
    const w = load("wrong", {});
    const ids = Object.keys(w).sort((a, b) => w[b].n - w[a].n);
    main.innerHTML = `<div class="card"><h2>📕 錯題本</h2><div class="muted small">答錯的題目會留在這裡；<b>連續答對兩次</b>才會移出。每題下方有連回講義頁與錄音時間點的連結，建議先回去看、聽，再作答。</div>
      ${ids.length ? `<button class="btn small" id="clr">全部清空</button>` : ""}</div><div id="wh"></div>`;
    const h = $("#wh");
    if (!ids.length) { h.innerHTML = `<div class="card">目前沒有錯題 👍</div>`; return; }
    ids.forEach((id, i) => {
      const q = qById(id); if (!q) return;
      const c = renderQ(q, h, { num: i + 1 });
      c.querySelector(".small").insertAdjacentHTML("beforeend", `<span class="pill bad">錯 ${w[id].n} 次</span>${w[id].streak ? `<span class="pill ok">已連對 ${w[id].streak}</span>` : ""}`);
      c.querySelector(".stem").insertAdjacentHTML("afterend", `<div class="small" style="margin-bottom:4px">先複習：${refLink(q.ref)}</div>`);
    });
    $("#clr").onclick = () => { save("wrong", {}); viewWrong(); };
  }

  // ---------- 名詞對照 ----------
  function viewGl() {
    main.innerHTML = `<div class="card"><h2>🔤 名詞中英對照</h2><div class="muted small">老師要的是「意義」不是「翻譯」：先遮住右欄，試著用一句話說出意義，再翻開對答案。</div>
      <div class="filters" style="margin-top:8px"><input class="search" id="gs" placeholder="搜尋英文或中文…"><span class="seg" id="gm"><button data-m="t" class="on">對照表</button><button data-m="f">翻卡練習</button></span></div></div><div id="gh"></div>`;
    let mode = "t";
    const draw = () => {
      const k = $("#gs").value.trim().toLowerCase();
      const list = C.glossary.filter((g) => !k || (g.en + g.zh + g.def).toLowerCase().includes(k));
      const h = $("#gh");
      if (mode === "t") {
        h.innerHTML = `<div class="card"><table class="gl-table"><tr><th>英文</th><th>中文</th><th>意義（用自己的話）</th><th>出處</th></tr>${list.map((g) => `<tr><td class="gl-en">${esc(g.en)}</td><td>${esc(g.zh)}</td><td>${g.def}</td><td class="small">${g.ref ? refLink(g.ref) : ""}</td></tr>`).join("")}</table></div>`;
      } else {
        let i = 0, flip = false; const deck = [...list].sort(() => Math.random() - .5);
        const show = () => {
          const g = deck[i]; if (!g) { h.innerHTML = `<div class="card">沒有卡片</div>`; return; }
          h.innerHTML = `<div class="card flash" id="fc"><div>${flip ? `<div>${esc(g.en)}｜${esc(g.zh)}</div><div class="def">${g.def}</div>` : `<div>${esc(g.en)}</div><div class="def muted">（點一下翻面：先說出它的意義）</div>`}</div></div>
            <div class="slide-nav"><button class="btn" id="fp">◀</button><span>${i + 1} / ${deck.length}</span><button class="btn" id="fn">▶</button></div>`;
          $("#fc").onclick = () => { flip = !flip; show(); };
          $("#fp").onclick = () => { i = (i - 1 + deck.length) % deck.length; flip = false; show(); };
          $("#fn").onclick = () => { i = (i + 1) % deck.length; flip = false; show(); };
        };
        show();
      }
    };
    $("#gs").oninput = draw;
    $("#gm").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; mode = b.dataset.m; [...$("#gm").children].forEach((x) => x.classList.toggle("on", x === b)); draw(); };
    draw();
  }

  // ---------- 概念地圖 ----------
  function viewMap() {
    const M = C.map;
    const W = M.w, H = M.h, nw = 138, nh = 38;
    const pos = Object.fromEntries(M.nodes.map((n) => [n.id, n]));
    const edges = M.edges.map(([a, b, lab]) => {
      const A = pos[a], B = pos[b];
      const x1 = A.x, y1 = A.y + nh / 2, x2 = B.x, y2 = B.y - nh / 2, my = (y1 + y2) / 2;
      const d = Math.abs(A.y - B.y) < 5 ? `M${A.x + nw / 2},${A.y} L${B.x - nw / 2},${B.y}` : `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
      return `<path class="edge" d="${d}" marker-end="url(#arr)"/>${lab ? `<text class="elabel" x="${(A.x + B.x) / 2 + 4}" y="${Math.abs(A.y - B.y) < 5 ? A.y - 6 : my}">${esc(lab)}</text>` : ""}`;
    }).join("");
    const nodes = M.nodes.map((n) => {
      const w = n.w || nw;
      return `<g class="node k-${n.k || "leaf"}" data-id="${n.id}"><rect x="${n.x - w / 2}" y="${n.y - nh / 2}" width="${w}" height="${nh}" rx="9"/><text x="${n.x}" y="${n.y + 5}" text-anchor="middle">${esc(n.label)}</text></g>`;
    }).join("");
    main.innerHTML = `<div class="card"><h2>🗺️ 概念地圖</h2><div class="muted small">${M.intro}</div></div>
      <div class="map-wrap"><div class="map-scroll"><svg viewBox="0 0 ${W} ${H}" width="${Math.round(W * 0.8)}" height="${Math.round(H * 0.8)}" role="img" aria-label="概念地圖"><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" style="color:var(--muted)"/></marker></defs>${edges}${nodes}</svg></div>
      <div class="card side" id="mi"><div class="muted">點選任一個方塊，這裡會顯示它的意義、跟其他概念的關係，以及講義出處。</div></div></div>`;
    $(".map-wrap svg").onclick = (e) => {
      const g = e.target.closest(".node"); if (!g) return;
      document.querySelectorAll(".node.on").forEach((x) => x.classList.remove("on")); g.classList.add("on");
      const n = pos[g.dataset.id];
      const rel = M.edges.filter((ed) => ed[0] === n.id || ed[1] === n.id).map(([a, b, l]) => `<li>${esc(pos[a].label)} → ${esc(pos[b].label)}${l ? `（${esc(l)}）` : ""}</li>`).join("");
      $("#mi").innerHTML = `<h3 style="margin-top:0">${esc(n.label)}</h3><div>${n.def || ""}</div>${rel ? `<h3>關係</h3><ul class="small">${rel}</ul>` : ""}${n.ref ? `<div class="small">${refLink(n.ref)}</div>` : ""}`;
    };
  }

  // ---------- 工具（各科自訂） ----------
  function viewTool(id) {
    const T = (window.TOOLS || {})[id];
    if (!T) return viewHome();
    main.innerHTML = "";
    T(main, { $, esc, load, save, toast, refLink, fmt });
  }

  // ---------- 路由 ----------
  function route() {
    if (audioEl) { audioEl.pause(); audioEl = null; }
    const raw = location.hash.slice(1) || "home";
    const [path, qs] = raw.split("?");
    const parts = path.split("/");
    const params = new URLSearchParams(qs || "");
    const crumb = { home: "", pre: "前測診斷", lec: window.PUBLIC ? "講義重點" : "講義＋原音", map: "概念地圖", gl: "名詞對照", quiz: "自我檢測", case: "臨床情境", wrong: "錯題本", tool: "實作" }[parts[0]] || "";
    $("#crumb").textContent = crumb ? "／" + crumb : "";
    window.scrollTo(0, 0);
    switch (parts[0]) {
      case "pre": return viewPre();
      case "lec": return viewLec(parts[1], parts[2]);
      case "map": return viewMap();
      case "gl": return viewGl();
      case "quiz": return viewQuiz(params);
      case "case": return viewCase();
      case "wrong": return viewWrong();
      case "tool": return viewTool(parts[1]);
      default: return viewHome();
    }
  }
  window.addEventListener("hashchange", route);
  $("#themeBtn").onclick = () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const nx = cur === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = nx;
    try { localStorage.setItem("c115:theme", nx); } catch (e) {}
  };
  try { const t = localStorage.getItem("c115:theme"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
  route();
})();
