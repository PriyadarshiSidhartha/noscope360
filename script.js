const gamesGrid = document.getElementById('games-grid');
const statusMessage = document.getElementById('status-message');

async function fetchGames(category) {
  // Reset UI
  gamesGrid.innerHTML = '';
  statusMessage.textContent = 'Loading...';

  // Construct URL
  let url = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=50';
  if (category && category !== 'all') {
    url += `&title=${category}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');

    const games = await response.json();

    if (games.length === 0) {
      statusMessage.textContent = 'No deals found.';
      return;
    }

    statusMessage.textContent = `Found ${games.length} API deals`;

    // Render basic cards
    games.slice(0, 40).forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `
        <h3>${game.title}</h3>
        <img src="${game.thumb}" alt="thumb">
        <p>Sale: $${game.salePrice} (was $${game.normalPrice})</p>
        <a href="https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(game.dealID)}" target="_blank">View Deal</a>
      `;
      gamesGrid.appendChild(card);
    });

  } catch (err) {
    statusMessage.textContent = 'Error loading data: ' + err.message;
  }
}

// Global scope initialization
window.onload = () => fetchGames('all');
