const { pool } = require ('./pool');
const axios = require('axios');

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

async function seedDatabase() {
   console.log('Seeding PostgreSQL...');

   try {
      // fetch pokemons API
      const response = await axios.get(`${POKEAPI_BASE}/pokemon?limit=151`);
      const pokemonList = response.data.results;

      // insert pokemons
      for (const pokemon of pokemonList) {
         const detail = await axios.get(pokemon.url);
         const d = detail.data;

         await pool.query(
            `INSERT INTO pokemon (name, pokedex_id, types)
            VALUES ($1, $2, $3)
            ON CONFLICT (pokedex_id) DO NOTHING`,
            [
               d.name,
               d.id,
               d.types.map(t => t.type.name), // convert to array
            ]
         );

         console.log(`Inserted ${d.name}`);
      }
      
      console.log('Seeding complete.');
      process.exit(0);
   } catch (error) {
      console.error('Error:', error);
      process.exit(1);
   }
}

seedDatabase();
