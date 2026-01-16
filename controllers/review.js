const Listing = require("../model/listing.js");
const Review = require("../model/review.js");


module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let {rating, comment} = req.body;
    let review = new Review({rating, comment,author:req.user._id});
    console.log(review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","Successfully made a new review !");
    console.log("new review added");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted the review !");
    res.redirect(`/listings/${id}`);
}