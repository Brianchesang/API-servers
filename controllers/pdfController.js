// controllers/pdfController.js
const pdf = require('html-pdf');
const mammoth = require('mammoth');
const fs = require('fs');

exports.convertToPdf = (req, res) => {
  if (!req.files || !req.files.wordFile) {
    return res.status(400).send('No file uploaded.');
  }

  const wordFile = req.files.wordFile;

  // Debugging: Log the wordFile.buffer to check its content
  console.log('wordFile.buffer:', wordFile.buffer);

  // Write the Word document to a temporary file
  const tempFilePath = `/tmp/${wordFile.name.replace(/\s+/g, '_').toLowerCase()}.docx`;

  try {
    fs.writeFileSync(tempFilePath, wordFile.buffer);
  } catch (err) {
    console.error('Error writing file:', err);
    return res.status(500).send('Error writing file');
  }

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
