# StudyFlow AI

An interactive AI-powered study assistant that transforms free-form lecture notes, articles, or any study topic into structured, interactive study materials including flashcards, practice quizzes, and targeted mistake retries.

---

## Overview

**StudyFlow AI** helps students convert unstructured study materials into effective learning tools. Powered by Google Gemini AI, it generates concise summaries, interactive flip-cards with recall tracking, and multiple-choice quizzes with instant feedback. It includes a specialized **Retry Mode** to let users isolate and re-test only the questions they answered incorrectly until full mastery is achieved.

---

## Features

- **AI Study Material Generation:** Instantly turns raw text or topics into structured titles, summaries, flashcards (3–10), and quiz questions (3–10).
- **Interactive Flashcards:** Smooth front-and-back flip animations with "Got it" / "Need review" tracking and keyboard arrow navigation.
- **Multiple-Choice Quiz:** Interactive quiz with immediate correctness feedback, option highlighting, and detailed explanations for every answer.
- **Targeted Wrong-Answer Retry Mode:** Filter and retake only the questions missed in previous quiz attempts until achieving a 100% score.
- **Race Condition & Abort Safety:** Uses `AbortController` to cancel in-flight API requests when a new topic is submitted, preventing stale response overwrites.
- **Production-Grade Error Shielding:** Built-in safeguards for API key errors, rate limits, timeouts (>60s), schema mismatches, and network drops without breaking the UI or losing user input.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons
- **Backend:** Node.js, Express, TypeScript, `@google/genai` (Google GenAI SDK), `zod` (runtime schema validation), `dotenv`, `cors`
- **AI Engine:** Google Gemini SDK (`gemini-2.5-flash` with automatic fallback to `gemini-2.0-flash` & `gemini-1.5-flash`)
- **Deployment:** Render (Backend Web Service & Frontend Hosting)

---

## Architecture

```
[ Frontend (React + Vite) ]
          │
          │ HTTP POST /api/study/generate
          ▼
[ Backend Proxy (Express + Node.js) ]
          │
          ├─► 1. Validate Input (Zod)
          ├─► 2. Enforce JSON Schema & Prompts
          ▼
[ Google Gemini API (`@google/genai`) ]
          │
          ▼
[ Backend Proxy (Express + Node.js) ]
          │
          ├─► 3. Validate AI Response (Zod)
          ▼
[ Frontend Render: Flashcards + Quiz + Retry ]
```

- **API Key Security:** `GEMINI_API_KEY` lives exclusively on the backend server. No secrets are exposed to client browsers.
- **Strict Response Validation:** AI output is enforced via Google GenAI `responseSchema` and double-checked at runtime using Zod validation schemas.
- **Centralized Error Handling:** Express error middleware catches errors, normalizes responses to `{ success: false, error: { code, message } }`, and strips sensitive stack traces.

---

## How It Works

1. **Input Submission:** User enters a study topic or pastes lecture notes (10 to 10,000 characters).
2. **API Request:** Frontend calls `POST /api/study/generate` with abort signal support.
3. **Backend Processing:** Backend validates request parameters, calls Gemini API with structured output configuration, and validates returned JSON schema.
4. **Interactive Learning:** Frontend renders:
   - Summary overview banner.
   - Interactive flashcards deck.
   - Multiple-choice practice quiz.
5. **Targeted Mastery:** If the user misses any quiz questions, clicking **"Retry Wrong Answers"** generates a targeted test containing only the missed items.

---

## Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Gemini API Key:** Free key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone Repository
```bash
git clone https://github.com/kavitha308/flam_studyAssistant.git
cd flam_studyAssistant
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Start Development Servers

```bash
# Terminal 1: Run Backend (Port 5000)
cd backend
npm run dev

# Terminal 2: Run Frontend (Port 3000)
cd frontend
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Environment Variables

### Backend Environment (`backend/.env`)
Create a `.env` file inside the `backend/` directory:

```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here...
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
```

### Frontend Environment (`frontend/.env`)
Create a `.env` file inside the `frontend/` directory (optional for local dev as it defaults to `/api` proxy):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production deployment (e.g. Render/Vercel):
```env
VITE_API_BASE_URL=https://flam-studyassistant.onrender.com/api
```

---

## Usage

1. **Generate Material:** Paste study text or type a topic in the text box (e.g. *"Photosynthesis and Plant Cellular Respiration"*). Click **Generate Study Material**.
2. **Review Flashcards:** Click cards to flip between question and answer. Use **"Need Review"** or **"Got It"** buttons to track card mastery.
3. **Take Quiz:** Select answers for each question. View instant feedback and explanations.
4. **Retry Wrong Answers:** Click **Retry Wrong Answers** after completing the quiz to retake only the questions you missed until you reach a 100% score.

---

## AI Usage

Be honest:

AI tools (including ChatGPT) were used for development assistance, including project scaffolding, debugging, implementation guidance, and reviewing error-handling approaches. All generated code was reviewed, tested, and integrated into the application.

---

## Error Handling

StudyFlow AI includes production-grade error shielding to gracefully handle real-world failures:

| Scenario | HTTP Status | Error Code | Behavior & Recovery |
| :--- | :--- | :--- | :--- |
| **Empty Input** | Client-side | `VALIDATION_ERROR` | Blocked before backend call; input preserved in textarea. |
| **Input > 10,000 Chars** | `400` | `INVALID_INPUT` | User-friendly notification; input preserved for editing. |
| **Invalid / Missing API Key** | `400 / 500` | `INVALID_API_KEY` | Clear diagnostic message pointing to key configuration. |
| **Rate Limit / Quota** | `429` | `RATE_LIMIT_EXCEEDED` | Asks user to wait a moment before trying again. |
| **Malformed AI Output** | `502` | `AI_INVALID_OUTPUT` | Strict Zod validation rejects invalid JSON; provides retry option. |
| **Empty AI Response** | `502` | `AI_EMPTY_RESPONSE` | Prevents empty JSON parse crashes. |
| **Gemini Timeout (>60s)** | `504` | `AI_TIMEOUT` | Prevents infinite loading state; auto-restores UI with `[Try Again]`. |
| **Endpoint Not Found** | `404` | `NOT_FOUND_404` | Explains API URL misconfiguration (`VITE_API_BASE_URL`). |
| **Network Drop** | Client-side | `NETWORK_ERROR` | Friendly network loss notification with input preservation. |

---

## Known Limitations

- **Text-Only Inputs:** Uploading large raw binary files (PDFs, Images, audio) is not natively integrated; text must be copied and pasted into the input field.
- **Free Tier Rate Limits:** Google Gemini free tier APIs are subject to 15 requests/minute limits. High-frequency rapid requests may trigger rate limit errors.

---

## Testing

### AI Failure Scenario Simulation Mode
The backend includes a dev-only testing pipeline allowing developers to simulate AI failure modes without depleting API quota.

To enable, set `AI_TEST_MODE=true` in `backend/.env` and pass `x-ai-test-scenario` in headers:
- `malformed-json` (tests invalid JSON handling)
- `missing-cards` (tests missing array properties)
- `invalid-card` (tests card schema violation)
- `invalid-quiz-options` (tests array length constraints)
- `empty-response` (tests 0-byte AI response)
- `semantic-invalid` (tests out-of-bounds quiz index values)

### Verification Commands
```bash
# Build frontend TypeScript & Vite bundle
cd frontend && npm run build

# Build backend TypeScript
cd backend && npm run build
```

---

## Deployment

### Backend (Render Web Service)
- **Environment:** Node.js
- **Build Command:** `npm run build` (or `npm install`)
- **Start Command:** `npm start`
- **Environment Variables:** `GEMINI_API_KEY`, `PORT`, `GEMINI_MODEL`

### Frontend (Render Static Site / Vercel)
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:** `VITE_API_BASE_URL=https://flam-studyassistant.onrender.com/api`

---

## Time Spent

- **Total Estimated Time:** ~8–10 hours
- **Breakdown:**
  - Architecture & Scaffolding: 1.5 hours
  - Gemini API Integration & Zod Schemas: 2 hours
  - Interactive UI Components & Flashcard Animations: 2.5 hours
  - Quiz State & Wrong-Answer Retry Engine: 2 hours
  - Error Shielding, Race-Condition AbortController & Deployment: 2 hours
