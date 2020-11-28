const router = require("express").Router();
const User = require("../models/User");
const loginValidation = require("../validations/loginValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async function (req, res) {
  const validation = loginValidation(req.body);
  if (validation.error)
    return res.status(400).json({ error: validation.error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Email is not found" });

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordValid)
    return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign(
    { userId: user._id, userName: user.name, userEmail: user.email },
    process.env.JWT_SECRET
  );

  return res.json({ token });
});

module.exports = router;
