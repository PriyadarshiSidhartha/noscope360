const gamesGrid = document.getElementById('games-grid');
const statusMessage = document.getElementById('status-message');

let allGames = []; // Global array to store fetched games
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// Add event listeners for dynamic search and sort
searchInput.addEventListener('input', renderGames);
sortSelect.addEventListener('change', renderGames);

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
      allGames = [];
      renderGames();
      return;
    }

    statusMessage.textContent = `Found ${games.length} deals`;
    allGames = games.slice(0, 40); // Store up to 40 games globally

    // Reset search and sort on new category fetch
    searchInput.value = '';
    sortSelect.value = 'default';

    renderGames();

  } catch (err) {
    statusMessage.textContent = 'Error loading data: ' + err.message;
  }
}

function renderGames() {
  const searchTerm = searchInput.value.toLowerCase();
  const sortOption = sortSelect.value;

  // Filter games based on search input
  let processedGames = allGames.filter(game =>
    game.title.toLowerCase().includes(searchTerm)
  );

  // Sort games based on selected option
  processedGames.sort((a, b) => {
    if (sortOption === 'price-asc') {
      return parseFloat(a.salePrice) - parseFloat(b.salePrice);
    } else if (sortOption === 'price-desc') {
      return parseFloat(b.salePrice) - parseFloat(a.salePrice);
    } else if (sortOption === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0; // default sorting (preserve original order as much as possible)
  });

  if (processedGames.length === 0 && allGames.length > 0) {
    gamesGrid.innerHTML = '<p>No games match your search.</p>';
    return;
  }

  // Use map to create an array of HTML strings, and join to update innerHTML
  gamesGrid.innerHTML = processedGames.map(game => `
    <div class="game-card">
      <h3>${game.title}</h3>
      <img src="${game.thumb}" alt="thumb">
      <p>Sale: $${game.salePrice} (was $${game.normalPrice})</p>
      <a class="deal-link" href="https://www.cheapshark.com/redirect?dealID=${game.dealID}" target="_blank">View Deal</a>
    </div>
  `).join('');
}

// Global scope initialization
window.onload = () => fetchGames('all');
