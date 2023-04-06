const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    qa: {
      type: [
        {
          question: String,
          answer: String,
          student_answer: String,
          tags: [String]
        }
      ],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
