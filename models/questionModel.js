const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    lecturer: {
      type: String,
      
    },
    duration: {
      type: String,
      required: false,
    },
    instruction: {
      type: String,
      required: false,
    },
    session: {
      type: String,
      required: false,
    },
    qa: {
      type: [
        {
          question: String,
          correct_answer: String,
          user_answer: String,
          strict: Boolean,
          keywords: Object,
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
