const router = require("express").Router();
const verifyToken = require("../verifyToken");

router.get("/", verifyToken, function (req, res) {
  return res.json({ posts: "Some posts" });
});

module.exports = router;
