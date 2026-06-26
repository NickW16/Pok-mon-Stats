const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
   connectionString: process.env.DATABASE_URL || process.env.DB_CONNECTION_STRING,
});

// test connection
pool.connect((err) => {
   console.log('Connecting to Database...');
   if (err) console.error('DB connection failed', err.message);
      else console.log('Database connected and running.');
});

module.exports = {
   query: (text, params) => pool.query(text, params),
   pool
};
