const path = require("path");

module.exports = function(app) {
    app.get("/index.html", function(req, res) {
        res.sendfile(path.join(__dirname, "/../public/index.html"));
    });

    app.get("/notes.html", function(req, res) {
        res.sendfile(path.join(__dirname, "/../public/notes.html"));
    });
}