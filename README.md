# LSSTF-CACCOV · Staying Safe in a Digital World

Full-screen workshop presentation for the **LSSTF-CACCOV July 2026 Cybersecurity Campaign**.

**Event:** Saturday, 18 July 2026 · 7:00 PM · Virtual  
**Led by:** Mesole Emmanuel · Head of Programmes & Outreaches, LSSTF-CACCOV

Built as a static site (`index.html` + `styles.css` + `app.js`) for live delivery — keyboard navigation, fullscreen, and continuous workshop demos on selected stories.

---

## Quick start

No build step. From this folder:

```bash
# Option A — Python
python3 -m http.server 8765

# Option B — Node
npx serve .
```

Open [http://127.0.0.1:8765](http://127.0.0.1:8765) (or the URL `serve` prints).

---

## Deploy to Vercel

This is a static site with `index.html` at the project root.

```bash
npx vercel
```

Or connect the GitHub repo in the Vercel dashboard and deploy — leave **Framework Preset** as Other / static, and **Root Directory** as this folder.

---

## Controls

| Input | Action |
| --- | --- |
| `↑` / `←` | Previous slide (or previous demo step) |
| `↓` / `→` / `Space` | Next slide (or next demo step / flag) |
| `F` | Toggle fullscreen |
| `Esc` | Exit a live demo / fullscreen |
| Agenda item click | Jump to that story |

---

## Deck structure

1. Cover  
2. Disclaimer  
3. Agenda (8 stories)  
4. Stories 1–8  
5. Closing stats  
6. Thank you  

### Stories

| # | Topic | Live demo |
| --- | --- | --- |
| 1 | Fake Bank Alert & Reversal Scams | Yes |
| 2 | WhatsApp Account Hijack | Yes |
| 3 | SIM Swap Fraud | — |
| 4 | Phishing — Fake Bank SMS & Email | Yes |
| 5 | Loan App Harassment & Data Blackmail | Yes |
| 6 | Cryptocurrency & Forex & Investment Ponzi Schemes | Yes |
| 7 | Fake Job Offer Scams | — |
| 8 | P2P Crypto Trading Scams | — |

Stories with a **Start live demo →** button open a continuous flow (Back / Next). On flag steps, Next / Space reveals the next callout before moving on.

---

## Project files

```
├── index.html      # All slides + workshop flows
├── styles.css      # Brand, layout, device mocks
├── app.js          # Slide nav + flow logic
├── assets/         # Logos, loan-app screenshots, etc.
└── README.md
```

---

## Brand & intent

Dark burgundy theme for live projection. Content is educational — drawn from documented Nigerian fraud patterns and public sources cited on each story. Some dialogue and scenarios are adapted for workshop clarity (see the Disclaimer slide).

---

## Partners

Lagos State Security Trust Fund (LSSTF) · Executive Hotel & Suites · Aethelgard Global Limited · AccompliTech · Tormer
