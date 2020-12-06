const Joi = require("@hapi/joi");

const updateCommentValidationSchema = Joi.object().keys({
  description: Joi.string().trim().max(1024).required(),
});

module.exports = updateCommentValidationSchema;
