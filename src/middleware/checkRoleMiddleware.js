const jwt = require('jsonwebtoken');

module.exports = function(roleId) {
  return function(req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
  
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json('User is not authorized');
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      if (decoded.roleId !== roleId) {
        return res.status(403).json('You don\'t have access');
      }
      
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json('User is not authorized');
    }
  }
}