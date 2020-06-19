// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const unsplash = require("../utils/unsplash");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");


module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("index")
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });
  app.get("/members", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
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
