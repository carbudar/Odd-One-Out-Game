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
  
    // Add a class to the <h3> element
    if (result.message === "Correct!") {
      messageElement.classList.add("correct-message");
    } else {
      messageElement.classList.add("try-again-message");
    }
  
    // Append the styled <h3> to the result div
    resultDiv.appendChild(messageElement);
    
    // If the explanation exists, show it
    if (result.odds) {
        reasonDiv.textContent = result.odds;
      }


    if(result.message){
    let nextButton = document.createElement("button")
      nextButton.textContent = "next words";
      nextButton.classList.add("next-button")
      nextButton.onclick = nextButton.onclick = async () => {
        resultDiv.innerHTML = ""; // Clear result
        reasonDiv.textContent = ""; // Clear explanation
        await fetchWords(); // Fetch new words
    };
    resultDiv.appendChild(nextButton);

    }
  }
  

  fetchWords();