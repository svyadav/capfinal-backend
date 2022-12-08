const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const Users = require("../models/users");
require("dotenv").config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;



passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      //   console.log("profile", profile);
      //   done(null, profile);

      const user = await Users.findOne({
        email: profile._json.email,
        accountType: "google",
      });
      if (!user) {
        const newUser = new Users({
          firstName: profile._json.given_name, 
          lastName: profile._json.family_name,
          email: profile._json.email, 
          accountType: "google",
        });

        newUser.save();
      } else {
        console.log("user already exists"); 
      }

      done(null, profile);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      //   console.log("profile", profile);
      //   done(null, profile);

      const user = await Users.findOne({
        email: profile._json.email,
        accountType: "github",
      });
      if (!user) {
        const newUser = new Users({
          firstName: profile._json.name.split(" ")[0],
          lastName: profile._json.name.split(" ")[1],
          email: profile._json.email,
          accountType: "github",
        });

        newUser.save();
      } else {
        console.log("user already exists");
      }

      done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("profile", profile);

      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
