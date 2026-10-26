# PrepForge — Start Here

## 1) Open the project

Open the `prepforge-v1` folder in VS Code.

## 2) Install dependencies

```bash
npm install
```

## 3) Start locally

```bash
npm run dev
```

Vite will print a local URL such as `http://localhost:5173`.

## 4) What to test first

- Dashboard progress cards
- Flashcards: reveal, Know It, Need Review
- Add a flashcard
- Notes: edit an existing note or add a new one
- Quiz mode
- Voice Interview: hear the question, start speaking, stop, evaluate
- Progress history
- Portfolio page

## 5) Important note about V1 voice

V1 uses the browser Web Speech API. Chrome-based browsers provide the best chance of speech-recognition support. Audio is not saved by the app. If voice recognition is unavailable, type the answer into the same interview panel.

## 6) GitHub

Recommended repository name:

`prepforge`

Suggested repository description:

`Interview study platform with flashcards, notes, quizzes, progress tracking, and voice mock interviews. Built with React + Vite.`

After creating an empty GitHub repository:

```bash
git init
git add .
git commit -m "Build PrepForge V1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prepforge.git
git push -u origin main
```

## 7) Public portfolio use

See `PORTFOLIO_COPY.md` for ready-to-use LinkedIn and Handshake project descriptions.
