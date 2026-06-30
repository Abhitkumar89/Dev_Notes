import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { initFirebase } from './config/firebase.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  initFirebase();

  app.listen(PORT, () => {
    console.log(`[server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

start();

// Safety nets for unhandled async errors
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled Rejection:', reason);
});
