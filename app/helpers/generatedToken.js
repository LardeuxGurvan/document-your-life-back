const jwt = require('jsonwebtoken');

const generateLimitedAccessToken = (user) => {
    const userGeneratedToken = jwt.sign(
        {
            userEmail: user.email,
        },
        process.env.REFRESH_TOKKEN_SECRET,
    );
    return userGeneratedToken;
};

const generateAccessToken = (user) => {
    const userGeneratedToken = jwt.sign(
        {
            userId: user.id,
            userEmail: user.email,
            userFirstName: user.first_name,
            userLastName: user.last_name,
        },
        process.env.ACCESS_TOKEN_SECRET,
    );
    return userGeneratedToken;
};

module.exports = {
    generateLimitedAccessToken,
    generateAccessToken,
};
