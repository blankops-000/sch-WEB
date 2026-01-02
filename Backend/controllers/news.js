const News = require('../models/News');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
exports.getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    
    const skip = (page - 1) * limit;
    
    let query = { isPublished: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const news = await News.find(query)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await News.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: news.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: news
    });
  } catch (error) {
    console.error('Get all news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news'
    });
  }
};

// @desc    Get single news article
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }
    
    // Increment view count
    news.views += 1;
    await news.save();
    
    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news article'
    });
  }
};

// @desc    Create news article
// @route   POST /api/news
// @access  Private/Admin
exports.createNews = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Handle file upload
    let featuredImage;
    if (req.files && req.files.featuredImage) {
      const file = req.files.featuredImage;
      const fileName = `news-${Date.now()}${path.extname(file.name)}`;
      const uploadPath = path.join(__dirname, '../uploads/news', fileName);
      
      await file.mv(uploadPath);
      featuredImage = `/uploads/news/${fileName}`;
    }
    
    const news = new News({
      ...req.body,
      featuredImage,
      authorId: req.user.id,
      author: req.user.username
    });
    
    await news.save();
    
    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: news
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating news article'
    });
  }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private/Admin
exports.updateNews = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }
    
    // Handle image update
    if (req.files && req.files.featuredImage) {
      // Delete old image
      if (news.featuredImage) {
        const oldImagePath = path.join(__dirname, '..', news.featuredImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      const file = req.files.featuredImage;
      const fileName = `news-${Date.now()}${path.extname(file.name)}`;
      const uploadPath = path.join(__dirname, '../uploads/news', fileName);
      
      await file.mv(uploadPath);
      req.body.featuredImage = `/uploads/news/${fileName}`;
    }
    
    Object.assign(news, req.body);
    await news.save();
    
    res.status(200).json({
      success: true,
      message: 'News article updated successfully',
      data: news
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating news article'
    });
  }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }
    
    // Delete associated image
    if (news.featuredImage) {
      const imagePath = path.join(__dirname, '..', news.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await news.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting news article'
    });
  }
};

// @desc    Get latest news
// @route   GET /api/news/latest
// @access  Public
exports.getLatestNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const news = await News.find({ isPublished: true })
      .sort({ publishDate: -1 })
      .limit(limit)
      .select('title excerpt category publishDate featuredImage slug');
    
    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    console.error('Get latest news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest news'
    });
  }
};