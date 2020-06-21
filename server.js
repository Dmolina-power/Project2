// Requiring necessary npm packages
require("dotenv").config();
const fetch = require("node-fetch");
global.fetch = fetch;
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
// Requiring passport as we've configured it
const passport = require("./config/sendmoods");
const authCheck 		 = require('./config/middleware/attachAuthenticationStatus');

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);

// Parsing of json body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// sets up public directory
app.use(express.static("public"));

// sets up passport authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(authCheck);

// sets up handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});