// Import necessary modules
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { createExitSignal, staticServer } from "./shared/server.ts";
import { promptGPT } from "./shared/openai.ts";

// Create an instance of Application and Router
const app = new Application();
const router = new Router();

let correctAnswer;
let words;

// Route to generate and send words
router.get("/api/words", async (ctx) => {
  const gameRule = await promptGPT("Generate a list of exactly 4 words(not more, not less), where all four words has a similar meaning or belong in a same niche group. The last word is an odd one out, but in a subtle way. Output should only be 4 words, comma-separated. First letter of every word should be capitalized.");

  // Split and trim words, set them to global variable
  words = gameRule.split(",").map(word => word.trim());
  correctAnswer = words[words.length - 1]; // Set the last word as the odd one out

  //randomize the word position
  for (let i = words.length-1; i>0;i--){
    const j = Math.floor(Math.random()* (i+1));
    [words[i], words[j]] = [words[j], words[i]]
  }

  console.log("Generated words:", words);
  console.log("Correct answer:", correctAnswer);

  // Send only the words to the client
  ctx.response.body = { words };
});

// Route to check the user's answer
router.post("/api/check", async (ctx) => {
  try {
    const { userAnswer } = await ctx.request.body({ type: "json" }).value;
    const message = userAnswer === correctAnswer ? "Right!" : "Not Quite"; //show correct/ try again message
    

    // Get the reason for the odd one out
    const odds = await promptGPT(`Based on these 4 words: ${words.join(", ")}, write a short sentence on why ${correctAnswer} is the odd one out!`);

    console.log(`User answer: ${userAnswer}`);
    console.log("Correct answer:", correctAnswer);
    console.log("Reason for odd one out (odds):", odds);

    // Return message and explanation to client
    ctx.response.body = { message, odds };
  } catch (error) {
    console.error("Error in /api/check route:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal Server Error" };
  }
});

// Setup server
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log("Listening on http://localhost:8001");
await app.listen({ port: 8001, signal: createExitSignal() });