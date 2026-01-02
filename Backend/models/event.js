const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  eventType: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'holiday', 'meeting', 'other'],
    default: 'academic'
  },
  location: {
    type: String
  },
  audience: {
    type: String,
    enum: ['all', 'students', 'parents', 'staff', 'public'],
    default: 'all'
  },
  colorCode: {
    type: String,
    default: '#3498db'
  },
  image: {
    type: String
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ startDate: 1, eventType: 1 });

module.exports = mongoose.model('Event', eventSchema);