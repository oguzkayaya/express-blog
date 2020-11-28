const Joi = require("@hapi/joi");

const updateCommentValidationSchema = Joi.object().keys({
  description: Joi.string().max(1024).required(),
});

module.exports = updateCommentValidationSchema;
