const Joi = require("@hapi/joi");

const registerValidationSchema = Joi.object().keys({
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

module.exports = registerValidationSchema;
