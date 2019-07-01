const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      Campground = require("../models/campgrounds"),
      Comment    = require("../models/comments"),
      middleware = require("../middleware");

//COMMENTS NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "Something went wrong, try again");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment Added");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//Comment edit route
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwner, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            console.log(foundComment)
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }        
    });
});


//comment update route
router.put("/:comment_id", middleware.checkCommentOwner, (req, res)  => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

//Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwner, (req, res) => {
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;