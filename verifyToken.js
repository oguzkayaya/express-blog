const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(400).json({ error: "There is no token" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.tokenContext = verified;
  } catch (error) {
    return res.status(400).json({ error: "Invalid Token" });
  }
};
