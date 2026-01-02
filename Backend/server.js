const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data storage (in production, use a database)
let data = {
    news: [
        {
            id: 1,
            title: 'Students Win National Science Competition',
            content: 'Our senior students took first place in the National Science Olympiad with their innovative renewable energy project.',
            excerpt: 'Our senior students took first place in the National Science Olympiad with their innovative renewable energy project.',
            category: 'Achievement',
            author: 'Admin',
            publishDate: new Date().toISOString(),
            readTime: '3 min read',
            tags: ['Science', 'Competition', 'STEM', 'Achievement']
        },
        {
            id: 2,
            title: 'New STEM Lab Opening Next Month',
            content: 'State-of-the-art STEM facility with robotics lab, 3D printers, and advanced scientific equipment.',
            excerpt: 'State-of-the-art STEM facility with robotics lab, 3D printers, and advanced scientific equipment.',
            category: 'Infrastructure',
            author: 'Principal',
            publishDate: new Date().toISOString(),
            readTime: '4 min read',
            tags: ['STEM', 'Technology', 'Infrastructure', 'Education']
        }
    ],
    events: [
        {
            id: 1,
            title: 'Mid-Term Exams',
            date: '2024-02-19',
            category: 'Academic',
            description: 'Mid-term examinations for all classes.',
            location: 'Classrooms',
            time: 'Regular School Hours',
            grades: 'All Grades'
        },
        {
            id: 2,
            title: 'Sports Day',
            date: '2024-03-22',
            category: 'Sports',
            description: 'Annual sports day with various competitions.',
            location: 'Sports Field',
            time: '8:00 AM - 4:00 PM',
            grades: 'All Grades'
        }
    ],
    staff: {
        'Administration': [
            { id: 1, name: 'Dr. Sarah Johnson', position: 'Principal', email: 's.johnson@outering.edu', bio: 'Experienced educator with 20+ years in administration.' },
            { id: 2, name: 'Mr. Robert Chen', position: 'Vice Principal', email: 'r.chen@outering.edu', bio: 'Former head teacher with expertise in curriculum development.' }
        ],
        'Teaching': [
            { id: 3, name: 'Ms. Maria Garcia', position: 'Head of Pre-Primary', email: 'm.garcia@outering.edu', bio: 'Specialist in early childhood education.' },
            { id: 4, name: 'Mr. James Wilson', position: 'Head of Primary', email: 'j.wilson@outering.edu', bio: 'Mathematics and science educator.' }
        ]
    },
    contacts: [],
    academics: [
        {
            title: 'Pre-Primary (PP1 & PP2)',
            description: 'Play-based learning focusing on social, emotional, and cognitive development',
            features: ['Language Development', 'Basic Numeracy', 'Art & Craft', 'Physical Activities', 'Social Skills']
        },
        {
            title: 'Primary School (Grades 1-5)',
            description: 'Foundational education with emphasis on core subjects and character building',
            features: ['English & Kiswahili', 'Mathematics', 'Science', 'Social Studies', 'Creative Arts']
        }
    ]
};

// Authentication
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'outering2024') {
        res.json({
            success: true,
            user: { id: 1, name: 'Administrator', username, role: 'admin' },
            token: 'demo-token-123'
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// News endpoints
app.get('/api/news', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : data.news.length;
    res.json({ success: true, data: data.news.slice(0, limit) });
});

app.post('/api/news', (req, res) => {
    const newArticle = {
        id: Date.now(),
        ...req.body,
        publishDate: new Date().toISOString()
    };
    data.news.unshift(newArticle);
    res.json({ success: true, data: newArticle });
});

app.delete('/api/news/:id', (req, res) => {
    const id = parseInt(req.params.id);
    data.news = data.news.filter(article => article.id !== id);
    res.json({ success: true });
});

// Events endpoints
app.get('/api/events', (req, res) => {
    res.json({ success: true, data: data.events });
});

app.post('/api/events', (req, res) => {
    const newEvent = {
        id: Date.now(),
        ...req.body
    };
    data.events.push(newEvent);
    res.json({ success: true, data: newEvent });
});

app.delete('/api/events/:id', (req, res) => {
    const id = parseInt(req.params.id);
    data.events = data.events.filter(event => event.id !== id);
    res.json({ success: true });
});

// Staff endpoints
app.get('/api/staff', (req, res) => {
    res.json({ success: true, data: data.staff });
});

app.post('/api/staff', (req, res) => {
    const { department, ...staffData } = req.body;
    const newStaff = {
        id: Date.now(),
        ...staffData
    };
    
    if (!data.staff[department]) {
        data.staff[department] = [];
    }
    data.staff[department].push(newStaff);
    res.json({ success: true, data: newStaff });
});

app.delete('/api/staff/:id', (req, res) => {
    const id = parseInt(req.params.id);
    Object.keys(data.staff).forEach(dept => {
        data.staff[dept] = data.staff[dept].filter(member => member.id !== id);
    });
    res.json({ success: true });
});

// Contact endpoints
app.post('/api/contact', (req, res) => {
    const newContact = {
        id: Date.now(),
        ...req.body,
        date: new Date().toISOString(),
        status: 'New'
    };
    data.contacts.push(newContact);
    res.json({ success: true, data: newContact });
});

app.get('/api/contacts', (req, res) => {
    res.json({ success: true, data: data.contacts });
});

// Academics endpoints
app.get('/api/academics', (req, res) => {
    res.json({ success: true, data: data.academics });
});

// About endpoint
app.get('/api/about', (req, res) => {
    res.json({
        success: true,
        data: {
            vision: 'To be a premier educational institution that nurtures global citizens',
            mission: 'Excellence in education and character development',
            established: 1995
        }
    });
});

// Policies endpoint
app.get('/api/policies', (req, res) => {
    res.json({
        success: true,
        data: {
            'Student Conduct': [
                { title: 'Attendance Policy', description: 'Guidelines for student attendance' },
                { title: 'Dress Code', description: 'School uniform requirements' }
            ],
            'Academic': [
                { title: 'Grading System', description: 'How students are assessed' },
                { title: 'Examination Rules', description: 'Exam conduct guidelines' }
            ]
        }
    });
});

// Handbooks endpoint
app.get('/api/handbooks', (req, res) => {
    res.json({
        success: true,
        data: {
            'PP1': { title: 'Pre-Primary 1 Handbook', size: '4.2 MB' },
            'PP2': { title: 'Pre-Primary 2 Handbook', size: '4.5 MB' }
        }
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Outering Schools Backend API', 
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth/login',
            news: '/api/news',
            events: '/api/events',
            staff: '/api/staff',
            contact: '/api/contact',
            academics: '/api/academics',
            about: '/api/about',
            policies: '/api/policies',
            handbooks: '/api/handbooks',
            health: '/api/health'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Backend server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
});