var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //index.js is the default name. otherwise put ../middleware/name.js

// NEW comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", err ? err.message : "Could not find Campground.");
            res.redirect("back");
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
    
});

// CREATE comment
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", err ? err.message : "Could not find Campground.");
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err || !comment){
                    req.flash("error", err ? err.message : "Could not create Comment. Please try again.");
                    res.redirect("back");
                } else {
                    //add id and username to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment created successfully.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", err ? err.message : "Could not find Campground.");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err || !foundComment){
                    req.flash("error", err ? err.message : "Could not find Comment.");
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
                }
            });
        }
    });
});

// UPDATE comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    req.body.comment.lastUpdatedAt = Date.now();
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || !updatedComment){
            req.flash("error", err ? err.message : "Could not Update Comment. Please try again.");
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - delete selected comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", err ? err.message : "Could not delete comment. Please try again.");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;