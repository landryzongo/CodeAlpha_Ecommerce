require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categoriesData = [
  { name: 'Ordinateurs', description: 'PC Portables, PC de bureau et Mac' },
  { name: 'Smartphones & Tablettes', description: 'Appareils mobiles sous iOS et Android' },
  { name: 'Audio', description: 'Casques, écouteurs sans fil et enceintes' },
  { name: 'Écrans & Moniteurs', description: 'Moniteurs bureautique, Gaming et 4K' },
  { name: 'Périphériques', description: 'Claviers, souris, webcams' },
  { name: 'Composants PC', description: 'Cartes graphiques, processeurs, RAM' },
  { name: 'Accessoires', description: 'Câbles, chargeurs, sacs à dos' }
];

const productsData = [
  // Ordinateurs
  { name: 'MacBook Pro 16" M3 Max', description: 'Le nec plus ultra d\'Apple pour les professionnels. 36Go RAM, 1To SSD.', price: 3499, category: 'Ordinateurs', stock: 10, image: '/uploads/macbook.jpg' },
  { name: 'Asus ROG Zephyrus G14', description: 'PC Gamer ultraportable, RTX 4070, écran OLED 120Hz.', price: 1899, category: 'Ordinateurs', stock: 15, image: '/uploads/asus.jpg' },
  
  // Smartphones & Tablettes
  { name: 'iPhone 15 Pro Max', description: 'Puce A17 Pro, boîtier en titane, 256Go.', price: 1479, category: 'Smartphones & Tablettes', stock: 25, image: '/uploads/iphone.jpg' },
  { name: 'Samsung Galaxy S24 Ultra', description: 'Galaxy AI, S Pen inclus, 512Go.', price: 1469, category: 'Smartphones & Tablettes', stock: 20, image: '/uploads/samsung.jpg' },
  { name: 'iPad Air 5', description: 'Puce M1, écran Liquid Retina 10.9", 64Go.', price: 789, category: 'Smartphones & Tablettes', stock: 0, image: '/uploads/ipad.jpg' }, // Rupture de stock

  // Audio
  { name: 'Sony WH-1000XM5', description: 'Casque à réduction de bruit active, 30h d\'autonomie.', price: 399, category: 'Audio', stock: 50, image: '/uploads/sony.jpg' },
  { name: 'AirPods Pro 2', description: 'Écouteurs sans fil Apple, annulation de bruit avancée.', price: 279, category: 'Audio', stock: 40, image: '/placeholder.png' },

  // Écrans & Moniteurs
  { name: 'LG UltraGear 27" OLED', description: 'Écran gaming 240Hz, temps de réponse 0.03ms.', price: 999, category: 'Écrans & Moniteurs', stock: 8, image: '/placeholder.png' },
  { name: 'Dell UltraSharp 32" 4K', description: 'Écran professionnel avec hub USB-C intégré.', price: 859, category: 'Écrans & Moniteurs', stock: 12, image: '/placeholder.png' },

  // Périphériques
  { name: 'Logitech MX Master 3S', description: 'Souris sans fil ergonomique avec clics silencieux.', price: 129, category: 'Périphériques', stock: 60, image: '/placeholder.png' },
  { name: 'Keychron Q1 Pro', description: 'Clavier mécanique custom sans fil, châssis aluminium.', price: 199, category: 'Périphériques', stock: 30, image: '/placeholder.png' },

  // Composants PC
  { name: 'NVIDIA GeForce RTX 4090', description: 'La carte graphique ultime pour le gaming 4K et l\'IA.', price: 1899, category: 'Composants PC', stock: 3, image: '/placeholder.png' },
  { name: 'AMD Ryzen 7 7800X3D', description: 'Le meilleur processeur gaming du moment.', price: 449, category: 'Composants PC', stock: 22, image: '/placeholder.png' },

  // Accessoires
  { name: 'Chargeur Anker 100W GaN', description: 'Chargeur compact 2 ports USB-C et 1 port USB-A.', price: 69, category: 'Accessoires', stock: 100, image: '/placeholder.png' },
  { name: 'Câble USB-C vers USB-C tressé', description: 'Câble 2m supportant 100W et transfert 10Gbps.', price: 19, category: 'Accessoires', stock: 200, image: '/placeholder.png' }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[MongoDB] Connecté pour le seed.');

    // Nettoyer les collections existantes
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Anciennes catégories et produits supprimés.');

    // Insérer les catégories
    await Category.insertMany(categoriesData);
    console.log('✅ Nouvelles catégories insérées.');

    // Insérer les produits
    await Product.insertMany(productsData);
    console.log('✅ Nouveaux produits insérés.');

    console.log('🚀 Seed terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

seedDatabase();
