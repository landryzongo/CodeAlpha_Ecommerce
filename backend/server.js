require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

const settingRoutes = require('./routes/settingRoutes');
app.use('/api/settings', settingRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[MongoDB] Connexion établie'))
  .catch((err) => console.error('[MongoDB] Erreur de connexion:', err));

// Route de test
app.get('/', (req, res) => {
  res.send('API CodeAlpha E-commerce - Statut: opérationnel');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] En écoute sur le port ${PORT}`);
});