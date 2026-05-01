const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StartupIdea = require('../models/StartupIdea');
const calculateMatchScore = require('../utils/matchScore');

// @desc    Get all startup ideas
// @route   GET /api/ideas
router.get('/', async (req, res) => {
    try {
        const ideas = await StartupIdea.find().populate('founderId', 'name skills role profilePicture');
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a startup idea
// @route   POST /api/ideas
router.post('/', async (req, res) => {
    const { title, description, industry, requiredSkills, founderId } = req.body;
    try {
        const idea = await StartupIdea.create({ title, description, industry, requiredSkills, founderId });
        res.status(201).json(idea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get suggested matches for a user
// @route   GET /api/users/match/:userId
router.get('/match/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        const allUsers = await User.find({ _id: { $ne: currentUser._id } });
        
        const matches = allUsers.map(user => ({
            user,
            score: calculateMatchScore(currentUser, user)
        })).sort((a, b) => b.score - a.score);
        console.log(`Found ${matches.length} potential matches for user ${currentUser._id}`);
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a startup idea
// @route   DELETE /api/ideas/:id
router.delete('/:id', async (req, res) => {
    try {
        const idea = await StartupIdea.findById(req.params.id);
        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        
        await idea.deleteOne();
        res.json({ message: 'Idea removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
