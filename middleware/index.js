const Campground = require("../models/campgrounds"),
      Comment    = require("../models/comments");
      
//All the middleware will go here
var middlewareObj = {};

middlewareObj.checkCommentOwner = (req, res, next) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/campgrounds');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
  };


middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err || !foundCampground){
          console.log(err);
          req.flash('error', 'Sorry, that campground does not exist!');
          res.redirect('/campgrounds');
      } else if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
          req.campground = foundCampground;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/campgrounds/' + req.params.id);
      }
    });
  };

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login");
    res.redirect("/login");
}

module.exports = middlewareObj