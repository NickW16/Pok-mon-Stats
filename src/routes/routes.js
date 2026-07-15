const express = require('express');
const { pool } = require('../db/pool');
const router = express.Router();
const Fuse = require('fuse.js');
const userController = require('../controllers/userController');

// search homepage

router.get('/', userController.getHomePage);

// team
 
router.get('/team', (req, res) => {
   res.render('team');   
});

// post team
router.post('/api/teams', async (req, res) => {
   const { team } = req.body;
   const pokemonIds = team.map(p => p.pokedex_id);

   const result = await pool.query(
      'INSERT INTO teams (pokemon_ids, created_at) VALUES ($1, NOW()) RETURNING id',
      [pokemonIds]
   );

   res.json({ success: true, teamId: result.rows[0].id });
});

// fetch team from DB
router.get('/api/teams/latest', async (req, res) => {
   const result = await pool.query(
      'SELECT * FROM teams ORDER BY created_at DESC LIMIT 1'
   );

   if (result.rows.length === 0) {
      return res.json({ team: [] });
   }

   const ids = result.rows[0].pokemon_ids;
   const pokemonResult = await pool.query(
      'SELECT * FROM pokemon WHERE pokedex_id = ANY($1) ORDER BY pokedex_id',
      [ids]
   );

   res.json({ team: pokemonResult.rows }); 
});

router.get('/search', async(req, res) => {
   const query = req.query.q;
   const result = await pool.query('SELECT * FROM pokemon ORDER BY pokedex_id');
   const pokemons = result.rows;

   if (query) {
      const fuse = new Fuse(pokemons, {
         keys: ['name', 'types'], //search by name or types
         threshold: 0.3, // fuzzy matching
      });
      const results = fuse.search(query).map(r => r.item);
      res.json(results);
   } else {
      res.json(pokemons);
   }
});

module.exports = router;
