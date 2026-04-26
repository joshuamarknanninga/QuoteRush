const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/User');

let app;
let mongod;
let cookie;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  process.env.COOKIE_NAME = 'quoterush_token';
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  app = require('../src/app');
  const connectDb = require('../src/config/db');
  await connectDb();

  const registerRes = await request(app).post('/api/auth/register').send({
    name: 'Lead User',
    businessName: 'Lead Biz',
    email: 'lead@example.com',
    password: 'Password123!'
  });

  cookie = registerRes.headers['set-cookie'];
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Lead CRUD routes', () => {
  let leadId;

  test('creates a lead', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Cookie', cookie)
      .send({ customerName: 'Jane Lead', serviceType: 'Lawn Care', customerEmail: 'jane@lead.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.lead.customerName).toBe('Jane Lead');
    leadId = res.body.data.lead._id;
  });

  test('reads leads', async () => {
    const res = await request(app).get('/api/leads').set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.leads)).toBe(true);
    expect(res.body.data.leads.length).toBe(1);
  });

  test('updates lead status', async () => {
    const res = await request(app)
      .patch(`/api/leads/${leadId}`)
      .set('Cookie', cookie)
      .send({ status: 'quoted', quoteAmount: 250 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.lead.status).toBe('quoted');
  });

  test('deletes lead', async () => {
    const res = await request(app).delete(`/api/leads/${leadId}`).set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
  });

  test('blocks access after trial expires', async () => {
    await User.findOneAndUpdate(
      { email: 'lead@example.com' },
      { $set: { subscriptionStatus: 'trialing', trialEndsAt: new Date(Date.now() - 60_000) } }
    );

    const res = await request(app).get('/api/leads').set('Cookie', cookie);
    expect(res.statusCode).toBe(402);
  });
});
