// V14 bearing test: in node view, imported-EU bubbles must sit on the true bearing toward
// the primary node of their concept; transit bubbles toward the dependency's far endpoint.
const fs = require("fs");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(process.argv[2], "utf8");
const D = new Function([...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0][1] + "; return D;")();
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
const doc = dom.window.document;
const fire = (el,t)=>el.dispatchEvent(new dom.window.MouseEvent(t,{bubbles:true,cancelable:true}));
const deg = r => (r*180/Math.PI+360)%360;
const BI = {}; D.big.forEach(b=>BI[b.roman]=b);
const primary = r => (BI[r] && BI[r].members[0]) || null;
const EDGE = {}; D.edges.forEach(e=>EDGE[e.id]=e);

// enter full map
const mapBtn = [...doc.querySelectorAll("button.pill")].find(b=>/dependency map/.test(b.textContent));
fire(mapBtn,"click");

let checked=0, worst=0, signed=[], offenders=[];
for (const n of D.nodes) {
  const g=[...doc.querySelectorAll("#nodes g.nd")].find(x=>x.getAttribute("data-id")===n.id);
  if(!g) continue;
  fire(g,"click");
  const pos=D.pos[n.id];
  // dense fans (many directional kids from one point) legitimately displace a few bubbles;
  // the connector still anchors on the true bearing. Systematic bias is gated separately.
  const nDir=[...doc.querySelectorAll("#packs g.bub")].filter(b=>{
    const k=b.getAttribute("data-key");
    if(/^EDGE:/.test(k)) return true;
    if(/^[IVX]+\./.test(k)) return !(n.parents||[]).includes(k.split(".")[0]);
    return false;
  }).length;
  const TOL = nDir>6 ? 20 : 12;
  for (const b of doc.querySelectorAll("#packs g.bub")) {
    const key=b.getAttribute("data-key");
    let owner=null;
    if(/^EDGE:/.test(key)){ const e=EDGE[key.slice(5)]; if(e) owner = e.from===n.id? e.to:e.from; }
    else if(/^[IVX]+\./.test(key)){
      const roman=key.split(".")[0];
      if(!(n.parents||[]).includes(roman)){ const o=primary(roman); if(o && o!==n.id) owner=o; }
    }
    if(!owner || !D.pos[owner]) continue;
    const c=b.querySelector("circle");
    const bx=+c.getAttribute("cx"), by=+c.getAttribute("cy");
    const op=D.pos[owner];
    const want=deg(Math.atan2(op[1]-pos[1],op[0]-pos[0]));
    const got=deg(Math.atan2(by-pos[1],bx-pos[0]));
    let d=got-want; if(d>180)d-=360; if(d<-180)d+=360;
    checked++; signed.push(d);
    if(Math.abs(d)>Math.abs(worst)) worst=d;
    if(Math.abs(d)>TOL) offenders.push(`${n.id} ${key} -> ${owner}: off ${d.toFixed(1)}deg`);
  }
  fire(doc.getElementById("stagesvg"),"click");
}
const mean = signed.reduce((a,c)=>a+c,0)/(signed.length||1);
console.log(`checked ${checked} directional bubbles`);
console.log(`worst ${worst.toFixed(1)}deg | mean ${mean.toFixed(2)}deg`);
let fail=0;
if(offenders.length){fail++;console.log("OFF-BEARING:\n  "+offenders.join("\n  "));}
if(Math.abs(mean)>5){fail++;console.log("SYSTEMATIC BIAS "+mean.toFixed(2)+"deg");}
console.log(fail?"RESULT: bearing FAILED":"RESULT: bearings correct");
process.exit(fail?1:0);
