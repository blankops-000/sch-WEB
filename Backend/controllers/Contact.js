const ContactMessage = require('../models/ContactMessage');
const { validationResult } = require('express-validator');
const emailService = require('../utils/emailServices');

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
exports.sendContactMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message } = req.body;
    
    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.ip
    });

    await contactMessage.save();

    // Send email notification to admin
    await emailService.sendContactNotification({
      name,
      email,
      subject,
      message,
      messageId: contactMessage._id
    });

    // Send auto-reply to user
    await emailService.sendAutoReply(email, name);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully',
      data: {
        id: contactMessage._id,
        name,
        email,
        subject
      }
    });
  } catch (error) {
    console.error('Send contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message. Please try again later.'
    });
  }
};

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const subject = req.query.subject;
    
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (subject && subject !== 'all') {
      query.subject = subject;
    }
    
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await ContactMessage.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
};

// @desc    Get single message
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Mark as read if status is new
    if (message.status === 'new') {
      message.status = 'read';
      await message.save();
    }
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching message'
    });
  }
};

// @desc    Reply to message
// @route   POST /api/contact/:id/reply
// @access  Private/Admin
exports.replyToMessage = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    
    const message = await ContactMessage.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    message.status = 'replied';
    message.replyMessage = replyMessage;
    message.repliedAt = new Date();
    await message.save();
    
    // Send reply email
    await emailService.sendReplyEmail(
      message.email,
      message.name,
      message.subject,
      replyMessage
    );
    
    res.status(200).json({
      success: true,
      message: 'Reply sent successfully'
    });
  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending reply'
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    await message.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message'
    });
  }
};