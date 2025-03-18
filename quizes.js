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
      `;
    decksContainer.appendChild(deckDiv);
  }
});
