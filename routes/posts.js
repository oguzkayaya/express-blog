const router = require("express").Router();
const Post = require("../models/Post");
const verifyToken = require("../verifyToken");

router.get("/", async function (req, res) {
  try {
    const posts = await Post.find({});
    return res.json({ posts });
  } catch (error) {
    return res.status(400).json({ error });
  }
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

router.delete("/:postId", verifyToken, async function (req, res) {
  try {
    const deletingPost = await Post.findOne({ _id: req.params.postId });
    if (deletingPost.userId != req.tokenContext.userId)
      return res.status(400).json({ error: "You can delete only your posts" });
    try {
      const deletedPost = await deletingPost.deleteOne();
      return res.json({ deletedPost });
    } catch (error) {
      return res.status(400).json({ error: "Post cannot deleted" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Post not found" });
  }
});

router.put("/:postId", verifyToken, async function (req, res) {
  try {
    const updatingPost = await Post.findOne({ _id: req.params.postId });
    if (updatingPost.userId != req.tokenContext.userId)
      return res.status(400).json({ error: "You can update only your posts" });
    try {
      const updatedPost = await updatingPost.updateOne({
        title: req.body.title,
        description: req.body.title,
      });
      return res.json({ updatedPost });
    } catch (error) {
      return res.status(400).json({ error: "Post cannot updated" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Post not found" });
  }
});

module.exports = router;
