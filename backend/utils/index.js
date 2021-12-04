const jwt = require('jsonwebtoken');

function generateToken(user) {
    const u = { id: user._id, email: user.email.toLowerCase() };
    return (token = jwt.sign(u, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3h', // 300, // expires in 5 minutes
    }));
}

module.exports = generateToken;
