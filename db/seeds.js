require("dotenv").config();
const db = require("../models");
db.User.findOne({
  where: {
    email: "admin@sendmoods.com",
  },
}).then(function(user) {
  if (user) {
    return;
  }
  db.User.create({
    email: "admin@sendmoods.com",
    password: process.env.PASSWORD,
  }).then(function(dbUser) {
    Promise.all([
      db.Playlist.create({
        title: "Super Chillin",
        description: "So much chill",
        youtubeVideoId: "5qap5aO4i9A",
        mood: "ice",
        UserId: dbUser.id,
      }),
    ]).then(function() {
      console.log("DB seeded");
    });
  });
});
