const router = require("express").Router();
const User = require("../models/User");

router.post("/", async function (req, res) {
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
