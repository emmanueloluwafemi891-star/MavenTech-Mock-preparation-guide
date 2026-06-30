// ===== VARIABLES =====
let selectedCourse = [];
let currentQuestion = 0;
let userAnswers = [];
let timeLeft = 1800;
let timer;

// ===== START QUIZ =====
function startQuiz() {
  const name = document.getElementById("studentName").value.trim();
  const course = document.getElementById("course").value;

  if (name === "" || course === "") {
    alert("Please enter your name and select a course.");
    return;
  }

  document.getElementById("displayName").textContent = name;
  document.getElementById("displayCourse").textContent = course;

  selectedCourse = getCourse(course);

  if (!selectedCourse || selectedCourse.length === 0) {
    alert("No questions available for this course.");
    return;
  }

  currentQuestion = 0;
  userAnswers = new Array(selectedCourse.length).fill(null);
  timeLeft = 1800;

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  createQuestionPalette();
  startTimer();
  showQuestion();
}

// ===== TIMER =====
function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    document.getElementById("timer").textContent =
      `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (timeLeft === 420) {
      alert("⚠️ Hurry! Only 7 minutes remaining.");
    }

    timeLeft--;

if (timeLeft <= 0) {
    clearInterval(timer);
    timeLeft = 0;

    document.getElementById("timer").textContent = "Time Left: 0:00";

    alert("⏰ Time is up! Your exam has been submitted automatically.");

    submitQuiz();
    return;
    }
  }, 1000);
}

// ===== SHOW QUESTION =====
function showQuestion() {
  const q = selectedCourse[currentQuestion];

  document.getElementById("question-number").textContent =
    `Question ${currentQuestion + 1} of ${selectedCourse.length}`;

  document.getElementById("question").textContent = q.question;

  let progress =
    ((currentQuestion + 1) / selectedCourse.length) * 100;

  document.getElementById("progress-bar").style.width =
    progress + "%";

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((option, index) => {
    const div = document.createElement("div");
    div.classList.add("option");

    if (userAnswers[currentQuestion] === index) {
      div.classList.add("selected");
    }

    div.textContent =
      String.fromCharCode(65 + index) + ". " + option;

    div.onclick = function () {
      userAnswers[currentQuestion] = index;
      updatePalette();
      showQuestion();
    };

    optionsDiv.appendChild(div);
    
  });

  updatePalette();
}

// ===== NEXT QUESTION =====
function nextQuestion() {
  if (currentQuestion < selectedCourse.length - 1) {
    currentQuestion++;
    showQuestion();
  }
}

// ===== PREVIOUS QUESTION =====
function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

// ===== SUBMIT QUIZ =====
function submitQuiz() {
  const modal = document.getElementById("confirmModal");
  modal.style.display = "flex";
  
  document.getElementById("cancelSubmit").onclick = function() {
    modal.style.display = "none";
  };
  
  document.getElementById("confirmSubmit").onclick = function() {
    modal.style.display = "none";
    proceedWithSubmit();
  };
}

function proceedWithSubmit() {
  clearInterval(timer);

  let score = 0;

  selectedCourse.forEach((q, i) => {
    if (userAnswers[i] === q.answer) {
      score++;
    }
  });

  let percentage =
    Math.round((score / selectedCourse.length) * 100);

  let message = "";

  if (percentage >= 90) {
    message = "🎉 Excellent!";
  } else if (percentage >= 70) {
    message = "👍 Very Good!";
  } else if (percentage >= 50) {
    message = "📚 Good, Keep Practicing!";
  } else {
    message = "💪 More Practice Needed!";
  }

  localStorage.setItem(
    "lastResult",
    JSON.stringify({
      name: document.getElementById("studentName").value,
      course: document.getElementById("course").value,
      score,
      percentage
    })
  );

  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  document.getElementById("resultName").textContent =
    "Candidate: " +
    document.getElementById("studentName").value;

  document.getElementById("resultCourse").textContent =
    "Course: " +
    document.getElementById("course").value;

  document.getElementById("score").innerHTML =
    `Score: ${score}/${selectedCourse.length}
     <br>
     Percentage: ${percentage}%
     <br><br>
     ${message}`;
}

// ===== REVIEW ANSWERS =====
function reviewAnswers() {
  const review = document.getElementById("reviewBox");
  review.innerHTML = "";

  selectedCourse.forEach((q, i) => {
    const div = document.createElement("div");
    div.classList.add("review-item");

    const user =
  userAnswers[i] !== null
    ? q.options[userAnswers[i]]
    : "No Answer";

const correct = q.options[q.answer];
const isCorrect = userAnswers[i] === q.answer;

div.classList.add(isCorrect ? "review-correct" : "review-wrong");

div.innerHTML = `
  <h4>Question ${i + 1}</h4>
  <p>${q.question}</p>
  <p>Your Answer: ${user} ${isCorrect ? "✅" : "❌"}</p>
  <p class="correct">
    Correct Answer: ${correct}
  </p>
`;

    review.appendChild(div);
  });
}

// ===== GET COURSE =====
function getCourse(course) {
  return {
    GST112,
    MTH132,
    PHY102,
    CSC104,
    CSC122,
    COS102,
    STA112,
    CYB102,
    CYB104  
  }[course];
}
// ===== SHOW PREVIOUS RESULT =====
window.onload = function () {
  let result = JSON.parse(
    localStorage.getItem("lastResult")
  );

  if (result) {
    document.getElementById("previousResult").innerHTML = `
      <h3>Previous Result</h3>
      <p>Name: ${result.name}</p>
      <p>Course: ${result.course}</p>
      <p>Score: ${result.score}/50</p>
      <p>Percentage: ${result.percentage}%</p>
    `;
  }
};
 
const STA112 = [
  {
    question: "In how many ways can the letters of the word 'STATISTICS' be arranged?",
    options: [
      "10!",
      "10!/(3!2!3!)",
      "10!/(3!3!2!2!)",
      "10!/(2!2!2!)"
    ],
    answer: 2
  },
  {
    question: "A committee of 5 is to be selected from 7 men and 4 women. In how many ways can this be done if the committee must contain at least 1 woman?",
    options: [
      "462",
      "441",
      "21",
      "419"
    ],
    answer: 1
  },
  {
    question: "Which of the following best describes a permutation?",
    options: [
      "Selection of objects where order does not matter",
      "Arrangement of objects where order matters",
      "Selection of objects with repetition allowed only",
      "Arrangement of objects where repetition is never allowed"
    ],
    answer: 1
  },
  {
    question: "If nPr = 336 and nCr = 56, what is r! ?",
    options: [
      "4",
      "5",
      "6",
      "8"
    ],
    answer: 2
  },
  {
    question: "A bag contains 5 red and 3 blue balls. Two balls are drawn without replacement. What is the probability that both are red?",
    options: [
      "5/14",
      "25/64",
      "5/28",
      "5/8"
    ],
    answer: 0
  },
  {
    question: "Which of the following is NOT a property of a valid probability distribution?",
    options: [
      "Sum of all probabilities equals 1",
      "Each probability lies between 0 and 1 inclusive",
      "Probabilities can be negative if the event is unlikely",
      "The probabilities are defined over the sample space"
    ],
    answer: 2
  },
  {
    question: "A random variable that can take on a finite or countably infinite number of values is called:",
    options: [
      "Continuous random variable",
      "Discrete random variable",
      "Independent random variable",
      "Standardized random variable"
    ],
    answer: 1
  },
  {
    question: "Two events A and B are said to be mutually exclusive if:",
    options: [
      "P(A∩B) = P(A) × P(B)",
      "P(A∩B) = 0",
      "P(A∪B) = 1",
      "P(A|B) = P(A)"
    ],
    answer: 1
  },
  {
    question: "If P(A) = 0.4, P(B) = 0.5, and A and B are independent, what is P(A∪B)?",
    options: [
      "0.9",
      "0.7",
      "0.2",
      "0.65"
    ],
    answer: 1
  },
  {
    question: "In a class of 60 students, 36 study Economics, 24 study Statistics, and 12 study both. What is the probability that a randomly selected student studies neither?",
    options: [
      "1/5",
      "1/6",
      "1/10",
      "1/3"
    ],
    answer: 0
  },
  {
    question: "The probability density function (pdf) of a continuous random variable must satisfy which condition?",
    options: [
      "f(x) ≥ 0 for all x, and the area under the curve equals 1",
      "f(x) = 1 for all x",
      "f(x) can be negative",
      "f(x) must be symmetric"
    ],
    answer: 0
  },
  {
    question: "For a discrete random variable X, F(x) = P(X ≤ x) is called the:",
    options: [
      "Probability mass function",
      "Cumulative distribution function",
      "Moment generating function",
      "Joint density function"
    ],
    answer: 1
  },
  {
    question: "Which of the following values CANNOT be a valid probability?",
    options: [
      "0",
      "0.999",
      "1.05",
      "1"
    ],
    answer: 2
  },
  {
    question: "A fair coin is tossed 4 times. What is the probability of getting exactly 2 heads?",
    options: [
      "1/4",
      "3/8",
      "1/2",
      "1/16"
    ],
    answer: 1
  },
  {
    question: "If X and Y are independent random variables, which of the following is always true?",
    options: [
      "Var(X+Y) = Var(X) + Var(Y)",
      "E(XY) = E(X) + E(Y)",
      "Var(X+Y) = Var(X) − Var(Y)",
      "E(X+Y) = E(X) × E(Y)"
    ],
    answer: 0
  },
  {
    question: "A student claims: 'If two events have a combined probability greater than 1, they must be independent.' This statement is:",
    options: [
      "True",
      "False",
      "True only if one event is the complement of the other",
      "False because it only applies to conditional probability"
    ],
    answer: 1
  },
  {
    question: "Which probability distribution describes the number of successes in a fixed number of independent Bernoulli trials?",
    options: [
      "Hypergeometric",
      "Binomial",
      "Poisson",
      "Normal"
    ],
    answer: 1
  },
  {
    question: "A Bernoulli random variable X takes the value 1 with probability p. What is Var(X)?",
    options: [
      "p",
      "p(1-p)",
      "p²",
      "1-p"
    ],
    answer: 1
  },
  {
    question: "For a Bernoulli trial with p = 0.3, what is E(X)?",
    options: [
      "0.7",
      "0.21",
      "0.3",
      "1"
    ],
    answer: 2
  },
  {
    question: "Which is a key distinguishing feature of the hypergeometric distribution compared to the binomial distribution?",
    options: [
      "It requires a continuous outcome",
      "Sampling is done without replacement",
      "It can only be used when p = 0.5",
      "It has no fixed sample size"
    ],
    answer: 1
  },
  {
    question: "A box contains 10 items, 4 of which are defective. If 3 items are selected without replacement, what is the probability that exactly 2 are defective?",
    options: [
      "C(4,2)C(6,1)/C(10,3)",
      "C(4,2)C(6,1)/C(10,2)",
      "C(4,1)C(6,2)/C(10,3)",
      "C(4,3)/C(10,3)"
    ],
    answer: 0
  },
  {
    question: "The standard normal distribution has which of the following properties?",
    options: [
      "Mean = 1, Variance = 0",
      "Mean = 0, Standard deviation = 1",
      "Mean = 0, Variance = 0",
      "Mean = 1, Standard deviation = 1"
    ],
    answer: 1
  },
  {
    question: "If X ~ N(50,16), what is the standard deviation of X?",
    options: [
      "16",
      "4",
      "50",
      "8"
    ],
    answer: 1
  },
  {
    question: "To convert a normal random variable X with mean μ and standard deviation σ to a standard normal variable Z, the correct formula is:",
    options: [
      "Z = (X − μ)/σ²",
      "Z = (X − μ)/σ",
      "Z = (X + μ)/σ",
      "Z = (μ − X)/σ²"
    ],
    answer: 1
  },
  {
    question: "If X ~ N(60,25), what is the corresponding Z-value for X = 65?",
    options: [
      "0.2",
      "1.0",
      "5.0",
      "2.0"
    ],
    answer: 1
    },
  {
    question: "Which statement correctly describes the shape of the normal distribution curve?",
    options: [
      "Skewed to the right",
      "Skewed to the left",
      "Symmetric and bell-shaped about the mean",
      "Uniform across all values"
    ],
    answer: 2
  },
  {
    question: "In a standard normal distribution, approximately what percentage of values lie within ±1 standard deviation of the mean?",
    options: [
      "50%",
      "68%",
      "95%",
      "99.7%"
    ],
    answer: 1
  },
  {
    question: "A lecturer states: 'Since the normal distribution is symmetric, the mean, median, and mode are always equal.' This statement is:",
    options: [
      "False, because the mode does not exist",
      "True",
      "False, because the mean is always greater than the median",
      "True only when the variance equals 1"
    ],
    answer: 1
  },
  {
    question: "Which of the following is the correct formula for the variance of a discrete random variable X?",
    options: [
      "Var(X) = E(X²) − E(X)",
      "Var(X) = E(X²) − [E(X)]²",
      "Var(X) = [E(X)]² − E(X²)",
      "Var(X) = [E(X)]² + E(X²)"
    ],
    answer: 1
  },
  {
    question: "A discrete random variable X has the distribution P(X=1)=0.2, P(X=2)=0.3, P(X=3)=0.5. What is E(X)?",
    options: [
      "2.0",
      "2.3",
      "2.5",
      "1.8"
    ],
    answer: 1
  },
  {
    question: "Why can the hypergeometric distribution NOT be approximated by the binomial distribution when the sample size is large relative to the population?",
    options: [
      "The probability of success changes with each draw",
      "Hypergeometric variables are continuous",
      "The binomial distribution requires sampling without replacement",
      "The mean is undefined"
    ],
    answer: 0
  },
  {
    question: "If a fair die is rolled, what is the probability of getting a number greater than 4?",
    options: [
      "1/2",
      "1/3",
      "2/3",
      "1/6"
    ],
    answer: 1
  },
  {
    question: "The conditional probability P(A|B) is defined as:",
    options: [
      "P(A∩B)/P(B), provided P(B) ≠ 0",
      "P(A∩B)/P(A)",
      "P(A) × P(B)",
      "P(A∪B)/P(B)"
    ],
    answer: 0
  },
  {
    question: "Events A and B are independent. Which of the following must be true?",
    options: [
      "P(A|B) = P(B|A)",
      "P(A∩B) = P(A) × P(B)",
      "P(A∪B) = P(A) + P(B)",
      "P(A) = P(B)"
    ],
    answer: 1
  },
  {
    question: "A factory produces bolts, 2% of which are defective. In a sample of 100 bolts, which distribution best models the number of defective bolts?",
    options: [
      "Normal distribution",
      "Binomial distribution",
      "Hypergeometric distribution only",
      "Uniform distribution"
    ],
    answer: 1
  },
  {
    question: "Which of the following statements about the mean of a probability distribution is FALSE?",
    options: [
      "The mean is also called the expected value",
      "The mean must always equal one of the possible values of the random variable",
      "The mean is a measure of central tendency",
      "The mean can be a non-integer"
    ],
    answer: 1
  },
  {
    question: "A continuous random variable X has pdf f(x)=k for 0 ≤ x ≤ 5 and 0 elsewhere. What is k?",
    options: [
      "1/5",
      "5",
      "1",
      "1/25"
    ],
    answer: 0
  },
  {
    question: "If Z is a standard normal variable, what is P(Z > 0)?",
    options: [
      "1",
      "0",
      "0.5",
      "Cannot be determined"
    ],
    answer: 2
  },
  {
    question: "Which statement correctly distinguishes a probability mass function (pmf) from a probability density function (pdf)?",
    options: [
      "pmf applies to continuous variables",
      "pmf gives P(X=x) directly for discrete variables, while pdf requires integration",
      "They are interchangeable",
      "pmf values must sum to more than 1"
    ],
    answer: 1
  },
  {
    question: "A student selects 4 cards from a standard deck without replacement. What distribution models the number of aces selected?",
    options: [
      "Binomial",
      "Bernoulli",
      "Hypergeometric",
      "Normal"
    ],
    answer: 2
  },
  {
    question: "If the variance of a random variable X is 0, what can be concluded?",
    options: [
      "X is undefined",
      "X is a constant",
      "X follows a standard normal distribution",
      "X is uniformly distributed"
    ],
    answer: 1
  },
  {
    question: "A lecturer sets P(A)=0.6 and P(A∩B)=0.7. What can be immediately concluded?",
    options: [
      "B is more likely than A",
      "This is impossible because P(A∩B) cannot exceed P(A)",
      "A and B are independent",
      "A and B are mutually exclusive"
    ],
    answer: 1
  },
  {
    question: "In how many distinct ways can 6 people be seated around a circular table?",
    options: [
      "6!",
      "5!",
      "6!/2",
      "720"
    ],
    answer: 1
  },
  {
    question: "Why do we divide by the standard deviation when standardizing a normal variable?",
    options: [
      "To shift the mean to zero",
      "To express values in standard deviation units and obtain variance 1",
      "To make the distribution skewed",
      "To convert a continuous variable into a discrete variable"
    ],
    answer: 1
  },
  {
    question: "A box contains 6 white and 4 black balls. If 2 balls are drawn with replacement, what is the probability both are white?",
    options: [
      "9/25",
      "3/5",
      "6/10",
      "1/3"
    ],
    answer: 0
  },
  {
    question: "Which scenario violates the assumptions required for using the binomial distribution?",
    options: [
      "Tossing a fair coin 10 times",
      "Drawing 5 cards without replacement",
      "Testing 20 independent light bulbs",
      "Surveying 50 independent people"
    ],
    answer: 1
  },
  {
    question: "If E(X)=4 and Var(X)=9, what is E(X²)?",
    options: [
      "13",
      "25",
      "16",
      "5"
    ],
    answer: 1
  },
  {
    question: "Which relationship between combinations and permutations is always true?",
    options: [
      "nCr > nPr",
      "nCr = nPr",
      "nPr = nCr × r!",
      "They are unrelated"
    ],
    answer: 2
  },
    {
    question: "A biased coin has P(Head)=0.7. If tossed 5 times, what is the probability of getting at least one head?",
    options: [
      "1 − (0.3)^5",
      "(0.7)^5",
      "0.7 × 5",
      "1 − (0.7)^5"
    ],
    answer: 0
  },
  {
    question: "A researcher wrongly assumes that because a dataset is large, it must follow a normal distribution. Which statement best critiques this assumption?",
    options: [
      "Large sample size guarantees normality",
      "Large samples justify approximate normality of the sampling distribution of the mean, not necessarily the population",
      "The assumption is correct if the variance is finite",
      "Normality only requires the mean to be positive"
    ],
    answer: 1
  }
];
function createQuestionPalette() {
    const palette = document.getElementById("questionPalette");
    palette.innerHTML = "";

    selectedCourse.forEach((_, index) => {
        const btn = document.createElement("button");

        btn.textContent = index + 1;

        btn.onclick = () => {
            currentQuestion = index;
            showQuestion();
            updatePalette();
        };

        palette.appendChild(btn);
    });

    updatePalette();
}

function updatePalette() {
    const buttons = document.querySelectorAll("#questionPalette button");

    buttons.forEach((button, index) => {
        button.classList.remove("current", "answered");

        if (index === currentQuestion) {
            button.classList.add("current");
        }

        if (userAnswers[index] !== null) {
            button.classList.add("answered");
        }
    });
}

  
  
         
    

    
    
  
  
    
      
    
    

  


  
    





    
    
  
  
