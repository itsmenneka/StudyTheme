document.addEventListener("DOMContentLoaded", () => {
  const decksContainer = document.querySelector(".flashcard-decks");
  const decks = JSON.parse(localStorage.getItem("decks")) || {};

  for (const [deckName, cards] of Object.entries(decks)) {
    const deckDiv = document.createElement("div");
    deckDiv.classList.add("deck");
    deckDiv.innerHTML = `
        <h2>${deckName}</h2>
        <p>Custom deck with ${cards.length} cards</p>
        <button onclick="location.href='flashcard.html?deck=${encodeURIComponent(
          deckName
        )}'">Open Deck</button>
        <button onclick="location.href='edit-deck.html?deck=${deckName}'">Edit Deck</button>
        <button class="delete-deck-btn" data-deck="${deckName}">Delete Deck</button>
      `;
    decksContainer.appendChild(deckDiv);

    // Add delete functionality for pre-made decks
    deckDiv.querySelector(".delete-deck-btn").addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete the deck "${deckName}"?`)) {
        delete decks[deckName]; // Remove the deck from the object
        localStorage.setItem("decks", JSON.stringify(decks)); // Update localStorage
        deckDiv.remove(); // Remove the deck from the UI
        alert(`Deck "${deckName}" has been deleted.`);
      }
    });
  }
});
