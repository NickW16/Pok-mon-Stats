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
          <li class="pokemon-team">
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

  const deleteBtn = document.getElementById('delete-team');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteTeam);
  }
}

// delete from team button
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-from-team')) {
    const id = parseInt(e.target.dataset.id);
    await deletePokemonFromTeam(id);
  }
});

// load team on page load
loadTeam();
