const router = require("express").Router();
const Post = require("../models/Post");
const verifyToken = require("../verifyToken");
const validate = require("../validations/validate");
const newPostValidationSchema = require("../validations/newPostValidationSchema");
const updatePostValidationSchema = require("../validations/updatePostValidationSchema");

router.get("/", async function (req, res) {
  try {
    const posts = await Post.find({})
      .populate("userId", "name")
      .sort("-createDate")
      .limit(10);
    return res.json({ posts });
  } catch (error) {
    return res.status(400).json({ error: "Some error occured" });
  }
});

router.get("/all", async function (req, res) {
  try {
    const posts = await Post.find({})
      .populate("userId", "name")
      .sort("-createDate");
    return res.json({ posts });
  } catch (error) {
    return res.status(400).json({ error: "Some error occured" });
  }
});

router.post(
  "/",
  verifyToken,
  validate(newPostValidationSchema),
  async function (req, res) {
    try {
      const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        userId: req.tokenContext.userId,
      });
      const savedPost = await newPost.save();
      return res.json({ savedPost });
    } catch (error) {
      return res.status(400).json({ error: "Some error occured" });
    }
  }
);

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

router.put(
  "/:postId",
  verifyToken,
  validate(updatePostValidationSchema),
  async function (req, res) {
    try {
      const updatingPost = await Post.findOne({ _id: req.params.postId });
      if (updatingPost.userId != req.tokenContext.userId)
        return res
          .status(400)
          .json({ error: "You can update only your posts" });
      try {
        const updatedPost = await updatingPost.updateOne({
          ...req.body,
          updateDate: Date.now(),
        });
        return res.json({ updatedPost });
      } catch (error) {
        return res.status(400).json({ error: "Post cannot updated" });
      }
    } catch (error) {
      return res.status(400).json({ error: "Post not found" });
    }
  }
);

router.get("/like/:postId", verifyToken, async function (req, res) {
  try {
    const post = await Post.findOne({ _id: req.params.postId });
    if (!post.likes.includes(req.tokenContext.userId)) {
      post.dislikes.pull(req.tokenContext.userId);
      post.likes.push(req.tokenContext.userId);
      await post.save();
      return res.json("like added");
    } else {
      post.likes.pull(req.tokenContext.userId);
      await post.save();
      return res.json("like removed");
    }
  } catch (error) {
    return res.status(400).json({ error: "Some error occured" });
  }
});

router.get("/dislike/:postId", verifyToken, async function (req, res) {
  try {
    const post = await Post.findOne({ _id: req.params.postId });
    if (!post.dislikes.includes(req.tokenContext.userId)) {
      post.likes.pull(req.tokenContext.userId);
      post.dislikes.push(req.tokenContext.userId);
      await post.save();
      return res.json("dislike added");
    } else {
      post.dislikes.pull(req.tokenContext.userId);
      await post.save();
      return res.json("dislike removed");
    }
  } catch (error) {
    return res.status(400).json({ error: "Some error occured" });
  }
});

module.exports = router;
