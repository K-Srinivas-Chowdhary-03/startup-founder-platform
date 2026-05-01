const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');

// @desc    Send a connection request
// @route   POST /api/connect/request
router.post('/request', async (req, res) => {
    const { senderId, receiverId, ideaId } = req.body;
    try {
        const connection = await Connection.create({ senderId, receiverId, ideaId });
        res.status(201).json(connection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update connection status (Accept/Reject)
// @route   PUT /api/connect/:id
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const connection = await Connection.findById(req.params.id);
        if (!connection) return res.status(404).json({ message: 'Not found' });

        connection.status = status;
        await connection.save();
        res.json(connection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get pending requests for a user
// @route   GET /api/connect/pending/:userId
router.get('/pending/:userId', async (req, res) => {
    try {
        const requests = await Connection.find({ receiverId: req.params.userId, status: 'Pending' })
            .populate('senderId', 'name skills role profilePicture')
            .populate('ideaId', 'title');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
