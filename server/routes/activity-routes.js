import express from 'express'
import { verifyToken } from '../middleware/auth-middleware.js'
import { getActivity } from '../controllers/activity-controllers.js'

const router = express.Router()

router.get('/get', verifyToken, getActivity)

export default router
