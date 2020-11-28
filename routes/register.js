const router = require("express").Router();
const User = require("../models/User");
const registerValidationSchema = require("../validations/registerValidationSchema");
const validate = require("../validations/validate");
const bcrypt = require("bcryptjs");

router.post("/", validate(registerValidationSchema), async function (req, res) {
  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist)
    return res.status(400).json({ error: "Email address is already in use" });

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await newUser.save();
    res.json({
      savedUser: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
