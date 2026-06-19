# Project Worklog — ScreenWise Prototype (Embark Product & AI Intern Assignment)

---
Task ID: 0
Agent: main (orchestrator)
Task: Read assignment PDF, design product concept, and orchestrate build of (1) working AI prototype, (2) 6-slide humanized pitch deck, (3) README for submission.

Work Log:
- Extracted text from `/home/z/my-project/upload/Product & AI Intern Assignment.pdf` (2 pages, 2631 chars).
- Assignment summary: Build AI-powered solution for any part of recruitment lifecycle. Deliverables = 6-slide deck (Problem / Solution / AI Approach / Prototype / Reflection) + working prototype link + optional GitHub + optional demo video.
- Decided product concept: **"ScreenWise"** — AI Resume-to-JD Fitment Copilot. Recruiter pastes JD + pastes a batch of resumes → AI ranks candidates with explainable fitment scores, red flags, and one-click personalized outreach drafts. Cuts screening time from hours to minutes per role.
- Color system: emerald/slate/amber (avoiding blue/indigo per UI rules).

Stage Summary:
- Concept locked: ScreenWise, AI fitment-scoring copilot for recruiters.
- Will build: Next.js 16 prototype (1 route `/`), z-ai-web-dev-sdk backend, 6-slide PPTX, README.
- Subsequent task IDs: 1 (frontend), 2 (backend API), 3 (sample data + assets), 4 (browser verification), 5 (pptx deck), 6 (README + final delivery).

---
Task ID: 4
Agent: main (orchestrator)
Task: Verify ScreenWise prototype works end-to-end with agent-browser.

Work Log:
- Opened http://localhost:3000 — page rendered cleanly, no console errors, no hydration warnings.
- Clicked "Load sample data" — JD + 5 resumes populated instantly, toast confirmed.
- Clicked "Run AI fitment analysis" — phased loading UI appeared (Parse JD → Read resumes → Score → Draft outreach).
- AI completed in ~30s. 5 candidate cards rendered with correct, calibrated output:
  • Aarav Mehta → Strong Fit (Node.js + Postgres + fintech, 6 yrs) ✓
  • Priya Nair → Possible Fit (Java/Spring, wants Node pivot) ✓
  • Kavya Iyer → red flags surfaced (4 jobs in 4 years) ✓
  • Rohan Desai, Aditya Rao → lower scores (frontend/mobile, stretch) ✓
- Tested tab interactivity: Overview / Skills gap / Outreach email all switch correctly.
- Tested Copy email button — works.
- Captured screenshots: preview-hero.png (empty state) and preview-results.png (ranked results).
- No runtime errors in console.

Stage Summary:
- Prototype is browser-verified end-to-end. Golden path works.
- AI calibration is correct: Strong Fit is rare, red flags are surfaced, outreach emails are personalized.
- Ready to build the 6-slide pitch deck and README.

---
Task ID: 5-pptx
Agent: ppt-expert
Task: Render all 6 slides of the ScreenWise pitch deck as standalone 1280x720 HTML files in /home/z/my-project/download/slides/, using the locked emerald/slate/amber design system from global.css and the verbatim content from slides_brief.json.

Work Log:
- Read /home/z/my-project/worklog.md to confirm prototype is browser-verified and ready for the deck (Task ID 4).
- Read /home/z/my-project/download/slides/slides_brief.json (design block + 6 slide briefs) and /home/z/my-project/download/slides/global.css (palette, typography, component classes).
- Verified prototype-results.png exists in /home/z/my-project/download/slides/ for slide 5's relative-path image reference.
- Rendered all 6 slides as standalone HTML files linking global.css + Tailwind CDN + Material Icons. Each slide is wrapped in .slide (1280x720, overflow-hidden), uses ONLY the locked palette/typography, embeds 4-5 line human-sounding speaker notes as <aside data-notes hidden>, and includes the .slide-footer (brand left, page number right).
- Diversified layouts per the briefs: slide 1 = headline + 2x2 supporting cards + italic personal quote; slide 2 = 55/45 split (numbered workflow left, 5 icon feature cards right); slide 3 = before/after cards + assumptions/expected-impact side-by-side; slide 4 = 3-column tall cards with colored top accent strips (emerald/amber/slate); slide 5 = 58/42 split with relative-path screenshot + callouts + stack pills + try-it card; slide 6 = 2x2 reflection grid (mix of card / card-amber / card-emerald) + emerald-bordered personal note bar.
- Verbatim fidelity: every headline, subhead, bullet, stat, quote, and image URL from task_brief is rendered exactly as written (apostrophes unescaped, em dashes preserved, ≥ / → / --- literals kept). No invented facts, no dropped lines, no paraphrasing of stats.
- Slide 5 image: used <img src="prototype-results.png"> with a relative path as instructed — no absolute path, no remote URL.
- Slide 6 footer: added the requested "Thank you — looking forward to the conversation." italic micro line next to the page number.

One-line per-slide summary:
- slide_01.html — Problem Understanding: headline "Recruiters are drowning in resumes — and missing great candidates." + 2x2 grid (Volume vs. bandwidth / Who it hurts / Time-to-hire = revenue / Minutes, not hours) + italic personal-quote closer.
- slide_02.html — Product Solution (1/2): split layout — 4-step numbered workflow (Paste JD+resumes → Parse JD → Score on 5-signal rubric → Ranked dashboard+outreach) on the left, 5 Material-icon feature cards (Rubric, Explainable, Red-flag surfacing, Personalized outreach, Bias guardrails) on the right.
- slide_03.html — Product Solution (2/2): before/after journey cards (5 hrs manual → 45 min ScreenWise) + amber-accented Assumptions card + emerald Expected-impact card with 4 stats (~85%, 4.5 hrs, Higher, 100%).
- slide_04.html — AI Approach: 3 equal columns with colored top strips — Model & tools (emerald) / How AI is used with arrow rows (amber) / Quality & reliability with 6 bullets incl. calibration + bias guardrails (slate) — closed with the "Strong Fit should be rare" italic quote.
- slide_05.html — Prototype: 58/42 split — left has the relative-path prototype-results.png screenshot with caption, right has What-it-does bullets + Stack pill row + emerald Try-it card with live preview and GitHub link rows.
- slide_06.html — Reflection: 2x2 grid (AI tools I used / How AI helped / Biggest challenge in card-amber / If I had another week in card-emerald with 4 bullets) + full-width emerald-bordered personal note bar + footer with thank-you micro line.

Stage Summary:
- All 6 slides written to /home/z/my-project/download/slides/slide_01.html through slide_06.html.
- Each is a self-contained 1280x720 HTML page, links global.css relatively, loads Tailwind + Material Icons, follows the emerald/slate/amber + Inter/JetBrains Mono design system, and embeds hidden speaker notes.
- Verbatim content fidelity verified against slides_brief.json — no facts dropped or invented.
- Deck is ready to bundle with the prototype and README for final delivery (Task ID 6).

---
Task ID: 6
Agent: main (orchestrator)
Task: Finalize submission package — pptx deck, README, final delivery summary.

Work Log:
- Verified all 6 slide HTMLs rendered cleanly via VLM (slide 1: "clean and readable, professional, suitable for job application"; slide 5: "screenshot visible and rendered, layout balanced, no overflow").
- Converted slides to PPTX via batch_html2pptx.js → /home/z/my-project/download/ScreenWise-Pitch-Deck.pptx (333 KB, no CRITICAL OVERFLOW warnings).
- Wrote /home/z/my-project/download/README.md with: deliverables table, 90-second demo flow, suggested 5-min video flow, 5-signal rubric table, tech stack, project structure, bias guardrails, honest limitations list, "another week" roadmap, submission checklist.
- Final lint: clean. Dev log: POST /api/screen 200 in 25.8s confirms live AI call works end-to-end.

Stage Summary:
- Submission package complete:
  • /home/z/my-project/download/ScreenWise-Pitch-Deck.pptx — 6-slide humanized pitch deck with speaker notes
  • /home/z/my-project/download/README.md — full submission guide
  • /home/z/my-project/download/slides/ — editable HTML slide source
  • Live prototype at the preview panel (/ route) — browser-verified end-to-end
- The pitch deck is written in a humanized first-person voice (not AI-sounding): includes personal observations like "I picked this problem because I've watched friends on both sides" and honest reflection like "The first prompt gave almost everyone 75+. The model wasn't dumb — it was being too polite."
- Ready to deliver to user.
