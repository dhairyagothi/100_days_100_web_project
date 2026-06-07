# Interview Simulator

A vanilla JavaScript interview practice app with AI-generated questions, timed responses, voice input, stress tracking, and final performance evaluation.

## Features

- AI-generated interview questions using Groq when a valid API key is configured.
- Fallback interview questions when Groq is not configured or the API request fails.
- Role, difficulty, and interview-type based question generation.
- Voice input with the Web Speech API.
- Timed response window with stress tracking.
- Low-effort answer detection for empty, very short, repetitive, filler, or keyboard-mashing responses.
- Local confidence scoring when Groq evaluation is unavailable.
- AI evaluation with relevance and correctness checks when Groq is configured.
- Final response breakdown with answer feedback.
- Interview history stored in local storage.
- Responsive glassmorphism UI.

## Groq API Key Setup

The app loads API configuration from `config.js`:

```html
<script src="config.js"></script>
```

For trial or local testing, create or update `config.js` in this folder:

```js
const CONFIG = {
    GROQ_API_KEY: "your_real_groq_key_here",
    GROQ_API_URL: "https://api.groq.com/openai/v1/chat/completions",
    MODEL: "llama-3.3-70b-versatile"
};
```

Important:

- Put the real API key in `config.js`.
- Do not put the real API key in `config.example.js`.
- `config.example.js` is only a safe template for contributors.
- `config.js` is listed in `.gitignore`, so it should stay local and should not be committed.
- After changing the key, hard refresh the browser to clear cached JavaScript.

If `config.js` is missing, still uses `YOUR_KEY`, or the Groq request fails, the app will continue with fallback questions and local evaluation.

## How Evaluation Works

When Groq is configured:

- Questions are generated according to selected role, difficulty, and interview type.
- Final evaluation checks whether each answer actually addresses its question.
- Groq returns relevance score, correctness score, answered-question status, and feedback.

When Groq is unavailable:

- The app uses fallback questions.
- Local scoring checks answer length, low-effort patterns, unanswered questions, stress, and basic question-term relevance.
- Local scoring does not verify factual correctness; it is only a fallback quality check.

## Setup Instructions

The Web Speech API works best in a secure context such as `localhost` or HTTPS. For microphone support, avoid opening the HTML file directly from the filesystem.

### Prerequisites

- Node.js installed.
- A modern browser such as Google Chrome or Microsoft Edge.
- A Groq API key for AI-generated questions and AI answer evaluation.

### Run Locally

1. Navigate to the project folder:

```bash
cd public/InterviewSimulator
```

2. Create `config.js` from the example if needed:

```bash
cp config.example.js config.js
```

On Windows PowerShell:

```powershell
Copy-Item config.example.js config.js
```

3. Add your Groq API key to `config.js`.

4. Start a local server:

```bash
npx serve .
```

You can also use the VS Code Live Server extension.

5. Open the localhost URL shown by the server, commonly:

```text
http://localhost:3000
```

6. Grant microphone permission if you want to use voice input.

## Testing Checklist

- Start the app with a valid `config.js` key and verify Groq-generated questions match the selected role, difficulty, and interview type.
- Replace the key with `YOUR_KEY` and verify fallback questions still allow the interview to continue.
- Submit an answer like `xyz`, `aaa`, or `test` and verify the low-effort warning appears.
- Continue with a low-effort answer and verify stress increases.
- Submit meaningful answers and verify confidence scoring improves.
- Complete an interview and confirm the final modal shows confidence, evaluation assessment, response breakdown, and per-answer `Answer Check` feedback.
- Test voice input on `localhost` and confirm the warning flow does not block active voice recording.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Web Speech API
- Groq chat completions API
- Font Awesome
- Google Fonts
