const { valid } = require("joi");
const { listingSchema } = require("../schema");
const ExpressError = require("./ExpressError");
const { validate } = require("../models/reviews");


// validation middleware for listing
const validateError = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

module.exports = validateError;