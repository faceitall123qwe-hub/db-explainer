import { build, icon, typed, esc, VO_OFFSET } from "./frame.mjs";

const durs = [9.3, 10.1, 9.4, 11.3, 10.3, 8.6, 10.5, 11.9, 12.6, 13.6];
const scenes = [];
const HD = `tl.fromTo($(".hd"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: E }, 0.2);`;
const HDCSS = `@R .hd { position:absolute; left:140px; top:96px; }`;
const IN = (sel, t, extra = "") => `tl.fromTo($("${sel}"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: E${extra} }, ${t});`;
const sp = (s) => esc(s).replace(/ /g, "&nbsp;");

// table: cols [[title, width]], rows [[cells]] -> absolutely positioned grid at (x, y)
const ROW = 76;
const TCSS = `
@R .tb { position:absolute; border-radius:22px; background:var(--panel); border:1.5px solid var(--line); overflow:hidden; }
@R .tr { display:flex; height:${ROW}px; align-items:center; border-top:1.5px solid var(--line); position:relative; }
@R .tr.th { border-top:none; color:var(--muted); background:#0e1311; }
@R .tc { padding:0 24px; white-space:nowrap; }
`;
const table = (cls, x, y, cols, rows) => `<div class="tb ${cls}" style="left:${x}px; top:${y}px; width:${cols.reduce((a, c) => a + c[1], 0)}px">
<div class="tr th">${cols.map(([t, w], c) => `<span class="tc lb c${c}" style="width:${w}px">${t}</span>`).join("")}</div>
${rows.map((r, i) => `<div class="tr r${i}">${r.map((v, c) => `<span class="tc mono c${c}" style="width:${cols[c][1]}px">${sp(String(v))}</span>`).join("")}</div>`).join("\n")}
</div>`;

const users = [
  [1, "Анна", "anna@mail.ru", "Варшава"],
  [2, "Иван", "ivan@mail.ru", "Краков"],
  [3, "Анна", "anna.k@mail.ru", "Гданьск"],
  [4, "Олег", "oleg@mail.ru", "Варшава"],
];
const ucols = [
  ["id", 140],
  ["имя", 240],
  ["почта", 480],
  ["город", 300],
];

// 01 HOOK
const apps = [
  ["log-in", "вход", 1.29],
  ["search", "поиск товара", 2.5],
  ["receipt", "история заказов", 3.46],
];
scenes.push({
  css: `
@R .ap { top:180px; width:440px; height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; color:var(--muted); }
@R .ap .ic { width:64px; height:64px; stroke-width:1.5; }
@R .ap .lb { color:var(--text); }
${apps.map((_, i) => `@R .ap${i} { left:${200 + i * 540}px; }`).join("\n")}
@R .db { left:810px; top:520px; width:300px; height:190px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; color:var(--green); border-color:rgba(62,224,143,.5); }
@R .db .ic { width:80px; height:80px; stroke-width:1.3; }
@R .db .lb { color:var(--text); }
@R .q { position:absolute; left:0; right:0; top:790px; text-align:center; font-size:100px; }
`,
  html: `
<svg class="wire" viewBox="0 0 1920 1080">${apps.map((_, i) => `<path class="w${i}" pathLength="1" d="M${420 + i * 540} 380 C ${420 + i * 540} 450, 960 450, 960 520"/>`).join("")}</svg>
${apps.map(([ic, n], i) => `<div class="card ap ap${i}">${icon(ic)}<span class="lb">${n}</span></div>`).join("\n")}
<div class="card db">${icon("database")}<span class="lb">база данных</span></div>
<h1 class="hd q">Как устроена <span class="g">база данных</span>?</h1>`,
  js: `
${apps.map(([, , t], i) => IN(`.ap${i}`, `V(${t})`)).join("\n")}
${IN(".db", "V(5.0)")}
${apps.map((_, i) => `draw(".w${i}", V(5.3) + ${i} * 0.12, 0.5);`).join("\n")}
tl.fromTo($(".q"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: E }, V(7.0));
`,
});

// 02 TABLES
scenes.push({
  css: `${HDCSS}${TCSS}
@R .hl { position:absolute; border-radius:14px; border:3px solid var(--green); background:rgba(62,224,143,.06); }
@R .rowhl { left:370px; top:${340 + ROW}px; width:1160px; height:${ROW}px; }
@R .colhl { left:${370 + 140 + 240}px; top:340px; width:480px; height:${ROW * 5}px; border-color:var(--yellow); background:rgba(245,197,24,.06); }
@R .lr { position:absolute; left:370px; top:760px; color:var(--green); }
@R .lc { position:absolute; left:${370 + 140 + 240}px; top:810px; color:var(--yellow); }
`,
  html: `
<h1 class="hd">Данные в <span class="g">таблицах</span></h1>
${table("t", 370, 340, ucols, users)}
<div class="hl rowhl"></div><div class="hl colhl"></div>
<div class="lr lb">строка = запись</div><div class="lc lb">столбец = поле</div>`,
  js: `${HD}
tl.fromTo($(".t"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, V(1.4));
tl.fromTo($(".t .tr:not(.th)"), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.35, ease: E, stagger: 0.12 }, V(3.0));
tl.fromTo([$(".rowhl"), $(".lr")], { opacity: 0 }, { opacity: 1, duration: 0.4 }, V(4.7));
tl.to($(".rowhl"), { opacity: 0, duration: 0.3 }, V(5.9));
tl.fromTo([$(".colhl"), $(".lc")], { opacity: 0 }, { opacity: 1, duration: 0.4 }, V(6.05));
tl.to($(".colhl"), { opacity: 0, duration: 0.3 }, V(7.4));
tl.to($(".t .th .c1"), { color: "#3ee08f", duration: 0.3 }, V(7.7));
tl.to($(".t .th .c2"), { color: "#3ee08f", duration: 0.3 }, V(8.2));
tl.to($(".t .th .c3"), { color: "#3ee08f", duration: 0.3 }, V(8.8));
`,
});

// 03 PRIMARY KEY
scenes.push({
  css: `${HDCSS}${TCSS}
@R .t .c0 { color:var(--green); }
@R .kl { position:absolute; left:370px; top:760px; display:flex; align-items:center; gap:16px; color:var(--green); }
@R .kl .ic { width:48px; height:48px; stroke-width:1.7; }
@R .same { position:absolute; left:${370 + 140}px; top:810px; color:var(--yellow); }
`,
  html: `
<h1 class="hd">Первичный <span class="g">ключ</span></h1>
${table("t", 370, 340, ucols, users)}
<div class="kl lb">${icon("key-round")}<span>id: уникальный у каждой строки</span></div>
<div class="same lb">две «Анны», но id разные</div>`,
  js: `${HD}
tl.fromTo($(".t"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.1);
tl.fromTo($(".t .c0"), { backgroundColor: "rgba(62,224,143,0)" }, { backgroundColor: "rgba(62,224,143,.12)", duration: 0.4 }, V(2.3));
tl.fromTo($(".kl"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, V(2.4));
tl.to([$(".t .r0 .c1"), $(".t .r2 .c1")], { color: "#f5c518", duration: 0.3 }, V(7.3));
tl.to($(".kl"), { opacity: 0, duration: 0.3 }, V(7.2));
tl.fromTo($(".same"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, V(7.5));
tl.fromTo([$(".t .r0 .c0"), $(".t .r2 .c0")], { scale: 1 }, { scale: 1.2, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 }, V(8.0));
`,
});

// 04 SELECT
scenes.push({
  css: `${HDCSS}${TCSS}
@R .term { left:140px; top:260px; width:1640px; height:200px; }
@R .term .body { font-size:52px; }
@R .kw { color:var(--yellow); }
@R .res { position:absolute; left:140px; top:520px; color:var(--muted); }
@R .cap { position:absolute; left:860px; top:640px; width:920px; color:var(--muted); }
@R .cap .y { color:var(--yellow); }
`,
  html: `
<h1 class="hd">Язык <span class="g">SQL</span></h1>
<div class="term"><div class="bar"><i></i><i></i><i></i><span class="mono muted">запрос</span></div>
  <div class="body"><div class="mono q"><span class="kw">${typed("SELECT")}</span>${typed(" имя ")}<span class="kw">${typed("FROM")}</span>${typed(" users ")}<span class="kw">${typed("WHERE")}</span>${typed(" город = 'Варшава';")}</div></div></div>
<div class="res lb">результат</div>
${table("t", 140, 580, [["имя", 300]], [["Анна"], ["Олег"]])}
<div class="cap lb">Ты говоришь <span class="y">что</span> нужно, а <span class="g">как</span> искать, база решает сама</div>`,
  js: `${HD}
${IN(".term", "V(1.6)")}
type(".q", V(3.5), 0.04);
tl.fromTo([$(".res"), $(".t")], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: E, stagger: 0.1 }, V(6.9));
tl.fromTo($(".cap"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, V(8.0));
`,
});

// 05 CRUD
const crud = [
  ["plus", "INSERT", "добавить", 1.99],
  ["search", "SELECT", "прочитать", 3.11],
  ["pencil", "UPDATE", "изменить", 4.1],
  ["trash-2", "DELETE", "удалить", 5.3],
];
scenes.push({
  css: `${HDCSS}
@R .cr { top:330px; width:380px; height:300px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; color:var(--muted); }
@R .cr .ic { width:68px; height:68px; stroke-width:1.5; }
@R .cr .mono { font-size:52px; color:var(--text); }
${crud.map((_, i) => `@R .cr${i} { left:${140 + i * 420}px; }`).join("\n")}
@R .cap { position:absolute; left:0; right:0; top:760px; text-align:center; font-size:56px; font-weight:600; letter-spacing:-0.02em; }
`,
  html: `
<h1 class="hd">Четыре <span class="g">операции</span></h1>
${crud.map(([ic, k, d], i) => `<div class="card cr cr${i}">${icon(ic)}<span class="mono">${k}</span><span class="lb">${d}</span></div>`).join("\n")}
<div class="cap">Почти любое приложение <span class="g">построено на них</span></div>`,
  js: `${HD}
tl.fromTo($(".cr"), { opacity: 0, y: 20 }, { opacity: 0.4, y: 0, duration: 0.5, ease: E, stagger: 0.1 }, V(0.5));
${crud.map(([, , , t], i) => `tl.to($(".cr${i}"), { opacity: 1, color: "#3ee08f", borderColor: "rgba(62,224,143,.6)", duration: 0.4 }, V(${t}));\ntl.fromTo($(".cr${i}"), { y: 0 }, { y: -10, duration: 0.4, ease: E }, V(${t}));`).join("\n")}
tl.fromTo($(".cap"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, V(7.0));
`,
});

// 06 JOIN
const orders = [
  [101, 1, "250 zł"],
  [102, 4, "80 zł"],
  [103, 1, "120 zł"],
];
scenes.push({
  css: `${HDCSS}${TCSS}
@R .o .c1 { color:var(--yellow); }
@R .u .c0 { color:var(--yellow); }
@R .lbl { position:absolute; top:260px; color:var(--muted); }
@R .lo { left:140px; } @R .lu { left:1100px; }
@R .wire .jl { stroke:var(--yellow); stroke-width:2.5; }
@R .jn { position:absolute; left:140px; top:690px; display:flex; align-items:center; gap:20px; }
@R .jn .mono { color:var(--yellow); font-size:52px; }
`,
  html: `
<h1 class="hd">Связи и <span class="g">JOIN</span></h1>
<div class="lbl lo lb">заказы</div><div class="lbl lu lb">клиенты</div>
${table("o", 140, 320, [["заказ", 200], ["клиент_id", 280], ["сумма", 240]], orders)}
${table("u", 1100, 320, [["id", 140], ["имя", 240]], [[1, "Анна"], [4, "Олег"]])}
<svg class="wire" viewBox="0 0 1920 1080">
  <path class="jl j0" pathLength="1" d="M860 ${320 + ROW * 1.5} C 980 ${320 + ROW * 1.5}, 980 ${320 + ROW * 1.5}, 1100 ${320 + ROW * 1.5}"/>
  <path class="jl j1" pathLength="1" d="M860 ${320 + ROW * 2.5} C 980 ${320 + ROW * 2.5}, 980 ${320 + ROW * 2.5}, 1100 ${320 + ROW * 2.5}"/>
  <path class="jl j2" pathLength="1" d="M860 ${320 + ROW * 3.5} C 980 ${320 + ROW * 3.5}, 980 ${320 + ROW * 1.5}, 1100 ${320 + ROW * 1.5}"/>
</svg>
<div class="jn"><span class="mono">JOIN</span><span class="lb">→</span></div>
${table("rs", 480, 680, [["имя", 240], ["сумма", 240]], [["Анна", "250 zł"], ["Олег", "80 zł"], ["Анна", "120 zł"]])}`,
  js: `${HD}
tl.fromTo([$(".lo"), $(".o")], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, V(0.4));
tl.fromTo([$(".lu"), $(".u")], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, V(0.8));
tl.to($(".o .th .c1"), { color: "#f5c518", duration: 0.3 }, V(3.7));
draw(".j0", V(4.0), 0.4); draw(".j1", V(4.15), 0.4); draw(".j2", V(4.3), 0.4);
tl.fromTo($(".jn"), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, ease: E }, V(5.2));
tl.fromTo($(".rs"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, V(5.8));
`,
});

// 07 INDEX
const N = 14;
scenes.push({
  css: `${HDCSS}
@R .side { position:absolute; top:250px; width:780px; }
@R .s0 { left:140px; } @R .s1 { left:1000px; }
@R .side .h { font-size:52px; font-weight:600; margin-bottom:24px; }
@R .rows { position:relative; height:${N * 36}px; }
@R .rw { position:absolute; left:0; height:24px; border-radius:8px; background:#1d2723; }
@R .s0 .rw { width:520px; } @R .s1 .rw { width:520px; }
@R .sc { position:absolute; left:-6px; width:532px; height:36px; border-radius:10px; border:2px solid var(--yellow); }
@R .tg { position:absolute; left:-6px; width:532px; height:36px; border-radius:10px; border:2px solid var(--green); background:rgba(62,224,143,.12); }
@R .st { position:absolute; left:560px; top:0; color:var(--muted); }
@R .st .n { font-size:56px; font-weight:600; }
@R .s0 .st .n { color:var(--yellow); } @R .s1 .st .n { color:var(--green); }
@R .bk { position:absolute; left:1000px; top:860px; display:flex; align-items:center; gap:18px; color:var(--muted); }
@R .bk .ic { width:48px; height:48px; color:var(--green); stroke-width:1.6; }
`,
  html: `
<h1 class="hd">Индексы: <span class="g">быстрый поиск</span></h1>
<div class="side s0"><div class="h">без индекса</div><div class="rows">${Array.from({ length: N }, (_, i) => `<div class="rw" style="top:${i * 36 + 6}px"></div>`).join("")}<div class="sc"></div>
  <div class="st"><div class="n mono">1 млн</div><div class="lb">строк проверено</div></div></div></div>
<div class="side s1"><div class="h g">с индексом</div><div class="rows">${Array.from({ length: N }, (_, i) => `<div class="rw" style="top:${i * 36 + 6}px"></div>`).join("")}<div class="tg" style="top:${10 * 36}px"></div>
  <div class="st"><div class="n mono">≈ 20</div><div class="lb">шагов</div></div></div></div>
<div class="bk lb">${icon("book-open")}как оглавление в книге</div>`,
  js: `${HD}
tl.fromTo($(".s0"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, V(3.4));
tl.fromTo($(".s0 .sc"), { y: 0 }, { y: ${(N - 1) * 36}, duration: 2.4, ease: "none" }, V(4.0));
tl.fromTo($(".s0 .st"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, V(5.3));
tl.fromTo($(".s1"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, V(6.4));
tl.fromTo($(".s1 .tg"), { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: E }, V(7.1));
tl.fromTo($(".s1 .st"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, V(7.4));
tl.fromTo($(".bk"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, V(8.4));
`,
});

// 08 TRANSACTION
scenes.push({
  css: `${HDCSS}
@R .ac { top:300px; width:380px; height:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; color:var(--muted); }
@R .ac .ic { width:56px; height:56px; stroke-width:1.5; }
@R .ac .bal { position:relative; height:72px; width:300px; }
@R .ac .bal span { position:absolute; left:0; right:0; text-align:center; font-size:60px; color:var(--text); }
@R .a0 { left:140px; } @R .a1 { left:1400px; }
@R .tx { position:absolute; left:560px; top:270px; width:800px; height:300px; border-radius:30px; border:2px dashed rgba(245,197,24,.6); padding:30px 40px; display:flex; flex-direction:column; gap:18px; }
@R .tx .t { color:var(--yellow); }
@R .op { display:flex; align-items:center; gap:16px; height:60px; }
@R .op .ic { width:40px; height:40px; color:var(--green); stroke-width:2; }
@R .cm { position:absolute; left:560px; top:600px; width:800px; text-align:center; color:var(--green); font-size:52px; }
@R .rb { position:absolute; left:460px; top:700px; width:1000px; display:flex; justify-content:center; align-items:center; gap:16px; color:var(--muted); }
@R .rb .ic { width:44px; height:44px; color:var(--yellow); }
@R .cap { position:absolute; left:0; right:0; top:840px; text-align:center; font-size:60px; font-weight:600; letter-spacing:-0.02em; }
`,
  html: `
<h1 class="hd"><span class="g">Транзакции</span></h1>
<div class="card ac a0">${icon("wallet")}<span class="lb">счёт A</span><div class="bal"><span class="mono b0">1000</span><span class="mono b1">800</span></div></div>
<div class="card ac a1">${icon("wallet")}<span class="lb">счёт B</span><div class="bal"><span class="mono b0">500</span><span class="mono b1">700</span></div></div>
<div class="tx"><span class="mono t">BEGIN</span>
  <div class="op o0 lb">${icon("check")}списать 200 со счёта A</div>
  <div class="op o1 lb">${icon("check")}зачислить 200 на счёт B</div></div>
<div class="cm mono">COMMIT</div>
<div class="rb lb">${icon("rotate-ccw")}ошибка? ROLLBACK, всё как было</div>
<div class="cap">Либо <span class="g">всё</span>, либо <span class="y">ничего</span></div>`,
  js: `${HD}
tl.fromTo($(".tx"), { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: E }, V(0.9));
tl.fromTo($(".ac"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: E, stagger: 0.12 }, V(3.7));
tl.set($(".b1"), { opacity: 0 }, 0);
tl.fromTo($(".o0"), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, ease: E }, V(5.2));
tl.to($(".a0 .b0"), { opacity: 0, duration: 0.25 }, V(5.6)); tl.to($(".a0 .b1"), { opacity: 1, duration: 0.25 }, V(5.7));
tl.fromTo($(".o1"), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, ease: E }, V(6.6));
tl.to($(".a1 .b0"), { opacity: 0, duration: 0.25 }, V(7.0)); tl.to($(".a1 .b1"), { opacity: 1, duration: 0.25 }, V(7.1));
tl.fromTo($(".cm"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: E }, V(7.6));
tl.fromTo($(".rb"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, V(8.6));
tl.fromTo($(".cap"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, V(9.4));
`,
});

// 09 NOSQL
const doc = ["{", '  "имя": "Анна",', '  "город": "Варшава",', '  "теги": ["vip"]', "}"];
const kv = [
  ["session:42", "{…}"],
  ["cart:7", "3 товара"],
  ["views:home", "18 233"],
];
scenes.push({
  css: `${HDCSS}
@R .dc { left:140px; top:300px; width:800px; height:440px; }
@R .dc .body { font-size:48px; gap:4px; }
@R .kv { left:1020px; top:300px; width:760px; height:440px; padding:30px 40px; }
@R .kv .t { display:flex; align-items:center; gap:16px; color:var(--muted); margin-bottom:24px; }
@R .kv .t .ic { width:44px; height:44px; color:var(--green); }
@R .kr { display:flex; align-items:center; gap:24px; height:88px; }
@R .kr .k { color:var(--yellow); width:300px; }
@R .kr .a { color:var(--muted); }
@R .cap { position:absolute; left:0; right:0; top:820px; text-align:center; color:var(--muted); }
@R .cap .g { color:var(--green); }
`,
  html: `
<h1 class="hd">Нереляционные: <span class="g">NoSQL</span></h1>
<div class="term dc"><div class="bar"><i></i><i></i><i></i><span class="mono muted">документ JSON</span></div>
  <div class="body">${doc.map((l, i) => `<div class="mono dl d${i}">${sp(l)}</div>`).join("")}</div></div>
<div class="card kv"><div class="t lb">${icon("key-round")}ключ → значение</div>
${kv.map(([k, v], i) => `<div class="kr k${i}"><span class="mono k">${k}</span><span class="lb a">→</span><span class="mono">${sp(v)}</span></div>`).join("")}</div>
<div class="cap lb">удобно, когда <span class="g">структура часто меняется</span></div>`,
  js: `${HD}
${IN(".dc", "V(4.5)")}
tl.fromTo($(".dl"), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, ease: E, stagger: 0.1 }, V(4.9));
${IN(".kv", "V(6.1)")}
tl.fromTo($(".kr"), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.35, ease: E, stagger: 0.15 }, V(6.5));
tl.fromTo($(".cap"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, V(8.6));
`,
});

// 10 SUMMARY
const sum = [
  ["table", "Таблицы", 0.1],
  ["key-round", "Ключи", 0.91],
  ["braces", "SQL", 1.63],
  ["book-open", "Индексы", 2.57],
  ["arrow-right-left", "Транзакции", 3.17],
];
scenes.push({
  exit: 0.9,
  css: `${TCSS}
@R .ls { position:absolute; inset:0; }
@R .sm { top:220px; width:310px; height:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; color:var(--green); }
@R .sm .ic { width:64px; height:64px; stroke-width:1.5; }
@R .sm .lb { color:var(--text); font-size:48px; font-weight:600; }
${sum.map((_, i) => `@R .s${i} { left:${140 + i * 330}px; }`).join("\n")}
@R .ft { position:absolute; left:140px; top:560px; font-size:108px; }
@R .fin { position:absolute; inset:0; }
@R .fh { position:absolute; left:0; right:0; top:130px; text-align:center; font-size:100px; }
@R .term { left:360px; top:300px; width:1200px; height:170px; }
@R .term .body { font-size:52px; }
@R .kw { color:var(--yellow); }
`,
  html: `
<div class="ls">
${sum.map(([ic, n], i) => `<div class="card sm s${i}">${icon(ic)}<span class="lb">${n}</span></div>`).join("\n")}
<h1 class="hd ft">Так работают <span class="g">базы данных</span></h1>
</div>
<div class="fin">
  <h1 class="hd fh">Попробуй <span class="g">сам</span></h1>
  <div class="term"><div class="bar"><i></i><i></i><i></i><span class="mono muted">онлайн-песочница SQL</span></div>
    <div class="body"><div class="mono k0"><span class="kw">${typed("SELECT")}</span>${typed(" * ")}<span class="kw">${typed("FROM")}</span>${typed(" users;")}</div></div></div>
  ${table("t", 360, 540, ucols, users.slice(0, 3))}
</div>`,
  js: `
${sum.map(([, , w], i) => IN(`.s${i}`, `V(${w})`)).join("\n")}
tl.fromTo($(".ft"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: E }, V(4.6));
tl.to($(".ls"), { opacity: 0, filter: "blur(8px)", duration: 0.5, ease: "power2.inOut" }, V(6.6));
tl.fromTo($(".fh"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: E }, V(7.0));
${IN(".term", "V(7.6)")}
type(".k0", V(9.4), 0.05);
tl.fromTo($(".t"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, V(10.7));
tl.fromTo($(".t .tr:not(.th)"), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.1 }, V(10.9));
`,
});

build({
  title: "Как работают базы данных",
  lang: "ru",
  durs,
  scenes,
  sfx: (st) => [
    ["typing", st[3] + VO_OFFSET + 3.5, 1.5, 0.3, 14],
    ...[1.99, 3.11, 4.1, 5.3].map((t, i) => ["click-soft", st[4] + VO_OFFSET + t, 0.365, 0.4, 13 + (i % 2)]),
    ["click-soft", st[7] + VO_OFFSET + 7.6, 0.365, 0.45, 13],
    ["chime", st[9] + VO_OFFSET + 7.0, 2.5, 0.22, 15],
    ["typing", st[9] + VO_OFFSET + 9.4, 1.0, 0.3, 14],
  ],
});
