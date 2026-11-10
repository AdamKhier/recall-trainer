# Recall Trainer — Light to the Nations

An Anki-style flashcard app for the Year 9 & 10 written tests (Chapters 5 and 6,
Term 3 & 4 2026). All 90 questions are in `data.js`, transcribed from the four
scanned test papers along with the handwritten answers.

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 5173
# then visit http://127.0.0.1:5173
```

No build step, no dependencies. Progress is saved in the browser's
`localStorage`, so it survives reloads on the same device and browser.

## How it works

* **Easiest first.** Every card carries a difficulty tier (1 = quick win,
  5 = brutal), set by question type: single-word recall and definitions first,
  multi-fact lists and long date clusters last. The first run of a deck walks
  through them in that order.
* **Miss it, see it again.** Grading a card `Again` puts it back after about
  3 other cards. `Hard` returns in ~5 and does not count towards retiring the
  card. `Good` returns in ~7, and a second clean recall retires it for the
  session. `Easy` retires it immediately.
* **Across days.** Each card stores an ease factor and an interval, so cards you
  know come back days apart while shaky ones come back tomorrow.
* **Weak spots.** Any card you have missed more than once gets collected into an
  extra "Weak spots" deck on the home screen.

## Keyboard

| Key | Action |
| --- | --- |
| `Space` / `Enter` | Show answer, then grade `Good` |
| `1` `2` `3` `4` | Again / Hard / Good / Easy |

## Note on the answers

Answers were taken from the handwriting on the papers. A couple were unclear or
looked misremembered, and those cards carry a short note — e.g. the Vandals were
defeated in **534**, not 535, and Isidore's book is the **Etymologiae**. Worth a
glance against the textbook before relying on them.
