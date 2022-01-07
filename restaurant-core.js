import express from 'express';
import mongoose from 'mongoose';
import config from './config/index.mjs';

import routes from './routes/index.mjs';

const app = express();
app.use(express.json());

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