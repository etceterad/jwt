const Router = require('express');
const controller = require('./authController');
const {check} = require('express-validator');
// const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/authMiddleware");

const router = new Router();

router.post("/registration",
    check('username', 'Field cant be empty').notEmpty(),
    check('password', 'Pass must be longer than 4 symbols').isLength({min: 4, max: 16}),
    async (req, res) => {
        await controller.registration(req, res);
    });
router.post("/login", controller.login);
router.get("/users", (req, res, next) => {
    roleMiddleware(req, res, next, ["USER", "ADMIN"])
}, controller.getUsers);

module.exports = router;