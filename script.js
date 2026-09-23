document.addEventListener('DOMContentLoaded', () => {
  const btnSearch = document.getElementById('btnSearch');
  const btnClear = document.getElementById('btnClear');
  const searchInput = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('results');

  if (btnSearch) {
    btnSearch.addEventListener('click', searchRecommendations);
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      searchInput.value = '';
      resultsContainer.innerHTML = '';
    });
  }

  function searchRecommendations() {
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';

    if (!query) return;

    fetch('travel_recommendation_api.json')
      .then(response => response.json())
      .then(data => {
        let matches = [];

        if (query.includes('beach')) {
          matches = data.beaches;
        } else if (query.includes('temple')) {
          matches = data.temples;
        } else {
          // Check for country matches
          const matchedCountry = data.countries.find(country => 
            country.name.toLowerCase().includes(query)
          );
          if (matchedCountry) {
            matches = matchedCountry.cities;
          }
        }

        displayResults(matches);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  function displayResults(results) {
    if (!results || results.length === 0) {
      resultsContainer.innerHTML = '<p>No recommendations found for your query.</p>';
      return;
    }

    results.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="btn-visit">Visit</button>
      `;
      resultsContainer.appendChild(card);
    });
  }
});
