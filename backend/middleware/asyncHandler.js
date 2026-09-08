/**
 * Enveloppe une fonction controller async pour éviter les blocs try/catch répétitifs.
 * Transmet automatiquement les erreurs au Global Error Handler via next(err).
 * 
 * @param {Function} fn - La fonction controller async à envelopper
 * @returns {Function} Une fonction Express middleware qui gère les erreurs async
 * 
 * @example
 * // Avant (avec try/catch)
 * exports.getProducts = async (req, res) => {
 *   try { ... } catch (err) { res.status(500).json(...) }
 * }
 * 
 * // Après (avec asyncHandler)
 * exports.getProducts = asyncHandler(async (req, res) => {
 *   // Pas besoin de try/catch, les erreurs sont capturées automatiquement
 * });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
