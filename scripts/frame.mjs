import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";

export const W = 1920;
export const H = 1080;
export const VO_OFFSET = 0.3;
const STEP = 0.045;

const probe = (f) => +(+execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`).toString()).toFixed(2);

export const icon = (name, cls = "") =>
  readFileSync(`node_modules/lucide-static/icons/${name}.svg`, "utf8")
    .replace(/<!--.*?-->\s*/s, "")
    .replace(/class="[^"]*"/, `class="ic ${cls}"`)
    .replace(/\s(width|height)="24"/g, "")
    .replace(/\n\s*/g, " ");

export const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const typed = (text) => [...text].map((c) => `<span class="ch">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");

// sfx: [file, globalStart, duration, volume, track]
export function build({ title, durs, scenes, sfx, lang = "pl" }) {
  const starts = durs.reduce((a, d, i) => (a.push(i ? +(a[i - 1] + durs[i - 1]).toFixed(2) : 0), a), []);
  const TOTAL = +(starts.at(-1) + durs.at(-1)).toFixed(2);

  mkdirSync("compositions", { recursive: true });
  scenes.forEach((s, i) => {
    const id = `s${String(i + 1).padStart(2, "0")}`;
    const R = `#${id}-root`;
    const dur = durs[i];
    const exit = s.exit ?? 0.45;
    writeFileSync(
      `compositions/${id}.html`,
      `<!doctype html>
<html lang="${lang}">
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
${R} { position:absolute; inset:0; }
${R} .stage { position:absolute; inset:0; }
${s.css.replace(/@R/g, R)}
      </style>
      <div id="${id}-root" data-composition-id="${id}" data-width="${W}" data-height="${H}">
        <div class="stage">
${s.html}
        </div>
      </div>
      <script>
        (function () {
          var R = "${R} ";
          var $ = function (s) { return R + s; };
          var V = function (w) { return w + ${VO_OFFSET}; };
          var E = "power3.out", IO = "power2.inOut";
          var tl = gsap.timeline({ paused: true });
          function type(sel, t, step) {
            var els = document.querySelectorAll(R + sel + " .ch");
            for (var i = 0; i < els.length; i++) tl.set(els[i], { display: "inline" }, t + i * (step || ${STEP}));
          }
          function draw(sel, t, d) {
            tl.fromTo($(sel), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d || 0.5, ease: "power2.out" }, t);
          }
          tl.fromTo($(".stage"), { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }, 0);
${s.js}
          tl.to($(".stage"), { opacity: 0, filter: "blur(6px)", y: -10, duration: ${exit - 0.05}, ease: "power2.inOut" }, ${(dur - exit).toFixed(2)});
          window.__timelines["${id}"] = tl;
        })();
      </script>
    </template>
  </body>
</html>
`,
    );
  });

  const audio = starts.map((st, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `<audio id="vo-${n}" src="assets/audio/vo-${n}.mp3" data-start="${(st + VO_OFFSET).toFixed(2)}" data-duration="${probe(`assets/audio/vo-${n}.mp3`)}" data-track-index="10" data-volume="1"></audio>`;
  });
  const env = [
    [0, 0],
    [1.0, 0.32],
    [VO_OFFSET + 0.1, 0.2],
    [TOTAL - 2.6, 0.2],
    [TOTAL - 1.6, 0.34],
    [TOTAL, 0],
  ].map(([t, v]) => ({ t: +t.toFixed(2), v }));
  audio.push(
    `<audio id="music" src="assets/audio/music.mp3" data-start="0" data-duration="${TOTAL}" data-track-index="11" data-volume="1" data-automation='${JSON.stringify({ version: 1, lanes: [{ target: "volume", points: env }] })}'></audio>`,
  );
  const all = [...starts.slice(1).map((st, i) => [i % 2 ? "whoosh-short" : "whoosh", st - 0.12, 0.574, 0.32, 12]), ...sfx(starts)];
  all.forEach(([f, t, d, v, tr], i) =>
    audio.push(
      `<audio id="sfx-${String(i + 1).padStart(2, "0")}" src="assets/sfx/${f}.mp3" data-start="${t.toFixed(2)}" data-duration="${d}" data-track-index="${tr}" data-volume="${v}"></audio>`,
    ),
  );

  const fonts = [
    ["Geist", "Geist-Regular", 400],
    ["Geist", "Geist-Medium", 500],
    ["Geist", "Geist-SemiBold", 600],
    ["Geist", "Geist-Bold", 700],
    ["Geist Mono", "GeistMono-Regular", 400],
    ["Geist Mono", "GeistMono-Medium", 500],
  ]
    .map(([f, file, w]) => `@font-face { font-family:"${f}"; src:url("assets/fonts/${file}.woff2") format("woff2"); font-weight:${w}; font-display:block; }`)
    .join("\n      ");

  writeFileSync(
    "index.html",
    `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>${title}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      ${fonts}
      :root { --bg:#0b0e0d; --panel:#111715; --line:#24302b; --text:#e9efeb; --muted:#8a9891; --green:#3ee08f; --yellow:#f5c518; }
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { margin:0; width:1920px; height:1080px; overflow:hidden; background:var(--bg); }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--bg); color:var(--text);
        font-family:"Geist", system-ui, sans-serif; -webkit-font-smoothing:antialiased; }
      #bg { position:absolute; inset:0; }
      #bg .grid { position:absolute; inset:-60px; background-image:radial-gradient(rgba(233,239,235,.07) 1.5px, transparent 1.6px); background-size:48px 48px; }
      #prog { position:absolute; left:0; bottom:0; width:1920px; height:5px; }
      #prog i { display:block; width:100%; height:100%; background:var(--green); opacity:.7; }
      .hd { font-size:96px; font-weight:600; letter-spacing:-0.035em; line-height:1.04; color:var(--text); }
      .lb { font-size:46px; font-weight:500; letter-spacing:-0.01em; }
      .mono { font-family:"Geist Mono", ui-monospace, monospace; font-size:44px; letter-spacing:-0.01em; }
      .muted { color:var(--muted); } .g { color:var(--green); } .y { color:var(--yellow); }
      .ic { display:block; }
      .ch { display:none; }
      .card { position:absolute; border-radius:26px; background:var(--panel); border:1.5px solid var(--line); }
      .term { position:absolute; border-radius:24px; background:#0e1311; border:1.5px solid var(--line); overflow:hidden; }
      .term .bar { height:72px; display:flex; align-items:center; gap:12px; padding:0 28px; border-bottom:1.5px solid var(--line); }
      .term .bar i { display:block; width:16px; height:16px; border-radius:50%; background:#2b3632; }
      .term .bar span { margin-left:16px; }
      .term .body { padding:24px 34px; display:flex; flex-direction:column; gap:10px; }
      .wire { position:absolute; left:0; top:0; width:1920px; height:1080px; }
      .wire path { fill:none; stroke:#3a4842; stroke-width:3; stroke-linecap:round; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
      <div id="bg" class="clip" data-start="0" data-duration="${TOTAL}" data-track-index="0"><div class="grid"></div></div>
${starts
  .map((st, i) => {
    const id = `s${String(i + 1).padStart(2, "0")}`;
    return `      <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${st}" data-duration="${durs[i]}" data-track-index="1" data-width="${W}" data-height="${H}"></div>`;
  })
  .join("\n")}
      <div id="prog" class="clip" data-start="0" data-duration="${TOTAL}" data-track-index="2"><i></i></div>
      ${audio.join("\n      ")}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#prog i", { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: ${TOTAL}, ease: "none" }, 0);
      tl.fromTo("#bg .grid", { y: 0 }, { y: 48, duration: ${TOTAL}, ease: "none" }, 0);
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`,
  );
  console.log("built", scenes.length, "scenes, total", TOTAL, "starts", starts.join(","));
  return starts;
}
