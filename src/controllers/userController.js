// validator if needed
const { body, validationResult, matchedData } = require("express-validator");

async function getHomePage(req, res) {
   res.render('index'); // has to setup the view's name
};


module.exports = {
   getHomePage,
}
