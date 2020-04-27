// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
const db = require("../models")

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page

  // app.get("/members", isAuthenticated, function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/members.html"));
  // });

  app.get("/members", isAuthenticated, function(req, res) {
    let page = 'Pushup';
    if (req.query.workout) {
      page = req.query.workout
    }

    const colorArr = [
      "w3-theme-l5",
      "w3-theme-l4",
      "w3-theme-l3",
      "w3-theme-l2",
      "w3-theme-l1",
      "w3-theme",
      "w3-theme-d1"
    ]

    db.User.findOne({
      attributes: ["email", "id", "challenge"],
      where: {
        id: req.user.id
      }
    }).then(dbUser => {
      let pageModel = dbUser.toJSON()

      if (!pageModel.challenge) pageModel.challenge = [];
      // Holds previous challenge data 
      let duplicate = {...pageModel }

      pageModel.challenge = pageModel.challenge
        .filter(c => c.challengeName === page)
        .map((c, i) => ({
          ...c,
          color: colorArr[i % colorArr.length],
          isComplete: parseInt(c.isComplete)
        }))

      const newWorkouts = []
      if (!pageModel.challenge.length) {
        for (let i = 0; i < 30; i++) {
          const challengeDay = {
            day: (i + 1).toString(),
            challengeName: page,
            color: colorArr[i % colorArr.length],
            reps: (i + 25).toString(),
            isComplete: 0
          };
          newWorkouts.push(challengeDay);
        }
      }
      pageModel.challenge = [...pageModel.challenge, ...newWorkouts]
      pageModel.challenges = [
        'Pushups',
        'Situps',
        'JumpRope',
        'Burpees',
        'Skip',
        'pullups'
      ]
      dbUser.update({
        // insert previous challenge data
        // insert new challenge data
        challenge: [...duplicate.challenge, ...newWorkouts]
      }).then(() => {
        res.render("demo", {
          ...pageModel,
          empty: pageModel.challenge.length === 0
        })
      })
    });
  })
};