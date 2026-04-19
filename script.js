const quizMeta = document.getElementById("quiz-meta");
const quizForm = document.getElementById("quiz-form");
const submitBtn = document.getElementById("submit-btn");
const retryBtn = document.getElementById("retry-btn");
const result = document.getElementById("result");
const questionTemplate = document.getElementById("question-template");
const themeToggleBtn = document.getElementById("theme-toggle");

let questions = [];
const THEME_STORAGE_KEY = "az104-theme";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return systemPrefersDark ? "dark" : "light";
};

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggleBtn.textContent = `Passer en ${nextTheme}`;
};

const initThemeToggle = () => {
  const theme = getInitialTheme();
  applyTheme(theme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildOption = (questionIndex, option, optionIndex) => {
  const safeOption = escapeHtml(option);
  return `
    <label class="option">
      <input type="radio" name="question-${questionIndex}" value="${optionIndex}" />
      <span>${safeOption}</span>
    </label>
  `;
};

const renderQuiz = (data) => {
  quizForm.innerHTML = "";
  quizMeta.textContent = `${data.length} questions chargees depuis questions.json`;

  data.forEach((question, index) => {
    const fragment = questionTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".question-card");
    const title = fragment.querySelector(".question-title");
    const options = fragment.querySelector(".options");

    card.dataset.index = String(index);
    title.textContent = `${index + 1}. ${question.question}`;

    options.innerHTML = question.choices
      .map((choice, choiceIndex) => buildOption(index, choice, choiceIndex))
      .join("");

    quizForm.appendChild(fragment);
  });
};

const getSelectedAnswers = () =>
  questions.map((_, index) => {
    const selected = quizForm.querySelector(`input[name="question-${index}"]:checked`);
    return selected ? Number(selected.value) : null;
  });

const showFeedback = (answers) => {
  let score = 0;

  questions.forEach((question, index) => {
    const card = quizForm.querySelector(`.question-card[data-index="${index}"]`);
    const feedback = card.querySelector(".feedback");
    const status = card.querySelector(".feedback-status");
    const text = card.querySelector(".feedback-text");
    const link = card.querySelector(".feedback-link");

    const isCorrect = answers[index] === question.correctIndex;
    if (isCorrect) score += 1;

    status.textContent = isCorrect ? "Bonne reponse" : "Mauvaise reponse";
    status.className = `feedback-status ${isCorrect ? "good" : "bad"}`;

    const correctAnswer = question.choices[question.correctIndex] || "N/A";
    text.textContent = `${question.explanation} Reponse attendue: ${correctAnswer}.`;

    link.href = question.docUrl;
    link.textContent = "Voir la documentation officielle";
    feedback.hidden = false;
  });

  const percent = Math.round((score / questions.length) * 100);
  result.hidden = false;
  result.textContent = `Score: ${score}/${questions.length} (${percent}%).`;

  submitBtn.disabled = true;
  retryBtn.hidden = false;
};

const resetQuiz = () => {
  const checkedInputs = quizForm.querySelectorAll("input[type=radio]:checked");
  checkedInputs.forEach((input) => {
    input.checked = false;
  });

  const feedbackBlocks = quizForm.querySelectorAll(".feedback");
  feedbackBlocks.forEach((block) => {
    block.hidden = true;
  });

  submitBtn.disabled = false;
  retryBtn.hidden = true;
  result.hidden = true;
  result.textContent = "";
};

const loadQuestions = async () => {
  const response = await fetch("questions.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Impossible de charger le questionnaire.");
  }

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Le fichier JSON ne contient pas de questions valides.");
  }

  return data;
};

const init = async () => {
  initThemeToggle();

  try {
    questions = await loadQuestions();
    renderQuiz(questions);
  } catch (error) {
    quizMeta.textContent = "Erreur de chargement du questionnaire.";
    quizForm.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    submitBtn.disabled = true;
    return;
  }

  submitBtn.addEventListener("click", () => {
    const answers = getSelectedAnswers();

    if (answers.includes(null)) {
      result.hidden = false;
      result.textContent = "Veuillez repondre a toutes les questions avant la correction.";
      return;
    }

    showFeedback(answers);
  });

  retryBtn.addEventListener("click", resetQuiz);
};

init();
