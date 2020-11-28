const router = require("express").Router();
const Post = require("../models/Post");
const verifyToken = require("../verifyToken");

router.get("/", verifyToken, function (req, res) {
  return res.json({ posts: "Some posts" });
});

router.post("/", verifyToken, async function (req, res) {
  try {
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      userId: req.tokenContext.userId,
    });
    const savedPost = await newPost.save();
    return res.json({ savedPost });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
