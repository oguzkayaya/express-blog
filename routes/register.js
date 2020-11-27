const router = require("express").Router();
const User = require("../models/User");
const registerValidation = require("../validations/registerValidation");

router.post("/", async function (req, res) {
  const validation = registerValidation(req.body);
  if (validation.error)
    return res.status(400).json({ error: validation.error.details[0].message });

  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist)
    return res.status(400).json({ error: "Email address is already in use" });

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
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
