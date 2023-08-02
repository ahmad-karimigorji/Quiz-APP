"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
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
let questionsData = [];
let score = 0;
let count = 0;
let timer = 0;
let timeInterval;
let questionDetails = {
    category: "Linux",
    difficulty: "Easy",
    limit: "5",
};
category.addEventListener("change", (e) => changeQuestionDetails(e));
difficultyLevel.addEventListener("change", (e) => changeQuestionDetails(e));
limitInput.addEventListener("change", (e) => changeQuestionDetails(e));
function changeQuestionDetails(e) {
    const { name, value } = e.target;
    questionDetails = Object.assign(Object.assign({}, questionDetails), { [name]: value });
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
function getQuestions(questionDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        displayLoading();
        const url = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&category=${questionDetails.category}&difficulty=${questionDetails.difficulty}&limit=${questionDetails.limit}`;
        try {
            const { data } = yield axios_1.default.get(url);
            hideLoading();
            quizContainer.classList.add("active");
            questionsData = data;
            progressBar.max = questionsData.length;
            renderQuestion();
        }
        catch (error) {
            console.log(error);
        }
    });
}
function questionHtmlDOM() {
    const currentQuestion = questionsData[count];
    const { answer_a, answer_b, answer_c, answer_d } = currentQuestion.answers;
    quizBody.innerHTML = `<div class="quiz-question">${currentQuestion.multiple_correct_answers === "true"
        ? `${currentQuestion.question} (multiple correct answers)`
        : currentQuestion.question}</div>
  <div class="quiz-choices">
    <div class="choice ${!answer_a ? "unChoice" : ""}" data-correctanswer="answer_a_correct">
      <p class="choice-number">A</p>
      <p class="choice-text">${answer_a ? answer_a : ""}</p>
    </div>
    <div class="choice ${!answer_b ? "unChoice" : ""}" data-correctanswer="answer_b_correct">
      <p class="choice-number">B</p>
      <p class="choice-text">${answer_b ? answer_b : ""}</p>
    </div>
    <div class="choice ${!answer_c ? "unChoice" : ""}" data-correctanswer="answer_c_correct">
      <p class="choice-number">C</p>
      <p class="choice-text">${answer_c ? answer_c : ""}</p>
    </div>
    <div class="choice ${!answer_d ? "unChoice" : ""}" data-correctanswer="answer_d_correct">
      <p class="choice-number">D</p>
      <p class="choice-text">${answer_d ? answer_d : ""}</p>
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
    choices.forEach((item) => item.addEventListener("click", () => choiceClicked(choices, item)));
}
function choiceClicked(choices, choice) {
    choices.forEach((item) => item.classList.add("inactive"));
    checkChoices(choice);
    clearInterval(timeInterval);
    timer = 0;
    count++;
    setTimeout(() => {
        renderQuestion();
    }, 2000);
}
function checkChoices(choice) {
    timeProgress.classList.remove("animation");
    const dataCorrectAnswer = choice.dataset.correctanswer;
    const currentQuestionAnswer = questionsData[count].correct_answers;
    if (currentQuestionAnswer[dataCorrectAnswer] === "true") {
        correctChoice(choice);
    }
    else {
        inCorrectChoice(choice);
    }
}
function correctChoice(choice) {
    choice.classList.add("correct-answer");
    score += 10;
    scoreValue.innerText = `${score}`;
}
function inCorrectChoice(choice) {
    choice.classList.add("incorrect-answer");
    const choices = document.querySelectorAll(".choice");
    choices.forEach((item) => {
        const dataCorrectAnswer = item.dataset.correctanswer;
        const currentQuestionAnswer = questionsData[count].correct_answers;
        if (currentQuestionAnswer[dataCorrectAnswer] === "true") {
            item.classList.add("correct-answer");
        }
    });
}
function timeOut() {
    if (timer < 4) {
        timer++;
    }
    else {
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
        const dataCorrectAnswer = item.dataset.correctanswer;
        const currentQuestionAnswer = questionsData[count].correct_answers;
        if (currentQuestionAnswer[dataCorrectAnswer] === "true") {
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
    numberOfQuestionTitle.innerText = `Question: ${count + 1}/${questionsData.length}`;
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
