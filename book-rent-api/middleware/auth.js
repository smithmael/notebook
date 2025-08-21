// book-rent-api/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config(); // To access process.env.JWT_SECRET

/**
 * This middleware function verifies the JWT token sent with a request.
 * If the token is valid, it attaches the user payload to the request object.
 * If not, it sends back an authorization error.
 */
const authMiddleware = (req, res, next) => {
  // 1. Get the token from the request header.
  // By convention, JWTs are often sent in the 'x-auth-token' or 'Authorization' header.
  const token = req.header('x-auth-token');

  // 2. Check if a token was not provided.
  if (!token) {
    // If no token exists, the user is not authenticated.
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  // 3. Verify the token's validity.
  try {
    // jwt.verify() decodes the token. If the signature is invalid or the token
    // is expired, it will throw an error, which will be caught by the catch block.
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user information from the token to the request object.
    // The payload we created during login was { user: { id, role } }.
    // So, `decodedPayload.user` contains our user's info.
    req.user = decodedPayload.user;

    // 5. Call next() to pass control to the next function in the stack
    // (which could be another middleware or the final route handler).
    next();
  } catch (error) {
    // If the token is not valid for any reason (e.g., tampered with, expired).
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

module.exports = authMiddleware;