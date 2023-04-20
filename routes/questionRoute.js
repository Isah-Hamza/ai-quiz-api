const express = require("express");
const axios = require("axios");

const router = express.Router();
const Question = require("../models/questionModel");
const User = require("../models/userModel");

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
  data.lecturer = req.body.lecturer;
  data.session = req.body.session;
  data.instruction = req.body.instruction;
  data.duration = req.body.duration;

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

router.post("/:id", async (req, res) => {
  let data = {};
  data.id = req.params.id;
  data.answer = req.body.answer;
  const userId = req.body.id;

  try {
    const questions = await Question.findById(data.id);

    questions.qa.map((item1) => {
      delete item1.strict;
      question_count = questions.qa.length;
      data.answer.map((item2) => {
        if (item1._id == item2._id) {
          item1.user_answer = item2.user_answer;
          // item1.strict == item1.strict ?? false;
        }
      });
    });

    const payload = {
      answers: questions.qa,
      strict: true,
    };

    console.log(payload);

    axios
      .post("http://34.172.127.247:8080/get-score-bulk", payload)
      .then((response) => {
        // const user = User.findById(userId);

        // user.courses = [
        //   ...user.courses,
        //   { ...questions, score: response.data.data },
        // ];

        // const updatedUser = User.findByIdAndUpdate(userId, user, { new: true });
        // console.log(updatedUser)

        res.status(200).json({ result: response.data.data });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ error: { message: err.message } });
  }
});

module.exports = router;
