require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

// Define routes here
const notesRouter = require('./routes/notes');
app.use('/api/notes', notesRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
