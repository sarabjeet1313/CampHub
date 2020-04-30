var express = require("express");
var router  = express.Router();
var campGround = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/")

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

// Routes ===============================
// ======================================

router.get("/", (req, res)=>{
    campGround.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log("Not able to find any data!!!");
        }
        else{
            res.render("campgrounds/index", {campgrounds : allCampgrounds});
        }
    })
});

router.post("/", middleware.isLoggedIn, (req, res) =>{
    var campName = req.body.campName;
    var image = req.body.imageURL;
    var price = req.body.price;
    var description = req.body.desc;
    var user = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name: campName, image: image, price: price, description: description, author: user}
    campGround.create(newCamp, (err, newlyCreated)=>{
        if(err){
            console.log("Not able to create new camp entry");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn , (req, res)=>{
    res.render("campgrounds/new");
});

router.get("/:id", (req, res)=>{
    campGround.findById(req.params.id).populate({path: 'comments'}).exec(function(err, camp){
        if(err){
            console.log("Object with id is not found !!");
        }else{
            res.render("campgrounds/show", {camp: camp});
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
    campGround.findById(req.params.id, (err, foundCampground)=>{
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.render("./campgrounds/edit", {camp: foundCampground});
        }
    })  
})

router.put("/:id/",middleware.checkCampgroundOwnership, (req, res)=>{
    campGround.findByIdAndUpdate(req.params.id, req.body.camp, (err, foundCampground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id) ;
        }
    })  
})

router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
    campGround.findByIdAndRemove(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;