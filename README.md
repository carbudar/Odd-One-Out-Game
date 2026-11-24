# Odd Fellow Says Hello

A word game for all ages: GPT picks 4 words from the same group with one subtle odd one out, and you find it.

- `public/` — the game (HTML, CSS, JS)
- `api/words.js` — asks GPT for a new set of 4 words
- `api/check.js` — checks the answer and asks GPT to explain why
- `lib/game.js` — shared OpenAI + round-token helpers

## Deploy on Vercel

1. Push this folder to GitHub.
2. On vercel.com: **Add New → Project**, import the repo. Framework preset: **Other**. Leave build settings empty.
3. Under **Environment Variables**, add `OPENAI_API_KEY` (your OpenAI key).
4. Click **Deploy**.

Optional: `OPENAI_MODEL` (defaults to `gpt-4o-mini`).
