document.addEventListener("DOMContentLoaded", () => {
  // Get the deck name from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const deckName = urlParams.get("deck");

  // Retrieve decks from localStorage
  const decks = JSON.parse(localStorage.getItem("decks")) || {};
  const customCards = decks[deckName] || [];

  // Set the deck title
  document.getElementById("deck-title").textContent = `${deckName} Flashcards`;

  if (customCards.length > 0) {
    // If the deck is a custom deck, load its cards
    let currentCardIndex = 0;

    function displayFlashcard() {
      const card = customCards[currentCardIndex];
      const flashcardsContainer = document.getElementById("flashcards");
      flashcardsContainer.innerHTML = `
        <div class="flashcard">
          <p id="question"><strong>Question:</strong> ${card.question}</p>
          <button id="show-answer-btn">Show Answer</button>
          <p id="answer" style="display: none;"><strong>Answer:</strong> ${card.answer}</p>
        </div>
      `;
      // Add event listener to the "Show Answer" button
      const showAnswerBtn = document.getElementById("show-answer-btn");
      const answerElement = document.getElementById("answer");
      showAnswerBtn.addEventListener("click", () => {
        answerElement.style.display = "block";
        showAnswerBtn.style.display = "none"; // Optionally hide the button after showing the answer
      });
    }

    // Go to the next card
    document.getElementById("next-card").addEventListener("click", () => {
      currentCardIndex = (currentCardIndex + 1) % customCards.length;
      displayFlashcard();
    });

    // Initialize the first card
    displayFlashcard();
  } else {
    // If the deck is not custom, fetch flashcards from the JSON file
    fetch("flashcards.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load flashcards.json");
        }
        return response.json();
      })
      .then((data) => {
        const flashcards = data[deckName];
        if (!flashcards) {
          document.getElementById("flashcards").innerHTML =
            "<p>No flashcards available for this deck.</p>";
          return;
        }

        let currentCardIndex = 0;

        // Display the current flashcard
        function displayFlashcard() {
          const card = flashcards[currentCardIndex];
          const flashcardsContainer = document.getElementById("flashcards");
          flashcardsContainer.innerHTML = `
            <div class="flashcard">
              <p id="question"><strong>Question:</strong> ${card.question}</p>
              <button id="show-answer-btn">Show Answer</button>
              <p id="answer" style="display: none;"><strong>Answer:</strong> ${card.answer}</p>
            </div>
          `;
          // Add event listener to the "Show Answer" button
          const showAnswerBtn = document.getElementById("show-answer-btn");
          const answerElement = document.getElementById("answer");
          showAnswerBtn.addEventListener("click", () => {
            answerElement.style.display = "block";
            showAnswerBtn.style.display = "none"; // Optionally hide the button after showing the answer
          });
        }

        // Go to the next card
        document.getElementById("next-card").addEventListener("click", () => {
          currentCardIndex = (currentCardIndex + 1) % flashcards.length;
          displayFlashcard();
        });

        // Initialize the first card
        displayFlashcard();
      })
      .catch((error) => {
        console.error("Error loading flashcards:", error);
        document.getElementById("flashcards").innerHTML =
          "<p>Failed to load flashcards.</p>";
      });
  }
});
