const Joi = require("@hapi/joi");

const updateCommentValidationSchema = Joi.object().keys({
  description: Joi.string().trim().required(),
});

module.exports = updateCommentValidationSchema;
