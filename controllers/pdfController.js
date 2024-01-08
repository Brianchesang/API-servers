// controllers/pdfController.js
const fs = require('fs');
const pdf = require('html-pdf');
const Docxtemplater = require('docxtemplater');

exports.convertToPdf = (req, res) => {
  if (!req.files || !req.files.wordFile) {
    return res.status(400).send('No file uploaded.');
  }

  const wordFile = req.files.wordFile;

  // Create a temporary file path
  const tempFilePath = `/tmp/${wordFile.name.replace(/\s+/g, '_').toLowerCase()}.docx`;

  try {
    // Write the Word document to the temporary file
    fs.writeFileSync(tempFilePath, wordFile.data);
  } catch (err) {
    console.error('Error writing file:', err);
    return res.status(500).send('Error writing file');
  }

  // Read the Word document content using docxtemplater
  const content = fs.readFileSync(tempFilePath, 'binary');
  const doc = new Docxtemplater(content);

  // Set data for the Word template (customize as needed)
  const data = {
    content: 'Your content goes here',
  };

  doc.setData(data);
  doc.render();

  // Get the rendered HTML content from the Word document
  const renderedHtml = doc.getZip().generate({ type: 'string', mimeType: 'text/html' });

  // Convert HTML to PDF
  pdf.create(renderedHtml).toBuffer((err, buffer) => {
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
};
