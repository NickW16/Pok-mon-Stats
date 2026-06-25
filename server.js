const app = require('./src/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
   if (error) {
      throw error;
   }
      console.log(`Server running on http://localhost:${PORT}`);
});

