const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages/send
router.post('/send', async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    try {
        const message = await Message.create({ senderId, receiverId, content });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:user1/:user2
router.get('/conversation/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get list of latest messages (conversations) for a user
// @route   GET /api/messages/conversations/:userId
router.get('/conversations/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        })
        .populate('senderId', 'name profilePicture role')
        .populate('receiverId', 'name profilePicture role')
        .sort({ createdAt: -1 });

        // Group by user
        const conversationsMap = new Map();
        
        messages.forEach(msg => {
            const isSender = msg.senderId._id.toString() === userId;
            const otherUser = isSender ? msg.receiverId : msg.senderId;
            const otherUserId = otherUser._id.toString();
            
            if (!conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    user: otherUser,
                    lastMessage: msg,
                    unreadCount: (!isSender && !msg.isRead) ? 1 : 0
                });
            } else {
                if (!isSender && !msg.isRead) {
                    conversationsMap.get(otherUserId).unreadCount += 1;
                }
            }
        });

        res.json(Array.from(conversationsMap.values()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get total unread message count for a user
// @route   GET /api/messages/unread/:userId
router.get('/unread/:userId', async (req, res) => {
    try {
        const unreadCount = await Message.countDocuments({
            receiverId: req.params.userId,
            isRead: false
        });
        res.json({ unreadCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Mark messages as read from a specific sender
// @route   PUT /api/messages/read/:senderId/:receiverId
router.put('/read/:senderId/:receiverId', async (req, res) => {
    const { senderId, receiverId } = req.params;
    try {
        await Message.updateMany(
            { senderId, receiverId, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
