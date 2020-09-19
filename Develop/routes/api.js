const fs = require("fs");
var data = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));

module.exports = function(app) {
    app.get("/api/notes", function(req, res) {
        res.json(data);
    });

    app.get("/api/notes/:id", function(req, res) {
        res.json(data[Number(req.params.id)]);
    });

    app.post("/api/notes", function(req, res) {
        var newNote = req.body;
        var Id = (data.length).toString();
        console.log(Id);
        newNote.id = Id;
        data.push(newNote);

        fs.writeFileSync("./db/db.json", JSON.stringify(data), function(err) {
            if(err) throw (err);
        });

        res.json(data);
    })
}