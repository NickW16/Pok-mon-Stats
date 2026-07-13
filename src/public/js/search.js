let allPokemons = []; //global storage
let currentPokemon = null;

fetch('/search?q=')
   .then(res => res.json())
   .then(pokemons => {
      allPokemons = pokemons;
      renderPokemons(pokemons);
   });

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

// fuzzy finding
searchInput.addEventListener('input', async () => {
  const query = searchInput.value;
  const response = await fetch(`/search?q=${query}`);
  const pokemons = await response.json();
  allPokemons = pokemons; // ✅ Update global
  renderPokemons(pokemons);
});

// add pokemons to team
resultsDiv.addEventListener('click', (e) => {
  const li = e.target.closest('.pokemon-list-types');
  if (!li) return;

  const index = li.dataset.index;
  const pokemon = allPokemons[index];

  // Otherwise, show large view
  renderSelectedPokemon(pokemon);
});
function renderPokemons(pokemons) {
  resultsDiv.innerHTML = `
    <ul class="pokemon-list">
      ${pokemons.map((p, index) => `
        <li class="pokemon-list-types" data-index="${index}">
          <div class="pokemon-card-clickable">
            <img src="${p.official_image_url}" alt="${p.name}" class="pokeimg">
            <span>${p.pokedex_id} - ${p.name}</span>
            <div class="type ${p.types[0]}">${p.types[0]}</div>
            ${p.types[1] ? `<div class="type ${p.types[1]}">${p.types[1]}</div>` : ''}
          </div>
        </li>
      `).join('')}
    </ul>
  `;
}

const displayLargePokemon = document.querySelector('.large-pokemon');
const selectedPokemon = document.querySelector('#selected-pokemon');

// close button
selectedPokemon.addEventListener('click', (e) => {
   //just in case i want delete function from display
  if (e.target.classList.contains('close-pokemon')) {
    selectedPokemon.innerHTML = '';
    currentPokemon = null;
    return;
  }
   // get pokemon from display
  const displayDiv = document.querySelector('#large-pokemon-display');
  if (!displayDiv) return;

   // store current pokemon globally 
  if (!currentPokemon) return;

   // if clicked + button, add to team
  if (e.target.classList.contains('add-to-team')) {
    if (team.some(p => p.pokedex_id === currentPokemon.pokedex_id)) {
      alert(`${currentPokemon.name} is already in your team!`);
    } else if (team.length < 6) {
      team.push(currentPokemon);
      renderTeam(team);
    } else {
      alert('Team is full!');
    }
    return;
  }

});

function renderSelectedPokemon(pokemon) {
  if (!pokemon) return;

  currentPokemon = pokemon; // store globally

  selectedPokemon.innerHTML = `
    <div id="large-pokemon-display">
      <img src="${pokemon.official_image_url}" alt="${pokemon.name}" class="large-img">
      <h2>${pokemon.name}</h2>
      <p>#${pokemon.pokedex_id}</p>
      <div class="type ${pokemon.types[0]}">${pokemon.types[0]}</div>
      ${pokemon.types[1] ? `<div class="type ${pokemon.types[1]}">${pokemon.types[1]}</div>` : ''}
      <button class="add-to-team">Add to team</button>
    </div>
  `;
}

// render team
const team = [];

const teamDiv = document.getElementById('team');

function renderTeam(team) {
  teamDiv.innerHTML = `
  <div id="my-team">
      <ul class="team-list">
         ${team.map(p => `
         <li class="pokemon-team">
            <img src="${p.official_image_url}" alt="${p.name}" class="pokeimg">
            <span>${p.name}</span>
            <div class="type ${p.types[0]}">${p.types[0]}</div>

            <!-- if it has more than 1 type, display it -->
            ${p.types[1] ? `<div class="type ${p.types[1]}">${p.types[1]}</div>` : ''}
            <button class="remove-from-team" data-id="${p.pokedex_id}">x</button>

         </li>
         `).join('')}
      </ul>
   </div>
   `;
}

// this has to come after everything because of rendering
// remove from team
teamDiv.addEventListener('click', (e) => {
   if (e.target.classList.contains('remove-from-team')) {
      const id = parseInt(e.target.dataset.id);
      const index = team.findIndex(p => p.pokedex_id === id);
      if (index > -1) {
         team.splice(index, 1);
         renderTeam(team);
      }
   }
});

