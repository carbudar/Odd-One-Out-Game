  let rightPoint = 0; 
  let countdownTimerId = null; // Global variable to track the timer

// Initialize the point counter and add it to the DOM
const pointCounter = document.querySelector('#point-counter')
pointCounter.textContent = `Points: ${rightPoint}`; // Set initial text

function startCountdown(duration) {
  const countdownBar = document.querySelector(".countdown");
  const timerConstantBar = document.querySelector(".timer-constant");
  const resultDiv = document.getElementById("result"); // Result display
  const reasonDiv = document.getElementById("reason"); // Explanation display

  // Clear any existing timer
  if (countdownTimerId) {
    clearInterval(countdownTimerId);
  }

  // Set the initial width of the countdown bar to match the constant bar
  const totalWidth = timerConstantBar.offsetWidth; // Get the width of the static bar
  countdownBar.style.width = totalWidth + "px"; // Set the initial width of the countdown bar

  // Calculate the width decrease per interval
  const interval = 10; // Interval in milliseconds
  const step = totalWidth / (duration * 1000 / interval); // Decrease width per interval

  let currentWidth = totalWidth; // Initialize current width

  // Start the countdown
  countdownTimerId = setInterval(() => {
    currentWidth -= step; // Decrease the width
    if (currentWidth <= 0) {
      currentWidth = 0; // Prevent negative width
      clearInterval(countdownTimerId); // Stop the interval when the countdown ends
      countdownTimerId = null; // Reset the timer ID

      // Show red overlay for timeout
      const messageElement = document.createElement("h3");
      messageElement.textContent = "Time's up!";
      messageElement.classList.add('result-style')
      messageElement.classList.add("redWrong", "answerOverlay");
      resultDiv.appendChild(messageElement);

      // Fetch new words after a delay
      setTimeout(() => {
        fetchWords(); // Fetch new set of words
        messageElement.classList.remove("redWrong", "answerOverlay"); // Remove red overlay
        resultDiv.innerHTML = ""; // Clear result
        reasonDiv.textContent = ""; // Clear explanation
      }, 2000); // Delay for 2 seconds before fetching new words
    }
    countdownBar.style.width = currentWidth + "px"; // Update the width of the countdown bar
  }, interval);
}



async function fetchWords() {
  const response = await fetch("/api/words");
  const data = await response.json();
  const words = data.words;
  
  const wordList = document.getElementById("word-list");
  wordList.innerHTML = ""; // Clear previous words
  words.forEach(word => {
    const wordButton = document.createElement("button");
    wordButton.textContent = word;
    wordButton.classList.add("word-option")
    wordButton.onclick = () => submitAnswer(word);
    wordList.appendChild(wordButton);
  });
  clearInterval();
  startCountdown(20);

}

async function submitAnswer(selectedWord) {
  const resultDiv = document.getElementById("result");
  const reasonDiv = document.getElementById("reason");
  
  // Show loading message
  resultDiv.textContent = "Checking answer...";
  reasonDiv.textContent = ""; // Clear any previous explanation

  const response = await fetch("/api/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userAnswer: selectedWord })
  });

  const result = await response.json();

  // Clear previous content
  resultDiv.innerHTML = ""; 

  // Create an <h3> element for the message
  const messageElement = document.createElement("h3");
  messageElement.textContent = result.message;
  messageElement.classList.add('result-style')

  // Add a class to the <h3> element

  // if (result.message === "Correct!") {
  //   messageElement.classList.add("correct-message");
  // } else {
  //   messageElement.classList.add("try-again-message");
  // }


  let greenCorrect = document.querySelector('.greenCorrect')
  if (result.message === "Right!") {
    messageElement.classList.add("greenCorrect");
    messageElement.classList.add("answerOverlay");
    
    rightPoint++;
    pointCounter.textContent = `Points: ${rightPoint}`;

    setTimeout(() => {
       fetchWords()
       messageElement.classList.remove("greenCorrect");
       resultDiv.innerHTML = ""; // Clear result
       reasonDiv.textContent = ""; // Clear explanation
    }, 1000);
  } else {
    messageElement.classList.add("redWrong");
    messageElement.classList.add("answerOverlay");
    setTimeout(() => {
       fetchWords()
       messageElement.classList.remove("redWrong");
       resultDiv.innerHTML = ""; // Clear result
       reasonDiv.textContent = ""; // Clear explanation

    }, 1000);
  }


  // Append the styled <h3> to the result div
  resultDiv.appendChild(messageElement);
  
  // If the explanation exists, show it
  if (result.odds) {
      reasonDiv.textContent = result.odds;
    }


  // if(result.message){
  // let nextButton = document.createElement("button")
  //   nextButton.textContent = "next words";
  //   nextButton.classList.add("next-button")
  //   nextButton.onclick = nextButton.onclick = async () => {
  //     resultDiv.innerHTML = ""; // Clear result
  //     reasonDiv.textContent = ""; // Clear explanation
  //     await fetchWords(); // Fetch new words
  // };
  // resultDiv.appendChild(nextButton);

  // }
}


fetchWords();

const landingTitle = document.querySelector('.landing-title')
const h1Landing = document.createElement("h1")
const tagLineLanding = document.createElement("h3")

h1Landing.innerHTML = "Odd Fellow Says Hello";
tagLineLanding.innerHTML = "One’s a little different—can you spot the Odd Fellow?"
tagLineLanding.style.fontStyle = "italic"

landingTitle.appendChild(h1Landing);
landingTitle.appendChild(tagLineLanding);


setTimeout(() => {

  landingTitle.remove();

  // landingPage.classList.add('landing-scroll')
  console.log("Delayed for 4 second.");
}, 1000);



