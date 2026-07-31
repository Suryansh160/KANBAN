import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    message: { type: String, required: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
)

activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 })

export default mongoose.model('Activity', activitySchema)
