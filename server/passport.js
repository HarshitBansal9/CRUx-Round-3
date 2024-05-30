const dotenv = require('dotenv');
const passport = require('passport');
dotenv.config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, /*cb*/done) {
    /* User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    }); */
    done(null,profile)
  }
));

//Serializing and Deserializing User as we are using sessions
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
