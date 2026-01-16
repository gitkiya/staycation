const express = require('express');
const router = express.Router({mergeParams:true});  //so that we can access :id from parent route=> /listings/:id/reviews  id
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const wrapAsync = require("../utils/wrapasyn.js");
const ExpressError = require("../utils/expressError.js");
const { validateReview , isLoggedIn , isReviewAuthor } = require("../middleware.js");

const  ReviewController = require("../controllers/review.js");





// review post route
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.createReview));




//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.deleteReview));



module.exports = router;