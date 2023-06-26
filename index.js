const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid");

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const Models = require("./models.js");
const { error } = require("console");

const Movies = Models.Movie;
const Users = Models.User;

mongoose
  .connect("mongodb://localhost:27017/mfDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected Succesfully"));

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

//Create new users
app.post("/users", (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//Update
app.put("/users/:username", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Create
app.post("/users/:username/movies/:movieTitle", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $push: { FavoriteMovies: req.params.movieTitle },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

//delete
app.delete("/users/:username/movies/:movieTitle", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $pull: { FavoriteMovies: req.params.movieTitle },
    },
    { new: true })
.then((updatedUser) => {
  res.status(200).json(updatedUser);
})
.catch((err) => {
  res.status(500).send("Error: " + err);
});
});

//delete
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.use(express.static("public/documentation.html"));
// setup the logger

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/movies/genres/:GenresName", (req, res) => {
  Movies.find({ Genres: req.params.GenresName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

app.get("/movies/directors/:DirectorName", (req, res) => {
  Movies.find({ Director: req.params.DirectorName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

// Get all users
app.get("/users", function (req, res) {
  Users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("error: " + err);
    });
});

// Get a user by username
app.get("/users/:username", (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
