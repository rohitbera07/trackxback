const jwt = require("jsonwebtoken");
const User=require('../models/User')
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, "secretkey");
     const user = await User.findById(verified.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;// Attach user info to request
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
