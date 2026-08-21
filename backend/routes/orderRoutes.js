const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');

// Routes protégées
router.post('/', authMiddleware, createOrder);
router.get('/myorders', authMiddleware, getMyOrders);

// (Optionnel) Route admin pour voir toutes les commandes
router.get('/admin/all', authMiddleware, getAllOrders); // Idéalement, il faudrait un middleware `adminMiddleware`

module.exports = router;
