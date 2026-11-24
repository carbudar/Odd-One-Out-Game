import { promptGPT, seal } from "../lib/game.js";

export async function GET() {
  try {
    const raw = await promptGPT(
      "Generate a list of exactly 4 words(not more, not less), where all four words has a similar meaning or belong in a same niche group. The last word is an odd one out, but in a subtle way. Output should only be 4 words, comma-separated. First letter of every word should be capitalized.",
    );
    const words = raw.split(",").map((w) => w.trim()).filter(Boolean);
    if (words.length !== 4) {
      return Response.json({ error: "Bad word list, try again" }, { status: 502 });
    }
    const answer = words[words.length - 1];
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    return Response.json({ words, token: await seal({ words, answer }) });
  } catch (err) {
    console.error("/api/words error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
