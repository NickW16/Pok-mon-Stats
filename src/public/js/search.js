let allPokemons = []; //global storage

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
  if (e.target.classList.contains('add-to-team')) {
    const li = e.target.closest('li');
    const index = li.dataset.index;
    const pokemon = allPokemons[index];

     // check if pokemons is already in team or team full
    if (team.some(p => p.pokedex_id === pokemon.pokedex_id)) {  
       alert(`${pokemon.name} is already in your team!`);
    } else if (team.length <  6) {
       team.push(pokemon);
    } else {
       alert('team is full! cannot add.');
    }
      renderTeam(team);
    }
});

function renderPokemons(pokemons) {
  resultsDiv.innerHTML = `
    <ul class="pokemon-list">
      ${pokemons.map((p, index) => `
        <li class="pokemon-list-types" data-index="${index}">
          <img src="${p.official_image_url}" alt="${p.name}" class="pokeimg">
          <span>${p.pokedex_id} - ${p.name}</span>
          <div class="type ${p.types[0]}">${p.types[0]}</div>

          <!-- if it has more than 1 type, display it -->
          ${p.types[1] ? `<div class="type ${p.types[1]}">${p.types[1]}</div>` : ''}
          <button class="add-to-team">+</button>
        </li>

      `).join('')}
    </ul>
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

