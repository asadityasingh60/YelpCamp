var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

// Get all Campgroundsfrom DB========================
router.get("/", function(req, res){

    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log("Oh error")
        } else{
            res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
        }
    })
    
});  

//Adding new Campground==========================

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/newCampGrounds");
});

router.post("/",middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description= req.body.description;       // Description is the name attribute of form tag

    var author = {
        id:req.user._id,
        username: req.user.username
    }

    var newCampGrounds={name: name, image: image, description: description, author: author };

    //Create  a new campground and save to DB
    Campground.create(newCampGrounds, function(err, newlyCreated){
        if(err){
            req.flash("error", "You need to logged in do that");
            console.log(err);
        } else {
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// Show- shows more info about one campground===========

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err)
        {
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground})
        }
   });
    //find the campgrounds with provide id
    //render show template with that campground
});

//EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "You don't havepermission to do that");
            console.log(err);
        }
        res.render("campgrounds/edit", {campground: foundCampground}); 
    });
});

//UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "Campground Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id , function(err){
        if(err){
            console.log(err);
        } else{
            req.flash("success", "Campground Deleted!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;