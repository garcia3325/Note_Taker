var db = require("../db/db.json");
var fs = require("fs")

//API Route | "GET" REQUEST
module.exports = function (app) {
app.get("/api/notes", function(req, res){
      res.json(notes);
    })
};
const express = require("express");
const app = express();

// API Route | "POST" request
app.post("/api/notes", function (req, res) {
    db.push(req.body);
    // Add unique id to each note
    db.forEach((obj, i) => {
      obj.id = i + 1;
    });
    // Return the new note to the client
    fs.writeFile("./db/db.json", JSON.stringify(db), function () {
      res.json(db);
    });
  });

  // API DELETE Request
  app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id;
    // Use splice to delete the selected note from the db array
    db.splice(id - 1, 1);
    // Reassign id for each note object
    db.forEach((obj, i) => {
      obj.id = i + 1;
    });
    // Return the remaining notes to the client
    fs.writeFile("./db/db.json", JSON.stringify(db), function () {
      res.json(db);
    });
  });