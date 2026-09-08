const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   POST /api/orders
 * @desc    Créer une nouvelle commande (vérifie le stock avant de valider)
 * @access  Privé
 */
exports.createOrder = asyncHandler(async (req, res) => {
  const { products } = req.body;
  
  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'Aucun produit dans la commande' });
  }

  let totalPrice = 0;
  const productDocs = [];
  
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
    productDocs.push({ doc: product, quantity: item.quantity });
  }

  // 2. Création de la commande en base de données
  const order = await Order.create({
    user: req.userId,
    products,
    totalPrice
  });

  // 3. Soustraction des stocks (réutilise les documents déjà chargés, évite une requête DB supplémentaire)
  for (let { doc, quantity } of productDocs) {
    doc.stock -= quantity;
    await doc.save();
  }

  res.status(201).json(order);
});

/**
 * @route   GET /api/orders/my
 * @desc    Récupérer les commandes de l'utilisateur connecté
 * @access  Privé
 */
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.userId })
    .populate('products.product', 'name price image')
    .sort({ createdAt: -1 });
  res.json(orders);
});

/**
 * @route   GET /api/orders
 * @desc    Récupérer toutes les commandes (admin seulement)
 * @access  Privé (Admin)
 */
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('products.product', 'name price')
    .sort({ createdAt: -1 });
  res.json(orders);
});
