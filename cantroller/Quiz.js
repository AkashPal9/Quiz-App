const Quiz = require("../models/QuizModel.js");

// Controller function for creating a quiz
const createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const creator = req.user._id;
    const formattedQuestions = questions.map((question) => {
      const { text, options, correctAnswers } = question;
      return { text, options, correctAnswers };
    });

    const newQuiz = new Quiz({ title, questions: formattedQuestions, creator });
    const savedQuiz = await newQuiz.save();

    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the quiz." });
  }
};

const getSharedQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById({ _id: id });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the shared quiz." });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const participant = req.user._id;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    // Calculate the participant's score
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      const question = quiz.questions[i];
      const correctAnswers = new Set(question.correctAnswers);
      const participantAnswer = new Set(answers[i]);

      if (
        correctAnswers.size === participantAnswer.size &&
        [...correctAnswers].every((answer) => participantAnswer.has(answer))
      ) {
        score += 1;
      }
    }

    // Update the participant's score
    const participantIndex = quiz.participants.findIndex((participantData) =>
      participantData.user.equals(participant)
    );
    if (participantIndex === -1) {
      // Participant not found, add them to the participants array
      quiz.participants.push({ user: participant, score });
    } else {
      // Participant found, update their score
      quiz.participants[participantIndex].score = score;
    }

    await quiz.save();

    res.json({ score, participant });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the quiz." });
  }
};

const getParticipants = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate(
      "participants.user",
      "username"
    );
    // console.log(quiz,"quiz")
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    const participants = quiz.participants.map((participantData) => ({
      user: participantData.user._id,
      score: participantData.score,
    }));

    res.json(participants);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the participants." });
  }
};

module.exports = {
  createQuiz,
  getSharedQuiz,
  submitQuiz,
  getParticipants,
};
