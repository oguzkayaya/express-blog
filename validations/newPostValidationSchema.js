const Joi = require("@hapi/joi");

const newPostValidationSchema = Joi.object().keys({
  title: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().trim().min(1).max(1024).required(),
});

module.exports = newPostValidationSchema;
