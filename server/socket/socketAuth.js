import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import logger from '../logger.js'

export async function socketAuthMiddleware (socket, next) {
  const token = socket.handshake.auth?.token
  if (!token) {
    logger.warn('Socket connection rejected: no token provided')
    return next(new Error('No token provided'))
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    if (!user) {
      logger.warn('Socket connection rejected: user not found', {
        userId: decoded.userId
      })
      return next(new Error('User not found'))
    }
    socket.userId = decoded.userId
    socket.userName = user.name
    socket.userEmail = user.email
    next()
  } catch (err) {
    logger.warn('Socket connection rejected: invalid or expired token', {
      error: err.message
    })
    next(new Error('Invalid or expired token'))
  }
}
