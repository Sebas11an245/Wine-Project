let wines = [];
let displayedWines = [];
let variantIndexMap = {};
let currentSort = "default";

// Load grouped wine data
fetch("wines.json")
  .then((res) => res.json())
  .then((data) => {
    wines = data;
    displayedWines = shuffleArray(wines);

    wines.forEach((wine) => {
      variantIndexMap[wine.id] = 0;
    });

    displayWines(displayedWines);
  })
  .catch((error) => {
    console.error("Error loading wines:", error);
    document.getElementById("wineContainer").innerHTML =
      '<p class="empty-message">Unable to load wines right now.</p>';
  });

// Event listeners
document.getElementById("searchInput").addEventListener("input", filterWines);
document.getElementById("typeFilter").addEventListener("change", filterWines);
document.getElementById("continentFilter").addEventListener("change", filterWines);
document.getElementById("countryFilter").addEventListener("change", filterWines);
document.getElementById("classificationFilter").addEventListener("change", filterWines);
document.getElementById("sortBtn").addEventListener("click", sortAZ);
document.getElementById("resetBtn").addEventListener("click", resetFilters);

function displayWines(wineList) {
  const container = document.getElementById("wineContainer");
  const resultsCount = document.getElementById("resultsCount");

  container.innerHTML = "";

  if (wineList.length === 0) {
    container.innerHTML = '<p class="empty-message">No wines match your filters.</p>';
    return;
  }

  wineList.forEach((wine) => {
    const currentIndex = variantIndexMap[wine.id] || 0;
    const safeIndex = Math.min(currentIndex, wine.varieties.length - 1);
    const variant = wine.varieties[safeIndex];

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${variant.image}" alt="${variant.label}" class="wine-img" />

      <h3>${variant.label}</h3>
      <p class="type ${wine.type}">${capitalize(wine.type)}</p>

      <p class="meta"><strong>Entry Type:</strong> ${capitalizeWords(wine.entryType)}</p>
      <p class="meta"><strong>Classification:</strong> ${capitalize(wine.classification)}</p>
      <p class="meta"><strong>Aliases:</strong> ${wine.aliases.join(", ")}</p>

      <p>${wine.familyNotes}</p>

      <div class="variant-box">
        <p><strong>Showing:</strong> ${variant.label}</p>
        <p><strong>🌍 Continent:</strong> ${variant.continent}</p>
        <p><strong>🏳️ Country:</strong> ${variant.country}</p>
        <p><strong>📍 Region:</strong> ${variant.region}</p>
        <p><strong>🍇 Signature Region:</strong> ${variant.signatureRegion}</p>

        <p><strong>Body:</strong> ${capitalizeWords(variant.body)}</p>
        <p><strong>Sweetness:</strong> ${capitalizeWords(variant.sweetness)}</p>

        <p>${variant.notes}</p>
        <p><em>🍽 ${variant.pairing}</em></p>

        ${wine.varieties.length > 1
        ? `
          <div class="variant-controls">
            <button class="small-btn" onclick="prevVariant('${wine.id}')">← Prev</button>
            <span class="variant-status">${safeIndex + 1} / ${wine.varieties.length}</span>
            <button class="small-btn" onclick="nextVariant('${wine.id}')">Next →</button>
          </div>
        `
        : `
          <div class="variant-controls">
            <span class="variant-status">1 / 1</span>
          </div>
        `
      }
      </div>
    `;

    container.appendChild(card);
  });
}

function filterWines() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const continent = document.getElementById("continentFilter").value;
  const country = document.getElementById("countryFilter").value;
  const classification = document.getElementById("classificationFilter").value;

  displayedWines = wines.filter((wine) => {
    const matchesSearch =
      search === "" ||
      wine.displayName.toLowerCase().includes(search) ||
      wine.aliases.some((alias) => alias.toLowerCase().includes(search)) ||
      wine.familyNotes.toLowerCase().includes(search) ||
      wine.varieties.some((v) =>
        v.label.toLowerCase().includes(search) ||
        v.country.toLowerCase().includes(search) ||
        v.continent.toLowerCase().includes(search) ||
        v.region.toLowerCase().includes(search) ||
        v.signatureRegion.toLowerCase().includes(search) ||
        v.notes.toLowerCase().includes(search) ||
        v.pairing.toLowerCase().includes(search)
      );

    const matchesType = type === "all" || wine.type === type;
    const matchesContinent = continent === "all" || wine.varieties.some((v) => v.continent === continent);
    const matchesCountry = country === "all" || wine.varieties.some((v) => v.country === country);
    const matchesClassification = classification === "all" || wine.classification === classification;

    return (
      matchesSearch &&
      matchesType &&
      matchesContinent &&
      matchesCountry &&
      matchesClassification
    );
  });

  applyCurrentSort();
  displayWines(displayedWines);
}

function nextVariant(wineId) {
  const wine = wines.find((w) => w.id === wineId);
  if (!wine) return;

  const currentIndex = variantIndexMap[wineId] || 0;
  variantIndexMap[wineId] = (currentIndex + 1) % wine.varieties.length;

  displayWines(displayedWines);
}

function prevVariant(wineId) {
  const wine = wines.find((w) => w.id === wineId);
  if (!wine) return;

  const currentIndex = variantIndexMap[wineId] || 0;
  variantIndexMap[wineId] =
    (currentIndex - 1 + wine.varieties.length) % wine.varieties.length;

  displayWines(displayedWines);
}

function sortAZ() {
  if (currentSort === "az") {
    currentSort = "default";
    displayedWines = shuffleArray(displayedWines);
  } else {
    currentSort = "az";
  }

  applyCurrentSort();
  displayWines(displayedWines);
}

function applyCurrentSort() {
  if (currentSort === "az") {
    displayedWines = [...displayedWines].sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  }
}

function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("typeFilter").value = "all";
  document.getElementById("continentFilter").value = "all";
  document.getElementById("countryFilter").value = "all";
  document.getElementById("classificationFilter").value = "all";

  currentSort = "default";
  displayedWines = shuffleArray(wines);
  displayWines(displayedWines);
}

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function capitalize(text) {
  if (!text || typeof text !== "string") return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function capitalizeWords(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}