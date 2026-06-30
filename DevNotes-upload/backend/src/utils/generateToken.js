import jwt from 'jsonwebtoken';

/**
 * Sign a JWT for the given user id.
 * @param {string} userId
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
