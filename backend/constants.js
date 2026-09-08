/**
 * Fichier de constantes partagées de l'application.
 * Centralise les valeurs "magiques" pour éviter les fautes de frappe et faciliter les modifications.
 */

/** Durée de validité du JWT (7 jours) */
const JWT_EXPIRES_IN = '7d';

/** Facteur de salage pour bcrypt */
const BCRYPT_SALT_ROUNDS = 10;

/** Statuts possibles pour une commande */
const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

/** Méthodes de paiement acceptées */
const PAYMENT_METHODS = {
  CARD: 'card',
  CASH: 'cash',
};

module.exports = {
  JWT_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS,
  ORDER_STATUS,
  PAYMENT_METHODS,
};
