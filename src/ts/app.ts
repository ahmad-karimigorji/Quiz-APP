import axios from "axios";

interface QuestionDetails {
  category: string;
  difficulty: string;
  limit: string;
}
interface Data {
  id: number;
  question: string;
  description: string | null;
  answers: {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
  };
  multiple_correct_answers: string | null;
  correct_answers: {
    answer_a_correct: string;
    answer_b_correct: string;
    answer_c_correct: string;
    answer_d_correct: string;
    answer_e_correct: string;
    answer_f_correct: string;
  };
  correct_answer: string | null;
  explanation: string | null;
  tip: string | null;
  tags: [
    {
      name: string;
    }
  ];
  category: string;
  difficulty: string;
}

type QuestionData = Data[];

const apiKey = "yAttkaFz2t6M7aAMcw37LJdaXUGViToysokNGMpn";

// 1. fetch
// 2. display question
// 3. correct answer
// 4. incorrect answer
// 5. score
// 6. numer of question
// 7. timeout
// 8. choiceClicked

const quizBody = document.querySelector(".quiz-body") as HTMLDivElement;
const scoreValue = document.querySelector(".score-value") as HTMLSpanElement;
const progressBar = document.querySelector(
  ".progress-bar"
) as HTMLProgressElement;
const numberOfQuestionTitle = document.querySelector(
  ".numberOfQuestion > h5"
) as HTMLHeadingElement;
const timeProgress = document.querySelector(".time-progress") as HTMLDivElement;
const loading = document.querySelector(".loading") as HTMLDivElement;
const quizContainer = document.querySelector(".quiz-container") as HTMLDivElement;
const playBtn = document.querySelector(".play-btn") as HTMLButtonElement;
const home = document.querySelector(".home") as HTMLDivElement;
const category = document.querySelector("#category") as HTMLSelectElement;
const difficultyLevel = document.querySelector("#difficulty-level") as HTMLSelectElement;
const limitInput = document.querySelector("#limit-input") as HTMLInputElement;
const playAgainBtn = document.querySelector(".play-again-btn") as HTMLButtonElement;
const goHomeBtn = document.querySelector(".go-home-btn") as HTMLButtonElement;
const afterQuiz = document.querySelector(".after-quiz")as HTMLDivElement;
const afterQuizTitleScore = document.querySelector(
  ".after-quiz h1"
) as HTMLHeadingElement;

let questionsData: QuestionData = [];
let score: number = 0;
let count: number = 0;
let timer: number = 0;
let timeInterval: NodeJS.Timer;
let questionDetails: QuestionDetails = {
  category: "Linux",
  difficulty: "Easy",
  limit: "5",
};

category.addEventListener("change", (e) => changeQuestionDetails(e));
difficultyLevel.addEventListener("change", (e) => changeQuestionDetails(e));
limitInput.addEventListener("change", (e) => changeQuestionDetails(e));

function changeQuestionDetails(e: Event) {
  const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
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

async function getQuestions(questionDetails: QuestionDetails) {
  displayLoading();
  const url = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&category=${questionDetails.category}&difficulty=${questionDetails.difficulty}&limit=${questionDetails.limit}`;
  try {
    const { data } = await axios.get<QuestionData>(url);
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
  const {answer_a, answer_b, answer_c, answer_d} = currentQuestion.answers;

  quizBody.innerHTML = `<div class="quiz-question">${
    currentQuestion.multiple_correct_answers === "true"
      ? `${currentQuestion.question} (multiple correct answers)`
      : currentQuestion.question
  }</div>
  <div class="quiz-choices">
    <div class="choice ${
      !answer_a ? "unChoice" : ""
    }" data-correctanswer="answer_a_correct">
      <p class="choice-number">A</p>
      <p class="choice-text">${
        answer_a ? answer_a : ""
      }</p>
    </div>
    <div class="choice ${
      !answer_b ? "unChoice" : ""
    }" data-correctanswer="answer_b_correct">
      <p class="choice-number">B</p>
      <p class="choice-text">${
        answer_b ? answer_b : ""
      }</p>
    </div>
    <div class="choice ${
      !answer_c ? "unChoice" : ""
    }" data-correctanswer="answer_c_correct">
      <p class="choice-number">C</p>
      <p class="choice-text">${
        answer_c ? answer_c : ""
      }</p>
    </div>
    <div class="choice ${
      !answer_d ? "unChoice" : ""
    }" data-correctanswer="answer_d_correct">
      <p class="choice-number">D</p>
      <p class="choice-text">${
        answer_d ? answer_d : ""
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
  const choices = document.querySelectorAll(".choice");
  choices.forEach((item) =>
    item.addEventListener("click", () => choiceClicked(choices, item))
  );
}

function choiceClicked(choices: NodeListOf<Element>, choice: Element) {
  choices.forEach((item) => item.classList.add("inactive"));
  checkChoices(choice);
  clearInterval(timeInterval);
  timer = 0;
  count++;
  setTimeout(() => {
    renderQuestion();
  }, 2000);
}

function checkChoices(choice: Element) {
  timeProgress.classList.remove("animation");
  const dataCorrectAnswer = (choice as HTMLElement).dataset.correctanswer;
  const currentQuestionAnswer = questionsData[count].correct_answers;
  type DataKey = keyof typeof currentQuestionAnswer;
  if (currentQuestionAnswer[dataCorrectAnswer as DataKey] === "true") {
    correctChoice(choice);
  } else {
    inCorrectChoice(choice);
  }
}

function correctChoice(choice: Element) {
  choice.classList.add("correct-answer");
  score += 10;
  scoreValue.innerText = `${score}`;
}

function inCorrectChoice(choice: Element) {
  choice.classList.add("incorrect-answer");
  const choices = document.querySelectorAll(".choice");
  choices.forEach((item) => {
    const dataCorrectAnswer = (item as HTMLElement).dataset.correctanswer;
    const currentQuestionAnswer = questionsData[count].correct_answers;
    type DataKey = keyof typeof currentQuestionAnswer;
    if (currentQuestionAnswer[dataCorrectAnswer as DataKey] === "true") {
      item.classList.add("correct-answer");
    }
  });
}

function timeOut() {
  if (timer < 4) {
    timer++;
  } else {
    checkChoicesAfterTimeOut();
  }
}

function checkChoicesAfterTimeOut() {
  clearInterval(timeInterval);
  timer = 0;
  timeProgress.classList.remove("animation");
  const choices = document.querySelectorAll(".choice");
  choices.forEach((item) => {
    item.classList.add("inactive");
    const dataCorrectAnswer = (item as HTMLElement).dataset.correctanswer;
    const currentQuestionAnswer = questionsData[count].correct_answers;
    type DataKey = keyof typeof currentQuestionAnswer;
    if (currentQuestionAnswer[dataCorrectAnswer as DataKey] === "true") {
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
  afterQuizTitleScore.innerText = `${score}`;
  scoreValue.innerText = "0";
  count = 0;
  score = 0;
}
