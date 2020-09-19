const fs = require("fs");
const express = require("express");

var app = express();
var PORT = process.env.PORT || 8080

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/assets", express.static("./assets"));

require("./routes/api")(app);
require("./routes/html")(app);

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});