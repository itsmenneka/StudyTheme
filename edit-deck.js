document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const deckName = urlParams.get("deck");

  const decks = JSON.parse(localStorage.getItem("decks")) || {};
  const isCustomDeck = decks.hasOwnProperty(deckName);
  let cards = [];

  if (isCustomDeck) {
    // Load custom deck from localStorage
    cards = decks[deckName];
    loadDeck();
  } else {
    // Fetch pre-made deck from flashcards.json
    fetch("flashcards.json")
      .then((response) => response.json())
      .then((data) => {
        cards = data[deckName] || [];
        loadDeck();
      })
      .catch((error) => console.error("Error loading pre-made deck:", error));
  }

  function loadDeck() {
    document.getElementById("deck-name").textContent = `${deckName} Flashcards`;
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "";

    cards.forEach((card, index) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.innerHTML = `
          <input type="text" class="question" value="${card.question}" placeholder="Question">
          <input type="text" class="answer" value="${card.answer}" placeholder="Answer">
          <button type="button" class="delete-card-btn" data-index="${index}">Delete</button>
        `;
      cardsContainer.appendChild(cardDiv);
    });

    // Add delete functionality
    document.querySelectorAll(".delete-card-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        cards.splice(index, 1);
        loadDeck();
      });
    });
  }

  document.getElementById("add-card-btn").addEventListener("click", () => {
    cards.push({ question: "", answer: "" });
    loadDeck();
  });

  document.getElementById("edit-deck-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedCards = Array.from(document.querySelectorAll(".card")).map(
      (cardDiv) => ({
        question: cardDiv.querySelector(".question").value,
        answer: cardDiv.querySelector(".answer").value,
      })
    );

    if (isCustomDeck) {
      decks[deckName] = updatedCards;
      localStorage.setItem("decks", JSON.stringify(decks));
    } else {
      // Save pre-made decks to localStorage (optional, for editing pre-made decks)
      decks[deckName] = updatedCards;
      localStorage.setItem("decks", JSON.stringify(decks));
    }

    alert("Deck saved!");
    window.location.href = "quizes.html";
  });
});
