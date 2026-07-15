require('dotenv').config({ path: '../../.env' });
console.log('DATABASE_URL:', process.env.DATABASE_URL); // debug to connect db
const { pool } = require ('./pool');
const fs = require('fs');
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

         // gameboy sprites
         const gameboyImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.id}.png`;
         const gameboyImagePath = `../public/images/pokemon-images/${d.id}.png`;

         const gameboyImageResponse = await axios.get(gameboyImageUrl, { responseType: 'stream' });

         gameboyImageResponse.data.pipe(fs.createWriteStream(gameboyImagePath));

         // official images
         const officialImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${d.id}.png`;
         const officialImagePath = `../public/images/pokemon-images/official-${d.id}.png`;

         const officialImageResponse = await axios.get(officialImageUrl, { responseType: 'stream' });
         officialImageResponse.data.pipe(fs.createWriteStream(officialImagePath));

         await pool.query(
            `INSERT INTO pokemon (name, pokedex_id, types, official_image_url, gameboy_image_url)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (pokedex_id) DO NOTHING`,
            [
               d.name
               .split(" ")
               .map(n => n.charAt(0).toUpperCase() + n.slice(1))
               .join(" "),
               d.id,
               d.types.map(t => t.type.name), // convert to array
               `/images/pokemon-images/official-${d.id}.png`,
               `/images/pokemon-images/${d.id}.png`
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
