const Academic = require('../models/Academic');

// @desc    Get all academic programs
// @route   GET /api/academics
// @access  Public
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Academic.find()
      .populate('subjects.faculty', 'name position photo')
      .sort({ gradeLevel: 1 });
    
    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching academic programs'
    });
  }
};

// @desc    Get program by grade level
// @route   GET /api/academics/grade/:level
// @access  Public
exports.getProgramByGrade = async (req, res) => {
  try {
    const program = await Academic.findOne({ 
      gradeLevel: req.params.level 
    }).populate('subjects.faculty', 'name position photo');
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found for this grade level'
      });
    }
    
    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Get program by grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching program'
    });
  }
};

// @desc    Get all subjects
// @route   GET /api/academics/subjects
// @access  Public
exports.getAllSubjects = async (req, res) => {
  try {
    const programs = await Academic.find()
      .select('gradeLevel subjects');
    
    const subjects = [];
    programs.forEach(program => {
      program.subjects.forEach(subject => {
        subjects.push({
          ...subject.toObject(),
          gradeLevel: program.gradeLevel
        });
      });
    });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects'
    });
  }
};