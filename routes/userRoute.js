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
    matric: req.body.matric,
    password: req.body.password,
  };

  const userMat = users.findIndex(
    (user) => user.matric.toLowerCase() === data.matric.toLowerCase()
  );
  if (userMat < 0)
    return res.status(403).json({ message: "No such matriculation number" });
  const user = users[userMat];
  if (await comparePassword(req.body.password, user.password)) {
    return res.status(200).json({ user, message: "login successful" });
  } else {
    return res.status(403).json({ message: "Incorrect password" });
  }
});

router.post("/register", async (req, res) => {
  const rand = Math.floor(Math.random() * 90000 + 10000);
  const data = {};

  const users = await User.find();
  data.password = await hashPassword(req.body.password);
  data.name = req.body.name;
  data.email = req.body.email;
  data.phone = req.body.phone;
  data.matric = `2023/1/${rand}CT`;

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

router.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    console.log(id);
    console.log(user);
    res.status(200).json({ user, message: "user retrieved successfully" });
  } catch (error) {
    res.status(400).json({ error, message: "Error retrieving student data" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error, message: "Error fetching users" });
  }
});

module.exports = router;
