let currentTeam = [];

// load and display team
async function loadTeam() {
  try {
    const response = await fetch('/api/teams/latest');
    const data = await response.json();
    const team = data.team || [];
    renderTeam(team);
  } catch (error) {
    console.error('Error loading team:', error);
    renderTeam([]);
  }
}

// delete team
async function deleteTeam() {
  if (!confirm('Delete your team?')) return;

  try {
    await fetch('/api/teams', { method: 'DELETE' });
    renderTeam([]);
    alert('Team deleted!');
  } catch (error) {
    console.error('Error deleting team:', error);
  }
}

// delete single pokemon from team
async function deletePokemonFromTeam(id) {
   // fetch api first so it doesnt bug
   const response = await fetch('/api/teams/latest');
   const data = await response.json();
   const team = data.team || [];
   const pokemon = team.find(p => p.pokedex_id === id);

   if (!pokemon) return;

   if (!confirm(`Remove ${pokemon.name} from your team?`)) return;

   try {
      const index = team.findIndex(p => p.pokedex_id === id);
      if (index === -1) return;

      team.splice(index, 1);

      await fetch('/api/teams', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ team }),
      });

      renderTeam(team);
      } catch (error) {
         console.error('Error deleting pokemon:', error);
   }
}

// render team
function renderTeam(team) {
  const teamDiv = document.getElementById('team');
  if (!teamDiv) return;

  if (team.length === 0) {
    teamDiv.innerHTML = `
      <div class="empty-team">
        <p>Your team is empty.</p>
        <a href="/">Build my Team</a>
      </div>
    `;
    return;
  }

  teamDiv.innerHTML = `
    <div id="my-team">
      <h2>My Team (${team.length}/6)</h2>
      <ul class="team-list">
        ${team.map(p => `
          <li class="pokemon-team" data-pokedex-id="${p.pokedex_id}">
            <div class="team-wrapper">
               <img src="${p.gameboy_image_url}" alt="${p.name}" class="pokeimg">
               <span>${p.name}</span>
               <div class="type ${p.types[0]}">${p.types[0]}</div>
               ${p.types[1] ? `<div class="type ${p.types[1]}">${p.types[1]}</div>` : ''}
            </div>
            <button class="delete-from-team" data-id="${p.pokedex_id}">x</button>
          </li>
        `).join('')}
      </ul>
      <button id="delete-team">Delete Team</button>
    </div>
  `;

   currentTeam = team;

   // allow for pokemon viewing on team page
   const teamListItems = document.querySelectorAll('.pokemon-team');
   teamListItems.forEach((li) => {
     li.addEventListener('click', (e) => {
       if (e.target.classList.contains('delete-from-team')) return;
       const pokedexId = parseInt(li.dataset.pokedexId);
       const pokemon = currentTeam.find(p => p.pokedex_id === pokedexId);
       if (pokemon) showTeamPokemon(pokemon);
     });
   });

  const deleteBtn = document.getElementById('delete-team');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteTeam);
  }
}

// show large pokemon display when clicking a team member
function showTeamPokemon(pokemon) {
  const selectedPokemon = document.getElementById('selected-pokemon');
  if (!selectedPokemon) return;

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
         <button class="switch-image">Switch to Classic</button>
         <button class="delete-from-team" data-id="${pokemon.pokedex_id}">Remove</button>
      </div>
    </div>
  `;

   // switch to classic
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

// delete from team button
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-from-team')) {
    const id = parseInt(e.target.dataset.id);
    await deletePokemonFromTeam(id);
  }
});

// close pokemon
document.addEventListener('click', (e) => {
   if (e.target.classList.contains('close-selected')) {
      document.getElementById('selected-pokemon').innerHTML = '';
   }
});

// load team on page load
loadTeam();
