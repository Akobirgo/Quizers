const { Schema, model } = require('mongoose');

const questionSchema = new Schema({
    id: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: [true, 'Question must not be empty!'],
      trim: true,
    },
    answers: {
      type: [ String ],
      validate: {
        validator: function(v) {
          return v.length > 3;
        },
        message: () => `Must be 4 answers at least for the question!`
      }
    },
    correct: {
      type: Number,
      default: 0,
      enum: {
        values: [0, 1, 2, 3],
        message: 'The correct answer must be between 0-3, {VALUE} is not valid!'
      },
      required: true
    }
})

const Question = model("Question", questionSchema);

module.exports = Question;