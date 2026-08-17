// V14 static verification. Usage: node v14_verify.js <index.html> [--provisional]
const fs = require("fs");
let fail = 0;
const ok = m => console.log("  PASS  " + m);
const bad = m => { fail++; console.log("  FAIL  " + m); };
const file = process.argv[2];
const prov = process.argv.includes("--provisional");
const h = fs.readFileSync(file, "utf8");
console.log(file + ": " + h.length + " bytes\n");

console.log("[1] document shell");
/^<!doctype html>/i.test(h) ? ok("doctype") : bad("doctype missing");
/<meta charset=/i.test(h) ? ok("charset") : bad("charset missing");
/<html lang=/i.test(h) ? ok("lang") : bad("lang missing");

console.log("\n[2] self-contained");
// loading URLs only — verbatim ACCM text may cite the web, which is data, not a request
const scriptsRaw = [...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const shell = scriptsRaw.reduce((acc,s)=>acc.replace(s,""), h);   // html minus script bodies
const loadUrls = [...shell.matchAll(/(?:src|href)\s*=\s*["']https?:[^"']+/gi),
                  ...scriptsRaw.slice(1).join("").matchAll(/https?:\/\/(?!www\.w3\.org)[^"'` )<>]+/g)];
loadUrls.length ? bad("loading URLs: "+loadUrls.slice(0,3).map(m=>m[0])) : ok("no loading URLs (citation text in data allowed)");
(h.match(/\bfetch\s*\(/g) || []).length ? bad("fetch() present") : ok("no fetch()");
/<script[^>]+src=/i.test(h) ? bad("external script") : ok("no external scripts");

console.log("\n[3] scripts parse");
const scripts = [...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach((s,i) => { try { new Function(s); ok("script "+(i+1)+" parses ("+s.length+")"); }
  catch(e){ bad("script "+(i+1)+" SYNTAX: "+e.message); } });

console.log("\n[4] data contract");
let D;
try { D = new Function(scripts[0] + "; return D;")(); ok("D evaluates"); }
catch(e){ bad("D failed: "+e.message); process.exit(1); }
D.big.length === 10 ? ok("10 big ideas") : bad("big ideas: "+D.big.length);
D.nodes.length === 21 ? ok("21 nodes") : bad("nodes: "+D.nodes.length);
D.edges.length === 26 ? ok("26 edges") : bad("edges: "+D.edges.length);
const eus = Object.values(D.accm).reduce((a,c)=>a+Object.keys(c.eus).length,0);
eus === 69 ? ok("69 EUs in canon") : bad("EUs: "+eus);
let l3=0,l4=0;
for(const r in D.accm) for(const L in D.accm[r].eus){
  const eu=D.accm[r].eus[L]; l3+=eu.l3.length;
  eu.l3.forEach(x=>l4+=x.l4.length);
}
l3===141 ? ok("141 L3 articulations") : bad("L3: "+l3);
l4===263 ? ok("263 L4 details") : bad("L4: "+l4);
const live = D.sts.length + D.nowhere.length + D.transit.length;
live === 1237 ? ok("1,237 live statements (1396 - 159 retired)") : bad("live: "+live);
const accmLive = D.sts.concat(D.nowhere, D.transit).filter(s=>s.id.startsWith("science/accm"));
accmLive.length === 0 ? ok("zero ACCM-addressed authored statements") : bad(accmLive.length+" authored ACCM statements live");
const bands = D.bands.map(b=>b.id).join(",");
!bands.includes("accm") ? ok("accm band retired from pills ("+bands+")") : bad("accm band still present");
const provs = new Set(D.sts.map(s=>s.prov));
["v","c","a"].every(p=>provs.has(p)) ? ok("provenance chips v/c/a all present") : bad("provenance classes: "+[...provs]);
if (!prov) {
  D.provisional ? bad("page still marked provisional") : ok("final build (not provisional)");
  const deep = D.sts.filter(s=>s.d).length;
  deep > 0 ? ok(deep+" statements placed below L2") : bad("no depth placements in final build");
} else ok("(provisional mode: depth checks skipped)");

console.log("\n[5] DOM contract");
const ids = new Set([...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const want = [...new Set([...h.matchAll(/getElementById\(\s*["']([^"']+)/g)].map(m=>m[1]))];
const missing = want.filter(x=>!ids.has(x));
missing.length ? bad("missing ids: "+missing) : ok(want.length+" getElementById targets present");
/id="ah"/.test(h) ? ok("#ah arrowhead") : bad("no arrowhead");

console.log("\n[6] determinism");
(scripts.slice(1).join("").match(/Math\.random\s*\(/g)||[]).length
  ? bad("Math.random in logic") : ok("no Math.random");

console.log("\n" + "=".repeat(50));
console.log(fail ? "RESULT: "+fail+" FAILURE(S)" : "RESULT: all static checks passed");
process.exit(fail?1:0);
