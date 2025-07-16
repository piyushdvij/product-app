/**
 * Simple token-based authentication middleware.
 * 
 * Usage:
 *   - Add `API_AUTH_TOKEN` in your `.env` file.
 *   - Client must send the token in a custom header:
 *       token: <your-token>
 * 
 * Example:
 *   token: secretToken123
 */

require('dotenv').config();

/**
 * Auth middleware:
 * Checks if the custom `token` header matches the static token.
 */
const auth = (req, res, next) => {
  // Get the custom `token` header
  const token = req.headers['token'];

  if (!token) {
    return res.status(401).json({ message: 'Missing token header' });
  }

  if (token !== process.env.API_AUTH_TOKEN) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  next();
};

module.exports = auth;
