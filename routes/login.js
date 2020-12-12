const router = require("express").Router();
const User = require("../models/User");
const loginValidationSchema = require("../validations/loginValidationSchema");
const validate = require("../validations/validate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", validate(loginValidationSchema), async function (req, res) {
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

  return res.json({
    token,
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
  });
});

module.exports = router;
