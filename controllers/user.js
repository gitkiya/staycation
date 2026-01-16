const User = require("../model/user.js");
const {getCountryCode} = require("../utils/countryCode.js");

module.exports.signupForm = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.createUser = async(req,res)=>{
    try{
        let {username,email,password,nationName} = req.body;
        const nationCode = getCountryCode(nationName);
        const user = new User({username,email,password,nationName,nationCode});
        const registeredUser = await User.register(user,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            } 
            req.flash("success","Welcome to Staycation");
            res.redirect("/listings");
        });  
        
    }catch(err){
        req.flash("error", err.message  );
        res.redirect("/signup");
    }
};


module.exports.loginForm = (req,res)=>{
    res.render("user/login.ejs");
};


module.exports.loginAuthentication =  async(req,res)=>{   
    req.flash("success","Welcome back to staycation !");         
    let redirectUrl = res.locals.redirectUrl || "/listings";
    console.log( redirectUrl);
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye !");
        res.redirect("/listings");
    });
};
