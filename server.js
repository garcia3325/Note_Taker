//Dependencies
const express = require ("express");
const path = require ("path");
const fs = require ('fs');
const util = require ("util");
const { addAbortSignal } = require("stream");
const { restoreDefaultPrompts } = require("inquirer");


//Handling Asynchronous process
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


//  Setting up server
const app = express();
const port= process.env.PORT || 8000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());


//Static Middleware 
app.use(express.static("./Develop/public"));


//API Route | "GET" REQUEST
app.get("/api/notes", function(req, res){
    readFileAsync("./develop/db/db.json","utf8").then(function(data){
      notes = [].concat(JSON.parse(data))  
      res.json(notes);
    })
});

// API Route | "POST" request
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./develop/db/db.json", "utf8").then(function(data){
        const notes = [].concat(JSON.parse(data));
        note.id = note.length + 1
        note.push(note);
        return notes 
    }).then(function(notes){
        writeFileAsync("./develop/db/db.json",JSON.stringify(notes))
        res.json(notes);
    }) 
});

//API Route | "Delete" request
app.delete("/api/notes/:id", function(req, res) {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNoteData = []
        for (let i=0; i<notes.length; i++) {
           if (idToDelete !== notes[i].id) {
            newNoteData.push(notes[i])   
           }
           } 
        return newNoteData
}).then(function(notes) {
writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
res.send('save success!!!');
})
})


//HTML Routes
app.get("notes", function(req, res){
    res.sendFile(path.join(__dirname,"./Develop/public/notes.html"));
});

app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname,"./Develop/public/index.html"));
});

app.get("*", function(req,res) {
    res.sendFile(path.join(__dirname,"./Develop/public/index.html"));
});

app.listen(PORT, function() {
console.log("App listening on PORT" + port)
});
