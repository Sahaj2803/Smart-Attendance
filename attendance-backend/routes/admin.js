const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Admin middleware - check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (students)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all faculty
router.get('/faculty', auth, adminAuth, async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).select('-password');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new user
router.post('/users', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, password, rollNo, department } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create password if not provided
    const tempPassword = password && password.trim().length > 0 ? password : Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      rollNo,
      department
    });

    await user.save();
    res.json({ message: 'User created successfully', tempPassword: password ? undefined : tempPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new faculty
router.post('/faculty', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, password, department, subject } = req.body;

    // Check if faculty already exists
    let faculty = await User.findOne({ email });
    if (faculty) {
      return res.status(400).json({ message: 'Faculty already exists' });
    }

    // Create password if not provided
    const tempPassword = password && password.trim().length > 0 ? password : Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create new faculty
    faculty = new User({
      name,
      email,
      password: hashedPassword,
      role: 'faculty',
      department,
      subject
    });

    await faculty.save();
    res.json({ message: 'Faculty created successfully', tempPassword: password ? undefined : tempPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, rollNo, department } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, rollNo, department },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update faculty
router.put('/faculty/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, department, subject } = req.body;
    
    const faculty = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, department, subject },
      { new: true }
    ).select('-password');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete faculty
router.delete('/faculty/:id', auth, adminAuth, async (req, res) => {
  try {
    const faculty = await User.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalAttendance = await Attendance.countDocuments();
    
    res.json({
      totalStudents,
      totalFaculty,
      totalAttendance,
      systemStatus: 'Online'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance reports
router.get('/reports/attendance', auth, adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    let query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (department) {
      query.department = department;
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNo department')
      .populate('faculty', 'name department');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk import users
router.post('/users/bulk', auth, adminAuth, async (req, res) => {
  try {
    const { users } = req.body;
    
    for (let userData of users) {
      const { name, email, rollNo, department } = userData;
      
      // Check if user exists
      let existingUser = await User.findOne({ email });
      if (!existingUser) {
        const user = new User({
          name,
          email,
          password: 'defaultPassword123', // Default password
          role: 'student',
          rollNo,
          department
        });
        await user.save();
      }
    }
    
    res.json({ message: 'Bulk import completed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Export users data
router.get('/users/export', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');
    
    // Convert to CSV format
    const csvData = users.map(user => 
      `${user.name},${user.email},${user.rollNo || ''},${user.department || ''}`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
