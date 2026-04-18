const bcrypt = require('bcryptjs');
const connectDb = require('../src/config/db');
const User = require('../src/models/User');
const Lead = require('../src/models/Lead');
const BusinessSettings = require('../src/models/BusinessSettings');
const AutomationJob = require('../src/models/AutomationJob');
const MessageLog = require('../src/models/MessageLog');

const seed = async () => {
  await connectDb();

  await Promise.all([User.deleteMany({}), Lead.deleteMany({}), BusinessSettings.deleteMany({}), AutomationJob.deleteMany({}), MessageLog.deleteMany({})]);

  const passwordHash = await bcrypt.hash('DemoPass123!', 12);
  const user = await User.create({
    name: 'Demo Owner',
    businessName: 'Rush Detail Co',
    email: 'demo@quoterush.app',
    passwordHash,
    role: 'owner'
  });

  await BusinessSettings.create({
    owner: user._id,
    businessPhone: '(555) 111-2222',
    businessEmail: 'demo@quoterush.app',
    reviewLink: 'https://example.com/review',
    defaultReminderHours: 24,
    defaultFollowupHours: 48,
    intakeFormSlug: 'rush-detail-co-demo'
  });

  const statuses = ['new', 'quoted', 'booked', 'completed', 'archived'];
  const leads = statuses.map((status, index) => ({
    owner: user._id,
    customerName: `Customer ${index + 1}`,
    customerPhone: `555000000${index}`,
    customerEmail: `customer${index + 1}@mail.com`,
    address: `${index + 10} Main St`,
    serviceType: index % 2 === 0 ? 'Mobile Detailing' : 'Pressure Washing',
    preferredDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (index + 1)),
    message: 'Looking for a quote this week.',
    status,
    quoteAmount: 100 + index * 25
  }));

  await Lead.insertMany(leads);

  console.log('Seed completed. Demo login: demo@quoterush.app / DemoPass123!');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
