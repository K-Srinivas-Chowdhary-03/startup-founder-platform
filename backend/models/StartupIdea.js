const mongoose = require('mongoose');

const startupIdeaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    industry: { type: String },
    founderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requiredSkills: [String],
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StartupIdea', startupIdeaSchema);
