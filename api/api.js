const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const port = process.env.PORT || 5000;

const app = express();

// Express Initialization

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error Handler

app.use(errorHandler);

// API Routes

app.use('/api/boards', require('./routes/boardRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

app.listen(port, () => console.log(`Server started on port ${port}`));