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

router.post("/answers", async (req, res) => {
  let data = {};
  data.title = req.body.title;
  data.student_answer = req.body.student_answer;
  // const { _id } = data.qa;

  try {
    const questions = await Question.findOne({ title: data.title });
    questions.qa.map((item1) => {
      data.student_answer.map((item2) => {
        if (item1._id == item2._id) {
          item1.student_answer = item2.student_answer;
          console.log("hi");
        } else {
          // item1.student_answer = item2.student_answer;
        }
      });
    });
    console.log(questions.qa);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
