const express = require('express');
const router = express.Router();

// Route factice pour les settings pour éviter les erreurs 404 du frontend
router.get('/', (req, res) => {
  res.json({
    appName: "CodeAlpha E-commerce",
    currency: "€",
    taxRate: 0.2
  });
});

module.exports = router;
