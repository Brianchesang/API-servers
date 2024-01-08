const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(fileUpload()); // Enable file uploads

// Use the pdf routes
app.use('/pdf', pdfRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
