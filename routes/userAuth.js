const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  const token = req.cookies.token; // 🍪 Get token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // You can access req.user in routes
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = userAuth;
