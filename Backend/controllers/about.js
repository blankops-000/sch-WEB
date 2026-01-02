// Static content for about section
const aboutContent = {
  mission: "To provide quality education that empowers students to achieve their full potential and become responsible global citizens.",
  vision: "To be a leading educational institution recognized for academic excellence, character development, and community engagement.",
  history: "Founded in 1995, our school has grown from a small community school to a comprehensive educational institution serving over 1000 students.",
  values: [
    "Excellence in Education",
    "Integrity and Honesty",
    "Respect for All",
    "Community Engagement",
    "Innovation and Creativity"
  ],
  leadership: {
    principal: "Dr. Sarah Johnson",
    vicePrincipal: "Mr. David Chen",
    boardChair: "Mrs. Maria Rodriguez"
  },
  facilities: [
    "Modern classrooms with smart boards",
    "Science and computer laboratories",
    "Library with digital resources",
    "Sports complex and playground",
    "Auditorium and music rooms",
    "Cafeteria and health clinic"
  ],
  statistics: {
    students: 1250,
    staff: 85,
    classrooms: 45,
    established: 1995
  }
};

// @desc    Get about information
// @route   GET /api/about
// @access  Public
exports.getAboutInfo = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: aboutContent
    });
  } catch (error) {
    console.error('Get about info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about information'
    });
  }
};

// @desc    Update about information
// @route   PUT /api/about
// @access  Private/Admin
exports.updateAboutInfo = async (req, res) => {
  try {
    // In a real application, you would save this to database
    // For now, we'll just update the in-memory object
    Object.assign(aboutContent, req.body);
    
    res.status(200).json({
      success: true,
      message: 'About information updated successfully',
      data: aboutContent
    });
  } catch (error) {
    console.error('Update about info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating about information'
    });
  }
};