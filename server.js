const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./notes.db');
const cors = require('cors');


app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.post('/notes', (req, res) => {
  const { content } = req.body;
  db.run('INSERT INTO notes (content) VALUES (?)', [content], function(err) {
    if (err) return res.status(500).send('Error saving note');
    res.send({ id: this.lastID });
  });
});

app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes ORDER BY created_at DESC LIMIT 5', [], (err, rows) => {
    if (err) return res.status(500).send('Error fetching notes');
    res.json(rows);
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
