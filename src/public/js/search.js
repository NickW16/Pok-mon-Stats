let allPokemons = [];
let currentPokemon = null;

// load pokemon
fetch('/search?q=')
  .then(res => res.json())
  .then(pokemons => {
    allPokemons = pokemons;
    renderPokemons(pokemons);
  });

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

// fuzzy finding
if (searchInput) {
  searchInput.addEventListener('input', async () => {
    const query = searchInput.value;
    const response = await fetch(`/search?q=${query}`);
    const pokemons = await response.json();
    allPokemons = pokemons;
    renderPokemons(pokemons);
  });
}

// click on pokemon to show large view
if (resultsDiv) {
  resultsDiv.addEventListener('click', (e) => {
    const li = e.target.closest('.pokemon-list-types');
    if (!li) return;

    const index = li.dataset.index;
    const pokemon = allPokemons[index];
    renderSelectedPokemon(pokemon);
  });
}

function renderPokemons(pokemons) {
  if (!resultsDiv) return;
  
  resultsDiv.innerHTML = `
    <ul class="pokemon-list">
      ${pokemons.map((p, index) => `
        <li class="pokemon-list-types" data-index="${index}">
          <div class="pokemon-card-clickable">
            <img src="${p.gameboy_image_url}" alt="${p.name}" class="pokeimg">
            <span>${p.pokedex_id} - ${p.name}</span>
            <div class="type ${p.types[0]}">${p.types[0]}</div>
            ${p.types[1] ? `<div class="type ${p.types[1]}">${p.types[1]}</div>` : ''}
          </div>
        </li>
      `).join('')}
    </ul>
  `;
}

const selectedPokemon = document.querySelector('#selected-pokemon');

// selected pokemon click handler
if (selectedPokemon) {
  selectedPokemon.addEventListener('click', (e) => {
    // close button
    if (e.target.classList.contains('close-pokemon')) {
      selectedPokemon.innerHTML = '';
      currentPokemon = null;
      return;
    }

    // add to team button
    if (e.target.classList.contains('add-to-team')) {
      if (!currentPokemon) return;

      fetch('/api/teams/latest')
        .then(res => res.json())
        .then(data => {
          const team = data.team || [];

          if (team.some(p => p.pokedex_id === currentPokemon.pokedex_id)) {
            alert(`${currentPokemon.name} is already in your team!`);
            return null;
          } else if (team.length < 6) {
            team.push(currentPokemon);
            return fetch('/api/teams', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ team })
            });
          } else {
            alert('Team is full!');
            return null;
          }
        })
        .then(response => {
          if (response) {
            alert(`${currentPokemon.name} added to team!`);
          }
        })
        .catch(err => console.error('Error:', err));
    }
  });
}

function renderSelectedPokemon(pokemon) {
  if (!pokemon) return;

  currentPokemon = pokemon;

  selectedPokemon.innerHTML = `
    <div id="large-pokemon-display">
      <img src="${pokemon.official_image_url}" alt="${pokemon.name}" class="large-img">
      <div class="selected-pokemon-text">
        <p>#${pokemon.pokedex_id}</p>
        <h2>${pokemon.name}</h2>
        <div class="type ${pokemon.types[0]}">${pokemon.types[0]}</div>
        ${pokemon.types[1] ? `<div class="type ${pokemon.types[1]}">${pokemon.types[1]}</div>` : ''}
      </div>
      <div class="select-buttons">
        <button class="switch-image">Switch to classic</button>
        <button class="add-to-team">Add to team</button>
      </div>
    </div>
  `;

  const switchBtn = document.querySelector('.switch-image');
  const pokemonImage = document.querySelector('.large-img');

  if (switchBtn && pokemonImage) {
    switchBtn.addEventListener('click', () => {
      if (pokemonImage.src.includes('official')) {
        switchBtn.textContent = 'Switch to modern';
        pokemonImage.src = pokemon.gameboy_image_url;
      } else {
        switchBtn.textContent = 'Switch to classic';
        pokemonImage.src = pokemon.official_image_url;
      }
    });
  }
}
