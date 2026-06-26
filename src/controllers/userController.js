// validator if needed
const pool = require('../db/pool');
const { body, validationResult, matchedData } = require("express-validator");

async function getHomePage(req, res) {
   try {
      const result = await pool.query('SELECT * FROM pokemon ORDER BY pokedex_id');
      res.render('index', { pokemons: result.rows }); // has to setup the view's name
   } catch (error) {
      console.error(error);
      res.status(500).send('Database error');
   }
};


module.exports = {
   getHomePage,
}
