const Order = require('../models/Order');
const Product = require('../models/Product');

// Créer une commande
exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Aucun produit dans la commande' });
    }

    let totalPrice = 0;
    
    // 1. Vérification des stocks et calcul du prix total
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.product} non trouvé` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour le produit : ${product.name}` });
      }
      totalPrice += product.price * item.quantity;
    }

    // 2. Création de la commande
    const order = await Order.create({
      user: req.userId,
      products,
      totalPrice
    });

    // 3. Soustraction des stocks
    for (let item of products) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Récupérer mes commandes
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// (Optionnel) Route admin pour voir toutes les commandes
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
