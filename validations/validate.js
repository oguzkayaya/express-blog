const validate = function (validationSchema) {
  const options = {
    errors: {
      wrap: {
        label: "",
      },
    },
  };

  return function (req, res, next) {
    const validation = validationSchema.validate(req.body, options);
    if (validation.error)
      return res
        .status(400)
        .json({ error: validation.error.details[0].message });
    next();
  };
};

module.exports = validate;
