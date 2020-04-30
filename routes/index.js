var express = require("express");
var router  = express.Router();
var campGround = require("../models/campground");
var Comment = require("../models/comment");
var passport = require("passport");
var middleware = require("../middleware/index.js")

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

router.get("/", (req, res)=>{
    res.render("landing");
});

router.get("/register", (req, res)=>{
    res.render("register");
});

router.post("/register", (req, res)=>{
    var user = new User({username: req.body.username});
    User.register(user, req.body.password, function(err, newUser){
        if(err){
            return res.render("register", {"error" : err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect("/campgrounds");
        });
    })
});

router.get("/login", (req, res)=>{
    res.render("login");
})

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){

});

router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;