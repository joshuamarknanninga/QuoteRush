const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Lead = require('../src/models/Lead');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Model validation', () => {
  test('requires customerName and serviceType for Lead', async () => {
    const lead = new Lead({});
    let err;
    try {
      await lead.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeTruthy();
    expect(err.errors.customerName).toBeTruthy();
    expect(err.errors.serviceType).toBeTruthy();
  });
});
