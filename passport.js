const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      console.log(username + " " + password);
      try {
        console.log(Models);
        console.log(Models.Movie);
        console.log(Models.User);
        Models.User.findOne({ Username: username }).then((user) => {
          if (!user) {
            console.log("incorrect username");
            return callback(null, false, {
              message: "Incorrect username",
            });
          }
          console.log(user);

          if (user.Password != password) {
            console.log("incorrect password");
            return callback(null, false, { message: "Incorrect password." });
          }
          console.log("finished");
          return callback(null, user);
        });
      } catch (error) {
        console.error(error);
        if (error) {
          console.log(error);
          return callback(error);
        }
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
