# SymptomCare 🩺

AI-powered healthcare assistant that suggests the right specialist based on your symptoms and shows real nearby clinics/hospitals — built as a 10-day capstone for the AB Talks 60-Day Claude AI Challenge.

## What it does
- Describe your symptoms in free text (Hindi or English)
- AI suggests a likely specialist type + possible condition
- Emergency warning if symptoms indicate urgent care is needed
- Real nearby clinic/hospital search via Google Places API

## Status
🟡 **Day 4/10 — In Progress**
- **Day 1:** Problem discovery, target users defined, PRD finalized, 9-day implementation blueprint created.
- **Day 2:** Tech stack finalized, system architecture designed, database decision documented (none needed for v1.0), API contracts defined, UI wireframes created, project folder structure planned.
- **Day 3:** Static UI layout built (HTML/CSS/JS) with placeholder data — symptom input, results section, emergency banner, city selector, clinic cards, disclaimer footer.
- **Day 4 (in progress):** Backend serverless function (`api/analyze-symptoms.js`) and frontend (`script.js`) written for real AI-powered symptom analysis. Testing and deployment pending — to be completed on laptop.

## Tech Stack
HTML/CSS/JS · Vercel (hosting + serverless functions) · Google Gemini API (symptom analysis) · Google Places API (nearby clinics)

*Note: Originally planned to use the Claude API per the project blueprint; switched to Google Gemini API due to a free-tier billing constraint. See project docs for details.*

## Disclaimer
SymptomCare does not provide medical diagnosis. It offers general guidance only. Always consult a qualified doctor. If you are experiencing a medical emergency, contact your local emergency services immediately.

## Docs
See the repo root for the full PRD, implementation blueprint, pitch deck, architecture, schema, API design, wireframes, and project structure documents.

---
Built as part of the **AB Talks 60-Day Claude AI Challenge**.
