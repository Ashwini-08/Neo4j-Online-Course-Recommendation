const express = require('express');
const {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic
} = require('../controllers/topicController');

const router = express.Router();

router.post('/', createTopic);       // Create a new topic
router.get('/', getAllTopics);      // Get all topics
router.get('/:id', getTopicById);   // Get a topic by ID
router.put('/:id', updateTopic);    // Update a topic by ID
router.delete('/:id', deleteTopic); // Delete a topic by ID

module.exports = router;
