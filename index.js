const express = require("express"),
bodyParser = require("body-parser"),
  uuid = require("uuid");
 
  const app = express();
  const morgan = require("morgan");
  const fs = require("fs"); // import built in node modules fs and path
 const path = require("path");
 
  
  const mongoose = require("mongoose");
  const Models = require("./models.js");
  
  const Users = Models.User;
  const Movies = Models.Movie;
  const Genres = Models.Genre;
  const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["The Departed"],
  },
];

let movies = [
  {
    title: "The Thing",
    Genre: {
      Name: "Horror",
      Description:
        "In film and television, horror is a category of narrative fiction (or semi-fiction) intended to strike fear with the viewer",
    },
    director: {
      Name: "John Carpenter",
    },

    title: "Jaws",
  },
  {
    title: "The Empire Strikes Back",
  },
  {
    title: "The Departed",
  },
  {
    title: "Aliens",
  },
  {
    title: "Die Hard",
  },
  {
    title: "Terminator 2: Judgement Day",
  },
  {
    title: "Ghostbusters",
  },
  {
    title: "The Prestige",
  },
  {
    title: "Unforgiven",
  },
];
//Create new users
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Update
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("no such user");
  }
});

//Create
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(user);
  } else {
    res.status(400).send("no such user");
  }
});

//Create
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

//delete
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

//delete
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send("no such user");
  }
});

app.use(express.static("public/documentation.html"));
// setup the logger

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);
  if (movie) {
    return res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    return res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.director.Name === directorName
  ).director;

  if (director) {
    return res.status(200).json(director);
  } else {
    res.status(400).send("no such director");
  }
});
// Get all users
app.get('/users', function (req, res) {
  Users.find()
  .then (function(users) {
    res.status(201).json(users);
    })
    .catch (function (err) {
      console.error(err);
        res.status(500).send("error: " + err);
      });
    });

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));




app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

