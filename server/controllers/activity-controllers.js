import Activity from '../models/Activity.js'
import logger from '../logger.js'

export async function getActivity (req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
    res.status(200).json({ success: true, activities })
  } catch (err) {
    logger.error('Get activity failed', { error: err.message })
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}
