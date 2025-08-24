const { reviewSchema } = require("../schema");
const ExpressError = require("./ExpressError");

const reviewValidator = async (req, res, next) => {
  let { error } = reviewSchema.validate(req.body.review);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");

    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

module.exports = reviewValidator;
