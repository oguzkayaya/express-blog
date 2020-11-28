const Joi = require("@hapi/joi");

const updatePostValidationSchema = Joi.object()
  .keys({
    title: Joi.string().min(1).max(255),
    description: Joi.string().min(1).max(1024),
  })
  .min(1);

module.exports = updatePostValidationSchema;
