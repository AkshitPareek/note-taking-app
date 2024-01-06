const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newNote = new Note({ title, content, author });
    await newNote.save();
    res.json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    const notes = await Note.find({ $text: { $search: query } });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

