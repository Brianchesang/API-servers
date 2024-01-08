// controllers/pdfController.js
const pdf = require('html-pdf');

exports.convertToPdf = (req, res) => {
  if (!req.files || !req.files.wordFile) {
    return res.status(400).send('No file uploaded.');
  }

  const wordFile = req.files.wordFile;

  // Use the wordFile data as needed, e.g., save it, process it, etc.

  // Placeholder response for now
  res.send('File uploaded successfully.');
};
