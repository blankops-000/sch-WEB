const Policy = require('../models/Policy');

// @desc    Get all policies
// @route   GET /api/policies
// @access  Public
exports.getAllPolicies = async (req, res) => {
  try {
    const category = req.query.category;
    const applicableTo = req.query.applicableTo;
    
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (applicableTo && applicableTo !== 'all') {
      query.applicableTo = applicableTo;
    }
    
    const policies = await Policy.find(query)
      .sort({ category: 1, effectiveDate: -1 })
      .select('-__v');
    
    // Group by category
    const groupedPolicies = policies.reduce((acc, policy) => {
      if (!acc[policy.category]) {
        acc[policy.category] = [];
      }
      acc[policy.category].push(policy);
      return acc;
    }, {});
    
    res.status(200).json({
      success: true,
      count: policies.length,
      data: groupedPolicies,
      categories: Object.keys(groupedPolicies)
    });
  } catch (error) {
    console.error('Get policies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching policies'
    });
  }
};

// @desc    Get single policy
// @route   GET /api/policies/:id
// @access  Public
exports.getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: policy
    });
  } catch (error) {
    console.error('Get policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching policy'
    });
  }
};

// @desc    Create policy
// @route   POST /api/policies
// @access  Private/Admin
exports.createPolicy = async (req, res) => {
  try {
    const policy = new Policy({
      ...req.body,
      lastUpdatedBy: req.user.id
    });
    
    await policy.save();
    
    res.status(201).json({
      success: true,
      message: 'Policy created successfully',
      data: policy
    });
  } catch (error) {
    console.error('Create policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating policy'
    });
  }
};