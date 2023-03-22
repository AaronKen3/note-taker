const fs = require("fs");
const express = require("express");
const path = require("path");

const store = require("./db/store");

let app = express();
let PORT = process.env.PORT || 3001;
const mainPage = path.join(__dirname, "/public");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(mainPage, "notes.html"));
});

app.get("/api/notes", function (req, res) {
  store
    .getNotes()
    .then((notes) => res.json(notes))
    .catch((err) => res.status(500).json(err));
});

// app.get("/api/notes/:id", function (req, res) {
//   let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
//   res.json(savedNotes[Number(req.params.id)]);
// });

app.post("/api/notes", function (req, res) {
  store
    .addNotes(req.body)
    .then((note) => res.json(note))
    .catch((err) => res.status(500).json(err));
});

app.delete("/api/notes/:id", function (req, res) {
  let noteId = req.params.id;
  let newId = 0;
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

  console.log("${noteId} has been deleted");
  savedNotes = savedNotes.filter((currentNotes) => {
    return currentNotes.id != noteId;
  });

  for (currentNotes of savedNotes) {
    currentNotes.id = newId.toString();
    newId++;
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(mainPage, "index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
