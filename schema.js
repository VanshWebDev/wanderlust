const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().required().max(50).min(1),
  description: Joi.string().required().max(1000).min(1),
  location: Joi.string().required().max(100).min(1),
  country: Joi.string().required().max(50).min(1),
  price: Joi.number().required().max(10000000).min(1),
  category: Joi.string(),
  image: Joi.string().allow("", null),
});

const reviewSchema = Joi.object({
  comment: Joi.string().max(200).min(1).required(),
  rating: Joi.number().max(5).min(0).required(),
  createdAt: Joi.date().default(() => new Date()), // Corrected syntax
});

module.exports = {
  listingSchema: listingSchema,
  reviewSchema: reviewSchema,
};
