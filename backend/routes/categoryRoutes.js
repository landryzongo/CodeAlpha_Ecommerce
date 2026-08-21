const express = require('express');
const router = express.Router();

// Route factice pour les catégories pour éviter les erreurs 404 du frontend
router.get('/', (req, res) => {
  res.json([
    { name: 'Électronique' },
    { name: 'Vêtements' },
    { name: 'Maison' }
  ]);
});

module.exports = router;
