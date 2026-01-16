const Listing = require("./model/listing.js");
const Review = require("./model/review.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");


//authentication middleware
module.exports.isLoggedIn = (req,res,next)=>{ 
 if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in  !");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

//authorization middleware
module.exports.isOwner = async(req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You do not have permission to do that !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//listing validator middleware

module.exports.validateListing = (req,res,next)=>{
    console.log("[validateListing] req.body:", req.body);
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        console.log("[validateListing] Validation error:", errMsg);
        return next(new ExpressError(errMsg,404));
    }
    next();
}

//review validation middleware

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMsg,404);
    }else{
    next();
    }
}; 

//Review authorization middleware
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You do not have permission to do that !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
