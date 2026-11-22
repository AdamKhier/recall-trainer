# Recall Trainer — Project Summary

> Reconstructed 22 Nov 2026 from the repository itself, not from chat history.

## What it is
An Anki-style flashcard app for the Year 9 & 10 written tests (Chapters 5 and 6, Term 3 & 4 2026). All 90 questions live in `data.js`, transcribed from four scanned test papers along with the handwritten answers.

## How the scheduling works
- Every card has a difficulty tier (1 easy → 5 brutal) and the first run walks them in that order.
- `Again` returns a card after ~3 others; `Hard` after ~5 and doesn't retire it; `Good` after ~7 and retires on a second clean recall; `Easy` retires immediately.
- Across days, each card stores an ease factor and interval.
- Any card missed more than once is collected into an extra "Weak spots" deck.

## Stack
Plain HTML/CSS/JS, no build step, no dependencies. Progress in `localStorage`.

## How to run
```bash
python3 -m http.server 5173
# http://127.0.0.1:5173
```

## Content caveat
Answers come from the handwriting. A couple were unclear — the README notes the Vandals were defeated in **534** (not 535) and Isidore's book is the **Etymologiae**. Worth checking against the textbook.

`Scan_20261031_160953.pdf` (48 MB) is the source scan and the bulk of the repository size.

## Git
`AdamKhier/recall-trainer` — public.
