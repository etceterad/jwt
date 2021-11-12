const User = require("./models/userModel");
const Role = require("./models/userRole");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {secret} = require("./config");

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if(errors){
                return res.status(400).json({message: errors});
            }

            const {username, password} = req.body;
            const candidate = await User.findOne({username});

            if(candidate) {
                return res.status(400).json({message: "User already exists"})
            }

            const hashPass = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPass, roles: [userRole.value]})
            await user.save()

            return res.json({message: "User was created successfully"})
        }    catch (e) {
            console.error(e)
            res.status(400).json({message: "Registration error"})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const candidate = await User.findOne({username});

            if(!candidate) {
                return res.status(400).json({message: "User not found"});
            }

            const validPass = bcrypt.compareSync(password, candidate.password);
            if(!validPass) {
                return res.status(400).json({message: "Incorrect password"});
            }

            const token = generateAccessToken(candidate._id, candidate.roles);
            return res.json({message: `Login successfully, token : ${token}`})
        } catch (e) {
            console.error(e)
            res.status(400).json({message: "Login error"})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            return res.status(200).json(users)
        } catch (e) {
            console.error(e)
            res.status(400).json({message: "Request error"})
        }
    }
}

module.exports = new AuthController()