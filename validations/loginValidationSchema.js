const Joi = require("@hapi/joi");

const loginValidationSchema = Joi.object().keys({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

module.exports = loginValidationSchema;