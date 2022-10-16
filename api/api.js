const express = require('express');
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');
const { connectDB } = require('./config/db');
const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(morgan('tiny'));

// API Routes

app.use('/api/boards', require('./routes/boardRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Error Handler

app.use(errorHandler);


app.listen(port, () => console.log(`Server started on port ${port}`));