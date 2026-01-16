if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
    
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");
const listingsRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

dbUrl = process.env.ATLASDB_USER;

mongoose.connect(dbUrl)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);



const store = new MongoStore({
    mongoUrl: dbUrl,
    crypto: {
       secret:  process.env.SECERT
    },
    touchAfter: 24*60*60,  
});

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
});

const sessionOption = {
    store,
    secret : process.env.SECERT,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
}



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());  //stored info realated to user in session
passport.deserializeUser(User.deserializeUser());  //get back user from the stored info in session

//flash middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings",listingsRoutes);
app.use("/listings/:id/reviews",reviewsRoutes);
app.use("/",userRoutes);

app.all("/*splat" ,(req,res,next)=>{      
    next(new ExpressError("Page Not Found",404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server working");
})