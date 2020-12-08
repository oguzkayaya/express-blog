const Joi = require("@hapi/joi");

const updatePostValidationSchema = Joi.object()
  .keys({
    title: Joi.string().trim().min(1).max(255),
    description: Joi.string().trim().min(1),
  })
  .min(1);

module.exports = updatePostValidationSchema;
