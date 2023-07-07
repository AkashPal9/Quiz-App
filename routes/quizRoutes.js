// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const { userAuth, admin } = require("../Middelware/auth");
const {
  createQuiz,
  getSharedQuiz,
  submitQuiz,
  getParticipants,
} = require("../cantroller/Quiz.js");

// Route for creating a quiz
router.post("/create", admin, createQuiz);
router.get("/shared/:id", admin, getSharedQuiz);
router.post("/submit/:quizId", userAuth, submitQuiz);
router.get("/participants/:quizId", admin, getParticipants);

module.exports = router;
