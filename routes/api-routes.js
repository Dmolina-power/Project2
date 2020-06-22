// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/sendmoods");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const axios = require("axios");

const accessKey = process.env.ACCESS_KEY;

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
    })
      .then(() => {
        res.redirect(307, "login");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", isAuthenticated, (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's username and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
      });
    }
  });

  app.get("/api/playlist", function(req, res) {
    db.Playlist.findAll({
      include: [db.User],
    }).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });

  app.get("/api/playlist/:id", function(req, res) {
    db.Playlist.findOne({
      where: { id: req.params.id },
      include: [db.User],
    }).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });

  app.delete("/api/playlist/:id", function(req, res) {
    db.Playlist.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(function(dbPlaylist) {
        res.json(dbPlaylist);
      })
      .catch((err) => res.status(500).end());
  });

  app.put("/api/playlist", function(req, res) {
    db.Playlist.update(
      {
        title: req.body.title,
        youtubeVideoId: req.body.youtubeVideoId,
        mood: req.body.mood,
        description: req.body.description,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    ).then(function(dbPlaylist) {
      console.log(dbPlaylist);
      res.json(dbPlaylist);
    });
  });

  app.post("/api/playlist", isAuthenticated, function(req, res) {
    db.Playlist.create({
      title: req.body.title,
      youtubeVideoId: req.body.youtubeVideoId,
      mood: req.body.mood,
      description: req.body.description,
      UserId: req.user.id,
    }).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });

  app.get("/api/unsplash/:search", function(req, res) {
    axios
      .get(
        `https://api.unsplash.com/search/photos?query=${req.params.search}&client_id=${accessKey}`,
        {
          responseType: "stream",
        }
      )
      .then(function(result) {
        axios({
          method: "GET",
          url:
            "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0Mjg1M30", // replace with img url that comes back from unsplash package
          responseType: "stream",
        }).then(function(response) {
          response.data.pipe(res);
        });
      });
  });
};
