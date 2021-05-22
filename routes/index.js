var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});


// 1. Register form
router.get("/register", function(req, res){
    res.render("register");
});
 
// 2. Register Form Logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// 1. Login Form
router.get("/login", function(req,res){
    res.render("login");
});

// 2. Loin form Logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/register"
    }),function(req,res){
        if(err){
            console.log(err);
        }
});

// LOGOUT ROUTE
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged You Out!")
    res.redirect("/campgrounds");
});

module.exports = router;