//============
//INDEX ROUTES
//============

const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");

//ROOT ROUTE
router.get("/", (req, res) => {
   res.render("home"); 
});

//Show register form
router.get("/register", (req, res) => {
    res.render("register");
});

//Handle sign up logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", (req, res) => {
    res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {

});

//logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logout Successful");
    res.redirect("/campgrounds");
});

module.exports = router;