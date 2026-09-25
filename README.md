# StudyFlow AI - Interactive AI Study Assistant

StudyFlow AI is a React study assistant that converts free-form notes, textbook excerpts, or study topics into structured, interactive study materials (flashcards and practice quizzes).

---

## AI Failure Handling & Production Reliability (Phase 6)

StudyFlow AI incorporates production-grade error shielding, validation, and race-condition safety so that the application never crashes due to bad AI data, network drops, or slow provider responses.

### Handled Failure Scenarios Matrix

| Scenario | HTTP Status | Error Code | Behavior / Recovery |
| :--- | :--- | :--- | :--- |
| **Empty / Whitespace Input** | None (Client-side) | `VALIDATION_ERROR` | Request blocked before backend call; input preserved in textarea. |
| **Input > 10,000 Chars** | `400` | `INVALID_INPUT` | Friendly error prompt; user input preserved for editing. |
| **Invalid / Missing API Key** | `400 / 500` | `INVALID_API_KEY` | Controlled error explaining `backend/.env` key requirement. |
| **Rate Limit / Quota** | `429` | `RATE_LIMIT_EXCEEDED` | Prompts user to wait a moment before retrying. |
| **Malformed AI Output / Schema Fail** | `502` | `AI_INVALID_OUTPUT` | Strict Zod validation rejects invalid JSON or bad shapes. |
| **Empty AI Response** | `502` | `AI_EMPTY_RESPONSE` | Prevents empty text parsing errors; friendly retry prompt. |
| **Gemini Timeout (>60s)** | `504` | `AI_TIMEOUT` | Prevents hanging loading states; auto-restores UI with `[Try Again]`. |
| **Backend Unreachable / Network Drop** | None / `500` | `NETWORK_ERROR` | Shields stack traces; returns *"We couldn't reach the study service."* |

---

## Architectural Protections

1. **Stale Response Protection & Race-Condition Safety:**
   - Every request is tagged with a unique generation counter (`requestId`).
   - Starting a new generation immediately aborts previous in-flight requests using `AbortController`.
   - Late or stale responses from older requests are silently ignored and cannot overwrite newer active results.

2. **Input Preservation:**
   - On any failure, user text in the textarea is strictly preserved.
   - The user can click **[Try Again]** to resubmit immediately without typing again.

3. **Defensive Response Shape Verification:**
   - Frontend service (`studyApi.ts`) safely parses JSON text and validates that `data.cards` and `data.quiz` arrays exist with valid lengths before attempting to render components.

4. **Security & Data Shielding:**
   - `GEMINI_API_KEY` exists exclusively on the Express backend server (`backend/.env`).
   - Centralized Express Error Middleware (`error.middleware.ts`) suppresses all stack traces and internal configuration from API responses.

---

## Technology Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, Lucide Icons, AbortController
- **Backend:** Node.js, Express, TypeScript, `@google/genai` (Google GenAI SDK), `zod` (runtime schema validation), `dotenv`
- **AI Model Chain:** `gemini-2.5-flash` &rarr; `gemini-2.0-flash` &rarr; `gemini-1.5-flash`

---

## Setup & Local Execution

### 1. Environment Setup
Create `backend/.env` and insert your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey):
```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here...
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
```

### 2. Start Servers
```bash
# Backend (Port 5000)
npm run dev:backend

# Frontend (Port 3000)
npm run dev:frontend
```

Open `http://localhost:3000` in your browser.
