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
      return res.status(400).json({ error });
    }
  }
);

router.get("/post/:postId", async function (req, res) {
  try {
    const postsComments = await Comment.find({
      postId: req.params.postId,
    });
    return res.json({ postsComments });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/user/:userId", async function (req, res) {
  try {
    const usersComments = await Comment.find({
      userId: req.params.userId,
    });
    return res.json({ usersComments });
  } catch (error) {
    return res.status(400).json({ error });
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

module.exports = router;
