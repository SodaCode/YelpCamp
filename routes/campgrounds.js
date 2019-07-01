const express    = require("express"),
      router     = express.Router(),
      Campground = require("../models/campgrounds"),
      Comment    = require("../models/comments"),
      middleware = require("../middleware");


//INEDX
router.get("/", (req, res) => {
    //get all dbs from db
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log("Error!!!!!");
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    })
});


//create route - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
  //get data from campgrounds array
  let name= req.body.name;
  let image = req.body.image;
  let price = req.body.price;
  let description = req.body.description;
  const author = {
      id: req.user._id,
      username: req.user.username
  }
  let newCampground = {name: name, image: image, price: price, description: description, author: author};
  //Create a new campground and save to the DB
  Campground.create(newCampground, (err, newlyCreatedCampground) => {
      if(err){
            console.log("Error!!!!!");
            console.log(err);
        } else {
            //redirect to campgrounds
            console.log(newlyCreatedCampground);
            res.redirect("/campgrounds");
        }
  })
   
});

//New - display form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//Show - shows more info about one campground
router.get("/:id", (req, res) => {
    //find the campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log("Error!!!!!");
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campgrounds: foundCampground});
        }
    });
});

//Edit campground route
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, (req, res) =>{
  //render edit template with that campground
  res.render("campgrounds/edit", {campground: req.campground});
});

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership,(req, res) => {
   //find and update correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updateCampground) => {
       if(err){
           req.flash("error", err);
           res.redirect("/campgrounds");
       } else {
           //redirect to picked campground page
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds")
        }
    });
});

module.exports = router;