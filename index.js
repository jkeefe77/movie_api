const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"), // import built in node modules fs and path
  path = require("path");

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});




// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: movie_api });
});

app.get("/movies", (req, res) => 
  res.json(topMovies));

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

let topMovies = [
    {
      title: "The Thing",
    },
    {
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