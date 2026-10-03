/**
 * Digital Climate Change Monitoring: Tracking Temperature and Rainfall Trends
 * Interactive Climate Awareness Quiz (5-Question Educational Assessment)
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "Climate Change Science",
    question: "Which of the following greenhouse gases is primarily responsible for the largest share of human-induced global temperature rise?",
    options: [
      { text: "Carbon Dioxide (CO₂)", isCorrect: true },
      { text: "Argon (Ar)", isCorrect: false },
      { text: "Helium (He)", isCorrect: false },
      { text: "Ozone in the upper stratosphere", isCorrect: false }
    ],
    explanation: "Carbon dioxide (CO₂) released from burning fossil fuels, deforestation, and industrial processes traps longwave thermal infrared radiation, causing global atmospheric warming."
  },
  {
    id: 2,
    category: "Weather vs Climate",
    question: "What is the primary scientific difference between 'Weather' and 'Climate'?",
    options: [
      { text: "Weather is measured in Celsius, while climate is measured in Fahrenheit", isCorrect: false },
      { text: "Weather describes short-term atmospheric conditions, while climate is the statistical average over long periods (typically 30 years)", isCorrect: true },
      { text: "Weather only applies to rainfall, whereas climate only applies to temperature", isCorrect: false },
      { text: "Weather is unpredictable, while climate never changes over time", isCorrect: false }
    ],
    explanation: "Weather refers to day-to-day atmospheric states (e.g. today's rain or heat), whereas climate represents statistical averages, extremes, and patterns measured over decades (WMO standard: 30 years)."
  },
  {
    id: 3,
    category: "Rainfall Dynamics",
    question: "According to the Clausius-Clapeyron meteorological relation, how does a warmer atmosphere affect rainfall patterns?",
    options: [
      { text: "It reduces all rainfall to zero permanently across the entire Earth", isCorrect: false },
      { text: "A warmer atmosphere holds ~7% more moisture per 1°C of warming, leading to heavier extreme downpours and erratic dry spells", isCorrect: true },
      { text: "It causes clouds to turn completely solid and prevent precipitation", isCorrect: false },
      { text: "Warm air cannot hold moisture, resulting in constant dry air worldwide", isCorrect: false }
    ],
    explanation: "Warmer air has higher moisture-holding capacity (~7% more per 1°C increase). This increases the intensity and severity of precipitation events and intensifies evaporation in dry zones."
  },
  {
    id: 4,
    category: "Digital Monitoring Technology",
    question: "How do Automated Weather Stations (AWS) and IoT sensors improve climate data collection over traditional manual instruments?",
    options: [
      { text: "They replace satellites entirely and eliminate the need for meteorologists", isCorrect: false },
      { text: "They provide high-frequency, real-time automated telemetry with lower human error and remote transmission to cloud servers", isCorrect: true },
      { text: "They only work when connected to municipal water supplies", isCorrect: false },
      { text: "They can artificially stop rainfall from occurring over cities", isCorrect: false }
    ],
    explanation: "IoT automated weather stations continuously record temperature, humidity, solar radiation, and rainfall data at minute-level intervals, relaying telemetry via cellular/LoRaWAN to cloud analytics."
  },
  {
    id: 5,
    category: "Sustainability & Solutions",
    question: "Which of the following actions serves as a nature-based solution that both sequesters atmospheric carbon and helps regulate local rainfall cycles?",
    options: [
      { text: "Expanding asphalt parking lots", isCorrect: false },
      { text: "Afforestation and ecological restoration of native forests and wetlands", isCorrect: true },
      { text: "Increasing reliance on single-use plastics", isCorrect: false },
      { text: "Burning agricultural crop residues in open fields", isCorrect: false }
    ],
    explanation: "Trees and wetlands absorb atmospheric CO₂ through photosynthesis and release moisture via evapotranspiration, which supports cloud formation and stabilizes local rainfall regimes."
  }
];

class ClimateQuiz {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.userAnswers = {}; // { questionId: selectedIndex }
    this.submitted = false;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    let html = `
      <div class="quiz-wrapper">
        <div class="quiz-intro-bar">
          <div>
            <span class="quiz-badge">5 Questions</span>
            <span class="quiz-subtext">Select the best answer for each question and click <strong>Submit Assessment</strong>.</span>
          </div>
          <div class="quiz-progress-indicator" id="quizProgressCount">Answered: 0 / 5</div>
        </div>

        <form id="climateQuizForm" class="quiz-form">
    `;

    QUIZ_QUESTIONS.forEach((q, index) => {
      const selectedOptionIndex = this.userAnswers[q.id];
      html += `
        <div class="quiz-card" id="quizCard_${q.id}">
          <div class="quiz-q-header">
            <span class="quiz-q-num">Question ${index + 1} of 5</span>
            <span class="quiz-q-cat">${q.category}</span>
          </div>
          <h4 class="quiz-question-title">${q.question}</h4>
          
          <div class="quiz-options-group">
      `;

      q.options.forEach((opt, optIdx) => {
        const isSelected = selectedOptionIndex === optIdx;
        let optionClass = "quiz-option-label";
        
        if (this.submitted) {
          if (opt.isCorrect) {
            optionClass += " correct-answer";
          } else if (isSelected && !opt.isCorrect) {
            optionClass += " wrong-answer";
          }
        } else if (isSelected) {
          optionClass += " selected";
        }

        html += `
          <label class="${optionClass}">
            <input type="radio" 
                   name="q_${q.id}" 
                   value="${optIdx}" 
                   ${isSelected ? 'checked' : ''} 
                   ${this.submitted ? 'disabled' : ''} 
                   onchange="window.climateQuizInstance.selectAnswer(${q.id}, ${optIdx})">
            <span class="opt-indicator">${String.fromCharCode(65 + optIdx)}</span>
            <span class="opt-text">${opt.text}</span>
            ${this.submitted && opt.isCorrect ? '<span class="status-icon-check">✓ Correct</span>' : ''}
            ${this.submitted && isSelected && !opt.isCorrect ? '<span class="status-icon-wrong">✗ Incorrect</span>' : ''}
          </label>
        `;
      });

      html += `</div>`;

      // Show explanation if submitted
      if (this.submitted) {
        html += `
          <div class="quiz-explanation-box">
            <div class="exp-title"><strong>Scientific Insight:</strong></div>
            <p>${q.explanation}</p>
          </div>
        `;
      }

      html += `</div>`;
    });

    html += `
        <div class="quiz-action-bar">
          ${!this.submitted ? `
            <button type="button" class="btn btn-primary btn-submit-quiz" id="btnSubmitQuiz" onclick="window.climateQuizInstance.submitQuiz()">
              Submit Assessment
            </button>
          ` : `
            <button type="button" class="btn btn-outline btn-restart-quiz" id="btnRestartQuiz" onclick="window.climateQuizInstance.restartQuiz()">
              🔄 Restart Quiz
            </button>
          `}
        </div>
      </form>

      ${this.submitted ? this.renderScoreSummary() : ''}
    </div>
    `;

    this.container.innerHTML = html;
    this.updateProgressIndicator();
  }

  selectAnswer(questionId, optionIndex) {
    if (this.submitted) return;
    this.userAnswers[questionId] = optionIndex;
    
    // Update local card highlight without re-rendering everything
    const card = document.getElementById(`quizCard_${questionId}`);
    if (card) {
      card.querySelectorAll('.quiz-option-label').forEach((label, idx) => {
        if (idx === optionIndex) {
          label.classList.add('selected');
        } else {
          label.classList.remove('selected');
        }
      });
    }

    this.updateProgressIndicator();
  }

  updateProgressIndicator() {
    const el = document.getElementById('quizProgressCount');
    if (!el) return;
    const answeredCount = Object.keys(this.userAnswers).length;
    el.textContent = `Answered: ${answeredCount} / 5`;
    if (answeredCount === 5) {
      el.classList.add('all-answered');
    } else {
      el.classList.remove('all-answered');
    }
  }

  submitQuiz() {
    const answeredCount = Object.keys(this.userAnswers).length;
    if (answeredCount < 5) {
      if (!confirm(`You have answered ${answeredCount} out of 5 questions. Would you like to submit anyway?`)) {
        return;
      }
    }

    this.submitted = true;
    this.render();

    // Scroll gently to score summary
    const summaryEl = document.getElementById('quizScoreResult');
    if (summaryEl) {
      summaryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  restartQuiz() {
    this.userAnswers = {};
    this.submitted = false;
    this.render();

    const quizTop = document.getElementById('quiz');
    if (quizTop) {
      quizTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  renderScoreSummary() {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      const userChoice = this.userAnswers[q.id];
      if (userChoice !== undefined && q.options[userChoice] && q.options[userChoice].isCorrect) {
        score++;
      }
    });

    let message = "";
    let badgeClass = "";

    if (score === 5) {
      message = "5/5 — Outstanding! You have mastered climate change monitoring, temperature trends, and digital meteorological principles.";
      badgeClass = "score-perfect";
    } else if (score >= 4) {
      message = "4/5 — Excellent! You understand climate monitoring and environmental science very well.";
      badgeClass = "score-high";
    } else if (score === 3) {
      message = "3/5 — Good effort! You grasp the fundamentals. Review the scientific insights above to strengthen your knowledge.";
      badgeClass = "score-medium";
    } else {
      message = `${score}/5 — Keep learning! Explore the temperature, rainfall, and technology sections on this website to deepen your environmental understanding.`;
      badgeClass = "score-review";
    }

    return `
      <div class="quiz-score-summary ${badgeClass}" id="quizScoreResult">
        <div class="score-circle">
          <span class="score-number">${score}</span>
          <span class="score-total">/ 5</span>
        </div>
        <div class="score-content">
          <h3 class="score-title">Assessment Results</h3>
          <p class="score-feedback-text">${message}</p>
          <div class="score-meta">
            <span>Score: <strong>${(score / 5 * 100).toFixed(0)}%</strong></span>
            <span>• Course: CHE 110 Environmental Studies</span>
          </div>
        </div>
      </div>
    `;
  }
}

window.ClimateQuiz = ClimateQuiz;
