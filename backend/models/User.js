const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    coverPhoto: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: [String],
    experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'] },
    interests: [String],
    role: { type: String, enum: ['Developer', 'Designer', 'Marketer', 'Business Manager', 'Innovator', 'Other'] },
    linkedin: { type: String },
    projects: [{
        name: { type: String },
        link: { type: String },
        description: { type: String }
    }],
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
