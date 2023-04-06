/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: User login endpoint
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 * /auth/register:
 *   post:
 *     summary: Register user
 *     description: User Registration endpoint
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */

const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../utilities/functions");
const User = require("../models/userModel");

router.get("/", (req, res) => res.send("Hi auth"));

router.post("/login", async (req, res) => {
  const users = await User.find();
  const data = {
    email: req.body.email,
    password: req.body.password
  };

  const userEmail = users.findIndex((user) => user.email === data.email);
  if (userEmail < 0)
    return res.status(403).json({ message: "Incorrect email" });
  const user = users[userEmail];
  if (await comparePassword(req.body.password, user.password)) {
    return res.status(200).json({ user, message: "login successful" });
  } else {
    return res.status(403).json({ message: "Incorrect password" });
  }
});

router.post("/register", async (req, res) => {
  const data = {};
  data.password = await hashPassword(req.body.password);
  data.name = req.body.name;
  data.email = req.body.email;
  data.phone = req.body.phone;

  const users = await User.find();
  const usedEmail = users.findIndex((user) => user.email === data.email);
  if (usedEmail >= 0) {
    return res
      .status(409)
      .json({ message: "Email already exist. Choose another one" });
  }
  try {
    const user = new User(data);
    const newUser = await user.save();
    delete newUser.password;
    console.log(newUser);
    res
      .status(201)
      .json({ user: newUser, message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
