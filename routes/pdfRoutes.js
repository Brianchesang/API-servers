// routes/pdfRoutes.js
const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.post('/convert-to-pdf', pdfController.convertToPdf);

module.exports = router;
