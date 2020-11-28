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
  createDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
