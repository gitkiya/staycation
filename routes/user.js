const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapasync = require("../utils/wrapasyn.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");



router
    .route("/signup") 
    .get(userController.signupForm) 
    .post(wrapasync(userController.createUser));

   
router
    .route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{
            successFlash: "Welcome Back !",
            failureFlash: true,
            failureRedirect: "/login"
    }),userController.loginAuthentication);


router.get("/logout", userController.logout);



module.exports = router;