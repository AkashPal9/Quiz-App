// models/quizModel.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswers: [{ type: String, required: true }],
  }],
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, default: 0 },
  }],
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
