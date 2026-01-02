const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        throw new Error();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new Error();
      }

      // Check role authorization
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Please authenticate'
      });
    }
  };
};

module.exports = auth;