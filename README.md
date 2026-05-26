# Guitar Ear Trainer

A browser-based ear training tool for guitarists. Listen to a randomly played note on a chosen string and identify the fret by typing your answer. Built with vanilla HTML/CSS/JS and [Tone.js](https://tonejs.github.io/).

## How it works

1. **Pick a string** — choose from Low E, A, D, G, B, or High E (standard tuning, frets 0–12)
2. **Click "New Note"** — a random fret on that string plays three times
3. **Type your answer** — format is `<string><fret>`, e.g. `g5` for the G string at fret 5, or `e0` for open Low E
4. **Submit** — hit Check or press Enter. Wrong guesses let you retry; the Reveal button shows the answer if you're stuck
5. **Track your progress** — the scoreboard shows correct answers, total attempts, and your current streak

## Answer format

| String  | Key | Example answer |
|---------|-----|----------------|
| Low E (6th) | `e` | `e7` |
| A (5th)     | `a` | `a3` |
| D (4th)     | `d` | `d0` |
| G (3rd)     | `g` | `g5` |
| B (2nd)     | `b` | `b9` |
| High E (1st)| `E` | `E12` |

> Note: Low E uses lowercase `e`, High E uses uppercase `E`.

## Running locally

No build step required — just open `index.html` in a browser.

```bash
open index.html
```

Audio samples are streamed from [nbrosowsky/tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments), so an internet connection is needed on first load.

## Stack

- Vanilla HTML / CSS / JavaScript
- [Tone.js](https://tonejs.github.io/) v14 — audio scheduling and sampler
- Acoustic guitar samples via [nbrosowsky/tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments)
