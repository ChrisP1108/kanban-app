const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');
const { connectDB } = require('./config/db');
const port = process.env.PORT || 5000;
const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

connectDB();

const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

// Run Morgan On Development Mode.  Had Issue With Installing Morgan As Dev Dependency
        
if (isDev) {
    app.use(morgan('tiny'));
}

// API Routes

app.use('/api/boards', require('./routes/boardRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Error Handler

app.use(errorHandler);


app.listen(port);