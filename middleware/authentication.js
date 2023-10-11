const { LoginID, LoginKey, JwtSecret } = require('../env')
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json("Please authenticate using a valid token");
    }

    try {
        const data = jwt.verify(token, JwtSecret);

        if (LoginID === data.LoginID && LoginKey === data.LoginKey) {
            next();
        } else {
            return res.send(400).json('Invalid credential')
        }
    } catch (error) {
        return res.status(401).json("Please authenticate using a valid token");
    }
}

module.exports = authenticate;