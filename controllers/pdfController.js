// controllers/pdfController.js
const fs = require('fs');
const pdf = require('html-pdf');
const Docxtemplater = require('docxtemplater');

exports.convertToPdf = (req, res) => {
  if (!req.files || !req.files.wordFile) {
    return res.status(400).send('No file uploaded.');
  }

  const wordFile = req.files.wordFile;
  const tempFilePath = `/tmp/${wordFile.name.replace(/\s+/g, '_').toLowerCase()}.docx`;

  try {
    fs.writeFileSync(tempFilePath, wordFile.data);
  } catch (err) {
    console.error('Error writing file:', err);
    return res.status(500).send('Error writing file');
  }

  const content = fs.readFileSync(tempFilePath, 'binary');
  const doc = new Docxtemplater(content);
  const data = {
    content: 'Your content goes here',
  };

  doc.setData(data);
  doc.render();

  const renderedHtml = doc.getZip().generate({ type: 'string', mimeType: 'text/html' });

  // Use html-pdf's create function with options
  const options = { format: 'Letter' }; // Adjust format as needed
  pdf.create(renderedHtml, options).toBuffer((err, buffer) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${wordFile.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    res.send(buffer);

    fs.unlinkSync(tempFilePath);
  });
};
