const app = require('./app');
const env = require('./config/env');
const connectDb = require('./config/db');
const startAutomationRunner = require('./jobs/automationRunner');

const DB_RETRY_MS = 5000;
let automationStarted = false;

const connectWithRetry = async () => {
  try {
    await connectDb();
    console.log('MongoDB connected');

    if (!automationStarted) {
      startAutomationRunner();
      automationStarted = true;
    }
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error(`Retrying MongoDB connection in ${DB_RETRY_MS / 1000}s...`);
    setTimeout(connectWithRetry, DB_RETRY_MS);
  }
};

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
  connectWithRetry();
});
