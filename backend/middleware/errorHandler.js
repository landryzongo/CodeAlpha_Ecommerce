/**
 * Middleware global de gestion des erreurs (Global Error Handler).
 * 
 * Doit être enregistré EN DERNIER dans server.js, après toutes les routes.
 * Intercepte toutes les erreurs transmises via next(err) dans les controllers.
 * 
 * @param {Error} err - L'objet erreur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  // Log de l'erreur côté serveur (visible dans les logs de déploiement)
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  // Erreur de validation Mongoose (ex: champ requis manquant)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Erreur de cast Mongoose (ex: ID MongoDB malformé)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identifiant de ressource invalide' });
  }

  // Erreur de doublon MongoDB (ex: email déjà utilisé)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'champ';
    return res.status(400).json({ message: `La valeur de "${field}" est déjà utilisée` });
  }

  // Erreur JWT (token expiré, invalide)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Session invalide ou expirée. Veuillez vous reconnecter.' });
  }

  // Erreur générique - on ne renvoie jamais la stack en production
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Une erreur interne est survenue',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
