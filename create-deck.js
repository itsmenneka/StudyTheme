document.getElementById('add-card-btn').addEventListener('click', () => {
    const cardsContainer = document.getElementById('cards-container');
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.innerHTML = `
      <input type="text" placeholder="Question" class="question" required>
      <input type="text" placeholder="Answer" class="answer" required>
    `;
    cardsContainer.appendChild(cardDiv);
  });
  
  document.getElementById('deck-form').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const deckName = document.getElementById('deck-name').value;
    const cards = Array.from(document.querySelectorAll('.card')).map(card => ({
      question: card.querySelector('.question').value,
      answer: card.querySelector('.answer').value,
    }));
  
    const decks = JSON.parse(localStorage.getItem('decks')) || {};
    decks[deckName] = cards;
    localStorage.setItem('decks', JSON.stringify(decks));
  
    alert('Deck saved!');
    window.location.href = 'quizes.html';
  });