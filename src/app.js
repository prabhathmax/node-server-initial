import express from 'express';
import compression from 'compression';
import apiRouter from './apiRouter';
import cors from './utils/cors';

const port = Number(process.env.PORT) || 19391;

const app = express();

// app.set('trust proxy', true);
app.use(compression({ level: 8 }));
app.use(cors);

app.get('/test', (req, res) => {
    res.json({ message: 'Server seems to be online' });
});

app.post('/api/internal/restart/283b5f1c-59fb-48de-9498-d566b8ce95f9', (req, res) => {
    res.json({ message: 'Restarting' });
    setTimeout(() => {
        process.exit(1);
    }, 300);
});

app.use(apiRouter);

app.use((req, res) => {
    res.status(404).json({
        message: `Route for ${req.method.toUpperCase()} ${JSON.stringify(
            req.originalUrl,
        )} not found`,
    });
});

/* eslint-disable no-console */
console.error(`Attempting to listen on ${port}`);
const server = app.listen(port, (err) => {
    if (err) {
        console.error('Failed to listen on port');
        console.error(err);
        process.exit(1);
    } else {
        console.error(`Now listening on ${port}`);
    }
});

server.timeout = 0;
