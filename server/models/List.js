import mongoose from 'mongoose'

const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    position: { type: Number, required: true },
    status: {
      type: String,
      enum: ['todo', 'progress', 'review', 'done'],
      default: 'todo'
    }
  },
  { timestamps: true }
)

export default mongoose.model('List', listSchema)
