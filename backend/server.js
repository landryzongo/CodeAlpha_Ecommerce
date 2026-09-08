require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

// ─── Route de santé ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API NovaTech — Opérationnel' });
});

// ─── Connexion MongoDB ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[MongoDB] Connexion établie'))
  .catch((err) => {
    console.error('[MongoDB] Erreur de connexion:', err.message);
    process.exit(1); // Arrêt propre si la DB est injoignable au démarrage
  });

// ─── Global Error Handler (doit être le DERNIER middleware) ───────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] En écoute sur le port ${PORT} (mode: ${process.env.NODE_ENV || 'development'})`);
});