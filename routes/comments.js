var express = require("express");
var router  = express.Router({mergeParams:true});
var campGround = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js")

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

router.get("/new",middleware.isLoggedIn,  (req, res)=>{
    var camp = campGround.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {camp:camp});
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res)=>{
    campGround.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    });
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
})

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment)=>{
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id) ;
        }
    })  
})

router.delete("/:comment_id",middleware.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment)=>{
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comments deleted.")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;