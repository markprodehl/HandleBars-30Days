// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
const db = require("../models");

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
    let page = "Pushups";
    if (req.query.workout) {
      page = req.query.workout;
    }

    const colorArr = [
      "w3-theme-l5",
      "w3-theme-l4",
      "w3-theme-l3",
      "w3-theme-l2",
      "w3-theme-l1",
      "w3-theme",
      "w3-theme-d1"
    ];

    db.User.findOne({
      attributes: ["email", "id", "challenge"],
      where: {
        id: req.user.id
      }
    }).then(dbUser => {
      let pageModel = dbUser.toJSON();

      if (!pageModel.challenge) {
        pageModel.challenge = [];
      }
      // Holds previous challenge data
      let duplicate = { ...pageModel };

      pageModel.challenge = pageModel.challenge
        .filter(c => c.challengeName === page)
        .map((c, i) => ({
          ...c,
          color: colorArr[i % colorArr.length],
          isComplete: parseInt(c.isComplete)
        }));

      const newWorkouts = [];

      for (let i = 0; i < 30; i++) {
        const challengeDay = {
          day: (i + 1).toString(),
          challengeName: page,
          color: colorArr[i % colorArr.length],
          reps: setProperTask(page, i),
          // (i + 25).toString(),
          isComplete: 0
        };
        newWorkouts.push(challengeDay);
      }

      pageModel.challenge = [...pageModel.challenge, ...newWorkouts];

      pageModel.challenges = ["Pushups", "Situps", "JumpRope"];
      dbUser
        .update({
          // insert previous challenge data
          // insert new challenge data
          challenge: [...duplicate.challenge, ...newWorkouts]
        })
        .then(() => {
          res.render("demo", {
            ...pageModel,
            empty: pageModel.challenge.length === 0
          });
        });
    });
  });
};
function setProperTask(selectedChallenge, i) {
  const pushupArr = [
    "15 reps",
    "15 reps",
    "15 reps",
    "15 reps",
    "15 reps",
    "15 reps",
    "None, REST DAY",
    "20 reps",
    "20 reps",
    "20 reps",
    "20 reps",
    "20 reps",
    "20 reps",
    "None, REST DAY",
    "25 reps",
    "25 reps",
    "25 reps",
    "25 reps",
    "30 reps",
    "30 reps",
    "None, REST DAY",
    "30 reps",
    "30 reps",
    "30 reps",
    "35 reps",
    "35 reps",
    "40 reps",
    "None, REST DAY",
    "40 reps",
    "45 reps"
  ];
  const situpArr = [
    "25 reps",
    "25 reps",
    "25 reps",
    "25 reps",
    "25 reps",
    "25 reps",
    "None, REST DAY",
    "25 reps",
    "25 reps",
    "30 reps",
    "30 reps",
    "30 reps",
    "30 reps",
    "None, REST DAY",
    "35 reps",
    "35 reps",
    "35 reps",
    "35 reps",
    "45 reps",
    "45 reps",
    "None, REST DAY",
    "45 reps",
    "45 reps",
    "50 reps",
    "50 reps",
    "50 reps",
    "55 reps",
    "None, REST DAY",
    "55 reps",
    "60 reps"
  ];
  const jumpRopeArr = [
    "1 min",
    "1 min",
    "1 min",
    "1 min 20 sec",
    "1 min 20 sec",
    "1 min 40 sec",
    "None, REST DAY",
    "2 min",
    "2 min",
    "2 min",
    "2 min 20 sec",
    "2 min 20 sec",
    "2 min 40 sec",
    "None, REST DAY",
    "3 min",
    "3 min",
    "3 min",
    "3 min 20 sec",
    "3 min 30 sec",
    "3 min 40 sec",
    "None, REST DAY",
    "4 min",
    "4 min",
    "4 min",
    "4 min 20 sec",
    "4 min 20 sec",
    "4 min 40 sec",
    "None, REST DAY",
    "5 min",
    "5 min"
  ];
  if (selectedChallenge === "Pushups") {
    return pushupArr[i];
  } else if (selectedChallenge === "Situps") {
    return situpArr[i];
  } else if (selectedChallenge === "JumpRope") {
    return jumpRopeArr[i];
  }
}
