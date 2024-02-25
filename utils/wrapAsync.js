// const ExpressErr = require("./ExpressErr");

module.exports = function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
};
