// V14 page runtime test: drives landing -> big idea -> node -> branch window.
const fs = require("fs");
const { JSDOM } = require("jsdom");
const file = process.argv[2];
const html = fs.readFileSync(file, "utf8");
const errors = [];
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
dom.virtualConsole.on("jsdomError", e => errors.push("jsdomError: " + e.message));
const { window } = dom; const doc = window.document;
const D = new Function([...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0][1] + "; return D;")();
const fire = (el,t)=>el.dispatchEvent(new window.MouseEvent(t,{bubbles:true,cancelable:true,clientX:80,clientY:80}));
let fail = 0; const bad = m => { fail++; console.log("  FAIL  " + m); };
const svg = doc.getElementById("stagesvg");

console.log("page loaded, D keys:", Object.keys(D).length);
if (errors.length) { console.log("LOAD ERRORS:\n"+errors.join("\n")); process.exit(1); }

// landing
const bigs = [...doc.querySelectorAll("#big g.bigb")];
console.log("[landing] big idea bubbles: "+bigs.length+" (expect 10)");
if (bigs.length !== 10) bad("landing bubble count");
const shelf = [...doc.querySelectorAll("#big g.nd[data-shelf], #big g.nd")].length;
console.log("[landing] shelf present: " + (doc.querySelector(".shelfbox") ? "yes" : "no"));
if (D.shelf.length && !doc.querySelector(".shelfbox")) bad("shelf missing");

// per big idea: open, check members, then open first member node, then first EU bubble
let totalStsSeen = 0, winOpens = 0;
for (const b of D.big) {
  const g = bigs.find(x => x.getAttribute("data-bi") === b.roman);
  const pre = errors.length;
  fire(g, "click");
  if (errors.length > pre) { bad(b.roman+" threw: "+errors[errors.length-1]); continue; }
  const drawn = [...doc.querySelectorAll("#nodes g.nd:not(.ghost)")].map(x=>x.getAttribute("data-id"));
  const missing = b.members.filter(m => !drawn.includes(m));
  if (missing.length) bad(b.roman+": members not drawn: "+missing);
  const vb = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  if (b.members.length && vb[2] >= D.W) bad(b.roman+": no zoom on big-idea view");
  // node view
  if (b.members.length) {
    const nid = b.members[0];
    const ng = [...doc.querySelectorAll("#nodes g.nd")].find(x=>x.getAttribute("data-id")===nid);
    const p2 = errors.length;
    fire(ng, "click");
    if (errors.length > p2) { bad(nid+" node view threw: "+errors[errors.length-1]); continue; }
    const bubs = [...doc.querySelectorAll("#packs g.bub")];
    if (!bubs.length) bad(nid+": node view has zero bubbles");
    // branch window on first EU bubble
    const euBub = bubs.find(x => (x.getAttribute("data-key")||"").match(/^[IVX]+\./));
    if (euBub) {
      const p3 = errors.length;
      fire(euBub, "click");
      if (errors.length > p3) bad(nid+" window threw: "+errors[errors.length-1]);
      const win = doc.getElementById("win");
      if (!win.classList.contains("on")) bad(nid+": branch window did not open");
      else {
        winOpens++;
        totalStsSeen += win.querySelectorAll("ul.slist li").length;
        if (!win.querySelector(".eutext")) bad(nid+": no EU text in window");
        if (!win.querySelector(".tag")) bad(nid+": no board chips in window");
        if (!win.querySelector(".prov")) bad(nid+": no provenance chips in window");
      }
      fire(svg, "click");
    }
    fire(svg, "click");
  }
  fire(svg, "click"); // back to landing
}
console.log("[drill] branch windows opened: "+winOpens+", statement rows seen: "+totalStsSeen);

// full map pill
const mapBtn = [...doc.querySelectorAll("button.pill")].find(b=>/dependency map/.test(b.textContent));
fire(mapBtn, "click");
const allNodes = doc.querySelectorAll("#nodes g.nd").length;
const allEdges = doc.querySelectorAll("#edges path.eg").length;
console.log("[full map] nodes "+allNodes+"/21, edges "+allEdges+"/26");
if (allNodes !== 21) bad("full map node count "+allNodes);
if (allEdges !== 26) bad("full map edge count "+allEdges);

// escape chain
window.dispatchEvent(new window.KeyboardEvent("keydown",{key:"Escape",bubbles:true}));
if (doc.querySelectorAll("#big g").length === 0) bad("Escape from full map did not return to landing");

// lens pill
const pill = doc.querySelector('button.pill[data-band="igcse"]');
const pe = errors.length; fire(pill,"click");
if (errors.length>pe) bad("lens pill threw");

// nowhere + transit reachable?
const nowhereNodes = [...new Set(D.nowhere.map(s=>s.node))];
console.log("[buckets] nowhere statements: "+D.nowhere.length+" across "+nowhereNodes.length+" nodes; transit: "+D.transit.length);

console.log("\n"+(errors.length?("RUNTIME ERRORS:\n"+errors.join("\n")):"no runtime errors"));
console.log(fail?("RESULT: "+fail+" failure(s)"):"RESULT: all v14 runtime checks passed");
process.exit(fail||errors.length?1:0);
