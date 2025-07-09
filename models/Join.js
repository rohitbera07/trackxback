const mongoose = require('mongoose');
const { Schema } = mongoose;

const joinRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    required: true
  },

  requestedAt: {
    type: Date,
    default: Date.now,
    required: true
  },

  respondedAt: {
    type: Date // only set if accepted or rejected
  }
});

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
