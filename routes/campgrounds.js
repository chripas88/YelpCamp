var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //index.js is the default name. otherwise put ../middleware/name.js

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

var errorMessageFindAll = "Campgrounds not found. ";
var errorMessageCount = "Campground count could not be calculated.";
var errorMessageFind = "Campground not found. ";
var errorMessageCreate = "Could not create Campground. Please try again. ";
var errorMessageUpdate = "Could not Update Campgound. Please try again.";
var errorMessageDelete = "Could not Delete Campgound. Please try again.";
var noCampgroundFound = "No campgrounds found with the selected criteria. Please try again.";



//INDEX - show all campgrounds
router.get("/", function(req, res){
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    
    
    const regex = new RegExp(middleware.escapeRegex(req.query.search === undefined ? "" : req.query.search), 'gi');
    Campground.find({name: regex}).skip((res.locals.perPage * pageNumber) - res.locals.perPage).limit(res.locals.perPage).exec(function (err, allCampgrounds) {
        if(err || !allCampgrounds){
            req.flash("error", err ? errorMessageFindAll + err.message : errorMessageFindAll);
            res.redirect("back");
        } else {
            Campground.count({name: regex}).exec(function (err, count) {
                if (err) {
                    req.flash("error", err ? errorMessageCount + err.message : errorMessageCount);
                    res.redirect("back");
                } else {
                    if(allCampgrounds.length < 1) {
                        res.render("campgrounds/index", {
                            campgrounds: allCampgrounds,
                            current: pageNumber,
                            pages: Math.ceil(count / res.locals.perPage),
                            noCampgroundFound: noCampgroundFound,
                            search: req.query.search
                        });
                        
                    } else {
                        res.render("campgrounds/index", {
                            campgrounds: allCampgrounds,
                            current: pageNumber,
                            pages: Math.ceil(count / res.locals.perPage),
                            noCampgroundFound: null,
                            search: req.query.search
                        });
                    }
                }
            });
        }
    });
});



//CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var price =req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, desc: desc, price: price, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err || !newlyCreated){
            req.flash("error", err ? errorMessageCreate + err.message : errorMessageCreate);
            res.redirect("back");
        } else {
            req.flash("success", "Campground created successfully.");
            res.redirect("/campgrounds");
        }
    });
});

//CREATE - add new campground to DB
// router.post("/", middleware.isLoggedIn, function(req, res){
//   // get data from form and add to campgrounds array
//   var name = req.body.name;
//   var image = req.body.image;
//   var desc = req.body.desc;
//   var price =req.body.price;
//   var author = {
//       id: req.user._id,
//       username: req.user.username
//   }
//   geocoder.geocode(req.body.location, function (err, data) {
//     var lat = undefined;
//     var lng = undefined;
//     var location = undefined;
    
//     if (err || !data.length) {
//       req.flash('error', err + ' Invalid address');
//       //return res.redirect('back');
//     } else {
//         lat = data[0].latitude;
//         lng = data[0].longitude;
//         location = data[0].formattedAddress;
//     }
     
//     var newCampground = {name: name, image: image, desc: desc, price: price, author: author, location: location, lat: lat, lng: lng};
//     // Create a new campground and save to DB
//     Campground.create(newCampground, function(err, newlyCreated){
//         if(err || !newlyCreated){
//             req.flash("error", err ? errorMessageCreate + err.message : errorMessageCreate);
//             res.redirect("back");
//         } else {
//             req.flash("success", "Campground created successfully.");
//             res.redirect("/campgrounds");
//         }
//     });
//   });
// });

//NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows details of one campground
router.get("/:id", function(req, res){
    //find the campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", err ? errorMessageFind + err.message : errorMessageFind);
            res.redirect("back");
        }
        else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// EDIT - shows edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", err ? errorMessageFind + err.message : errorMessageFind);
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE - updates the data of a campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    req.body.campground.lastUpdatedAt = Date.now();
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err || !updatedCampground){
            req.flash("error", err ? errorMessageUpdate + err.message : errorMessageUpdate);
            res.redirect("back");
        } else {
            req.flash("success", "Campground updated successfully.");
            res.redirect("/campgrounds/" + updatedCampground.id);
        }
    });
});

// UPDATE CAMPGROUND ROUTE
// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//     req.body.campground.lastUpdatedAt = Date.now();
//     geocoder.geocode(req.body.campground.location, function (err, data) {
//         if (err || !data.length) {
//             req.flash('error', err +' Invalid address');
//             //return res.redirect('back');
//             req.body.campground.lat = undefined;
//             req.body.campground.lng = undefined;
//             req.body.campground.location = undefined;
//         } else {
//             req.body.campground.lat = data[0].latitude;
//             req.body.campground.lng = data[0].longitude;
//             req.body.campground.location = data[0].formattedAddress;
//         }
        
//         Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//             if(err || !updatedCampground){
//                 req.flash("error", err ? errorMessageUpdate + err.message : errorMessageUpdate);
//                 res.redirect("back");
//             } else {
//                 req.flash("success", "Campground updated successfully.");
//                 res.redirect("/campgrounds/" + updatedCampground.id);
//             }
//         });
//     });
// });

// DESTROY - delete selected campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err ? errorMessageDelete + err.message : errorMessageDelete);
            res.redirect("back");
        } else {
            req.flash("success", "Campground deleted successfully.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;