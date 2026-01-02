const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Policy title is required']
  },
  content: {
    type: String,
    required: [true, 'Policy content is required']
  },
  category: {
    type: String,
    enum: ['academic', 'behavior', 'safety', 'technology', 'administration', 'other'],
    default: 'academic'
  },
  version: {
    type: String,
    default: '1.0'
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  reviewDate: {
    type: Date
  },
  fileUrl: {
    type: String // PDF version
  },
  applicableTo: {
    type: [String],
    enum: ['students', 'parents', 'staff', 'all'],
    default: ['all']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Policy', policySchema);