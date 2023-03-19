const fs = require("fs");
const express = require("express");
const path = require("path");

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
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.get("/api/notes/:id", function (   req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(mainPage, "index.html"));
});

app.post("/api/notes", function (req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let specialId = savedNotes.length.toString();
  let newNotes = req.body;
  newNotes.id = specialId;
  savedNotes.push(newNotes);

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  console.log("Note saved: ", newNotes);
  res.json(savedNotes);
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

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
