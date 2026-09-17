/* 生物統計 互動工具：平均數 vs 中位數、機率分布探索器、線上 R（webR） */
window.TOOLS = window.TOOLS || {};
(function () {
  const SCORES_CSV = "depart,scores\npharmacy,78\npharmacy,64\npharmacy,76\npharmacy,75\npharmacy,0\npharmacy,40\npharmacy,93\npharmacy,69\npharmacy,55\npharmacy,52\npharmacy,51\npharmacy,72\npharmacy,73\npharmacy,73\npharmacy,88\npharmacy,50\npharmacy,94\npharmacy,65\npharmacy,62\npharmacy,65\npharmacy,83\npharmacy,56\npharmacy,88\npharmacy,51\npharmacy,75\npharmacy,49\npharmacy,75\npharmacy,55\npharmacy,66\npharmacy,52\npharmacy,39\npharmacy,44\npharmacy,88\npharmacy,55\npharmacy,61\npharmacy,64\npharmacy,78\npharmacy,57\npharmacy,50\npharmacy,92\npharmacy,47\npharmacy,73\npharmacy,80\npharmacy,93\npharmacy,90\npharmacy,64\npharmacy,81\npharmacy,54\npharmacy,67\npharmacy,54\npharmacy,57\npharmacy,99\npharmacy,50\npharmacy,42\npharmacy,64\npharmacy,80\nNursing,51\nNursing,65\nNursing,76\nNursing,72\nNursing,67\nNursing,68\nNursing,94\nNursing,98\nNursing,99\nNursing,61\nNursing,60\nNursing,99\nNursing,51\nNursing,89\nNursing,60\nNursing,99\nNursing,73\nNursing,75\nNursing,77\nNursing,89\nNursing,90\nNursing,79\nNursing,82\nNursing,45\nNursing,82\nNursing,50\nNursing,52\nNursing,69\nNursing,68\nNursing,89\nMLSB,55\nMLSB,60\nMLSB,91\nMLSB,54\nMLSB,59\nMLSB,99\nMLSB,61\nMLSB,86\nMLSB,88\nMLSB,84\nMLSB,78\nMLSB,73\nMLSB,94\nMLSB,46\nMLSB,43\nMLSB,66\nMLSB,66\nMLSB,70\nMLSB,83\nMLSB,86\nMLSB,75\nMLSB,53\nMLSB,99\nMLSB,57\nMLSB,76\nMLSB,71\nMLSB,52\nMLSB,39\nDentistry,48\nDentistry,58\nDentistry,53\nDentistry,57\nDentistry,95\nDentistry,84\nBiotechnology,83\nBiotechnology,44\nBiotechnology,94\nBiotechnology,65\nBiotechnology,84\nPublic Health,84\nPublic Health,95\nPublic Health,72\nPublic Health,80\n";
  const BMI_CSV = "ID,depart,BMI\n1,A,25.3\n2,A,29.8\n3,A,17.2\n4,A,26.6\n5,A,17.8\n6,A,22.4\n7,A,23.6\n8,A,20.7\n9,A,25.8\n10,A,20.5\n11,A,21.8\n12,A,29.2\n13,A,25.3\n14,A,20.4\n15,A,20.2\n16,A,22.0\n17,A,27.2\n18,A,19.3\n19,A,23.4\n20,A,17.5\n21,A,23.6\n22,A,27.1\n23,A,23.1\n24,A,19.0\n25,A,25.5\n26,A,20.0\n27,A,25.9\n28,A,23.3\n29,A,22.2\n30,A,22.4\n31,A,23.9\n32,A,27.2\n33,A,22.2\n34,A,23.9\n35,A,24.7\n36,A,22.6\n37,A,22.6\n38,A,25.6\n39,A,25.1\n40,A,22.5\n41,A,20.2\n42,A,22.6\n43,A,28.0\n44,A,23.1\n45,A,20.0\n46,A,18.3\n47,A,23.4\n48,A,18.9\n49,A,21.0\n50,A,26.7\n51,B,20.2\n52,B,27.7\n53,B,21.8\n54,B,18.2\n55,B,25.4\n56,B,24.0\n57,B,24.3\n58,B,27.4\n59,B,26.9\n60,B,19.0\n61,B,22.4\n62,B,21.7\n63,B,32.0\n64,B,22.1\n65,B,28.6\n66,B,26.2\n67,B,22.0\n68,B,22.2\n69,B,20.9\n70,B,26.5\n71,B,23.9\n72,B,19.9\n73,B,20.5\n74,B,23.1\n75,B,22.3\n76,B,20.5\n77,B,24.9\n78,B,22.6\n79,C,21.7\n80,C,23.2\n81,C,24.0\n82,C,17.7\n83,C,22.7\n84,C,15.5\n85,C,18.2\n86,C,21.1\n87,C,18.4\n88,C,22.1\n89,C,24.5\n90,C,22.7\n91,C,19.0\n92,C,16.9\n93,C,27.1\n94,C,26.2\n95,C,20.0\n96,C,23.0\n97,C,22.8\n98,C,23.3\n99,D,23.8\n100,D,20.9\n101,D,22.8\n102,D,23.6\n103,D,18.9\n104,D,24.4\n105,D,20.9\n106,D,17.9\n107,D,24.7\n108,D,24.8\n109,D,31.1\n110,D,25.3\n111,D,17.6\n112,D,19.7\n113,E,19.5\n114,E,21.0\n115,E,22.0\n116,E,27.7\n117,E,28.3\n118,E,20.6\n119,E,23.3\n120,E,16.9\n121,E,24.2\n122,E,20.6\n123,F,19.4\n124,F,21.5\n125,F,18.8\n126,F,17.5\n127,F,25.5\n128,F,27.1\n129,F,24.6\n";
  const EXTRA_FILES = {"scores.txt": "ZGVwYXJ0CXNjb3Jlcw0KcGhhcm1hY3kJNzgNCnBoYXJtYWN5CTY0DQpwaGFybWFjeQk3Ng0KcGhhcm1hY3kJNzUNCnBoYXJtYWN5CTANCnBoYXJtYWN5CTQwDQpwaGFybWFjeQk5Mw0KcGhhcm1hY3kJNjkNCnBoYXJtYWN5CTU1DQpwaGFybWFjeQk1Mg0KcGhhcm1hY3kJNTENCnBoYXJtYWN5CTcyDQpwaGFybWFjeQk3Mw0KcGhhcm1hY3kJNzMNCnBoYXJtYWN5CTg4DQpwaGFybWFjeQk1MA0KcGhhcm1hY3kJOTQNCnBoYXJtYWN5CTY1DQpwaGFybWFjeQk2Mg0KcGhhcm1hY3kJNjUNCnBoYXJtYWN5CTgzDQpwaGFybWFjeQk1Ng0KcGhhcm1hY3kJODgNCnBoYXJtYWN5CTUxDQpwaGFybWFjeQk3NQ0KcGhhcm1hY3kJNDkNCnBoYXJtYWN5CTc1DQpwaGFybWFjeQk1NQ0KcGhhcm1hY3kJNjYNCnBoYXJtYWN5CTUyDQpwaGFybWFjeQkzOQ0KcGhhcm1hY3kJNDQNCnBoYXJtYWN5CTg4DQpwaGFybWFjeQk1NQ0KcGhhcm1hY3kJNjENCnBoYXJtYWN5CTY0DQpwaGFybWFjeQk3OA0KcGhhcm1hY3kJNTcNCnBoYXJtYWN5CTUwDQpwaGFybWFjeQk5Mg0KcGhhcm1hY3kJNDcNCnBoYXJtYWN5CTczDQpwaGFybWFjeQk4MA0KcGhhcm1hY3kJOTMNCnBoYXJtYWN5CTkwDQpwaGFybWFjeQk2NA0KcGhhcm1hY3kJODENCnBoYXJtYWN5CTU0DQpwaGFybWFjeQk2Nw0KcGhhcm1hY3kJNTQNCnBoYXJtYWN5CTU3DQpwaGFybWFjeQk5OQ0KcGhhcm1hY3kJNTANCnBoYXJtYWN5CTQyDQpwaGFybWFjeQk2NA0KcGhhcm1hY3kJODANCk51cnNpbmcJNTENCk51cnNpbmcJNjUNCk51cnNpbmcJNzYNCk51cnNpbmcJNzINCk51cnNpbmcJNjcNCk51cnNpbmcJNjgNCk51cnNpbmcJOTQNCk51cnNpbmcJOTgNCk51cnNpbmcJOTkNCk51cnNpbmcJNjENCk51cnNpbmcJNjANCk51cnNpbmcJOTkNCk51cnNpbmcJNTENCk51cnNpbmcJODkNCk51cnNpbmcJNjANCk51cnNpbmcJOTkNCk51cnNpbmcJNzMNCk51cnNpbmcJNzUNCk51cnNpbmcJNzcNCk51cnNpbmcJODkNCk51cnNpbmcJOTANCk51cnNpbmcJNzkNCk51cnNpbmcJODINCk51cnNpbmcJNDUNCk51cnNpbmcJODINCk51cnNpbmcJNTANCk51cnNpbmcJNTINCk51cnNpbmcJNjkNCk51cnNpbmcJNjgNCk51cnNpbmcJODkNCk1MU0IJNTUNCk1MU0IJNjANCk1MU0IJOTENCk1MU0IJNTQNCk1MU0IJNTkNCk1MU0IJOTkNCk1MU0IJNjENCk1MU0IJODYNCk1MU0IJODgNCk1MU0IJODQNCk1MU0IJNzgNCk1MU0IJNzMNCk1MU0IJOTQNCk1MU0IJNDYNCk1MU0IJNDMNCk1MU0IJNjYNCk1MU0IJNjYNCk1MU0IJNzANCk1MU0IJODMNCk1MU0IJODYNCk1MU0IJNzUNCk1MU0IJNTMNCk1MU0IJOTkNCk1MU0IJNTcNCk1MU0IJNzYNCk1MU0IJNzENCk1MU0IJNTINCk1MU0IJMzkNCkRlbnRpc3RyeQk0OA0KRGVudGlzdHJ5CTU4DQpEZW50aXN0cnkJNTMNCkRlbnRpc3RyeQk1Nw0KRGVudGlzdHJ5CTk1DQpEZW50aXN0cnkJODQNCkJpb3RlY2hub2xvZ3kJODMNCkJpb3RlY2hub2xvZ3kJNDQNCkJpb3RlY2hub2xvZ3kJOTQNCkJpb3RlY2hub2xvZ3kJNjUNCkJpb3RlY2hub2xvZ3kJODQNClB1YmxpY0hlYWx0aAk4NA0KUHVibGljSGVhbHRoCTk1DQpQdWJsaWNIZWFsdGgJNzINClB1YmxpY0hlYWx0aAk4MA0K", "bmi.txt": "SUQJZGVwYXJ0CUJNSQ0KMQlBCTI1LjMNCjIJQQkyOS44DQozCUEJMTcuMg0KNAlBCTI2LjYNCjUJQQkxNy44DQo2CUEJMjIuNA0KNwlBCTIzLjYNCjgJQQkyMC43DQo5CUEJMjUuOA0KMTAJQQkyMC41DQoxMQlBCTIxLjgNCjEyCUEJMjkuMg0KMTMJQQkyNS4zDQoxNAlBCTIwLjQNCjE1CUEJMjAuMg0KMTYJQQkyMi4wDQoxNwlBCTI3LjINCjE4CUEJMTkuMw0KMTkJQQkyMy40DQoyMAlBCTE3LjUNCjIxCUEJMjMuNg0KMjIJQQkyNy4xDQoyMwlBCTIzLjENCjI0CUEJMTkuMA0KMjUJQQkyNS41DQoyNglBCTIwLjANCjI3CUEJMjUuOQ0KMjgJQQkyMy4zDQoyOQlBCTIyLjINCjMwCUEJMjIuNA0KMzEJQQkyMy45DQozMglBCTI3LjINCjMzCUEJMjIuMg0KMzQJQQkyMy45DQozNQlBCTI0LjcNCjM2CUEJMjIuNg0KMzcJQQkyMi42DQozOAlBCTI1LjYNCjM5CUEJMjUuMQ0KNDAJQQkyMi41DQo0MQlBCTIwLjINCjQyCUEJMjIuNg0KNDMJQQkyOC4wDQo0NAlBCTIzLjENCjQ1CUEJMjAuMA0KNDYJQQkxOC4zDQo0NwlBCTIzLjQNCjQ4CUEJMTguOQ0KNDkJQQkyMS4wDQo1MAlBCTI2LjcNCjUxCUIJMjAuMg0KNTIJQgkyNy43DQo1MwlCCTIxLjgNCjU0CUIJMTguMg0KNTUJQgkyNS40DQo1NglCCTI0LjANCjU3CUIJMjQuMw0KNTgJQgkyNy40DQo1OQlCCTI2LjkNCjYwCUIJMTkuMA0KNjEJQgkyMi40DQo2MglCCTIxLjcNCjYzCUIJMzIuMA0KNjQJQgkyMi4xDQo2NQlCCTI4LjYNCjY2CUIJMjYuMg0KNjcJQgkyMi4wDQo2OAlCCTIyLjINCjY5CUIJMjAuOQ0KNzAJQgkyNi41DQo3MQlCCTIzLjkNCjcyCUIJMTkuOQ0KNzMJQgkyMC41DQo3NAlCCTIzLjENCjc1CUIJMjIuMw0KNzYJQgkyMC41DQo3NwlCCTI0LjkNCjc4CUIJMjIuNg0KNzkJQwkyMS43DQo4MAlDCTIzLjINCjgxCUMJMjQuMA0KODIJQwkxNy43DQo4MwlDCTIyLjcNCjg0CUMJMTUuNQ0KODUJQwkxOC4yDQo4NglDCTIxLjENCjg3CUMJMTguNA0KODgJQwkyMi4xDQo4OQlDCTI0LjUNCjkwCUMJMjIuNw0KOTEJQwkxOS4wDQo5MglDCTE2LjkNCjkzCUMJMjcuMQ0KOTQJQwkyNi4yDQo5NQlDCTIwLjANCjk2CUMJMjMuMA0KOTcJQwkyMi44DQo5OAlDCTIzLjMNCjk5CUQJMjMuOA0KMTAwCUQJMjAuOQ0KMTAxCUQJMjIuOA0KMTAyCUQJMjMuNg0KMTAzCUQJMTguOQ0KMTA0CUQJMjQuNA0KMTA1CUQJMjAuOQ0KMTA2CUQJMTcuOQ0KMTA3CUQJMjQuNw0KMTA4CUQJMjQuOA0KMTA5CUQJMzEuMQ0KMTEwCUQJMjUuMw0KMTExCUQJMTcuNg0KMTEyCUQJMTkuNw0KMTEzCUUJMTkuNQ0KMTE0CUUJMjEuMA0KMTE1CUUJMjIuMA0KMTE2CUUJMjcuNw0KMTE3CUUJMjguMw0KMTE4CUUJMjAuNg0KMTE5CUUJMjMuMw0KMTIwCUUJMTYuOQ0KMTIxCUUJMjQuMg0KMTIyCUUJMjAuNg0KMTIzCUYJMTkuNA0KMTI0CUYJMjEuNQ0KMTI1CUYJMTguOA0KMTI2CUYJMTcuNQ0KMTI3CUYJMjUuNQ0KMTI4CUYJMjcuMQ0KMTI5CUYJMjQuNg0K", "scores.xlsx": "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", "bmi.xlsx": "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"};   // { 檔名: base64 }：scores.txt、bmi.txt、scores.xlsx、bmi.xlsx
  const NS = "http://www.w3.org/2000/svg";

  // ---------- 共用：簡易 SVG 圖 ----------
  function chart(el, { W = 640, H = 300, xmin, xmax, ymax, xticks = [], yfmt = (v) => v.toFixed(2) }) {
    const P = { l: 46, r: 12, t: 12, b: 30 };
    const sx = (x) => P.l + (x - xmin) / (xmax - xmin) * (W - P.l - P.r);
    const sy = (y) => H - P.b - y / ymax * (H - P.t - P.b);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}">`;
    s += `<line x1="${P.l}" y1="${H - P.b}" x2="${W - P.r}" y2="${H - P.b}" stroke="currentColor" opacity=".35"/>`;
    for (let i = 0; i <= 4; i++) { const v = ymax * i / 4; s += `<line x1="${P.l}" x2="${W - P.r}" y1="${sy(v)}" y2="${sy(v)}" stroke="currentColor" opacity=".08"/><text x="${P.l - 6}" y="${sy(v) + 4}" text-anchor="end">${yfmt(v)}</text>`; }
    xticks.forEach((t) => (s += `<text x="${sx(t)}" y="${H - P.b + 18}" text-anchor="middle">${+t.toFixed(2)}</text>`));
    return { sx, sy, W, H, P, head: s };
  }

  // ---------- 平均數 vs 中位數 ----------
  TOOLS.center = function (main, U) {
    const base = [4, 5, 5, 6, 6, 6, 7, 7, 8, 8, 9];
    main.innerHTML = `<div class="card"><h2>⚖️ 平均數 vs 中位數</h2><div class="muted small">情境：11 位化療病人的住院天數。把最後一位病人的天數往右拉（併發敗血症），看平均數和中位數各自怎麼動。對應講義：描述統計第 34、38 頁。</div></div>
      <div class="card"><div class="ctrl"><label>第 11 位住院天數</label><input type="range" id="ov" min="9" max="60" value="9"><output id="ovo">9</output></div>
      <div id="cv"></div><div class="kv" id="ck"></div>
      <p class="small muted" id="cmsg"></p></div>`;
    const draw = () => {
      const v = +U.$("#ov").value; U.$("#ovo").textContent = v;
      const d = base.slice(0, 10).concat([v]).sort((a, b) => a - b);
      const mean = d.reduce((a, b) => a + b, 0) / d.length, med = d[5];
      const sd = Math.sqrt(d.reduce((a, b) => a + (b - mean) ** 2, 0) / (d.length - 1));
      const q1 = d[2], q3 = d[8], iqr = q3 - q1;
      const c = chart(null, { W: 700, H: 200, xmin: 0, xmax: 62, ymax: 4, xticks: [0, 10, 20, 30, 40, 50, 60], yfmt: () => "" });
      let s = c.head; const cnt = {};
      d.forEach((x) => { cnt[x] = (cnt[x] || 0) + 1; s += `<circle cx="${c.sx(x)}" cy="${c.sy(cnt[x] - .5)}" r="9" fill="var(--accent)" opacity=".75"/>`; });
      s += `<line x1="${c.sx(mean)}" x2="${c.sx(mean)}" y1="10" y2="${c.H - 30}" stroke="var(--bad)" stroke-width="3"/><text x="${c.sx(mean) + 4}" y="22" style="fill:var(--bad)">平均 ${mean.toFixed(1)}</text>`;
      s += `<line x1="${c.sx(med)}" x2="${c.sx(med)}" y1="10" y2="${c.H - 30}" stroke="var(--ok)" stroke-width="3" stroke-dasharray="6 4"/><text x="${c.sx(med) + 4}" y="40" style="fill:var(--ok)">中位 ${med}</text>`;
      s += `<line x1="${c.sx(q3 + 1.5 * iqr)}" x2="${c.sx(q3 + 1.5 * iqr)}" y1="50" y2="${c.H - 30}" stroke="var(--warn)" stroke-dasharray="3 3"/><text x="${c.sx(q3 + 1.5 * iqr) + 4}" y="62" style="fill:var(--warn)">離群界線</text>`;
      U.$("#cv").innerHTML = s + "</svg>";
      U.$("#ck").innerHTML = `<div>平均數<b>${mean.toFixed(2)}</b></div><div>中位數<b>${med}</b></div><div>標準差<b>${sd.toFixed(2)}</b></div><div>IQR<b>${iqr}</b></div>`;
      U.$("#cmsg").textContent = v > q3 + 1.5 * iqr ? `第 11 位已經超過 Q3＋1.5×IQR＝${q3 + 1.5 * iqr}，在盒形圖上會是單獨一點。平均數被拉高了 ${(mean - med).toFixed(1)} 天，中位數完全沒動。` : "目前沒有離群值，平均數和中位數很接近。";
    };
    U.$("#ov").oninput = draw; draw();
  };

  // ---------- 機率分布探索器 ----------
  const lgam = (n) => { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; };
  const dbinom = (k, n, p) => Math.exp(lgam(n) - lgam(k) - lgam(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  const dpois = (k, l) => Math.exp(-l + k * Math.log(l) - lgam(k));
  const dnorm = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  function pnorm(z) { // Abramowitz-Stegun 近似
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }
  TOOLS.dist = function (main, U) {
    const S = { kind: "binom", n: 10, p: 0.5, lam: 2, mu: 162, sd: 5, a: 157, b: 167 };
    main.innerHTML = `<div class="card"><h2>🎲 機率分布探索器</h2><div class="muted small">拉動參數看形狀怎麼變，並設定區間 [a, b] 算機率（藍色）。每個分布下方都附上對應的 R 指令，可以到「線上跑 R」驗算。</div>
      <div style="margin-top:8px"><span class="seg" id="dk"><button data-k="binom">二項</button><button data-k="pois">卜瓦松</button><button data-k="norm">常態</button></span></div></div>
      <div class="card"><div class="ctrl" id="dc"></div><div id="dv"></div><div class="kv" id="dkv"></div><p class="small" id="dr"></p><p class="small muted" id="dh"></p></div>`;
    const ctrls = {
      binom: [["n", "試驗次數 n", 1, 200, 1], ["p", "成功機率 p", 0.005, 0.995, 0.005], ["a", "區間 a", 0, 10, 1], ["b", "區間 b", 0, 10, 1]],
      pois: [["lam", "平均次數 λ", 0.2, 20, 0.1], ["a", "區間 a", 0, 40, 1], ["b", "區間 b", 0, 40, 1]],
      norm: [["mu", "平均數 μ", 100, 200, 1], ["sd", "標準差 σ", 1, 20, 0.5], ["a", "區間 a", 80, 240, 0.5], ["b", "區間 b", 80, 240, 0.5]],
    };
    const hints = {
      binom: "n 大、p 小時形狀會像卜瓦松；np 與 nq 都 ≥5 時會接近常態（講義第 67–68 頁）。試試 n=100、p=0.02。",
      pois: "卜瓦松的平均數＝變異數＝λ。λ 越大越對稱、越像常態（第 70 頁）。病房每月跌倒 2 件，就設 λ=2。",
      norm: "σ 變大曲線變矮變寬，但曲線下總面積永遠是 1。試著把 a、b 設成 μ±1.96σ，機率應該接近 95%。",
    };
    const setup = () => {
      U.$("#dc").innerHTML = ctrls[S.kind].map(([k, lab, mn, mx, st]) => {
        if (S.kind === "binom" && (k === "a" || k === "b")) mx = S.n;
        return `<label>${lab}</label><input type="range" data-k="${k}" min="${mn}" max="${mx}" step="${st}" value="${S[k]}"><output id="o_${k}">${S[k]}</output>`;
      }).join("");
      [...U.$("#dk").children].forEach((b) => b.classList.toggle("on", b.dataset.k === S.kind));
      U.$("#dh").textContent = "💡 " + hints[S.kind];
      draw();
    };
    const draw = () => {
      const k = S.kind; let s, prob, mean, vr, code;
      if (k === "norm") {
        const lo = S.mu - 4 * S.sd, hi = S.mu + 4 * S.sd, ymax = dnorm(S.mu, S.mu, S.sd) * 1.1;
        const c = chart(null, { xmin: lo, xmax: hi, ymax, xticks: [-3, -2, -1, 0, 1, 2, 3].map((z) => S.mu + z * S.sd), yfmt: (v) => v.toFixed(3) });
        s = c.head; let path = "", area = "";
        const a = Math.max(lo, Math.min(S.a, S.b)), b = Math.min(hi, Math.max(S.a, S.b));
        for (let i = 0; i <= 200; i++) { const x = lo + (hi - lo) * i / 200; path += (i ? "L" : "M") + c.sx(x) + "," + c.sy(dnorm(x, S.mu, S.sd)); }
        if (b > a) { area = `M${c.sx(a)},${c.sy(0)}`; for (let i = 0; i <= 80; i++) { const x = a + (b - a) * i / 80; area += `L${c.sx(x)},${c.sy(dnorm(x, S.mu, S.sd))}`; } area += `L${c.sx(b)},${c.sy(0)}Z`; }
        s += `<path d="${area}" fill="var(--accent)" opacity=".3"/><path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>`;
        prob = pnorm((Math.max(S.a, S.b) - S.mu) / S.sd) - pnorm((Math.min(S.a, S.b) - S.mu) / S.sd);
        mean = S.mu; vr = S.sd ** 2;
        code = `pnorm(${Math.max(S.a, S.b)}, mean=${S.mu}, sd=${S.sd}) - pnorm(${Math.min(S.a, S.b)}, mean=${S.mu}, sd=${S.sd})`;
        U.$("#dr").innerHTML = `Z 值：a → ${((Math.min(S.a, S.b) - S.mu) / S.sd).toFixed(2)}，b → ${((Math.max(S.a, S.b) - S.mu) / S.sd).toFixed(2)}`;
      } else {
        const N = k === "binom" ? S.n : Math.max(10, Math.ceil(S.lam + 4 * Math.sqrt(S.lam) + 2));
        const f = (x) => (k === "binom" ? dbinom(x, S.n, S.p) : dpois(x, S.lam));
        const ys = Array.from({ length: N + 1 }, (_, x) => f(x));
        const ymax = Math.max(...ys) * 1.15;
        const step = Math.ceil(N / 10);
        const c = chart(null, { xmin: -0.5, xmax: N + 0.5, ymax, xticks: Array.from({ length: Math.floor(N / step) + 1 }, (_, i) => i * step) });
        s = c.head; const bw = Math.max(1, (c.sx(1) - c.sx(0)) * 0.7);
        const a = Math.min(S.a, S.b), b = Math.max(S.a, S.b);
        prob = 0;
        ys.forEach((y, x) => { const inR = x >= a && x <= b; if (inR) prob += y; s += `<rect x="${c.sx(x) - bw / 2}" y="${c.sy(y)}" width="${bw}" height="${c.sy(0) - c.sy(y)}" fill="${inR ? "var(--accent)" : "var(--muted)"}" opacity="${inR ? .85 : .35}"/>`; });
        mean = k === "binom" ? S.n * S.p : S.lam; vr = k === "binom" ? S.n * S.p * (1 - S.p) : S.lam;
        code = k === "binom" ? `sum(dbinom(${a}:${b}, size=${S.n}, prob=${S.p}))` : `sum(dpois(${a}:${b}, lambda=${S.lam}))`;
        U.$("#dr").innerHTML = k === "binom" ? `np＝${(S.n * S.p).toFixed(2)}、nq＝${(S.n * (1 - S.p)).toFixed(2)}${S.n * S.p >= 5 && S.n * (1 - S.p) >= 5 ? "　✅ 可用常態近似" : "　⚠️ 常態近似不適合"}${S.n > 100 && S.p < 0.01 ? "　✅ 可用卜瓦松近似" : ""}` : "";
      }
      U.$("#dv").innerHTML = s + "</svg>";
      U.$("#dkv").innerHTML = `<div>P(a ≤ X ≤ b)<b>${(prob * 100).toFixed(2)}%</b></div><div>期望值 E(X)<b>${(+mean).toFixed(2)}</b></div><div>變異數 Var(X)<b>${(+vr).toFixed(2)}</b></div><div>R 驗算<code class="small" style="display:block;word-break:break-all">${code}</code></div>`;
    };
    U.$("#dk").onclick = (e) => {
      const b = e.target.closest("button"); if (!b) return; S.kind = b.dataset.k;
      if (S.kind === "norm") { S.a = S.mu - S.sd; S.b = S.mu + S.sd; } else if (S.kind === "binom") { S.a = 4; S.b = 6; } else { S.a = 6; S.b = 40; }
      setup();
    };
    U.$("#dc").oninput = (e) => {
      const k = e.target.dataset.k; if (!k) return; S[k] = +e.target.value; U.$("#o_" + k).textContent = e.target.value;
      if (S.kind === "binom" && k === "n") {
        // 區間上限跟著 n 走
        ["a", "b"].forEach((x) => { const el = U.$(`#dc input[data-k="${x}"]`); el.max = S.n; if (S[x] > S.n) { S[x] = S.n; el.value = S.n; U.$("#o_" + x).textContent = S.n; } });
      }
      draw();
    };
    S.a = 4; S.b = 6; setup();
  };

  // ---------- 線上 R（webR） ----------
  const EX = [
    { t: "01-1 變數與資料型態", lec: ["bio_lab1", 21], code: `# 正確賦值
s <- 90
v <- 20 + 70
sv <- 1 + 2 + 3
s; v; sv

# 變數類型：試著猜猜看每一行的 class
z1 <- c(10, 20, 30)
Z3 <- c("男", "女")
z4 <- c("10", "20", "30")
z5 <- c(10, "男")
class(z1); class(Z3); class(z4); class(z5)
length(z1)

# 把下一行前面的 # 拿掉再執行，看看錯誤訊息
# 5s <- 90` },
    { t: "01-2 讀取檔案", lec: ["bio_lab1", 24], code: `# 瀏覽器版已經把 scores.csv、bmi.csv 放在工作資料夾
getwd()
list.files()
d2 <- read.csv("scores.csv", header = TRUE)
head(d2)
# 課堂用 readxl::read_xlsx("scores.xlsx")，結果相同；
# 這裡用 csv 版本，省去安裝套件的時間` },
    { t: "01-3 描述性統計", lec: ["bio_lab1", 32], code: `d1 <- read.csv("scores.csv")
dim(d1); colnames(d1); str(d1)
d1$depart <- as.factor(d1$depart)
levels(d1$depart)
table(d1$depart)

mean(d1$scores); median(d1$scores)
var(d1$scores);  sd(d1$scores)
quantile(d1$scores)
range(d1$scores)
# 眾數
names(table(d1$scores))[which.max(table(d1$scores))]
summary(d1$scores)` },
    { t: "01-4 作圖", lec: ["bio_lab1", 37], code: `d1 <- read.csv("scores.csv")
hist(d1$scores, main = "Histogram of Scores", xlab = "Score",
     xlim = c(0, 100), ylim = c(0, 40),
     col = "navajowhite", border = "navajowhite3", breaks = 10)

boxplot(d1$scores, main = "Box plot of Scores", ylab = "Score", col = "aquamarine")

depart.t <- table(d1$depart)
barplot(depart.t, main = "Number of Students by Department",
        ylim = c(0, 60), cex.names = 0.6,
        col = c("#F6B6D2","#F6B6D2","#EE91BA","#E568A4","#D9438C","#B52D70"))

pie(depart.t, main = "Distribution of Students by Department")` },
    { t: "02 Q1 擲骰子 1000 次", lec: ["bio_lab2", 3], code: `set.seed(42)
die_rolls <- sample(x = 1:6, size = 1000, replace = TRUE)
frequency_die <- table(die_rolls)
frequency_die
relative_frequencies <- frequency_die / 1000
cat("擲出 3 的機率：", relative_frequencies[3], "\\n")
barplot(relative_frequencies, main = "骰子各點的機率", xlab = "點數", ylab = "機率")
# 試試看：把 1000 改成 30，機率會離 1/6 多遠？` },
    { t: "02 Q3 二項分布", lec: ["bio_lab2", 5], code: `x <- 0:10
y <- dbinom(x, size = 10, p = 0.5)
round(y, 3)
plot(x, y, type = "h", lwd = 4, xlab = "正面次數", ylab = "Probability", main = "丟十次銅板")
dbinom(5, 10, 0.5)   # 剛好 5 次正面` },
    { t: "02 Q4–Q5 卜瓦松分布", lec: ["bio_lab2", 6], code: `x <- 0:10
y <- dpois(x, lambda = 1)
plot(x, y, type = "h", lwd = 4, xlab = "一週故障次數", ylab = "Probability")

x <- 0:20
plot(x, dpois(x, lambda = 10), type = "h", lwd = 4, xlab = "每月車禍次數", ylab = "Probability")
ppois(16, lambda = 10)          # P(X <= 16)
1 - ppois(5, lambda = 2)        # 臨床情境：每月平均 2 件跌倒，出現 6 件以上的機率` },
    { t: "02 Q6–Q8 常態與均勻", lec: ["bio_lab2", 7], code: `x <- seq(-3, 3, by = 0.1)
plot(x, dnorm(x, 0, 1), type = "l", lwd = 2, ylab = "Density", main = "標準常態")

x <- seq(142, 182, by = 1)
plot(x, dnorm(x, mean = 162, sd = 5), type = "l", lwd = 2, main = "女生身高 N(162, 5^2)")
pnorm(167, 162, 5) - pnorm(157, 162, 5)   # μ±1σ

x <- seq(5, 25, by = 0.1)
plot(x, dunif(x, min = 10, max = 20), type = "l", lwd = 2, main = "喝飲料時間 U(10, 20)")` },
    { t: "自己練：bmi.csv 分組比較", lec: ["bio_L1", 51], code: `b <- read.csv("bmi.csv")
str(b)
table(b$depart)
tapply(b$BMI, b$depart, median)
boxplot(BMI ~ depart, data = b, col = "lightblue", main = "各組 BMI")
# 問題：哪一組的中位數最高？哪一組有離群值？` },
  ];
  let webRP = null;
  function getWebR(log) {
    if (!webRP) webRP = (async () => {
      log("載入 webR 中（第一次約 10–30 秒，需要網路）…");
      const { WebR } = await import("https://webr.r-wasm.org/latest/webr.mjs");
      const w = new WebR();
      await w.init();
      const enc = new TextEncoder();
      await w.FS.writeFile("/home/web_user/scores.csv", enc.encode(SCORES_CSV));
      await w.FS.writeFile("/home/web_user/bmi.csv", enc.encode(BMI_CSV));
      for (const [name, b64] of Object.entries(EXTRA_FILES)) {
        await w.FS.writeFile("/home/web_user/" + name, Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
      }
      // 讓課堂寫法 install.packages() 在瀏覽器版也能用
      await w.evalRVoid("webr::shim_install()");
      return w;
    })();
    return webRP;
  }
  // 共用 R 執行器（給「R 語法逐行教學」用）
  async function runR(code, opts = {}) {
    const w = await getWebR(opts.log || (() => {}));
    const sh = await new w.Shelter();
    try {
      // 每次從乾淨環境開始，避免沿用上一次留下的變數而誤判正確
      if (opts.fresh) await w.evalRVoid("rm(list = ls(envir = globalenv()), envir = globalenv())");
      // 用到 readxl 時先幫忙裝好（瀏覽器版每次開頁面都要重新下載）
      if (/readxl|read_xlsx/.test(code)) await w.evalRVoid('if (!requireNamespace("readxl", quietly = TRUE)) webr::install("readxl", quiet = TRUE)');
      const cap = await sh.captureR(code, { withAutoprint: true, captureStreams: true, captureConditions: false, captureGraphics: { width: 520, height: 360 } });
      const out = cap.output;
      // R 的錯誤會以 stderr 形式回傳（並中止後續程式）
      const errIdx = out.findIndex((o) => o.type === "stderr" && /^Error/.test(o.data));
      const error = errIdx >= 0 ? out.slice(errIdx).filter((o) => o.type === "stderr").map((o) => o.data).join("\n") : null;
      let ok = null;
      if (opts.check && !error) {
        const chk = await sh.captureR(`cat(tryCatch(isTRUE(${opts.check}), error = function(e) FALSE))`, { captureStreams: true, captureConditions: false });
        ok = chk.output.some((o) => /TRUE/.test(o.data));
      }
      return { out, images: cap.images, ok, error };
    } finally { await sh.purge(); }
  }
  window.RRUN = { runR };

  TOOLS.r = function (main, U) {
    main.innerHTML = `<div class="card"><h2>💻 線上跑 R（實習課）</h2><div class="muted small">程式在你的瀏覽器裡執行（webR），不用安裝 R。左邊選練習、改程式，按「執行」或 <b>Ctrl+Enter</b>。練習資料 scores.csv、bmi.csv 已經放在工作資料夾（公開版為模擬資料，數字會和課堂不同）。</div></div>
      <div class="lab-grid"><div class="card"><select id="rx" style="width:100%;margin-bottom:8px">${EX.map((e, i) => `<option value="${i}">${U.esc(e.t)}</option>`).join("")}</select>
        <textarea class="code" id="rc" spellcheck="false"></textarea>
        <div class="slide-nav"><button class="btn primary" id="rrun">▶ 執行</button><button class="btn small" id="rreset">還原範例</button><span class="small" id="rref"></span></div></div>
      <div class="card"><h3 style="margin-top:0">輸出</h3><pre class="out" id="ro">按「執行」開始。</pre><div class="plots" id="rp"></div></div></div>`;
    const drafts = U.load("rdraft", {});
    const pick = () => { const i = +U.$("#rx").value; U.$("#rc").value = drafts[i] ?? EX[i].code; U.$("#rref").innerHTML = U.refLink(EX[i].lec); };
    U.$("#rx").onchange = pick; pick();
    U.$("#rc").oninput = () => { drafts[U.$("#rx").value] = U.$("#rc").value; U.save("rdraft", drafts); };
    U.$("#rreset").onclick = () => { delete drafts[U.$("#rx").value]; U.save("rdraft", drafts); pick(); };
    const out = U.$("#ro");
    const log = (t, cls) => { const s = document.createElement("span"); if (cls) s.className = cls; s.textContent = t + "\n"; out.appendChild(s); };
    const run = async () => {
      out.textContent = ""; U.$("#rp").innerHTML = ""; U.$("#rrun").disabled = true;
      try {
        const w = await getWebR(log);
        const sh = await new w.Shelter();
        try {
          const cap = await sh.captureR(U.$("#rc").value, { withAutoprint: true, captureStreams: true, captureConditions: false, captureGraphics: { width: 560, height: 420 } });
          if (out.textContent.startsWith("載入")) out.textContent = "";
          cap.output.forEach((o) => log(o.data, o.type === "stderr" ? "err" : ""));
          if (!cap.output.length) log("（沒有文字輸出）");
          cap.images.forEach((img) => { const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height; cv.getContext("2d").drawImage(img, 0, 0); U.$("#rp").appendChild(cv); });
        } finally { await sh.purge(); }
      } catch (e) { log("錯誤：" + (e.message || e), "err"); }
      U.$("#rrun").disabled = false;
    };
    U.$("#rrun").onclick = run;
    U.$("#rc").onkeydown = (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); } };
  };
})();
