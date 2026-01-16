const Joi = require("joi");

 module.exports.listingSchema = Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        description:Joi.string().required(),
        image:Joi.string().allow('').allow(null),
        location:Joi.string().required(),
        country:Joi.string().required()
    }).required();


    module.exports.reviewSchema = Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            comment: Joi.string().required()
         }).required();
  