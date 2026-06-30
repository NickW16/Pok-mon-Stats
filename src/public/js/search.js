fetch('/search?q=')
   .then(res => res.json())
   .then(pokemons => renderPokemons(pokemons));

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

searchInput.addEventListener('input', async () => {
   const query = searchInput.value;
   const response = await fetch(`/search?q=${query}`);
   const pokemons = await response.json();
   renderPokemons(pokemons);
});

function renderPokemons(pokemons) {
  resultsDiv.innerHTML = `
    <ul>
      ${pokemons.map(p => `
        <li>
          <span>${p.pokedex_id} - ${p.name}</span>
          <div class="type ${p.types[0]}">${p.types[0]}</div>

          <!-- if it has more than 1 type, display it -->
          ${p.types[1] ? `<div class="type ${p.types[1]}">${p.types[1]}</div>` : ''}
        </li>
          <img src="${p.official_image_url}" alt="${p.name}" class="pokeimg">
      `).join('')}
    </ul>
  `;
}
