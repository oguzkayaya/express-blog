const Joi = require("@hapi/joi");

const newCommentValidationSchema = Joi.object().keys({
  description: Joi.string().trim().max(1024).required(),
  postId: Joi.string().max(64).required(),
});

module.exports = newCommentValidationSchema;
