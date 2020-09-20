const fs = require("fs");
const express = require("express");
const path = require("path");

var app = express();
var PORT = process.env.PORT || 8080;
const mainPage = path.join(__dirname, "/public");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainPage, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(mainPage, "index.html"));
});

app.post("/api/notes", function(req, res) {
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    var specialId = (savedNotes.length).toString();
    var newNotes = req.body;
    newNotes.id = specialId;
    savedNotes.push(newNotes);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved: ", newNotes);
    res.json(savedNotes);

});

app.delete("/api/notes/:id", function(req, res) {
    var noteId = req.params.id;
    var newId = 0;
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    console.log("${noteId} has been deleted");
    savedNotes = savedNotes.filter(currentNotes => {
        return currentNotes.id != noteId;
    })

    for (currentNotes of savedNotes) {
        currentNotes.id = newId.toString();
        newId++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});