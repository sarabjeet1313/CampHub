const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const request = require("request");
const app = express();
const bodyParser = require("body-parser");
const seedDb = require("./seed");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
const commentRoutes = require("./routes/comments");
const methodOverride = require("method-override");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true } );

// seedDb(); 
campGround = require("./models/campground");
Comment    = require("./models/comment")
User       = require("./models/user");


// PASSPORT configuration
app.use(require("express-session")({
    secret: "It all starts from the mud and will end there !!!!",
    resave: false,
    saveUninitialized: false
}))


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/campgrounds" , campgroundRoutes);
app.use("/" , indexRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);

app.listen(3000, ()=>{
    console.log("Yelp Camp has started !!!");
})