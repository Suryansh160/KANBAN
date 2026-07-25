import List from '../models/List.js'
import Card from '../models/Card.js'
import logger from '../logger.js'

export async function getLists (req, res) {
  try {
    const lists = await List.find().sort({ position: 1 })
    res.status(200).json({ success: true, lists })
  } catch (err) {
    logger.error('Get lists failed', { error: err.message })
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}

export async function createList (req, res) {
  try {
    const { title, status } = req.body
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: 'Title is required' })
    }

    const count = await List.countDocuments()
    const list = await List.create({
      title,
      position: count,
      status: status || 'todo'
    })

    logger.info(`List created: ${list.title}`, {
      listId: list._id,
      userId: req.userId
    })
    res
      .status(201)
      .json({ success: true, message: 'List created successfully', list })
  } catch (err) {
    logger.error('Create list failed', { error: err.message })
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}

export async function updateList (req, res) {
  try {
    const { id } = req.params
    const { title, position, status } = req.body

    const list = await List.findById(id)
    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' })
    }

    if (title !== undefined) list.title = title
    if (position !== undefined) list.position = position
    if (status !== undefined) list.status = status
    await list.save()

    logger.info(`List updated: ${list._id}`, { userId: req.userId })
    res
      .status(200)
      .json({ success: true, message: 'List updated successfully', list })
  } catch (err) {
    logger.error('Update list failed', { error: err.message })
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}

export async function deleteList (req, res) {
  try {
    const { id } = req.params

    const list = await List.findById(id)
    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' })
    }

    await Card.deleteMany({ list: id })
    await list.deleteOne()

    logger.info(`List deleted: ${id}`, { userId: req.userId })
    res.status(200).json({ success: true, message: 'List deleted' })
  } catch (err) {
    logger.error('Delete list failed', { error: err.message })
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}
