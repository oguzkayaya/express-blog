const router = require("express").Router();
const verifyToken = require("../verifyToken");
const newCommentValidationSchema = require("../validations/newCommentValidationSchema");
const updateCommentValidationSchema = require("../validations/updateCommentValidationSchema");
const validate = require("../validations/validate");
const Comment = require("../models/Comment");

router.post(
  "/",
  verifyToken,
  validate(newCommentValidationSchema),
  async function (req, res) {
    try {
      const newComment = new Comment({
        description: req.body.description,
        postId: req.body.postId,
        userId: req.tokenContext.userId,
      });
      const savedComment = await newComment.save();
      return res.json({ savedComment });
    } catch (error) {
      return res.status(400).json({ error: "Some error occured" });
    }
  }
);

router.get("/post/:postId", async function (req, res) {
  try {
    const postsComments = await Comment.find({
      postId: req.params.postId,
    }).populate("userId", "name");
    return res.json({ postsComments });
  } catch (error) {
    return res.status(400).json({ error: "Some error occured" });
  }
});

router.get("/user/:userId", async function (req, res) {
  try {
    const usersComments = await Comment.find({
      userId: req.params.userId,
    }).populate("postId", "title");
    return res.json({ usersComments });
  } catch (error) {
    return res.status(400).json({ error: "Some error occured" });
  }
});

router.delete("/:commentId", verifyToken, async function (req, res) {
  try {
    const deletingComment = await Comment.findOne({
      _id: req.params.commentId,
    });
    if (deletingComment.userId != req.tokenContext.userId)
      return res
        .status(400)
        .json({ error: "You can delete only your comments" });
    try {
      const deletedComment = await deletingComment.deleteOne();
      return res.json({ deletedComment });
    } catch (error) {
      return res.status(400).json({ error: "Comment cannot deleted" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Comment not found" });
  }
});

router.put(
  "/:commentId",
  verifyToken,
  validate(updateCommentValidationSchema),
  async function (req, res) {
    try {
      const updatingComment = await Comment.findOne({
        _id: req.params.commentId,
      });
      if (updatingComment.userId != req.tokenContext.userId)
        return res
          .status(400)
          .json({ error: "You can update only your comments" });
      try {
        const updatedComment = await updatingComment.updateOne({
          description: req.body.description,
          updateDate: Date.now(),
        });
        return res.json({ updatedComment });
      } catch (error) {
        return res.status(400).json({ error: "Comment cannot updated" });
      }
    } catch (error) {
      return res.status(400).json({ erorr: "Comment not found" });
    }
  }
);

router.get("/like/:commentId", verifyToken, async function (req, res) {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId });
    if (!comment.likes.includes(req.tokenContext.userId)) {
      comment.dislikes.pull(req.tokenContext.userId);
      comment.likes.push(req.tokenContext.userId);
      await comment.save();
      return res.json("like added");
    } else {
      comment.likes.pull(req.tokenContext.userId);
      await comment.save();
      return res.json("like removed");
    }
  } catch (error) {
    return res.status(400).json({ error: "Some error occured" });
  }
});

router.get("/dislike/:commentId", verifyToken, async function (req, res) {
  try {
    const comment = await Post.findOne({ _id: req.params.commnetId });
    if (!comment.dislikes.includes(req.tokenContext.userId)) {
      comment.likes.pull(req.tokenContext.userId);
      comment.dislikes.push(req.tokenContext.userId);
      await comment.save();
      return res.json("dislike added");
    } else {
      comment.dislikes.pull(req.tokenContext.userId);
      await comment.save();
      return res.json("dislike removed");
    }
  } catch (error) {
    return res.status(400).json({ error: "Some error occured" });
  }
});

module.exports = router;
