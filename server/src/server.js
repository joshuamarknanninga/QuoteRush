const app = require('./app');
const env = require('./config/env');
const connectDb = require('./config/db');
const startAutomationRunner = require('./jobs/automationRunner');

const start = async () => {
  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
    startAutomationRunner();
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
