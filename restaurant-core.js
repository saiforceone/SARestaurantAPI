import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';

import config from './config/index.mjs';
import routes from './routes/index.mjs';

const app = express();
app.use(express.json());
app.use(cors());
morgan.token('type', function (req, res) { return req.headers['content-type'] });
morgan.token('headers', function (req, res) { return req.headers['authorization'] });
app.use(morgan(':headers'));
app.use(passport.initialize());
import './auth/auth.mjs';

app.listen(config.serverPort, async () => {
  console.log(`API running on port: ${config.serverPort}`);
  try {
    await mongoose.connect(config.mongoURI);
    console.log(`Connected to database: ${config.mongoURI}`);

    routes(app);
  } catch (e) {
    console.log('Restaurant core encountered an error: ', e.toString());
  }
});