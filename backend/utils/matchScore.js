/**
 * Calculate compatibility score between two users
 * Formula: (MatchingSkills * 0.6) + (SharedInterests * 0.4)
 */
const calculateMatchScore = (user1, user2) => {
    const skills1 = user1.skills || [];
    const skills2 = user2.skills || [];
    const interests1 = user1.interests || [];
    const interests2 = user2.interests || [];

    // Calculate skill match
    const matchingSkills = skills1.filter(skill => skills2.includes(skill));
    const skillScore = skills1.length > 0 ? (matchingSkills.length / skills1.length) * 100 : 0;

    // Calculate interest match
    const sharedInterests = interests1.filter(interest => interests2.includes(interest));
    const interestScore = interests1.length > 0 ? (sharedInterests.length / interests1.length) * 100 : 0;

    const finalScore = (skillScore * 0.6) + (interestScore * 0.4);
    return Math.round(finalScore);
};

module.exports = calculateMatchScore;
