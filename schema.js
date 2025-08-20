const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().required().min(3),
  description: Joi.string().required().min(10),
  image: {
    url: Joi.string().allow("", null),
    filename: Joi.string(),
  },
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
});
