// validator if needed
const { body, validationResult, matchedData } = require("express-validator");

async function getHomePage(req, res) {
   res.send('Welcome to Pokemón Database');
};


module.exports = {
   getHomePage,
}
