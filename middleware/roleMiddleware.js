const jwt = require('jsonwebtoken');
const {secret} = require("../config");

module.exports = function(req, res, next, roles) {
    if(req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(403).json({message: "User is not authorized"});
        }
        const {roles: userRoles} = jwt.verify(token, secret)
        let hasRole = false
        userRoles.forEach((role) => {
            if(roles.includes(role)) {
                hasRole = true
            }
        })
        if (!hasRole) {
            return res.status(403).json({message: "User has no permissions"});
        }
        next()
    } catch (e) {
        console.error(e)
        return res.status(403).json({message: "User has no permissions"});
    }
}