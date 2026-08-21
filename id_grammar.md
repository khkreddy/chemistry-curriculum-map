# ID grammar — sheaf alignment across map, supplement, CMS, and corpus

**Version 1.0 · 2026-08-20 · one page.** This is the id grammar the chemistry module
is aligned to. Enforcement is `tools/audit/chem_join_audit.py` (stdlib only, stands
under `tools/audit/` like the other gates). The module must not certify itself: the
auditor must not import `awm` or `data/chem_curriculum/v15_build/`.

A **sheaf** here is one id grammar plus zero dangling references in both directions
between every pair of artifacts that share an id space. Coverage holes (a live map
id that nothing in the overlay points at) are reported, not failed.

---

## 1 · Id spaces

| space | pattern | stored form | referenced form | example |
|---|---|---|---|---|
| ACCM address | roman `.` letter `.` number `.` letter (depth 1–4) | `accm_canon.addresses` keys; verbatim ACS | the key, never a paraphrase | `I`, `I.A`, `I.A.1`, `I.A.1.a` |
| Map node | `C1`–`C8`, `B1`–`B6`, hubs qualified | hub object stores bare `hub_id` / `hub_id_bare` (`H-MOLE`) | **always** `C1/H-MOLE` | `C1`, `B4`, `C7/H-ACIDBASE` |
| Edge | `E01`–`E26` | `edge_use_contracts[].edge_id` | the same token | `E01` |
| unit_id | board-native, stable | `statements[].unit_id` | the same token | `science/grade_11/chem_ch_101/H016`, `IGCSE:0620.2.2.1`, `AS_A:9701.1.1.1`, `ICSE:52.9.4.i` (also `ISC:862.…`) |
| mx_id | owner-unit local, or latent/ETC | on the statement / `latent_mx` / `edge_transfer_mx` | the stored `mx_id` | NCERT `hinge_id/local_id` → `science/grade_11/chem_ch_101/H016/H016_MX01`; Cambridge/CISCE as stored `IGCSE:0620.2.2.1/MX01`, `ICSE:52.9.4.i/MX01`; latent `LAT-E01-1`; ETC `ETC-E01-1` |
| Supplement item_id | `chemedx:<doc_sha1>:<n>` | `supplement_final.jsonl` | the same token | `chemedx:fec33559d434f0686ed0a0dbc4086db2c479b7f7:0` |
| CMS item_uid | `<doc_id>:q<n>` — **no** `tm:` prefix | `cms/qbank/*.jsonl` `item_uid` | the same token | `0620_m15_qp_12:q16` |
| Testmaker uid | `tm:<doc_id>:q<n>` | `testmaker_v1/index/questions.jsonl` `uid` | `tm:` form in testmaker; strip `tm:` to join CMS/tags | `tm:9700_m16_qp_12:q1` |
| Tags item_uid | same as CMS | `tags_corpus_chemistry.jsonl` | CMS form, no `tm:` | `0620_m15_qp_12:q1` |

CMS `canonical_mx_ids` (`MX-<TYPE>-<keyphrase>`) are a **different** space (the CMS
registry). They are not map `mx_id`s. Do not join them to V15.

Retired unit_ids live in `retired_statements` / `retirement_ledger` and are not live
join targets. Live unit_ids are `state ∈ {PLACED, TRANSIT}` (NOWHERE is in the array
but is not a legal `serves_statement_ids` target).

---

## 2 · Qualification (hub ids)

Ruling: **hub ids are qualified.** The map stores `H-MOLE` on the hub object; every
reference uses `C1/H-MOLE`. Bare `H-MOLE` silently unbound 316 items once.

- Legal reference: `C1/H-MOLE`, `C5/H-STOICH`, `C7/H-ACIDBASE`, …
- Illegal reference: `H-MOLE`, `H-ACIDBASE` — match `^H-[A-Z]` at the start of a
  reference-field value.
- Storage exception: `hub_id` / `hub_id_bare` on the hub object itself. That field
  is not a reference.
- **Any new join code goes through** `data/chem_curriculum/v15_build/common.py`
  (`node_index`, `all_units`). The join-audit reimplements the same rule and does
  not import that module.

Edge `from` / `to`, `latent_mx.owned_by`, statement `node`, supplement
`primary_node_id` / `secondary_node_ids`, and CMS `taxonomy_bindings` node fields
are all reference fields and must be qualified.

---

## 3 · Legal empty (UNBOUND) vs illegal dangling

`taxonomy_bindings` is **always present with a fixed shape** on supplement items.
Members may be honestly empty. A non-null mandate recreates forced addressing.

| state | rule |
|---|---|
| **UNBOUND (PASS)** | `unbound: true` **iff** node, edge, and ACCM address are all empty. Empty members are not dangling. Missing CMS `taxonomy_bindings`, or the object present with empty members and `unbound: true`, is the same state: *bindings absent (UNBOUND-legal until G4 stamps the object)*. |
| **Bound (must resolve)** | A nonempty id in a reference field must exist in the target space. `UNBOUND` as a string is treated as empty, not as an address. |
| **Dangling (FAIL)** | Nonempty id that does not resolve. Serving a retired or NOWHERE `unit_id`. A bare hub id in any reference field. |
| **Not a fail** | A live map node/edge/address/unit/mx with zero supplement or CMS pointers — informational uncovered. |

Honesty: `unbound: true` with a nonempty node, edge, or address is a false UNBOUND
claim (fail). `unbound: false` with all three empty is a missing flag (fail).
`serves_statement_ids` and `mx_refs` may be empty on a bound item; they do not
decide `unbound`.

---

## 4 · Bidirectional join pairs

A pair shares an id space when one artifact **writes** an id the other **owns**.
Every written reference must resolve both ways. Absence of a written reference is
UNBOUND or uncovered, not dangling.

### map ↔ supplement

Shared spaces: node, edge, ACCM address, unit_id, mx_id.

- **Supplement → map.** `taxonomy_bindings.primary_node_id`, `secondary_node_ids`,
  `edge_ids`, `mx_refs`, `serves_statement_ids`, and `anchor.accm_address` (and
  each `roll_up` member) resolve in V15. Nonempty ⇒ must hit the index;
  empty + `unbound: true` ⇒ PASS.
- **Map → supplement (references).** Every live `unit_id` the supplement claims
  to serve exists in the live set. (This is the inverse of `serves_statement_ids`.)
- **Map → supplement (coverage).** Nodes/edges/addresses (and live units, mx)
  with zero supplement hits are listed as informational, not a fail.

### supplement ↔ map statements (`serves_statement_ids`)

**COMPUTED, never authored.** Regenerated from the map after any statement
repair: live V15 statements whose `accm_eu` or `accm_depth` sits on the item's
ACCM ancestor chain. A hand-edited serve list is a defect. The auditor does not
recompute the join; it checks that every stored serve id is live and that the
claimed set is a subset of the map.

### map ↔ CMS

Same `taxonomy_bindings` shape, same resolve rules, **once G4 stamps the
object**. Until then CMS chemistry items carry `question_intelligence` and
typically no map bindings. Bindings absent = UNBOUND-legal, **not** a dangling
fail. When a nonempty binding appears, it is held to the same standard as the
supplement.

### CMS ↔ corpus (tags / testmaker)

Shared space: item_uid.

- CMS writes `item_uid` without `tm:`. Tags write the same form. Testmaker writes
  `tm:…`. Join by stripping/adding the `tm:` prefix.
- **CMS → corpus.** Every chemistry CMS `item_uid` appears in `--tags` and/or
  `--testmaker` (at least one of the files given). Missing from the provided
  corpus files is dangling.
- **Corpus → CMS.** Tags/testmaker uids with no CMS row are informational
  (the tag file is the larger chemistry set, not a CMS dump).

---

## 5 · Enforcement

```bash
python3 tools/audit/chem_join_audit.py \
  --map data/chem_curriculum/CHEMISTRY_MAP_V15.json \
  --supplement data/chem_curriculum/supplement/supplement_final.jsonl \
  --cms-a data/cms/qbank/qbank_grade_a.jsonl \
  --cms-b data/cms/qbank/qbank_grade_b.jsonl \
  --tags data/corpus/tags_corpus_chemistry.jsonl \
  --out data/chem_curriculum/reports/web_ready/join_audit.json
```

Exit 0 iff zero dangling in both directions for every pair that shares an id
space. JSON to stdout; `--out` writes the same document. Wave 0 measured
supplement dangling node/statement/mx/edge/address = 0; this tool is the
independent confirmation.
