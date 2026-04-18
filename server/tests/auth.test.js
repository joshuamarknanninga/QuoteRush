const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongod;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  process.env.COOKIE_NAME = 'quoterush_token';
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  app = require('../src/app');
  const connectDb = require('../src/config/db');
  await connectDb();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Auth routes', () => {
  test('registers user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      businessName: 'Test Biz',
      email: 'test@example.com',
      password: 'Password123!'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  test('logs in user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'Password123!'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeTruthy();
  });
});
