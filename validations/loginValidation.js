const Joi = require("@hapi/joi");

const loginValidationSchema = Joi.object().keys({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const validationOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

module.exports = function (data) {
  return loginValidationSchema.validate(data, validationOptions);
};
