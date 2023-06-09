const express = require('express');
const path = require('path');
const dataD = require("./db/db.json")
const { writeFile } = require("fs");
const { error } = require('console');
const uuid = require('./public/assets/js/uuid')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json()); //content: application/json
app.use(express.urlencoded({ extended: true })); //content: urlencoded

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
  res.status(200).json(dataD);
});

// GET request for a single note
app.get('/api/notes/:note_id', (req, res) => {
  if (req.params.note_id) {
    console.info(`${req.method} request received to get a single a note`);
    const noteId = req.params.note_id;
    for (let i = 0; i < notes.length; i++) {
      const currentNotes = notes[i];
      if (currentNotes.note_id === noteId) {
        res.json(currentNotes);
        return;
      }
    }
    res.status(404).send('Note not found');
  } else {
    res.status(400).send('Note ID not provided');
  }
});

// POST request for notes
app.post('/api/notes', (req, res) => {

  const newNote = req.body
const noteD = uuid()
newNote.id = noteD
  // Add the ID to the newNote object

  dataD.push(newNote);
  const noteString = JSON.stringify(dataD)
  // Write the string to a file
  writeFile(path.join(__dirname, `./db/db.json`), noteString, (err) =>
    err
      ? console.error(err)
      : console.log(
        `Note for ${newNote.product} has been written to JSON file`
      )
  );

  res.status(200).json(dataD);
});

// DELETE request for notes
app.delete('/api/notes/:id', (req, res) => {
  const id = (req.params.id);
  const notesIn = dataD.findIndex(dataD => dataD.id == id);
  dataD.splice(notesIn, 1);
  const string = JSON.stringify(dataD)

  writeFile(path.join(__dirname, `./db/db.json`), string, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing to file');
    }

    return res.send();
  });
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
