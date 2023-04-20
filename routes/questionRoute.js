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

  const updateUser = async ({ user, questions, response }) => {
    const all_courses = user.courses;

    console.log(questions._id.toString());

    const found = all_courses.find(
      (course) => course._id.toString() == questions._id.toString()
    );

    if (found) {
      return;
    }

    const new_course = {
      _id: questions._id,
      title: questions.title,
      lecturer: questions.lecturer,
      date: questions.updatedAt,
      score: response.data.data,
    };

    let courses = [...user.courses, new_course];

    await User.findByIdAndUpdate(
      userId,
      { courses },
      {
        new: true,
      }
    );
  };

  try {
    const questions = await Question.findById(data.id);
    const user = await User.findById(userId);

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

    axios
      .post("http://34.172.127.247:8080/get-score-bulk", payload)
      .then((response) => {
        updateUser({ user, questions, response });
        res.status(200).json({ result: response.data.data });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
});

module.exports = router;
