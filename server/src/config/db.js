const mongoose = require('mongoose');
const env = require('./env');

const connectDb = async () => {
  await mongoose.connect(env.mongoUri);
  return mongoose.connection;
};

module.exports = connectDb;
