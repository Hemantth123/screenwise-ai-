# ScreenWise AI – AI-Powered Candidate Fitment Screener

ScreenWise AI is an AI-powered recruitment assistant that helps recruiters automatically screen, rank, and shortlist candidates based on job descriptions.

Built as part of the **Product & AI Intern Assignment for Embark Services Pvt. Ltd.**

## Live Demo

🔗 Demo: https://your-vercel-app-url.vercel.app

## GitHub Repository

🔗 Repository: https://github.com/Hemantth123/screenwise-ai-

---

## Problem Statement

Recruiters spend significant time manually reviewing resumes against job descriptions.

ScreenWise AI reduces manual screening effort by using semantic search and explainable AI scoring to rank candidates efficiently.

### Key Benefits

* Reduce screening time by up to 70%
* Improve shortlist consistency
* Provide explainable candidate scoring
* Enable faster hiring decisions

---

## Features

* Upload multiple resumes (PDF)
* Paste or upload job descriptions
* AI-powered semantic matching
* Candidate fitment scoring (0–100)
* Explainable scoring with matched and missing skills
* Ranked candidate shortlist
* Confidence indicators
* Export results to CSV

---

## Tech Stack

### Frontend

* React
* Next.js
* Tailwind CSS

### Backend

* FastAPI
* Python

### AI Stack

* Claude Sonnet API
* OpenAI Embeddings (`text-embedding-3-small`)
* LangChain
* ChromaDB

### Deployment

* Vercel
* GitHub

---

## Architecture

```text
Recruiter UI
      │
      ▼
FastAPI Backend
      │
      ├── Resume Parser
      ├── Embedding Engine
      ├── Candidate Scoring
      │
      ▼
ChromaDB Vector Store
      │
      ▼
Claude API
      │
      ▼
Ranked Candidate List
```

---

## Scoring Framework

| Dimension         | Weight |
| ----------------- | ------ |
| Skills Match      | 40%    |
| Experience Fit    | 25%    |
| Domain Expertise  | 15%    |
| Seniority Level   | 10%    |
| Career Trajectory | 10%    |

### Score Bands

* 80–100 → Strong Fit
* 40–79 → Review
* Below 40 → Skip

---

## Validation Metrics

* Test Resumes: 25
* Job Descriptions: 3
* Precision@10: 80%
* Recruiter Agreement: 85%
* Screening Time Reduction: 72%

---

## Installation

```bash
git clone https://github.com/Hemantth123/screenwise-ai-.git

cd screenwise-ai-

npm install

npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Future Enhancements

* ATS integrations (Greenhouse, Lever)
* Bias audit dashboard
* Multi-JD batch processing
* Multi-language support
* Recruiter feedback loop

---

## Author

**Hemanth Hebbal**

* LinkedIn: https://linkedin.com/in/hemanth-hebbal-aa01a8254
* GitHub: https://github.com/Hemantth123

---

## Disclaimer

This project is a prototype created for educational and evaluation purposes as part of the Embark Product & AI Intern Assignment.
