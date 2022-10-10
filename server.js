const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./api/middleware/errorMiddleware');

const { loadNuxt, build } = require('nuxt');
const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

const port = process.env.PORT || 5000;

async function startServer() {
    try {
        
        // Express Initialization

        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

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