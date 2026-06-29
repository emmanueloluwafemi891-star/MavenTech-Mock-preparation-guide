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

    if (timeLeft < 0) {
      clearInterval(timer);
      submitQuiz();
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
      showQuestion();
    };

    optionsDiv.appendChild(div);
  });
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
    STA112
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
    question: "The term 'culture area' in Nigerian historiography primarily refers to a region defined by:",
    options: [
      "Shared political boundaries under colonial rule",
      "A common pattern of language, customs, and social institutions",
      "Identical religious practices alone",
      "Uniform climate and vegetation"
    ],
    answer: 1
  },
  {
    question: "Which of the following best describes the pre-colonial Igbo political system in most communities?",
    options: [
      "A centralized monarchy headed by an Oba",
      "A republican, segmentary system based on lineage and age-grade structures",
      "A theocracy ruled by a chief priest",
      "A feudal system with vassal states"
    ],
    answer: 1
  },
  {
    question: "The Hausa-Fulani pre-colonial political structure was primarily organized around:",
    options: [
      "Village democracy with no central authority",
      "Emirates headed by Emirs under a centralized Islamic system",
      "Age-grade councils similar to the Igbo system",
      "A loose confederation of equal city-states with no hierarchy"
    ],
    answer: 1
  },
  {
    question: "In pre-colonial Yoruba society, the Oba was best described as:",
    options: [
      "An absolute monarch with no checks on his power",
      "A spiritual figurehead with no political authority",
      "A monarch whose power was checked by chiefs and councils such as the Oyomesi",
      "A military dictator installed by conquest only"
    ],
    answer: 2
  },
  {
    question: "Which geographical factor most influenced the early settlement patterns of Nigerian peoples?",
    options: [
      "Distance from the Atlantic Ocean only",
      "Availability of rivers, fertile land, and trade routes",
      "Proximity to colonial administrative centers",
      "The presence of railway lines"
    ],
    answer: 1
  },
  {
    question: "The term 'indigenous' when describing Nigerian cultures before colonial contact refers to:",
    options: [
      "Cultures introduced by European traders",
      "Cultures and practices that developed locally before external influence",
      "Cultures that existed only after the 1914 amalgamation",
      "Cultures imported from North Africa exclusively"
    ],
    answer: 1
  },
  {
    question: "National development, in the context of GST 112, is best defined as:",
    options: [
      "Growth in a nation's military strength alone",
      "A multidimensional improvement in a country's economic, social, political, and cultural well-being",
      "An increase in population size",
      "The expansion of a country's geographic boundaries"
    ],
    answer: 1
  },
  {
    question: "Which of these is NOT one of the three major culture areas commonly identified in Nigeria?",
    options: [
      "The Hausa-Fulani culture area",
      "The Yoruba culture area",
      "The Igbo culture area",
      "The Scandinavian culture area"
    ],
    answer: 3
  },
  {
    question: "Social justice, as studied in GST 112, fundamentally concerns:",
    options: [
      "Fair distribution of resources, opportunities, and privileges within society",
      "The punishment of criminals",
      "The enforcement of religious laws",
      "The maintenance of military order"
    ],
    answer: 0
  },
  {
    question: "Moral rights of citizens differ from legal rights mainly because moral rights:",
    options: [
      "Are enforceable only in customary courts",
      "Derive from ethical standards rather than statutory law",
      "Apply only to traditional rulers",
      "Cannot be violated under any circumstance"
    ],
    answer: 1
  },
  {
    question: "Pre-colonial Nigerian economies were primarily based on:",
    options: [
      "Industrial manufacturing",
      "Agriculture, trade, and craft production",
      "Oil exploration",
      "International banking"
    ],
    answer: 1
  },
  {
    question: "Religion in pre-colonial Nigerian societies served which of the following functions?",
    options: [
      "Purely entertainment purposes",
      "Social cohesion, moral guidance, and explanation of natural phenomena",
      "Tax collection only",
      "Military conscription only"
    ],
    answer: 1
  },
  {
    question: "Which statement about traditional Nigerian education before colonialism is most accurate?",
    options: [
      "There was no form of education before colonial contact",
      "Education was informal, focused on skills, values, and survival within the community",
      "Education was exclusively religious and had no practical content",
      "Formal schooling with certificates existed across all regions"
    ],
    answer: 1
  },
  {
    question: "A key distinguishing feature between the political systems of the Igbo and the Hausa-Fulani in pre-colonial Nigeria was:",
    options: [
      "The Igbo had a single emperor while the Hausa-Fulani had none",
      "The Igbo system was largely decentralized while the Hausa-Fulani system was centralized under emirs",
      "Both systems were identical in structure",
      "The Hausa-Fulani had no leadership structure at all"
    ],
    answer: 1
  },
  {
    question: "The Benin Kingdom's political and artistic achievements in pre-colonial times are most significant because they demonstrate:",
    options: [
      "That centralized statehood and sophisticated culture existed in Nigeria before European contact",
      "That Benin had no contact with neighboring kingdoms",
      "That bronze casting began only after colonization",
      "That Benin's government was identical to that of the Hausa states"
    ],
    answer: 0
  },
  {
    question: "The 'minority' culture areas of Nigeria (such as the Niger Delta, Middle Belt, and South-South groups) are significant in national discourse mainly because:",
    options: [
      "They have no distinct cultural identities",
      "Their diversity challenges a simplistic three-major-ethnic-group view of Nigeria",
      "They were not part of Nigeria until 1999",
      "They share no historical grievances regarding resource control"
    ],
    answer: 1
  },
  {
    question: "A historical analysis of education's role in Nigeria's national development would most likely highlight that colonial education primarily aimed to:",
    options: [
      "Develop a fully independent local economy",
      "Produce clerks and interpreters to serve colonial administration",
      "Promote indigenous languages above English",
      "Eliminate all forms of missionary involvement"
    ],
    answer: 1
  },
  {
    question: "One major criticism of Nigeria's post-independence educational policies is that they:",
    options: [
      "Overemphasized technical and vocational training at the expense of theory",
      "Largely retained a colonial structure poorly suited to local economic needs",
      "Completely eliminated Western-style education",
      "Focused only on religious instruction"
    ],
    answer: 1
  },
  {
    question: "The transformation of Nigeria's economy from subsistence agriculture to cash-crop production during the colonial era primarily served to:",
    options: [
      "Improve local food security",
      "Supply raw materials for European industries",
      "Promote local industrialization",
      "Establish Nigeria as a global manufacturing hub"
    ],
    answer: 1
  },
  {
    question: "The discovery of oil in commercial quantities in Nigeria (1956, Oloibiri) had which long-term effect on the economy?",
    options: [
      "It diversified the economy away from a single resource",
      "It led to overdependence on a single resource and neglect of agriculture",
      "It immediately eliminated poverty nationwide",
      "It had no significant impact on government revenue"
    ],
    answer: 1
  },
  {
    question: "Religious pluralism in Nigeria (the coexistence of Islam, Christianity, and traditional religions) has historically posed a challenge to national development mainly through:",
    options: [
      "Complete religious harmony with no tensions",
      "Periodic tensions and conflicts that have sometimes hindered unity and governance",
      "The total absence of traditional religion today",
      "Uniform religious laws applied nationwide"
    ],
    answer: 1
  },
  {
    question: "Which of the following best explains the relationship between religion and morality in traditional Nigerian societies?",
    options: [
      "Religion and morality were entirely separate with no overlap",
      "Religious beliefs often reinforced moral codes and social order",
      "Morality existed only after the introduction of Christianity",
      "Traditional religions had no ethical teachings"
    ],
    answer: 1
  },
  {
    question: "The 1999 Constitution's Chapter IV is significant to the study of citizens' rights because it:",
    options: [
      "Abolishes all customary rights",
      "Guarantees Fundamental Human Rights of Nigerian citizens",
      "Establishes a state religion",
      "Grants the military permanent governing authority"
    ],
    answer: 1
  },
  {
    question: "A key socio-political right historically denied to many Nigerian groups during colonial rule was:",
    options: [
      "The right to pay taxes",
      "The right to political self-determination and representation",
      "The right to engage in farming",
      "The right to practice religion privately"
    ],
    answer: 1
  },
  {
    question: "The Federal Character Principle in Nigeria's governance is primarily aimed at addressing concerns of:",
    options: [
      "Religious uniformity",
      "Equitable representation of Nigeria's diverse ethnic groups in public institutions",
      "Military recruitment standards",
      "International trade balance"
    ],
    answer: 1
  },
  {
    question: "Social justice advocates in Nigeria often point to which of the following as a major obstacle to national development?",
    options: [
      "Excessive equitable distribution of resources",
      "Corruption and unequal access to opportunities along ethnic or regional lines",
      "Overrepresentation of minority ethnic groups in government",
      "Too much judicial independence"
    ],
    answer: 1
  },
  {
    question: "The concept of 'resource control,' as agitated for by Niger Delta groups, is fundamentally a demand rooted in which area of study?",
    options: [
      "Religious freedom",
      "Social justice and equitable economic distribution",
      "Educational reform",
      "Traditional marriage customs"
    ],
    answer: 1
  },
  {
    question: "A historian analyzing pre-colonial Nigerian societies notes that the Igbo had 'republican' features while the Yoruba had 'constitutional monarchy' features. The most accurate basis for this distinction is:",
    options: [
      "The Igbo had a king who ruled absolutely; the Yoruba had no king",
      "The Igbo lacked a centralized king and relied on consensus-based councils, while the Yoruba had monarchs whose powers were checked by chiefs",
      "Both systems were ruled by religious leaders with identical powers",
      "The distinction is fabricated; both systems were identical"
    ],
    answer: 1
  },
  {
    question: "Which scenario best illustrates a 'culture area' distinct from an 'ethnic group' in Nigerian studies?",
    options: [
      "The Yoruba as a single ethnic group with one language",
      "The Middle Belt region, which contains numerous distinct ethnic groups sharing certain similar cultural and geographic traits",
      "A single village with one family",
      "The entire country of Nigeria as one unit"
    ],
    answer: 1
  },
  {
    question: "A student argues that 'Nigeria's culture areas align perfectly with its current political state boundaries.' This claim is most accurately countered by noting that:",
    options: [
      "State boundaries were drawn primarily along colonial administrative convenience and often cut across or merged distinct ethnic and cultural groups",
      "All 36 states have identical cultures",
      "Culture areas did not exist until states were created",
      "There is no relationship between geography and culture in Nigeria"
    ],
    answer: 0
  },
  {
    question: "In assessing how colonial education affected Nigeria's national development, a critical analysis would conclude that the most enduring negative legacy was:",
    options: [
      "The introduction of literacy",
      "An educational system disconnected from indigenous languages, values, and practical economic needs of local communities",
      "The complete elimination of all schools",
      "Excessive funding for technical institutes"
    ],
    answer: 1
  },
  {
    question: "Which of the following statements presents the strongest critique of Nigeria's economic development trajectory since independence?",
    options: [
      "Nigeria has successfully diversified away from oil dependency since 1970",
      "Nigeria's continued reliance on oil revenue, despite its agricultural and human capital potential, reflects a failure to translate resource wealth into broad-based development",
      "Nigeria's economy is now entirely self-sufficient in food production",
      "Colonial economic structures had no lasting impact on post-independence policy"
    ],
    answer: 1
  },
  {
    question: "A community blends indigenous religious rites with Christian worship practices. This phenomenon is best described in the context of Nigerian religious history as:",
    options: [
      "Religious syncretism, reflecting the historical interaction between traditional beliefs and introduced religions",
      "Religious extremism",
      "A purely modern, post-2000 invention with no historical roots",
      "A violation of the 1999 Constitution"
    ],
    answer: 0
  },
  {
    question: "Which argument most accurately explains why religion has been described as a 'double-edged sword' in Nigeria's national development?",
    options: [
      "Religion has had no measurable effect on Nigeria's development",
      "While religion fosters moral values and social cohesion, it has also fueled identity-based conflicts that hinder national unity",
      "Religion is solely a positive, unifying force in Nigeria with no negative consequences",
      "Religion's role is limited strictly to private worship with no public influence"
    ],
    answer: 1
  },
  {
    question: "A key distinction between 'human rights' and 'citizenship rights' in the Nigerian context is that:",
    options: [
      "Human rights apply universally regardless of nationality, while citizenship rights are specific entitlements tied to one's status as a Nigerian",
      "They are interchangeable terms with no legal distinction",
      "Citizenship rights apply to foreigners only",
      "Human rights are granted only by the National Assembly"
    ],
    answer: 0
  },
  {
    question: "Evaluate this claim: 'The 1999 Constitution fully resolves all socio-political rights issues in Nigeria.' The most accurate critique of this claim is that:",
    options: [
      "The Constitution guarantees rights on paper, but enforcement gaps, ethnic tensions, and weak institutions continue to undermine full realization of these rights",
      "The Constitution has never been amended",
      "The Constitution abolished all fundamental rights",
      "There is no constitution currently in force in Nigeria"
    ],
    answer: 0
  },
  {
    question: "Which of the following best captures the relationship between social justice and sustainable national development?",
    options: [
      "National development can occur independently of how resources and opportunities are distributed",
      "Equitable access to resources, justice, and opportunity is a foundational condition for sustained and inclusive national development",
      "Social justice is irrelevant to economic growth",
      "Development always precedes and causes social justice automatically"
    ],
    answer: 1
  },
  {
    question: "A researcher claims that 'pre-colonial Nigerian societies had no concept of rights or justice until the British introduced common law.' The strongest rebuttal to this claim is:",
    options: [
      "Indigenous societies had their own customary systems of justice, rights, and dispute resolution long before colonial contact",
      "The claim is entirely correct and verified by all historians",
      "Common law replaced customary law completely with no resistance",
      "Pre-colonial societies had no system of governance at all"
    ],
    answer: 0
  },
  {
    question: "Which scenario best demonstrates an exception to the general pattern of centralized monarchy in pre-colonial Yoruba states?",
    options: [
      "The Oyo Empire under the Alaafin",
      "The Ijebu and certain Yoruba communities that maintained more decentralized, council-based governance",
      "The Benin Kingdom",
      "The Sokoto Caliphate"
    ],
    answer: 1
  },
  {
    question: "In evaluating Nigeria's economic history, which factor is most often understated but critically important in explaining the persistence of poverty despite oil wealth?",
    options: [
      "Absence of any natural resources",
      "Mismanagement, corruption, and weak institutional accountability in resource revenue allocation",
      "Total lack of international trade",
      "Nigeria's small population size"
    ],
    answer: 1
  },
  {
    question: "A constitutional lawyer argues that 'moral rights are legally enforceable in the same way as fundamental human rights in Nigeria.' This statement is:",
    options: [
      "Correct, since all rights in Nigeria carry equal legal weight",
      "Incorrect, since moral rights are ethical expectations that may not have the same binding legal enforceability as constitutionally guaranteed rights",
      "Correct, because the Constitution defines morality explicitly",
      "Irrelevant, since Nigeria has no legal system"
    ],
    answer: 1
  },
  {
    question: "Which of the following is the most nuanced explanation for ethnic and religious tension's persistent impact on Nigeria's national development?",
    options: [
      "Tensions are a recent phenomenon with no historical roots",
      "Colonial policies often exploited or entrenched ethnic and religious divisions, and these patterns have continued to shape post-independence political competition",
      "Ethnic tension has had zero effect on governance or resource allocation",
      "All ethnic groups in Nigeria have identical political interests"
    ],
    answer: 1
  },
  {
    question: "A historian compares pre-colonial trade networks (such as trans-Saharan trade) with colonial-era trade patterns. The most significant shift this comparison reveals is:",
    options: [
      "Trade only began during the colonial era",
      "Pre-colonial trade was multidirectional and regionally integrated, while colonial trade was restructured to primarily serve export of raw materials to Europe",
      "Both periods had identical trade patterns and partners",
      "Colonial trade eliminated all forms of local commerce"
    ],
    answer: 1
  },
  {
    question: "Which statement best reflects a critical evaluation of 'Federal Character' as a tool for social justice?",
    options: [
      "It has completely eliminated all forms of marginalization in Nigeria",
      "While intended to ensure equitable representation, it has been criticized for sometimes prioritizing quotas over merit and not fully resolving deeper structural inequalities",
      "It applies only to judicial appointments",
      "It was abolished after 1999"
    ],
    answer: 1
  },
  {
    question: "Examine this scenario: A community's traditional governance system uses age-grades to allocate responsibilities, while a neighboring community uses hereditary kingship. A comparative cultural analyst would conclude that:",
    options: [
      "Nigeria's pre-colonial societies were uniformly governed by one political model",
      "Nigeria's pre-colonial political systems were diverse, ranging from acephalous/age-grade-based systems to centralized monarchies",
      "Age-grade systems were used only outside Nigeria",
      "Hereditary kingship was unknown in pre-colonial Nigeria"
    ],
    answer: 1
  },
  {
    question: "Which of the following best explains why 'national development' is considered a more holistic concept than mere 'economic growth'?",
    options: [
      "They are identical concepts with no distinction",
      "National development encompasses economic growth alongside social equity, political stability, education, and cultural advancement",
      "National development refers only to military strength",
      "Economic growth always automatically guarantees national development"
    ],
    answer: 1
  },
  {
    question: "A critical assessment of religious institutions' role in Nigerian education history would note that early missionary schools:",
    options: [
      "Had no connection to the spread of Western education in Nigeria",
      "Played a foundational role in introducing formal Western education, though often intertwined with efforts at religious conversion",
      "Focused exclusively on secular, non-religious curricula",
      "Were established only after Nigeria's independence"
    ],
    answer: 1
  },
  {
    question: "Which of these represents the most accurate critique of how colonial boundary-drawing affected Nigeria's culture areas?",
    options: [
      "Colonial boundaries perfectly respected all pre-existing ethnic and cultural divisions",
      "Colonial boundaries often arbitrarily merged distinct culture areas into single administrative units, creating long-term challenges for national cohesion",
      "There were no culture areas before colonial boundaries were drawn",
      "Colonial boundaries had no lasting political consequences"
    ],
    answer: 1
  },
  {
    question: "A scholar notes: 'Social justice in Nigeria cannot be fully achieved through legal reform alone.' The strongest support for this claim is:",
    options: [
      "Laws alone cannot address underlying issues of corruption, weak enforcement, and entrenched socio-economic inequality",
      "Nigeria has no laws related to social justice",
      "Legal reform has fully solved all social justice issues already",
      "Social justice is purely a legal concept with no socio-economic dimension"
    ],
    answer: 0
  },
  {
    question: "Which conclusion best synthesizes the historical relationship between Nigeria's pre-colonial diversity and its post-independence struggle for national unity?",
    options: [
      "Nigeria's pre-colonial diversity had no bearing on post-independence challenges",
      "The vast pre-colonial diversity in political systems, religions, and cultures was inherited and complicated by colonial amalgamation, contributing to ongoing challenges in forging a unified national identity",
      "All pre-colonial Nigerian societies were politically and culturally identical",
      "National unity was fully achieved immediately upon independence in 1960"
    ],
    answer: 1
  }
];
const MTH132 = [
  {
    question: "If f(x) = 2x² − 3x + 1, what is f(−2)?",
    options: ["15", "11", "9", "7"],
    answer: 0
  },
  {
    question: "The domain of f(x) = √(x − 3) is:",
    options: [
      "All real numbers",
      "x ≥ 3",
      "x > 3 only",
      "x ≤ 3"
    ],
    answer: 1
  },
  {
    question: "If f(x) = 1/(x − 4), the function is undefined at:",
    options: [
      "x = 0",
      "x = 1",
      "x = 4",
      "x = −4"
    ],
    answer: 2
  },
  {
    question: "Which of the following is an example of an even function?",
    options: [
      "f(x) = x³",
      "f(x) = x² + 1",
      "f(x) = sin(x)",
      "f(x) = x + 2"
    ],
    answer: 1
  },
  {
    question: "Given f(x) = 3x + 2 and g(x) = x − 1, find (f∘g)(x).",
    options: [
      "3x − 1",
      "3x + 1",
      "3x − 3",
      "3x + 5"
    ],
    answer: 0
  },
  {
    question: "The limit lim(x→2) (x² − 4)/(x − 2) equals:",
    options: [
      "0",
      "2",
      "4",
      "Undefined"
    ],
    answer: 2
  },
  {
    question: "A function f(x) is continuous at x = a if:",
    options: [
      "f(a) exists only",
      "lim(x→a) f(x) exists only",
      "f(a) exists, lim(x→a) f(x) exists, and they are equal",
      "f(x) is differentiable at a"
    ],
    answer: 2
  },
  {
    question: "lim(x→0) (sin x)/x equals:",
    options: [
      "0",
      "1",
      "∞",
      "Undefined"
    ],
    answer: 1
  },
  {
    question: "The derivative of f(x) = x⁵ is:",
    options: [
      "5x⁴",
      "x⁴",
      "5x⁵",
      "4x⁴"
    ],
    answer: 0
  },
  {
    question: "If y = 7 (a constant), then dy/dx is:",
    options: [
      "7",
      "1",
      "0",
      "Undefined"
    ],
    answer: 2
  },
  {
    question: "The derivative of f(x) = sin(x) is:",
    options: [
      "cos(x)",
      "−cos(x)",
      "−sin(x)",
      "tan(x)"
    ],
    answer: 0
  },
  {
    question: "Using the power rule, the derivative of f(x) = 4x³ − 2x is:",
    options: [
      "12x² − 2",
      "12x² − 2x",
      "4x² − 2",
      "12x³ − 2"
    ],
    answer: 0
  },
  {
    question: "∫x² dx equals:",
    options: [
      "x³/3 + C",
      "x³ + C",
      "2x + C",
      "3x² + C"
    ],
    answer: 0
  },
  {
    question: "∫5 dx equals:",
    options: [
      "5",
      "5x + C",
      "x + C",
      "0"
    ],
    answer: 1
  },
  {
    question: "The definite integral ∫ from 0 to 2 of x dx equals:",
    options: [
      "1",
      "2",
      "4",
      "0"
    ],
    answer: 1
  },
  {
    question: "The equation of a straight line with slope 2 passing through (0, 3) is:",
    options: [
      "y = 2x + 3",
      "y = 3x + 2",
      "y = 2x − 3",
      "y = x + 2"
    ],
    answer: 0
  },
  {
    question: "The standard equation of a circle with center (0,0) and radius 5 is:",
    options: [
      "x² + y² = 5",
      "x² + y² = 25",
      "x + y = 25",
      "x² − y² = 25"
    ],
    answer: 1
  },
  {
    question: "Find lim(x→3) (x² − 9)/(x − 3).",
    options: [
      "0",
      "3",
      "6",
      "9"
    ],
    answer: 2
  },
  {
    question: "If f(x) = x² − 6x + 8, the value(s) of x where f(x) = 0 are:",
    options: [
      "x = 2, 4",
      "x = −2, −4",
      "x = 1, 8",
      "x = 2, −4"
    ],
    answer: 0
  },
  {
    question: "A function is said to be increasing on an interval if, for that interval:",
    options: [
      "f'(x) < 0",
      "f'(x) > 0",
      "f'(x) = 0",
      "f''(x) > 0"
    ],
    answer: 1
  },
  {
    question: "Suppose f(x) = x³ − 3x² + 2. Find f'(x).",
    options: [
      "3x² − 6x",
      "x² − 6x",
      "3x² − 3x",
      "3x² − 6x + 2"
    ],
    answer: 0
  },
  {
    question: "Find the critical points of f(x) = x³ − 3x² + 2 by setting f'(x) = 0.",
    options: [
      "x = 0, 2",
      "x = 0, 3",
      "x = 1, 2",
      "x = −1, 2"
    ],
    answer: 0
  },
  {
    question: "To determine whether a critical point is a maximum or minimum, the second derivative test checks:",
    options: [
      "The sign of f(x) at that point",
      "The sign of f'(x) at that point",
      "The sign of f''(x) at that point",
      "Whether f(x) is continuous"
    ],
    answer: 2
  },
  {
    question: "If f''(x) > 0 at a critical point, the point is a:",
    options: [
      "Local maximum",
      "Local minimum",
      "Point of inflection",
      "Discontinuity"
    ],
    answer: 1
  },
  {
    question: "The integral ∫(3x² + 2x) dx equals:",
    options: [
      "x³ + x² + C",
      "3x³ + 2x² + C",
      "x³ + 2x² + C",
      "6x + 2 + C"
    ],
    answer: 0
  },
  {
    question: "Evaluate ∫ from 1 to 3 of 2x dx.",
    options: [
      "4",
      "6",
      "8",
      "9"
    ],
    answer: 2
  },
  {
    question: "The area under the curve y = f(x) between x = a and x = b (where f(x) ≥ 0) is given by:",
    options: [
      "f(b) − f(a)",
      "∫ from a to b of f(x) dx",
      "f'(b) − f'(a)",
      "f(a) × f(b)"
    ],
    answer: 1
  },
  {
    question: "The chain rule is used to differentiate:",
    options: [
      "Sums of functions only",
      "Composite functions",
      "Constant functions only",
      "Polynomial functions exclusively"
    ],
    answer: 1
  },
  {
    question: "Differentiate y = (3x + 1)⁴ using the chain rule.",
    options: [
      "4(3x + 1)³",
      "12(3x + 1)³",
      "4(3x)³",
      "3(3x + 1)³"
    ],
    answer: 1
  },
  {
    question: "Find dy/dx if y = sin(2x).",
    options: [
      "cos(2x)",
      "2cos(2x)",
      "−2cos(2x)",
      "2sin(2x)"
    ],
    answer: 1
  },
  {
    question: "A point of inflection on a curve occurs where:",
    options: [
      "f'(x) = 0 only",
      "f''(x) = 0 and the concavity changes",
      "f(x) = 0",
      "The function is undefined"
    ],
    answer: 1
  },
  {
    question: "The slope of the tangent to a curve y = f(x) at point x = a is given by:",
    options: [
      "f(a)",
      "f'(a)",
      "∫f(x) dx evaluated at a",
      "f''(a)"
    ],
    answer: 1
  },
  {
    question: "Consider f(x) = 1/x for x ≠ 0. As x approaches 0 from the right, f(x) approaches:",
    options: [
      "0",
      "1",
      "−∞",
      "+∞"
    ],
    answer: 3
  },
  {
    question: "A rectangle's perimeter is fixed at 20 cm. To maximize its area using calculus, you would:",
    options: [
      "Differentiate the perimeter formula",
      "Express area as a function of one variable, then set its derivative to zero",
      "Integrate the area function",
      "Find the second derivative of the perimeter"
    ],
    answer: 1
  },
  {
    question: "The volume of a solid of revolution formed by rotating y = f(x) about the x-axis between a and b is found using:",
    options: [
      "∫ from a to b of f(x) dx",
      "π∫ from a to b of [f(x)]² dx",
      "2π∫ from a to b of f(x) dx",
      "∫ from a to b of f'(x) dx"
    ],
    answer: 1
  },
  {
    question: "Given the function f(x) = (x² − 1)/(x − 1), which statement is correct?",
    options: [
      "f(x) is continuous everywhere, including x = 1",
      "f(x) has a removable discontinuity at x = 1",
      "f(x) is undefined for all x",
      "f(x) has a vertical asymptote at x = 1"
    ],
    answer: 1
  },
  {
    question: "A function f(x) is differentiable at x = a only if:",
    options: [
      "It is discontinuous at x = a",
      "It is continuous at x = a (continuity is necessary but not sufficient)",
      "f(a) = 0",
      "f'(a) does not need to exist"
    ],
    answer: 1
  },
  {
    question: "Evaluate lim(x→∞) (3x² + 2x)/(x² − 5).",
    options: [
      "0",
      "1",
      "3",
      "∞"
    ],
    answer: 2
  },
  {
    question: "The equation of a parabola with vertex at the origin opening upward, with focus at (0, 2), is:",
    options: [
      "x² = 8y",
      "y² = 8x",
      "x² = −8y",
      "y² = −8x"
    ],
    answer: 0
  },
  {
    question: "The eccentricity of an ellipse is always:",
    options: [
      "Equal to 1",
      "Greater than 1",
      "Between 0 and 1",
      "Equal to 0"
    ],
    answer: 2
  },
  {
    question: "A student computes ∫(1/x) dx and writes the answer as x⁻¹⁺¹/(−1+1) + C. The error is that:",
    options: [
      "The power rule applies correctly here",
      "The power rule fails because it leads to division by zero; the correct integral is ln|x| + C",
      "The correct answer should be x² + C",
      "There is no error"
    ],
    answer: 1
  },
  {
    question: "Find the maximum value of f(x) = −x² + 4x + 1 using calculus.",
    options: [
      "3",
      "5",
      "1",
      "4"
    ],
    answer: 1
  },
  {
    question: "Using the quotient rule, differentiate y = x/(x + 1).",
    options: [
      "1/(x+1)²",
      "x/(x+1)²",
      "(x+1)/x²",
      "−1/(x+1)²"
    ],
    answer: 0
  },
  {
    question: "Evaluate ∫ from 0 to π of sin(x) dx.",
    options: [
      "0",
      "1",
      "2",
      "−2"
    ],
    answer: 2
  },
  {
    question: "A particle moves such that its position is s(t) = t³ − 6t² + 9t. Its velocity is zero when:",
    options: [
      "t = 0, 3",
      "t = 1, 3",
      "t = 0, 2",
      "t = 1, 2"
    ],
    answer: 1
  },
  {
    question: "For the particle in the previous scenario, the acceleration function a(t) is:",
    options: [
      "3t² − 12t + 9",
      "6t − 12",
      "6t² − 12t",
      "t² − 6t"
    ],
    answer: 1
  },
  {
    question: "The general equation Ax² + By² + Cx + Dy + E = 0 represents an ellipse when:",
    options: [
      "A = B",
      "A and B have the same sign and A ≠ B",
      "A and B have opposite signs",
      "A = 0 or B = 0"
    ],
    answer: 1
  },
  {
    question: "A student claims that 'every continuous function is differentiable.' The strongest counterexample is:",
    options: [
      "f(x) = x²",
      "f(x) = |x| at x = 0",
      "f(x) = sin(x)",
      "f(x) = eˣ"
    ],
    answer: 1
  },
  {
    question: "The area between two curves y = f(x) and y = g(x) (where f(x) ≥ g(x)) from x = a to x = b is given by:",
    options: [
      "∫ from a to b of [f(x) + g(x)] dx",
      "∫ from a to b of [f(x) − g(x)] dx",
      "f(b) − g(a)",
      "∫ from a to b of f(x)g(x) dx"
    ],
    answer: 1
  },
  {
    question: "Evaluate lim(x→0) (1 − cos x)/x².",
    options: [
      "0",
      "1",
      "1/2",
      "∞"
    ],
    answer: 2
  }
];
const PHY102 = [
  {
    question: "Two point charges of +4 μC and +6 μC are separated by 0.3 m in vacuum. Calculate the electrostatic force between them. (k = 9 × 10⁹ Nm²/C²)",
    options: ["1.8 N", "2.4 N", "3.6 N", "5.4 N"],
    answer: 1
  },
  {
    question: "Which of the following best describes an electric field line?",
    options: [
      "A path along which a charge experiences no force",
      "An imaginary line showing the direction a positive test charge would move",
      "A line connecting only negative charges",
      "A line that always forms closed loops in electrostatics"
    ],
    answer: 1
  },
  {
    question: "Calculate the electric field intensity at a point 0.2 m from a point charge of 5 μC. (k = 9 × 10⁹ Nm²/C²)",
    options: [
      "1.0 × 10⁶ N/C",
      "1.125 × 10⁶ N/C",
      "2.25 × 10⁵ N/C",
      "4.5 × 10⁵ N/C"
    ],
    answer: 1
  },
  {
    question: "The electric potential due to a point charge at infinity is taken as:",
    options: [
      "Maximum",
      "Negative",
      "Zero",
      "Undefined"
    ],
    answer: 2
  },
  {
    question: "Two charges of +3 μC and −3 μC are placed 0.5 m apart. Calculate the potential energy of the system. (k = 9 × 10⁹ Nm²/C²)",
    options: [
      "−0.162 J",
      "0.162 J",
      "−0.054 J",
      "0.054 J"
    ],
    answer: 0
  },
  {
    question: "Why is electric potential a scalar quantity while electric field is a vector quantity?",
    options: [
      "Potential has both magnitude and direction; field has magnitude only",
      "Potential is energy per unit charge (a scalar concept), while field is force per unit charge (a directional concept)",
      "They are actually both vectors",
      "Potential only exists near conductors"
    ],
    answer: 1
  },
  {
    question: "Calculate the potential difference between two points if 12 J of work is done in moving a charge of 4 C between them.",
    options: [
      "3 V",
      "4 V",
      "48 V",
      "0.33 V"
    ],
    answer: 0
  },
  {
    question: "Gauss's law relates electric flux through a closed surface to:",
    options: [
      "The surface area only",
      "The net charge enclosed within the surface",
      "The distance from any external charge",
      "The shape of the surface only"
    ],
    answer: 1
  },
  {
    question: "A closed surface encloses a net charge of 8 μC. Calculate the total electric flux through the surface. (ε₀ = 8.85 × 10⁻¹² C²/Nm²)",
    options: [
      "9.04 × 10⁵ Nm²/C",
      "7.08 × 10⁵ Nm²/C",
      "9.04 × 10⁴ Nm²/C",
      "7.08 × 10⁴ Nm²/C"
    ],
    answer: 0
  },
  {
    question: "Gauss's law is most useful in calculating electric fields for which type of charge configuration?",
    options: [
      "Random, irregular charge distributions only",
      "Highly symmetric charge distributions (spherical, cylindrical, planar)",
      "Only point charges in motion",
      "Configurations with zero net charge"
    ],
    answer: 1
  },
  {
    question: "A parallel plate capacitor has plates of area 0.02 m² separated by 0.001 m in vacuum. Calculate its capacitance. (ε₀ = 8.85 × 10⁻¹² F/m)",
    options: [
      "1.77 × 10⁻¹⁰ F",
      "1.77 × 10⁻¹¹ F",
      "8.85 × 10⁻¹⁰ F",
      "8.85 × 10⁻¹¹ F"
    ],
    answer: 0
  },
  {
    question: "Three capacitors of 2 μF, 3 μF, and 5 μF are connected in series. Calculate the total capacitance.",
    options: [
      "10 μF",
      "1 μF",
      "0.97 μF",
      "0.5 μF"
    ],
    answer: 2
  },
  {
    question: "Three capacitors of 2 μF, 3 μF, and 5 μF are connected in parallel. Calculate the total capacitance.",
    options: [
      "0.97 μF",
      "10 μF",
      "1 μF",
      "30 μF"
    ],
    answer: 1
  },
  {
    question: "A capacitor stores 4 × 10⁻⁴ C of charge at a potential difference of 200 V. Calculate the energy stored.",
    options: [
      "0.02 J",
      "0.04 J",
      "0.08 J",
      "0.2 J"
    ],
    answer: 1
  },
  {
    question: "Why does the capacitance of a parallel plate capacitor increase when the plate separation is decreased?",
    options: [
      "Because charge decreases proportionally",
      "Because the electric field strength between the plates increases for the same voltage, requiring less voltage to store the same charge",
      "Because the plates become larger",
      "Capacitance is unaffected by plate separation"
    ],
    answer: 1
  },
  {
    question: "A dielectric material inserted between capacitor plates primarily functions to:",
    options: [
      "Decrease the capacitance and increase the voltage rating",
      "Increase the capacitance by reducing the effective electric field between plates",
      "Conduct charge between the plates directly",
      "Eliminate the electric field entirely"
    ],
    answer: 1
  },
  {
    question: "A capacitor with air as dielectric has capacitance 5 μF. If a dielectric with dielectric constant 4 is inserted, the new capacitance becomes:",
    options: [
      "1.25 μF",
      "9 μF",
      "20 μF",
      "5 μF"
    ],
    answer: 2
  },
  {
    question: "Which of the following materials would make the LEAST effective dielectric for a capacitor?",
    options: [
      "A material with high dielectric strength and high permittivity",
      "A material that is a good electrical conductor",
      "A material with low conductivity and high polarizability",
      "Mica or ceramic"
    ],
    answer: 1
  },
  {
    question: "A current of 2 A flows through a conductor for 5 minutes. Calculate the total charge that flows.",
    options: [
      "10 C",
      "100 C",
      "600 C",
      "60 C"
    ],
    answer: 2
  },
  {
    question: "According to Ohm's law, if voltage across a resistor is doubled while resistance remains constant, the current will:",
    options: [
      "Remain the same",
      "Double",
      "Halve",
      "Quadruple"
    ],
    answer: 1
  },
  {
    question: "Calculate the resistance of a conductor that carries 0.5 A when a potential difference of 12 V is applied across it.",
    options: [
      "6 Ω",
      "24 Ω",
      "0.04 Ω",
      "12 Ω"
    ],
    answer: 1
  },
  {
    question: "Three resistors of 4 Ω, 6 Ω, and 12 Ω are connected in parallel. Calculate the total resistance.",
    options: [
      "22 Ω",
      "2 Ω",
      "1.5 Ω",
      "0.45 Ω"
    ],
    answer: 1
  },
  {
    question: "In a series circuit, why is the current the same through every component regardless of resistance value?",
    options: [
      "Because voltage is the same across all components",
      "Because there is only one path for charge to flow, so the rate of charge flow must be identical at every point",
      "Because resistance is always equal in series circuits",
      "Because power is conserved"
    ],
    answer: 1
  },
  {
    question: "A battery of EMF 12 V with internal resistance 0.5 Ω is connected to an external resistor of 5.5 Ω. Calculate the current flowing in the circuit.",
    options: [
      "2 A",
      "2.18 A",
      "1.8 A",
      "24 A"
    ],
    answer: 0
  },
  {
    question: "Kirchhoff's Current Law is a direct consequence of which fundamental physical principle?",
    options: [
      "Conservation of energy",
      "Conservation of electric charge",
      "Conservation of momentum",
      "Newton's third law"
    ],
    answer: 1
  },
  {
    question: "Kirchhoff's Voltage Law states that around any closed loop in a circuit:",
    options: [
      "The total current is zero",
      "The sum of EMFs equals the sum of potential drops",
      "Resistance is always constant",
      "Power dissipated is always maximum"
    ],
    answer: 1
  },
  {
    question: "Calculate the power dissipated in a resistor of 10 Ω carrying a current of 3 A.",
    options: [
      "30 W",
      "90 W",
      "9 W",
      "300 W"
    ],
    answer: 1
  },
  {
    question: "Why do household electrical appliances generally use parallel circuit wiring rather than series wiring?",
    options: [
      "Because parallel circuits allow each appliance to operate independently, even if one fails or is switched off",
      "Because parallel circuits use less copper wire",
      "Because series circuits provide more voltage to each appliance",
      "Because parallel circuits prevent any current flow"
    ],
    answer: 0
  },
  {
    question: "A wire of resistance R is stretched so that its length doubles while its volume remains constant. The new resistance becomes:",
    options: [
      "R/2",
      "R",
      "2R",
      "4R"
    ],
    answer: 3
  },
  {
    question: "The magnetic field around a long, straight, current-carrying conductor forms a pattern best described as:",
    options: [
      "Straight lines parallel to the wire",
      "Concentric circles around the wire",
      "Radial lines pointing away from the wire",
      "A uniform field in one direction only"
    ],
    answer: 1
  },
  {
    question: "Calculate the magnetic force on a charge of 2 × 10⁻⁶ C moving at 3 × 10⁵ m/s perpendicular to a magnetic field of 0.4 T.",
    options: [
      "0.12 N",
      "0.24 N",
      "1.2 × 10⁻¹ N",
      "2.4 × 10⁻¹ N"
    ],
    answer: 1
  },
  {
    question: "The direction of the magnetic force on a moving positive charge in a magnetic field is determined using:",
    options: [
      "Lenz's law",
      "The right-hand rule (F = qv × B)",
      "Ohm's law",
      "Kirchhoff's law"
    ],
    answer: 1
  },
  {
    question: "A straight conductor of length 0.5 m carrying a current of 4 A is placed in a magnetic field of 0.3 T, perpendicular to the field. Calculate the force on the conductor.",
    options: [
      "0.6 N",
      "1.2 N",
      "0.06 N",
      "6.0 N"
    ],
    answer: 0
  },
  {
    question: "Why does a current-carrying loop placed in a magnetic field experience a torque rather than a net force (in a uniform field)?",
    options: [
      "Because the forces on opposite sides of the loop are equal and opposite but act at different points, creating a turning effect",
      "Because magnetic fields cannot exert force on loops",
      "Because the loop has no current flowing through it",
      "Because torque is unrelated to magnetic forces"
    ],
    answer: 0
  },
  {
    question: "Using the Biot-Savart law, the magnetic field due to a current element is directly proportional to:",
    options: [
      "The square of the distance from the element",
      "The current and the length of the element, and inversely proportional to the square of the distance",
      "Only the distance from the element",
      "The resistance of the conductor"
    ],
    answer: 1
  },
  {
    question: "According to Faraday's Law of electromagnetic induction, an EMF is induced in a circuit whenever there is:",
    options: [
      "A constant magnetic flux through the circuit",
      "A change in magnetic flux linked with the circuit",
      "A change in resistance of the circuit",
      "A static magnetic field of any strength"
    ],
    answer: 1
  },
  {
    question: "A coil of 100 turns experiences a change in magnetic flux from 0.02 Wb to 0.08 Wb in 0.5 s. Calculate the induced EMF.",
    options: [
      "6 V",
      "12 V",
      "0.12 V",
      "60 V"
    ],
    answer: 1
  },
  {
    question: "Lenz's Law, which determines the direction of induced current, is fundamentally an expression of:",
    options: [
      "Conservation of charge",
      "Conservation of energy (the induced current opposes the change causing it)",
      "Newton's first law",
      "Conservation of magnetic flux"
    ],
    answer: 1
  },
  {
    question: "A bar magnet is dropped, north pole first, through a horizontal coil of wire. As it approaches the coil from above, the induced current direction will be such that it:",
    options: [
      "Attracts the magnet to speed up its fall",
      "Repels the magnet, opposing its approach into the coil",
      "Has no effect on the magnet's motion",
      "Reverses the magnet's polarity"
    ],
    answer: 1
  },
  {
    question: "Calculate the EMF induced in a straight conductor of length 0.8 m moving at 5 m/s perpendicular to a magnetic field of 0.6 T.",
    options: [
      "2.4 V",
      "4.0 V",
      "0.24 V",
      "24 V"
    ],
    answer: 0
  },
  {
    question: "A transformer has 200 turns on its primary coil and 800 turns on its secondary coil. If the primary voltage is 110 V, calculate the secondary voltage.",
    options: [
      "27.5 V",
      "440 V",
      "220 V",
      "880 V"
    ],
    answer: 1
  },
  {
    question: "A step-up transformer increases voltage while, assuming an ideal transformer, the current:",
    options: [
      "Also increases proportionally",
      "Decreases proportionally",
      "Remains constant",
      "Becomes zero"
    ],
    answer: 1
  },
  {
    question: "Eddy currents induced in the metal core of a transformer cause energy loss primarily through:",
    options: [
      "Magnetic flux leakage",
      "Resistive heating within the core material",
      "Increased voltage output",
      "Reduced number of coil turns"
    ],
    answer: 1
  },
  {
    question: "Why are transformer cores typically laminated (made of thin insulated sheets) rather than solid blocks of metal?",
    options: [
      "To increase the weight of the transformer",
      "To reduce eddy current losses by limiting the paths available for circulating currents",
      "To increase magnetic flux leakage intentionally",
      "Laminated cores have no effect on efficiency"
    ],
    answer: 1
  },
  {
    question: "Self-inductance of a coil is defined as the property by which:",
    options: [
      "A coil induces an EMF in a neighboring coil",
      "A coil opposes a change in its own current by inducing an EMF within itself",
      "A coil generates a constant current regardless of voltage",
      "A coil has zero resistance"
    ],
    answer: 1
  },
  {
    question: "A coil has a self-inductance of 0.2 H. If the current through it changes at a rate of 5 A/s, calculate the induced EMF.",
    options: [
      "0.04 V",
      "1.0 V",
      "25 V",
      "2.5 V"
    ],
    answer: 1
  },
  {
    question: "Mutual inductance between two coils depends on all of the following EXCEPT:",
    options: [
      "The number of turns in each coil",
      "The distance and orientation between the coils",
      "The color of the wire used",
      "The permeability of the core material"
    ],
    answer: 2
  },
  {
    question: "According to Maxwell's equations, a changing electric field produces:",
    options: [
      "A static magnetic field only",
      "A changing magnetic field, contributing to electromagnetic wave propagation",
      "No magnetic effect whatsoever",
      "Only an electric current"
    ],
    answer: 1
  },
  {
    question: "An AC voltage source of peak value 200 V is connected to a circuit. Calculate the RMS voltage.",
    options: [
      "100 V",
      "282.8 V",
      "141.4 V",
      "200 V"
    ],
    answer: 2
  },
  {
    question: "In a purely capacitive AC circuit, the current leads the voltage by a phase angle of:",
    options: [
      "0°",
      "45°",
      "90°",
      "180°"
    ],
    answer: 2
  }
];
const COS102 = [
  {
    question: "Visual Basic is best classified as which type of programming language?",
    options: [
      "A purely procedural, low-level language",
      "An event-driven, high-level programming language",
      "A markup language",
      "A query language"
    ],
    answer: 1
  },
  {
    question: "In Visual Basic, the IDE component used to visually design the user interface is called the:",
    options: [
      "Code Editor",
      "Form Designer",
      "Project Explorer",
      "Immediate Window"
    ],
    answer: 1
  },
  {
    question: "Which of the following is the correct file extension for a Visual Basic project file?",
    options: [".vbx", ".vbp", ".exe", ".vsl"],
    answer: 1
  },
  {
    question: "In VB, the Properties Window is primarily used to:",
    options: [
      "Write executable code",
      "Set or modify attributes of a selected control or object",
      "Debug runtime errors",
      "Compile the final program"
    ],
    answer: 1
  },
  {
    question: "Which data type would be most appropriate for storing a person's exact age in years (e.g., 21)?",
    options: ["String", "Integer", "Boolean", "Double"],
    answer: 1
  },
  {
    question: "Which of the following is a valid variable name in Visual Basic?",
    options: ["2ndName", "Student Name", "StudentName", "Dim"],
    answer: 2
  },
  {
    question: "The keyword used to declare a variable in Visual Basic is:",
    options: ["Var", "Dim", "Let", "Set"],
    answer: 1
  },
  {
    question: "What will be the data type of the variable declared as: Dim score As Single?",
    options: [
      "Integer",
      "String",
      "A floating-point (decimal) number",
      "A Boolean value"
    ],
    answer: 2
  },
  {
    question: "Which operator is used for string concatenation in Visual Basic?",
    options: ["+", "&", "*", "%"],
    answer: 1
  },
  {
    question: "Evaluate the VB expression: 7 Mod 2",
    options: ["3", "1", "3.5", "0"],
    answer: 1
  },
  {
    question: "Evaluate the VB expression: 7 \\ 2 (integer division)",
    options: ["3.5", "3", "1", "4"],
    answer: 1
  },
  {
    question: "Which control is most appropriate for allowing a user to select exactly one option from a small set of mutually exclusive choices?",
    options: [
      "CheckBox",
      "ListBox",
      "OptionButton (RadioButton)",
      "TextBox"
    ],
    answer: 2
  },
  {
    question: "A CheckBox control differs from an OptionButton in that a CheckBox:",
    options: [
      "Allows multiple independent selections, while option buttons in a group allow only one",
      "Can never be unchecked once checked",
      "Is used only for displaying text",
      "Cannot trigger any event"
    ],
    answer: 0
  },
  {
    question: "Which VB control is used specifically to allow users to input or edit a single line of text?",
    options: ["Label", "TextBox", "ComboBox", "Image"],
    answer: 1
  },
  {
    question: "The Label control in Visual Basic is primarily used to:",
    options: [
      "Accept user input",
      "Display static, non-editable text on a form",
      "Execute code when clicked",
      "Store numeric data only"
    ],
    answer: 1
  },
  {
    question: "Consider the code: If x > 10 Then MsgBox 'Big' Else MsgBox 'Small'. If x = 5, what is displayed?",
    options: ["Big", "Small", "Nothing is displayed", "An error occurs"],
    answer: 1
  },
  {
    question: "Which control structure would be most appropriate for executing a block of code a known, fixed number of times?",
    options: [
      "Do While loop",
      "For...Next loop",
      "If...Then statement",
      "Select Case"
    ],
    answer: 1
  },
  {
    question: "What is the output of the following loop: For i = 1 To 5 Step 2 / Print i / Next i?",
    options: ["1 2 3 4 5", "1 3 5", "2 4", "1 2 3"],
    answer: 1
  },
  {
    question: "A Do While loop differs from a Do Until loop in that:",
    options: [
      "Do While continues looping while the condition is True; Do Until continues while the condition is False",
      "They are functionally identical with no difference",
      "Do Until always runs exactly once",
      "Do While cannot be used with Boolean conditions"
    ],
    answer: 0
  },
  {
    question: "What is a key risk of writing a Do While loop without correctly updating the loop's condition variable inside the loop body?",
    options: [
      "The program will run faster",
      "The loop may become infinite, causing the program to hang",
      "The program will automatically terminate after one iteration",
      "VB will not compile the code"
    ],
    answer: 1
  },
  {
    question: "The Select Case statement in VB is most useful when:",
    options: [
      "Testing a single variable against multiple possible discrete values",
      "Performing arithmetic calculations only",
      "Declaring multiple variables at once",
      "There is only one possible outcome to test"
    ],
    answer: 0
  },
  {
    question: "If grade = 'C' in the given Select Case example, what is displayed?",
    options: ["Excellent", "Good", "Try again", "Nothing is displayed"],
    answer: 2
  },
  {
    question: "In a nested For loop where the outer loop runs 3 times and the inner loop runs 4 times, how many total times does the innermost statement execute?",
    options: ["3", "4", "7", "12"],
    answer: 3
  },
  {
    question: "What distinguishes a Sub procedure from a Function procedure in Visual Basic?",
    options: [
      "A Sub procedure must always take parameters; a Function never does",
      "A Function returns a value to the calling code; a Sub does not",
      "A Sub can only be called once per program",
      "There is no difference; they are interchangeable terms"
    ],
    answer: 1
  },
  {
    question: "Which keyword is used to exit a procedure before reaching its natural end?",
    options: ["End Sub", "Exit Sub", "Stop Sub", "Break"],
    answer: 1
  },
  {
    question: "A parameter passed 'ByVal' to a procedure means that:",
    options: [
      "The procedure receives a copy of the value, and changes inside the procedure do not affect the original variable",
      "The procedure directly modifies the original variable's memory location",
      "The parameter cannot be used inside the procedure",
      "The parameter must be a constant"
    ],
    answer: 0
  },
  {
    question: "A parameter passed 'ByRef' to a procedure means that:",
    options: [
      "Changes made to the parameter inside the procedure are not reflected outside it",
      "The procedure receives a reference to the original variable, so changes inside the procedure affect the original variable",
      "ByRef can only be used with String data types",
      "The procedure cannot read the parameter's value"
    ],
    answer: 1
  },
  {
    question: "Declaring an array as: Dim scores(4) As Integer creates an array with how many elements (assuming default base index 0)?",
    options: [
      "4",
      "5",
      "3",
      "Unlimited"
    ],
    answer: 1
  },
  {
    question: "To access the third element of a zero-indexed array named 'marks', the correct syntax is:",
    options: [
      "marks(3)",
      "marks(2)",
      "marks[3]",
      "marks.3"
    ],
    answer: 1
  },
  {
    question: "What is the primary advantage of using an array instead of multiple individual variables to store related data?",
    options: [
      "Arrays use less memory than any other data structure regardless of size",
      "Arrays allow related data to be grouped under one name and accessed efficiently using an index, especially when looping through values",
      "Arrays automatically sort data",
      "Arrays can only store one data type at a time, which is always preferable"
    ],
    answer: 1
  },
  {
    question: "A two-dimensional array in VB is best used to represent:",
    options: [
      "A single list of values",
      "Data organized in rows and columns, such as a table or grid",
      "Only string data",
      "A single constant value"
    ],
    answer: 1
  },
  {
    question: "Which loop structure is most commonly used to traverse and process every element in an array?",
    options: [
      "If...Then statement",
      "For...Next loop",
      "Select Case",
      "MsgBox function"
    ],
    answer: 1
  },
  {
    question: "In Visual Basic, the menu editor is used to:",
    options: [
      "Edit the source code of the program",
      "Create and customize dropdown menus and menu items for a form",
      "Debug runtime errors",
      "Manage database connections"
    ],
    answer: 1
  },
  {
    question: "A dialog box that requires the user to respond before continuing with any other part of the application is called a:",
    options: [
      "Modeless dialog box",
      "Modal dialog box",
      "Static dialog box",
      "Passive dialog box"
    ],
    answer: 1
  },
  {
    question: "The MsgBox function in VB is primarily used to:",
    options: [
      "Accept multi-line text input from the user",
      "Display a message to the user and optionally return a value based on the button clicked",
      "Open a file for reading",
      "Declare a new variable"
    ],
    answer: 1
  },
  {
    question: "The InputBox function differs from MsgBox in that InputBox:",
    options: [
      "Only displays output and never accepts input",
      "Allows the user to type in a response, which is returned as a value",
      "Cannot be used in Visual Basic",
      "Always returns a numeric value only"
    ],
    answer: 1
  },
  {
    question: "A 'Common Dialog' control such as the Open/Save dialog is used primarily to:",
    options: [
      "Provide a standardized interface for file selection or saving operations",
      "Display error messages exclusively",
      "Compile the VB project",
      "Create new menu items"
    ],
    answer: 0
  },
  {
    question: "During program execution, a 'runtime error' occurs:",
    options: [
      "Before the program is compiled",
      "While the program is running, often due to invalid operations like division by zero",
      "Only when there are syntax mistakes",
      "Exclusively during the design phase"
    ],
    answer: 1
  },
  {
    question: "A 'syntax error' in Visual Basic is typically detected:",
    options: [
      "Only after the program has fully executed",
      "By the compiler/editor before the program runs, due to incorrect code structure",
      "Never, since VB has no syntax rules",
      "Only by the end user"
    ],
    answer: 1
  },
  {
    question: "Which debugging technique allows a programmer to pause program execution at a specific line and examine variable values?",
    options: [
      "Compiling the project",
      "Setting a breakpoint",
      "Renaming the project",
      "Deleting the form"
    ],
    answer: 1
  },
  {
    question: "The 'Immediate Window' in the VB IDE is primarily used during debugging to:",
    options: [
      "Design the visual layout of forms",
      "Execute code statements directly and inspect variable values during a paused run",
      "Save the project permanently",
      "Create new menu structures"
    ],
    answer: 1
  },
  {
    question: "A logic error in a VB program is most accurately described as one where:",
    options: [
      "The code fails to compile due to incorrect syntax",
      "The code compiles and runs without crashing, but produces incorrect or unintended results",
      "The program crashes immediately on launch",
      "The error is always caught automatically by the compiler"
    ],
    answer: 1
  },
  {
    question: "Which statement about sequential file access in Visual Basic is correct?",
    options: [
      "Data must be read or written in the exact order it was stored, from beginning to end",
      "Any record can be accessed directly by its position, regardless of order",
      "Sequential files cannot store text data",
      "Sequential access is identical to random access"
    ],
    answer: 0
  },
  {
    question: "Random access file mode in VB allows a programmer to:",
    options: [
      "Only read data in the order it was written",
      "Directly access any record in the file using its record number, without reading preceding records",
      "Store only numeric data types",
      "Never close the file after opening it"
    ],
    answer: 1
  },
  {
    question: "Which VB statement is used to open a file for sequential output (writing)?",
    options: [
      "Open 'file.txt' For Input As #1",
      "Open 'file.txt' For Output As #1",
      "Open 'file.txt' For Random As #1",
      "Close 'file.txt'"
    ],
    answer: 1
  },
  {
    question: "After performing all required read/write operations on a file in VB, it is important to:",
    options: [
      "Leave the file open indefinitely",
      "Close the file using the Close statement to release system resources and ensure data is properly saved",
      "Delete the file immediately",
      "Rename the file automatically"
    ],
    answer: 1
  },
  {
    question: "A program that runs but produces the wrong average due to an incorrect formula most likely contains:",
    options: [
      "A syntax error",
      "A logic error",
      "A missing file reference",
      "An array index out of bounds error"
    ],
    answer: 1
  },
  {
    question: "A programmer wants a procedure that calculates and returns the square of a number for use in multiple places in a program. The most appropriate choice is:",
    options: [
      "A Sub procedure",
      "A Function procedure",
      "A Label control",
      "A MsgBox statement"
    ],
    answer: 1
  },
  {
    question: "What is the output of the following code? Dim x As Integer = 5, Dim y As Integer = 2, Print x \\ y",
    options: [
      "2.5",
      "2",
      "3",
      "An error"
    ],
    answer: 1
  },
  {
    question: "A program loops through a zero-indexed array declared as Dim arr(9) using: For i = 1 To 10. What is the most likely consequence?",
    options: [
      "The loop runs correctly",
      "The first element is skipped and an index out of bounds error may occur at index 10",
      "The array automatically resizes",
      "The loop is skipped"
    ],
    answer: 1
  }
];
const CSC122 = [
{
    question: "Data processing is best defined as:",
    options: [
        "The random storage of unrelated facts",
        "The systematic transformation of raw data into meaningful information",
        "The physical manufacturing of computer hardware",
        "The deletion of unnecessary files from a system"
    ],
    answer: 1
},
{
    question: "Which of the following best distinguishes 'data' from 'information'?",
    options: [
        "Data and information are identical terms with no difference",
        "Data are raw, unprocessed facts, while information is data that has been processed and given meaningful context",
        "Information always precedes data",
        "Data can only be numeric, while information can be text"
    ],
    answer: 1
},
{
    question: "Which of the following is NOT typically considered a property of good data?",
    options: [
        "Accuracy",
        "Timeliness",
        "Ambiguity",
        "Relevance"
    ],
    answer: 2
},
{
    question: "The source of data in data processing refers to:",
    options: [
        "The final report generated after processing",
        "The origin from which raw data is obtained, such as surveys, sensors, or transaction records",
        "The storage device used to keep processed files",
        "The software used to analyze the data"
    ],
    answer: 1
},
{
    question: "Which of the following is an example of a primary source of data?",
    options: [
        "A textbook summarizing past research",
        "A questionnaire administered directly to respondents",
        "A newspaper article reporting someone else's findings",
        "An encyclopedia entry"
    ],
    answer: 1
},
{
    question: "Which method of data collection involves direct observation of subjects or events without interference?",
    options: [
        "Interview method",
        "Observation method",
        "Questionnaire method",
        "Documentary method"
    ],
    answer: 1
},
{
    question: "The first stage in the data processing cycle is known as:",
    options: [
        "Output",
        "Origination",
        "Storage",
        "Distribution"
    ],
    answer: 1
},
{
    question: "Input preparation in the data processing cycle primarily involves:",
    options: [
        "Distributing the final processed report",
        "Converting collected data into a form suitable for computer processing",
        "Permanently deleting redundant data",
        "Designing computer hardware"
    ],
    answer: 1
},
{
    question: "The final stage of a typical data processing cycle is:",
    options: [
        "Input",
        "Processing",
        "Storage",
        "Output/Distribution"
    ],
    answer: 3
},
{
    question: "Which data processing method relies entirely on human effort?",
    options: [
        "Electronic method",
        "Mechanical method",
        "Manual method",
        "Automatic method"
    ],
    answer: 2
},
{
    question: "The mechanical method of data processing uses:",
    options: [
        "Only pen and paper",
        "Simple mechanical devices such as calculators and typewriters",
        "Only autonomous computer systems",
        "Only cloud software"
    ],
    answer: 1
},
{
    question: "Which data processing method uses computers for speed and accuracy?",
    options: [
        "Manual method",
        "Mechanical method",
        "Electronic method",
        "None of the above"
    ],
    answer: 2
},
{
    question: "Automatic data processing is characterized by:",
    options: [
        "Complete manual recalculation",
        "Minimal human intervention after initiation",
        "Exclusive use of typewriters",
        "Processing one record daily"
    ],
    answer: 1
},
{
    question: "Batch processing is most suitable for:",
    options: [
        "ATM withdrawals",
        "Monthly payroll processing",
        "Tasks that cannot be repeated",
        "Single-user tasks only"
    ],
    answer: 1
},
{
    question: "A disadvantage of batch processing is:",
    options: [
        "Too expensive",
        "Results are not immediately available",
        "Cannot process large data",
        "Requires constant internet connection"
    ],
    answer: 1
},
{
    question: "Online processing differs from batch processing because it:",
    options: [
        "Processes data immediately as entered",
        "Processes data once yearly",
        "Cannot be used in banking",
        "Needs no input device"
    ],
    answer: 0
},
{
    question: "Time-sharing processing allows:",
    options: [
        "One user only",
        "Multiple users to share computer resources simultaneously",
        "Processing once every 24 hours",
        "Stopping all processing"
    ],
    answer: 1
},
{
    question: "Real-time processing provides:",
    options: [
        "Delayed response",
        "Immediate processing and response",
        "Midnight-only processing",
        "No output"
    ],
    answer: 1
},
{
    question: "Distributed processing refers to:",
    options: [
        "One centralized computer",
        "Processing spread across multiple networked computers",
        "Only one computer in an organization",
        "No sharing of data"
    ],
    answer: 1
},
{
    question: "Multiprogramming means:",
    options: [
        "Running one program at a time",
        "Keeping multiple programs in memory for CPU switching",
        "Only batch processing",
        "No operating system required"
    ],
    answer: 1
},
{
    question: "Multiprocessing differs from multiprogramming primarily in that multiprocessing involves:",
    options: [
        "A single CPU handling multiple programs through time-slicing",
        "The use of two or more CPUs within a system to execute multiple processes simultaneously",
        "The complete absence of any processor",
        "Processing that occurs only in batch mode"
    ],
    answer: 1
},
{
    question: "Multitasking, as experienced by typical computer users, refers to:",
    options: [
        "The use of multiple physical computers to perform one task",
        "A single user running and switching between several applications seemingly at the same time on one system",
        "The exclusive use of mainframe computers",
        "A process that requires multiple separate operating systems"
    ],
    answer: 1
},
{
    question: "Which of the following best describes a computer file?",
    options: [
        "A physical filing cabinet used to store paper documents",
        "A named collection of related data or information stored on a storage medium",
        "A type of computer hardware component",
        "A programming language used for data entry"
    ],
    answer: 1
},
{
    question: "A master file in data processing typically contains:",
    options: [
        "Temporary data that is deleted after each use",
        "Relatively permanent data about an entity, regularly updated by transaction files",
        "Only data related to system errors",
        "Data that cannot be modified once created"
    ],
    answer: 1
},
{
    question: "A transaction file is best described as one that:",
    options: [
        "Stores permanent records that never change",
        "Contains records of current day-to-day activities used to update a master file",
        "Is identical in function to a backup file",
        "Can only be used in manual processing systems"
    ],
    answer: 1
},
{
    question: "Which of the following is an example of file processing?",
    options: [
        "Designing computer hardware architecture",
        "Sorting, merging, updating, or retrieving data within a file",
        "Manufacturing a hard disk drive",
        "Painting a computer case"
    ],
    answer: 1
},
{
    question: "Sequential file organization stores records:",
    options: [
        "In random order",
        "One after another in a specific order",
        "Only in encrypted form",
        "Exclusively in a circular structure"
    ],
    answer: 1
},
{
    question: "A major limitation of sequential file organization is that:",
    options: [
        "It allows instant access to any record",
        "The system may need to read preceding records before reaching the required one",
        "It cannot store more than one record",
        "It is incompatible with batch processing"
    ],
    answer: 1
},
{
    question: "Direct (random) access file organization allows records to be:",
    options: [
        "Accessed only in stored order",
        "Accessed directly using an address or key",
        "Permanently locked after creation",
        "Stored only on paper media"
    ],
    answer: 1
},
{
    question: "Indexed-sequential file organization combines features of:",
    options: [
        "Sequential and direct/random access",
        "Manual and mechanical processing",
        "Batch and real-time processing",
        "Multiprogramming and multiprocessing"
    ],
    answer: 0
},
{
    question: "A database is best defined as:",
    options: [
        "A single isolated file",
        "An organized collection of related data",
        "A computer virus",
        "A printed sales report"
    ],
    answer: 1
},
{
    question: "A key advantage of a database system over traditional file-based systems is that databases:",
    options: [
        "Increase redundancy",
        "Reduce redundancy and improve consistency",
        "Cannot be accessed by multiple users",
        "Require no query language"
    ],
    answer: 1
},
{
    question: "In database terminology, a field refers to:",
    options: [
        "A collection of records",
        "A single category of data within a record",
        "The entire database",
        "A file organization method"
    ],
    answer: 1
},
{
    question: "A record in a database is:",
    options: [
        "A single character",
        "A complete set of related fields",
        "An entire database table",
        "A backup copy"
    ],
    answer: 1
},
{
    question: "Which of the following best describes a DBMS?",
    options: [
        "A computer virus",
        "Software for creating and managing databases",
        "A storage device",
        "A web design language"
    ],
    answer: 1
},
{
    question: "Data redundancy refers to:",
    options: [
        "No stored data",
        "Unnecessary duplication of data",
        "A faster retrieval method",
        "A compulsory database feature"
    ],
    answer: 1
},
{
    question: "File management in an operating system primarily involves:",
    options: [
        "Designing hardware",
        "Organizing, storing, retrieving, and securing files",
        "Writing application software",
        "Manufacturing storage devices"
    ],
    answer: 1
},
{
    question: "For efficient file management, organizations should:",
    options: [
        "Give all files identical names",
        "Use logical folders and consistent naming conventions",
        "Avoid folders completely",
        "Delete files immediately after creation"
    ],
    answer: 1
},
{
    question: "A backup refers to:",
    options: [
        "The original file",
        "A duplicate copy kept for recovery purposes",
        "A computer virus",
        "A deletion method"
    ],
    answer: 1
},
{
    question: "Which best illustrates batch processing versus real-time processing?",
    options: [
        "ATM withdrawal versus monthly interest calculation",
        "Both are identical",
        "Real-time is always slower",
        "Batch processing is used only for ATMs"
    ],
    answer: 0
},
{
    question: "Storing the same customer details in multiple departmental files is an example of:",
    options: [
        "Normalization",
        "Data redundancy",
        "Centralized databases",
        "Real-time processing"
    ],
    answer: 1
},
{
    question: "Which scenario best illustrates distributed processing?",
    options: [
        "One standalone mainframe",
        "Branch offices processing local transactions while connected by a network",
        "Typing on a standalone PC",
        "A manual ledger system"
    ],
    answer: 1
},
{
    question: "Why choose indexed-sequential organization over pure sequential organization?",
    options: [
        "No sorting required",
        "Provides both sequential processing and faster direct access",
        "Requires no index",
        "Only suitable for small files"
    ],
    answer: 1
},
{
    question: "A university processing admission applications only after the deadline should use:",
    options: [
        "Real-time processing",
        "Batch processing",
        "Time-sharing",
        "Online processing only"
    ],
    answer: 1
},
{
    question: "Which scenario demonstrates multiprogramming?",
    options: [
        "Running one instruction only",
        "Having a browser, music player, and word processor open simultaneously",
        "Using two separate computers",
        "A switched-off computer"
    ],
    answer: 1
},
{
    question: "Why is timeliness important in data quality?",
    options: [
        "It has no impact",
        "Late information may become useless for decision-making",
        "It only matters for paper records",
        "Accuracy guarantees timeliness"
    ],
    answer: 1
},
{
    question: "Updating a master employee file using weekly transaction records exemplifies:",
    options: [
        "Real-time processing",
        "Master and transaction file relationship",
        "Distributed processing",
        "A database without files"
    ],
    answer: 1
},
{
    question: "Why use a DBMS in a hospital instead of separate flat files?",
    options: [
        "Flat files provide better integrity",
        "DBMS reduces redundancy and allows controlled access",
        "DBMS cannot support multiple users",
        "Flat files prevent duplication automatically"
    ],
    answer: 1
},
{
    question: "Real-time processing is LEAST appropriate for:",
    options: [
        "Air traffic control",
        "Annual financial summary reports",
        "ATM withdrawals",
        "Emergency medical systems"
    ],
    answer: 1
},
{
    question: "Why is pure sequential file organization less suitable for modern online stores?",
    options: [
        "Customers always want sequential processing",
        "It is slow when direct access to specific records is required",
        "It requires no storage medium",
        "It is identical to direct access"
    ],
    answer: 1
  }
];
const CSC104 = [
{
  question: "An application package in computing refers to:",
  options: [
    "A single line of code with no specific function",
    "A pre-written software program designed to perform specific user tasks, such as word processing or data management",
    "A type of computer hardware component",
    "A network cable used to connect computers"
  ],
  answer: 1
},
{
  question: "Which of the following is classified as a database management application package?",
  options: [
    "Microsoft Word",
    "Microsoft PowerPoint",
    "Microsoft Access",
    "Microsoft Paint"
  ],
  answer: 2
},
{
  question: "Microsoft Access is best described as a:",
  options: [
    "Word processing application",
    "Relational Database Management System (RDBMS) application",
    "Presentation software only",
    "Image editing tool"
  ],
  answer: 1
},
{
  question: "Which of the following best describes the primary purpose of a Database Management System (DBMS) like MS Access?",
  options: [
    "To create slide-based presentations",
    "To store, organize, retrieve, and manage structured data efficiently",
    "To edit digital photographs",
    "To compose printed letters only"
  ],
  answer: 1
},
{
  question: "In MS Access, the basic structural component used to store data in rows and columns is called a:",
  options: [
    "Form",
    "Report",
    "Table",
    "Macro"
  ],
  answer: 2
},
{
  question: "In an MS Access table, a single row of data representing one complete entry is referred to as a:",
  options: [
    "Field",
    "Record",
    "Query",
    "Module"
  ],
  answer: 1
},
{
  question: "In an MS Access table, a single column representing one category of data is called a:",
  options: [
    "Record",
    "Field",
    "Report",
    "Form"
  ],
  answer: 1
},
{
  question: "A Primary Key in an MS Access table serves to:",
  options: [
    "Allow duplicate values in every record",
    "Uniquely identify each record in a table",
    "Format the appearance of the table only",
    "Delete unwanted records automatically"
  ],
  answer: 1
},
{
  question: "To create a new blank database in MS Access, a user would typically:",
  options: [
    "Open Microsoft Word and save it as .accdb",
    "Select Blank Database from the Access start screen",
    "Use only the Print command",
    "Convert a PowerPoint file directly"
  ],
  answer: 1
},
{
  question: "The default file extension for a database created in modern versions of Microsoft Access is:",
  options: [
    ".docx",
    ".accdb",
    ".pptx",
    ".xls"
  ],
  answer: 1
},
{
  question: "To open an existing database file in MS Access, a user would typically:",
  options: [
    "Use the New Slide command",
    "Use File > Open and browse to the database",
    "Use the Animation pane",
    "Use the Mail Merge wizard"
  ],
  answer: 1
},
{
  question: "Which MS Access view allows a user to design and modify the structure of a table?",
  options: [
    "Datasheet View",
    "Design View",
    "Print Preview",
    "Slide Show View"
  ],
  answer: 1
},
{
  question: "Datasheet View in MS Access primarily allows a user to:",
  options: [
    "Design the structure of database objects",
    "View and edit table data",
    "Create slide transitions",
    "Format text in Word"
  ],
  answer: 1
},
{
  question: "Which data type is most appropriate for storing a customer's phone number in MS Access?",
  options: [
    "Currency",
    "Short Text",
    "AutoNumber",
    "Yes/No"
  ],
  answer: 1
},
{
  question: "The AutoNumber data type in MS Access is commonly used for:",
  options: [
    "Storing currency values",
    "Automatically generating unique numbers",
    "Storing Yes/No responses",
    "Storing large text"
  ],
  answer: 1
},
{
  question: "A Query in MS Access is best defined as:",
  options: [
    "A static table",
    "A request to retrieve, filter, or manipulate data",
    "A slide transition",
    "A font formatting tool"
  ],
  answer: 1
},
{
  question: "Which query is most appropriate for retrieving customers whose orders exceed ₦50,000?",
  options: [
    "Make-Table Query",
    "Select Query",
    "Delete Query",
    "Update Query"
  ],
  answer: 1
},
{
  question: "Filtering table data in MS Access refers to:",
  options: [
    "Deleting all records",
    "Displaying only records that meet specified criteria",
    "Changing a field's data type",
    "Creating a PowerPoint slide"
  ],
  answer: 1
},
{
  question: "Sorting data in MS Access allows users to:",
  options: [
    "Delete unwanted fields",
    "Arrange records in ascending or descending order",
    "Convert a table into PowerPoint",
    "Disable filters"
  ],
  answer: 1
},
{
  question: "Which of the following best illustrates data formatting in MS Access?",
  options: [
    "Deleting a table",
    "Displaying currency with the ₦ symbol",
    "Creating a database",
    "Renaming a file"
  ],
  answer: 1
},
{
  question: "A Form in MS Access is primarily used to:",
  options: [
    "Store raw data directly",
    "Provide a user-friendly interface for entering and editing records",
    "Create slide transitions",
    "Perform calculations only"
  ],
  answer: 1
},
{
  question: "Which best describes the relationship between a table and a query?",
  options: [
    "A query is a permanent copy of a table",
    "A query retrieves data dynamically from one or more tables",
    "They are unrelated",
    "A query exists without tables"
  ],
  answer: 1
},
{
  question: "The most appropriate data type for a Date of Birth field is:",
  options: [
    "Short Text",
    "Date/Time",
    "Yes/No",
    "OLE Object"
  ],
  answer: 1
},
{
  question: "Microsoft PowerPoint is primarily classified as a:",
  options: [
    "Database application",
    "Presentation software",
    "Spreadsheet application",
    "Operating system"
  ],
  answer: 1
},
{
  question: "To begin creating a new presentation in PowerPoint, a user typically:",
  options: [
    "Open a blank table",
    "Select a blank presentation or a design template",
    "Run a query",
    "Open Datasheet View"
  ],
  answer: 1
},
{
  question: "A Design Template in PowerPoint refers to:",
  options: [
    "A pre-formatted set of colors, fonts, and layouts",
    "A type of database query",
    "A method of filtering records",
    "A tool used only for editing images"
  ],
  answer: 0
},
{
  question: "The primary purpose of using a consistent design template across all slides is to:",
  options: [
    "Make every slide look different",
    "Maintain visual consistency and professionalism",
    "Increase the file size",
    "Prevent new slides from being added"
  ],
  answer: 1
},
{
  question: "The Title Slide layout is designed to include:",
  options: [
    "A large data table only",
    "A main title and subtitle",
    "An embedded spreadsheet",
    "Audio narration only"
  ],
  answer: 1
},
{
  question: "To add a new slide to a presentation, a user should:",
  options: [
    "Use the New Slide command",
    "Use the Access Query Wizard",
    "Delete the current presentation",
    "Save the file as .docx"
  ],
  answer: 0
},
{
  question: "A Slide Transition in PowerPoint is:",
  options: [
    "Text formatting within a slide",
    "The visual effect between slides",
    "A database table relationship",
    "The process of saving a presentation"
  ],
  answer: 1
},
{
  question: "An Animation in PowerPoint refers to:",
  options: [
    "Effects applied to objects within a slide",
    "Effects between slides only",
    "A database query",
    "Printing a presentation"
  ],
  answer: 0
},
{
  question: "Which of the following is an entrance animation effect?",
  options: [
    "Fade",
    "Select Query",
    "Primary Key",
    "Table Relationship"
  ],
  answer: 0
},
{
  question: "The Slide Master feature is primarily used to:",
  options: [
    "Delete all slides",
    "Control the overall formatting and design of all slides",
    "Run database queries",
    "Convert presentations into spreadsheets"
  ],
  answer: 1
},
{
  question: "Why should excessive animations be avoided in professional presentations?",
  options: [
    "Animations always improve clarity",
    "They can distract the audience from the content",
    "PowerPoint allows only one animation",
    "Animations are not supported"
  ],
  answer: 1
},
{
  question: "To make slides advance automatically every 5 seconds, the setting is found under:",
  options: [
    "Table Design View",
    "Slide Transition timing",
    "Form View",
    "Query Design"
  ],
  answer: 1
},
{
  question: "Why should a Primary Key never be left blank?",
  options: [
    "It has no importance",
    "It uniquely identifies each record",
    "It automatically deletes records",
    "It improves performance when blank"
  ],
  answer: 1
},
{
  question: "To retrieve only students who scored above 70%, the best combination is:",
  options: [
    "A Table and a Query with criteria",
    "A Slide Transition",
    "A Form without a table",
    "Datasheet View only"
  ],
  answer: 0
},
{
  question: "Which field is best suited for the Yes/No data type?",
  options: [
    "Student score",
    "School fees paid or not paid",
    "Home address",
    "Product price"
  ],
  answer: 1
},
{
  question: "If 'ABC' is entered into a Number field, MS Access will:",
  options: [
    "Accept it as text",
    "Reject the value and display an error",
    "Delete the table",
    "Open PowerPoint"
  ],
  answer: 1
},
{
  question: "The difference between sorting and filtering is that:",
  options: [
    "They are the same",
    "Sorting changes record order while filtering displays only matching records",
    "Filtering permanently deletes data",
    "Sorting applies only to PowerPoint"
  ],
 answer: 1
},
{
  question: "To apply the same logo, fonts, and colors to every slide, use:",
  options: [
    "Manual formatting",
    "Slide Master",
    "Query Design",
    "Datasheet View"
  ],
  answer: 1
},
{
  question: "Using a different design template on every slide is generally:",
  options: [
    "Recommended",
    "Likely to appear inconsistent and unprofessional",
    "Required",
    "Guaranteed to improve audience engagement"
  ],
  answer: 1
},
{
  question: "Formatting a field as Currency mainly affects:",
  options: [
    "The stored value",
    "Only the display format",
    "The field becomes Text",
    "The Primary Key"
  ],
  answer: 1
},
{
  question: "To signal the beginning of each new topic with a visual effect, use:",
  options: [
    "Form Design",
    "Slide Transitions",
    "Select Query",
    "AutoNumber"
  ],
  answer: 1
},
{
  question: "The correct workflow for creating a simple Access database is:",
  options: [
    "Create queries first",
    "Create a database, design tables, enter data, then create queries/forms/reports",
    "Create PowerPoint first",
    "Format data before creating tables"
  ],
  answer: 1
},
{
  question: "Assigning proper data types to fields is important because:",
  options: [
    "It has no impact",
    "It improves data validation, calculations, and storage efficiency",
    "Short Text is always better",
    "It only matters in PowerPoint"
  ],
  answer: 1
},
{
  question: "A bullet point flying in from the left is an example of:",
  options: [
    "Exit animation",
    "Entrance animation",
    "Emphasis animation",
    "Motion path"
  ],
  answer: 1
},
{
  question: "An Emphasis animation is best illustrated by:",
  options: [
    "Text growing larger or changing color while visible",
    "Text disappearing",
    "Text appearing for the first time",
    "Changing slides"
  ],
  answer: 0
},
{
  question: "Which data types best suit Book Title, Author, ISBN, and Availability?",
  options: [
    "Number, Number, Yes/No, Text",
    "Short Text, Short Text, Short Text, Yes/No",
    "Currency, Date/Time, AutoNumber, OLE Object",
    "AutoNumber for all fields"
  ],
  answer: 1
},
{
  question: "Why are both MS Access and MS PowerPoint called application packages?",
  options: [
    "They are identical programs",
    "They are pre-developed software for specific user tasks",
    "Application packages always involve databases",
    "PowerPoint is part of Access"
  ],
  answer: 1
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

  
  
         
    

    
    
  
  
    
      
    
    

  


  
    





    
    
  
  
