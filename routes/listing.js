const express = require('express');
const router = express.Router();
const Listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapasyn.js");
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//listings route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('image'),
        validateListing,
        wrapAsync(listingController.createListing));
//new route
router.get("/new",isLoggedIn, listingController.newListingForm);

//search route
router.get("/find",wrapAsync(listingController.searchListing));



//update and show and delete routes
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(isLoggedIn,isOwner,upload.single('image'),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));



module.exports = router;