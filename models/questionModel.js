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
          correct_answer: String,
          user_answer: String,
          strict: Boolean,
          keywords: Object
        }
      ],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
