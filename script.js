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

    <p>Your Answer: ${user ?? "No answer"} ${isCorrect ? "✅" : "❌"}</p>

    <p>Correct Answer: ${correct ?? "Not set"}</p>

    <p>Explanation: ${q.explanation ?? "No explanation"}</p>

    <hr>
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
const GST112 = [
  {
    question: "What was the basis of the Kanem-Bornu socio-political organization?",
    options: ["Trade guilds", "Religious councils only", "Kinship", "Military conquest"],
    answer: "Kinship"
  },
  {
    question: "The King's mother in the Kanem political structure was known as:",
    options: ["Maini Kanendi", "Nokena", "Galadima", "Magira"],
    answer: "Magira"
  },
  {
    question: "The 'Nokena' in Kanem-Bornu was best described as:",
    options: ["The chief judge's court", "A class of slaves", "The royal army", "A council of twelve advisers to the king"],
    answer: "A council of twelve advisers to the king"
  },
  {
    question: "Bawo's six children founded the six original Hausa states known as:",
    options: ["Saifawa dynasty", "Hausa Bokwoi", "Sarkin Hausawa", "Hausa Banza"],
    answer: "Hausa Bokwoi"
  },
  {
    question: "Which group is referred to as the 'Hausa Banza' (bastard states)?",
    options: ["Kanuri, Hausa, Fulani", "Daura, Katsina, Kano, Rano", "Zamfara, Kebbi, Gwari, Yauri, Nupe, Jukun, Yoruba", "Zazzau and Gobir"],
    answer: "Zamfara, Kebbi, Gwari, Yauri, Nupe, Jukun, Yoruba"
  },
  {
    question: "The original homeland of the Fulani people is believed to be:",
    options: ["The Sahara Desert", "Lake Chad basin", "The Niger River valley", "The Senegal River valley"],
    answer: "The Senegal River valley"
  },
  {
    question: "The 'Town Fulani' (sedentary Fulani) were predominantly:",
    options: ["Christian", "Animist", "Traditional worshippers only", "Muslim"],
    answer: "Muslim"
  },
  {
    question: "Uthman dan Fodio served as a tutor/adviser in the court of:",
    options: ["The Etsu Nupe", "The Mai of Bornu", "The king of Gobir", "The Sarki of Kano"],
    answer: "The king of Gobir"
  },
  {
    question: "The title 'Sarkin Kasar' given to a Hausa state head means:",
    options: ["Chief judge", "Head of the army", "Ruler of the land", "Defender of the faith"],
    answer: "Ruler of the land"
  },
  {
    question: "The Nupe kingdom was founded by:",
    options: ["Eweka I", "Oduduwa", "Ayagba", "Tsoede (Edegi)"],
    answer: "Tsoede (Edegi)"
  },
  {
    question: "Tsoede is said to have been the son of:",
    options: ["An Ife king and a Benin woman", "A Hausa king and a Fulani woman", "An Igala king and a Nupe woman", "A Bini king and a Yoruba woman"],
    answer: "An Igala king and a Nupe woman"
  },
  {
    question: "The royal title used in the Nupe kingdom was:",
    options: ["Olu", "Alaafin", "Oba", "Etsu"],
    answer: "Etsu"
  },
  {
    question: "In Nupe society, the head of each village was known as the:",
    options: ["Shaba", "Etsu", "Achuwo", "Zitzu"],
    answer: "Zitzu"
  },
  {
    question: "According to the Achadu version, the founder of the Igala dynasty came from:",
    options: ["Hausaland", "Igbo country", "Benin", "Yorubaland"],
    answer: "Igbo country"
  },
  {
    question: "The Igala political structure operated on which two levels?",
    options: ["Federal and state", "Religious and military", "Central and provincial", "Village and clan"],
    answer: "Central and provincial"
  },
  {
    question: "The Jukun people (Kwararafa) practiced what type of government?",
    options: ["Republican", "Military dictatorship", "Democratic", "Theocratic"],
    answer: "Theocratic"
  },
  {
    question: "The head of the Jukun state, believed to represent the gods on earth, was called:",
    options: ["Sarki", "Attah", "Etsu Nupe", "Aku Uka"],
    answer: "Aku Uka"
  },
  {
    question: "Who functioned as the 'Prime Minister' in the Jukun political structure?",
    options: ["Kinda Achuwo", "Aku Nako", "Achuwo", "Abo Zike"],
    answer: "Achuwo"
  },
  {
    question: "According to P. Bohannan, the Tiv socio-political system was best described as:",
    options: ["Military oligarchy", "Theocratic", "Highly centralized monarchy", "Segmentary/decentralized"],
    answer: "Segmentary/decentralized"
  },
  {
    question: "The largest recognized family group entity among the Tiv was called:",
    options: ["Swem", "Ityough Kiteragh", "Tsombor", "Mbavessen"],
    answer: "Tsombor"
  },
  {
    question: "According to Samuel Johnson's account, Oduduwa was believed to be the son of:",
    options: ["Obatala", "The Mai of Bornu", "The king of Benin", "Lamurudu, king of Mecca"],
    answer: "Lamurudu, king of Mecca"
  },
  {
    question: "Oranmiyan, the founder of the Oyo kingdom, was:",
    options: ["The founder of the Itsekiri kingdom", "A Hausa prince", "A grandson of Oduduwa", "The first Ogiso of Benin"],
    answer: "A grandson of Oduduwa"
  },
  {
    question: "The head of the Oyo Empire was titled:",
    options: ["Attah", "Etsu", "Oba", "Alaafin"],
    answer: "Alaafin"
  },
  {
    question: "The Oyomesi, a council of seven members in Oyo, was headed by:",
    options: ["Ogboni", "Ilari", "Bashorun", "Are-Ona-Kankanfo"],
    answer: "Bashorun"
  },
  {
    question: "What was the primary role of the Ogboni cult in Yoruba society?",
    options: ["Foreign diplomacy", "Tax collection", "Military command", "Mediatory role between the Oyomesi and the Alaafin"],
    answer: "Mediatory role between the Oyomesi and the Alaafin"
  },
    {
    question: "In the Oyo Empire, the head of the army held the title:",
    options: ["Oyomesi", "Are-Ona-Kankanfo", "Ilari", "Bashorun"],
    answer: "Are-Ona-Kankanfo"
  },
  {
    question: "Which Portuguese explorer arrived in Benin during Ewuare's reign in 1472?",
    options: ["Flora Shaw", "Vasco da Gama", "Ruy de Sequeira", "Alfonso de Aviero"],
    answer: "Ruy de Sequeira"
  },
  {
    question: "According to Bini mythology, the first ruler of Bini became powerful because he:",
    options: ["Inherited wealth from his father", "Was crowned by the Portuguese", "Won a war against Ife", "Chose a snail shell that produced land"],
    answer: "Chose a snail shell that produced land"
  },
  {
    question: "The first period of pre-colonial Bini history, ruled by 'kings of the sky,' is known as the:",
    options: ["Igodomigodo era", "Oranmiyan era", "Eweka era", "Ogiso era"],
    answer: "Ogiso era"
  },
  {
    question: "Eweka I, the first Oba of Benin, was the son of:",
    options: ["Igbodo and an Ife woman", "Ewuare and a Yoruba woman", "Oranmiyan and a Bini woman", "Oduduwa and a Bini woman"],
    answer: "Oranmiyan and a Bini woman"
  },
  {
    question: "Bini society was classified into two distinct classes:",
    options: ["Etsu and Nupe", "Oyomesi and Ogboni", "Sarki and Talakawa", "Nobility (Adesotu) and Commoners (Ighiotu)"],
    answer: "Nobility (Adesotu) and Commoners (Ighiotu)"
  },
  {
    question: "The kingdom of Itsekiri is traditionally said to have been founded by:",
    options: ["Oranmiyan", "Eweka I", "Tsoede", "Iginuwa"],
    answer: "Iginuwa"
  },
  {
    question: "Among the Itsekiri, political and spiritual powers were combined in the office of the:",
    options: ["Etsu", "Sarki", "Olu", "Ovie"],
    answer: "Olu"
  },
  {
    question: "Unlike the Itsekiri and Benin, the Urhobo people never established:",
    options: ["Village councils", "A single unified kingdom", "Age-grade systems", "A trading economy"],
    answer: "A single unified kingdom"
  },
  {
    question: "The Igbo are best known for their style of pre-colonial governance described as:",
    options: ["Federal structure", "Theocratic empire", "Centralized monarchy", "Acephalous/segmentary"],
    answer: "Acephalous/segmentary"
  },
  {
    question: "In traditional Igbo society, the staff of authority symbolizing justice was called the:",
    options: ["Alusi", "Ikenga", "Chukwu", "Ofo"],
    answer: "Ofo"
  },
  {
    question: "The general assembly where male adults performed legislative functions in Igbo society was called:",
    options: ["Igbo-mela", "Okpara council", "Amala Oha", "Nri assembly"],
    answer: "Amala Oha"
  },
  {
    question: "Among the Ijaw, the main political authority in the village was the assembly presided over by the:",
    options: ["Attah", "Ovie", "Olu", "Amanyanabo"],
    answer: "Amanyanabo"
  },
  {
    question: "The 'House System' is most closely associated with which ethnic group?",
    options: ["Efik", "Annang", "Ibibio", "Ijaw"],
    answer: "Ijaw"
  },
  {
    question: "Among the Ibibio, the term 'Ibio-ibio' refers to their:",
    options: ["Religious devotion", "Brief way of doing things", "Tall height", "Trading prowess"],
    answer: "Brief way of doing things"
  },
  {
    question: "Missionary Mary Slessor helped abolish which practice among the Ibibio?",
    options: ["Polygamy", "Slave trade", "Child labor", "The killing of twins"],
    answer: "The killing of twins"
  },
  {
    question: "The four major Efik settlements collectively came to be known as:",
    options: ["Bonny", "Nembe", "Calabar", "Opobo"],
    answer: "Calabar"
  },
  {
    question: "Among the Annang, the family compound formed by tracing common ancestry is called:",
    options: ["Awio", "Idung", "Ekpuk", "Ufok"],
    answer: "Ufok"
  },
  {
    question: "The January 1914 Amalgamation, which unified Northern and Southern Nigeria, was carried out by:",
    options: ["John Macpherson", "Oliver Lyttleton", "Flora Shaw", "Sir Frederick Lugard"],
    answer: "Sir Frederick Lugard"
  },
  {
    question: "The primary motivation behind both the 1906 and 1914 amalgamations was mainly:",
    options: ["Educational reform", "Military strategy", "Economic/administrative efficiency", "Religious unity"],
    answer: "Economic/administrative efficiency"
  },
  {
    question: "The name 'Nigeria,' derived from the Niger River, was suggested by:",
    options: ["Nnamdi Azikiwe", "Herbert Macaulay", "Lord Lugard", "Flora Shaw"],
    answer: "Flora Shaw"
  },
  {
    question: "Which constitution is recognized as the first genuine federal constitution in Nigeria since 1914?",
    options: ["Independence Constitution of 1960", "Richards Constitution of 1946", "Lyttleton Constitution of 1954", "Macpherson Constitution of 1951"],
    answer: "Lyttleton Constitution of 1954"
  },
  {
    question: "The 1979 Constitution replaced the parliamentary system with a:",
    options: ["Confederal system", "Monarchical system", "Military system", "Presidential system"],
    answer: "Presidential system"
  },
  {
    question: "The Universal Basic Education Programme (UBE) was introduced in Nigeria in:",
    options: ["1999", "1976", "1981", "1969"],
    answer: "1976"
  },
  {
    question: "The Structural Adjustment Programme (SAP), introduced in 1986, was mainly aimed at:",
    options: ["Strengthening regional government powers", "Increasing oil dependency", "Expanding the civil service", "Restructuring and diversifying the economy away from oil dependence"],
    answer: "Restructuring and diversifying the economy away from oil dependence"
  }
];
const MTH132 = [
  {
    question: "If f(x) = x² + 2x − 3, find f(1).",
    options: ["−2", "4", "0", "2"],
    answer: "0",
    explanation: "Substitute x = 1 into the function: f(1) = 1² + 2(1) − 3 = 1 + 2 − 3 = 0."
  },
  {
    question: "The domain of f(x) = 1/(x + 5) excludes which value?",
    options: ["x = 0", "x = −5", "x = 5", "x = 1"],
    answer: "x = −5",
    explanation: "The denominator cannot be zero. Solve x + 5 = 0 to get x = −5, so it is excluded from the domain."
  },
  {
    question: "If g(x) = 2x − 1 and h(x) = x + 3, find (g + h)(x).",
    options: ["3x + 2", "3x − 4", "x − 4", "2x + 2"],
    answer: "3x + 2",
    explanation: "Add the two functions: (2x − 1) + (x + 3) = 3x + 2."
  },
  {
    question: "Which function below is classified as an odd function?",
    options: ["f(x) = x²", "f(x) = x³", "f(x) = x + 1", "f(x) = cos(x)"],
    answer: "f(x) = x³",
    explanation: "A function is odd if f(−x) = −f(x). Since (−x)³ = −x³, x³ is an odd function."
  },
  {
    question: "Given f(x) = √(x), the range of f(x) for real x in its domain is:",
    options: ["All real numbers", "y ≥ 0", "y ≤ 0", "y ≠ 0"],
    answer: "y ≥ 0",
    explanation: "The square root of a real number is always non-negative, so the range is y ≥ 0."
  },
  {
    question: "Evaluate lim(x→3) (x² − 9)/(x − 3).",
    options: ["0", "3", "6", "9"],
    answer: "6",
    explanation: "Factor the numerator: (x²−9)=(x−3)(x+3). Cancel (x−3), then substitute x=3 to get 3+3=6."
  },
  {
    question: "A function f(x) is continuous at x = a when which condition holds?",
    options: [
      "f(a) is undefined",
      "lim(x→a) f(x) does not exist",
      "f(a) equals lim(x→a) f(x)",
      "f(x) has a jump at a"
    ],
    answer: "f(a) equals lim(x→a) f(x)",
    explanation: "A function is continuous when the limit exists and is equal to the function value at that point."
  },
  {
    question: "Evaluate lim(x→0) (tan x)/x.",
    options: ["0", "1", "−1", "∞"],
    answer: "1",
    explanation: "Since tan(x)=sin(x)/cos(x), and as x→0, sin(x)/x→1 while cos(x)→1, the limit equals 1."
  },
  {
    question: "Find the derivative of f(x) = 6x⁴.",
    options: ["24x³", "6x³", "24x⁴", "4x³"],
    answer: "24x³",
    explanation: "Using the power rule, d/dx(6x⁴)=6×4x³=24x³."
  },
  {
    question: "If y = 9 (a constant function), what is dy/dx?",
    options: ["9", "1", "0", "x"],
    answer: "0",
    explanation: "The derivative of a constant is always zero because it does not change."
  },
  {
    question: "Differentiate f(x) = cos(x).",
    options: ["sin(x)", "−sin(x)", "−cos(x)", "tan(x)"],
    answer: "−sin(x)",
    explanation: "The derivative of cos(x) is −sin(x)."
  },
  {
    question: "Differentiate f(x) = 5x³ − 4x² + 2.",
    options: ["15x² − 8x", "15x² − 4x", "5x² − 8x", "15x³ − 8x"],
    answer: "15x² − 8x",
    explanation: "Differentiate each term separately: 15x² − 8x + 0 = 15x² − 8x."
  },
  {
    question: "Evaluate ∫x³ dx.",
    options: ["x⁴ + C", "x⁴/4 + C", "3x² + C", "x²/2 + C"],
    answer: "x⁴/4 + C",
    explanation: "Apply the integration power rule: ∫xⁿdx = xⁿ⁺¹/(n+1)+C. Therefore ∫x³dx = x⁴/4 + C."
  },
    {
    question: "Evaluate ∫7 dx.",
    options: ["7", "7x + C", "x + C", "0 + C"],
    answer: "7x + C",
    explanation: "The integral of a constant k is kx + C. Therefore, ∫7 dx = 7x + C."
  },
  {
    question: "Evaluate the definite integral ∫₁³ x dx.",
    options: ["2", "8", "4", "6"],
    answer: "4",
    explanation: "First integrate: ∫x dx = x²/2. Evaluate from 1 to 3: (9/2) − (1/2) = 8/2 = 4."
  },
  {
    question: "Find the equation of a line with slope 3 passing through (0, −2).",
    options: ["y = 3x − 2", "y = −2x + 3", "y = 3x + 2", "y = −3x − 2"],
    answer: "y = 3x − 2",
    explanation: "Use y = mx + c. Since the slope is 3 and the point (0, −2) is the y-intercept, c = −2."
  },
  {
    question: "Determine the equation of a circle centered at the origin with radius 7.",
    options: ["x² + y² = 7", "x² + y² = 49", "x + y = 49", "x² − y² = 49"],
    answer: "x² + y² = 49",
    explanation: "The standard equation of a circle is x² + y² = r². Since r = 7, r² = 49."
  },
  {
    question: "Evaluate lim(x→4) (x² − 16)/(x − 4).",
    options: ["4", "0", "16", "8"],
    answer: "8",
    explanation: "Factor x² − 16 = (x − 4)(x + 4). Cancel (x − 4), then substitute x = 4 to obtain 8."
  },
  {
    question: "Solve for x where f(x) = x² − 5x + 6 equals zero.",
    options: ["x = 2, 3", "x = 1, 6", "x = −2, −3", "x = 2, −3"],
    answer: "x = 2, 3",
    explanation: "Factor x² − 5x + 6 = (x − 2)(x − 3). Setting each factor to zero gives x = 2 or x = 3."
  },
  {
    question: "A function is decreasing on an interval when which condition is true?",
    options: ["f'(x) > 0", "f''(x) > 0", "f'(x) < 0", "f'(x) = 0"],
    answer: "f'(x) < 0",
    explanation: "A negative first derivative means the function is decreasing on that interval."
  },
  {
    question: "Given f(x) = x³ − 6x² + 9, find f'(x).",
    options: ["x² − 12x", "3x² − 12x", "3x² − 6x", "3x² − 6x + 9"],
    answer: "3x² − 12x",
    explanation: "Differentiate term by term: d/dx(x³)=3x², d/dx(−6x²)=−12x, and the derivative of 9 is 0."
  },
  {
    question: "Using f'(x) = 3x² − 12x, find the critical points.",
    options: ["x = 0, 3", "x = 0, 4", "x = 2, 4", "x = 1, 3"],
    answer: "x = 0, 4",
    explanation: "Set the derivative equal to zero: 3x² − 12x = 0 = 3x(x − 4). Therefore, x = 0 or x = 4."
  },
  {
    question: "The second derivative test helps determine the nature of a critical point by examining:",
    options: [
      "The original function's value at that point",
      "Whether the function is continuous there",
      "The sign of f''(x) at that point",
      "The domain of the function"
    ],
    answer: "The sign of f''(x) at that point",
    explanation: "If f''(x) > 0, the point is a local minimum; if f''(x) < 0, it is a local maximum."
  },
  {
    question: "If f''(x) < 0 at a critical point, that point represents a:",
    options: ["Local minimum", "Point of discontinuity", "Local maximum", "Vertical asymptote"],
    answer: "Local maximum",
    explanation: "A negative second derivative indicates the graph is concave downward, so the critical point is a local maximum."
  },
  {
    question: "Evaluate ∫(4x³ + 3x²) dx.",
    options: ["x⁴ + x³ + C", "4x⁴ + 3x³ + C", "x⁴ + 3x³ + C", "12x² + 6x + C"],
    answer: "x⁴ + x³ + C",
    explanation: "Integrate each term separately: ∫4x³dx = x⁴ and ∫3x²dx = x³. Therefore, the result is x⁴ + x³ + C."
  },
    {
    question: "Evaluate ∫₀² 3x² dx.",
    options: ["6", "12", "8", "9"],
    answer: "8",
    explanation: "Integrate 3x² to obtain x³. Evaluate from 0 to 2: 2³ − 0³ = 8."
  },
  {
    question: "The area enclosed under a curve y = f(x), where f(x) ≥ 0, between x = a and x = b is computed as:",
    options: [
      "f(b) minus f(a)",
      "The definite integral of f(x) from a to b",
      "f'(b) minus f'(a)",
      "The product f(a) times f(b)"
    ],
    answer: "The definite integral of f(x) from a to b",
    explanation: "The area under a non-negative curve between two points is given by the definite integral ∫ₐᵇ f(x) dx."
  },
  {
    question: "The chain rule applies specifically when differentiating which kind of function?",
    options: [
      "Constant functions",
      "Sums of simple polynomials",
      "Composite functions",
      "Linear functions only"
    ],
    answer: "Composite functions",
    explanation: "The chain rule is used when one function is inside another, such as (2x − 3)⁵ or cos(3x)."
  },
  {
    question: "Differentiate y = (2x − 3)⁵ using the chain rule.",
    options: [
      "5(2x − 3)⁴",
      "10(2x − 3)⁴",
      "2(2x − 3)⁴",
      "5(2x)⁴"
    ],
    answer: "10(2x − 3)⁴",
    explanation: "Differentiate the outer function first, then multiply by the derivative of the inner function: 5(2x − 3)⁴ × 2 = 10(2x − 3)⁴."
  },
  {
    question: "Find dy/dx for y = cos(3x).",
    options: [
      "−3sin(3x)",
      "3cos(3x)",
      "−sin(3x)",
      "3sin(3x)"
    ],
    answer: "−3sin(3x)",
    explanation: "Apply the chain rule. The derivative of cos(u) is −sin(u), then multiply by u' = 3."
  },
  {
    question: "A point of inflection occurs on a curve where which condition is satisfied?",
    options: [
      "f'(x) equals zero only",
      "f''(x) equals zero and concavity changes",
      "The function equals zero",
      "The function is undefined there"
    ],
    answer: "f''(x) equals zero and concavity changes",
    explanation: "An inflection point occurs where the graph changes concavity, usually where the second derivative is zero and changes sign."
  },
  {
    question: "The slope of a tangent line to y = f(x) at a specific point x = a is given by:",
    options: [
      "The value f(a) itself",
      "The derivative f'(a)",
      "The integral of f(x) up to a",
      "The second derivative f''(a)"
    ],
    answer: "The derivative f'(a)",
    explanation: "The derivative evaluated at a point gives the slope of the tangent line at that point."
  },
  {
    question: "For f(x) = 1/x, as x approaches 0 from the left, f(x) approaches:",
    options: [
      "Positive infinity",
      "Zero",
      "Negative infinity",
      "One"
    ],
    answer: "Negative infinity",
    explanation: "As x approaches 0 through negative values, 1/x becomes a very large negative number."
  },
  {
    question: "A rectangular garden's perimeter is fixed at 40 m. To find dimensions that maximize area using calculus, the correct approach is to:",
    options: [
      "Differentiate the perimeter formula directly",
      "Integrate the perimeter formula",
      "Express area as a function of one variable and set its derivative equal to zero",
      "Find the second derivative of the perimeter formula"
    ],
    answer: "Express area as a function of one variable and set its derivative equal to zero",
    explanation: "Use the perimeter to write the area in terms of one variable, then differentiate and solve A'(x) = 0."
  },
  {
    question: "The volume generated when y = f(x) is rotated about the x-axis between x = a and x = b is found using:",
    options: [
      "The integral of f(x) from a to b",
      "π times the integral of f'(x) from a to b",
      "2π times the integral of f(x) from a to b",
      "π times the integral of [f(x)]² from a to b"
    ],
    answer: "π times the integral of [f(x)]² from a to b",
    explanation: "The disc method gives V = π∫ₐᵇ[f(x)]²dx."
  },
  {
    question: "Consider f(x) = (x² − 4)/(x − 2). At x = 2, this function exhibits:",
    options: [
      "A vertical asymptote",
      "A removable discontinuity",
      "Full continuity with no issues",
      "An undefined limit that does not exist"
    ],
    answer: "A removable discontinuity",
    explanation: "Factor to get (x − 2)(x + 2)/(x − 2) = x + 2 for x ≠ 2. The limit exists, but the function is undefined at x = 2."
  },
  {
    question: "For a function to be differentiable at a point, it must first satisfy which necessary condition?",
    options: [
      "It must be discontinuous there",
      "It must be continuous there",
      "Its value must equal zero",
      "Its derivative must already be known"
    ],
    answer: "It must be continuous there",
    explanation: "Differentiability always requires continuity, although a continuous function may still fail to be differentiable."
  },
  {
    question: "Evaluate lim(x→∞) (5x² − 3x)/(2x² + 1).",
    options: [
      "0",
      "1",
      "5/2",
      "Infinity"
    ],
    answer: "5/2",
    explanation: "Divide the numerator and denominator by x². The remaining limit is (5 − 0)/(2 + 0) = 5/2."
  },
    {
    question: "A parabola with vertex at the origin, opening upward, has its focus at (0, 3). Its equation is:",
    options: [
      "y² = 12x",
      "x² = 12y",
      "x² = −12y",
      "y² = −12x"
    ],
    answer: "x² = 12y",
    explanation: "For a parabola opening upward, the standard form is x² = 4py. Since the focus is (0, 3), p = 3, so x² = 12y."
  },
  {
    question: "The eccentricity of a circle is always equal to:",
    options: [
      "One",
      "A value between zero and one",
      "Zero",
      "Greater than one"
    ],
    answer: "Zero",
    explanation: "A circle is a special case of an ellipse with both foci at the center, giving an eccentricity of 0."
  },
  {
    question: "A student integrates ∫(1/x) dx by applying the power rule, getting an exponent of zero in the denominator. Why is this approach invalid?",
    options: [
      "The power rule works perfectly fine for this case",
      "The result should always be x²",
      "Division by zero occurs since the exponent becomes zero, and the correct integral is ln|x| + C",
      "There is no issue at all with this method"
    ],
    answer: "Division by zero occurs since the exponent becomes zero, and the correct integral is ln|x| + C",
    explanation: "Since 1/x = x⁻¹, the power rule would require division by zero. This is a special case whose integral is ln|x| + C."
  },
  {
    question: "Find the maximum value of f(x) = −x² + 6x − 5 using differentiation.",
    options: [
      "5",
      "4",
      "9",
      "1"
    ],
    answer: "4",
    explanation: "Differentiate to get f'(x) = −2x + 6. Setting it to zero gives x = 3. Since f''(x) = −2 < 0, this is a maximum. f(3) = 4."
  },
  {
    question: "Using the quotient rule, differentiate y = (x + 2)/x.",
    options: [
      "1/x²",
      "−2/x²",
      "2/x²",
      "−1/x²"
    ],
    answer: "−2/x²",
    explanation: "Apply the quotient rule: [(1)(x) − (x + 2)(1)]/x² = (x − x − 2)/x² = −2/x²."
  },
  {
    question: "Evaluate ∫₀^(π/2) cos(x) dx.",
    options: [
      "0",
      "−1",
      "2",
      "1"
    ],
    answer: "1",
    explanation: "The integral of cos(x) is sin(x). Evaluate from 0 to π/2: sin(π/2) − sin(0) = 1 − 0 = 1."
  },
  {
    question: "A particle's position is given by s(t) = t³ − 9t² + 24t. Its velocity equals zero when:",
    options: [
      "t = 0, 6",
      "t = 2, 4",
      "t = 1, 5",
      "t = 3, 6"
    ],
    answer: "t = 2, 4",
    explanation: "Velocity is the derivative of position: v(t) = 3t² − 18t + 24 = 3(t − 2)(t − 4). Thus, v(t) = 0 when t = 2 or 4."
  },
  {
    question: "For the particle above, the acceleration function a(t) is:",
    options: [
      "3t² − 18t + 24",
      "6t − 18",
      "t² − 9t",
      "6t² − 18t"
    ],
    answer: "6t − 18",
    explanation: "Acceleration is the derivative of velocity. Differentiate 3t² − 18t + 24 to obtain 6t − 18."
  },
  {
    question: "The general equation Ax² + By² + Cx + Dy + E = 0 represents a hyperbola when:",
    options: [
      "A equals B exactly",
      "A and B share the same sign",
      "A and B have opposite signs",
      "Either A or B equals zero"
    ],
    answer: "A and B have opposite signs",
    explanation: "A hyperbola is formed when the coefficients of x² and y² have opposite signs."
  },
  {
    question: "A student claims that every continuous function must also be differentiable everywhere. Which example best disproves this claim?",
    options: [
      "f(x) = x²",
      "f(x) = |x|",
      "f(x) = sin(x)",
      "f(x) = eˣ"
    ],
    answer: "f(x) = |x|",
    explanation: "The absolute value function is continuous everywhere but is not differentiable at x = 0 because it has a sharp corner."
  },
  {
    question: "The area between two curves f(x) and g(x), where f(x) ≥ g(x), from x = a to x = b, is calculated as:",
    options: [
      "The integral of f(x) + g(x) from a to b",
      "The integral of f(x) − g(x) from a to b",
      "The difference f(b) − g(a)",
      "The integral of f(x) × g(x) from a to b"
    ],
    answer: "The integral of f(x) − g(x) from a to b",
    explanation: "The area between two curves is obtained by integrating the upper function minus the lower function over the interval."
  },
  {
    question: "Evaluate lim(x→0) (1 − cos x)/x².",
    options: [
      "0",
      "1",
      "1/2",
      "Infinity"
    ],
    answer: "1/2",
    explanation: "Using the identity 1 − cos(x) = 2sin²(x/2) together with the standard limit sin(u)/u → 1, the limit evaluates to 1/2."
  }
];
const PHY102 = [
  {
    question: "Two charges of +2 μC and +8 μC are placed 0.4 m apart in air. Calculate the force between them. (k = 9 × 10⁹ Nm²/C²)",
    options: ["0.45 N", "0.90 N", "1.35 N", "0.18 N"],
    answer: "0.90 N",
    explanation: "Apply Coulomb's law: F = kq₁q₂/r² = (9×10⁹ × 2×10⁻⁶ × 8×10⁻⁶)/(0.4²) = 0.90 N."
  },
  {
    question: "An isolated point charge produces an electric field that, as distance from the charge increases, will:",
    options: [
      "Increase proportionally with distance",
      "Remain constant regardless of distance",
      "Decrease with the square of the distance",
      "Decrease linearly with distance"
    ],
    answer: "Decrease with the square of the distance",
    explanation: "The electric field due to a point charge is E = kq/r², so it decreases as the inverse square of the distance."
  },
  {
    question: "Calculate the electric field at a point 0.5 m from a charge of 8 μC. (k = 9 × 10⁹ Nm²/C²)",
    options: [
      "1.44 × 10⁵ N/C",
      "2.88 × 10⁵ N/C",
      "1.44 × 10⁶ N/C",
      "2.88 × 10⁴ N/C"
    ],
    answer: "2.88 × 10⁵ N/C",
    explanation: "E = kq/r² = (9×10⁹ × 8×10⁻⁶)/(0.5²) = 2.88 × 10⁵ N/C."
  },
  {
    question: "The electric potential at a point in space due to a positive charge, as you move infinitely far away, approaches:",
    options: [
      "A very large positive value",
      "A very large negative value",
      "Zero",
      "The value of the charge itself"
    ],
    answer: "Zero",
    explanation: "By convention, the electric potential due to a point charge is taken as zero at infinity."
  },
  {
    question: "Two charges of +5 μC and +2 μC are separated by 0.3 m. Calculate the potential energy of the system. (k = 9 × 10⁹ Nm²/C²)",
    options: [
      "0.20 J",
      "0.30 J",
      "0.45 J",
      "0.60 J"
    ],
    answer: "0.30 J",
    explanation: "U = kq₁q₂/r = (9×10⁹ × 5×10⁻⁶ × 2×10⁻⁶)/0.3 = 0.30 J."
  },
  {
    question: "Why is work done in moving a charge between two points on the same equipotential surface always zero?",
    options: [
      "Because no charge can move along an equipotential surface",
      "Because there is no potential difference between any two points on the same equipotential surface",
      "Because equipotential surfaces only exist near conductors",
      "Because the electric field is infinite on such surfaces"
    ],
    answer: "Because there is no potential difference between any two points on the same equipotential surface",
    explanation: "Work done is W = qΔV. Since ΔV = 0 on an equipotential surface, no work is done."
  },
  {
    question: "Calculate the potential difference between two points if 24 J of work is required to move a 6 C charge between them.",
    options: [
      "4 V",
      "6 V",
      "144 V",
      "0.25 V"
    ],
    answer: "4 V",
    explanation: "Use V = W/Q = 24/6 = 4 V."
  },
  {
    question: "Gauss's law states that the total electric flux through a closed surface depends on:",
    options: [
      "The shape and size of the surface only",
      "The distance of the surface from the nearest charge",
      "The net charge enclosed within that surface",
      "The material the surface is made of"
    ],
    answer: "The net charge enclosed within that surface",
    explanation: "Gauss's law states Φ = Q/ε₀, so the total electric flux depends only on the net enclosed charge."
  },
  {
    question: "A closed surface encloses a net charge of 12 μC. Calculate the total electric flux through it. (ε₀ = 8.85 × 10⁻¹² C²/Nm²)",
    options: [
      "1.36 × 10⁶ Nm²/C",
      "1.36 × 10⁵ Nm²/C",
      "9.42 × 10⁵ Nm²/C",
      "9.42 × 10⁶ Nm²/C"
    ],
    answer: "1.36 × 10⁶ Nm²/C",
    explanation: "Φ = Q/ε₀ = (12×10⁻⁶)/(8.85×10⁻¹²) ≈ 1.36 × 10⁶ Nm²/C."
  },
  {
    question: "Gauss's law is especially useful for calculating fields around which type of charge arrangement?",
    options: [
      "Completely irregular and asymmetric distributions",
      "Highly symmetric distributions, such as spheres, cylinders, or infinite planes",
      "Distributions with no net enclosed charge at all",
      "Moving charges only, never static ones"
    ],
    answer: "Highly symmetric distributions, such as spheres, cylinders, or infinite planes",
    explanation: "Gauss's law greatly simplifies electric field calculations when the charge distribution has high symmetry."
  },
  {
    question: "A parallel plate capacitor has plates of area 0.05 m² separated by 0.002 m. Calculate its capacitance. (ε₀ = 8.85 × 10⁻¹² F/m)",
    options: [
      "2.21 × 10⁻¹⁰ F",
      "4.43 × 10⁻¹⁰ F",
      "2.21 × 10⁻¹¹ F",
      "4.43 × 10⁻¹¹ F"
    ],
    answer: "2.21 × 10⁻¹⁰ F",
    explanation: "C = ε₀A/d = (8.85×10⁻¹² × 0.05)/0.002 = 2.21 × 10⁻¹⁰ F."
  },
  {
    question: "Three capacitors of 4 μF, 6 μF, and 12 μF are connected in series. Calculate the total capacitance.",
    options: [
      "22 μF",
      "2 μF",
      "0.5 μF",
      "1 μF"
    ],
    answer: "2 μF",
    explanation: "For capacitors in series: 1/C = 1/4 + 1/6 + 1/12 = 1/2, therefore C = 2 μF."
  },
  {
    question: "The same three capacitors (4 μF, 6 μF, 12 μF) are now connected in parallel. Find the total capacitance.",
    options: [
      "2 μF",
      "12 μF",
      "22 μF",
      "0.5 μF"
    ],
    answer: "22 μF",
    explanation: "For capacitors in parallel, capacitances add directly: 4 + 6 + 12 = 22 μF."
  },
  {
    question: "A capacitor stores 6 × 10⁻⁴ C of charge at a potential difference of 150 V. Calculate the energy stored.",
    options: [
      "0.045 J",
      "0.09 J",
      "0.03 J",
      "0.06 J"
    ],
    answer: "0.045 J",
    explanation: "Use U = ½QV = ½ × 6×10⁻⁴ × 150 = 0.045 J."
  },
  {
    question: "Why does reducing the distance between capacitor plates increase capacitance?",
    options: [
      "Because charge automatically decreases as plates get closer",
      "Because a smaller gap allows the same voltage to support a stronger field, enabling more charge storage for a given voltage",
      "Because the plate material changes when separation decreases",
      "Because capacitance is unrelated to plate separation"
    ],
    answer: "Because a smaller gap allows the same voltage to support a stronger field, enabling more charge storage for a given voltage",
    explanation: "Since C = ε₀A/d, reducing the separation (d) increases the capacitance."
  },
  {
    question: "Inserting a dielectric between capacitor plates primarily achieves which effect?",
    options: [
      "Decreases the capacitance and reduces stored charge",
      "Increases the capacitance by reducing the net electric field for a given charge",
      "Has no measurable effect on capacitance",
      "Converts the capacitor into a resistor"
    ],
    answer: "Increases the capacitance by reducing the net electric field for a given charge",
    explanation: "A dielectric polarizes, reducing the effective electric field and increasing the capacitance."
  },
  {
    question: "A capacitor with air as dielectric has a capacitance of 8 μF. After inserting a dielectric of constant 3, find the new capacitance.",
    options: [
      "2.67 μF",
      "11 μF",
      "24 μF",
      "8 μF"
    ],
    answer: "24 μF",
    explanation: "C' = KC = 3 × 8 = 24 μF."
  },
  {
    question: "Which property would make a material a poor choice as a capacitor dielectric?",
    options: [
      "High dielectric strength",
      "Low electrical conductivity",
      "High electrical conductivity, allowing current to flow between plates",
      "High polarizability"
    ],
    answer: "High electrical conductivity, allowing current to flow between plates",
    explanation: "A dielectric should be an insulator. High conductivity would allow current to leak between the plates."
  },
  {
    question: "A current of 3 A flows through a wire for 4 minutes. Calculate the total charge transferred.",
    options: [
      "12 C",
      "180 C",
      "720 C",
      "240 C"
    ],
    answer: "720 C",
    explanation: "Q = It = 3 × (4 × 60) = 3 × 240 = 720 C."
  },
  {
    question: "According to Ohm's law, if resistance is doubled while voltage stays constant, current will:",
    options: [
      "Double",
      "Remain unchanged",
      "Halve",
      "Quadruple"
    ],
    answer: "Halve",
    explanation: "Ohm's law states I = V/R. If resistance doubles while voltage remains constant, current becomes half."
  },
  {
    question: "Calculate the resistance of a conductor carrying 0.8 A when 16 V is applied across it.",
    options: [
      "12.8 Ω",
      "20 Ω",
      "0.05 Ω",
      "16 Ω"
    ],
    answer: "20 Ω",
    explanation: "R = V/I = 16/0.8 = 20 Ω."
  },
  {
    question: "Three resistors of 6 Ω, 3 Ω, and 2 Ω are connected in parallel. Calculate the total resistance.",
    options: [
      "11 Ω",
      "0.5 Ω",
      "2 Ω",
      "1 Ω"
    ],
    answer: "1 Ω",
    explanation: "1/R = 1/6 + 1/3 + 1/2 = 1, therefore R = 1 Ω."
  },
  {
    question: "In a parallel circuit, why does the voltage remain the same across every branch?",
    options: [
      "Because each branch carries identical current regardless of resistance",
      "Because each branch connects directly across the same two common nodes of the source",
      "Because resistance is always equal in parallel branches",
      "Because parallel circuits cannot have different resistor values"
    ],
    answer: "Because each branch connects directly across the same two common nodes of the source",
    explanation: "All branches share the same two terminals of the power supply, so they all have the same potential difference."
  },
  {
    question: "A battery of EMF 10 V with internal resistance 0.4 Ω drives current through an external resistor of 4.6 Ω. Calculate the current.",
    options: [
      "2.5 A",
      "2.0 A",
      "25 A",
      "1.8 A"
    ],
    answer: "2.0 A",
    explanation: "I = E/(R + r) = 10/(4.6 + 0.4) = 10/5 = 2.0 A."
  },
  {
    question: "Kirchhoff's Current Law is fundamentally based on which conservation principle?",
    options: [
      "Conservation of energy",
      "Conservation of momentum",
      "Conservation of electric charge",
      "Conservation of mass only"
    ],
    answer: "Conservation of electric charge",
    explanation: "KCL states that the total current entering a junction equals the total current leaving it because charge is conserved."
  },
  {
    question: "Kirchhoff's Voltage Law states that around any closed loop:",
    options: [
      "The total resistance must equal zero",
      "The algebraic sum of EMFs equals the algebraic sum of voltage drops",
      "Current must always be zero",
      "Power dissipated must be at a maximum"
    ],
    answer: "The algebraic sum of EMFs equals the algebraic sum of voltage drops",
    explanation: "Kirchhoff's Voltage Law is based on conservation of energy. The total voltage supplied equals the total voltage dropped in any closed loop."
  },
  {
    question: "Calculate the power dissipated in a 15 Ω resistor carrying a current of 2 A.",
    options: [
      "30 W",
      "60 W",
      "7.5 W",
      "450 W"
    ],
    answer: "60 W",
    explanation: "P = I²R = (2)² × 15 = 4 × 15 = 60 W."
  },
  {
    question: "Why are appliances in a home typically wired in parallel rather than in series?",
    options: [
      "Because parallel wiring allows each device to function independently of others",
      "Because series wiring always provides more total voltage to each device",
      "Because parallel circuits use less total wiring material",
      "Because series circuits cannot carry any current at all"
    ],
    answer: "Because parallel wiring allows each device to function independently of others",
    explanation: "In a parallel circuit, each appliance receives the full supply voltage and can operate independently."
  },
  {
    question: "A wire's length is tripled while its volume is kept constant. By what factor does its resistance change?",
    options: [
      "3 times",
      "9 times",
      "1/3 of the original",
      "1/9 of the original"
    ],
    answer: "9 times",
    explanation: "Since volume is constant, R = ρL²/V. Tripling the length increases the resistance by 3² = 9."
  },
  {
    question: "The magnetic field pattern surrounding a long straight current-carrying wire forms:",
    options: [
      "Straight lines running parallel to the wire",
      "Concentric circles centered on the wire",
      "A field pointing only in one fixed direction everywhere",
      "Radial lines pointing directly away from the wire"
    ],
    answer: "Concentric circles centered on the wire",
    explanation: "Using the right-hand grip rule, the magnetic field lines around a straight current-carrying conductor are concentric circles."
  },
  {
    question: "A charge of 4 × 10⁻⁶ C moves at 2 × 10⁵ m/s perpendicular to a magnetic field of 0.5 T. Calculate the magnetic force on it.",
    options: [
      "0.4 N",
      "0.2 N",
      "4.0 N",
      "0.04 N"
    ],
    answer: "0.4 N",
    explanation: "F = qvB = (4×10⁻⁶)(2×10⁵)(0.5) = 0.4 N."
  },
  {
    question: "The direction of force on a positive charge moving through a magnetic field is determined by:",
    options: [
      "Kirchhoff's Voltage Law",
      "The right-hand rule applied to F = qv × B",
      "Ohm's Law",
      "The conservation of energy principle"
    ],
    answer: "The right-hand rule applied to F = qv × B",
    explanation: "The right-hand rule gives the direction of the magnetic force acting on a positive moving charge."
  },
  {
    question: "A 0.4 m conductor carrying 5 A is placed perpendicular to a magnetic field of 0.25 T. Calculate the force on the conductor.",
    options: [
      "0.5 N",
      "1.0 N",
      "0.05 N",
      "5.0 N"
    ],
    answer: "0.5 N",
    explanation: "F = BIL = 0.25 × 5 × 0.4 = 0.5 N."
  },
  {
    question: "A current-carrying loop placed in a uniform magnetic field experiences a torque rather than a net translational force because:",
    options: [
      "The forces on opposite sides are equal and opposite but act at different points, producing rotation",
      "Magnetic fields cannot exert any force on current loops",
      "The loop carries no current",
      "Torque and force are identical quantities"
    ],
    answer: "The forces on opposite sides are equal and opposite but act at different points, producing rotation",
    explanation: "Equal and opposite forces form a couple, creating torque that rotates the loop instead of moving it."
  },
  {
    question: "According to the Biot-Savart law, the magnetic field due to a small current element is proportional to:",
    options: [
      "The square of the distance only",
      "The current and length of the element, and inversely proportional to the square of the distance",
      "The resistance of the conductor",
      "The applied voltage"
    ],
    answer: "The current and length of the element, and inversely proportional to the square of the distance",
    explanation: "The Biot-Savart law states that dB is directly proportional to I and dL, and inversely proportional to r²."
  },
  {
    question: "Faraday's Law of electromagnetic induction states that an EMF is induced in a circuit whenever:",
    options: [
      "The magnetic flux remains constant",
      "There is a change in the magnetic flux linked with the circuit",
      "The circuit resistance changes",
      "A static magnetic field exists"
    ],
    answer: "There is a change in the magnetic flux linked with the circuit",
    explanation: "Faraday's law states that a changing magnetic flux induces an electromotive force (EMF)."
  },
  {
    question: "A coil of 150 turns experiences a flux change from 0.01 Wb to 0.06 Wb in 0.25 s. Calculate the induced EMF.",
    options: [
      "20 V",
      "30 V",
      "15 V",
      "7.5 V"
    ],
    answer: "30 V",
    explanation: "EMF = N(ΔΦ/Δt) = 150 × (0.05/0.25) = 150 × 0.2 = 30 V."
  },
  {
    question: "Lenz's Law, governing the direction of induced current, is essentially a statement of:",
    options: [
      "Conservation of charge",
      "Conservation of energy",
      "Newton's Third Law",
      "Conservation of magnetic flux"
    ],
    answer: "Conservation of energy",
    explanation: "Lenz's Law states that the induced current opposes the change producing it, ensuring conservation of energy."
  },
  {
    question: "As a bar magnet's south pole approaches a coil from above, the induced current will flow in a direction such that the coil:",
    options: [
      "Attracts the approaching magnet, pulling it in faster",
      "Repels the approaching south pole, opposing its motion into the coil",
      "Produces no magnetic effect on the magnet",
      "Instantly reverses the magnet's polarity"
    ],
    answer: "Repels the approaching south pole, opposing its motion into the coil",
    explanation: "According to Lenz's Law, the induced current opposes the change in magnetic flux, so the coil repels the approaching south pole."
  },
  {
    question: "A straight 1.2 m conductor moves at 4 m/s perpendicular to a magnetic field of 0.3 T. Calculate the induced EMF.",
    options: [
      "1.44 V",
      "0.36 V",
      "14.4 V",
      "3.6 V"
    ],
    answer: "1.44 V",
    explanation: "EMF = BLv = 0.3 × 1.2 × 4 = 1.44 V."
  },
  {
    question: "A transformer has 150 turns on the primary and 600 turns on the secondary. If the primary voltage is 100 V, calculate the secondary voltage.",
    options: [
      "25 V",
      "400 V",
      "200 V",
      "600 V"
    ],
    answer: "400 V",
    explanation: "Vs/Vp = Ns/Np. Therefore, Vs = 100 × (600/150) = 400 V."
  },
  {
    question: "In an ideal step-down transformer, as the voltage decreases from primary to secondary, the current:",
    options: [
      "Decreases proportionally",
      "Increases proportionally",
      "Remains the same",
      "Drops to zero"
    ],
    answer: "Increases proportionally",
    explanation: "In an ideal transformer, power is conserved. If voltage decreases, current increases proportionally."
  },
  {
    question: "Eddy currents in a transformer's iron core cause energy losses mainly through:",
    options: [
      "Increased magnetic flux leakage",
      "Resistive (Joule) heating within the core",
      "A permanent increase in output voltage",
      "A reduction in the number of secondary turns"
    ],
    answer: "Resistive (Joule) heating within the core",
    explanation: "Eddy currents circulate in the iron core and produce heat due to the electrical resistance of the core material."
  },
  {
    question: "Transformer cores are laminated primarily to:",
    options: [
      "Increase the transformer's mass",
      "Reduce eddy current losses",
      "Increase magnetic flux leakage",
      "Have no effect on efficiency"
    ],
    answer: "Reduce eddy current losses",
    explanation: "Laminations increase the resistance to eddy current flow, thereby reducing energy loss as heat."
  },
  {
    question: "Self-inductance is the property by which a coil:",
    options: [
      "Induces an EMF in another nearby coil",
      "Opposes a change in its own current by inducing an EMF within itself",
      "Maintains constant current regardless of voltage",
      "Has zero internal resistance"
    ],
    answer: "Opposes a change in its own current by inducing an EMF within itself",
    explanation: "Self-inductance causes a back EMF that opposes any change in the current flowing through the same coil."
  },
  {
    question: "A coil with self-inductance 0.4 H has a current changing at 8 A/s. Calculate the induced EMF.",
    options: [
      "0.05 V",
      "3.2 V",
      "2.0 V",
      "32 V"
    ],
    answer: "3.2 V",
    explanation: "EMF = L(dI/dt) = 0.4 × 8 = 3.2 V."
  },
  {
    question: "Mutual inductance between two coils depends on all of the following EXCEPT:",
    options: [
      "The number of turns in each coil",
      "The relative distance and orientation of the coils",
      "The permeability of the core material",
      "The color of the wire insulation"
    ],
    answer: "The color of the wire insulation",
    explanation: "Mutual inductance depends on magnetic and geometric factors, not the colour of the wire insulation."
  },
  {
    question: "According to Maxwell's equations, a time-varying electric field generates:",
    options: [
      "A purely static magnetic field",
      "A changing magnetic field",
      "No magnetic field",
      "Only a direct current"
    ],
    answer: "A changing magnetic field",
    explanation: "Maxwell showed that a changing electric field produces a changing magnetic field, enabling electromagnetic waves."
  },
  {
    question: "An AC source has an RMS voltage of 110 V. Calculate the peak voltage.",
    options: [
      "77.8 V",
      "155.6 V",
      "110 V",
      "220 V"
    ],
    answer: "155.6 V",
    explanation: "Vₚ = Vᵣₘₛ × √2 = 110 × 1.414 ≈ 155.6 V."
  },
  {
    question: "In a purely inductive AC circuit, the current relative to the voltage:",
    options: [
      "Leads the voltage by 90°",
      "Lags the voltage by 90°",
      "Is in phase with the voltage",
      "Lags the voltage by 180°"
    ],
    answer: "Lags the voltage by 90°",
    explanation: "In a pure inductive circuit, the current reaches its maximum one-quarter cycle after the voltage, meaning it lags by 90°."
  }
];
const CSC122 = [
{
question: "Data processing is most accurately defined as:",
options: [
"The physical assembly of computer hardware",
"The random storage of unrelated facts",
"The transformation of raw facts into a useful, organized form",
"The permanent deletion of unwanted files"
],
answer: 2,
working: "Data processing involves systematically transforming raw, unorganized data into meaningful, usable information through structured operations."
},
{
question: "Which statement best distinguishes data from information?",
options: [
"Data are unprocessed facts; information is data given meaning through processing",
"Data and information mean exactly the same thing",
"Information always exists before any data is collected",
"Data can only be alphabetic, while information can be numeric"
],
answer: 0,
working: "Data are raw, unorganized inputs; information results once that data has been processed and contextualized to be meaningful."
},
{
question: "Which of these is NOT generally considered a property of good quality data?",
options: [
"Accuracy",
"Relevance",
"Completeness",
"Vagueness"
],
answer: 3,
working: "Vagueness undermines usability; quality data should instead be clear, accurate, relevant, and complete."
},
{
question: "The 'source of data' refers to:",
options: [
"The final printed report after processing",
"The origin point from which raw facts are gathered, such as forms or sensors",
"The software used to format output",
"The storage device holding the processed file"
],
answer: 1,
working: "The source of data is wherever the raw information originates before any processing takes place."
},
{
question: "Which is an example of a primary data source?",
options: [
"A questionnaire filled out directly by respondents",
"A textbook summarizing earlier studies",
"A government bulletin reporting other researchers' work",
"A Wikipedia article on the topic"
],
answer: 0,
working: "Primary sources involve direct, first-hand collection of data, unlike secondary sources that report on already-processed findings."
},
{
question: "The data collection method involving direct watching of subjects without interference is known as:",
options: [
"The interview method",
"The questionnaire method",
"The observation method",
"The documentary method"
],
answer: 2,
working: "Observation involves the researcher watching and recording behavior directly, without actively questioning subjects."
},
{
question: "The data processing stage where raw facts are first gathered is called:",
options: [
"Output",
"Storage",
"Distribution",
"Origination"
],
answer: 3,
working: "Origination is the first stage of the cycle, where raw data is initially collected before any preparation occurs."
},
{
question: "Input preparation within the data processing cycle mainly involves:",
options: [
"Sending the final report to end users",
"Converting collected raw data into a form a computer can process",
"Permanently erasing duplicate records",
"Physically assembling computer components"
],
answer: 1,
working: "Input preparation converts raw collected data into a structured, machine-readable format suitable for processing."
},
{
question: "The final stage in a typical data processing cycle, where processed results reach intended users, is:",
options: [
"Output/distribution",
"Processing",
"Storage",
"Origination"
],
answer: 0,
working: "Output/distribution is the last stage, where finished, processed information is delivered to those who need it."
},
{
question: "Which data processing method relies almost entirely on human effort with little or no machine assistance?",
options: [
"The electronic method",
"The automatic method",
"The manual method",
"The mechanical method"
],
answer: 2,
working: "The manual method depends on human labor with simple tools, with no calculators or computers involved."
},
{
question: "The mechanical method of data processing is best characterized by:",
options: [
"Relying solely on pen-and-paper human computation",
"Fully autonomous computer-driven processing",
"Cloud-based processing accessible online",
"The use of simple mechanical devices, such as calculators, to assist processing"
],
answer: 3,
working: "The mechanical method introduces simple machines to support human effort, without full computerization."
},
{
question: "Which method uses computers to achieve high-speed, highly accurate processing of data?",
options: [
"Manual method",
"Electronic method",
"Mechanical method",
"None of these methods"
],
answer: 1,
working: "The electronic method uses computer systems, offering far greater speed and accuracy than manual or mechanical approaches."
},
{
question: "Automatic data processing is best distinguished by:",
options: [
"Minimal ongoing human intervention once pre-programmed instructions run",
"Constant manual recalculation for every transaction",
"Exclusive reliance on typewriters for input",
"Processing only a single record annually"
],
answer: 0,
working: "Automatic processing relies on pre-set programs that run with little ongoing human involvement once initiated."
},
{
question: "Batch processing style is best suited for tasks where:",
options: [
"An immediate response is required for each transaction",
"Only a single user can ever interact with the system",
"Data is accumulated and processed together at scheduled intervals",
"Real-time monitoring is the absolute priority"
],
answer: 2,
working: "Batch processing groups transactions together and processes them collectively at set intervals."
},
{
question: "A major drawback of batch processing is that:",
options: [
"It cannot be used for large volumes of data",
"It requires a constant internet connection at all times",
"It is significantly more expensive than other methods",
"Results are not available immediately, since processing waits for the full batch"
],
answer: 3,
working: "Because batch processing waits until data accumulates, there's an inherent delay before results are available."
},
{
question: "Online processing differs from batch processing mainly because online processing:",
options: [
"Requires data to be grouped for a full year first",
"Cannot be applied to banking systems",
"Eliminates the need for any input device",
"Processes and responds to data immediately as it's entered"
],
answer: 3,
working: "Online processing handles transactions as they occur, with direct, immediate interaction."
},
{
question: "Time-sharing processing allows:",
options: [
"Several users to concurrently share a system's resources by rapid task-switching",
"Strictly one user exclusive access at any moment",
"Data to be processed only once every calendar year",
"All processing activity to be permanently suspended"
],
answer: 0,
working: "Time-sharing rapidly allocates small slices of CPU time among multiple users, giving the appearance of simultaneous access."
},
{
question: "Real-time processing is best characterized by:",
options: [
"Long, scheduled delays between input and response",
"Processing that happens only at a fixed midnight hour",
"Immediate processing with instant response, critical in systems like medical monitors",
"A complete absence of any output"
],
answer: 2,
working: "Real-time systems must respond essentially instantly to input, since delays could have serious consequences."
},
{
question: "Distributed processing describes a setup where:",
options: [
"All processing happens on one centralized machine with no networking",
"Only one computer in the organization is permitted to operate",
"No data is ever shared between connected computers",
"Processing tasks are spread across multiple interconnected computers, often across locations"
],
answer: 3,
working: "Distributed processing spreads computing tasks across multiple, often geographically separate, interconnected systems."
},
{
question: "Multiprogramming describes a computer's capability to:",
options: [
"Execute strictly one program at a time, in sequence",
"Hold several programs in memory and rapidly switch CPU attention between them",
"Function only in batch processing mode",
"Operate entirely without any operating system"
],
answer: 1,
working: "Multiprogramming keeps multiple programs loaded in memory, with the CPU switching between them to maximize utilization."
},
{
question: "Multiprocessing is distinguished from multiprogramming mainly because multiprocessing involves:",
options: [
"Two or more CPUs working to execute multiple processes truly simultaneously",
"A single CPU rapidly time-slicing between programs",
"The complete absence of any processing unit",
"Processing exclusively in batch mode"
],
answer: 0,
working: "Multiprocessing uses multiple physical processors to genuinely run tasks in parallel, unlike single-CPU time-slicing."
},
{
question: "Multitasking, as most computer users experience it daily, refers to:",
options: [
"Using several separate physical machines for one shared task",
"The exclusive domain of large mainframe computers",
"A single user running and switching between multiple applications seemingly at once",
"Requiring several completely separate operating systems running together"
],
answer: 2,
working: "Multitasking allows one user, on a single machine, to have several applications apparently active simultaneously."
},
{
question: "A computer file is best described as:",
options: [
"A specific type of computer hardware component",
"A named collection of related data stored together on a storage medium",
"A physical cabinet used for storing paper documents",
"A programming language used for entering data"
],
answer: 1,
working: "A computer file is a logically grouped, named set of related data stored as a unit on a storage device."
},
{
question: "A master file in data processing typically holds:",
options: [
"Temporary records deleted right after use",
"Only error logs generated by the system",
"Data that, once created, can never be changed",
"Relatively permanent records about an entity, periodically updated by transaction data"
],
answer: 3,
working: "A master file stores long-term, relatively stable records that get periodically updated using newer transaction data."
},
{
question: "A transaction file is best described as one containing:",
options: [
"Records of recent, day-to-day activities, used to update the related master file",
"Permanent records that never undergo any change",
"Backup copies functioning identically to archive files",
"Data usable only within manual, non-computerized systems"
],
answer: 0,
working: "Transaction files capture short-term, current activity records, later used to update the master file."
},
  {
question: "Which of these qualifies as an example of file processing?",
options: [
"Manufacturing a new hard disk drive",
"Designing a computer's case and exterior",
"Sorting, merging, updating, or retrieving records within a file",
"Installing a new graphics card"
],
answer: 2,
working: "File processing refers to operations performed on stored data, such as sorting, merging, retrieving, or updating records."
},
{
question: "Sequential file organization arranges records by:",
options: [
"Storing them in a completely random order",
"Placing them one after another in a specific order, typically based on a key field",
"Encrypting every record before storage",
"Arranging them only in a circular linked structure"
],
answer: 1,
working: "Sequential organization stores records consecutively in a defined order, requiring records to be read in that same order."
},
{
question: "A key limitation of sequential file organization is that:",
options: [
"It allows instant direct access to any specific record",
"It cannot be used with batch processing systems",
"It is entirely incompatible with any storage medium",
"Accessing a specific record may require reading through preceding ones first"
],
answer: 3,
working: "Because records must be read in sequence, locating a specific record requires traversing preceding ones, making it slow for large files."
},
{
question: "Direct (random) access file organization permits records to be:",
options: [
"Reached directly via an address or key, without reading other records first",
"Accessed only in the exact order they were originally stored",
"Permanently locked from further modification once created",
"Stored exclusively using paper-based media"
],
answer: 0,
working: "Direct access allows the system to jump straight to a record's storage location using its key, bypassing preceding records."
},
{
question: "Indexed-sequential file organization is a hybrid approach combining features of:",
options: [
"Manual and mechanical processing methods",
"Batch processing and real-time processing styles",
"Sequential organization and direct/random access organization",
"Multiprogramming and multitasking techniques"
],
answer: 2,
working: "Indexed-sequential organization maintains records in sequence while also using an index for fast direct access."
},
{
question: "A database is most accurately defined as:",
options: [
"A single, isolated file with no relationship to other data",
"An organized collection of related data structured for efficient access and management",
"A specific type of malicious computer program",
"A printed summary of an organization's annual figures"
],
answer: 1,
working: "A database is a structured, organized collection of interrelated data designed to support efficient retrieval and management."
},
{
question: "A major advantage that database systems hold over traditional separate file systems is that databases:",
options: [
"Significantly increase the duplication of stored data",
"Make it impossible for more than one user to access data",
"Eliminate any need for structured query capabilities",
"Reduce data redundancy and improve consistency through centralized management"
],
answer: 3,
working: "Centralizing data minimizes duplication and helps maintain consistency, since updates apply in one controlled place."
},
{
question: "Within a database, a field refers to:",
options: [
"A single category or attribute of data, such as 'Surname' or 'Date of Birth'",
"An entire collection of related records grouped together",
"The complete database management system itself",
"A particular method used for organizing files"
],
answer: 0,
working: "A field represents one specific attribute of data (a column) within a record."
},
{
question: "A record within a database is best described as:",
options: [
"A single isolated character of stored data",
"An entire table containing thousands of unrelated entries",
"A complete set of related fields describing one entity, such as one student's full details",
"A duplicate backup copy of the whole database"
],
answer: 2,
working: "A record groups together all the related fields describing a single entity instance."
},
{
question: "A Database Management System (DBMS) is best described as:",
options: [
"A malicious program designed to corrupt stored files",
"Software enabling users to create, manage, and manipulate databases efficiently",
"A physical device used solely for storing backup files",
"A language used exclusively for designing webpages"
],
answer: 1,
working: "A DBMS is specialized software that provides tools to create, organize, query, and maintain databases."
},
{
question: "Data redundancy in file-based systems refers to:",
options: [
"The total absence of any stored data",
"A universally beneficial feature with no real downsides",
"A required characteristic of any well-structured database",
"The unnecessary duplication of identical data across multiple locations, risking inconsistency"
],
answer: 3,
working: "Redundancy occurs when the same data is stored in multiple separate places, risking inconsistency if updates aren't synchronized."
},
{
question: "File management within an operating system primarily involves:",
options: [
"Designing the physical hardware components of a computer",
"Writing application-level software exclusively",
"Manufacturing the storage media itself",
"Organizing, naming, storing, retrieving, and securing files on storage devices"
],
answer: 3,
working: "File management is an OS function responsible for handling how files are organized, named, accessed, and protected."
},
{
question: "An important consideration for effective file organization is:",
options: [
"Giving every file an identical name to ease searching",
"Completely avoiding the use of folders or directories",
"Deleting every file immediately right after creation",
"Establishing a logical folder/directory structure with consistent naming conventions"
],
answer: 3,
working: "A logical, consistent structure makes files easier to locate, manage, and maintain over time."
},
];  
const CSC104 = [
{
    question: "An application package is best described as:",
    options: [
        "Pre-written software designed to perform specific user tasks",
        "A network device used to connect computers",
        "A single isolated line of program code",
        "A type of computer storage hardware"
    ],
    answer: 0
},
{
    question: "Which of these packages is specifically designed for managing structured databases?",
    options: [
        "Microsoft Paint",
        "Microsoft Access",
        "Microsoft PowerPoint",
        "Adobe Photoshop"
    ],
    answer: 1
},
{
    question: "Microsoft Access is most accurately classified as a:",
    options: [
        "Word processing application",
        "Image editing application",
        "Relational Database Management System",
        "Presentation design application"
    ],
    answer: 2
},
{
    question: "The core purpose of a DBMS such as MS Access is to:",
    options: [
        "Edit photographs and digital images",
        "Compose printed letters and documents",
        "Design slide-based presentations",
        "Store, organize, retrieve, and manage structured data"
    ],
    answer: 3
},
{
    question: "The structural component in MS Access used to store raw data in rows and columns is called a:",
    options: [
        "Form",
        "Table",
        "Report",
        "Macro"
    ],
    answer: 1
},
{
    question: "A single row of data in an Access table, representing one complete entry, is called a:",
    options: [
        "Field",
        "Module",
        "Record",
        "Query"
    ],
    answer: 2
},
{
    question: "A single column in an Access table, representing one category of data, is referred to as a:",
    options: [
        "Report",
        "Form",
        "Field",
        "Record"
    ],
    answer: 2
},
{
    question: "The purpose of a 'Primary Key' in an Access table is to:",
    options: [
        "Format how dates are displayed",
        "Uniquely identify each record and prevent duplicates",
        "Delete unwanted records automatically",
        "Convert numbers into currency format"
    ],
    answer: 1
},
{
    question: "To create a new, blank database in Access, a user typically would:",
    options: [
        "Open Excel and save the file with an .accdb extension",
        "Use a slide transition setting",
        "Select 'Blank Database' and specify a file name and location",
        "Apply the Mail Merge wizard"
    ],
    answer: 2
},
{
    question: "The default file extension for a modern Access database file is:",
    options: [
        ".accdb",
        ".pptx",
        ".docx",
        ".xlsx"
    ],
    answer: 0
},
{
    question: "To open an already existing database in Access, a user would normally:",
    options: [
        "Use the Animation pane",
        "Apply a new design template",
        "Insert a new slide",
        "Use File then Open, then browse to the file"
    ],
    answer: 3
},
{
    question: "Which Access view allows users to design or modify a table's structure, including field names and data types?",
    options: [
        "Datasheet View",
        "Design View",
        "Print Preview",
        "Report View"
    ],
    answer: 1
},
{
    question: "Datasheet View in Access primarily allows users to:",
    options: [
        "Build slide transitions",
        "Design the underlying database structure",
        "View and directly edit data in a spreadsheet-like grid",
        "Format text in a printed document"
    ],
    answer: 2
},
{
    question: "Which data type is most appropriate for a field storing a customer's phone number?",
    options: [
        "Currency",
        "Short Text",
        "AutoNumber",
        "Yes/No"
    ],
    answer: 1
},
{
    question: "The AutoNumber data type in Access is most commonly used to:",
    options: [
        "Store Yes/No values",
        "Automatically generate a unique sequential value for each record",
        "Store large blocks of formatted text",
        "Store currency-formatted figures"
    ],
    answer: 1
},
{
    question: "A 'Query' in MS Access is best defined as:",
    options: [
        "A method for formatting fonts",
        "A static, permanently fixed table",
        "A request to retrieve or manipulate specific data based on criteria",
        "A type of slide transition"
    ],
    answer: 2
},
{
    question: "Which query type would best retrieve only customers whose purchases exceed a set amount?",
    options: [
        "A Delete Query",
        "A Make-Table Query with no criteria",
        "A Select Query with a specific criteria condition",
        "An Update Query applied to all records"
    ],
    answer: 2
},
{
    question: "'Filtering' table data in Access refers to:",
    options: [
        "Temporarily displaying only records that meet specific criteria",
        "Permanently deleting all records",
        "Changing a field's assigned data type",
        "Creating a brand-new slide"
    ],
    answer: 0
},
{
    question: "'Sorting' table or query data in Access allows users to:",
    options: [
        "Disable all filter options entirely",
        "Arrange records in a specified ascending or descending order",
        "Convert the table into a presentation slide",
        "Permanently remove unwanted fields"
    ],
    answer: 1
},
{
    question: "Which example best illustrates 'data formatting' within an Access table?",
    options: [
        "Creating an entirely new database",
        "Renaming the saved database file",
        "Deleting an entire table permanently",
        "Displaying a Date field as dd/mm/yyyy"
    ],
    answer: 3
},
{
    question: "A 'Form' in MS Access is primarily used to:",
    options: [
        "Perform complex mathematical calculations only",
        "Provide a user-friendly interface for entering and viewing records",
        "Create animated slide transitions",
        "Store raw table data with no interface"
    ],
    answer: 1
},
{
    question: "The relationship between a table and a query in Access is best described as:",
    options: [
        "Completely unrelated database objects",
        "A query existing entirely without needing any table",
        "A query that dynamically draws and processes data from underlying tables",
        "A permanent, unchangeable static copy of a table"
    ],
    answer: 2
},
{
    question: "A user wants a 'Date of Birth' field to never accept text characters. The most appropriate data type is:",
    options: [
        "Yes/No",
        "OLE Object",
        "Short Text",
        "Date/Time"
    ],
    answer: 3
},
{
    question: "Microsoft PowerPoint is primarily classified as a:",
    options: [
        "Spreadsheet application",
        "Operating system",
        "Presentation software application",
        "Database management application"
    ],
    answer: 2
},
{
    question: "To begin a new presentation in PowerPoint, a user typically starts by:",
    options: [
        "Running a database query",
        "Opening Datasheet View",
        "Selecting a blank presentation or design template",
        "Designing a table structure"
    ],
    answer: 2
},
{
    question: "A 'Design Template' in PowerPoint provides:",
    options: [
        "A method for filtering database records",
        "A tool used only for editing photographs",
        "A type of database query structure",
        "A pre-formatted set of colors, fonts, and layout styles"
    ],
    answer: 3
},
{
    question: "The main reason for applying a consistent design template throughout a presentation is to:",
    options: [
        "Make every slide look completely unrelated to the others",
        "Increase unnecessary file size",
        "Maintain a professional, visually cohesive appearance",
        "Prevent additional slides from being added later"
    ],
    answer: 2
},
{
    question: "The 'Title Slide' layout, typically the first slide, is designed to display:",
    options: [
        "Audio narration with no visible text",
        "An embedded spreadsheet exclusively",
        "A large data table only",
        "A main title, often with a subtitle introducing the topic"
    ],
    answer: 3
},
{
    question: "To add a new slide to an existing PowerPoint presentation, a user would:",
    options: [
        "Save the file as a Word document",
        "Delete the current presentation entirely",
        "Use Access's Query Wizard",
        "Use the 'New Slide' command from the Home tab"
    ],
    answer: 3
},
{
    question: "A 'Slide Transition' in PowerPoint refers to:",
    options: [
        "The text formatting applied within a single slide",
        "A type of database table relationship",
        "The visual effect occurring when moving between slides",
        "The process of saving a presentation file"
    ],
    answer: 2
},
{
    question: "An 'Animation,' as distinct from a slide transition, refers to:",
    options: [
        "An effect applied to objects or text within a single slide",
        "The effect occurring only when switching slides",
        "A type of database query",
        "The process of printing slides"
    ],
    answer: 0
},
{
    question: "Which of the following is an example of an entrance animation effect?",
    options: [
        "A database primary key",
        "A Select Query",
        "A table relationship in Access",
        "Fade, applied to an object appearing on the slide"
    ],
    answer: 3
},
{
    question: "The 'Slide Master' feature in PowerPoint is primarily used to:",
    options: [
        "Delete every slide in the presentation at once",
        "Run a database query",
        "Control formatting and layout consistently across all slides",
        "Convert a presentation into a spreadsheet"
    ],
    answer: 2
},
{
    question: "Why might a presenter limit excessive or intense animations in a professional presentation?",
    options: [
        "Animations always improve clarity, regardless of quantity",
        "PowerPoint restricts presentations to a single animation",
        "Animations are unsupported in PowerPoint entirely",
        "Excessive animation can distract from the actual content and appear unprofessional"
    ],
    answer: 3
},
{
    question: "To make slides automatically advance after a set number of seconds without manual clicking, a user adjusts:",
    options: [
        "The Query Design grid",
        "Table Design View",
        "Access Form view settings",
        "The Slide Transition timing options"
    ],
    answer: 3
},
{
    question: "Why should a Primary Key field generally never be left blank (Null)?",
    options: [
        "Leaving it blank automatically deletes the entire record",
        "Primary keys are optional with no real functional purpose",
        "Blank primary keys actually improve database performance",
        "The key must uniquely identify each record, and a blank value undermines that uniqueness"
    ],
    answer: 3
},
{
    question: "A school wants to store student records and quickly retrieve only those who scored above a set threshold. The best combination of Access tools is:",
    options: [
        "A Form with no underlying table at all",
        "Only the Datasheet View, with no query used",
        "A PowerPoint slide transition",
        "A Table to store the data, with a Query applying the score criteria"
    ],
    answer: 3
},
{
    question: "Which scenario best demonstrates appropriate use of a Yes/No data type in Access?",
    options: [
        "Storing a customer's full residential address",
        "Storing whether a student has paid school fees",
        "Storing a student's exact examination score",
        "Storing a product's unit price"
    ],
    answer: 1
},
{
    question: "A user enters 'ABC' into a field defined with the Number data type. The most likely outcome is:",
    options: [
        "PowerPoint will automatically open to correct the error",
        "Access will reject the entry, since it doesn't match the field's data type",
        "The entire table will be deleted automatically",
        "The value will be accepted and stored silently as text"
    ],
    answer: 1
},  
{
    question: "The key difference between sorting and filtering in Access is that:",
    options: [
        "Filtering can only be applied to PowerPoint slides",
        "Sorting always permanently deletes unmatched data",
        "They are identical operations with no real distinction",
        "Sorting rearranges the order of displayed records, while filtering hides records that don't meet criteria"
    ],
    answer: 3
},
{
    question: "A presenter wants consistent fonts, colors, and a logo on every slide without reformatting each one manually. The most efficient feature to use is:",
    options: [
        "The Access Query Design grid",
        "Manually retyping formatting on each slide",
        "The Datasheet View",
        "The Slide Master"
    ],
    answer: 3
},
{
    question: "A presentation using a completely different font, color, and template on every slide would most likely be critiqued for:",
    options: [
        "Following a recommended best practice",
        "Guaranteeing stronger audience engagement",
        "Being technically impossible in PowerPoint",
        "Appearing inconsistent and potentially distracting to the audience"
    ],
    answer: 3
},
{
    question: "In Access, formatting a number field to display as currency (e.g., ₦1,000.00) primarily affects:",
    options: [
        "Only the visual display, not the actual stored value",
        "The primary key assignment of the table",
        "The actual numeric value stored in the database",
        "The field's data type, converting it permanently to text"
    ],
    answer: 0
},
{
    question: "A teacher wants each new topic in a slideshow to begin with a distinct visual effect signaling the change. This is best handled using:",
    options: [
        "The AutoNumber data type",
        "A Select Query in Access",
        "MS Access Form Design",
        "PowerPoint Slide Transitions"
    ],
    answer: 3
},
{
    question: "The most logical workflow for building a simple Access database from scratch is to:",
    options: [
        "Create/open a blank database, design tables with proper fields, enter data, then build queries or forms",
        "Apply data formatting before any tables exist",
        "Build a PowerPoint presentation first, then convert it into Access",
        "Create queries first, before any tables have been designed"
    ],
    answer: 0
},
{
    question: "Why is it good practice to assign specific, appropriate data types to each Access field rather than making every field Short Text?",
    options: [
        "Specific data types only matter within PowerPoint",
        "Short Text fields process calculations faster than Number fields",
        "Appropriate data types ensure data validity and support correct calculations and sorting",
        "It has no real impact on database functionality"
    ],
    answer: 2
},
{
    question: "A user creates a bullet point that 'flies in' from the side when a slide is presented. This represents which animation category?",
    options: [
        "Motion path with no entry effect",
        "Exit animation",
        "Emphasis animation",
        "Entrance animation"
    ],
    answer: 3
},
{
    question: "Which best illustrates an 'Emphasis' animation effect, as opposed to entrance or exit effects?",
    options: [
        "A slide transition occurring between two slides",
        "Text disappearing entirely from the slide",
        "Text growing larger or changing color while already visible",
        "Text appearing on the slide for the very first time"
    ],
    answer: 2
},
{
    question: "A student designs a table to track library books, including Title, Author, ISBN, and Availability. The most appropriate data type pairing is:",
    options: [
        "Title and Author as Short Text, ISBN as Short Text, Availability as Yes/No",
        "All fields set uniformly to AutoNumber",
        "Title as Currency, Author as Date/Time, ISBN as AutoNumber",
        "Title and Author as Number, ISBN as Yes/No, Availability as Text"
    ],
    answer: 0
},
{
    question: "MS Access and MS PowerPoint are both considered application packages mainly because:",
    options: [
        "PowerPoint is technically a component within Access",
        "Application packages must always involve a database structure",
        "They are identical programs offering the same core features",
        "Both are pre-developed software designed to help users accomplish specific categories of tasks"
    ],
    answer: 3
}
];  
const COS102 = [
{
  question: "Which statement best describes the event-driven nature of Visual Basic programming?",
  options: [
    "Statements execute only in the order they are written without interruption.",
    "A program executes code mainly in response to user or system-generated events.",
    "Programs can only execute one procedure during their lifetime.",
    "Execution always begins from the last procedure created."
  ],
  answer: 1,
  explanation: "Visual Basic is event-driven, meaning code is executed when events such as button clicks or key presses occur."
},
{
  question: "Which Visual Basic data type is most suitable for storing a student's average score of 72.85?",
  options: [
    "Integer",
    "Boolean",
    "Double",
    "String"
  ],
  answer: 2,
  explanation: "The Double data type stores decimal values with high precision."
},
{
  question: "A programmer declares `Dim age As Integer`. Which statement is true?",
  options: [
    "age can only store whole numbers.",
    "age can store text values.",
    "age automatically stores decimal values.",
    "age can only store True or False."
  ],
  answer: 0,
  explanation: "The Integer data type stores whole numbers only."
},
{
  question: "Which control is most appropriate for displaying text that the user should not edit?",
  options: [
    "TextBox",
    "Button",
    "Label",
    "CheckBox"
  ],
  answer: 2,
  explanation: "A Label displays information that users normally cannot modify."
},
{
  question: "Given `x = 10` and `y = 5`, what will be the value of `x Mod y`?",
  options: [
    "5",
    "2",
    "0",
    "10"
  ],
  answer: 2,
  explanation: "The Mod operator returns the remainder after division. 10 divided by 5 leaves a remainder of 0."
},
{
  question: "Which loop is most appropriate when the number of iterations is already known before execution begins?",
  options: [
    "For...Next",
    "Do While",
    "Do Until",
    "While"
  ],
  answer: 0,
  explanation: "A For...Next loop is ideal when the number of repetitions is predetermined."
},
{
  question: "Which keyword is used to select one action from several possible conditions in Visual Basic?",
  options: [
    "Switch",
    "If",
    "Select Case",
    "Choose"
  ],
  answer: 2,
  explanation: "Select Case provides a cleaner way to handle multiple possible values of an expression."
},
{
  question: "A procedure performs the same calculation in several parts of a program. What is the main advantage of placing it inside a Function?",
  options: [
    "It reduces code duplication and improves reusability.",
    "It automatically increases execution speed.",
    "It eliminates all runtime errors.",
    "It prevents variables from being declared."
  ],
  answer: 0,
  explanation: "Functions allow reusable code, making programs easier to maintain."
},
{
  question: "Which debugging technique allows a programmer to execute one statement at a time while observing variable values?",
  options: [
    "Compilation",
    "Stepping through the code",
    "Creating menus",
    "Saving the project"
  ],
  answer: 1,
  explanation: "Stepping through code helps identify logic errors by executing statements individually."
},
{
  question: "An array is primarily used to:",
  options: [
    "Store many related values under one variable name.",
    "Replace all loops.",
    "Create dialog boxes.",
    "Display menus."
  ],
  answer: 0,
  explanation: "Arrays store multiple related values using a single variable name and indexes."
},
{
  question: "Which statement correctly accesses the third element of an array declared as `Dim score(5) As Integer`?",
  options: [
    "score(3)",
    "score(2)",
    "score[3]",
    "score[2]"
  ],
  answer: 1,
  explanation: "Visual Basic arrays are zero-based by default, so the third element has index 2."
},
{
  question: "Which file operation retrieves previously stored information from a data file?",
  options: [
    "Write",
    "Append",
    "Read",
    "Delete"
  ],
  answer: 2,
  explanation: "The Read operation retrieves data that has already been stored in a file."
},
{
  question: "A program compiles successfully but produces an incorrect result after execution. What type of error is most likely responsible?",
  options: [
    "Syntax error",
    "Compilation error",
    "Logic error",
    "Linker error"
  ],
  answer: 2,
  explanation: "Logic errors allow the program to run but produce incorrect results due to faulty program logic."
}, 
{
  question: "Which Visual Basic statement ensures that a block of code executes only when a specified condition is True?",
  options: [
    "Select Case",
    "If...Then",
    "For...Next",
    "Do...Loop"
  ],
  answer: 1,
  explanation: "The If...Then statement executes a block of code only when its condition evaluates to True."
},
{
  question: "A programmer wants a loop to execute at least once regardless of the condition. Which loop structure is most appropriate?",
  options: [
    "Do...Loop While",
    "For...Next",
    "Do...Loop Until",
    "Do...Loop"
  ],
  answer: 3,
  explanation: "A Do...Loop can be structured so that the condition is checked after the first execution, guaranteeing at least one iteration."
},
{
  question: "Which property of a TextBox determines the text displayed inside it during program execution?",
  options: [
    "Caption",
    "Text",
    "Name",
    "Visible"
  ],
  answer: 1,
  explanation: "The Text property stores or displays the content of a TextBox."
},
{
  question: "What is the primary purpose of the Name property of a Visual Basic control?",
  options: [
    "To determine its screen color",
    "To specify its position",
    "To identify the control in code",
    "To determine its font size"
  ],
  answer: 2,
  explanation: "The Name property uniquely identifies a control so it can be referenced in code."
},
{
  question: "Which debugging window allows you to inspect the current values of variables while a program is paused?",
  options: [
    "Solution Explorer",
    "Properties Window",
    "Watch Window",
    "Toolbox"
  ],
  answer: 2,
  explanation: "The Watch Window displays the values of selected variables during debugging."
},
{
  question: "Which procedure type returns a value to the calling code?",
  options: [
    "Sub Procedure",
    "Event Procedure",
    "Loop Procedure",
    "Function Procedure"
  ],
  answer: 3,
  explanation: "A Function procedure performs a task and returns a value."
},
{
  question: "Which of the following is NOT a valid reason for using arrays?",
  options: [
    "Reducing the number of variables needed",
    "Storing related values together",
    "Making data easier to process with loops",
    "Eliminating the need for variables entirely"
  ],
  answer: 3,
  explanation: "Arrays are variables themselves; they do not eliminate the need for variables."
},
{
  question: "Which menu component is commonly used to allow users to open or save files?",
  options: [
    "Context Menu",
    "MenuStrip",
    "Dialog Box",
    "Status Bar"
  ],
  answer: 2,
  explanation: "Dialog boxes such as OpenFileDialog and SaveFileDialog allow users to select files."
},
{
  question: "If the condition of a Do While loop is initially False, what happens?",
  options: [
    "The loop executes once.",
    "The loop executes indefinitely.",
    "The loop is skipped entirely.",
    "A syntax error occurs."
  ],
  answer: 2,
  explanation: "A Do While loop checks the condition before execution, so it is skipped if the condition is False."
},
{
  question: "Which operator is used to compare whether two values are equal in a Visual Basic condition?",
  options: [
    "=",
    "<>",
    ":=",
    "&"
  ],
  answer: 0,
  explanation: "The = operator compares two values for equality in Visual Basic."
},
{
  question: "Which statement best explains why procedures improve program design?",
  options: [
    "They eliminate all syntax errors.",
    "They allow code to be reused and organized into manageable units.",
    "They prevent loops from executing.",
    "They automatically optimize memory usage."
  ],
  answer: 1,
  explanation: "Procedures improve modularity, readability, and code reuse."
},
{
  question: "A programmer accidentally writes `If score > 50 Then` but forgets to include `End If`. What type of error will most likely occur?",
  options: [
    "Logic error",
    "Runtime error",
    "Syntax error",
    "File error"
  ],
  answer: 2,
  explanation: "Missing 'End If' violates Visual Basic syntax rules and prevents successful compilation."
},
{
  question: "Which file access method is most appropriate when records need to be retrieved one after another in order?",
  options: [
    "Sequential access",
    "Random access",
    "Indexed access",
    "Direct memory access"
  ],
  answer: 0,
  explanation: "Sequential access processes records in the order they are stored, making it suitable for ordered retrieval."
},
{
  question: "What is the primary advantage of using a Select Case statement instead of multiple nested If...Then...Else statements?",
  options: [
    "It automatically increases program execution speed.",
    "It makes code easier to read and maintain when testing many possible values.",
    "It eliminates the need for variables.",
    "It can only evaluate Boolean expressions."
  ],
  answer: 1,
  explanation: "Select Case provides a cleaner and more organized way to handle multiple possible values of an expression."
},
{
  question: "Which Visual Basic event is triggered when a user clicks a Button control?",
  options: [
    "Load",
    "MouseMove",
    "Click",
    "Change"
  ],
  answer: 2,
  explanation: "The Click event occurs whenever the user clicks a Button control."
},
{
  question: "Given the code `For i = 2 To 10 Step 2`, how many times will the loop execute?",
  options: [
    "4",
    "5",
    "6",
    "8"
  ],
  answer: 1,
  explanation: "The values are 2, 4, 6, 8, and 10, making a total of five iterations."
},
{
  question: "Which of the following is the best reason for using comments in a Visual Basic program?",
  options: [
    "They reduce memory usage.",
    "They improve processor speed.",
    "They make the program easier to understand and maintain.",
    "They automatically remove syntax errors."
  ],
  answer: 2,
  explanation: "Comments explain the purpose of code, making it easier for programmers to understand and maintain."
},
{
  question: "A Function procedure differs from a Sub procedure because it:",
  options: [
    "Cannot receive parameters.",
    "Can return a value to the calling code.",
    "Cannot contain decision statements.",
    "Must always use arrays."
  ],
  answer: 1,
  explanation: "A Function returns a value after execution, whereas a Sub does not."
},
{
  question: "Which Visual Basic statement immediately terminates the current loop?",
  options: [
    "Continue",
    "End",
    "Exit For",
    "Return"
  ],
  answer: 2,
  explanation: "Exit For immediately stops execution of the current For...Next loop."
},
{
  question: "What is the index of the last element in an array declared as `Dim marks(24) As Integer`?",
  options: [
    "23",
    "24",
    "25",
    "26"
  ],
  answer: 1,
  explanation: "The array contains elements indexed from 0 to 24, so the last index is 24."
},
{
  question: "Which debugging feature allows a program to pause automatically at a specified line?",
  options: [
    "Breakpoint",
    "Immediate Window",
    "Properties Window",
    "Output Window"
  ],
  answer: 0,
  explanation: "A breakpoint pauses execution at a chosen line so the programmer can inspect the program."
},
{
  question: "Which file mode allows new records to be added without deleting existing records?",
  options: [
    "Read",
    "Append",
    "Create",
    "Rewrite"
  ],
  answer: 1,
  explanation: "Append mode adds new data to the end of an existing file while preserving previous records."
},
{
  question: "Which statement about variables is correct?",
  options: [
    "Variables cannot change during execution.",
    "Variables store values that may change while a program runs.",
    "Variables must always contain text values.",
    "Variables cannot be declared inside procedures."
  ],
  answer: 1,
  explanation: "Variables are named memory locations whose values may change during program execution."
},
{
  question: "A programmer wants to execute one block of code when `score >= 70` and another otherwise. Which structure is most appropriate?",
  options: [
    "If...Then...Else",
    "For...Next",
    "Do Until",
    "While"
  ],
  answer: 0,
  explanation: "If...Then...Else allows two alternative execution paths based on a condition."
},
{
  question: "Which of the following is considered a runtime error?",
  options: [
    "Missing End If",
    "Dividing a number by zero during execution.",
    "Misspelling the keyword Dim.",
    "Omitting quotation marks around a string literal."
  ],
  answer: 1,
  explanation: "A divide-by-zero error occurs while the program is running, making it a runtime error."
},
{
  question: "Why is modular programming encouraged in Visual Basic?",
  options: [
    "It removes the need for debugging.",
    "It allows large programs to be divided into smaller, manageable procedures.",
    "It guarantees faster execution in every situation.",
    "It prevents users from entering invalid input."
  ],
 answer: 1,
  explanation: "Modular programming improves readability, maintenance, testing, and code reuse by dividing programs into smaller procedures."
},  
{
  question: "Which Visual Basic statement is most appropriate for repeatedly accepting user input until the user enters 'EXIT'?",
  options: [
    "For...Next",
    "Select Case",
    "Do Until",
    "If...Then"
  ],
  answer: 2,
  explanation: "A Do Until loop continues executing until the specified condition becomes True, making it suitable for sentinel-controlled input."
},
{
  question: "A programmer accidentally attempts to access `scores(15)` when the array was declared as `Dim scores(9) As Integer`. What will most likely occur?",
  options: [
    "The compiler automatically creates additional elements.",
    "The program ignores the statement.",
    "The value of scores(9) is returned.",
    "An index out-of-range runtime error occurs."
  ],
  answer: 3,
  explanation: "Accessing an array element outside its valid index range results in a runtime error."
},
{
  question: "Which Visual Basic control is most suitable for allowing users to choose only one option from several alternatives?",
  options: [
    "RadioButton",
    "CheckBox",
    "Label",
    "PictureBox"
  ],
  answer: 0,
  explanation: "RadioButton controls are designed for mutually exclusive selections within the same group."
},
{
  question: "Why should a programmer initialize variables before using them in calculations?",
  options: [
    "To reduce the size of the executable file.",
    "To ensure calculations begin with known values.",
    "To prevent procedures from being created.",
    "To automatically eliminate syntax errors."
  ],
  answer: 1,
  explanation: "Initializing variables prevents unpredictable results by assigning them known starting values."
},
{
  question: "Which of the following best describes a parameter in a procedure?",
  options: [
    "A variable used to pass data into a procedure.",
    "A comment describing the procedure.",
    "A debugging tool.",
    "A menu command."
  ],
  answer: 0,
  explanation: "Parameters allow values to be passed into procedures for processing."
},
{
  question: "Which debugging practice is most effective for identifying the exact statement causing a runtime error?",
  options: [
    "Deleting all comments.",
    "Using breakpoints and stepping through the code.",
    "Changing every variable to String.",
    "Running the program repeatedly without inspection."
  ],
  answer: 1,
  explanation: "Breakpoints and step-by-step execution help locate the exact point where the error occurs."
},
{
  question: "A file that stores student records so they can be used again after the program closes is an example of:",
  options: [
    "Temporary memory",
    "Persistent storage",
    "Cache memory",
    "Volatile storage"
  ],
  answer: 1,
  explanation: "Data files provide persistent storage, allowing information to remain available after the program terminates."
},
{
  question: "Which Visual Basic property determines whether a control is displayed on a form?",
  options: [
    "Enabled",
    "Visible",
    "Text",
    "BackColor"
  ],
  answer: 1,
  explanation: "The Visible property determines whether a control appears on the form."
},
{
  question: "What is the primary purpose of exception handling in a Visual Basic application?",
  options: [
    "To increase processor speed.",
    "To handle unexpected errors without abruptly terminating the program.",
    "To replace loops.",
    "To declare variables automatically."
  ],
  answer: 1,
  explanation: "Exception handling allows programs to respond gracefully to unexpected errors during execution."
},
{
  question: "Which statement is TRUE about Function procedures?",
  options: [
    "They cannot receive arguments.",
    "They always return a value.",
    "They cannot be called from another procedure.",
    "They execute only once."
  ],
  answer: 1,
  explanation: "A Function procedure is specifically designed to return a value after performing its task."
},
{
  question: "Which of the following best explains why arrays are often processed with loops?",
  options: [
    "Loops allow each array element to be accessed efficiently using its index.",
    "Arrays cannot exist without loops.",
    "Loops automatically resize arrays.",
    "Loops prevent runtime errors."
  ],
  answer: 0,
  explanation: "Loops make it easy to process every element of an array one after another."
} 
];
const CYB102 = [
{
  question: "Which statement best distinguishes data from information?",
  options: [
    "Data is processed and meaningful, while information is raw facts",
    "Data and information are identical concepts",
    "Data is raw facts, while information is processed and meaningful",
    "Information is always unstructured data"
  ],
  answer: 2,
  explanation: "Data refers to raw facts, while information is processed data that is meaningful and useful."
},
{
  question: "Which of the following is an example of primary storage device?",
  options: [
    "Hard disk drive",
    "RAM",
    "Flash drive",
    "External SSD"
  ],
  answer: 1,
  explanation: "RAM is primary memory used for temporary storage during processing."
},
{
  question: "Which storage device is most suitable for long-term archival storage?",
  options: [
    "RAM",
    "Cache memory",
    "Hard disk drive",
    "CPU register"
  ],
  answer: 2,
  explanation: "Hard disk drives provide non-volatile storage suitable for long-term data retention."
},
{
  question: "Which of the following best describes backup?",
  options: [
    "Deleting unused files to free space",
    "Compressing files for faster processing",
    "Creating a duplicate copy of data for recovery purposes",
    "Encrypting files to prevent access"
  ],
  answer: 2,
  explanation: "Backup involves making copies of data to restore it in case of loss or corruption."
},
{
  question: "Which backup method copies only files that have changed since the last backup?",
  options: [
    "Full backup",
    "Differential backup",
    "Incremental backup",
    "System backup"
  ],
  answer: 2,
  explanation: "Incremental backup saves only data changed since the last backup."
},
{
  question: "Which of the following best describes data integrity?",
  options: [
    "The speed at which data is processed",
    "The accuracy and consistency of data over its lifecycle",
    "The size of stored data",
    "The format in which data is stored"
  ],
  answer: 1,
  explanation: "Data integrity ensures data remains accurate and consistent over time."
},
{
  question: "Which process removes or corrects incorrect, incomplete, or irrelevant data?",
  options: [
    "Data encryption",
    "Data cleaning",
    "Data compression",
    "Data replication"
  ],
  answer: 1,
  explanation: "Data cleaning improves quality by correcting or removing faulty data."
},
{
  question: "Which of the following is a common cyber threat?",
  options: [
    "Spreadsheet software",
    "Firewall",
    "Phishing",
    "Database index"
  ],
  answer: 2,
  explanation: "Phishing is a cyber attack that tricks users into revealing sensitive information."
},
{
  question: "Which security measure is used to block unauthorized access to a network?",
  options: [
    "Firewall",
    "Spreadsheet",
    "Backup drive",
    "Browser cache"
  ],
  answer: 0,
  explanation: "A firewall monitors and controls incoming and outgoing network traffic."
},
{
  question: "Which of the following is a strong password practice?",
  options: [
    "Using your name and birth year",
    "Using short simple words",
    "Using a mix of letters, numbers, and symbols",
    "Using the same password everywhere"
  ],
  answer: 2,
  explanation: "Strong passwords combine letters, numbers, and symbols for security."
},
{
  question: "What is the primary goal of cybersecurity?",
  options: [
    "To increase internet speed",
    "To protect systems, networks, and data from attacks",
    "To delete unnecessary files",
    "To design software applications"
  ],
  answer: 1,
  explanation: "Cybersecurity focuses on protecting digital systems and data from threats."
},
{
  question: "Which of the following is NOT a cyber attack?",
  options: [
    "Malware",
    "Phishing",
    "Encryption",
    "Ransomware"
  ],
  answer: 2,
  explanation: "Encryption is a security method, not an attack."
},
{
  question: "Which practice helps protect personal data online?",
  options: [
    "Sharing passwords with friends",
    "Using public Wi-Fi without protection",
    "Enabling two-factor authentication",
    "Posting login details online"
  ],
  answer: 2,
  explanation: "Two-factor authentication adds an extra layer of security."
},
{
  question: "Which of the following best describes malware?",
  options: [
    "A software used to speed up a computer",
    "A program designed to detect system errors",
    "Malicious software designed to damage or gain unauthorized access to systems",
    "A tool used for data backup"
  ],
  answer: 2,
  explanation: "Malware refers to malicious software created to harm or exploit systems, networks, or users."
},
{
  question: "Which cyber attack involves tricking users into revealing sensitive information through fake messages or websites?",
  options: [
    "Phishing",
    "Formatting",
    "Defragmentation",
    "Compression"
  ],
  answer: 0,
  explanation: "Phishing uses deceptive messages or websites to steal sensitive user information."
},
{
  question: "What is ransomware primarily designed to do?",
  options: [
    "Speed up system performance",
    "Encrypt files and demand payment for their release",
    "Clean infected systems automatically",
    "Backup user data"
  ],
  answer: 1,
  explanation: "Ransomware locks or encrypts files and demands payment to restore access."
},
{
  question: "Which of the following is a common method used in social engineering attacks?",
  options: [
    "Upgrading hardware",
    "Manipulating users into revealing confidential information",
    "Installing antivirus software",
    "Updating operating systems"
  ],
  answer: 1,
  explanation: "Social engineering exploits human behavior rather than technical vulnerabilities."
},
{
  question: "Which security tool monitors and filters incoming network traffic based on security rules?",
  options: [
    "Firewall",
    "Spreadsheet",
    "Compiler",
    "Database engine"
  ],
  answer: 0,
  explanation: "A firewall enforces security rules to control network traffic."
},
{
  question: "Which of the following is an example of safe internet practice?",
  options: [
    "Using weak passwords",
    "Clicking unknown links",
    "Logging out of accounts after use",
    "Sharing OTP codes"
  ],
  answer: 2,
  explanation: "Logging out helps prevent unauthorized access to accounts."
},
{
  question: "What does data privacy mainly focus on?",
  options: [
    "Increasing storage size",
    "Protecting personal data from unauthorized access",
    "Improving internet speed",
    "Reducing file size"
  ],
  answer: 1,
  explanation: "Data privacy ensures personal information is protected from unauthorized use."
},
{
  question: "Which of the following is a strong example of digital identity protection?",
  options: [
    "Using the same password for all accounts",
    "Sharing login details with friends",
    "Enabling multi-factor authentication",
    "Posting passwords online"
  ],
  answer: 2,
  explanation: "Multi-factor authentication strengthens account security."
},
{
  question: "Which of the following best describes ethical issues in data handling?",
  options: [
    "Using data responsibly and respecting privacy laws",
    "Increasing data storage capacity",
    "Deleting all unused files",
    "Improving internet bandwidth"
  ],
  answer: 0,
  explanation: "Ethical data handling involves responsible use and respect for privacy and legal guidelines."
},
{
  question: "Which attack involves overwhelming a system with excessive traffic to make it unavailable?",
  options: [
    "Phishing",
    "DDoS attack",
    "Encryption attack",
    "Data backup"
  ],
  answer: 1,
  explanation: "A DDoS attack floods a system with traffic, causing it to become unavailable."
},
{
  question: "What is the main purpose of antivirus software?",
  options: [
    "To create backups automatically",
    "To detect and remove malicious software",
    "To increase internet speed",
    "To design web pages"
  ],
  answer: 1,
  explanation: "Antivirus software identifies and removes malware from systems."
},
{
  question: "Which of the following is a characteristic of a secure password?",
  options: [
    "Short and simple",
    "Contains only letters",
    "Long, complex, and unique",
    "Based on user's name"
  ],
  answer: 2,
  explanation: "Strong passwords are long, complex, and not easily guessable."
},
{
  question: "Which practice helps reduce exposure to cyber threats?",
  options: [
    "Ignoring software updates",
    "Installing apps from unknown sources",
    "Regular system updates",
    "Sharing passwords"
  ],
  answer: 2,
  explanation: "Regular updates patch security vulnerabilities and reduce risks."  
 },
 {
  question: "Which of the following is the main purpose of data validation?",
  options: [
    "To permanently store data in a database",
    "To ensure data entered is accurate and acceptable",
    "To encrypt data during transmission",
    "To delete incorrect records automatically"
  ],
  answer: 1,
  explanation: "Data validation ensures that input data meets required rules before it is accepted into the system."
},
{
  question: "Which validation type checks whether a number falls within a specific range?",
  options: [
    "Format check",
    "Range check",
    "Presence check",
    "Type check"
  ],
  answer: 1,
  explanation: "Range check ensures a value is within a defined minimum and maximum limit."
},
{
  question: "What does data integrity ensure in a system?",
  options: [
    "Data is stored in the cloud",
    "Data is always encrypted",
    "Data remains accurate and consistent over time",
    "Data is deleted after use"
  ],
  answer: 2,
  explanation: "Data integrity ensures that data remains accurate, consistent, and reliable."
},
{
  question: "Which system tool is used to monitor CPU, memory, and running processes?",
  options: [
    "Task Manager",
    "Control Panel",
    "File Explorer",
    "Word Processor"
  ],
  answer: 0,
  explanation: "Task Manager displays system performance and running processes."
},
{
  question: "Which of the following best describes digital identity?",
  options: [
    "A physical ID card",
    "A user’s online identity and credentials",
    "A computer hardware component",
    "A software installation file"
  ],
  answer: 1,
  explanation: "Digital identity represents how a user is identified and authenticated online."
},
{
  question: "What is the main risk of weak digital identity protection?",
  options: [
    "Faster internet speed",
    "Unauthorized access to personal accounts",
    "Improved system performance",
    "Reduced storage space"
  ],
  answer: 1,
  explanation: "Weak security can lead to unauthorized access to user accounts."
},
{
  question: "Which of the following best describes cloud security?",
  options: [
    "Security of physical computers only",
    "Protection of data and services stored in cloud environments",
    "Speeding up internet browsing",
    "Installing operating systems"
  ],
  answer: 1,
  explanation: "Cloud security protects data, applications, and infrastructure hosted in the cloud."
},
{
  question: "Which of the following is a benefit of cloud storage?",
  options: [
    "Data can only be accessed offline",
    "Limited storage capacity",
    "Access from multiple devices anywhere",
    "No need for internet connection"
  ],
  answer: 2,
  explanation: "Cloud storage allows users to access data remotely from different devices."
},
{
  question: "Which of the following is a common system monitoring feature?",
  options: [
    "Encrypting emails automatically",
    "Displaying CPU and RAM usage",
    "Creating backup copies",
    "Deleting malware"
  ],
  answer: 1,
  explanation: "System monitoring tools show CPU, memory, and performance usage."
},
{
  question: "Which of the following best describes format validation?",
  options: [
    "Checking if data is stored correctly",
    "Ensuring data follows a specific pattern (e.g., email format)",
    "Encrypting input data",
    "Backing up system files"
  ],
  answer: 1,
  explanation: "Format validation ensures data follows a required structure."
},
{
  question: "Which of the following is an example of ethical data handling?",
  options: [
    "Selling user data without permission",
    "Accessing private data without consent",
    "Using data only for authorized purposes",
    "Sharing passwords publicly"
  ],
  answer: 2,
  explanation: "Ethical data handling means using data responsibly and with permission."
},
{
  question: "Which of the following best describes presence check?",
  options: [
    "Checking if data is encrypted",
    "Checking if a field is not left blank",
    "Checking data type",
    "Checking data format"
  ],
  answer: 1,
  explanation: "Presence check ensures required fields are not empty."
},
{
  question: "Which cloud service model provides software applications over the internet?",
  options: [
    "IaaS",
    "PaaS",
    "SaaS",
    "DaaS"
  ],
  answer: 2,
  explanation: "SaaS delivers software applications over the internet."
},
{
  question: "Which of the following best describes system monitoring tools?",
  options: [
    "Tools used to design websites",
    "Tools used to track system performance and detect issues",
    "Tools used to store large files permanently",
    "Tools used to encrypt emails only"
  ],
  answer: 1,
  explanation: "System monitoring tools track CPU, memory, and system performance to detect problems early."
},
{
  question: "Which of the following is a key principle of data privacy?",
  options: [
    "Data should be shared with everyone freely",
    "Data should only be accessed by authorized individuals",
    "Data should be stored without encryption",
    "Data should always be public"
  ],
  answer: 1,
  explanation: "Data privacy ensures that only authorized users can access sensitive information."
},
{
  question: "Which of the following is a major risk of cloud computing?",
  options: [
    "Unlimited storage",
    "Data breaches if security is weak",
    "Faster processing speed",
    "Offline accessibility"
  ],
  answer: 1,
  explanation: "Cloud systems are vulnerable to data breaches if proper security measures are not in place."
},
{
  question: "Which of the following is an example of digital responsibility?",
  options: [
    "Spreading fake news online",
    "Respecting copyright and using information ethically",
    "Sharing others' passwords",
    "Hacking accounts for fun"
  ],
  answer: 1,
  explanation: "Digital responsibility involves ethical and legal use of digital resources."
},
{
  question: "Which of the following best describes encryption?",
  options: [
    "Deleting all system files",
    "Converting data into a coded form to prevent unauthorized access",
    "Copying files to another folder",
    "Increasing internet speed"
  ],
  answer: 1,
  explanation: "Encryption converts data into a secure format that can only be read with a key."
},
{
  question: "Which of the following is a strong example of cyber hygiene?",
  options: [
    "Using outdated software",
    "Clicking unknown email links",
    "Regularly updating software and using strong passwords",
    "Sharing login details"
  ],
  answer: 2,
  explanation: "Cyber hygiene involves safe practices like updates and strong password use."
},
{
  question: "Which of the following best describes authentication?",
  options: [
    "Deleting user accounts",
    "Verifying the identity of a user before granting access",
    "Backing up data",
    "Compressing files"
  ],
  answer: 1,
  explanation: "Authentication confirms a user's identity before access is granted."
},
{
  question: "Which of the following is an example of unauthorized access?",
  options: [
    "Logging into your own account",
    "Using multi-factor authentication",
    "Hacking into someone else’s account",
    "Changing your password"
  ],
  answer: 2,
  explanation: "Unauthorized access means entering a system without permission."
},
{
  question: "Which of the following best describes a firewall?",
  options: [
    "A hardware device used for printing",
    "A system that monitors and controls network traffic",
    "A type of malware",
    "A data storage device"
  ],
  answer: 1,
  explanation: "A firewall filters incoming and outgoing network traffic based on security rules."
},
{
  question: "Which of the following is the main purpose of data backup?",
  options: [
    "To increase file size",
    "To prevent data loss and allow recovery",
    "To slow down system performance",
    "To delete unwanted files"
  ],
  answer: 1,
  explanation: "Backup ensures data can be restored if it is lost or damaged."
},
{
  question: "Which of the following is an example of ethical hacking?",
  options: [
    "Stealing passwords for personal gain",
    "Testing system security with permission",
    "Deleting company data",
    "Installing viruses on systems"
  ],
  answer: 1,
  explanation: "Ethical hacking is authorized testing of system security to find vulnerabilities."
} 
];
const CYB104 = [
  {
  question: "Which of the following best describes application packages in cybersecurity?",
  options: [
    "Software used only for gaming and entertainment",
    "Programs designed to perform specific tasks such as word processing, spreadsheets, and security tasks",
    "Hardware components used to secure systems",
    "Internet service providers"
  ],
  answer: 1,
  explanation: "Application packages are software tools designed for specific tasks including productivity and cybersecurity functions."
},
{
  question: "Which application is most suitable for creating and editing text documents?",
  options: [
    "Microsoft Excel",
    "Microsoft Word",
    "PowerPoint",
    "Photoshop"
  ],
  answer: 1,
  explanation: "Microsoft Word is a word processing application used for creating and editing text documents."
},
{
  question: "What is the main purpose of cyber security incident reporting?",
  options: [
    "To ignore security threats",
    "To document and report security breaches for investigation and response",
    "To delete system logs automatically",
    "To increase internet speed"
  ],
  answer: 1,
  explanation: "Incident reporting helps organizations document and respond to security breaches effectively."
},
{
  question: "Which of the following is a spreadsheet application?",
  options: [
    "Microsoft Excel",
    "Notepad",
    "Paint",
    "VLC Media Player"
  ],
  answer: 0,
  explanation: "Microsoft Excel is used for spreadsheet calculations and data analysis."
},
{
  question: "Which of the following is the primary use of presentation tools?",
  options: [
    "Writing programming code",
    "Creating visual slides for presenting information",
    "Deleting malware",
    "Managing system files"
  ],
  answer: 1,
  explanation: "Presentation tools like PowerPoint are used to create slides for presenting information."
},
{
  question: "What is the main function of antivirus software?",
  options: [
    "To create documents",
    "To detect and remove malicious software",
    "To design presentations",
    "To manage spreadsheets"
  ],
  answer: 1,
  explanation: "Antivirus software protects systems by detecting and removing malware."
},
{
  question: "Which of the following is an example of anti-malware tool?",
  options: [
    "Windows Media Player",
    "Malwarebytes",
    "Microsoft Word",
    "Excel"
  ],
  answer: 1,
  explanation: "Malwarebytes is a security tool used to detect and remove malware."
},
{
  question: "What is the main purpose of a firewall?",
  options: [
    "To edit documents",
    "To control and filter network traffic",
    "To play videos",
    "To create spreadsheets"
  ],
  answer: 1,
  explanation: "A firewall monitors and controls incoming and outgoing network traffic."
},
{
  question: "Which of the following best describes password management?",
  options: [
    "Sharing passwords freely",
    "Creating, storing, and managing strong and secure passwords",
    "Writing passwords on paper",
    "Using the same password everywhere"
  ],
  answer: 1,
  explanation: "Password management involves securely creating and handling passwords."
},
{
  question: "Which of the following is a safe internet practice?",
  options: [
    "Clicking unknown links",
    "Using strong unique passwords",
    "Sharing OTP with strangers",
    "Downloading unknown files"
  ],
  answer: 1,
  explanation: "Strong unique passwords help protect online accounts."
},
{
  question: "What is the purpose of data backup?",
  options: [
    "To delete files permanently",
    "To create copies of data for recovery in case of loss",
    "To reduce storage space",
    "To slow down system performance"
  ],
  answer: 1,
  explanation: "Backup ensures data can be restored if lost or corrupted."
},
{
  question: "Which of the following is a basic encryption concept?",
  options: [
    "Converting data into unreadable format without a key",
    "Deleting data permanently",
    "Copying files to another folder",
    "Printing files"
  ],
  answer: 0,
  explanation: "Encryption converts data into a secure format that requires a key to read."
},
{
  question: "Which tool is commonly used to monitor system performance?",
  options: [
    "Task Manager",
    "Notepad",
    "Paint",
    "Calculator"
  ],
  answer: 0,
  explanation: "Task Manager monitors CPU, memory, and running processes."
  },
  {
  question: "Which spreadsheet feature is most useful for automatically performing calculations on large data sets?",
  options: [
    "Themes",
    "Formulas",
    "Slide transitions",
    "Word wrap"
  ],
  answer: 1,
  explanation: "Formulas in spreadsheets are used to perform automatic calculations on data."
},
{
  question: "Which of the following best describes a spreadsheet application?",
  options: [
    "Software used for video editing",
    "Software used for creating and analyzing tabular data",
    "Software used for browsing the internet",
    "Software used for antivirus scanning only"
  ],
  answer: 1,
  explanation: "Spreadsheet applications are used for organizing and analyzing data in rows and columns."
},
{
  question: "In cybersecurity, why is it important to use updated antivirus software?",
  options: [
    "To increase screen brightness",
    "To detect and remove newly developed threats",
    "To improve printer speed",
    "To reduce internet usage"
  ],
  answer: 1,
  explanation: "Updated antivirus software can detect new malware and security threats."
},
{
  question: "Which of the following is a sign of a possible phishing attempt?",
  options: [
    "Verified website with HTTPS",
    "Emails requesting urgent password reset with suspicious links",
    "Official company announcements",
    "Messages from known contacts only"
  ],
  answer: 1,
  explanation: "Phishing often involves urgent fake messages designed to trick users into revealing data."
},
{
  question: "Which feature in word processing applications helps detect spelling and grammar errors?",
  options: [
    "AutoSave",
    "Spell Check",
    "Mail Merge",
    "Track Changes"
  ],
  answer: 1,
  explanation: "Spell Check identifies and suggests corrections for spelling and grammar errors."
},
{
  question: "What is the main purpose of cyber incident reporting?",
  options: [
    "To ignore system errors",
    "To document and respond to security breaches",
    "To delete logs automatically",
    "To increase system speed"
  ],
  answer: 1,
  explanation: "Incident reporting helps organizations respond effectively to security breaches."
},
{
  question: "Which of the following is a strong password practice?",
  options: [
    "Using your name and birth year",
    "Using short simple words",
    "Using a mix of letters, numbers, and symbols",
    "Reusing the same password everywhere"
  ],
  answer: 2,
  explanation: "Strong passwords include a combination of letters, numbers, and symbols."
},
{
  question: "Which of the following is NOT a function of spreadsheet software?",
  options: [
    "Data analysis",
    "Chart creation",
    "Writing essays",
    "Financial calculations"
  ],
  answer: 2,
  explanation: "Spreadsheets are not used for essay writing; they focus on data processing."
},
{
  question: "Which cybersecurity tool helps detect and remove spyware and adware?",
  options: [
    "PowerPoint",
    "Anti-malware software",
    "Word processor",
    "Media player"
  ],
  answer: 1,
  explanation: "Anti-malware tools detect and remove harmful software like spyware and adware."
},
{
  question: "What is the main risk of using weak passwords?",
  options: [
    "Faster login speed",
    "Unauthorized access to accounts",
    "Better encryption",
    "Improved system performance"
  ],
  answer: 1,
  explanation: "Weak passwords can be easily guessed, leading to account compromise."
},
{
  question: "Which feature in presentation tools allows movement between slides?",
  options: [
    "Transitions",
    "Formulas",
    "Macros",
    "Headers"
  ],
  answer: 0,
  explanation: "Transitions control how one slide changes to another in a presentation."
},
{
  question: "What is the main purpose of system monitoring tools?",
  options: [
    "To create documents",
    "To track system performance and detect issues",
    "To edit images",
    "To design presentations"
  ],
  answer: 1,
  explanation: "System monitoring tools track CPU, memory, and performance status."
},
{
  question: "Which of the following is a safe practice when using public Wi-Fi?",
  options: [
    "Accessing banking without protection",
    "Using VPN for secure connection",
    "Sharing passwords openly",
    "Disabling antivirus software"
  ],
  answer: 1,
  explanation: "VPNs help secure data when using public networks."
  },
  {
  question: "Which of the following best describes the main purpose of presentation tools?",
  options: [
    "To store large databases",
    "To create and display information in slide format",
    "To detect viruses in a system",
    "To perform complex calculations only"
  ],
  answer: 1,
  explanation: "Presentation tools like PowerPoint are used to present information visually using slides."
},
{
  question: "Which feature in presentation software is used to add motion effects to objects?",
  options: [
    "Animations",
    "Formulas",
    "Filters",
    "Macros"
  ],
  answer: 0,
  explanation: "Animations add movement effects to text, images, and objects in slides."
},
{
  question: "What is the main purpose of data backup?",
  options: [
    "To increase file size",
    "To protect data against loss or corruption",
    "To speed up internet connection",
    "To delete unused files automatically"
  ],
  answer: 1,
  explanation: "Backup ensures data can be recovered if lost or damaged."
},
{
  question: "Which backup method stores only files that have changed since the last backup?",
  options: [
    "Full backup",
    "Incremental backup",
    "Manual backup",
    "System restore"
  ],
  answer: 1,
  explanation: "Incremental backup saves only newly changed or added data."
},
{
  question: "Which of the following is a basic encryption tool concept?",
  options: [
    "Converting readable data into unreadable form without a key",
    "Deleting files permanently",
    "Copying files to another folder",
    "Compressing files only"
  ],
  answer: 0,
  explanation: "Encryption converts data into a coded form that requires a key to access."
},
{
  question: "Which of the following is a strong example of safe internet practice?",
  options: [
    "Clicking unknown attachments",
    "Using strong unique passwords for different accounts",
    "Sharing login details with friends",
    "Disabling security updates"
  ],
  answer: 1,
  explanation: "Using unique strong passwords reduces the risk of account compromise."
},
{
  question: "What is the main purpose of password managers?",
  options: [
    "To delete old accounts",
    "To store and manage passwords securely",
    "To create viruses",
    "To speed up browsing"
  ],
  answer: 1,
  explanation: "Password managers securely store and organize login credentials."
},
{
  question: "Which of the following best describes data recovery?",
  options: [
    "Deleting all files permanently",
    "Restoring lost or damaged data from backups",
    "Encrypting files for protection",
    "Compressing data files"
  ],
  answer: 1,
  explanation: "Data recovery involves restoring lost or corrupted data using backup systems."
},
{
  question: "Which of the following is a common cyber threat?",
  options: [
    "Firewall",
    "Phishing",
    "Spreadsheet",
    "Backup system"
  ],
  answer: 1,
  explanation: "Phishing is a cyber attack that tricks users into revealing sensitive information."
},
{
  question: "What is the primary purpose of antivirus software?",
  options: [
    "To design presentations",
    "To detect and remove malicious software",
    "To increase storage space",
    "To edit documents"
  ],
  answer: 1,
  explanation: "Antivirus software protects systems by detecting and removing malware."
},
{
  question: "Which of the following is an example of ethical data handling?",
  options: [
    "Selling user data without permission",
    "Using data only for authorized purposes",
    "Sharing passwords publicly",
    "Accessing private files illegally"
  ],
  answer: 1,
  explanation: "Ethical data handling means using data responsibly and with permission."
},
{
  question: "Which of the following best describes system backup frequency?",
  options: [
    "Never performing backups",
    "Regularly creating copies of important data",
    "Deleting old files weekly",
    "Installing new software daily"
  ],
  answer: 1,
  explanation: "Regular backups ensure data can be restored if lost."
},
{
  question: "Which tool helps protect data during transmission over networks?",
  options: [
    "Encryption tools",
    "Spreadsheet tools",
    "Presentation tools",
    "Word processors"
  ],
  answer: 0,
  explanation: "Encryption tools secure data while it is being transmitted."
 },
 {
  question: "Which of the following best describes cyber security incident reporting?",
  options: [
    "Ignoring system errors until they disappear",
    "Documenting and reporting security breaches for investigation",
    "Deleting log files automatically",
    "Increasing system speed during attacks"
  ],
  answer: 1,
  explanation: "Incident reporting involves documenting security issues so they can be investigated and resolved."
},
{
  question: "Which of the following is a key benefit of using encryption?",
  options: [
    "It increases screen brightness",
    "It protects data by making it unreadable without a key",
    "It deletes viruses automatically",
    "It improves internet speed"
  ],
  answer: 1,
  explanation: "Encryption secures data by converting it into a coded form that requires a key to read."
},
{
  question: "Which of the following is the best example of digital responsibility?",
  options: [
    "Sharing fake news online",
    "Respecting copyright laws and using information ethically",
    "Hacking systems for practice",
    "Sharing others' passwords"
  ],
  answer: 1,
  explanation: "Digital responsibility involves ethical and legal use of digital resources."
},
{
  question: "Which of the following is a common feature of system monitoring tools?",
  options: [
    "Creating slideshows",
    "Monitoring CPU and memory usage",
    "Editing documents",
    "Designing graphics"
  ],
  answer: 1,
  explanation: "System monitoring tools track system performance such as CPU and RAM usage."
},
{
  question: "Which of the following best describes malware?",
  options: [
    "Software used to improve system speed",
    "Malicious software designed to damage or disrupt systems",
    "A type of spreadsheet software",
    "A backup utility tool"
  ],
  answer: 1,
  explanation: "Malware refers to harmful software created to disrupt or damage systems."
},
{
  question: "Which of the following is a strong password practice?",
  options: [
    "Using '123456' as password",
    "Using a combination of letters, numbers, and symbols",
    "Using your name as password",
    "Reusing one password for all accounts"
  ],
  answer: 1,
  explanation: "Strong passwords combine different character types for better security."
},
{
  question: "Which of the following is an example of safe internet practice?",
  options: [
    "Clicking unknown links",
    "Logging out after using public computers",
    "Sharing OTP with friends",
    "Using weak passwords"
  ],
  answer: 1,
  explanation: "Logging out prevents unauthorized access to accounts."
},
{
  question: "Which of the following best describes data integrity?",
  options: [
    "The speed of internet connection",
    "Accuracy and consistency of data over time",
    "The size of a file",
    "The type of software used"
  ],
  answer: 1,
  explanation: "Data integrity ensures data remains accurate and unchanged unless properly modified."
},
{
  question: "Which of the following is a risk of poor password management?",
  options: [
    "Faster login experience",
    "Unauthorized access to accounts",
    "Improved encryption",
    "Better system performance"
  ],
  answer: 1,
  explanation: "Weak password management increases the risk of hacking and unauthorized access."
},
{
  question: "Which of the following best describes cloud security?",
  options: [
    "Security of physical computers only",
    "Protection of data stored and processed in cloud environments",
    "Increasing internet speed",
    "Designing software applications"
  ],
  answer: 1,
  explanation: "Cloud security protects data and services hosted in cloud systems."
}
];  
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

  
  
         
    

    
    
  
  
    
      
    
    

  


  
    





    
    
  
    
