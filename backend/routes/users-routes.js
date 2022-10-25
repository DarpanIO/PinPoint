const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");
const router = express.Router();


router.get("/", usersControllers.getUsers);
router.post("/signup",  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ], usersControllers.addUser);
router.post("/login",[
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ], usersControllers.loginUser);

module.exports = router;