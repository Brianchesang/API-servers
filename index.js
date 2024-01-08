const express = require('express');
const app = express();
const port = 3000;

// Import your routes
const mainRoutes = require('./routes/mainRoutes');

// Use the routes
app.use('/', mainRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
