const mongoose= require('mongoose')
const { Schema } = mongoose;

const projectSchema = new mongoose.Schema({
     projectName: {
    type: String,
    required: true,
    trim: true
  },

  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },

  projectId: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 8,
    uppercase: true
  }, description: {
    type: String,
    default: ''
  },
  notices: [{
    type: String
  }],
  tasks: [{type:String}]
})
module.exports =mongoose.model('Project',projectSchema)