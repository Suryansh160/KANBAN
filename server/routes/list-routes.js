import express from 'express'
import { verifyToken } from '../middleware/auth-middleware.js'
import {
  getLists,
  createList,
  updateList,
  deleteList
} from '../controllers/list-controllers.js'

const router = express.Router()

router.get('/get', verifyToken, getLists)
router.post('/create', verifyToken, createList)
router.post('/update/:id', verifyToken, updateList)
router.delete('/delete/:id', verifyToken, deleteList)

export default router
