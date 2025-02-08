const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    createEnrollmentRelationship,
    getCoursesForStudent,
    getCoursesWithCompletedInRelation,
    getRecommendation
} = require('../models/courseModel');

exports.createCourse = async (req, res) => {
    try {
        const course = await createCourse(req.body);
        res.status(201).json({ status: 'success', data: course });
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ status: 'error', message: 'Error creating course' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await getAllCourses();
        res.status(200).json({ status: 'success', data: courses });
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ status: 'error', message: 'Error fetching courses' });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({ status: 'error', message: 'Course not found' });
        }
        res.status(200).json({ status: 'success', data: course });
    } catch (err) {
        console.error('Error fetching course:', err);
        res.status(500).json({ status: 'error', message: 'Error fetching course' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await updateCourse(req.params.id, req.body);
        if (!course) {
            return res.status(404).json({ status: 'error', message: 'Course not found' });
        }
        res.status(200).json({ status: 'success', data: course });
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ status: 'error', message: 'Error updating course' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const success = await deleteCourse(req.params.id);
        if (!success) {
            return res.status(404).json({ status: 'error', message: 'Course not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ status: 'error', message: 'Error deleting course' });
    }
};


exports.enrollInCourses = async (req, res) => {
    try {
        const { enrolledCourses } = req.body; // Array of course IDs to enroll
        const studentEmail = req.user.email; // Email from authMiddleware

        if (!enrolledCourses || !Array.isArray(enrolledCourses)) {
            return res.status(400).json({
                status: 'error',
                message: 'enrolledCourses must be an array of course IDs',
            });
        }

        // Create relationships in Neo4j
        const relationships = await createEnrollmentRelationship(studentEmail, enrolledCourses);

        res.status(201).json({
            status: 'success',
            message: 'Successfully enrolled in courses',
            data: relationships,
        });
    } catch (err) {
        console.error('Error enrolling in courses:', err);
        res.status(500).json({
            status: 'error',
            message: 'Error enrolling in courses',
        });
    }
};

exports.getCoursesForStudent = async (req, res) => {
    try {
        const email = req.user.email; // Get email from the authenticated user
        const courses = await getCoursesForStudent(email);
        
        if (courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this student.' });
        }
        
        return res.status(200).json(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
        return res.status(500).json({ message: 'An error occurred while fetching courses.' });
    }
};

exports.getCompletedCoursesForStudent = async (req, res) => {
    try {
        const email = req.user.email; // Get email from the authenticated user
        const courses = await getCoursesWithCompletedInRelation(email);
        
        if (courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this student.' });
        }
        
        return res.status(200).json(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
        return res.status(500).json({ message: 'An error occurred while fetching courses.' });
    }
};

exports.getRecommendedCourses = async (req, res) => {
    try {
        const email = req.user.email; // Get email from the authenticated user
        const courses = await getRecommendation(email);
        
        if (courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this student.' });
        }
        
        return res.status(200).json(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
        return res.status(500).json({ message: 'An error occurred while fetching courses.' });
    }
};