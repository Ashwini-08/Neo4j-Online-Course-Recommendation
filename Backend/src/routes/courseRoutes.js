const express = require('express');
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollInCourses,
    getCoursesForStudent,
    getCompletedCoursesForStudent,
    getRecommendedCourses
} = require('../controllers/courseController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createCourse);       // Create a new course
// router.get('/', getAllCourses);      // Get all courses
// router.get('/:id', getCourseById);   // Get a course by ID
// router.put('/:id', updateCourse);    // Update a course by ID
// router.delete('/:id', deleteCourse); // Delete a course by ID
router.post('/enroll', protect, enrollInCourses);
router.get('/enrolledCourses', protect, getCoursesForStudent);
router.get('/completedCourses', protect, getCompletedCoursesForStudent);
router.get('/recommendCourses', protect, getRecommendedCourses);

module.exports = router;
