const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Hello");
      //   console.log(profile);
      const existingUser = await User.findOne({ uid: profile.id });

      if (existingUser) return done(null, existingUser);

      const newUser = await User.create({
        uid: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        photoUrl: profile.photos[0].value,
        authProvider: "google",
        emailVerified: true,
      });

      done(null, newUser);
    }
  )
);

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((id, done) =>
//   User.findById(id).then((user) => done(null, user))
// );
