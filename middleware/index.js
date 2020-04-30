var middlewareObject = {};
var campGround = require("../models/campground");
var Comment = require("../models/comment");

middlewareObject.checkCommentOwnership =  function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                req.flash("error", "Campground not found.")
                res.redirect("back");
            } else {
                if(!comment) {
                    req.flash("error", "Comment not found.")
                    res.redirect("back");
                }
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permissions to do that.")
                    res.redirect("back");
                }
            }
        })
    }else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObject.checkCampgroundOwnership =  function(req, res, next){
    if(req.isAuthenticated()){
        campGround.findById(req.params.id, function(err, camp){
            if(err){
                req.flash("error", "Campground not found.")
                res.redirect("back");
            } else {
                if(!camp) {
                    req.flash("error", "Campground not found.")
                    res.redirect("back");
                }
                if(camp.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permissions to do that.")
                    res.redirect("back");
                }
            }
        })
    }else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObject

