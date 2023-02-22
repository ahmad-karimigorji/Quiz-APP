const apiKey = "yAttkaFz2t6M7aAMcw37LJdaXUGViToysokNGMpn";

// 1. fetch
// 2. display question
// 3. correct answer
// 4. incorrect answer
// 5. score
// 6. numer of question
// 7. timeout
// 8. choiceClicked

const quizBody = document.querySelector(".quiz-body");
const scoreValue = document.querySelector(".score-value");
const progressBar = document.querySelector(".progress-bar");
const numberOfQuestionTitle = document.querySelector(".numberOfQuestion > h5");
const timeProgress = document.querySelector(".time-progress");
const loading = document.querySelector(".loading");
const quizContainer = document.querySelector(".quiz-container");
const playBtn = document.querySelector(".play-btn");
const home = document.querySelector(".home");
const category = document.querySelector("#category");
const difficultyLevel = document.querySelector("#difficulty-level");
const limitInput = document.querySelector("#limit-input");
const playAgainBtn = document.querySelector(".play-again-btn");
const goHomeBtn = document.querySelector(".go-home-btn");
const afterQuiz = document.querySelector(".after-quiz");
const afterQuizTitleScore = document.querySelector(".after-quiz h1");

// let questionsData = [];
let questionsData = [
  {
    id: 823,
    question: "BASH stands for:",
    description: null,
    answers: {
      answer_a: "Bourne Again SHell",
      answer_b: "BAsic SHell",
      answer_c: "Basic Async SHell",
      answer_d: null,
      answer_e: null,
      answer_f: null,
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    correct_answer: null,
    explanation: null,
    tip: null,
    tags: [
      {
        name: "BASH",
      },
    ],
    category: "Linux",
    difficulty: "Easy",
  },
  {
    id: 702,
    question:
      "Which command can be used to display basic information about your server?",
    description: null,
    answers: {
      answer_a: "uname",
      answer_b: "info",
      answer_c: "ls",
      answer_d: "show",
      answer_e: null,
      answer_f: null,
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    correct_answer: null,
    explanation: null,
    tip: null,
    tags: [
      {
        name: "Linux",
      },
    ],
    category: "Linux",
    difficulty: "Easy",
  },
  {
    id: 748,
    question: "The API server is also known as:",
    description: null,
    answers: {
      answer_a: "kubeapi",
      answer_b: "kube-server",
      answer_c: "k8s-apiserver",
      answer_d: "kube-apiserver",
      answer_e: null,
      answer_f: null,
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "true",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    correct_answer: "answer_a",
    explanation: null,
    tip: null,
    tags: [
      {
        name: "Kubernetes",
      },
    ],
    category: "Linux",
    difficulty: "Easy",
  },
  {
    id: 690,
    question:
      "How can we list out all currently executing background processes?",
    description: null,
    answers: {
      answer_a: "ps -e",
      answer_b: "top",
      answer_c: "ps faux",
      answer_d: "proccess -aux",
      answer_e: null,
      answer_f: null,
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    correct_answer: null,
    explanation: null,
    tip: null,
    tags: [
      {
        name: "BASH",
      },
      {
        name: "Linux",
      },
    ],
    category: "Linux",
    difficulty: "Easy",
  },
  {
    id: 1077,
    question:
      "You are logged in as a normal user and you see a file with 444(-r--r--r--) permission. Can you delete it with the `rm` command?",
    description: null,
    answers: {
      answer_a:
        "We can't be certain, it depends on the permissions of the parent folder",
      answer_b: "Yes, can delete it without a problem",
      answer_c: "No, we don't have the proper permissions",
      answer_d: "We can delete it only from the GUI but not from CLI.",
      answer_e: null,
      answer_f: null,
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    correct_answer: null,
    explanation: null,
    tip: null,
    tags: [
      {
        name: "Linux",
      },
    ],
    category: "Linux",
    difficulty: "Easy",
  },
];
let score = 0;
let count = 0;
let time = 0;
let timeInterval = null;
let choices = null;
let questionDetails = { category: "Linux", difficulty: "Easy", limit: 5 };

category.addEventListener("change", (e) => changeQuestionDetails(e));
difficultyLevel.addEventListener("change", (e) => changeQuestionDetails(e));
limitInput.addEventListener("change", (e) => changeQuestionDetails(e));

function changeQuestionDetails(e) {
  const { name, value } = e.target;
  questionDetails = { ...questionDetails, [name]: value };
}

playBtn.addEventListener("click", () => {
  home.classList.add("inactive");
  getQuestions(questionDetails);
});
playAgainBtn.addEventListener("click", () => {
  afterQuiz.classList.remove("active");
  getQuestions(questionDetails);
});
goHomeBtn.addEventListener("click", () => {
  home.classList.remove("inactive");
  afterQuiz.classList.remove("active");
});

async function getQuestions({ category, difficulty, limit }) {
  displayLoading();
  const url = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&category=${category}&difficulty=${difficulty}&limit=${limit}`;
  // const url = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&category=sql&difficulty=easy&limit=15`;
  try {
    const { data } = await axios.get(url);
    hideLoading();
    quizContainer.classList.add("active");
    questionsData = data;
    progressBar.max = questionsData.length;
    renderQuestion();
  } catch (error) {
    console.log(error);
  }
}
function questionHtmlDOM() {
  const currentQuestion = questionsData[count];

  quizBody.innerHTML = `<div class="quiz-question">${
    currentQuestion.multiple_correct_answers === "true"
      ? `${currentQuestion.question} (multiple correct answers)`
      : currentQuestion.question
  }</div>
  <div class="quiz-choices">
    <div class="choice ${
      !currentQuestion.answers.answer_a ? "unChoice" : ""
    }" data-correctAnswer="answer_a_correct">
      <p class="choice-number">A</p>
      <p class="choice-text">${
        currentQuestion.answers.answer_a ? currentQuestion.answers.answer_a : ""
      }</p>
    </div>
    <div class="choice ${
      !currentQuestion.answers.answer_b ? "unChoice" : ""
    }" data-correctAnswer="answer_b_correct">
      <p class="choice-number">B</p>
      <p class="choice-text">${
        currentQuestion.answers.answer_b ? currentQuestion.answers.answer_b : ""
      }</p>
    </div>
    <div class="choice ${
      !currentQuestion.answers.answer_c ? "unChoice" : ""
    }" data-correctAnswer="answer_c_correct">
      <p class="choice-number">C</p>
      <p class="choice-text">${
        currentQuestion.answers.answer_c ? currentQuestion.answers.answer_c : ""
      }</p>
    </div>
    <div class="choice ${
      !currentQuestion.answers.answer_d ? "unChoice" : ""
    }" data-correctAnswer="answer_d_correct">
      <p class="choice-number">D</p>
      <p class="choice-text">${
        currentQuestion.answers.answer_d ? currentQuestion.answers.answer_d : ""
      }</p>
      </div>
      </div>`;
}

function renderQuestion() {
  if (count === questionsData.length) {
    endOfQuestions();
    return;
  }
  questionHtmlDOM();

  timeInterval = setInterval(timeOut, 1000);
  timeProgress.classList.add("animation");
  numberOfQuestionsFunction();
  choices = document.querySelectorAll(".choice");
  choices.forEach((item) =>
    item.addEventListener("click", () => choiceClicked(item))
  );
}

function choiceClicked(choice) {
  choices.forEach((item) => item.classList.add("inactive"));
  checkChoices(choice);
  clearInterval(timeInterval);
  time = 0;
  count++;
  setTimeout(() => {
    renderQuestion();
  }, 2000);
}

function checkChoices(choice) {
  const dataCorrectAnswer = choice.dataset.correctanswer;
  const currentQuestion = questionsData[count];
  timeProgress.classList.remove("animation");
  if (currentQuestion.correct_answers[dataCorrectAnswer] === "true") {
    correctChoice(choice);
  } else {
    inCorrectChoice(choice);
  }
}

function correctChoice(choice) {
  choice.classList.add("correct-answer");
  score++;
  scoreValue.innerText = score;
}

function inCorrectChoice(choice) {
  choice.classList.add("incorrect-answer");
  choices.forEach((item) => {
    const dataCorrectAnswer = item.dataset.correctanswer;
    if (questionsData[count].correct_answers[dataCorrectAnswer] === "true") {
      item.classList.add("correct-answer");
    }
  });
}

function timeOut() {
  if (time < 4) {
    time++;
  } else {
    checkChoicesAfterTimeOut();
  }
}

function checkChoicesAfterTimeOut() {
  clearInterval(timeInterval);
  time = 0;
  timeProgress.classList.remove("animation");
  choices.forEach((item) => {
    item.classList.add("inactive");
    const dataCorrectAnswer = item.dataset.correctanswer;
    if (questionsData[count].correct_answers[dataCorrectAnswer] === "true") {
      item.classList.add("correct-answer");

      setTimeout(() => {
        count++;
        renderQuestion();
      }, 2000);
      return;
    }
  });
}

function numberOfQuestionsFunction() {
  progressBar.value = count + 1;
  numberOfQuestionTitle.innerText = `Question: ${count + 1}/${
    questionsData.length
  }`;
}

function displayLoading() {
  loading.classList.add("active");
}
function hideLoading() {
  loading.classList.remove("active");
}

function endOfQuestions() {
  quizContainer.classList.remove("active");
  afterQuiz.classList.add("active");
  afterQuizTitleScore.innerText = score;
  scoreValue.innerText = 0;
  count = 0;
  score = 0;
}
