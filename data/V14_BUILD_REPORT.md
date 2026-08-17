# V14 build report — the ACCM-anchored map

**2026-08-17.** V14 puts the real ACCM surface under the map: a Big-Idea landing layer,
verbatim four-level ACCM hierarchy (general-lens canon), per-statement depth placement,
and the retirement of every authored statement that wore an ACCM address.

## What changed
- **Landing layer**: 10 anchoring concepts, verbatim. Node parentage adjudicated (kimi-k3):
  17 confirmed on evidence, B1→X, B2→IX, B3→IX, B6→beside-spine shelf (no honest anchor).
  Containment is orthogonal to the 26 dependency edges, which are untouched (hash-checked).
- **Verbatim gate**: every ACCM string on the page byte-matches accm_spine.json (checked by
  `check_invariants.py` on every build). The 159 authored hinges with ACCM ids are retired;
  ledger in the map file; zero retired ids render.
- **Depth layer**: every live seated statement adjudicated to its deepest honest ACCM
  position. Verdicts: {'L4': 371, 'L2_STAY': 485, 'L3': 217, 'EU_MISMATCH': 114, 'INVALID': 5}.
- **EU seating** for the four practice nodes' 215 statements:
  {'SEATED': 174, 'NOWHERE': 41}.
- **Audit**: builder (claude) challenged flagged + sampled verdicts; kimi-k3 ruled finally;
  0 of 29 challenges accepted (rulings verbatim in adjudication/audit_*.json).
- **Transit repair**: masters seat 5 units on E16/E18; the v13 page had shown 4 of them
  under a stale edge id (E01). V14 reads masters directly.

## Numbers on the page
{
  "statements": 1186,
  "nowhere": 47,
  "transit": 4,
  "l4": 379,
  "l3": 221,
  "l2": 586,
  "mismatch_flags": 94,
  "mx": 1204
}

## Method
Placement discipline per CURRICULUM_MAP_PLAYBOOK v3: builder proposes only where the
playbook expects proposals (parentage); EU and depth verdicts are the adjudicator's own,
blind to board tags, with "NOWHERE", "no deeper" (L2_STAY) and EU_MISMATCH legal.
Adjudicator kimi-k3, temperature fixed at 1 by the model. 11 EU shards +
96 depth shards; adjudication tokens: {'prompt_tokens': 125034, 'completion_tokens': 895578}.
**Deviation recorded**: shards ran with 2 concurrent workers (playbook says sequential;
observed per-shard latency made sequential infeasible). Any 429 would have serialized the
run permanently; none was observed unless noted in campaign.log.

## Standing evidence standard
Model-adjudicated, NOT owner- or expert-verified. EU_MISMATCH flags are reported, not moved.
Unplaced statements render as visible gaps.
