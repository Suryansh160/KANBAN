import Card from '../models/Card.js'
import List from '../models/List.js'
import User from '../models/User.js'
import logger from '../logger.js'
import {
  emitCardCreated,
  emitCardUpdated,
  emitCardDeleted
} from '../socket/board.js'

export async function getCards (req, res) {
  try {
    const cards = await Card.find().sort({ position: 1 })
    res
      .status(200)
      .json({ success: true, message: 'Cards fetched successfully', cards })
  } catch (err) {
    logger.error('Get cards failed', { error: err.message })
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}

export async function createCard (req, res) {
  try {
    const { title, list, description, dueDate, labels } = req.body
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: 'Title is required' })
    }
    if (!list) {
      return res
        .status(400)
        .json({ success: false, message: 'List is required' })
    }

    const listExists = await List.findById(list)
    if (!listExists) {
      return res.status(404).json({ success: false, message: 'List not found' })
    }

    const user = await User.findById(req.userId)

    const count = await Card.countDocuments({ list })
    const card = await Card.create({
      title,
      list,
      description: description || '',
      dueDate: dueDate || null,
      labels: labels || [],
      assignee: user?.name || '',
      position: count
    })

    logger.info(`Card created: ${card.title}`, {
      cardId: card._id,
      userId: req.userId
    })

    const io = req.app.get('io')
    emitCardCreated(io, card)

    res
      .status(201)
      .json({ success: true, message: 'Card created successfully', card })
  } catch (err) {
    logger.error('Create card failed', { error: err.message })
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}

export async function updateCard (req, res) {
  try {
    const { id } = req.params
    const { title, description, list, position, dueDate, labels } = req.body

    const card = await Card.findById(id)
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' })
    }

    if (title !== undefined) card.title = title
    if (description !== undefined) card.description = description
    if (list !== undefined) card.list = list
    if (position !== undefined) card.position = position
    if (dueDate !== undefined) card.dueDate = dueDate
    if (labels !== undefined) card.labels = labels

    await card.save()

    logger.info(`Card updated: ${card._id}`, { userId: req.userId })

    const io = req.app.get('io')
    emitCardUpdated(io, card)

    res
      .status(200)
      .json({ success: true, message: 'Card updated successfully', card })
  } catch (err) {
    logger.error('Update card failed', { error: err.message })
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}

export async function deleteCard (req, res) {
  try {
    const { id } = req.params

    const card = await Card.findById(id)
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' })
    }

    await card.deleteOne()

    logger.info(`Card deleted: ${id}`, { userId: req.userId })

    const io = req.app.get('io')
    emitCardDeleted(io, id)

    res
      .status(200)
      .json({ success: true, message: 'Card deleted successfully' })
  } catch (err) {
    logger.error('Delete card failed', { error: err.message })
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}
