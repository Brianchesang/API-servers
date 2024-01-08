// controllers/pdfController.js
const pdf = require('html-pdf');
const mammoth = require('mammoth');

exports.convertToPdf = (req, res) => {
  if (!req.files || !req.files.wordFile) {
    return res.status(400).send('No file uploaded.');
  }

  const wordFile = req.files.wordFile;

  // Read the Word document content using mammoth
  mammoth.extract({ arrayBuffer: wordFile.buffer })
    .then(result => {
      const htmlContent = result.value; // Use the extracted HTML content

      // Convert HTML to PDF
      pdf.create(htmlContent).toBuffer((err, buffer) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        // Set the response headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${wordFile.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
        res.send(buffer);
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error converting Word to PDF');
    });
};
