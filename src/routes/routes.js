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
