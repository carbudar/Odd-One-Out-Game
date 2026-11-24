import { open, promptGPT } from "../lib/game.js";

export async function POST(request) {
  try {
    const { userAnswer, token } = await request.json();
    const { words, answer } = await open(token);
    const message = userAnswer === answer ? "Right!" : "Not Quite";
    const odds = await promptGPT(
      `Based on these 4 words: ${words.join(", ")}, write a short sentence on why ${answer} is the odd one out!`,
    );
    return Response.json({ message, odds });
  } catch (err) {
    console.error("/api/check error:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
