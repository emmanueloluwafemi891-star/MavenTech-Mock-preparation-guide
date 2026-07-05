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
  timeLeft = course === "GST112" ? 6000 : 1800;

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

// ===== HELPER: GET CORRECT ANSWER INDEX (handles both index- and text-based answer formats) =====
function getCorrectIndex(q) {
  if (typeof q.answer === "number") {
    return q.answer;
  }
  return q.options.indexOf(q.answer);
}

function proceedWithSubmit() {
  clearInterval(timer);

  let score = 0;

  selectedCourse.forEach((q, i) => {
    if (userAnswers[i] === getCorrectIndex(q)) {
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
      total: selectedCourse.length,
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

const correctIndex = getCorrectIndex(q);
const correct = q.options[correctIndex];
const isCorrect = userAnswers[i] === correctIndex;

div.classList.add(isCorrect ? "review-correct" : "review-wrong");

  div.innerHTML = `
    <h4>Question ${i + 1}</h4>
    <p>${q.question}</p>

    <p>Your Answer: ${user ?? "No answer"} ${isCorrect ? "✅" : "❌"}</p>

    <p style="color:#22c55e;font-weight:bold;">Correct Answer: ${correct ?? "Not set"}</p>

    <p>Explanation: ${q.working ?? q.explanation ?? "No explanation"}</p>

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
    CYB104,
    CHM102,
    BIO102
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
      <p>Score: ${result.score}/${result.total ?? "?"}</p>
      <p>Percentage: ${result.percentage}%</p>
    `;
  }
};
const GST112 = [
  {
    question: "Which zone is NOT one of the four divisions used to categorize the country for this course?",
    options: [
      "Central Zone",
      "Eastern Zone",
      "Southern Zone",
      "Northern Zone"
    ],
    answer: 2,
    explanation: "The course explicitly divides the country into four zones: Northern, Central, Western, and Eastern. There is no Southern Zone."
  },
  {
    question: "What language unites all the Kanem-Bornu people?",
    options: [
      "Hausa",
      "Kanuri",
      "Fulfulde",
      "Tamasheq"
    ],
    answer: 1,
    explanation: "Kanuri is stated as the language that unites all the Kanem-Bornu people."
  },
  {
    question: "What technology did the first settlers (So people) develop a sophisticated culture around?",
    options: [
      "Terracotta sculpting",
      "Gold mining",
      "Bronze casting",
      "Iron technology"
    ],
    answer: 3,
    explanation: "The So people built a sophisticated socio-political culture based on agriculture and iron technology."
  },
  {
    question: "Which Arab hero established the Saifawa dynasty in the 9th-10th century?",
    options: [
      "Saif b. Dhiyazan",
      "Bayajida",
      "Uthman dan Fodio",
      "Al-Kanemi"
    ],
    answer: 0,
    explanation: "Saif b. Dhiyazan is credited with founding the state and establishing the Saifawa dynasty."
  },
  {
    question: "Who held the highest authority in Kanem-Bornu?",
    options: [
      "The Kaigama",
      "The Maini Kanendi",
      "The Galadima",
      "The Mai"
    ],
    answer: 3,
    explanation: "The Mai (king) was the highest political authority in Kanem-Bornu."
  },
  {
    question: "What was the Magira's role in Kanem-Bornu?",
    options: [
      "The King's Sister",
      "The Army Commander",
      "The Queen Mother",
      "The Chief Judge"
    ],
    answer: 2,
    explanation: "Magira was the title given to the highly respected Queen Mother in Kanem-Bornu."
  },
  {
    question: "What was the primary duty of the Nokena state council?",
    options: [
      "To select the royal bride",
      "To offer the king useful advice",
      "To collect taxes",
      "To command the bush garrison"
    ],
    answer: 1,
    explanation: "This twelve-member imperial council's principal duty was to advise the king."
  },
  {
    question: "Who served as chief judge and legal adviser to the Mai?",
    options: [
      "The Maini Kanendi",
      "The Achuwo",
      "The Yerima",
      "The Meshema"
    ],
    answer: 0,
    explanation: "The Maini Kanendi played the major role of chief judge and legal adviser of the state."
  },
  {
    question: "How was the professional Kanem-Bornu army strategically divided?",
    options: [
      "Naval corps and Ground units",
      "Infantry and Cavalry",
      "Royal guards and Border patrols",
      "Home division and Bush garrison"
    ],
    answer: 3,
    explanation: "The army was divided into two strategic divisions: the Home division and the Bush garrison."
  },
  {
    question: "Which title is NOT Kanem-Bornu nobility?",
    options: [
      "Galadima",
      "Kaigama",
      "Sarki",
      "Yerima"
    ],
    answer: 2,
    explanation: "Sarki is a Hausa head title, while Galadima, Kaigama, and Yerima were Kanem-Bornu titled nobility."
  },
  {
    question: "From which city did Bayajida travel before reaching Kanem-Bornu and Hausaland?",
    options: [
      "Cairo",
      "Baghdad",
      "Tripoli",
      "Mecca"
    ],
    answer: 1,
    explanation: "Legend holds that Bayajida came from Baghdad before reaching Kanem-Bornu and Hausaland."
  },
  {
    question: "What heroic act impressed the Queen of Daura?",
    options: [
      "He killed a dangerous snake in a well",
      "He brought Islamic books",
      "He built a city wall",
      "He defeated an invading army"
    ],
    answer: 0,
    explanation: "Bayajida killed a dangerous snake in a well, enabling the people of Daura to draw water again, impressing the Queen."
  },
  {
    question: "Who was Bayajida's son whose children formed the core Hausa states?",
    options: [
      "Lamurudu",
      "Biran",
      "Bawo",
      "Tsoede"
    ],
    answer: 2,
    explanation: "Bawo's six children went on to found the core Hausa states."
  },
  {
    question: "Which state belongs to the Hausa Bokwoi (original seven)?",
    options: [
      "Kebbi",
      "Zazzau",
      "Zamfara",
      "Nupe"
    ],
    answer: 1,
    explanation: "Zazzau is listed alongside Daura, Katsina, Kano, Rano, and Gobir as one of the original seven Hausa states."
  },
  {
    question: "Which state is classified as Hausa Banza (bastard state)?",
    options: [
      "Jukun",
      "Rano",
      "Gobir",
      "Katsina"
    ],
    answer: 0,
    explanation: "Jukun is listed as one of the seven Hausa Banza (illegitimate/bastard) states, unlike the Hausa Bokwoi."
  },
  {
    question: "From which river valley did the Fulani communities originally derive?",
    options: [
      "Niger River valley",
      "Benue River valley",
      "Nile River valley",
      "Senegal River valley"
    ],
    answer: 3,
    explanation: "The Senegal River valley is stated as the original Fulani homeland."
  },
  {
    question: "What was the predominant religion of the nomadic Cattle Fulani?",
    options: [
      "Islam",
      "Animism",
      "Christianity",
      "Judaism"
    ],
    answer: 1,
    explanation: "Unlike the Islamic, sedentary Town Fulani, the nomadic Cattle Fulani were predominantly animist."
  },
  {
    question: "In whose court was Uthman dan Fodio a tutor before his jihad?",
    options: [
      "The King of Gobir",
      "The Attah of Igala",
      "The Etsu of Nupe",
      "The Mai of Bornu"
    ],
    answer: 0,
    explanation: "Uthman dan Fodio served as tutor and adviser in the Gobir court on the eve of his jihad."
  },
  {
    question: "What is the plural term the Fulani use for themselves?",
    options: [
      "Fellata",
      "Fulfulde",
      "Fulbe",
      "Fulo"
    ],
    answer: 2,
    explanation: "Fulo is the singular form; Fulbe is the plural form the Fulani use for themselves."
  },
  {
    question: "What title means ruler of the land in Hausa?",
    options: [
      "Madawaki",
      "Galadima",
      "Alkali",
      "Sarkin Kasar"
    ],
    answer: 3,
    explanation: "Sarkin Kasar, given to an effective Hausa head of state, literally means ruler of the land."
  },
  {
    question: "Which title was NOT created by Hausaland's Islamization?",
    options: [
      "Yari Sarki",
      "Maini Kanendi",
      "Sarki Yau",
      "Dogari"
    ],
    answer: 1,
    explanation: "Maini Kanendi is a Kanem-Bornu title (chief judge), not one created during Hausaland's Islamic transition."
  },
  {
    question: "Which group lived in a centralized state system in the Central Zone before 1800?",
    options: [
      "Idoma",
      "Ebirra",
      "Nupe",
      "Tiv"
    ],
    answer: 2,
    explanation: "Unlike most Central Zone groups which were non-centralized, the Nupe had a centralized state before 1800."
  },
  {
    question: "Who was the founder of the Nupe kingdom, son of an Igala king?",
    options: [
      "Tsoede",
      "Muazu",
      "Abutu Eje",
      "Ayagba"
    ],
    answer: 0,
    explanation: "Tradition holds that Tsoede, son of an Igala king and a Nupe woman, founded the Nupe kingdom."
  },
  {
    question: "What is the royal title of the king of Nupeland?",
    options: [
      "Sarki",
      "Aku Uka",
      "Attah",
      "Etsu"
    ],
    answer: 3,
    explanation: "Etsu became the standing royal title for Nupe rulers."
  },
  {
    question: "Why was Etsu Jibrilu driven from the throne in 1762?",
    options: [
      "He aroused strong anti-Islamic forces against his rule",
      "Lost a war against Benin",
      "Failed harvest",
      "Tried to move the capital"
    ],
    answer: 0,
    explanation: "Etsu Jibrilu aroused strong anti-Islamic opposition which led directly to his removal from the throne."
  },
  {
    question: "Which trading center connected the Benin and Oyo trade routes?",
    options: [
      "Idah",
      "Nupako",
      "Lima",
      "Gbara"
    ],
    answer: 3,
    explanation: "Gbara functioned as an important trading center linking Benin and Oyo trade routes."
  },
  {
    question: "What is the capital of the Igala people?",
    options: [
      "Wukari",
      "Idah",
      "Raba",
      "Gboko"
    ],
    answer: 1,
    explanation: "Idah has traditionally been the Igala capital and seat of the Attah of Igala."
  },
  {
    question: "Which animal is legendary for rearing Abutu Eje?",
    options: [
      "Snake",
      "Snail",
      "Leopard",
      "Cockerel"
    ],
    answer: 2,
    explanation: "Legend has Abutu Eje reared by a leopard, which is why the name Eje is associated with leopard."
  },
  {
    question: "Which ancestor helped the Igala break from Jukun rule?",
    options: [
      "Ayagba",
      "Oranmiyan",
      "Tsoede",
      "Achadu"
    ],
    answer: 0,
    explanation: "Ayagba, also called Idoko, is remembered as the ancestor who helped free Igala from Jukun dominance."
  },
  {
    question: "Whose religious supremacy did the Jukun confederation recognize?",
    options: [
      "Achuwo",
      "Zitzu",
      "Abo Zike",
      "Aku Uka"
    ],
    answer: 3,
    explanation: "The Jukun state was a confederation unified by recognition of the Aku Uka's religious supremacy."
  },
  {
    question: "Who served as Prime Minister and head of the Aku Uka's Council of nobles?",
    options: [
      "Aku Nako",
      "Achuwo",
      "Mbavessen",
      "Kinda Achuwo"
    ],
    answer: 1,
    explanation: "The Achuwo headed the Council of Nobles and functioned as prime minister to the Aku Uka."
  },
  {
    question: "Who classified the Tiv as the largest ethnic group in the middle Benue basin in 1953?",
    options: [
      "Egharevba",
      "Igbafe",
      "P. Bohannan",
      "Samuel Johnson"
    ],
    answer: 2,
    explanation: "P. Bohannan authored the 1953 book The Tiv of Central Nigeria and made this classification."
  },
  {
    question: "What is the largest recognized family group in Tiv socio-political structure?",
    options: [
      "Zitzu",
      "Tsombor",
      "Ityough",
      "Mbavessen"
    ],
    answer: 1,
    explanation: "Tsombor was the largest traditional family unit recognized in Tiv society."
  },
  {
    question: "Who originally used the term Yoruba to mean only Oyo dialect speakers?",
    options: [
      "The Fulani",
      "The Portuguese",
      "The Hausa",
      "The British"
    ],
    answer: 2,
    explanation: "The term Yoruba was originally a Hausa designation applied only to speakers of the Oyo dialect."
  },
  {
    question: "Who, according to Samuel Johnson, migrated from Mecca as the Yoruba progenitor?",
    options: [
      "Oranmiyan",
      "Lamurudu",
      "Obatala",
      "Oduduwa"
    ],
    answer: 3,
    explanation: "Johnson recorded Oduduwa as the son of Lamurudu, King of Mecca, and the progenitor of the Yoruba."
  },
  {
    question: "Who got drunk with palm wine and lost leadership in the Oke Oramfe version of Yoruba origin?",
    options: [
      "Obatala",
      "Oranmiyan",
      "Afonja",
      "Oduduwa"
    ],
    answer: 0,
    explanation: "Obatala's drunkenness allowed Oduduwa to seize leadership, according to the Oke Oramfe version."
  },
  {
    question: "Which king oversaw Oyo's zenith of power before rebellion followed?",
    options: [
      "Alaafin Awole",
      "Afonja of Ilorin",
      "Oranyan",
      "Alaafin Abiodun"
    ],
    answer: 3,
    explanation: "Oyo reached its peak under Alaafin Abiodun's reign before his successor Awole faced rebellion."
  },
  {
    question: "Which council of seven regulated the Alaafin's powers in the Oyo Empire?",
    options: [
      "The Oyomesi",
      "The Ogboni",
      "The Ilari",
      "The Uzama"
    ],
    answer: 0,
    explanation: "The Oyomesi, a seven-member council, checked the Alaafin's authority and could remove him if necessary."
  },
  {
    question: "Who headed the Oyomesi and acted as prime minister in Oyo?",
    options: [
      "The Ilari",
      "The Are-Ona-Kankanfo",
      "The Bashorun",
      "The Baale"
    ],
    answer: 2,
    explanation: "The Bashorun led the Oyomesi council in a prime-ministerial capacity."
  },
  {
    question: "What title was given to the supreme head of Oyo's military forces?",
    options: [
      "Bashorun",
      "Are-Ona-Kankanfo",
      "Ilari",
      "Dogari"
    ],
    answer: 1,
    explanation: "The Are-Ona-Kankanfo was the coveted title given to the supreme head of the Oyo military."
  },
  {
    question: "Which festival was used by the Alaafin to acknowledge provincial governors' renewed allegiance?",
    options: [
      "The Bere Festival",
      "The Swem Festival",
      "The Sharia Festival",
      "The Ife Festival"
    ],
    answer: 0,
    explanation: "The annual Bere Festival marked the occasion of provincial governors renewing their allegiance to the Alaafin."
  },
  {
    question: "In which year did the Portuguese first arrive in Benin during the reign of Ewuare?",
    options: [
      "1504 A.D.",
      "1472 A.D.",
      "1404 A.D.",
      "1604 A.D."
    ],
    answer: 1,
    explanation: "Ruy de Sequeira arrived in Benin in 1472 A.D. during the reign of Oba Ewuare."
  },
  {
    question: "What did Osanobua's youngest child use to create land out of water?",
    options: [
      "A lump of white cloth",
      "An iron rod",
      "A snail shell",
      "A magical bow"
    ],
    answer: 2,
    explanation: "He overturned a snail shell filled with sand onto the water to form dry land, according to Bini mythology."
  },
  {
    question: "What is the name of the first period of pre-colonial Bini history, called the kings of the sky era?",
    options: [
      "Evian era",
      "Oranmiyan era",
      "Eweka era",
      "Ogiso era"
    ],
    answer: 3,
    explanation: "Ogiso translates roughly to kings of the sky, naming this founding era of pre-colonial Benin history."
  },
  {
    question: "Who was the last ruler of the sky-kings era whose son was banished?",
    options: [
      "Owodo",
      "Igbodo",
      "Orire",
      "Ere"
    ],
    answer: 0,
    explanation: "Owodo clashed with the nobles and through court intrigue his son Ekaladeran was banished."
  },
  {
    question: "Which town was founded by the banished Bini prince Ekaladeran?",
    options: [
      "Erua",
      "Wukari",
      "Ughoton",
      "Idah"
    ],
    answer: 2,
    explanation: "Ekaladeran founded the port-town of Ughoton after his banishment from Benin."
  },
  {
    question: "Which leader did the Benin elders request a new ruler from?",
    options: [
      "The Attah of Igala",
      "The Ooni of Ife",
      "The Mai of Bornu",
      "The Alaafin of Oyo"
    ],
    answer: 1,
    explanation: "After a political stalemate, the Benin elders sent a delegation to the Ooni of Ife requesting a new ruler."
  },
  {
    question: "What phrase did Oranmiyan use to describe Benin as a land of vexation?",
    options: [
      "Kwararafa",
      "Hausa Bokwoi",
      "Ile-Ife",
      "Ile-Ibinu"
    ],
    answer: 3,
    explanation: "Ile-Ibinu, meaning land of vexation or trouble, reflected Oranmiyan's frustration with Benin territory."
  },
  {
    question: "Who was the first Oba of Benin, born to a Bini woman?",
    options: [
      "Ewuare",
      "Eweka I",
      "Evian",
      "Ogiamen"
    ],
    answer: 1,
    explanation: "Eweka I was Oranmiyan's son, born to a Bini woman, and became the first Oba of Benin."
  },
  {
    question: "Which group is NOT one of Benin's Adesotu nobility groups?",
    options: [
      "The Uzama",
      "The Eghaevbo n' Ogbe",
      "The Oyomesi",
      "The Eghaevbo n' ore"
    ],
    answer: 2,
    explanation: "The Oyomesi is a Yoruba/Oyo institution and is not part of Benin's three-tier nobility structure."
  },
  {
    question: "What specific inheritance system determined succession to the throne of the Oba of Benin?",
    options: [
      "Ultimate selection by the Ogboni",
      "Selection through oracle consultation by the Uzama",
      "Rotational system among three royal lineages",
      "Primogeniture — the first surviving son"
    ],
    answer: 3,
    explanation: "Succession to the Benin throne was strictly by primogeniture, passing to the first surviving son."
  },
  {
    question: "What were the professional and craft organizations of the common people called in Benin?",
    options: [
      "Guilds",
      "Nka",
      "Polo",
      "Wari"
    ],
    answer: 0,
    explanation: "Ordinary Benin citizens organized into professional craft guilds based on their trade or occupation."
  },
  {
    question: "Which Benin king lost his life returning from a military campaign, ending the practice of kings leading armies?",
    options: [
      "Ewuare",
      "Ozolua",
      "Ehengbuda",
      "Esigie"
    ],
    answer: 2,
    explanation: "Ehengbuda's death on campaign ended the tradition of Benin kings personally leading armies into battle."
  },
  {
    question: "How did the Oba's role change after kings stopped leading armies?",
    options: [
      "He became a semi-divine ruler occupied in an endless round of ritual",
      "He relocated the capital",
      "He was replaced by a council of town chiefs",
      "He became a purely political administrator"
    ],
    answer: 0,
    explanation: "After Ehengbuda, the Oba withdrew into a largely ceremonial, ritual-focused semi-divine role."
  },
  {
    question: "Which prince founded the Itsekiri kingdom according to Bini and Itsekiri traditions?",
    options: [
      "Oranmiyan",
      "Evian",
      "Oba Olua",
      "Iginua"
    ],
    answer: 3,
    explanation: "Iginua, a 15th-century Benin prince and son of Oba Olua, is credited with founding the Itsekiri kingdom."
  },
  {
    question: "Why did Oba Olua arrange a new kingdom outside Benin for his heir?",
    options: [
      "The prince wanted to explore Atlantic trade",
      "The prince gave disastrous advice that made him deeply unpopular",
      "The oracle commanded it",
      "The Uzama tried to assassinate the prince"
    ],
    answer: 1,
    explanation: "The prince's disastrous advice made him deeply unpopular with the Benin people, making it unwise for him to rule there."
  },
  {
    question: "What is the historic capital of the Itsekiri Kingdom?",
    options: [
      "Benin River settlement",
      "Escravos",
      "Ode Itsekiri",
      "Forcados"
    ],
    answer: 2,
    explanation: "Ode Itsekiri is the historic capital and traditional seat of the Itsekiri kingdom."
  },
  {
    question: "What title was held by the supreme ruler of the Itsekiri Kingdom?",
    options: [
      "Olu",
      "Ovie",
      "Amanyanabo",
      "Oba"
    ],
    answer: 0,
    explanation: "The Itsekiri were uniquely ruled by a centralized monarch styled the Olu."
  },
  {
    question: "What is the name of the advisory council of seven nobles assisting the Itsekiri ruler?",
    options: [
      "Nokena",
      "Oyomesi",
      "Uzama",
      "Ojoye"
    ],
    answer: 3,
    explanation: "The Ojoye was the council of seven nobles that assisted the Olu of Itsekiri in governance."
  },
  {
    question: "Which Urhobo tradition claims the Urhobo originated directly from the Ijaw?",
    options: [
      "Oogun and Olomu version",
      "Ughelli, Aghara and Ogo version",
      "Uwherun, Abraka and Agbon version",
      "The Benin immigrant version"
    ],
    answer: 1,
    explanation: "The Ughelli, Aghara and Ogo version of Urhobo tradition specifically claims direct Ijaw origin."
  },
  {
    question: "What traditional title is given to the ruler of an individual Urhobo village?",
    options: [
      "Ovie",
      "Zitzu",
      "Olu",
      "Oba"
    ],
    answer: 0,
    explanation: "Ovie is the traditional title given to the ruler of an individual Urhobo village."
  },
  {
    question: "How was the adult male population structured in traditional Urhobo society?",
    options: [
      "Divided strictly by wealth status",
      "Separated into seven royal lineages",
      "Structured into secret hunter societies",
      "Divided into age sets corresponding with youth, middle age, and elders"
    ],
    answer: 3,
    explanation: "Traditional Urhobo society divided adult males into age sets of youth, middle age, and elders."
  },
  {
    question: "The Eastern Zone is generally characterized by which political structure?",
    options: [
      "Federal monarchies",
      "Theocratic military command centers",
      "Non-centralised societies",
      "Strongly centralized empires"
    ],
    answer: 2,
    explanation: "The Eastern Zone is generally characterized by non-centralized, acephalous political societies."
  },
  {
    question: "What major factor stimulated small Ijo villages to develop into states?",
    options: [
      "Adoption of the Nri religious system",
      "The growth of the Atlantic trade",
      "Invasion by Benin forces",
      "The introduction of Sharia law"
    ],
    answer: 1,
    explanation: "The growth of the Atlantic trade was the major factor that stimulated Ijo villages to develop into larger states."
  },
  {
    question: "Which term describes the segmentary, kingless way of life historically associated with the Igbo?",
    options: [
      "Autocratic",
      "Despotic",
      "Acephalous",
      "Theocratic"
    ],
    answer: 2,
    explanation: "Acephalous means headless — describing the Igbo's traditional system without a central king."
  },
  {
    question: "Which is NOT one of the five Igbo sub-cultural groups?",
    options: [
      "The Central Valley Igbo",
      "The Igbo of eastern Nigeria",
      "The Western Igbo",
      "The Northern Igbo"
    ],
    answer: 0,
    explanation: "The actual five groups are Eastern, South-eastern, North-eastern, Western, and Northern Igbo. Central Valley is not one of them."
  },
  {
    question: "Which sacred object symbolized the decentralization of power in traditional Igbo political systems?",
    options: [
      "The Etsu staff",
      "The Aku Uka staff",
      "The Snail shell",
      "The Ofo staff"
    ],
    answer: 3,
    explanation: "The Ofo staff symbolized authority and was held by lineage heads, reflecting the decentralized Igbo political system."
  },
  {
    question: "According to the Nri version, who descended from the sky and sailed down the Anambra River?",
    options: [
      "Bawo",
      "Eri",
      "Tsoede",
      "Swem"
    ],
    answer: 1,
    explanation: "Eri is the founding ancestor in the Nri version of Igbo origin, said to have descended from the sky."
  },
  {
    question: "Why is it historically difficult to reconcile the various versions of Igbo origin?",
    options: [
      "Language was not mutually intelligible",
      "Igbo society was highly centralized under one king",
      "British records destroyed oral histories",
      "The society was acephalous with limited professional historians"
    ],
    answer: 3,
    explanation: "The acephalous nature of Igbo society meant there was no central authority to unify historical accounts, and few professional historians recorded them."
  },
  {
    question: "What was the traditional general assembly where male adults met to make final village decisions?",
    options: [
      "Afe Isong",
      "Nokena",
      "Amala Oha",
      "Ofo assembly"
    ],
    answer: 2,
    explanation: "The Amala Oha was the general assembly where all male adults gathered in the village square to make final decisions."
  },
  {
    question: "On what factor was social recognition and responsibility based in traditional Igbo society?",
    options: [
      "Individual capability and age",
      "Royal family background and lineage wealth",
      "Selection by centralized palace chiefs",
      "Inheritance from the mother's compound"
    ],
    answer: 0,
    explanation: "Social recognition in traditional Igbo society was based on individual capability and age, reflecting its democratic structure."
  },
  {
    question: "Before the Atlantic trade, what were the two internal divisions of a typical small Ijo settlement?",
    options: [
      "Fiefdoms and Garrisons",
      "Wards (polo) and Households (wari)",
      "Kindreds and Emirates",
      "Age groups and Secret cults"
    ],
    answer: 1,
    explanation: "Small Ijo settlements were internally divided into Wards (polo) and Households (wari)."
  },
  {
    question: "What title was given to the head of the lineage that founded an Ijo village site?",
    options: [
      "Ovie",
      "Obong",
      "Amanyanabo",
      "Olu"
    ],
    answer: 2,
    explanation: "The Amanyanabo was the head of the founding lineage, a role that later became a political office."
  },
  {
    question: "What socio-political institution uniquely characterized Ijaw societies in response to Atlantic trade?",
    options: [
      "The Imperial State Council",
      "The House System",
      "The Divine Monarchy",
      "The Segmentary Lineage Framework"
    ],
    answer: 1,
    explanation: "The House System was a unique Ijaw institution that grew significantly in response to expanding Atlantic trade."
  },
  {
    question: "Which prominent neighboring group to the Efik is one of the three largest ethnic groups in Nigeria?",
    options: [
      "The Ibibio",
      "The Annang",
      "The Ijo",
      "The Igbo"
    ],
    answer: 3,
    explanation: "The Igbo are one of Nigeria's three largest ethnic groups and a prominent neighbor of the Efik people."
  },
  {
    question: "The four major Efik settlements came to be collectively known as what?",
    options: [
      "Calabar",
      "Nembe",
      "Bonny",
      "Opobo"
    ],
    answer: 0,
    explanation: "The four major Efik settlements — Obio Okot, Atakpa, Obutong, and Nsidung — came to be collectively called Calabar."
  },
  {
    question: "Through what political society was effective authority exercised in pre-colonial Efik communities?",
    options: [
      "The Ogboni society",
      "The Idiong cult",
      "The Ekpe society",
      "The Afe Isong society"
    ],
    answer: 2,
    explanation: "The Ekpe society was the dominant political institution through which authority was exercised in pre-colonial Efik communities."
  },
  {
    question: "What does Ibibio traditionally translate to?",
    options: [
      "Wealthy and powerful",
      "Tall or giant",
      "Eloquent or well-spoken",
      "Short or brief"
    ],
    answer: 3,
    explanation: "Ibibio traditionally translates to short or brief, referring to their brief and concise way of handling activities."
  },
  {
    question: "What term is used in some Ibibio areas for an extended family or lineage unit?",
    options: [
      "Idip",
      "Ekwere",
      "Wari",
      "Polo"
    ],
    answer: 1,
    explanation: "Ekwere is the term used in some Ibibio areas to refer to an extended family or lineage unit."
  },
  {
    question: "What economic staple of the Ibibio region was controlled by the highest-ranking Ekpo members?",
    options: [
      "The palm tree",
      "Yam harvesting",
      "Iron technology",
      "Atlantic fishing"
    ],
    answer: 0,
    explanation: "Control of palm trees and their produce was the economic privilege of the highest-ranking Amama in Ekpo society."
  },
  {
    question: "What was the title of the highest-ranking individuals in the Ibibio Ekpo society?",
    options: [
      "Zitzu",
      "Alkali",
      "Obong",
      "Amama"
    ],
    answer: 3,
    explanation: "The Amama were the highest-ranking members of the Ibibio Ekpo society who controlled most community wealth."
  },
  {
    question: "How were decisions traditionally enforced in Ibibio villages before colonial chieftaincy?",
    options: [
      "By the professional bush garrison army",
      "By direct vote of all female adults",
      "By masked Ekpe society members acting as ancestors' messengers",
      "By the chief legal adviser"
    ],
    answer: 2,
    explanation: "Masked members of the Ekpe society enforced decisions by acting as messengers and representatives of the ancestors."
  },
  {
    question: "What is the name of the earth deity in Ibibio religion, appeased via the Obom ceremony?",
    options: [
      "Ikpa Isong",
      "Swem",
      "Osanobua",
      "Ndem"
    ],
    answer: 0,
    explanation: "Ikpa Isong is the earth deity appeased through the Obom ceremony to increase harvests and make children plentiful."
  },
  {
    question: "Which famous missionary helped abolish the killing of twin babies among the Ibibio, Annang, and Oron?",
    options: [
      "Peter Farb",
      "Mary Slessor",
      "Samuel Bill",
      "Samuel Johnson"
    ],
    answer: 1,
    explanation: "Mary Slessor, a Scottish missionary, is famous for her role in ending the practice of killing twin babies in the region."
  },
  {
    question: "Which independent church was established by Samuel Bill at Ibeno and later spread to the Middle Belt?",
    options: [
      "The Apostolic Church",
      "The Methodist Church",
      "The Roman Catholic Church",
      "The Qua Iboe Church"
    ],
    answer: 3,
    explanation: "Samuel Bill established the Qua Iboe Church at Ibeno, which later spread significantly to the Middle Belt region."
  },
  {
    question: "What is the official written and spoken language variant serving the Ibibio people?",
    options: [
      "Kanuri Language",
      "Urhobo Language",
      "Ibibio-Efik Language",
      "Fulfulde Language"
    ],
    answer: 2,
    explanation: "The Ibibio-Efik Language is the official written and spoken language variant used by the Ibibio people."
  },
  {
    question: "How many local government areas do the Annang currently occupy in Akwa Ibom State?",
    options: [
      "Eight",
      "Six",
      "Twelve",
      "Four"
    ],
    answer: 0,
    explanation: "The Annang occupy eight out of thirty-one local government areas in Akwa Ibom State."
  },
  {
    question: "What does Idip literally translate to in the Annang social structure?",
    options: [
      "Compound",
      "Womb",
      "Ancestor",
      "Village"
    ],
    answer: 1,
    explanation: "Idip literally translates to womb, as individuals locate their place in the social world from the womb."
  },
  {
    question: "In Annang social hierarchy, several ufoks combine to form what unit?",
    options: [
      "Idung",
      "Awio",
      "Nka",
      "Ekpuks"
    ],
    answer: 3,
    explanation: "Several ufoks (houses/compounds) combine to form Ekpuks, meaning an extended family unit."
  },
  {
    question: "What is the legislative arm of elderly males governing traditional Annang village life?",
    options: [
      "Afe Isong",
      "Nokena",
      "Nka",
      "Oyomesi"
    ],
    answer: 0,
    explanation: "The Afe Isong is the legislative body of elderly males that governed traditional Annang village life."
  },
  {
    question: "What title is given to the first-born female in an Annang family?",
    options: [
      "Magira",
      "Adiaha",
      "Shaba",
      "Abia Idiong"
    ],
    answer: 1,
    explanation: "Adiaha is the title given to the first-born female in an Annang family, commanding great respect."
  },
  {
    question: "According to American anthropologist Peter Farb, what does Annang mean?",
    options: [
      "The children of the leopard",
      "They who fight bravely",
      "They who speak well",
      "Settlers of the coast"
    ],
    answer: 2,
    explanation: "Peter Farb recorded that Annang means they who speak well, reflecting their reputation for eloquence."
  },
  {
    question: "Besides aesthetics, what was the primary educational purpose of the fattening room for young Annang brides?",
    options: [
      "To prepare them for the Ekpe society",
      "To train them in military defense",
      "To initiate them into iron technology guilds",
      "To teach housekeeping, child care, history, and citizenship"
    ],
    answer: 3,
    explanation: "The fattening room served as an educational institution teaching young brides housekeeping, child care, history, and citizenship."
  },
  {
    question: "Why did traditional Annang children historically bear their mothers' names before British colonial changes?",
    options: [
      "The society was semi-matriarchal",
      "The village chief assigned names based on farming plots",
      "Fathers were forbidden from having names",
      "Women controlled the Afe Isong assembly"
    ],
    answer: 0,
    explanation: "The Annang society was semi-matriarchal, which is why children traditionally bore their mothers' names."
  },
  {
    question: "In the Twi language of Ghana, what does Annang mean?",
    options: [
      "Twin babies",
      "First daughter",
      "Fourth son",
      "Wise elder"
    ],
    answer: 2,
    explanation: "In Twi (Ghana), Annang means fourth son, tracing back to the Annang people's migration history."
  },
  {
    question: "Members of the Eka Abiakpo clan observe a strict food taboo against eating which animal?",
    options: [
      "Squirrel",
      "Turtle",
      "Snake",
      "Goat"
    ],
    answer: 1,
    explanation: "Members of the Eka Abiakpo clan observe a strict taboo against eating turtle as part of their cultural tradition."
  },
  {
    question: "What animal did the Afaha clan forbid eating due to its quickness and intelligence?",
    options: [
      "Cockerel",
      "Leopard",
      "Squirrel",
      "Turtle"
    ],
    answer: 2,
    explanation: "The Afaha clan forbade eating squirrel, regarding its quickness and intelligence with cultural respect."
  },
  {
    question: "Which liberated slave's 1854 account gave the first written mention of the Annang people?",
    options: [
      "Jaja",
      "Eri",
      "Tsoede",
      "Ebengo"
    ],
    answer: 3,
    explanation: "Ebengo, a liberated slave from Nkwot in Abak, provided the first written account of the Annang people recorded by Wilhelm Koelle in 1854."
  },
  {
    question: "Why did King Jaja of Opobo fight the Ikot Udo Obong Wars against the Annangs?",
    options: [
      "Trading in palm oil directly with British merchants",
      "Adopting Christianity",
      "Migrating into Cross River territory",
      "Refusing to pay allegiance to the Oba of Benin"
    ],
    answer: 0,
    explanation: "King Jaja fought the Annangs because they were trading palm oil directly with British merchants, bypassing his control."
  },
  {
    question: "In 1945, British authorities blamed leopard attacks in Ikot Okoro on which alleged secret society?",
    options: [
      "Idiong Cult",
      "Ekpeowo (The Human Leopards Society)",
      "Ogboni Cult",
      "Ekpe Ndem Isong"
    ],
    answer: 1,
    explanation: "British authorities blamed the Ekpeowo, known as The Human Leopards Society, for the 1945 leopard attacks in Ikot Okoro."
  },
  {
    question: "Which specific geographic feature marks the region North East of where versions of Kanem-Bornu origin are known to be exaggerated?",
    options: [
      "The Cross River",
      "The Benue River",
      "The Niger River",
      "The Lake Chad"
    ],
    answer: 3,
    explanation: "Lake Chad is the geographic landmark associated with the Kanem-Bornu region in the North East, where origin traditions are sometimes exaggerated."
  },
  {
    question: "Estimated population of the Hausa people by the year 2000?",
    options: [
      "Twenty million",
      "Ten million",
      "Fifteen million",
      "Thirty million"
    ],
    answer: 0,
    explanation: "The Hausa population was estimated at approximately twenty million by the year 2000."
  },
  {
    question: "In Kanem-Bornu's traditional political setup, who was specifically tasked with assisting the King in day-to-day administration?",
    options: [
      "The chief judge",
      "The Galadima",
      "The King's sister",
      "The King's mother"
    ],
    answer: 2,
    explanation: "The King's sister held an important administrative role, assisting the Mai in the day-to-day running of the kingdom."
  },
  {
    question: "Which title is explicitly listed as belonging to the servile institution of slaves and eunuchs in Kanem-Bornu?",
    options: [
      "Yerima",
      "Kachella",
      "Meshema",
      "Kaigama"
    ],
    answer: 1,
    explanation: "Kachella, alongside titles like Mushemu and Yuroma, belonged to the servile institution of slaves and eunuchs in Kanem-Bornu."
  },
  {
    question: "At which location did Bayajida have a son with the Mai of Bornu's daughter?",
    options: [
      "Gobir",
      "Kano",
      "Biran",
      "Daura"
    ],
    answer: 2,
    explanation: "Bayajida had a son called Biran with the Mai of Bornu's daughter, and the town of Biran was named after this son."
  },
  {
    question: "Which new legal role became commonplace during Hausaland's Islamization?",
    options: [
      "Alkali",
      "Dogari",
      "Madawaki",
      "Sarkin Kasar"
    ],
    answer: 0,
    explanation: "The rise of Sharia law made the Alkali (Islamic judge) a commonplace and important legal office in Hausaland."
  },
  {
    question: "The original Fulani homeland saw miscegenation between local inhabitants and immigrants of which extraction?",
    options: [
      "Egyptian immigrants",
      "Arab immigrants",
      "Tuareg immigrants",
      "Berber immigrants"
    ],
    answer: 3,
    explanation: "In the Senegal River valley, local inhabitants intermingled with Berber immigrants, contributing to the Fulani's mixed heritage."
  },
  {
    question: "What is the singular term the Fulani use to refer to an individual of their ethnic group?",
    options: [
      "Fulbe",
      "Pullo",
      "Fulo",
      "Peul"
    ],
    answer: 1,
    explanation: "Pullo is the standard singular term the Fulani use for an individual of their group, while Fulbe is the plural."
  },
  {
    question: "What language term is used to describe the tongue spoken by the Fulani?",
    options: [
      "Foulah",
      "Fellata",
      "Fulfulde",
      "Peul"
    ],
    answer: 2,
    explanation: "Fulfulde is the name of the language spoken by the Fulani people across West Africa."
  },
  {
    question: "Around which century did the nomadic Cattle Fulani begin migrating out of the River Senegal valley?",
    options: [
      "Twelfth century",
      "Seventeenth century",
      "Ninth century",
      "Fifteenth century"
    ],
    answer: 0,
    explanation: "The nomadic Cattle Fulani began their eastward migration from the Senegal River valley around the twelfth century."
  },
  {
    question: "Most peoples of the Central Zone lived in small non-centralised communities before which year?",
    options: [
      "1700",
      "1600",
      "1500",
      "1800"
    ],
    answer: 3,
    explanation: "The majority of Central Zone peoples lived in small, non-centralized communities before 1800."
  },
  {
    question: "At which location did Tsoede establish his very first capital in Nupeland?",
    options: [
      "Lima",
      "Nupako",
      "Gbara",
      "Raba"
    ],
    answer: 1,
    explanation: "Tsoede established his first capital at Nupako before the capital was later moved to other locations."
  },
  {
    question: "Which Nupe ruler was deposed after serving an eight-year period in the second half of the 18th century?",
    options: [
      "Jaja",
      "Edegi",
      "Etsu Jibrilu",
      "Muazu"
    ],
    answer: 3,
    explanation: "Muazu was deposed after an eight-year rule during the second half of the 18th century."
  },
  {
    question: "By 1800, dynastic wranglings split the Nupe kingdom into two parts centered where?",
    options: [
      "Nupako and Gbara",
      "Lima and Raba",
      "Idah and Wukari",
      "Kano and Bornu"
    ],
    answer: 1,
    explanation: "Succession disputes split the Nupe kingdom into two factions centered at Lima and Raba by 1800."
  },
  {
    question: "The pre-colonial Nupe state developed on the north bank of the Niger at its confluence with which river?",
    options: [
      "Anambra River",
      "Cross River",
      "Kaduna River",
      "Benue River"
    ],
    answer: 2,
    explanation: "The Nupe state developed at the confluence of the Niger and Kaduna rivers on the north bank."
  },
  {
    question: "Which specific noble title assisted the Etsu Nupe within the upper class?",
    options: [
      "Shaba",
      "Zitzu",
      "Achadu",
      "Amanyanabo"
    ],
    answer: 0,
    explanation: "The Shaba, alongside titles like Kpotuh and Maku, was a noble title that assisted the Etsu Nupe in governance."
  },
  {
    question: "The village head (Zitzu) in traditional Nupeland was directly appointed by whom?",
    options: [
      "The Council of Elders",
      "The Etsu",
      "The Prime Minister",
      "The Attah of Igala"
    ],
    answer: 1,
    explanation: "The Etsu Nupe directly appointed the Zitzu (village head) as his local representative."
  },
  {
    question: "Which version of Igala origin attributes its emergence to a person believed to have come from the Igbo country?",
    options: [
      "Achadu Version",
      "Abutu Eje Version",
      "Egyptian Version",
      "Yoruba Version"
    ],
    answer: 0,
    explanation: "The Achadu Version of Igala origin holds that Achadu came from Igbo country and married the Attah, becoming head of the kingmakers."
  },
  {
    question: "What is the name of the leader of the kingmakers who married the Attah in Igala tradition?",
    options: [
      "Tsoede",
      "Ayagba",
      "Idoko",
      "Achadu"
    ],
    answer: 3,
    explanation: "Achadu was the leader of the Igalla-mela (kingmakers) who married the Attah in the Achadu version of Igala origin."
  },
  {
    question: "The administrative power of each individual Igalla Mela territory was compared to which Yoruba socio-political body?",
    options: [
      "The Baales",
      "The Ogboni Cult",
      "The Oyomesi",
      "The Ilari"
    ],
    answer: 2,
    explanation: "Each Igalla Mela territory's power was compared to the Oyomesi of the Yoruba and also to Benin's Uzama Nihiron."
  },
  {
    question: "The traditional political structure of the Jukun people operated under which type of governance system?",
    options: [
      "A theocratic system",
      "A military dictatorship",
      "A decentralized segmentation",
      "A direct democracy"
    ],
    answer: 0,
    explanation: "The Jukun operated a theocratic system where the Aku Uka combined divine and political authority."
  },
  {
    question: "What physical factor did Jukun subjects use to judge and potentially bring down the Aku Uka's popularity?",
    options: [
      "His collection of tribute from lineages",
      "The quality of the agricultural harvest",
      "His performance in cross-border trade",
      "The number of external military raids"
    ],
    answer: 1,
    explanation: "The quality of the agricultural harvest was used as a measure of the Aku Uka's divine favor and popularity."
  },
  {
    question: "Which historical document is the most authentic source confirming Jukun raids on Hausaland and Bornu?",
    options: [
      "The History of the Yorubas",
      "The Koelle Account",
      "The Noah Records",
      "The Kano Chronicle"
    ],
    answer: 3,
    explanation: "The Kano Chronicle is cited as the most authentic historical document confirming Jukun (Kwararafa) raids on Hausaland and Bornu."
  },
  {
    question: "Which noble title served as second-in-command to the Achuwo in the Jukun Council of Nobles?",
    options: [
      "Kinda Achuwo",
      "Aku Nako",
      "Abo Zike",
      "Zitzu"
    ],
    answer: 2,
    explanation: "The Abo Zike served as second-in-command to the Achuwo in the Jukun Council of Nobles."
  },
  {
    question: "Per P. Bohannan's book, which regions flank the southern and eastern portions of the Tiv country?",
    options: [
      "The plains of the Senegal valley",
      "The creeks of the Niger Delta",
      "The banks of the Kaduna River",
      "The foothills of the Cameroon highlands"
    ],
    answer: 3,
    explanation: "P. Bohannan described the foothills of the Cameroon highlands as flanking the southern and eastern portions of Tiv country."
  },
  {
    question: "In the hierarchical layout of Tiv segmentary society, which unit sits at the lowest level?",
    options: [
      "The family",
      "The individual",
      "The clan",
      "The kindred"
    ],
    answer: 1,
    explanation: "The individual sits at the lowest level of Tiv segmentary society, with family, kindred, and larger units above."
  },
  {
    question: "Which Christian groups extended the designation 'Yoruba' to dialect groups other than Oyo from the 19th century onward?",
    options: [
      "Christian missionaries",
      "Portuguese explorers",
      "British military officers",
      "Islamic scholars"
    ],
    answer: 0,
    explanation: "Christian missionaries from the 19th century extended the term Yoruba beyond Oyo speakers to include other related dialect groups."
  },
  {
    question: "Per Muhammad Bello's account, the ancestors of the Yoruba were a negroid race ejected from which region?",
    options: [
      "Cameroon",
      "Ghana",
      "The Middle East",
      "Egypt"
    ],
    answer: 2,
    explanation: "Muhammad Bello recorded that the Yoruba's ancestors were a negroid race ejected from the Middle East region."
  },
  {
    question: "Who was the provincial ruler of Ilorin that led the rebellion against Alaafin Awole, leading to Oyo's collapse?",
    options: [
      "Oranmiyan",
      "Afonja",
      "Abiodun",
      "Lamurudu"
    ],
    answer: 1,
    explanation: "Afonja, the provincial ruler of Ilorin, led the rebellion against Alaafin Awole which contributed to the eventual collapse of the Oyo Empire."
  },
  {
    question: "What was the final expectation for an Alaafin formally deposed by the Oyomesi council?",
    options: [
      "He was expected to commit suicide",
      "He became an Ogboni priest",
      "He was demoted to a provincial Baale",
      "He was exiled to the Middle East"
    ],
    answer: 0,
    explanation: "An Alaafin who was formally deposed by the Oyomesi was expected to commit suicide by accepting an empty calabash as the signal."
  },
  {
    question: "What arm of Yoruba government played a mediatory role in conflicts between the Oyomesi and the Alaafin?",
    options: [
      "The Ilari agents",
      "The Titled Nobility",
      "The Army",
      "The Ogboni Cult"
    ],
    answer: 3,
    explanation: "The Ogboni Cult served as a mediatory body, balancing power between the Oyomesi council and the Alaafin."
  },
  {
    question: "What title was given to the Alaafin's personal secret agents deployed across Oyo provinces?",
    options: [
      "Baale",
      "Dogari",
      "Ilari",
      "Shaba"
    ],
    answer: 2,
    explanation: "The Ilari were the Alaafin's personal secret agents, deployed across Oyo provinces to monitor and report on provincial rulers."
  },
  {
    question: "Which European traveler arrived in Benin during King Ozolua's reign in 1484?",
    options: [
      "Alfonso de Aviero",
      "Samuel Bill",
      "Ruy de Sequeira",
      "Mary Slessor"
    ],
    answer: 0,
    explanation: "Alfonso de Aviero arrived in Benin in 1484 during the reign of King Ozolua, following the earlier visit of Ruy de Sequeira."
  },
  {
    question: "Between which years did Benin historically exchange formal ambassadors with the Portuguese?",
    options: [
      "1604 and 1608",
      "1440 and 1473",
      "1481 and 1504",
      "1300 and 1350"
    ],
    answer: 2,
    explanation: "Benin and Portugal formally exchanged ambassadors between 1481 and 1504, a period of active diplomatic and trade relations."
  },
  {
    question: "Per Egharevba's version, from which country did the Bini originally emigrate before settling at Ile-Ife?",
    options: [
      "Israel",
      "Egypt",
      "Mecca",
      "Baghdad"
    ],
    answer: 1,
    explanation: "Egharevba's account records that the Bini originally emigrated from Egypt before eventually settling at Ile-Ife."
  },
  {
    question: "Who was the first Ogiso ruler of pre-colonial Bini history?",
    options: [
      "Owodo",
      "Ere",
      "Orire",
      "Igbodo"
    ],
    answer: 3,
    explanation: "Igbodo was the first Ogiso (sky king) ruler in pre-colonial Bini history, founding the earliest known Benin dynasty."
  },
  {
    question: "Which Ogiso ruler formed the guild system and laid the foundation for the Benin kingdom?",
    options: [
      "Eweka I",
      "Ere",
      "Owodo",
      "Igbodo"
    ],
    answer: 1,
    explanation: "Ere is credited with forming the guild system and laying the administrative foundation of the Benin kingdom."
  },
  {
    question: "What form of government was temporarily established by elders during the interregnum after the Ogiso dynasty ended?",
    options: [
      "A segmentary assembly",
      "A theocratic autocracy",
      "A republican government",
      "A divine monarchy"
    ],
    answer: 2,
    explanation: "A republican government was temporarily established by the elders after the Ogiso dynasty ended and before a new ruling house was found."
  },
  {
    question: "Who attempted to usurp the Benin throne by nominating his own son Ogiamen to succeed him?",
    options: [
      "Evian",
      "Ekaladeran",
      "Oranmiyan",
      "Ooni of Ife"
    ],
    answer: 0,
    explanation: "Evian, placed in charge as a caretaker, attempted to usurp the throne by putting forward his son Ogiamen as successor."
  },
  {
    question: "Archaeological evidence supports the traditional view that the Benin kingdom was established during which century?",
    options: [
      "Seventeenth century",
      "Eleventh century",
      "Fifteenth century",
      "Thirteenth century"
    ],
    answer: 3,
    explanation: "Archaeological evidence supports the 13th century as the period when the Benin kingdom was established."
  },
  {
    question: "Bini political and cultural influence peaked under kings who maintained what military practice?",
    options: [
      "Deploying naval canoes on the Cross River",
      "Leading their armies to war in person",
      "Using cavalry from Oyo",
      "Hiring mercenaries from the Central Zone"
    ],
    answer: 1,
    explanation: "Bini influence peaked when kings personally led their armies to war, a practice started by Ewuare and ended after Ehengbuda's death."
  },
  {
    question: "After kings stopped leading wars personally, how often did the semi-divine Oba emerge from his palace?",
    options: [
      "Once or twice a year",
      "Every eighth day",
      "Only during the Bere festival",
      "Never after coronation"
    ],
    answer: 0,
    explanation: "After kings withdrew from leading armies, the Oba emerged from his palace only once or twice a year for important ceremonies."
  },
  {
    question: "Linguistic classification groups the Urhobo, Ishan, Ivbiosakon, Etsako, and Isoko into which category?",
    options: [
      "Yoruba-speaking groups",
      "Igbo-speaking groups",
      "Ijo-speaking groups",
      "Edo-speaking groups"
    ],
    answer: 3,
    explanation: "The Urhobo, Ishan, Ivbiosakon, Etsako, and Isoko are all classified as Edo-speaking groups."
  },
  {
    question: "To which geographic area was Prince Iginuwa sent by canoe after meeting some local Ijaws?",
    options: [
      "The foothills of Cameroon",
      "The confluence of River Kaduna",
      "An Island by the sea",
      "The open village square of Wukari"
    ],
    answer: 2,
    explanation: "After meeting local Ijaws, Prince Iginuwa was guided by canoe to an island by the sea where he founded the Itsekiri kingdom."
  },
  {
    question: "Why did the Urhobo, unlike the Itsekiri and Benin, never establish a single centralized kingdom?",
    options: [
      "Rejected iron technology",
      "Fragmented, living in different places across the Niger Delta",
      "Language completely unintelligible between villages",
      "Banned from creating titles by the Oba"
    ],
    answer: 1,
    explanation: "The Urhobo remained fragmented and scattered across the Niger Delta, which prevented the formation of a single centralized kingdom."
  },
  {
    question: "In the sub-cultural grouping of the Igbo, which classification applies to the Delta Igbo?",
    options: [
      "The South-eastern Igbo",
      "The Igbo of eastern Nigeria",
      "The Western Igbo",
      "The Northern Igbo"
    ],
    answer: 2,
    explanation: "The Delta Igbo, including groups like the Onitsha Igbo and those on the far side of the Niger, are classified as Western Igbo."
  },
  {
    question: "Per Nri oral tradition, down which river did the ancestor Eri sail before arriving at Aguleri?",
    options: [
      "Anambra River",
      "Niger River",
      "Benue River",
      "Kaduna River"
    ],
    answer: 0,
    explanation: "According to Nri oral tradition, Eri sailed down the Anambra River before arriving at Aguleri."
  },
  {
    question: "The Israeli version of Igbo origin bases its assumptions on what specific indicator?",
    options: [
      "Architectural remnants in Orlu",
      "Royal lineages traceable to Mecca",
      "Written manuscripts in colonial records",
      "Similarities between Igbo and ancient Hebrew cultures"
    ],
    answer: 3,
    explanation: "The Israeli version of Igbo origin is based on observed cultural and linguistic similarities between the Igbo and ancient Hebrew peoples."
  },
  {
    question: "In small pre-colonial Ijo settlements, each individual ward was known locally as what?",
    options: [
      "Idip",
      "Wari",
      "Polo",
      "Ekpuk"
    ],
    answer: 2,
    explanation: "In small Ijo settlements, individual wards were known as Polo, while households within them were called Wari."
  },
  {
    question: "What is the alternative spelling or variant name for the Eket dialect?",
    options: [
      "Annang",
      "Ibeno",
      "Oron",
      "Ekid"
    ],
    answer: 3,
    explanation: "Ekid is the alternative spelling and variant name used for the Eket dialect group."
  },
  {
    question: "During which historical period was the Ibibio Union formed to ask for British recognition as a sovereign State?",
    options: [
      "Pre-colonial period",
      "Colonial period",
      "Post-colonial period",
      "Independence era"
    ],
    answer: 1,
    explanation: "The Ibibio Union was formed during the colonial period when the Ibibio sought British recognition as a sovereign political entity."
  },
  {
    question: "Because of their larger population, which group holds primary political control over Akwa Ibom State?",
    options: [
      "The Ibibio people",
      "The Efiks",
      "The Oron community",
      "The Annangs"
    ],
    answer: 0,
    explanation: "The Ibibio people, being the largest population group, hold primary political control in Akwa Ibom State."
  },
  {
    question: "What is the dialectal term for 'family' used in some specific areas of Ibibio land?",
    options: [
      "Idung",
      "Ekwere",
      "Awio",
      "Ekpuk"
    ],
    answer: 1,
    explanation: "Ekwere is a dialectal term used in some Ibibio areas to mean family or lineage unit."
  },
  {
    question: "In the Eastern Ibibio Ikono area, what is a goat called as opposed to 'ebot' elsewhere?",
    options: [
      "Iwud",
      "Ibuot",
      "Ulok",
      "Ibut"
    ],
    answer: 3,
    explanation: "In the Ikono area of Eastern Ibibio, a goat is called Ibut rather than the Ebot used in other Ibibio communities."
  },
  {
    question: "Which word means 'house' in Ibeno while other Ibibio groups say 'ufok'?",
    options: [
      "Ulok",
      "Polo",
      "Ikot",
      "Wari"
    ],
    answer: 0,
    explanation: "In Ibeno, the word Ulok means house, while most other Ibibio communities use the word Ufok."
  },
  {
    question: "Besides 'the house of' or 'the people of', what is another literal meaning of 'Ikot' in Ibibio land?",
    options: [
      "River",
      "Sea",
      "Bush",
      "Sky"
    ],
    answer: 2,
    explanation: "Besides meaning the house of or the people of, Ikot also literally means bush in Ibibio land."
  },
  {
    question: "How do the highest-ranking wealthy Amama members limit economic gain for most other community members?",
    options: [
      "Controlling iron technology guilds",
      "Collecting heavy cash taxes",
      "Banning external trade with Europeans",
      "Appropriating hundreds of acres of palm tree for their own use"
    ],
    answer: 3,
    explanation: "The Amama appropriate hundreds of acres of palm trees for their exclusive use, limiting the economic opportunities of other community members."
  },
  {
    question: "What social obligation does the Ekpo society require of initiates to foster an appearance of wealth redistribution?",
    options: [
      "Sponsoring feasts for the town to provide the poor with food and drink",
      "Building houses for widows",
      "Giving free farmland to family members",
      "Paying cash tributes to the village head"
    ],
    answer: 0,
    explanation: "Ekpo society initiates are required to sponsor feasts for the whole town, creating an appearance of wealth redistribution."
  },
  {
    question: "What prevents most Ibibio people from accusing masked Ekpo members who overstep boundaries during policing duties?",
    options: [
      "Strict British colonial laws",
      "Fear of retribution from the ancestors",
      "Severe cash fines from the state chief judge",
      "Fear of the bush garrison army"
    ],
    answer: 1,
    explanation: "Fear of retribution from the ancestors prevents community members from openly accusing masked Ekpo members who overstep their boundaries."
  },
  {
    question: "What is required for an Ibibio male to move into the politically influential grades of the Ekpo society?",
    options: [
      "He must marry the first-born daughter of the chief",
      "He must belong to the original royal lineage",
      "He must have access to wealth",
      "He must complete a period in the bush garrison"
    ],
    answer: 2,
    explanation: "Access to wealth is the key requirement for an Ibibio male to advance into the politically influential higher grades of the Ekpo society."
  },
  {
    question: "What is the name of the Ibibio earth deity appeased to make children plentiful and increase the harvest?",
    options: [
      "Swem",
      "Osanobua",
      "Ndem Isong",
      "Ikpa Isong"
    ],
    answer: 3,
    explanation: "Ikpa Isong is the earth deity appeased through the Obom ceremony to increase harvests and make children plentiful."
  },
  {
    question: "How often and for how long is the Obom ceremony performed by each section of an Ibibio village?",
    options: [
      "End of year, every seventh day for seven weeks",
      "In the middle of the year, every eighth day for eight weeks",
      "Once a year for twelve consecutive days",
      "During the Bere festival for three days"
    ],
    answer: 1,
    explanation: "The Obom ceremony is performed in the middle of the year, every eighth day for eight weeks by each section of the village."
  },
  {
    question: "The Ibibio, Annang, and Oron nations historically practiced killing twins and left them where?",
    options: [
      "In their community's local evil forest",
      "At the entrance of the village square",
      "Outside the city walls of the capital state",
      "In the middle of the local river confluence"
    ],
    answer: 0,
    explanation: "Twin babies were killed and left in the community's local evil forest, a practice that was later abolished through missionary work."
  },
  {
    question: "Which European church did Samuel Bill establish at Ibeno, which later spread to the Middle Belt?",
    options: [
      "The Presbyterian Church",
      "The Methodist Church",
      "The Qua Iboe Church",
      "The Apostolic Church"
    ],
    answer: 2,
    explanation: "Samuel Bill established the Qua Iboe Church at Ibeno, which later spread significantly into the Middle Belt region of Nigeria."
  },
  {
    question: "Which independent church came into the Ibibio area in the second half of the 20th century?",
    options: [
      "Deeper Life Bible Church",
      "The Qua Iboe Church",
      "The Roman Catholic Church",
      "The Anglican Church"
    ],
    answer: 0,
    explanation: "The Deeper Life Bible Church entered the Ibibio area in the second half of the 20th century as an independent Pentecostal church."
  },
  {
    question: "What represents the greatest works of art in traditional Ibibio society?",
    options: [
      "Architectural pillars of palace chiefs",
      "Bronze castings of divine rulers",
      "The masks and accoutrements of the Ekpe society",
      "Terracotta figures in the evil forest"
    ],
    answer: 2,
    explanation: "The masks and accoutrements of the Ekpe society are considered the greatest works of art in traditional Ibibio society."
  },
  {
    question: "What are the four major pre-colonial Efik settlements collectively referred to as Calabar?",
    options: [
      "Abak, Ikot Ekpene, Essien Udim, and Ukanafun",
      "Bonny, Kalabari, Opobo, and Brass-Nembe",
      "Idah, Wukari, Gbara, and Raba",
      "Obio Okot, Atakpa, Obutong, and Nsidung"
    ],
    answer: 3,
    explanation: "The four major Efik settlements of Obio Okot, Atakpa, Obutong, and Nsidung came to be collectively known as Calabar."
  },
  {
    question: "What titular head style was given to leaders of the various Efik communities?",
    options: [
      "The Attah",
      "The Obong",
      "The Mai",
      "The Etsu"
    ],
    answer: 1,
    explanation: "The Obong was the titular head style given to leaders of the various Efik communities in pre-colonial times."
  },
  {
    question: "Since polygamy is practiced in Annang society, individuals tracing ancestry to the same parents form what unit?",
    options: [
      "Idip",
      "Idung",
      "Ufok",
      "Ekpuk"
    ],
    answer: 2,
    explanation: "Individuals tracing ancestry to the same parents in a polygamous Annang household form the Ufok (house or compound) unit."
  },
  {
    question: "In the Annang clan layout, several Ekpuks combine to form what unit?",
    options: [
      "Ufok",
      "Idung",
      "Awio",
      "Nka"
    ],
    answer: 1,
    explanation: "Several Ekpuks (extended families) combine to form an Idung, meaning village, in the Annang social structure."
  },
  {
    question: "Leadership at the family, lineage, village, or clan level in traditional Annang society remains the prerogative of whom?",
    options: [
      "The men",
      "The female chief priests",
      "The titled palace chiefs",
      "The first-born daughters"
    ],
    answer: 0,
    explanation: "Leadership at all levels of traditional Annang society — family, lineage, village, and clan — is the prerogative of men."
  },
  {
    question: "Who directs the legislative arm of elderly males (Afe Isong) as head and chief executive of an Annang village or clan?",
    options: [
      "The Galadima",
      "The Abia Idiong",
      "The Akwo Annang",
      "The Obong or Obong Isong"
    ],
    answer: 3,
    explanation: "The Obong or Obong Isong heads and directs the Afe Isong as the chief executive of an Annang village or clan."
  },
  {
    question: "What is the role of Annang female chief priests in the traditional Idiong cult?",
    options: [
      "Abia Idiong",
      "Abi-de",
      "Afe Isong",
      "Adiaha"
    ],
    answer: 0,
    explanation: "Female chief priests in the Annang traditional Idiong cult hold the title Abia Idiong."
  },
  {
    question: "Which specific women's organizations give Annang women a strong voice and status in society?",
    options: [
      "Wari and Polo",
      "Abi-de, Nyaama, and Isong Iban",
      "Oyomesi and Ogboni",
      "Nokena and Amala Oha"
    ],
    answer: 1,
    explanation: "The women's organizations Abi-de, Nyaama, and Isong Iban give Annang women a strong collective voice and social status."
  },
  {
    question: "What complimentary term is given in Annang land to an individual with the gift of eloquent speech?",
    options: [
      "Obong Isong",
      "Abia Idiong",
      "Akwo Annang",
      "Adiaha"
    ],
    answer: 2,
    explanation: "Akwo Annang is the complimentary title given to an individual in Annang land who is gifted with eloquent speech."
  },
  {
    question: "Plump women were seen as beautiful by the Annangs because it historically indicated what?",
    options: [
      "She was a high-ranking Ekpe member",
      "She was chosen by the earth deity Ikpa Isong",
      "She belonged to the founding village lineage",
      "She came from a well-to-do home and her husband was well-to-do"
    ],
    answer: 3,
    explanation: "Plumpness was a sign of wealth and good living, indicating that the woman came from a prosperous home and had a well-to-do husband."
  },
  {
    question: "Which European social thinker divided world cultures into primitive and civilized, classifying European culture as advanced?",
    options: [
      "Peter Farb",
      "Wilhelm Koelle",
      "Augustus Comte",
      "Professor Brink"
    ],
    answer: 2,
    explanation: "Augustus Comte, a European social thinker, divided world cultures into primitive and civilized categories, placing European culture at the top."
  },
  {
    question: "Why did traditional Annang children bear female names that were later androgenized into male names?",
    options: [
      "Names were assigned exclusively by female chief priests",
      "The society was semi-matriarchal before Christian missionaries altered it",
      "British colonial laws forced women into the military",
      "Fathers lost naming rights during the Ikot Udo Obong Wars"
    ],
    answer: 1,
    explanation: "The Annang society was semi-matriarchal before Christian missionaries arrived and altered naming traditions."
  },
  {
    question: "Oral tradition notes the Annangs started their long migration from Egypt around which year?",
    options: [
      "1500 BC",
      "4000 BC",
      "1904 AD",
      "7500 BC"
    ],
    answer: 3,
    explanation: "Annang oral tradition places the beginning of their long migration from Egypt at approximately 7500 BC."
  },
  {
    question: "Which clan was first to come to the northern range of Annang from Eka Abiakpo?",
    options: [
      "The Abiakpo clan",
      "The Ukana clan",
      "The Ebom clan",
      "The Utu clan"
    ],
    answer: 0,
    explanation: "The Abiakpo clan was the first to come to the northern range of Annang territory from Eka Abiakpo."
  },
  {
    question: "The British lumped several northern Annang clans together under what name?",
    options: [
      "Abak",
      "Province",
      "Egbo-Sharry",
      "Otoro"
    ],
    answer: 3,
    explanation: "The British lumped the northern Annang clans of Ukana, Utu, Ekpu, Ebom, and Nyama together under the collective name Otoro."
  },
  {
    question: "Per oral tradition, the ancestors of the Akwa Cross people were Jews of the Northern Kingdom who left Israel for Egypt before what event?",
    options: [
      "The Babylonian captivity",
      "The Fulani jihad",
      "The British colonial invasion",
      "The Atlantic trade era"
    ],
    answer: 0,
    explanation: "Oral tradition holds that the ancestors of the Akwa Cross people were Jews who left Israel for Egypt before the Babylonian captivity."
  },
  {
    question: "Remnants of the Annang language can be found among the Egyptians, according to whose historical records?",
    options: [
      "Farb",
      "Waddell",
      "Koelle",
      "Noah"
    ],
    answer: 1,
    explanation: "According to Waddell's historical records, remnants of the Annang language can still be found among the Egyptians."
  },
  {
    question: "Upon arrival at virgin coastal southeastern Nigeria, how did the migrating groups bond together?",
    options: [
      "Establishing a centralized kingdom under one king",
      "Converting immediately to Islam",
      "Taking an oath of solidarity to fight a common enemy",
      "Exchanging formal ambassadors with Benin"
    ],
    answer: 2,
    explanation: "Upon arrival in coastal southeastern Nigeria, the migrating groups bonded by taking a collective oath of solidarity to fight whatever they saw as a common enemy."
  },
  {
    question: "What derogatory name did the Efiks use for groups outside coastal areas, meaning 'poor but proud'?",
    options: [
      "Hausa Banza",
      "Kwararafa",
      "Egbo-Sharry Country",
      "Ekpo Iseri"
    ],
    answer: 3,
    explanation: "The Efiks used the derogatory term Ekpo Iseri, meaning poor but proud, to describe interior groups outside coastal areas."
  },
  {
    question: "Early European traders referred to interior groups outside coastal Cross River territories as residents of what?",
    options: [
      "Calabar State",
      "Otoro Country",
      "Egbo-Sharry Country",
      "Nkwot Territory"
    ],
    answer: 2,
    explanation: "Early European traders called the interior hinterland groups residents of Egbo-Sharry Country, distinguishing them from the coastal Efik traders."
  },
  {
    question: "What tactic did Efik middlemen use to keep Europeans from trading directly with hinterland groups?",
    options: [
      "Spreading rumors of cannibalism and using fear tactics",
      "Signing a formal border treaty with the British",
      "Offering cash bribes to Portuguese captains",
      "Blocking the Niger Delta with trade canoes"
    ],
    answer: 0,
    explanation: "Efik middlemen spread rumors of cannibalism and used fear tactics to deter Europeans from venturing inland to trade directly with hinterland groups."
  },
  {
    question: "From which specific town in Abak did the liberated slave Ebengo hail before capture?",
    options: [
      "Ikot Ekpene",
      "Nkwot",
      "Ikot Okoro",
      "Oruk Anam"
    ],
    answer: 1,
    explanation: "Ebengo hailed from Nkwot in Abak before being captured and later providing the first written account of the Annang people."
  },
  {
    question: "Where did Ebengo eventually settle after being freed from a Portuguese ship by a British warship?",
    options: [
      "Waterloo, Sierra Leone",
      "Kingston, West Indies",
      "Accra, Ghana",
      "Calabar, Nigeria"
    ],
    answer: 0,
    explanation: "After being freed by a British warship, Ebengo eventually settled in Waterloo, Sierra Leone."
  },
  {
    question: "What name did British soldiers list for the languages spoken by the captured slaves on Ebengo's ship?",
    options: [
      "Efik",
      "Annang",
      "Ekid",
      "Ibibio"
    ],
    answer: 1,
    explanation: "British soldiers recorded the language spoken by the captured slaves on Ebengo's ship as Annang."
  },
  {
    question: "King Jaja of Opobo fought the Ikot Udo Obong Wars to punish the Annangs for doing what?",
    options: [
      "Joining the Human Leopards Society",
      "Attempting an independent military post at Abak",
      "Defying his orders and trading in palm oil directly with British merchants",
      "Refusing agricultural tribute to evil forest priests"
    ],
    answer: 2,
    explanation: "King Jaja fought the Annangs because they defied his orders and traded palm oil directly with British merchants, bypassing his monopoly."
  },
  {
    question: "What did the British do to King Jaja of Opobo after intervening in the war with Annang help?",
    options: [
      "Made him chief judge of the state council",
      "Forced him to commit suicide",
      "Appointed him supreme Obong of Calabar",
      "Captured him and exiled him to the West Indies"
    ],
    answer: 3,
    explanation: "After intervening in the conflict, the British captured King Jaja of Opobo and exiled him to the West Indies."
  },
  {
    question: "In what year did the British establish a formal military post at Ikot Ekpene?",
    options: [
      "1472",
      "1854",
      "1904",
      "1762"
    ],
    answer: 2,
    explanation: "The British established a formal military post at Ikot Ekpene in 1904 as part of their consolidation of colonial control."
  },
  {
    question: "Why did the Annang region see intensified wild animal attacks during the colonial period?",
    options: [
      "Bans on ancient hunting practices plus men fighting in WWII",
      "Ikpa Isong sent animals as punishment",
      "British military imported wild leopards",
      "Local people destroyed forests to plant palm trees"
    ],
    answer: 0,
    explanation: "Bans on traditional hunting practices and the absence of men who went to fight in World War II led to intensified wild animal attacks in the region."
  },
  {
    question: "What name did British colonial authorities give the secret society blamed for local insurgencies and deaths?",
    options: [
      "Ekpe Ndem Isong",
      "Ekpeowo (The Human Leopards Society)",
      "The Ogboni Cult",
      "The Igalla-mela Council"
    ],
    answer: 1,
    explanation: "British colonial authorities blamed the Ekpeowo, known as The Human Leopards Society, for deaths and insurgencies in the region."
  },
  {
    question: "Between 1945 and 1948, about 196 people were killed by what the British branded as insurgency or animal attacks in which community?",
    options: [
      "Eka Abiakpo clan",
      "Waterloo community",
      "Ikot Udo Obong",
      "Ikot Okoro community"
    ],
    answer: 3,
    explanation: "About 196 people were killed between 1945 and 1948 in Ikot Okoro community in what the British branded as insurgency and animal attacks."
  },
  {
    question: "In which present-day Local Government Area is the historic Ikot Okoro community located?",
    options: [
      "Oruk Anam LGA",
      "Ikot Ekpene LGA",
      "Essien Udim LGA",
      "Abak LGA"
    ],
    answer: 0,
    explanation: "The historic Ikot Okoro community is located in Oruk Anam Local Government Area of Akwa Ibom State."
  },
  {
    question: "For this course, the Nigerian geographic scope is divided structurally into how many major zones?",
    options: [
      "Six zones",
      "Three zones",
      "Two zones",
      "Four zones"
    ],
    answer: 3,
    explanation: "For this course, Nigeria is structurally divided into four major zones: Northern, Central, Western, and Eastern."
  },
  {
    question: "Which language serves as the common tongue uniting the related Annang, Efik, Ekid, and Oron communities?",
    options: [
      "Urhobo language",
      "Kanuri language",
      "Ibibio language",
      "Fulfulde language"
    ],
    answer: 2,
    explanation: "The Ibibio language serves as the common tongue uniting the Annang, Efik, Ekid, and Oron communities of Akwa Ibom and Cross River States."
  },
  {
    question: "What is the fundamental basis of traditional Ibibio religion in the pre-colonial era?",
    options: [
      "Emigrating completely to the Middle East",
      "Paying tribute to the village ancestors",
      "Observing Sharia law textually",
      "Building massive stone structures for sky-kings"
    ],
    answer: 1,
    explanation: "The fundamental basis of traditional Ibibio religion in the pre-colonial era was the veneration of and paying tribute to the village ancestors."
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
{
question: "Data validation is best described as the process of:",
options: [
"Checking that data conforms to predefined rules or formats before processing",
"Permanently deleting incorrect data",
"Converting information back into raw data",
"Printing data onto paper for storage"
],
answer: 0,
working: "Data validation checks that incoming data meets set criteria, such as format, range, or type, before it is accepted for processing."
},
{
question: "Data verification differs from data validation in that verification mainly focuses on:",
options: [
"Confirming that data was entered or copied accurately, often by comparing it to its original source",
"Designing the database structure",
"Determining hardware specifications",
"Encrypting all stored files"
],
answer: 0,
working: "Verification checks accuracy against the original source, such as through double entry or proofreading, while validation checks data against acceptable rules."
},
{
question: "The principle 'Garbage In, Garbage Out' (GIGO) in data processing means:",
options: [
"Computers automatically correct any data entry errors",
"Poor quality input data will produce poor quality, unreliable output",
"Waste data is stored separately from useful data",
"Old files must be deleted before new ones are created"
],
answer: 1,
working: "GIGO highlights that if inaccurate or poor-quality data is entered, the processed output will be equally flawed, regardless of how good the processing method is."
},
{
question: "In a database table, a primary key is used to:",
options: [
"Uniquely identify each record in the table",
"Store duplicate copies of every field",
"Encrypt the entire table",
"Permanently lock the table from being read"
],
answer: 0,
working: "A primary key is a field, or set of fields, whose value uniquely identifies each record, preventing duplicate or ambiguous entries."
},
{
question: "A foreign key in a relational database is best described as:",
options: [
"A field that links one table to the primary key of another table",
"A key used only to lock files from foreign countries",
"A backup copy of the primary key",
"A field that can never be referenced by other tables"
],
answer: 0,
working: "A foreign key is a field in one table that refers to the primary key in another table, establishing a relationship between the two."
},
{
question: "One major benefit of using a DBMS for maintaining data integrity is that it:",
options: [
"Allows unrestricted, unchecked changes to any data at any time",
"Enforces rules and constraints that keep stored data accurate and consistent",
"Removes the need for any data backups",
"Prevents more than one table from ever being created"
],
answer: 1,
working: "A DBMS enforces constraints, such as data types, uniqueness, and relationships, that help keep stored data accurate, consistent, and reliable."
},
{
question: "A backup file is created mainly to:",
options: [
"Replace the original file permanently",
"Provide a copy of data that can restore information if the original is lost or damaged",
"Speed up day-to-day data entry",
"Reduce the size of the master file"
],
answer: 1,
working: "Backup files are duplicate copies kept so that data can be recovered if the original file is lost, corrupted, or deleted."
},
{
question: "An archive file is best described as one that:",
options: [
"Stores current, frequently updated transaction records",
"Holds older data that is no longer in active use but is retained for reference or legal purposes",
"Can never be opened once created",
"Is automatically deleted after one day"
],
answer: 1,
working: "Archive files store historical or inactive data that is kept for record-keeping, reference, or compliance, rather than for routine daily use."
},
{
question: "A program file differs from a data file in that a program file:",
options: [
"Contains instructions that tell the computer how to perform a task",
"Only contains numerical records about a business",
"Can never be stored on a hard disk",
"Is always smaller than a data file"
],
answer: 0,
working: "Program files hold executable instructions or code, while data files store information meant to be processed by those programs."
},
{
question: "A secondary source of data is best exemplified by:",
options: [
"A questionnaire administered directly to respondents",
"Personal observation of an ongoing event",
"A published report summarizing data already collected by another researcher",
"An original experiment conducted by the user"
],
answer: 2,
working: "Secondary sources present data that has already been gathered and processed by someone else, unlike primary sources, which involve direct, first-hand collection."
},
{
question: "In a centralized database system, data is:",
options: [
"Spread randomly across unrelated, disconnected computers with no central control",
"Stored and managed at a single central location, accessible to authorized users",
"Never accessible to more than one department",
"Always stored only on paper records"
],
answer: 1,
working: "A centralized database keeps all data in one location under unified management, simplifying control even when accessed by many users."
},
{
question: "A hierarchical directory structure organizes files by:",
options: [
"Storing every file in a single folder with no subfolders",
"Arranging folders and subfolders in a tree-like, nested structure",
"Randomly scattering files with no naming pattern",
"Requiring all files to share an identical name"
],
answer: 1,
working: "A hierarchical structure nests folders within folders, like a tree, making it easier to logically organize and locate files."
}
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
    answer: 0,
    explanation: "An application package is pre-written software created to help users perform specific tasks, such as word processing or database management."
},
{
    question: "Which of these packages is specifically designed for managing structured databases?",
    options: [
        "Microsoft Paint",
        "Microsoft Access",
        "Microsoft PowerPoint",
        "Adobe Photoshop"
    ],
    answer: 1,
    explanation: "Microsoft Access is the application package in this set specifically built for creating and managing structured databases."
},
{
    question: "Microsoft Access is most accurately classified as a:",
    options: [
        "Word processing application",
        "Image editing application",
        "Relational Database Management System",
        "Presentation design application"
    ],
    answer: 2,
    explanation: "MS Access is a Relational Database Management System (RDBMS), designed to store and manage data in related tables."
},
{
    question: "The core purpose of a DBMS such as MS Access is to:",
    options: [
        "Edit photographs and digital images",
        "Compose printed letters and documents",
        "Design slide-based presentations",
        "Store, organize, retrieve, and manage structured data"
    ],
    answer: 3,
    explanation: "A DBMS like Access exists mainly to store, organize, retrieve, and manage structured data efficiently."
},
{
    question: "The structural component in MS Access used to store raw data in rows and columns is called a:",
    options: [
        "Form",
        "Table",
        "Report",
        "Macro"
    ],
    answer: 1,
    explanation: "In Access, raw data is stored in rows and columns within a structural component called a Table."
},
{
    question: "A single row of data in an Access table, representing one complete entry, is called a:",
    options: [
        "Field",
        "Module",
        "Record",
        "Query"
    ],
    answer: 2,
    explanation: "A single row in an Access table, representing one complete entry, is called a Record."
},
{
    question: "A single column in an Access table, representing one category of data, is referred to as a:",
    options: [
        "Report",
        "Form",
        "Field",
        "Record"
    ],
    answer: 2,
    explanation: "A single column in an Access table, representing one category of data, is called a Field."
},
{
    question: "The purpose of a 'Primary Key' in an Access table is to:",
    options: [
        "Format how dates are displayed",
        "Uniquely identify each record and prevent duplicates",
        "Delete unwanted records automatically",
        "Convert numbers into currency format"
    ],
    answer: 1,
    explanation: "A Primary Key uniquely identifies each record in a table and prevents duplicate entries."
},
{
    question: "To create a new, blank database in Access, a user typically would:",
    options: [
        "Open Excel and save the file with an .accdb extension",
        "Use a slide transition setting",
        "Select 'Blank Database' and specify a file name and location",
        "Apply the Mail Merge wizard"
    ],
    answer: 2,
    explanation: "To create a new database in Access, a user selects 'Blank Database' and specifies a file name and save location."
},
{
    question: "The default file extension for a modern Access database file is:",
    options: [
        ".accdb",
        ".pptx",
        ".docx",
        ".xlsx"
    ],
    answer: 0,
    explanation: "The default file extension for a modern Access database file is .accdb."
},
{
    question: "To open an already existing database in Access, a user would normally:",
    options: [
        "Use the Animation pane",
        "Apply a new design template",
        "Insert a new slide",
        "Use File then Open, then browse to the file"
    ],
    answer: 3,
    explanation: "To open an existing database, a user goes to File, then Open, and browses to the saved file."
},
{
    question: "Which Access view allows users to design or modify a table's structure, including field names and data types?",
    options: [
        "Datasheet View",
        "Design View",
        "Print Preview",
        "Report View"
    ],
    answer: 1,
    explanation: "Design View in Access lets users define or modify a table's structure, including field names and data types."
},
{
    question: "Datasheet View in Access primarily allows users to:",
    options: [
        "Build slide transitions",
        "Design the underlying database structure",
        "View and directly edit data in a spreadsheet-like grid",
        "Format text in a printed document"
    ],
    answer: 2,
    explanation: "Datasheet View displays table data in a spreadsheet-like grid, allowing users to view and directly edit records."
},
{
    question: "Which data type is most appropriate for a field storing a customer's phone number?",
    options: [
        "Currency",
        "Short Text",
        "AutoNumber",
        "Yes/No"
    ],
    answer: 1,
    explanation: "A phone number is best stored as Short Text, since it is not used for arithmetic and may include symbols like '+' or '-'."
},
{
    question: "The AutoNumber data type in Access is most commonly used to:",
    options: [
        "Store Yes/No values",
        "Automatically generate a unique sequential value for each record",
        "Store large blocks of formatted text",
        "Store currency-formatted figures"
    ],
    answer: 1,
    explanation: "The AutoNumber data type automatically generates a unique, sequential value for each new record."
},
{
    question: "A 'Query' in MS Access is best defined as:",
    options: [
        "A method for formatting fonts",
        "A static, permanently fixed table",
        "A request to retrieve or manipulate specific data based on criteria",
        "A type of slide transition"
    ],
    answer: 2,
    explanation: "A Query in Access is a request used to retrieve or manipulate specific data based on defined criteria."
},
{
    question: "Which query type would best retrieve only customers whose purchases exceed a set amount?",
    options: [
        "A Delete Query",
        "A Make-Table Query with no criteria",
        "A Select Query with a specific criteria condition",
        "An Update Query applied to all records"
    ],
    answer: 2,
    explanation: "A Select Query with a specific criteria condition can filter and return only customers whose purchases exceed a set amount."
},
{
    question: "'Filtering' table data in Access refers to:",
    options: [
        "Temporarily displaying only records that meet specific criteria",
        "Permanently deleting all records",
        "Changing a field's assigned data type",
        "Creating a brand-new slide"
    ],
    answer: 0,
    explanation: "Filtering temporarily displays only the records in a table that meet specific criteria, without altering the underlying data."
},
{
    question: "'Sorting' table or query data in Access allows users to:",
    options: [
        "Disable all filter options entirely",
        "Arrange records in a specified ascending or descending order",
        "Convert the table into a presentation slide",
        "Permanently remove unwanted fields"
    ],
    answer: 1,
    explanation: "Sorting arranges records in a specified ascending or descending order based on a chosen field."
},
{
    question: "Which example best illustrates 'data formatting' within an Access table?",
    options: [
        "Creating an entirely new database",
        "Renaming the saved database file",
        "Deleting an entire table permanently",
        "Displaying a Date field as dd/mm/yyyy"
    ],
    answer: 3,
    explanation: "Displaying a Date field as dd/mm/yyyy is an example of data formatting, changing how data appears without changing its stored value."
},
{
    question: "A 'Form' in MS Access is primarily used to:",
    options: [
        "Perform complex mathematical calculations only",
        "Provide a user-friendly interface for entering and viewing records",
        "Create animated slide transitions",
        "Store raw table data with no interface"
    ],
    answer: 1,
    explanation: "A Form provides a user-friendly interface for entering and viewing records, rather than working directly with raw table data."
},
{
    question: "The relationship between a table and a query in Access is best described as:",
    options: [
        "Completely unrelated database objects",
        "A query existing entirely without needing any table",
        "A query that dynamically draws and processes data from underlying tables",
        "A permanent, unchangeable static copy of a table"
    ],
    answer: 2,
    explanation: "A query dynamically draws and processes data from one or more underlying tables, rather than existing independently of them."
},
{
    question: "A user wants a 'Date of Birth' field to never accept text characters. The most appropriate data type is:",
    options: [
        "Yes/No",
        "OLE Object",
        "Short Text",
        "Date/Time"
    ],
    answer: 3,
    explanation: "Date/Time is the appropriate data type for a Date of Birth field, since it restricts entries to valid dates and prevents text characters."
},
{
    question: "Microsoft PowerPoint is primarily classified as a:",
    options: [
        "Spreadsheet application",
        "Operating system",
        "Presentation software application",
        "Database management application"
    ],
    answer: 2,
    explanation: "Microsoft PowerPoint is primarily classified as presentation software, used to create slide-based visual presentations."
},
{
    question: "To begin a new presentation in PowerPoint, a user typically starts by:",
    options: [
        "Running a database query",
        "Opening Datasheet View",
        "Selecting a blank presentation or design template",
        "Designing a table structure"
    ],
    answer: 2,
    explanation: "A new PowerPoint presentation typically begins by selecting a blank presentation or a design template."
},
{
    question: "A 'Design Template' in PowerPoint provides:",
    options: [
        "A method for filtering database records",
        "A tool used only for editing photographs",
        "A type of database query structure",
        "A pre-formatted set of colors, fonts, and layout styles"
    ],
    answer: 3,
    explanation: "A Design Template provides a pre-formatted set of colors, fonts, and layout styles applied consistently across slides."
},
{
    question: "The main reason for applying a consistent design template throughout a presentation is to:",
    options: [
        "Make every slide look completely unrelated to the others",
        "Increase unnecessary file size",
        "Maintain a professional, visually cohesive appearance",
        "Prevent additional slides from being added later"
    ],
    answer: 2,
    explanation: "Applying a consistent design template helps maintain a professional, visually cohesive appearance throughout a presentation."
},
{
    question: "The 'Title Slide' layout, typically the first slide, is designed to display:",
    options: [
        "Audio narration with no visible text",
        "An embedded spreadsheet exclusively",
        "A large data table only",
        "A main title, often with a subtitle introducing the topic"
    ],
    answer: 3,
    explanation: "The Title Slide layout, usually the first slide, displays a main title, often together with a subtitle introducing the topic."
},
{
    question: "To add a new slide to an existing PowerPoint presentation, a user would:",
    options: [
        "Save the file as a Word document",
        "Delete the current presentation entirely",
        "Use Access's Query Wizard",
        "Use the 'New Slide' command from the Home tab"
    ],
    answer: 3,
    explanation: "A new slide is added using the 'New Slide' command found on the Home tab."
},
{
    question: "A 'Slide Transition' in PowerPoint refers to:",
    options: [
        "The text formatting applied within a single slide",
        "A type of database table relationship",
        "The visual effect occurring when moving between slides",
        "The process of saving a presentation file"
    ],
    answer: 2,
    explanation: "A Slide Transition is the visual effect that occurs when moving from one slide to the next."
},
{
    question: "An 'Animation,' as distinct from a slide transition, refers to:",
    options: [
        "An effect applied to objects or text within a single slide",
        "The effect occurring only when switching slides",
        "A type of database query",
        "The process of printing slides"
    ],
    answer: 0,
    explanation: "Unlike a slide transition, an Animation is an effect applied to objects or text within a single slide."
},
{
    question: "Which of the following is an example of an entrance animation effect?",
    options: [
        "A database primary key",
        "A Select Query",
        "A table relationship in Access",
        "Fade, applied to an object appearing on the slide"
    ],
    answer: 3,
    explanation: "Fade, applied to an object appearing on a slide, is an example of an entrance animation effect."
},
{
    question: "The 'Slide Master' feature in PowerPoint is primarily used to:",
    options: [
        "Delete every slide in the presentation at once",
        "Run a database query",
        "Control formatting and layout consistently across all slides",
        "Convert a presentation into a spreadsheet"
    ],
    answer: 2,
    explanation: "The Slide Master controls formatting and layout consistently across all slides in a presentation."
},
{
    question: "Why might a presenter limit excessive or intense animations in a professional presentation?",
    options: [
        "Animations always improve clarity, regardless of quantity",
        "PowerPoint restricts presentations to a single animation",
        "Animations are unsupported in PowerPoint entirely",
        "Excessive animation can distract from the actual content and appear unprofessional"
    ],
    answer: 3,
    explanation: "Excessive or intense animation can distract from the actual content and make a presentation appear unprofessional."
},
{
    question: "To make slides automatically advance after a set number of seconds without manual clicking, a user adjusts:",
    options: [
        "The Query Design grid",
        "Table Design View",
        "Access Form view settings",
        "The Slide Transition timing options"
    ],
    answer: 3,
    explanation: "Automatic slide advancement after a set time is configured through the Slide Transition timing options."
},
{
    question: "Why should a Primary Key field generally never be left blank (Null)?",
    options: [
        "Leaving it blank automatically deletes the entire record",
        "Primary keys are optional with no real functional purpose",
        "Blank primary keys actually improve database performance",
        "The key must uniquely identify each record, and a blank value undermines that uniqueness"
    ],
    answer: 3,
    explanation: "A Primary Key must uniquely identify each record, so leaving it blank would undermine that uniqueness."
},
{
    question: "A school wants to store student records and quickly retrieve only those who scored above a set threshold. The best combination of Access tools is:",
    options: [
        "A Form with no underlying table at all",
        "Only the Datasheet View, with no query used",
        "A PowerPoint slide transition",
        "A Table to store the data, with a Query applying the score criteria"
    ],
    answer: 3,
    explanation: "Storing data in a Table and applying a Query with the score criteria allows quick retrieval of only the qualifying student records."
},
{
    question: "Which scenario best demonstrates appropriate use of a Yes/No data type in Access?",
    options: [
        "Storing a customer's full residential address",
        "Storing whether a student has paid school fees",
        "Storing a student's exact examination score",
        "Storing a product's unit price"
    ],
    answer: 1,
    explanation: "A Yes/No data type is appropriate for storing a simple true/false condition, such as whether a student has paid school fees."
},
{
    question: "A user enters 'ABC' into a field defined with the Number data type. The most likely outcome is:",
    options: [
        "PowerPoint will automatically open to correct the error",
        "Access will reject the entry, since it doesn't match the field's data type",
        "The entire table will be deleted automatically",
        "The value will be accepted and stored silently as text"
    ],
    answer: 1,
    explanation: "Access will reject text entered into a Number field, since the entry does not match the field's defined data type."
},  
{
    question: "The key difference between sorting and filtering in Access is that:",
    options: [
        "Filtering can only be applied to PowerPoint slides",
        "Sorting always permanently deletes unmatched data",
        "They are identical operations with no real distinction",
        "Sorting rearranges the order of displayed records, while filtering hides records that don't meet criteria"
    ],
    answer: 3,
    explanation: "Sorting rearranges the order in which records are displayed, while filtering hides records that don't meet specified criteria."
},
{
    question: "A presenter wants consistent fonts, colors, and a logo on every slide without reformatting each one manually. The most efficient feature to use is:",
    options: [
        "The Access Query Design grid",
        "Manually retyping formatting on each slide",
        "The Datasheet View",
        "The Slide Master"
    ],
    answer: 3,
    explanation: "The Slide Master allows a presenter to apply consistent fonts, colors, and a logo across every slide without manually reformatting each one."
},
{
    question: "A presentation using a completely different font, color, and template on every slide would most likely be critiqued for:",
    options: [
        "Following a recommended best practice",
        "Guaranteeing stronger audience engagement",
        "Being technically impossible in PowerPoint",
        "Appearing inconsistent and potentially distracting to the audience"
    ],
    answer: 3,
    explanation: "A presentation with inconsistent fonts, colors, and templates across slides is typically critiqued as appearing inconsistent and distracting."
},
{
    question: "In Access, formatting a number field to display as currency (e.g., ₦1,000.00) primarily affects:",
    options: [
        "Only the visual display, not the actual stored value",
        "The primary key assignment of the table",
        "The actual numeric value stored in the database",
        "The field's data type, converting it permanently to text"
    ],
    answer: 0,
    explanation: "Formatting a number field to display as currency changes only its visual appearance, not the actual numeric value stored in the database."
},
{
    question: "A teacher wants each new topic in a slideshow to begin with a distinct visual effect signaling the change. This is best handled using:",
    options: [
        "The AutoNumber data type",
        "A Select Query in Access",
        "MS Access Form Design",
        "PowerPoint Slide Transitions"
    ],
    answer: 3,
    explanation: "PowerPoint Slide Transitions are used to add a distinct visual effect signaling the start of a new topic in a slideshow."
},
{
    question: "The most logical workflow for building a simple Access database from scratch is to:",
    options: [
        "Create/open a blank database, design tables with proper fields, enter data, then build queries or forms",
        "Apply data formatting before any tables exist",
        "Build a PowerPoint presentation first, then convert it into Access",
        "Create queries first, before any tables have been designed"
    ],
    answer: 0,
    explanation: "The logical Access workflow is to create or open a blank database, design the tables with proper fields, enter data, then build queries or forms."
},
{
    question: "Why is it good practice to assign specific, appropriate data types to each Access field rather than making every field Short Text?",
    options: [
        "Specific data types only matter within PowerPoint",
        "Short Text fields process calculations faster than Number fields",
        "Appropriate data types ensure data validity and support correct calculations and sorting",
        "It has no real impact on database functionality"
    ],
    answer: 2,
    explanation: "Assigning specific, appropriate data types ensures data validity and supports correct calculations and sorting, unlike using Short Text for everything."
},
{
    question: "A user creates a bullet point that 'flies in' from the side when a slide is presented. This represents which animation category?",
    options: [
        "Motion path with no entry effect",
        "Exit animation",
        "Emphasis animation",
        "Entrance animation"
    ],
    answer: 3,
    explanation: "A bullet point flying in from the side as a slide is presented is an example of an entrance animation."
},
{
    question: "Which best illustrates an 'Emphasis' animation effect, as opposed to entrance or exit effects?",
    options: [
        "A slide transition occurring between two slides",
        "Text disappearing entirely from the slide",
        "Text growing larger or changing color while already visible",
        "Text appearing on the slide for the very first time"
    ],
    answer: 2,
    explanation: "An Emphasis animation effect is text or objects already visible on the slide changing, such as growing larger or changing color."
},
{
    question: "A student designs a table to track library books, including Title, Author, ISBN, and Availability. The most appropriate data type pairing is:",
    options: [
        "Title and Author as Short Text, ISBN as Short Text, Availability as Yes/No",
        "All fields set uniformly to AutoNumber",
        "Title as Currency, Author as Date/Time, ISBN as AutoNumber",
        "Title and Author as Number, ISBN as Yes/No, Availability as Text"
    ],
    answer: 0,
    explanation: "For a library book table, Title and Author are best stored as Short Text, ISBN as Short Text, and Availability as Yes/No."
},
{
    question: "MS Access and MS PowerPoint are both considered application packages mainly because:",
    options: [
        "PowerPoint is technically a component within Access",
        "Application packages must always involve a database structure",
        "They are identical programs offering the same core features",
        "Both are pre-developed software designed to help users accomplish specific categories of tasks"
    ],
    answer: 3,
    explanation: "MS Access and MS PowerPoint are both application packages because they are pre-developed software designed to help users accomplish specific categories of tasks."
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
    answer: 2,
    explanation: "The word 'STATISTICS' has 10 letters with S repeated 3 times, T repeated 3 times, and I repeated 2 times, giving 10!/(3!3!2!) distinct arrangements."
  },
  {
    question: "A committee of 5 is to be selected from 7 men and 4 women. In how many ways can this be done if the committee must contain at least 1 woman?",
    options: [
      "462",
      "441",
      "21",
      "419"
    ],
    answer: 1,
    explanation: "The total ways to choose 5 from 11 people is C(11,5)=462; subtracting the 21 all-men committees, C(7,5), leaves 441 committees with at least one woman."
  },
  {
    question: "Which of the following best describes a permutation?",
    options: [
      "Selection of objects where order does not matter",
      "Arrangement of objects where order matters",
      "Selection of objects with repetition allowed only",
      "Arrangement of objects where repetition is never allowed"
    ],
    answer: 1,
    explanation: "A permutation is an arrangement of objects in which the order matters, unlike a combination, where order is irrelevant."
  },
  {
    question: "If nPr = 336 and nCr = 56, what is r! ?",
    options: [
      "4",
      "5",
      "6",
      "8"
    ],
    answer: 2,
    explanation: "Since nPr = nCr × r!, dividing 336 by 56 gives r! = 6."
  },
  {
    question: "A bag contains 5 red and 3 blue balls. Two balls are drawn without replacement. What is the probability that both are red?",
    options: [
      "5/14",
      "25/64",
      "5/28",
      "5/8"
    ],
    answer: 0,
    explanation: "P(both red) = (5/8) × (4/7) = 20/56 = 5/14."
  },
  {
    question: "Which of the following is NOT a property of a valid probability distribution?",
    options: [
      "Sum of all probabilities equals 1",
      "Each probability lies between 0 and 1 inclusive",
      "Probabilities can be negative if the event is unlikely",
      "The probabilities are defined over the sample space"
    ],
    answer: 2,
    explanation: "Probabilities can never be negative; this violates a key requirement of a valid probability distribution, making it the correct answer to 'NOT a property.'"
  },
  {
    question: "A random variable that can take on a finite or countably infinite number of values is called:",
    options: [
      "Continuous random variable",
      "Discrete random variable",
      "Independent random variable",
      "Standardized random variable"
    ],
    answer: 1,
    explanation: "A discrete random variable takes a finite or countably infinite number of distinct values, unlike a continuous variable, which can take any value in an interval."
  },
  {
    question: "Two events A and B are said to be mutually exclusive if:",
    options: [
      "P(A∩B) = P(A) × P(B)",
      "P(A∩B) = 0",
      "P(A∪B) = 1",
      "P(A|B) = P(A)"
    ],
    answer: 1,
    explanation: "Two events are mutually exclusive when they cannot occur together, meaning P(A∩B) = 0."
  },
  {
    question: "If P(A) = 0.4, P(B) = 0.5, and A and B are independent, what is P(A∪B)?",
    options: [
      "0.9",
      "0.7",
      "0.2",
      "0.65"
    ],
    answer: 1,
    explanation: "For independent events, P(A∪B) = P(A) + P(B) − P(A)P(B) = 0.4 + 0.5 − (0.4×0.5) = 0.7."
  },
  {
    question: "In a class of 60 students, 36 study Economics, 24 study Statistics, and 12 study both. What is the probability that a randomly selected student studies neither?",
    options: [
      "1/5",
      "1/6",
      "1/10",
      "1/3"
    ],
    answer: 0,
    explanation: "Using inclusion-exclusion, students studying either subject = 36+24−12 = 48, so 60−48 = 12 study neither, giving a probability of 12/60 = 1/5."
  },
  {
    question: "The probability density function (pdf) of a continuous random variable must satisfy which condition?",
    options: [
      "f(x) ≥ 0 for all x, and the area under the curve equals 1",
      "f(x) = 1 for all x",
      "f(x) can be negative",
      "f(x) must be symmetric"
    ],
    answer: 0,
    explanation: "A valid probability density function must be non-negative everywhere, and the total area under its curve over all possible values must equal 1."
  },
  {
    question: "For a discrete random variable X, F(x) = P(X ≤ x) is called the:",
    options: [
      "Probability mass function",
      "Cumulative distribution function",
      "Moment generating function",
      "Joint density function"
    ],
    answer: 1,
    explanation: "F(x) = P(X ≤ x) defines the cumulative distribution function, which gives the probability that X is less than or equal to a given value."
  },
  {
    question: "Which of the following values CANNOT be a valid probability?",
    options: [
      "0",
      "0.999",
      "1.05",
      "1"
    ],
    answer: 2,
    explanation: "A probability value can never exceed 1, so 1.05 cannot represent a valid probability."
  },
  {
    question: "A fair coin is tossed 4 times. What is the probability of getting exactly 2 heads?",
    options: [
      "1/4",
      "3/8",
      "1/2",
      "1/16"
    ],
    answer: 1,
    explanation: "Using the binomial formula, P(exactly 2 heads in 4 tosses) = C(4,2)×(0.5)^4 = 6/16 = 3/8."
  },
  {
    question: "If X and Y are independent random variables, which of the following is always true?",
    options: [
      "Var(X+Y) = Var(X) + Var(Y)",
      "E(XY) = E(X) + E(Y)",
      "Var(X+Y) = Var(X) − Var(Y)",
      "E(X+Y) = E(X) × E(Y)"
    ],
    answer: 0,
    explanation: "For independent random variables, the variance of their sum equals the sum of their individual variances."
  },
  {
    question: "A student claims: 'If two events have a combined probability greater than 1, they must be independent.' This statement is:",
    options: [
      "True",
      "False",
      "True only if one event is the complement of the other",
      "False because it only applies to conditional probability"
    ],
    answer: 1,
    explanation: "A combined probability exceeding 1 is mathematically impossible for valid probabilities and has nothing to do with independence, making the claim false."
  },
  {
    question: "Which probability distribution describes the number of successes in a fixed number of independent Bernoulli trials?",
    options: [
      "Hypergeometric",
      "Binomial",
      "Poisson",
      "Normal"
    ],
    answer: 1,
    explanation: "The binomial distribution models the number of successes in a fixed number of independent Bernoulli trials, each with the same probability of success."
  },
  {
    question: "A Bernoulli random variable X takes the value 1 with probability p. What is Var(X)?",
    options: [
      "p",
      "p(1-p)",
      "p²",
      "1-p"
    ],
    answer: 1,
    explanation: "For a Bernoulli random variable, the variance is given by Var(X) = p(1−p)."
  },
  {
    question: "For a Bernoulli trial with p = 0.3, what is E(X)?",
    options: [
      "0.7",
      "0.21",
      "0.3",
      "1"
    ],
    answer: 2,
    explanation: "For a Bernoulli trial, the expected value E(X) simply equals the probability of success, p, which is 0.3 here."
  },
  {
    question: "Which is a key distinguishing feature of the hypergeometric distribution compared to the binomial distribution?",
    options: [
      "It requires a continuous outcome",
      "Sampling is done without replacement",
      "It can only be used when p = 0.5",
      "It has no fixed sample size"
    ],
    answer: 1,
    explanation: "Unlike the binomial distribution, the hypergeometric distribution applies when sampling is done without replacement, so probabilities change with each draw."
  },
  {
    question: "A box contains 10 items, 4 of which are defective. If 3 items are selected without replacement, what is the probability that exactly 2 are defective?",
    options: [
      "C(4,2)C(6,1)/C(10,3)",
      "C(4,2)C(6,1)/C(10,2)",
      "C(4,1)C(6,2)/C(10,3)",
      "C(4,3)/C(10,3)"
    ],
    answer: 0,
    explanation: "The probability of selecting exactly 2 defective items from 3 draws without replacement is found using C(4,2)×C(6,1) divided by the total ways to choose 3 from 10, C(10,3)."
  },
  {
    question: "The standard normal distribution has which of the following properties?",
    options: [
      "Mean = 1, Variance = 0",
      "Mean = 0, Standard deviation = 1",
      "Mean = 0, Variance = 0",
      "Mean = 1, Standard deviation = 1"
    ],
    answer: 1,
    explanation: "The standard normal distribution is defined by a mean of 0 and a standard deviation of 1."
  },
  {
    question: "If X ~ N(50,16), what is the standard deviation of X?",
    options: [
      "16",
      "4",
      "50",
      "8"
    ],
    answer: 1,
    explanation: "Since the variance given is 16, the standard deviation is the square root of 16, which is 4."
  },
  {
    question: "To convert a normal random variable X with mean μ and standard deviation σ to a standard normal variable Z, the correct formula is:",
    options: [
      "Z = (X − μ)/σ²",
      "Z = (X − μ)/σ",
      "Z = (X + μ)/σ",
      "Z = (μ − X)/σ²"
    ],
    answer: 1,
    explanation: "Standardizing a normal variable uses the formula Z = (X − μ)/σ."
  },
  {
    question: "If X ~ N(60,25), what is the corresponding Z-value for X = 65?",
    options: [
      "0.2",
      "1.0",
      "5.0",
      "2.0"
    ],
    answer: 1,
    explanation: "With mean 60 and variance 25 (σ=5), Z = (65−60)/5 = 1.0."
    },
  {
    question: "Which statement correctly describes the shape of the normal distribution curve?",
    options: [
      "Skewed to the right",
      "Skewed to the left",
      "Symmetric and bell-shaped about the mean",
      "Uniform across all values"
    ],
    answer: 2,
    explanation: "The normal distribution curve is symmetric and bell-shaped about its mean."
  },
  {
    question: "In a standard normal distribution, approximately what percentage of values lie within ±1 standard deviation of the mean?",
    options: [
      "50%",
      "68%",
      "95%",
      "99.7%"
    ],
    answer: 1,
    explanation: "Approximately 68% of values in a normal distribution lie within one standard deviation of the mean, per the empirical rule."
  },
  {
    question: "A lecturer states: 'Since the normal distribution is symmetric, the mean, median, and mode are always equal.' This statement is:",
    options: [
      "False, because the mode does not exist",
      "True",
      "False, because the mean is always greater than the median",
      "True only when the variance equals 1"
    ],
    answer: 1,
    explanation: "In a perfectly normal distribution, symmetry ensures the mean, median, and mode all coincide at the same central value."
  },
  {
    question: "Which of the following is the correct formula for the variance of a discrete random variable X?",
    options: [
      "Var(X) = E(X²) − E(X)",
      "Var(X) = E(X²) − [E(X)]²",
      "Var(X) = [E(X)]² − E(X²)",
      "Var(X) = [E(X)]² + E(X²)"
    ],
    answer: 1,
    explanation: "The variance of a discrete random variable is calculated as E(X²) minus the square of E(X)."
  },
  {
    question: "A discrete random variable X has the distribution P(X=1)=0.2, P(X=2)=0.3, P(X=3)=0.5. What is E(X)?",
    options: [
      "2.0",
      "2.3",
      "2.5",
      "1.8"
    ],
    answer: 1,
    explanation: "E(X) = (1×0.2)+(2×0.3)+(3×0.5) = 0.2+0.6+1.5 = 2.3."
  },
  {
    question: "Why can the hypergeometric distribution NOT be approximated by the binomial distribution when the sample size is large relative to the population?",
    options: [
      "The probability of success changes with each draw",
      "Hypergeometric variables are continuous",
      "The binomial distribution requires sampling without replacement",
      "The mean is undefined"
    ],
    answer: 0,
    explanation: "When the sample size is large relative to the population, sampling without replacement noticeably changes the probability of success on each draw, violating the constant-probability assumption of the binomial distribution."
  },
  {
    question: "If a fair die is rolled, what is the probability of getting a number greater than 4?",
    options: [
      "1/2",
      "1/3",
      "2/3",
      "1/6"
    ],
    answer: 1,
    explanation: "Only 2 of the 6 faces (5 and 6) are greater than 4, giving a probability of 2/6 = 1/3."
  },
  {
    question: "The conditional probability P(A|B) is defined as:",
    options: [
      "P(A∩B)/P(B), provided P(B) ≠ 0",
      "P(A∩B)/P(A)",
      "P(A) × P(B)",
      "P(A∪B)/P(B)"
    ],
    answer: 0,
    explanation: "Conditional probability is defined as P(A|B) = P(A∩B)/P(B), provided P(B) is not zero."
  },
  {
    question: "Events A and B are independent. Which of the following must be true?",
    options: [
      "P(A|B) = P(B|A)",
      "P(A∩B) = P(A) × P(B)",
      "P(A∪B) = P(A) + P(B)",
      "P(A) = P(B)"
    ],
    answer: 1,
    explanation: "By definition, two events are independent if and only if P(A∩B) = P(A) × P(B)."
  },
  {
    question: "A factory produces bolts, 2% of which are defective. In a sample of 100 bolts, which distribution best models the number of defective bolts?",
    options: [
      "Normal distribution",
      "Binomial distribution",
      "Hypergeometric distribution only",
      "Uniform distribution"
    ],
    answer: 1,
    explanation: "With a fixed sample size and a constant probability of a bolt being defective, the number of defective bolts follows a binomial distribution."
  },
  {
    question: "Which of the following statements about the mean of a probability distribution is FALSE?",
    options: [
      "The mean is also called the expected value",
      "The mean must always equal one of the possible values of the random variable",
      "The mean is a measure of central tendency",
      "The mean can be a non-integer"
    ],
    answer: 1,
    explanation: "The mean of a probability distribution does not need to be one of the random variable's possible values; it is simply a weighted average and can fall between them."
  },
  {
    question: "A continuous random variable X has pdf f(x)=k for 0 ≤ x ≤ 5 and 0 elsewhere. What is k?",
    options: [
      "1/5",
      "5",
      "1",
      "1/25"
    ],
    answer: 0,
    explanation: "Since the area under the pdf must equal 1, integrating k over the interval [0,5] gives 5k = 1, so k = 1/5."
  },
  {
    question: "If Z is a standard normal variable, what is P(Z > 0)?",
    options: [
      "1",
      "0",
      "0.5",
      "Cannot be determined"
    ],
    answer: 2,
    explanation: "Because the standard normal distribution is symmetric about 0, exactly half its probability lies above 0, so P(Z>0) = 0.5."
  },
  {
    question: "Which statement correctly distinguishes a probability mass function (pmf) from a probability density function (pdf)?",
    options: [
      "pmf applies to continuous variables",
      "pmf gives P(X=x) directly for discrete variables, while pdf requires integration",
      "They are interchangeable",
      "pmf values must sum to more than 1"
    ],
    answer: 1,
    explanation: "A pmf gives P(X=x) directly for discrete variables, while a pdf requires integrating over an interval to obtain a probability, since P(X=x) is zero for any single point in a continuous distribution."
  },
  {
    question: "A student selects 4 cards from a standard deck without replacement. What distribution models the number of aces selected?",
    options: [
      "Binomial",
      "Bernoulli",
      "Hypergeometric",
      "Normal"
    ],
    answer: 2,
    explanation: "Selecting cards from a deck without replacement, where the population of aces is fixed, is modeled by the hypergeometric distribution."
  },
  {
    question: "If the variance of a random variable X is 0, what can be concluded?",
    options: [
      "X is undefined",
      "X is a constant",
      "X follows a standard normal distribution",
      "X is uniformly distributed"
    ],
    answer: 1,
    explanation: "A variance of 0 means there is no spread at all in the values of X, so X must be a constant."
  },
  {
    question: "A lecturer sets P(A)=0.6 and P(A∩B)=0.7. What can be immediately concluded?",
    options: [
      "B is more likely than A",
      "This is impossible because P(A∩B) cannot exceed P(A)",
      "A and B are independent",
      "A and B are mutually exclusive"
    ],
    answer: 1,
    explanation: "Since the intersection of two events can never exceed the probability of either individual event, P(A∩B) cannot be greater than P(A), making this scenario impossible."
  },
  {
    question: "In how many distinct ways can 6 people be seated around a circular table?",
    options: [
      "6!",
      "5!",
      "6!/2",
      "720"
    ],
    answer: 1,
    explanation: "Circular permutations of n distinct objects are calculated as (n−1)!, so seating 6 people around a table gives 5! arrangements."
  },
  {
    question: "Why do we divide by the standard deviation when standardizing a normal variable?",
    options: [
      "To shift the mean to zero",
      "To express values in standard deviation units and obtain variance 1",
      "To make the distribution skewed",
      "To convert a continuous variable into a discrete variable"
    ],
    answer: 1,
    explanation: "Dividing by the standard deviation rescales the variable into standard deviation units, ensuring the standardized variable has a variance of 1."
  },
  {
    question: "A box contains 6 white and 4 black balls. If 2 balls are drawn with replacement, what is the probability both are white?",
    options: [
      "9/25",
      "3/5",
      "6/10",
      "1/3"
    ],
    answer: 0,
    explanation: "Since the draws are with replacement, P(both white) = (6/10) × (6/10) = 9/25."
  },
  {
    question: "Which scenario violates the assumptions required for using the binomial distribution?",
    options: [
      "Tossing a fair coin 10 times",
      "Drawing 5 cards without replacement",
      "Testing 20 independent light bulbs",
      "Surveying 50 independent people"
    ],
    answer: 1,
    explanation: "Drawing cards without replacement changes the probability of success on each draw, violating the binomial distribution's requirement of independent trials with constant probability."
  },
  {
    question: "If E(X)=4 and Var(X)=9, what is E(X²)?",
    options: [
      "13",
      "25",
      "16",
      "5"
    ],
    answer: 1,
    explanation: "Since Var(X) = E(X²) − [E(X)]², rearranging gives E(X²) = Var(X) + [E(X)]² = 9 + 16 = 25."
  },
  {
    question: "Which relationship between combinations and permutations is always true?",
    options: [
      "nCr > nPr",
      "nCr = nPr",
      "nPr = nCr × r!",
      "They are unrelated"
    ],
    answer: 2,
    explanation: "Because a permutation accounts for order while a combination does not, nPr always equals nCr multiplied by r!."
  },
    {
    question: "A biased coin has P(Head)=0.7. If tossed 5 times, what is the probability of getting at least one head?",
    options: [
      "1 − (0.3)^5",
      "(0.7)^5",
      "0.7 × 5",
      "1 − (0.7)^5"
    ],
    answer: 0,
    explanation: "The probability of at least one head is the complement of getting no heads at all in 5 tosses, calculated as 1 − (0.3)^5."
  },
  {
    question: "A researcher wrongly assumes that because a dataset is large, it must follow a normal distribution. Which statement best critiques this assumption?",
    options: [
      "Large sample size guarantees normality",
      "Large samples justify approximate normality of the sampling distribution of the mean, not necessarily the population",
      "The assumption is correct if the variance is finite",
      "Normality only requires the mean to be positive"
    ],
    answer: 1,
    explanation: "By the Central Limit Theorem, a large sample size justifies approximate normality of the sampling distribution of the mean, but it does not mean the underlying population itself is normally distributed."
  }
];
const CHM102 = [
  {
    question: "Transition elements are mainly found in which block of the periodic table?",
    options: [
      "p-block",
      "d-block",
      "s-block",
      "f-block"
    ],
    answer: 1,
    explanation: "Transition elements occupy the d-block, located between groups 2 and 13 of the periodic table."
  },
  {
    question: "A defining chemical feature of transition metals is their ability to:",
    options: [
      "Exhibit multiple oxidation states",
      "Exist only as gases at room temperature",
      "Form only one oxidation state",
      "React violently with water like Group 1 metals"
    ],
    answer: 0,
    explanation: "Transition metals commonly show variable oxidation states because electrons in both the outer s and inner d orbitals can be lost."
  },
  {
    question: "Many transition metal compounds are coloured mainly because of:",
    options: [
      "Their high melting points",
      "d-d electron transitions within partially filled d orbitals",
      "Their low density",
      "Their position in Group 1"
    ],
    answer: 1,
    explanation: "Colour in transition metal compounds usually arises from electronic transitions between partially filled d orbitals."
  },
  {
    question: "Which property makes transition metals useful as industrial catalysts?",
    options: [
      "Their extreme softness",
      "Their tendency to dissolve in water",
      "Their inability to form complex ions",
      "Their ability to exist in multiple oxidation states and form intermediates"
    ],
    answer: 3,
    explanation: "The ability to switch between oxidation states allows transition metals to form temporary intermediates, making them effective catalysts."
  },
  {
    question: "Group 1 elements are commonly known as the:",
    options: [
      "Alkali metals",
      "Noble gases",
      "Halogens",
      "Alkaline earth metals"
    ],
    answer: 0,
    explanation: "Group 1 elements, such as sodium and potassium, are known as the alkali metals."
  },
  {
    question: "Alkali metals are generally stored under oil mainly to prevent:",
    options: [
      "Increase in melting point",
      "Reaction with air and moisture",
      "Loss of colour",
      "Loss of radioactivity"
    ],
    answer: 1,
    explanation: "Alkali metals are highly reactive with oxygen and water, so they are stored under oil to prevent unwanted reactions."
  },
  {
    question: "Down Group 1, reactivity of the alkali metals generally:",
    options: [
      "Remains constant",
      "Becomes zero",
      "Increases",
      "Decreases"
    ],
    answer: 2,
    explanation: "Reactivity increases down Group 1 as the outer electron becomes easier to lose due to increasing atomic size."
  },
  {
    question: "Group 2 elements are referred to as the:",
    options: [
      "Alkaline earth metals",
      "Noble gases",
      "Transition metals",
      "Lanthanides"
    ],
    answer: 0,
    explanation: "Group 2 elements, including magnesium and calcium, are called the alkaline earth metals."
  },
  {
    question: "Compared with Group 1 metals, Group 2 metals are generally:",
    options: [
      "Identical in reactivity",
      "Non-metallic",
      "Harder and less reactive",
      "Softer and more reactive"
    ],
    answer: 2,
    explanation: "Group 2 metals are harder and less reactive than the corresponding Group 1 metals due to stronger metallic bonding."
  },
  {
    question: "Carbon belongs to which group of the periodic table?",
    options: [
      "Group 1",
      "Group 14 (IV)",
      "Group 17",
      "Group 2"
    ],
    answer: 1,
    explanation: "Carbon is the head element of Group 14, also historically called Group IV."
  },
  {
    question: "A characteristic feature shared by all Group 14 elements is:",
    options: [
      "A single valence electron",
      "Strong metallic character only",
      "Four electrons in the outer shell",
      "Complete inertness"
    ],
    answer: 2,
    explanation: "All Group 14 elements have four electrons in their outer shell, allowing them to form up to four covalent bonds."
  },
  {
    question: "Diamond and graphite are both examples of:",
    options: [
      "Polymers of silicon",
      "Allotropes of carbon",
      "Isomers of carbon",
      "Isotopes of carbon"
    ],
    answer: 1,
    explanation: "Diamond and graphite are allotropes, different structural forms of the same element, carbon."
  },
  {
    question: "An organic compound is generally defined as one that contains:",
    options: [
      "Carbon, usually bonded to hydrogen",
      "Only ionic bonds",
      "Only metallic elements",
      "No hydrogen at all"
    ],
    answer: 0,
    explanation: "Organic compounds are typically defined as carbon-containing compounds, most of which also contain hydrogen."
  },
  {
    question: "Carbon's ability to form long chains and rings by bonding to itself is called:",
    options: [
      "Isomerism",
      "Catenation",
      "Hydrogenation",
      "Polarization"
    ],
    answer: 1,
    explanation: "Catenation refers to carbon's unique ability to bond extensively with other carbon atoms, forming chains and rings."
  },
  {
    question: "A series of organic compounds differing by a -CH2- unit, with similar chemical properties, is called a:",
    options: [
      "Stereo series",
      "Isotope series",
      "Polymer chain",
      "Homologous series"
    ],
    answer: 3,
    explanation: "Compounds in a homologous series share a general formula and similar properties, differing by a repeating -CH2- unit."
  },
  {
    question: "Compounds with the same molecular formula but different structural arrangements are called:",
    options: [
      "Allotropes",
      "Isotopes",
      "Isomers",
      "Homologs"
    ],
    answer: 2,
    explanation: "Isomers share the same molecular formula but differ in how their atoms are arranged."
  },
  {
    question: "Hydrocarbons are compounds composed only of:",
    options: [
      "Carbon and hydrogen",
      "Hydrogen and nitrogen",
      "Carbon and oxygen",
      "Carbon and nitrogen"
    ],
    answer: 0,
    explanation: "A hydrocarbon, as the name suggests, contains only carbon and hydrogen atoms."
  },
  {
    question: "Hydrocarbons containing only single bonds between carbon atoms are described as:",
    options: [
      "Radioactive",
      "Saturated",
      "Aromatic",
      "Unsaturated"
    ],
    answer: 1,
    explanation: "Saturated hydrocarbons contain only single carbon-carbon bonds, with no double or triple bonds."
  },
  {
    question: "The general formula for alkanes is:",
    options: [
      "CnH2n",
      "CnHn",
      "CnH2n-2",
      "CnH2n+2"
    ],
    answer: 3,
    explanation: "Alkanes follow the general formula CnH2n+2, reflecting their fully saturated structure."
  },
  {
    question: "Which of the following is the simplest member of the alkane series?",
    options: [
      "Methane",
      "Ethyne",
      "Ethene",
      "Propene"
    ],
    answer: 0,
    explanation: "Methane (CH4), with just one carbon atom, is the simplest alkane."
  },
  {
    question: "Alkanes mainly undergo which type of reaction with halogens, under suitable conditions?",
    options: [
      "Addition",
      "Polymerization",
      "Hydrolysis",
      "Substitution"
    ],
    answer: 3,
    explanation: "Because alkanes are saturated, they react with halogens mainly through substitution rather than addition."
  },
  {
    question: "Alkenes are unsaturated hydrocarbons that contain at least one:",
    options: [
      "Double bond",
      "Ionic bond",
      "Hydrogen bond",
      "Triple bond"
    ],
    answer: 0,
    explanation: "Alkenes are defined by the presence of at least one carbon-carbon double bond."
  },
  {
    question: "The general formula for the alkene series is:",
    options: [
      "CnH2n-4",
      "CnH2n-2",
      "CnH2n",
      "CnH2n+2"
    ],
    answer: 2,
    explanation: "Alkenes follow the general formula CnH2n, due to one degree of unsaturation from the double bond."
  },
  {
    question: "A simple test to distinguish an alkene from an alkane is to add the sample to:",
    options: [
      "Dilute hydrochloric acid",
      "Sodium chloride solution",
      "Distilled water",
      "Bromine water"
    ],
    answer: 3,
    explanation: "Alkenes decolourize bromine water through an addition reaction, while alkanes do not react under normal conditions."
  },
  {
    question: "Alkenes typically react with hydrogen gas, in the presence of a catalyst, through:",
    options: [
      "Combustion only",
      "Addition",
      "Oxidation only",
      "Substitution"
    ],
    answer: 1,
    explanation: "Alkenes readily undergo addition reactions, such as adding hydrogen across the double bond to form an alkane."
  },
  {
    question: "Alkynes are hydrocarbons characterized by the presence of a:",
    options: [
      "Single bond only",
      "Double bond",
      "Triple bond",
      "Ionic bond"
    ],
    answer: 2,
    explanation: "Alkynes contain at least one carbon-carbon triple bond, making them more unsaturated than alkenes."
  },
  {
    question: "The general formula for the alkyne series is:",
    options: [
      "CnH2n-4",
      "CnH2n-2",
      "CnH2n",
      "CnH2n+2"
    ],
    answer: 1,
    explanation: "Alkynes follow the general formula CnH2n-2, reflecting their triple bond."
  },
  {
    question: "The simplest alkyne, commonly used in welding torches, is:",
    options: [
      "Methane",
      "Propane",
      "Ethene",
      "Ethyne"
    ],
    answer: 3,
    explanation: "Ethyne (acetylene), the simplest alkyne, burns with an intensely hot flame and is widely used for welding."
  },
  {
    question: "Compared to alkanes with the same number of carbon atoms, alkynes generally have:",
    options: [
      "No hydrogen atoms",
      "Identical hydrogen content",
      "Fewer hydrogen atoms",
      "More hydrogen atoms"
    ],
    answer: 2,
    explanation: "Because of their triple bond, alkynes contain fewer hydrogen atoms than the corresponding alkane."
  },
  {
    question: "Hydrocarbons can be broadly classified as aliphatic or:",
    options: [
      "Diatomic",
      "Radioactive",
      "Inorganic",
      "Aromatic"
    ],
    answer: 3,
    explanation: "Hydrocarbons are broadly divided into aliphatic (chain-based) and aromatic (ring-based, like benzene) compounds."
  },
  {
    question: "Petroleum is primarily a natural source of:",
    options: [
      "Inorganic salts",
      "Hydrocarbons",
      "Metallic ores",
      "Noble gases"
    ],
    answer: 1,
    explanation: "Crude petroleum is a complex mixture of hydrocarbons, separated industrially through fractional distillation."
  },
  {
    question: "Complete combustion of a hydrocarbon in excess oxygen mainly produces:",
    options: [
      "Carbon and hydrogen gas",
      "Carbon monoxide and water only",
      "Carbon dioxide and water",
      "Nitrogen and oxygen"
    ],
    answer: 2,
    explanation: "Complete combustion of hydrocarbons in sufficient oxygen yields carbon dioxide and water as the main products."
  },
  {
    question: "Stereochemistry is the branch of chemistry concerned with:",
    options: [
      "The three-dimensional arrangement of atoms in molecules",
      "The energy changes in reactions",
      "The rate of chemical reactions",
      "The naming of inorganic salts"
    ],
    answer: 0,
    explanation: "Stereochemistry studies how atoms are arranged in space within molecules, and how that arrangement affects properties."
  },
  {
    question: "Isomers with the same structural formula but different spatial arrangement are called:",
    options: [
      "Chain isomers",
      "Structural isomers",
      "Functional isomers",
      "Stereoisomers"
    ],
    answer: 3,
    explanation: "Stereoisomers share the same connectivity of atoms but differ in their three-dimensional spatial arrangement."
  },
  {
    question: "Cis-trans (geometric) isomerism typically arises in alkenes because of restricted rotation around the:",
    options: [
      "Hydrogen bond",
      "Ionic bond",
      "Double bond",
      "Single bond"
    ],
    answer: 2,
    explanation: "The double bond in alkenes restricts rotation, allowing substituents to be fixed on the same or opposite sides, producing cis and trans isomers."
  },
  {
    question: "In a cis-isomer, similar substituent groups are positioned:",
    options: [
      "Randomly distributed",
      "Always at the terminal carbon",
      "On opposite sides of the double bond",
      "On the same side of the double bond"
    ],
    answer: 3,
    explanation: "In the cis configuration, similar groups lie on the same side of the carbon-carbon double bond."
  },
  {
    question: "A molecule that is non-superimposable on its mirror image is described as:",
    options: [
      "Saturated",
      "Aromatic",
      "Chiral",
      "Symmetrical"
    ],
    answer: 2,
    explanation: "A chiral molecule cannot be superimposed on its own mirror image, much like a left and right hand."
  },
  {
    question: "A carbon atom bonded to four different groups is called a:",
    options: [
      "Saturated carbon",
      "Quaternary carbon",
      "Aromatic carbon",
      "Chiral centre"
    ],
    answer: 3,
    explanation: "A carbon bonded to four different substituents is known as a chiral centre, giving rise to optical isomerism."
  },
  {
    question: "Optical isomers that are non-superimposable mirror images of each other are called:",
    options: [
      "Enantiomers",
      "Homologs",
      "Allotropes",
      "Polymers"
    ],
    answer: 0,
    explanation: "Enantiomers are pairs of optical isomers that are mirror images of one another but cannot be superimposed."
  },
  {
    question: "Optical isomers mainly differ in their ability to:",
    options: [
      "Dissolve in water",
      "Conduct electricity",
      "Rotate plane-polarized light",
      "React with oxygen"
    ],
    answer: 2,
    explanation: "Optical isomers rotate plane-polarized light in different directions, a property used to distinguish them."
  },
  {
    question: "Which functional group characterizes alcohols in organic chemistry?",
    options: [
      "-COOH",
      "-NH2",
      "-CHO",
      "-OH"
    ],
    answer: 3,
    explanation: "Alcohols are identified by the hydroxyl (-OH) functional group attached to a carbon chain."
  },
  {
    question: "The functional group -COOH identifies a compound as a member of which class?",
    options: [
      "Aldehydes",
      "Ketones",
      "Carboxylic acids",
      "Amines"
    ],
    answer: 2,
    explanation: "The carboxyl group, -COOH, is the defining functional group of carboxylic acids."
  },
  {
    question: "Polymerization of alkenes such as ethene mainly produces:",
    options: [
      "Long-chain polymers like polythene",
      "Alkanes",
      "Alcohols",
      "Carboxylic acids"
    ],
    answer: 0,
    explanation: "Alkenes like ethene can undergo addition polymerization, joining many small monomer units into long-chain polymers such as polythene."
  },
  {
    question: "A transition metal commonly used as a catalyst in the Haber process for ammonia production is:",
    options: [
      "Magnesium",
      "Sodium",
      "Calcium",
      "Iron"
    ],
    answer: 3,
    explanation: "Iron is used as the catalyst in the Haber process, which combines nitrogen and hydrogen to produce ammonia."
  },
  {
    question: "Group 1 metal oxides dissolved in water generally produce solutions that are:",
    options: [
      "Neutral",
      "Strongly basic",
      "Strongly acidic",
      "Weakly acidic"
    ],
    answer: 1,
    explanation: "Group 1 metal oxides react with water to form strongly basic (alkaline) hydroxide solutions."
  },
  {
    question: "Down Group 2, the solubility of the metal hydroxides generally:",
    options: [
      "Increases",
      "Decreases",
      "Stays constant",
      "Becomes zero immediately"
    ],
    answer: 0,
    explanation: "Solubility of Group 2 hydroxides generally increases down the group, unlike their sulfates, which decrease."
  },
  {
    question: "Silicon, found in the same group as carbon, is widely used in industry mainly as a:",
    options: [
      "Strong reducing agent only",
      "Semiconductor in electronics",
      "Noble gas substitute",
      "Highly reactive metal"
    ],
    answer: 1,
    explanation: "Silicon's intermediate conductivity makes it a key semiconductor material in the electronics industry."
  },
  {
    question: "Which best describes the trend in atomic size down Group 1?",
    options: [
      "Atomic size increases",
      "Atoms disappear entirely",
      "Atomic size remains unchanged",
      "Atomic size decreases"
    ],
    answer: 0,
    explanation: "Atomic size increases down Group 1 as additional electron shells are added."
  },
  {
    question: "A key reason transition metals can form complex ions is their:",
    options: [
      "Position in Group 1",
      "Availability of empty or partially filled d-orbitals to accept electron pairs",
      "Lack of d-orbitals",
      "Extremely large atomic radius"
    ],
    answer: 1,
    explanation: "Transition metals have empty or partially filled d-orbitals that can accept lone pairs of electrons from ligands, forming complex ions."
  },
  {
    question: "Which best distinguishes organic compounds from most inorganic compounds?",
    options: [
      "Organic compounds are based primarily on carbon chains and rings",
      "Organic compounds are always ionic",
      "Organic compounds never contain oxygen",
      "Organic compounds cannot burn"
    ],
    answer: 0,
    explanation: "Organic chemistry centers on carbon-based compounds, typically forming chains or rings with covalent bonding."
  }
];
const BIO102 = [
  {
    question: "The science of classifying living organisms into groups is known as:",
    options: [
      "Taxonomy",
      "Genetics",
      "Physiology",
      "Ecology"
    ],
    answer: 0,
    explanation: "Taxonomy is the branch of biology concerned with classifying organisms into hierarchical groups."
  },
  {
    question: "The broadest, most inclusive level of biological classification is the:",
    options: [
      "Species",
      "Domain",
      "Genus",
      "Family"
    ],
    answer: 1,
    explanation: "Domain is the highest and broadest taxonomic rank, above kingdom."
  },
  {
    question: "The three-domain system of classification was proposed mainly to separate:",
    options: [
      "Bacteria, Archaea, and Eukarya",
      "Vertebrates and invertebrates",
      "Plants, animals, and fungi",
      "Producers and consumers"
    ],
    answer: 0,
    explanation: "The three-domain system groups all life into Bacteria, Archaea, and Eukarya, based on fundamental cellular differences."
  },
  {
    question: "Organisms in Domain Archaea are notable for often living in:",
    options: [
      "Only temperate forests",
      "Extreme environments",
      "Only inside animal bodies",
      "Only freshwater lakes"
    ],
    answer: 1,
    explanation: "Many archaea are extremophiles, thriving in environments such as hot springs, salt lakes, and deep-sea vents."
  },
  {
    question: "The taxonomic rank directly below Domain is:",
    options: [
      "Class",
      "Order",
      "Kingdom",
      "Phylum"
    ],
    answer: 2,
    explanation: "Kingdom is the second-broadest taxonomic rank, found directly beneath domain."
  },
  {
    question: "The traditional five-kingdom classification system includes Monera, Protista, Fungi, Plantae, and:",
    options: [
      "Bacteria",
      "Archaea",
      "Eukarya",
      "Animalia"
    ],
    answer: 3,
    explanation: "The five-kingdom system groups life into Monera, Protista, Fungi, Plantae, and Animalia."
  },
  {
    question: "Kingdom Monera is mainly characterized by organisms that are:",
    options: [
      "Prokaryotic, lacking a true nucleus",
      "Multicellular with true nuclei",
      "Strictly parasitic only",
      "Always photosynthetic"
    ],
    answer: 0,
    explanation: "Monera consists of prokaryotic organisms, mainly bacteria, whose cells lack a membrane-bound nucleus."
  },
  {
    question: "Which of these best describes a typical member of Kingdom Protista?",
    options: [
      "An organism lacking any nucleus",
      "A simple eukaryotic organism, often unicellular",
      "A complex multicellular animal",
      "A spore-forming bacterium"
    ],
    answer: 1,
    explanation: "Protists are typically simple eukaryotic organisms, many of which are unicellular, such as amoeba and paramecium."
  },
  {
    question: "Algae and protozoa are most commonly classified under Kingdom:",
    options: [
      "Fungi",
      "Plantae",
      "Protista",
      "Animalia"
    ],
    answer: 2,
    explanation: "Both algae and protozoa are grouped under Kingdom Protista due to their simple eukaryotic cell structure."
  },
  {
    question: "A key feature distinguishing Kingdom Fungi from Kingdom Plantae is that fungi are:",
    options: [
      "Always motile",
      "Entirely prokaryotic",
      "Autotrophic, containing chlorophyll",
      "Heterotrophic, lacking chlorophyll"
    ],
    answer: 3,
    explanation: "Unlike plants, fungi cannot photosynthesize and must obtain nutrients by absorbing organic matter."
  },
  {
    question: "The cell walls of most fungi are primarily composed of:",
    options: [
      "Chitin",
      "Cellulose",
      "Peptidoglycan",
      "Keratin"
    ],
    answer: 0,
    explanation: "Fungal cell walls are largely made of chitin, a tough structural polysaccharide also found in insect exoskeletons."
  },
  {
    question: "The thread-like structures that make up the body of most fungi are called:",
    options: [
      "Villi",
      "Hyphae",
      "Rhizomes",
      "Nephrons"
    ],
    answer: 1,
    explanation: "Hyphae are the thin, branching filaments that form the main body, or mycelium, of most fungi."
  },
  {
    question: "A mass of interwoven hyphae forming the main fungal body is called the:",
    options: [
      "Thallus",
      "Sporangium",
      "Mycelium",
      "Mycorrhiza"
    ],
    answer: 2,
    explanation: "The mycelium is the network of hyphae that makes up the vegetative, feeding part of a fungus."
  },
  {
    question: "Yeasts, moulds, and mushrooms are all examples of organisms in Kingdom:",
    options: [
      "Plantae",
      "Protista",
      "Monera",
      "Fungi"
    ],
    answer: 3,
    explanation: "Yeasts, moulds, and mushrooms are all classified within Kingdom Fungi."
  },
  {
    question: "In ecosystems, fungi play a major role mainly as:",
    options: [
      "Decomposers, breaking down dead organic matter",
      "Photosynthetic organisms only",
      "Top predators only",
      "Primary producers only"
    ],
    answer: 0,
    explanation: "Fungi are key decomposers, breaking down dead organisms and recycling nutrients back into the ecosystem."
  },
  {
    question: "Kingdom Plantae mainly consists of organisms that are:",
    options: [
      "Parasitic and chlorophyll-free",
      "Multicellular and autotrophic, performing photosynthesis",
      "Prokaryotic and motile",
      "Unicellular and heterotrophic"
    ],
    answer: 1,
    explanation: "Plants are multicellular autotrophs that manufacture their own food through photosynthesis."
  },
  {
    question: "The cell walls of plant cells are mainly composed of:",
    options: [
      "Lignin only",
      "Peptidoglycan",
      "Cellulose",
      "Chitin"
    ],
    answer: 2,
    explanation: "Plant cell walls are primarily built from cellulose, providing structural support."
  },
  {
    question: "Mosses, which lack true vascular tissue, belong to which plant group?",
    options: [
      "Pteridophytes",
      "Gymnosperms",
      "Angiosperms",
      "Bryophytes"
    ],
    answer: 3,
    explanation: "Bryophytes, such as mosses, are simple plants that lack true vascular (conducting) tissue."
  },
  {
    question: "Ferns, which reproduce by spores and possess vascular tissue, belong to which group?",
    options: [
      "Pteridophytes",
      "Gymnosperms",
      "Bryophytes",
      "Angiosperms"
    ],
    answer: 0,
    explanation: "Pteridophytes, such as ferns, have vascular tissue but reproduce by spores rather than seeds."
  },
  {
    question: "Plants that produce seeds without enclosing them in a fruit, such as pine trees, are called:",
    options: [
      "Bryophytes",
      "Gymnosperms",
      "Pteridophytes",
      "Angiosperms"
    ],
    answer: 1,
    explanation: "Gymnosperms, like conifers, produce 'naked' seeds that are not enclosed within a fruit."
  },
  {
    question: "Flowering plants that produce seeds enclosed within a fruit are classified as:",
    options: [
      "Bryophytes",
      "Gymnosperms",
      "Angiosperms",
      "Pteridophytes"
    ],
    answer: 2,
    explanation: "Angiosperms are flowering plants whose seeds develop inside a protective fruit."
  },
  {
    question: "Kingdom Animalia consists mainly of organisms that are:",
    options: [
      "Prokaryotic and photosynthetic",
      "Unicellular and autotrophic",
      "Cell-wall-bound and immobile",
      "Multicellular and heterotrophic"
    ],
    answer: 3,
    explanation: "Animals are multicellular heterotrophs that must consume other organisms for nutrition."
  },
  {
    question: "Unlike plant cells, typical animal cells lack a:",
    options: [
      "Cell wall",
      "Mitochondria",
      "Nucleus",
      "Cell membrane"
    ],
    answer: 0,
    explanation: "Animal cells generally lack the rigid cell wall found surrounding plant cells."
  },
  {
    question: "Animals possessing a backbone are classified as:",
    options: [
      "Bryophytes",
      "Vertebrates",
      "Invertebrates",
      "Protists"
    ],
    answer: 1,
    explanation: "Vertebrates are animals that possess a vertebral column, or backbone."
  },
  {
    question: "Insects, worms, and molluscs are examples of animals classified as:",
    options: [
      "Bryophytes",
      "Gymnosperms",
      "Invertebrates",
      "Vertebrates"
    ],
    answer: 2,
    explanation: "Invertebrates are animals lacking a backbone, a group that includes insects, worms, and molluscs."
  },
  {
    question: "The correct order of taxonomic ranks, from broadest to most specific, is:",
    options: [
      "Genus, Species, Family, Order, Class, Phylum, Kingdom, Domain",
      "Species, Genus, Family, Order, Class, Phylum, Kingdom, Domain",
      "Kingdom, Domain, Class, Phylum, Family, Order, Genus, Species",
      "Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species"
    ],
    answer: 3,
    explanation: "Taxonomic classification proceeds from the broadest rank, Domain, down to the most specific, Species."
  },
  {
    question: "The scientific naming system that gives each organism a two-part Latin name is called:",
    options: [
      "Binomial nomenclature",
      "Cladistic analysis",
      "Taxonomic ranking",
      "Phylogenetic mapping"
    ],
    answer: 0,
    explanation: "Binomial nomenclature assigns each species a two-part Latin name, consisting of genus and species."
  },
  {
    question: "In the scientific name 'Homo sapiens,' the word 'Homo' represents the organism's:",
    options: [
      "Family",
      "Genus",
      "Species",
      "Kingdom"
    ],
    answer: 1,
    explanation: "In binomial nomenclature, the first word, written with a capital letter, denotes the genus."
  },
  {
    question: "In the scientific name 'Homo sapiens,' the word 'sapiens' represents the organism's:",
    options: [
      "Order",
      "Genus",
      "Species",
      "Phylum"
    ],
    answer: 2,
    explanation: "The second word in a binomial name, written in lowercase, denotes the specific species epithet."
  },
  {
    question: "The smallest and most specific unit in biological classification is the:",
    options: [
      "Genus",
      "Domain",
      "Family",
      "Species"
    ],
    answer: 3,
    explanation: "Species is the most specific taxonomic rank, referring to a group of organisms capable of interbreeding."
  },
  {
    question: "A major criterion used to classify organisms into Domain Eukarya rather than prokaryotic domains is the presence of:",
    options: [
      "A membrane-bound nucleus",
      "Mobility",
      "Cell walls",
      "Photosynthetic pigments"
    ],
    answer: 0,
    explanation: "Domain Eukarya is distinguished by cells possessing a true, membrane-bound nucleus, unlike Bacteria or Archaea."
  },
  {
    question: "Which of the following is generally used as a key criterion when classifying organisms into kingdoms?",
    options: [
      "Body colour alone",
      "Mode of nutrition and cell structure",
      "Average lifespan alone",
      "Geographic location alone"
    ],
    answer: 1,
    explanation: "Classification into kingdoms typically considers traits such as nutrition mode, cell structure, and organization."
  },
  {
    question: "Organisms that manufacture their own food using sunlight are described as:",
    options: [
      "Parasitic",
      "Saprophytic",
      "Autotrophic",
      "Heterotrophic"
    ],
    answer: 2,
    explanation: "Autotrophic organisms, like green plants, synthesize their own food through photosynthesis."
  },
  {
    question: "Organisms that must obtain nutrients by consuming other organisms are described as:",
    options: [
      "Photosynthetic",
      "Chemosynthetic only",
      "Autotrophic",
      "Heterotrophic"
    ],
    answer: 3,
    explanation: "Heterotrophic organisms cannot make their own food and must obtain nutrients from other organisms."
  },
  {
    question: "Bacteria are generally classified within which domain?",
    options: [
      "Domain Bacteria",
      "Domain Eukarya only",
      "Domain Archaea only",
      "Domain Plantae"
    ],
    answer: 0,
    explanation: "True bacteria are placed in Domain Bacteria, distinct from the structurally different Archaea."
  },
  {
    question: "A key structural difference between bacteria (Domain Bacteria) and archaea is found mainly in their:",
    options: [
      "Presence of a true nucleus in both",
      "Cell wall and membrane composition",
      "Total absence of any genetic material",
      "Identical ribosomal structure"
    ],
    answer: 1,
    explanation: "Bacteria and Archaea differ notably in their cell wall and membrane chemistry, despite both being prokaryotic."
  },
  {
    question: "Viruses are generally NOT classified within the traditional five-kingdom system mainly because they:",
    options: [
      "Always contain chlorophyll",
      "Are too large to classify",
      "Are not considered fully living, lacking independent cellular structure",
      "Only exist in plants"
    ],
    answer: 2,
    explanation: "Viruses lack independent cellular structure and cannot reproduce without a host, so they fall outside conventional kingdom classification."
  },
  {
    question: "Mushrooms obtain their nutrients mainly through:",
    options: [
      "Active hunting of prey",
      "Photosynthesis",
      "Filtering nutrients from air alone",
      "Absorbing nutrients from organic matter"
    ],
    answer: 3,
    explanation: "Fungi like mushrooms secrete enzymes onto organic material and absorb the resulting nutrients."
  },
  {
    question: "Which group within Kingdom Plantae is generally considered the most evolutionarily advanced, due to flower and fruit production?",
    options: [
      "Angiosperms",
      "Gymnosperms",
      "Bryophytes",
      "Pteridophytes"
    ],
    answer: 0,
    explanation: "Angiosperms, the flowering plants, are generally regarded as the most evolutionarily advanced plant group."
  },
  {
    question: "Amoeba, a single-celled organism that moves using pseudopodia, is classified under Kingdom:",
    options: [
      "Fungi",
      "Protista",
      "Animalia",
      "Monera"
    ],
    answer: 1,
    explanation: "Amoeba is a unicellular eukaryote classified under Kingdom Protista."
  },
  {
    question: "Which feature is generally used to separate Kingdom Animalia from Kingdom Plantae?",
    options: [
      "Animals can never reproduce sexually",
      "Plants always lack chlorophyll",
      "Animals are heterotrophic and lack cell walls, unlike plants",
      "Animals always lack a nucleus"
    ],
    answer: 2,
    explanation: "Animals differ from plants mainly in being heterotrophic and lacking the rigid cellulose cell walls found in plants."
  },
  {
    question: "The classification rank found between Kingdom and Class is the:",
    options: [
      "Order",
      "Genus",
      "Family",
      "Phylum"
    ],
    answer: 3,
    explanation: "Phylum is the taxonomic rank that sits directly below Kingdom and above Class."
  },
  {
    question: "Members of the same genus but different species are generally:",
    options: [
      "Closely related but unable to interbreed successfully",
      "Always from different kingdoms",
      "Incapable of any biological relationship",
      "Identical in every characteristic"
    ],
    answer: 0,
    explanation: "Species within the same genus share close evolutionary ancestry but are typically unable to produce fertile offspring together."
  },
  {
    question: "A major reason classification systems are continually revised is that:",
    options: [
      "Older systems are always proven completely wrong",
      "New genetic and molecular evidence reshapes our understanding of relationships",
      "Organisms evolve new kingdoms overnight",
      "Classification never changes once established"
    ],
    answer: 1,
    explanation: "Advances in genetics and molecular biology frequently provide new evidence that reshapes how organisms are classified."
  },
  {
    question: "In the standard taxonomic hierarchy, which rank comes directly after Family?",
    options: [
      "Tribe",
      "Kingdom",
      "Genus",
      "Domain"
    ],
    answer: 2,
    explanation: "In the standard hierarchy, Genus follows directly after Family, without a required intermediate rank for basic classification."
  },
  {
    question: "Which best describes the relationship between Kingdom Monera and bacteria?",
    options: [
      "Bacteria were never classified under Monera",
      "Monera and bacteria are entirely unrelated groups",
      "Monera consists only of multicellular organisms",
      "Kingdom Monera traditionally included all bacteria, before being split into separate domains"
    ],
    answer: 3,
    explanation: "Kingdom Monera historically encompassed all bacteria, before molecular evidence led to splitting them into separate domains."
  },
  {
    question: "Lichen, often used as an indicator of air quality, represents a symbiotic relationship between:",
    options: [
      "Fungi and algae (or cyanobacteria)",
      "Plants and animals",
      "Protists and fungi only",
      "Bacteria and viruses"
    ],
    answer: 0,
    explanation: "Lichens are a symbiotic partnership between a fungus and a photosynthetic partner, usually algae or cyanobacteria."
  },
  {
    question: "Classifying whales as mammals, despite their aquatic lifestyle, is based mainly on:",
    options: [
      "Their habitat in water alone",
      "Shared characteristics such as live birth and mammary glands",
      "Their body shape resembling fish",
      "Their inability to breathe air"
    ],
    answer: 1,
    explanation: "Whales are classified as mammals based on shared traits like live birth, mammary glands, and warm-bloodedness, not habitat."
  },
  {
    question: "A species is generally defined as a group of organisms that can:",
    options: [
      "Only share the same colour",
      "Only live in the same habitat",
      "Interbreed and produce fertile offspring",
      "Only belong to the same kingdom"
    ],
    answer: 2,
    explanation: "A species is typically defined as a group capable of interbreeding to produce fertile offspring."
  },
  {
    question: "Overall, biological classification systems primarily aim to:",
    options: [
      "Group organisms only by geographic location",
      "Eliminate the need for further biological study",
      "Assign random names with no scientific basis",
      "Organize the diversity of life based on shared characteristics and evolutionary relationships"
    ],
    answer: 3,
    explanation: "Classification systems aim to organize living organisms systematically, reflecting shared traits and evolutionary relationships."
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

  
  
         
    

    
    
  
  
    
      
    
    

  


  
    





    
    
  
    
