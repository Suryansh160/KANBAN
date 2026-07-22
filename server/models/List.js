import mongoose from 'mongoose'

const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    position: { type: Number, required: true }
  },
  { timestamps: true }
)

export default mongoose.model('List', listSchema)
