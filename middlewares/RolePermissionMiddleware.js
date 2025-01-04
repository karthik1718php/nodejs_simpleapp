var jwt = require('jsonwebtoken');
const User = require('../models/User')
const roleBasedMiddleware = (role) => {
    return async(req,res,next)=>{
        try{
            console.log(role,'role');
            let token
            if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
                token = req.headers.authorization.split(" ")[1];
            }

            if(!token) {
                return res.status(401).json({ message: 'Token required' });
            }
            let userId;
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid token' });
                }
                userId = decoded.id; // Extract user ID from token
            });

            const user = await User.findById(userId);
            req.userData = user
            next()
        }
        catch (error) {
            console.error('Error in middleware:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = roleBasedMiddleware;
