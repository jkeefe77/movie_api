const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"), // import built in node modules fs and path
  path = require("path");

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory

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

app.use(express.static("public/documentation.html"));
// setup the logger

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
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
