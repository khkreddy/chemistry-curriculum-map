# Chemistry module — static web bundle (V15)

Built 2026-08-20 from canonical sources. Fully static. Zero external fetches.

## Serve locally

```
python3 -m http.server 8765 --bind 127.0.0.1
```

from this directory, then open http://127.0.0.1:8765/

## Pages

| page | what |
|---|---|
| `index.html` | Curriculum atlas (V15 public projection). Same interaction as the published atlas. |
| `questions.html` | 803 CMS Grade-A and Grade-B chemistry items (owner-ratified denominator). Stems and options only. |
| `quiz.html` | Deterministic quiz assembler (filter + sort by item_uid). |
| `analytics.html` | Counts by board, format, node. |
| `supplement.html` | 1640 practitioner-evidence items, redacted. |
| `id_grammar.html` | Id spaces and qualification. Full text in `id_grammar.md`. |

## What is withheld

Misconception prose, mastery-facet prose, credentials, absolute home-directory paths, and any source flagged against training export. Enforced by the bundle redaction lint (canary demonstrated in the same campaign).

## Rebuild

From the working tree, run `bash data/chem_curriculum/web_ready/BUILD.sh` relative to the repository root.

## Live

https://khkreddy.github.io/chemistry-curriculum-map/

Deploy is `data/chem_curriculum/web_ready/deploy_github_pages.sh` from the working tree. Only this redacted bundle is copied. CMS internals, extract overlays, examiner comments, and source crops stay off GitHub.
