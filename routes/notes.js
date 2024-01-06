const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Create a new note
router.post('/', auth, async (req, res) => {
    try {
        const newNote = new Note({ 
            ...req.body, 
            author: req.user.id 
        });
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all notes with pagination
router.get('/', auth, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const notes = await Note.find({ author: req.user.id })
                                .limit(limit * 1)
                                .skip((page - 1) * limit)
                                .exec();

        const count = await Note.countDocuments({ author: req.user.id });

        res.json({
            notes,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Search notes
router.get('/search', auth, async (req, res) => {
    try {
        const searchQuery = req.query.q;
        
        if (!searchQuery) {
            return res.status(400).send('Search query is required');
        }

        const notes = await Note.find({ $text: { $search: searchQuery } });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Get a single note by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        // Check if note exists and belongs to the user
        if (!note || note.author.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note || note.author.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a note
// In your delete route
router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        res.json({ msg: 'Note deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




module.exports = router;
