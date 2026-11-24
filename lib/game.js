// Shared helpers for the API routes (Vercel serverless functions).
import OpenAI from "openai";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
let client;

export async function promptGPT(prompt) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");
  client ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined, // only used for testing
  });
  const res = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 128,
    messages: [{ role: "user", content: prompt }],
  });
  return (res.choices[0].message.content ?? "").trim();
}

// Each round's words + answer are encrypted into a token the browser holds and
// sends back, so the server stores nothing (serverless functions have no memory
// between requests) and players can't see the answer.
async function getKey() {
  const secret = process.env.ROUND_SECRET || process.env.OPENAI_API_KEY;
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function seal(data) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, await getKey(),
    new TextEncoder().encode(JSON.stringify(data)),
  );
  return Buffer.from(iv).toString("base64") + "." + Buffer.from(ct).toString("base64");
}

export async function open(token) {
  const [iv, ct] = String(token).split(".");
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: Buffer.from(iv, "base64") }, await getKey(),
    Buffer.from(ct, "base64"),
  );
  return JSON.parse(new TextDecoder().decode(pt));
}
