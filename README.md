# PrepForge

**Build. Practice. Master.**

PrepForge is a personal interview-preparation and study platform built to turn scattered notes and flashcards into structured, measurable practice. The initial use case is Data Engineer interview preparation, with a focus on SQL, Python, AWS, data pipelines, data quality, system design, and behavioral interviewing.

## Why I built it

Interview preparation often lives across chats, documents, flashcards, and handwritten notes. PrepForge brings those workflows together and adds something traditional study tools usually miss: **spoken interview practice**.

## V1 features

- Dashboard with interview-readiness progress
- Category-based flashcards
- Know / Need Review tracking
- Search and filtering
- Editable study notes
- Active-recall quiz mode
- Voice mock interview mode using browser speech recognition
- Spoken interview questions using browser text-to-speech
- Lightweight answer feedback (word count / filler-word signals)
- Local browser persistence with `localStorage`
- Portfolio page for GitHub / LinkedIn / Handshake positioning
- Responsive desktop and mobile layout

## Tech stack

- React
- Vite
- JavaScript
- CSS
- Web Speech API
- SpeechSynthesis API
- LocalStorage
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Roadmap

- Secure authentication and cloud sync
- Adaptive spaced repetition
- Realtime AI voice interviewer
- Transcript-based technical and STAR feedback
- Role/job-post ingestion to create custom study tracks
- AI-generated follow-up interview questions
- Progress analytics and weak-topic recommendations
- Exportable session reports

## Portfolio summary

PrepForge demonstrates product design, frontend engineering, state persistence, browser audio capabilities, learning UX, and a roadmap for secure AI integration. The project was motivated by a real need: improving both technical recall and spoken interview performance for data engineering roles.
