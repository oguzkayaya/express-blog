const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    maxlength: 1024,
    trim: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  createDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
