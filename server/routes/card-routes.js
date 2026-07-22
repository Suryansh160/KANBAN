import express from 'express'
import { verifyToken } from '../middleware/auth-middleware.js'
import {
  getCards,
  createCard,
  updateCard,
  deleteCard
} from '../controllers/card-controllers.js'

const router = express.Router()

router.get('/get', verifyToken, getCards)
router.post('/create', verifyToken, createCard)
router.patch('/update/:id', verifyToken, updateCard)
router.delete('/delete/:id', verifyToken, deleteCard)

export default router
