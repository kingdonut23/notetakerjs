const express = require('express');
const uniqid = require('uniqid');
const fs = require('fs');
const app = express();

var PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
})

app.get("/notes", (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
})

app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        let formattedData = JSON.parse(data)
        res.json(formattedData);
    });
})

app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    newNote.id = uniqid();

    fs.readFile('./db/db.json', function (err, data) {
        if (err) throw err;
        var notes = JSON.parse(data);
        notes.push(newNote);

         fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.redirect("/notes");
          });  
    })
})

app.delete("/api/notes/:id", (req, res) => {
    let selectId = req.params.id;

    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        let savedNotes = notes.filter(note => { return note.id !== selectId; });

        fs.writeFile('./db/db.json', JSON.stringify(savedNotes), (err) => {
            if (err) throw err;
            res.send('Goodbye note!');
        }); 
    })
})

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });