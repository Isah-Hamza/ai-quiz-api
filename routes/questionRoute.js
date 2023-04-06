const express = require("express");

const router = express.Router();
const Question = require("../models/questionModel");

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ data: questions, success: true });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.get("/:title", async (req, res) => {
  const qName = req.params.title;
  try {
    const questions = await Question.find({ title: qName });
    res.json({ data: questions, success: true });
  } catch (err) {
    res.status(409).json({ err });
  }
});

router.post("/", async (req, res) => {
  let data = {};
  data.title = req.body.title;
  data.qa = req.body.qa;

  try {
    const question = new Question(data);
    const newQuestion = await question.save();
    res
      .status(201)
      .json({ data: newQuestion, message: "Questions saved successfully" });
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

module.exports = router;
