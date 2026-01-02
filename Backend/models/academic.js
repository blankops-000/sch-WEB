const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  gradeLevel: {
    type: String,
    enum: ['all', 'pre-school', 'primary', 'secondary', 'senior'],
    default: 'all'
  },
  subjects: [{
    name: String,
    description: String,
    syllabus: String, // PDF file path
    faculty: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    }]
  }],
  resources: [{
    title: String,
    type: String,
    fileUrl: String,
    description: String
  }],
  curriculum: {
    type: String // PDF file path
  },
  achievements: [{
    title: String,
    description: String,
    date: Date,
    students: [String]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Academic', academicSchema);