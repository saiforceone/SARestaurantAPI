import express from 'express';
import mongoose from 'mongoose';
import config from './config/index.mjs';

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'default route',
        status: 'Ok'
    });
});

app.listen(config.serverPort, async () => {
    console.log(`API running on port: ${config.serverPort}`);
    try {
        await mongoose.connect(config.mongoURI);
        console.log(`Connected to database: ${config.mongoURI}`);
    } catch (e) {
        console.log('Restaurant core encountered an error: ', e.toString());
    }
});