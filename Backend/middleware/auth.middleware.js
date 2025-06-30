import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authentication = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers['authorization']) {
    const authHeader = req.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Please authenticate.' });
  }
};

export default authentication;