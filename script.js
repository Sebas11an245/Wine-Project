let wines = [];

// Load data
fetch('wines.json')
  .then(res => res.json())
  .then(data => {
    wines = data;
    displayWines(wines);
  });

function displayWines(wineList) {
  const container = document.getElementById('wineContainer');
  container.innerHTML = '';

  wineList.forEach(wine => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <h3>${wine.name}</h3>
      <p class="type ${wine.type}">${wine.type}</p>
      <p><strong>Region:</strong> ${wine.region}</p>
      <p><strong>Notes:</strong> ${wine.notes}</p>
      <p><strong>Pairs with:</strong> ${wine.pairing}</p>
    `;

    container.appendChild(card);
  });
}

// Search + Filter
document.getElementById('searchInput').addEventListener('input', filterWines);
document.getElementById('typeFilter').addEventListener('change', filterWines);

function filterWines() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const type = document.getElementById('typeFilter').value;

  const filtered = wines.filter(wine => {
    const matchesSearch = wine.name.toLowerCase().includes(search);
    const matchesType = type === 'all' || wine.type === type;
    return matchesSearch && matchesType;
  });

  displayWines(filtered);
}