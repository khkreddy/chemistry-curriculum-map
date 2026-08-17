# Chemistry Curriculum Map

**[Open the live map →](https://khkreddy.github.io/chemistry-curriculum-map/)**

School chemistry anchored on the ACS Anchoring Concepts Content Map — the real one, verbatim.
The landing page is the ACCM's ten big ideas. Beneath them sit the map's 21 nodes with their
26 dependency edges (each admitted one at a time under a removal test), and beneath those the
ACCM's own four-level hierarchy: 69 enduring understandings, 141 subdisciplinary articulations,
263 content details — every one reproduced byte-for-byte from the published ACS documents
(general-chemistry map as the placement canon; the physical, organic and inorganic maps
available as verbatim reference behind a toggle).

Every syllabus statement hangs at its adjudicated position and **depth**: a broad IGCSE
introduction may sit at the enduring understanding while the AS/A treatment of the same topic
reaches an articulation or a content detail. Where different boards phrase the same concept
differently, the phrasings are listed together at that position, each with its board tag.

## The numbers

- 10 anchoring concepts · 69 enduring understandings · 141 articulations · 263 content details
- 21 nodes · 26 gated dependencies (unchanged from V13; the ACCM layer sits above and below them, never through them)
- 1,237 syllabus statements placed per statement at L2/L3/L4, with "no deeper" and
  "belongs nowhere" as legal verdicts; unplaced statements stay visible — a gap you can point at
- 6 syllabus overlays: NCERT 9–10 and 11–12, CISCE ICSE and ISC, Cambridge IGCSE and AS/A

## Provenance — read this before quoting the page

Every statement carries a provenance chip:

- **V verbatim** — the board's own wording (Cambridge IGCSE 0620, AS/A 9701)
- **C condensed** — faithful condensation of syllabus scope (CISCE ICSE/ISC; the source PDFs
  interleave two-column text and carry an all-rights-reserved notice, so the board's exact
  wording is deliberately not reproduced)
- **A authored** — model-derived decision hinges from NCERT chapter intelligence, kept by
  owner ruling; they are diagnostic obligations, not NCERT's wording

All ACCM text is verbatim ACS wording — the 159 model-authored statements that previously
wore ACCM addresses were retired in V14 (ledger in the map file). Placement is
model-adjudicated (builder: claude · adjudicator: kimi-k3, temperature fixed at 1 by the
model), **not owner- or expert-verified**.

## How to use the page

1. **Land on the ten big ideas.** Click one to see the map nodes anchored to it; dashed
   cross-boundary dependencies point to ideas that feed it. "Applications & contexts" sits on
   a beside-spine shelf — the adjudicator found it has no single honest anchor, and forcing
   one would misrepresent it.
2. **Click a node** to open its enduring understandings, laid out relationally: home
   understandings in the core, borrowed concepts on the true bearing toward the idea that
   owns them, dependency-transit content along its edge.
3. **Click an understanding** to read the branch: verbatim ACCM text at each level,
   syllabus statements listed at their adjudicated depth with board and provenance chips,
   empty positions shown as visible gaps. Toggle the other three ACCM maps for their verbatim
   articulations.
4. **View pills / keys 0–6** re-weight everything to one syllabus. The dependency-map pill
   shows the full 21-node graph.

## Files

- `index.html` — the page, self-contained, no build step, no external requests
- `data/chemistry_map_v14.json` — the public map master (redacted: misconception and
  mastery-facet texts are internal; ids, types and counts remain), with nodes, edges +
  use-contracts, big-idea layer, depth assignments, retirement ledger, audit blocks,
  sign-off chain
- `data/accm_canon.json` — the verbatim ACCM extract (all four maps, general as canon)
- `data/view_data5.json` — exactly what the page draws, generated, never hand-edited
- `data/pep/` — People's Education Press sidecars (teaching sequence crosswalk, unchanged)

## Limits

- The map covers the intended curriculum only — not what is taught or learned.
- Density is not quality; an empty position is information, not failure.
- Placement and depth are model-adjudicated, not expert-verified.
- CISCE statements are condensations, marked as such; PEP text is machine-translated and
  marked unverified.
