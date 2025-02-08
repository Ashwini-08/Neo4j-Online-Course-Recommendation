const {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic
} = require('../models/topicModel');

exports.createTopic = async (req, res) => {
    try {
        const topic = await createTopic(req.body);
        res.status(201).json({ status: 'success', data: topic });
    } catch (err) {
        console.error('Error creating topic:', err);
        res.status(500).json({ status: 'error', message: 'Error creating topic' });
    }
};

exports.getAllTopics = async (req, res) => {
    try {
        const topics = await getAllTopics();
        res.status(200).json({ status: 'success', data: topics });
    } catch (err) {
        console.error('Error fetching topics:', err);
        res.status(500).json({ status: 'error', message: 'Error fetching topics' });
    }
};

exports.getTopicById = async (req, res) => {
    try {
        const topic = await getTopicById(req.params.id);
        if (!topic) {
            return res.status(404).json({ status: 'error', message: 'Topic not found' });
        }
        res.status(200).json({ status: 'success', data: topic });
    } catch (err) {
        console.error('Error fetching topic:', err);
        res.status(500).json({ status: 'error', message: 'Error fetching topic' });
    }
};

exports.updateTopic = async (req, res) => {
    try {
        const topic = await updateTopic(req.params.id, req.body);
        if (!topic) {
            return res.status(404).json({ status: 'error', message: 'Topic not found' });
        }
        res.status(200).json({ status: 'success', data: topic });
    } catch (err) {
        console.error('Error updating topic:', err);
        res.status(500).json({ status: 'error', message: 'Error updating topic' });
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        const success = await deleteTopic(req.params.id);
        if (!success) {
            return res.status(404).json({ status: 'error', message: 'Topic not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        console.error('Error deleting topic:', err);
        res.status(500).json({ status: 'error', message: 'Error deleting topic' });
    }
};
