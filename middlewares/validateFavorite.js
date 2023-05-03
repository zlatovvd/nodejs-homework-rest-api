const { HttpError } = require("../helpers");

const validateFavorite = () => {
  const func = (req, res, next) => {
    if (!Object.keys(req.body).length) {
      next(HttpError(400, "missing field favorite"));
    }
    next();
  };
  return func;
};

module.exports = validateFavorite;
