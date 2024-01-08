// controllers/pdfController.js
const pdf = require('html-pdf');
const mammoth = require('mammoth');
const fs = require('fs');

exports.convertToPdf = (req, res) => {
  if (!req.files || !req.files.wordFile) {
    return res.status(400).send('No file uploaded.');
  }

  const wordFile = req.files.wordFile;

  // Write the Word document to a temporary file
  const tempFilePath = `/tmp/${wordFile.name.replace(/\s+/g, '_').toLowerCase()}.docx`;

  fs.writeFileSync(tempFilePath, wordFile.buffer);

  // Read the Word document content using mammoth
  mammoth.extractRawText({ path: tempFilePath })
    .then(result => {
      const htmlContent = `<h1>${result.value}</h1>`; // Placeholder. Customize based on your actual content.

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

        // Cleanup: Remove the temporary file
        fs.unlinkSync(tempFilePath);
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error converting Word to PDF');

      // Cleanup: Remove the temporary file
      fs.unlinkSync(tempFilePath);
    });
};
