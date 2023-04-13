const express = require("express");
const axios = require("axios");

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
    const questions = await Question.findOne({ title: qName });
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

router.post("/:title", async (req, res) => {
  let data = {};
  data.title = req.params.title;
  data.answer = req.body.answer;
  // const { _id } = data.qa;

  let total_score = 0;
  let question_count = 0;

  try {
    const questions = await Question.findOne({ title: data.title });
    questions.qa.map((item1) => {
      question_count = questions.qa.length;
      data.answer.map((item2) => {
        if (item1._id == item2._id) {
          item1.user_answer = item2.user_answer;
          item1.strict == item1.strict ?? false;
        }
      });
    });

    axios
      .post("http://34.172.127.247:8080/get-score", questions.qa[0])
      .then((response) => {
        res.status(200).json({ result: response.data.data });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: { message: err.message } });
  }
});

module.exports = router;
