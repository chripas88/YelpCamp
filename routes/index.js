var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Campground = require("../models/campground");
var passport = require("passport");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        });
    if(req.body.avatar){
        newUser.avatar = req.body.avatar;
    }
            
    if(req.body.adminCode === res.locals.adminCode){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err || !user){
            req.flash("error", err ? err.message : "Could not register User. Please try again.");
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "User " + user.username + " registered successfully.");
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You successfully Logged Out!");
    res.redirect("/campgrounds");
});

// USER PROFILE
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("/");
        } else {
            Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
                if(err){
                    req.flash("error", "Something went wrong!");
                    res.redirect("/");
                } else {
                     res.render("users/show", {user: foundUser, campgrounds: campgrounds});
                }
            });
        }
    });
});

// FORGOT PASSWORD
router.get("/forgot", function(req, res) {
    res.render("forgot");
});

router.post("/forgot", function(req, res, next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done){
            User.findOne({ email: req.body.email }, function(err, user){
                if(err || !user){
                    req.flash("error", err ? err + " An account with that email does not exist." : "An account with that email does not exist." );
                    return res.redirect("/forgot");
                }
                
                user.resetPasswordToken = token;
                user.resetPasswordTokenExpires = Date.now() + 3600000; // 1 hour
                
                user.save(function(err){
                    done(err, token, user);
                });
            });
        },
        function(token, user, done){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.GMAILUSER,
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: process.env.GMAILUSER,
                subject: "YelpCamp Administration: Password reset request.",
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                      'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                console.log("email sent");
                req.flash("success", "An e-mail has been sent to " + user.email + " with further instructions.");
                done(err, "done");
            });
        }
    ], function(err){
        if(err){
            return next(err);
        }
        res.redirect("/forgot");
    });
});

// RESET PASSWORD
router.get("/reset/:token", function(req, res) {
   User.findOne({ resetPasswordToken: req.params.token, resetPasswordTokenExpires: { $gt: Date.now() } }, function(err, user){
       if(err || !user){
           req.flash("error", err ? err + " Password reset token is invalid or has expired 1." : "Password reset token is invalid or has expired 1.");
           return res.redirect("/forgot");
       }
       res.render("reset", { token: req.params.token });
   }); 
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordTokenExpires: { $gt: Date.now() } }, function(err, user) {
                if (err || !user) {
                    req.flash('error', err ? err + ' Password reset token is invalid or has expired 2.' : 'Password reset token is invalid or has expired 2.');
                    return res.redirect('back');
                }
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        if(err){
                            req.flash('error', err ? err + ' Password reset error 1.' : 'Password reset error 1.');
                            return res.redirect('back');
                        }
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        
                        user.save(function(err) {
                            if(err){
                                req.flash('error', err ? err + ' User update error.' : 'User update error.');
                                return res.redirect('back');
                            }
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    });
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                    user: process.env.GMAILUSER,
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: process.env.GMAILUSER,
                subject: 'YelpCamp Administration: Your password has been changed',
                text: 'Hello,\n\n' + 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        if(err){
            req.flash('error', err ? err + ' Password reset error 2' : 'Password reset error 2');
            return res.redirect('back');
        }
        res.redirect('/campgrounds');
    });
});

module.exports = router;