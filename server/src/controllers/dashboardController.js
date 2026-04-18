const Lead = require('../models/Lead');
const { successResponse } = require('../utils/apiResponse');

const getDashboard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const [metricsAgg, recentLeads] = await Promise.all([
      Lead.aggregate([
        { $match: { owner } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Lead.find({ owner }).sort({ createdAt: -1 }).limit(8)
    ]);

    const metrics = { new: 0, quoted: 0, booked: 0, completed: 0 };
    metricsAgg.forEach((m) => {
      if (Object.prototype.hasOwnProperty.call(metrics, m._id)) {
        metrics[m._id] = m.count;
      }
    });

    return res.json(successResponse('Dashboard fetched successfully', { metrics, recentLeads }));
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
