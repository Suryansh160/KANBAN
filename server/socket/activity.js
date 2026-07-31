import Activity from '../models/Activity.js'
import logger from '../logger.js'

export async function logActivity (
  io,
  { userId, userName, action, message, meta }
) {
  try {
    const activity = await Activity.create({
      userId,
      userName,
      action,
      message,
      meta
    })
    io.emit('activity:new', activity)
  } catch (err) {
    logger.error('Log activity failed', { error: err.message })
  }
}
