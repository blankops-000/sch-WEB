const Staff = require('../models/Staff');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Public
exports.getAllStaff = async (req, res) => {
  try {
    const department = req.query.department;
    
    let query = { isActive: true };
    
    if (department && department !== 'all') {
      query.department = department;
    }
    
    const staff = await Staff.find(query)
      .sort({ order: 1, name: 1 })
      .select('-__v');
    
    // Group by department
    const groupedStaff = staff.reduce((acc, member) => {
      if (!acc[member.department]) {
        acc[member.department] = [];
      }
      acc[member.department].push(member);
      return acc;
    }, {});
    
    const departments = await Staff.distinct('department');
    
    res.status(200).json({
      success: true,
      count: staff.length,
      departments,
      data: groupedStaff
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff directory'
    });
  }
};

// @desc    Get staff member by ID
// @route   GET /api/staff/:id
// @access  Public
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Get staff by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff member'
    });
  }
};