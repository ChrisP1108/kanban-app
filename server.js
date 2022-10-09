const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.get('/api/boards', (req, res) => {
    res.json({ message: 'Get Boards' })
})

app.listen(port, () => console.log(`Server started on port ${port}`));