// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");
const unsplash = require("../utils/unsplash");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/playbox");
    }
    res.render("login");
  });

  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/playbox");
    }
    res.render("signup");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.render("members");
  });

  app.get("/playbox", isAuthenticated, function(req, res) {
    db.Playlist.findAll({
      where: {
        UserId: req.user.id,
      },
    }).then(function(dbPlaylist) {
      res.render("main-playbox", {
        // playlist: dbPlaylist,
        playlist: dbPlaylist.map((item) => item.toJSON()),
      });
    });
  });

  app.get("/create-playlist", isAuthenticated, function(req, res) {
    res.render("create-playlist");
  });

  app.get("/playlist/:id", isAuthenticated, function(req, res) {
    db.Playlist.findOne({
      where: {
        id: req.params.id,
      },
      include: [db.User],
    }).then(function(dbPlaylist) {
      res.render("playpage", dbPlaylist.toJSON());
    });
  });

  app.get("/mood", function(req, res) {
    let query;
    if (req.query.mood) {
      query = req.query.mood;
    } else {
      query = "kittens";
    }
    unsplash.search
      .photos(query, 1, 10, { orientation: "portrait" })
      .then((data) => data.json())
      .then(({ results }) => {
        // Your code
        res.render("mood", {
          photos: results,
        });
      });
  });
};
