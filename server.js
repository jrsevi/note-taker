//Variables//

const express = require('express');

const fs = require('fs');

const path = require('path');

const uuid = require('uuid');

const port = process.env.PORT || 3001;

//Initialize//

const app = express();

//static files//

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

//Parse JSON data//

app.use(express.json());

//server start//

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//Routes//

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuid.v4();
    const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
    notes.push(newNote);
    fs.writeFileSync('db/db.json', JSON.stringify(notes));
    res.json(newNote);
});

app.get('/api/notes', (req, res) => {
    let notes = fs.readFileSync('db/db.json', 'utf8');
    notes = JSON.parse(notes);
    res.json(notes);
});

app.delete('/api/notes/:id', (req, res) => {
    const notes = fs.readFileSync('db/db.json', 'utf8');
    notes = JSON.parse(notes);
    notes = notes.filter((note) => note.id !== req.params.id);
    notes = JSON.stringify(notes);
    fs.writeFileSync('db/db.json', notes);
    res.json(JSON.parse(notes));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
