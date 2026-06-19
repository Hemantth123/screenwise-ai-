# ScreenWise — Submission Package

> **Embark Services Pvt. Ltd. · Product & AI Intern Assignment**
> AI-powered solution that improves the recruitment lifecycle.

---

## What's in this submission

| Deliverable | File / Link | Notes |
|---|---|---|
| **Presentation (6 slides)** | `ScreenWise-Pitch-Deck.pptx` | Covers all 5 parts: Problem Understanding, Product Solution (×2), AI Approach, Prototype, Reflection. Speaker notes embedded. |
| **Prototype (live)** | Preview Panel → `/` route | Next.js 16 web app. Paste a JD + resumes → get AI-ranked candidates. |
| **Prototype source** | `slides/` folder + the running Next.js project | Editable HTML slides + the full app codebase. |
| **GitHub repository** | _Add your repo URL here after pushing_ | Optional per the assignment. |
| **Demo video** | _Record with the preview panel open_ | Optional, max 5 min. Suggested flow below. |

---

## 1. The product in one sentence

**ScreenWise** is an AI fitment copilot for recruiters. Paste a job description and a batch of resumes, and ScreenWise ranks every candidate with an explainable 0–100 fitment score, surfaces red flags, and drafts a personalized outreach email for each one — in under a minute.

---

## 2. How to demo the prototype (90-second flow)

1. Open the **Preview Panel** on the right → the ScreenWise landing page loads.
2. Click **"Load sample data"** (top of the workspace). A fintech Senior Backend Engineer JD + 5 candidate resumes populate instantly.
3. Click **"Run AI fitment analysis"**. Watch the phased progress (Parse JD → Read resumes → Score → Draft outreach).
4. In ~30 seconds, 5 ranked candidate cards appear. Note:
   - **Aarav Mehta → Strong Fit (highest score)** — 6 yrs Node.js + Postgres + fintech.
   - **Priya Nair → Possible Fit** — backend + AWS but Java; wants to pivot to Node.
   - **Kavya Iyer → red flags surfaced** — 4 jobs in 4 years detected as a stability concern.
   - **Rohan Desai & Aditya Rao → lower scores** — frontend/mobile, stretch fit.
5. Click the **"Outreach email"** tab on any card → see a personalized email referencing that candidate's actual background. Click **"Copy email"**.
6. Click **"Shortlist"** or **"Pass"** on any card to mark a recruiter decision.

---

## 3. Suggested demo video flow (≤5 min)

1. **0:00–0:30** — Read the problem statement on slide 1 of the deck.
2. **0:30–1:00** — Walk through the solution (slides 2–3): workflow, features, before/after.
3. **1:00–1:30** — Explain the AI approach (slide 4): one LLM, structured output, calibration.
4. **1:30–3:30** — **Live demo** of the prototype (the 90-second flow above). Talk through what the AI gets right as the cards appear.
5. **3:30–4:30** — Reflection (slide 6): what I learned, biggest challenge (calibration), what I'd build next.
6. **4:30–5:00** — Thank you + invitation to discuss.

---

## 4. The 5-signal fitment rubric

Every candidate is scored 0–100 across 5 weighted signals:

| Signal | Weight | What it measures |
|---|---|---|
| Skills match | 40 | Direct overlap with required + nice-to-have skills |
| Experience relevance | 25 | Domain, project type, and scope relevance |
| Seniority alignment | 15 | Years and scope vs JD expectations |
| Domain context | 10 | Industry exposure (e.g. fintech, B2B, healthcare) |
| Trajectory & stability | 10 | Career progression and tenure pattern |

**Calibration:** Strong Fit (≥80) is intentionally rare. Most candidates land in Possible Fit (60–79) or Pass (<60). The first version of the prompt over-scored everyone — the fix was an explicit calibration line in the system prompt.

---

## 5. Tech stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, framer-motion
- **Backend:** Next.js API route at `/api/screen` (Node runtime, server-side only)
- **AI:** GPT-4-class LLM via `z-ai-web-dev-sdk` — one structured JSON call per batch
- **State:** Stateless prototype (no database) — all in-memory per request
- **No external services** — no databases, queues, or third-party APIs beyond the LLM

---

## 6. Project structure

```
src/
├── app/
│   ├── api/screen/route.ts    # AI screening endpoint (z-ai-web-dev-sdk)
│   ├── layout.tsx             # Root layout + metadata
│   ├── page.tsx               # Main UI: hero, JD input, resumes input, results dashboard
│   └── globals.css
├── components/
│   ├── screenwise/
│   │   └── candidate-card.tsx # Rich ranked candidate card with tabs
│   └── ui/                    # shadcn/ui component library
└── lib/
    ├── types.ts               # ScreeningRequest / ScreeningResponse / CandidateEvaluation
    └── sample-data.ts         # Sample JD + 5 candidate resumes for instant demo

download/
├── ScreenWise-Pitch-Deck.pptx # ← The 6-slide submission deck
└── slides/                    # Editable HTML source for each slide
    ├── global.css             # Deck-wide design tokens (palette, typography)
    ├── slides_brief.json      # Manifest of all 6 slides
    ├── slide_01.html … slide_06.html
    ├── prototype-hero.png     # Empty-state screenshot
    └── prototype-results.png  # Ranked-results screenshot (used on slide 5)
```

---

## 7. Bias guardrails

- The system prompt explicitly instructs the model to judge on **skills, experience, scope, and trajectory only** — never on name, gender, age, religion, caste, or university prestige.
- Strong Fit is intentionally rare — calibration counteracts the LLM's tendency to be too polite.
- ScreenWise **recommends, never auto-rejects**. The recruiter makes every shortlist/pass decision.
- **Future work:** a bias-audit dashboard that tracks score distributions across name/gender proxies to detect drift over time.

---

## 8. Known limitations (honest list)

- **Paste-only input.** Real PDF/DOCX resume parsing is a v1.1 problem. The prototype accepts pasted text only.
- **Max 8 candidates per batch.** A practical ceiling for a single LLM call in a prototype. Production would batch + parallelize.
- **No persistence.** Refresh the page and the results are gone. A real product would save screening runs.
- **No ATS integration.** Outreach emails are copied to clipboard, not sent. Greenhouse/Lever integration is on the v1.1 roadmap.
- **Single-pass scoring.** Borderline candidates don't get a second-opinion pass yet.

---

## 9. What I'd build with another week

1. **Bias-audit dashboard** — track score distributions across demographic proxies, surface drift.
2. **Real PDF parsing** — drop a folder of resumes, not a paste buffer.
3. **Embeddings-based semantic skill matching** — so "TS" matches "TypeScript", "K8s" matches "Kubernetes".
4. **Greenhouse / Lever integration** — ranked list flows back into the ATS, outreach sends from the recruiter's inbox.
5. **Dual-pass scoring** on borderline calls (60–75 range) with a different prompt for a second opinion.
6. **Recruiter feedback loop** — when a recruiter overrides a score, that signal feeds back into prompt calibration.

---

## 10. Submission checklist

- [x] Presentation (max 6 slides) — `ScreenWise-Pitch-Deck.pptx`
- [x] Prototype link — preview panel (right side of the interface)
- [ ] GitHub repository — _push and add your URL here_
- [ ] Demo video (max 5 min, optional) — _record using the suggested flow in section 3_

---

_Built for the Embark Product & AI Intern assignment. ~5 hours of focused work. The hardest part wasn't the code — it was resisting the urge to over-build._
