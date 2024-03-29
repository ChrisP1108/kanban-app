const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { errorHandler } = require('./api/middleware/errorMiddleware');

const { loadNuxt, build } = require('nuxt');
const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

const port = process.env.PORT || 5000;

const { connectDB } = require('./api/config/db');

connectDB();

async function startServer() {
    try {

        // Express Initialization

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

        app.use('/api/boards', require('./api/routes/boardRoutes'));
        app.use('/api/tasks', require('./api/routes/taskRoutes'));
        app.use('/api/user', require('./api/routes/userRoutes'));

        // Error Handler

        app.use(errorHandler) ;

        // Create Nuxt Instance

        const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

        // Render routes with Nuxt.js

        app.use(nuxt.render)

        // Render root route with Nuxt.js

        app.use("/", nuxt.render);

        // Build only in dev mode with hot-reloading

        if (isDev) {
            build(nuxt);
        }

        // Listen On Server

        app.listen(port, () => console.log(`Server started on port ${port}`));

    } catch (err) {
        console.error(err)
    }
}

startServer();