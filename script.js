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
const ENGLISH = [
  {
    question: "If I ___ known you were coming, I would have prepared a meal.",
    options: ["have", "would have", "had", "was"],
    answer: 2,
    explanation: "This is a third conditional (unreal past situation), which requires \"if + past perfect (had + V3), would have + V3.\""
  },
  {
    question: "Identify the correctly constructed sentence.",
    options: ["Neither the manager nor the staff members are informed of the change.", "Neither the manager nor the staff members has been informed of the change.", "Neither the manager nor the staff members were informed of the change.", "Neither the manager nor the staff members was informed of the change."],
    answer: 2,
    explanation: "In \"neither...nor\" constructions, the verb agrees with the subject closest to it — \"staff members\" (plural) — so \"were\" is correct."
  },
  {
    question: "Despite ___ warned repeatedly, he continued to break the rules.",
    options: ["been", "he was", "being", "to be"],
    answer: 2,
    explanation: "After \"despite,\" a gerund (-ing form) is required, not the past participle \"been\" or a full clause."
  },
  {
    question: "Choose the sentence with correct subject-verb agreement.",
    options: ["A number of applicants has increased this year.", "The number of applicants have increased this year.", "The number of applicants has increased this year.", "The number of applicants increase this year."],
    answer: 2,
    explanation: "\"The number of\" takes a singular verb (\"has\"), while \"A number of\" takes a plural verb — a classic distinction tested in exams."
  },
  {
    question: "It is high time the government ___ the power sector.",
    options: ["reformed", "reforms", "has reformed", "will reform"],
    answer: 0,
    explanation: "The expression \"it is high time\" is followed by the past tense (subjunctive-like usage) even though it refers to a present/future obligation."
  },
  {
    question: "Not only ___ the exam but she also emerged as the best student.",
    options: ["passed she", "did she pass", "she did pass", "she passed"],
    answer: 1,
    explanation: "When a sentence begins with \"Not only,\" subject-auxiliary inversion is required — \"did she pass,\" not normal word order."
  },
  {
    question: "Choose the option that best completes: \"The committee ___ divided on the issue, with some members supporting the bill and others opposing it strongly.\"",
    options: ["has been", "is", "was", "were"],
    answer: 3,
    explanation: "When a collective noun like \"committee\" is described as acting individually/differently (divided opinions), British English standard treats it as plural — \"were.\""
  },
  {
    question: "Scarcely ___ the lecture begun when the fire alarm went off.",
    options: ["has", "did", "had", "was"],
    answer: 2,
    explanation: "\"Scarcely...when\" requires past perfect (\"had begun\") to show one action happened immediately before another in the past."
  },
  {
    question: "Select the best completion: \"She is the kind of person who ___ always ready to help others.\"",
    options: ["are", "is", "have been", "were"],
    answer: 1,
    explanation: "The relative pronoun \"who\" refers back to \"person\" (singular), so the verb must agree with the singular antecedent."
  },
  {
    question: "The findings of the research, along with the recommendations, ___ presented at the conference.",
    options: ["has been", "was", "is", "were"],
    answer: 3,
    explanation: "\"The findings\" is the main subject (plural), and phrases like \"along with the recommendations\" don't change subject-verb agreement — the verb still agrees with \"findings,\" so \"were\" is correct."
  },
  {
    question: "By next December, she ___ in this company for ten years.",
    options: ["will work", "has worked", "works", "will have worked"],
    answer: 3,
    explanation: "This describes an action that will be completed by a specific point in the future — future perfect tense (\"will have + V3\") is required."
  },
  {
    question: "Hardly had the plane taken off ___ it developed engine trouble.",
    options: ["when", "that", "then", "than"],
    answer: 0,
    explanation: "\"Hardly...when\" is the correct idiomatic pairing (not \"than,\" which pairs with comparatives like \"rather than\" or \"no sooner...than\")."
  },
  {
    question: "The professor insisted that every student ___ the assignment before the deadline.",
    options: ["submits", "submitted", "submit", "will submit"],
    answer: 2,
    explanation: "After verbs of insistence/demand (\"insist,\" \"recommend,\" \"suggest\"), the subjunctive mood is used — base form of the verb regardless of subject."
  },
  {
    question: "Choose the sentence that correctly uses a semicolon.",
    options: ["He studied hard; therefore, he passed the exam.", "The weather was cold; the children stayed indoors, they played games.", "I have three subjects; Mathematics, English and Biology.", "She loves reading; and writing."],
    answer: 0,
    explanation: "A semicolon correctly joins two independent clauses, especially before a conjunctive adverb like \"therefore.\" Option D should use a colon, not a semicolon, before a list."
  },
  {
    question: "No sooner ___ the results announced than celebrations began across the campus.",
    options: ["did", "had", "were", "have"],
    answer: 2,
    explanation: "\"No sooner...than\" requires inversion with the appropriate auxiliary matching the passive structure — \"were the results announced\" (passive voice, past)."
  },
  {
    question: "Identify the error in: \"Each of the students (A) have submitted (B) their assignment (C) on time (D).\"",
    options: ["No error (D)", "their assignment (B)", "on time (C)", "have submitted (A)"],
    answer: 3,
    explanation: "\"Each\" is singular, so the correct verb should be \"has submitted,\" not \"have submitted.\""
  },
  {
    question: "Identify the error in: \"The reason why he failed (A) is because (B) he didn't prepare (C) adequately for the exam (D).\"",
    options: ["he didn't prepare (C)", "is because (B)", "The reason why he failed (A)", "adequately for the exam (D)"],
    answer: 1,
    explanation: "\"The reason...is because\" is redundant; it should be \"the reason...is that.\" This is a common error tested in exams."
  },
  {
    question: "Identify the error in: \"Between you and I (A), this decision (B) will affect (C) everyone in the department (D).\"",
    options: ["Between you and I (A)", "this decision (B)", "will affect (C)", "everyone in the department (D)"],
    answer: 0,
    explanation: "\"Between\" is a preposition and must be followed by an object pronoun — \"between you and me,\" not \"I.\""
  },
  {
    question: "Identify the error in: \"The manager, together with his assistants (A), were planning (B) to review the budget (C) next week (D).\"",
    options: ["were planning (B)", "together with his assistants (A)", "next week (D)", "to review the budget (C)"],
    answer: 0,
    explanation: "\"Together with\" doesn't make the subject plural — the main subject \"manager\" is singular, so it should be \"was planning,\" not \"were planning.\""
  },
  {
    question: "Identify the error in: \"She is more taller (A) than (B) her sister (C) in every way (D).\"",
    options: ["more taller (A)", "in every way (D)", "her sister (C)", "than (B)"],
    answer: 0,
    explanation: "\"Taller\" is already comparative; adding \"more\" creates a double comparative, which is grammatically incorrect."
  },
  {
    question: "Identify the error in: \"Neither of the answers (A) are correct (B) according to (C) the marking scheme (D).\"",
    options: ["according to (C)", "the marking scheme (D)", "are correct (B)", "Neither of the answers (A)"],
    answer: 2,
    explanation: "\"Neither\" is singular and takes a singular verb — it should be \"is correct,\" not \"are correct.\""
  },
  {
    question: "Identify the error in: \"He is one of the students who (A) has (B) always excelled (C) academically (D).\"",
    options: ["has (A)", "academically (C)", "always excelled (B)", "No error (D)"],
    answer: 0,
    explanation: "In \"one of the students who,\" the relative pronoun \"who\" refers to \"students\" (plural), so it should be \"have always excelled,\" not \"has.\""
  },
  {
    question: "Identify the error in: \"Having finished the assignment (A), the television was watched (B) by the children (C) for two hours (D).\"",
    options: ["the television was watched (B)", "by the children (C)", "Having finished the assignment (A)", "for two hours (D)"],
    answer: 0,
    explanation: "This is a dangling modifier — \"the television\" cannot finish an assignment. It should be restructured so the subject performing the action (\"the children\") follows the introductory phrase."
  },
  {
    question: "Identify the error in: \"Everyone must bring their own textbooks (A) if they want (B) to participate fully (C) in the discussion (D).\"",
    options: ["in the discussion (D)", "to participate fully (C)", "if they want (B)", "their own textbooks (A)"],
    answer: 3,
    explanation: "Though commonly used informally, in formal/standard exam English, \"everyone\" (singular) should agree with a singular pronoun — \"his or her own textbooks,\" not \"their.\""
  },
  {
    question: "Identify the error in: \"The data shows (A) that students who study (B) in groups perform better (C) than those who study alone (D).\"",
    options: ["that students who study (B)", "shows (A)", "than those who study alone (D)", "in groups perform better (C)"],
    answer: 1,
    explanation: "\"Data\" is technically the plural of \"datum\" and traditionally takes a plural verb — \"the data show,\" not \"shows\" (a frequently tested formal grammar rule)."
  },
  {
    question: "After years of hard work, he finally managed to ___.",
    options: ["hit the nail on the head", "beat around the bush", "bite the bullet", "make ends meet"],
    answer: 3,
    explanation: "\"Make ends meet\" means to manage financially with limited resources — fitting the context of hard work leading to financial stability."
  },
  {
    question: "She decided to ___ and confront her boss about the unfair treatment.",
    options: ["take the bull by the horns", "jump on the bandwagon", "spill the beans", "let the cat out of the bag"],
    answer: 0,
    explanation: "\"Take the bull by the horns\" means to confront a difficult situation directly and courageously."
  },
  {
    question: "I think we should ___ before making such an important decision.",
    options: ["sleep on it", "go the extra mile", "call it a day", "burn the midnight oil"],
    answer: 0,
    explanation: "\"Sleep on it\" means to delay a decision until the next day to think it over carefully."
  },
  {
    question: "Despite the criticism, he continued to ___ and ignored the naysayers.",
    options: ["jump the gun", "throw in the towel", "stick to his guns", "cut corners"],
    answer: 2,
    explanation: "\"Stick to his guns\" means to remain firm in one's position despite opposition — matching \"continued... ignored naysayers.\""
  },
  {
    question: "The company's profits ___ after the new CEO implemented cost-cutting measures.",
    options: ["broke even", "hit rock bottom", "took a nosedive", "went through the roof"],
    answer: 3,
    explanation: "\"Went through the roof\" means increased dramatically, which fits with successful cost-cutting leading to higher profits."
  },
  {
    question: "He tends to ___ instead of addressing issues directly.",
    options: ["pull someone's leg", "beat around the bush", "break the ice", "hit the sack"],
    answer: 1,
    explanation: "\"Beat around the bush\" means to avoid getting to the point or dealing with something directly."
  },
  {
    question: "After the scandal broke, the politician's career ___.",
    options: ["cost an arm and a leg", "was once in a blue moon", "went down the drain", "was a piece of cake"],
    answer: 2,
    explanation: "\"Went down the drain\" means to be ruined or wasted completely — fitting a scandal-ruined career."
  },
  {
    question: "It's ___ that both of them showed up wearing the same outfit.",
    options: ["a piece of cake", "an uphill task", "a blessing in disguise", "once in a blue moon"],
    answer: 3,
    explanation: "\"Once in a blue moon\" describes something that happens very rarely, matching a coincidental, unusual event."
  },
  {
    question: "Losing that job turned out to be ___ because it led him to start his own successful business.",
    options: ["the last straw", "a blessing in disguise", "a wild goose chase", "a drop in the ocean"],
    answer: 1,
    explanation: "\"A blessing in disguise\" refers to something that seems bad at first but eventually results in something good."
  },
  {
    question: "The negotiations reached a critical point, and both parties had to ___.",
    options: ["face the music", "see eye to eye", "call it quits", "break the bank"],
    answer: 1,
    explanation: "\"See eye to eye\" means to agree or reach a mutual understanding — fitting for negotiations reaching resolution."
  },
  {
    question: "\"The classroom was a zoo during the substitute teacher's lesson.\" This sentence uses:",
    options: ["Metaphor", "Simile", "Hyperbole", "Personification"],
    answer: 0,
    explanation: "A metaphor directly compares two unlike things without using \"like\" or \"as\" — the classroom is being called a zoo, not compared using \"like.\""
  },
  {
    question: "\"The wind whispered secrets through the trees.\" This is an example of:",
    options: ["Onomatopoeia", "Metaphor", "Personification", "Alliteration"],
    answer: 2,
    explanation: "Personification gives human characteristics (whispering, having secrets) to non-human things (the wind)."
  },
  {
    question: "\"Her smile was as bright as the sun.\" This sentence uses:",
    options: ["Personification", "Metaphor", "Simile", "Hyperbole"],
    answer: 2,
    explanation: "A simile makes a comparison using \"like\" or \"as\" — here \"as bright as\" signals a simile."
  },
  {
    question: "\"I've told you a million times to clean your room!\" This is an example of:",
    options: ["Irony", "Hyperbole", "Euphemism", "Understatement"],
    answer: 1,
    explanation: "Hyperbole is deliberate exaggeration for emphasis — \"a million times\" is clearly an exaggeration, not literal."
  },
  {
    question: "\"The soldier's uniform was his coffin.\" This sentence uses:",
    options: ["Metaphor", "Simile", "Oxymoron", "Irony"],
    answer: 0,
    explanation: "This directly equates the uniform with a coffin (implying death), which is a metaphor, not a literal comparison using \"like/as.\""
  },
  {
    question: "\"Peter Piper picked a peck of pickled peppers.\" This is an example of:",
    options: ["Alliteration", "Consonance", "Assonance", "Onomatopoeia"],
    answer: 0,
    explanation: "Alliteration is the repetition of initial consonant sounds in close proximity — the repeated \"P\" sound demonstrates this."
  },
  {
    question: "\"The buzzing bees flew around the garden.\" The word \"buzzing\" is an example of:",
    options: ["Onomatopoeia", "Alliteration", "Personification", "Assonance"],
    answer: 0,
    explanation: "Onomatopoeia refers to words that imitate the sound they describe — \"buzzing\" mimics the actual sound bees make."
  },
  {
    question: "\"It's a bittersweet moment saying goodbye to my best friend.\" The word \"bittersweet\" is an example of:",
    options: ["Metaphor", "Irony", "Paradox", "Oxymoron"],
    answer: 3,
    explanation: "An oxymoron combines contradictory terms (\"bitter\" and \"sweet\") to express a complex or nuanced emotion."
  },
  {
    question: "\"The fire fighter arrived at the burning house to save the day, only to find it had already burned to the ground.\" This situation illustrates:",
    options: ["Hyperbole", "Situational irony", "Dramatic irony", "Verbal irony"],
    answer: 1,
    explanation: "Situational irony occurs when the outcome is contrary to what was expected — the firefighter arriving too late to help defies the expected heroic rescue."
  },
  {
    question: "\"This is the beginning of the end.\" This statement is an example of:",
    options: ["Metaphor", "Oxymoron", "Paradox", "Simile"],
    answer: 2,
    explanation: "A paradox is a statement that seems contradictory or absurd but may reveal an underlying truth — \"beginning of the end\" seems illogical yet makes sense contextually."
  },
  {
    question: "\"All the world's a stage, and all the men and women merely players.\" This famous line by Shakespeare uses:",
    options: ["Personification", "Simile", "Extended metaphor", "Hyperbole"],
    answer: 2,
    explanation: "This is an extended metaphor because it sustains the comparison (life as a stage/performance) across multiple clauses, not just one phrase."
  },
  {
    question: "\"He passed away peacefully in his sleep.\" This phrase is an example of:",
    options: ["Irony", "Understatement", "Hyperbole", "Euphemism"],
    answer: 3,
    explanation: "A euphemism substitutes a milder or more polite expression for something considered harsh or unpleasant — \"passed away\" softens the reality of death."
  },
  {
    question: "\"The ghost of my past haunted every decision I made.\" This sentence uses:",
    options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
    answer: 0,
    explanation: "This is a metaphor because \"the past\" is being described as a ghost (something it isn't literally), representing how memories influence decisions."
  },
  {
    question: "\"Yeah, right, like that's ever going to happen!\" This statement, said sarcastically, is an example of:",
    options: ["Verbal irony", "Situational irony", "Dramatic irony", "Hyperbole"],
    answer: 0,
    explanation: "Verbal irony occurs when someone says the opposite of what they actually mean, typically for sarcastic or humorous effect."
  },
  {
    question: "\"The audience watched as the character walked confidently into a trap that they could see but the character couldn't.\" This illustrates:",
    options: ["Verbal irony", "Situational irony", "Dramatic irony", "Paradox"],
    answer: 2,
    explanation: "Dramatic irony occurs when the audience knows something important that the character does not, creating tension."
  },
];

const ENGLISHB = [
  {
    question: "Which suffix correctly forms a noun from the adjective \"happy\"?",
    options: ["Happyness", "Happyment", "Happiness", "Happity"],
    answer: 2,
    explanation: "When forming a noun from an adjective ending in \"y\" preceded by a consonant, the \"y\" changes to \"i\" before adding \"-ness\" — \"happiness.\""
  },
  {
    question: "Identify the correctly formed word: The opposite of \"legible\" is:",
    options: ["Illegible", "Dislegible", "Nonlegible", "Unlegible"],
    answer: 0,
    explanation: "Words beginning with \"l\" typically take the prefix \"il-\" for negation (illegal, illegible), following English morphological patterns."
  },
  {
    question: "What part of speech is formed when \"-ify\" is added to \"beauty\" (beautify)?",
    options: ["Verb", "Noun", "Adjective", "Adverb"],
    answer: 0,
    explanation: "The suffix \"-ify\" typically transforms nouns/adjectives into verbs, meaning \"to make\" — beautify means \"to make beautiful.\""
  },
  {
    question: "Which of the following is an example of a compound word formed by blending?",
    options: ["Football", "Blackboard", "Smog", "Notebook"],
    answer: 2,
    explanation: "\"Smog\" is a blend of \"smoke\" and \"fog\" — combining parts of two words, unlike the others which are straightforward compounds of whole words."
  },
  {
    question: "The word \"misunderstand\" is formed by adding a prefix to \"understand.\" What does the prefix \"mis-\" indicate?",
    options: ["Excess", "Negation", "Repetition", "Wrongness/incorrectness"],
    answer: 3,
    explanation: "The prefix \"mis-\" indicates something done wrongly or incorrectly, as in misunderstand, mismanage, misinterpret."
  },
  {
    question: "Which word is formed through conversion (same word used as different parts of speech without changing form)?",
    options: ["Unbelievable", "Happiness", "Google (as in \"to google something\")", "Nationalize"],
    answer: 2,
    explanation: "Conversion occurs when a word changes its grammatical category without adding affixes — \"google\" (a noun/brand) is used as a verb without any change in form."
  },
  {
    question: "What is the correct term for words formed by combining the first letters of a phrase, like \"NASA\"?",
    options: ["Acronym", "Clipping", "Compound", "Blend"],
    answer: 0,
    explanation: "An acronym is formed from the initial letters of a phrase and pronounced as a word (NASA), distinct from abbreviations pronounced letter-by-letter."
  },
  {
    question: "The word \"fridge\" (from \"refrigerator\") is an example of:",
    options: ["Backformation", "Acronym", "Blending", "Clipping"],
    answer: 3,
    explanation: "Clipping shortens a longer word by removing part of it while retaining the original meaning — \"refrigerator\" to \"fridge.\""
  },
  {
    question: "Which prefix means \"against\" or \"opposing,\" as in \"antisocial\"?",
    options: ["Co-", "Inter-", "Pro-", "Anti-"],
    answer: 3,
    explanation: "The prefix \"anti-\" means against or opposed to, as seen in antisocial, antibiotic, antithesis."
  },
  {
    question: "The word \"television\" was formed by combining Greek and Latin roots. This process is called:",
    options: ["Backformation", "Blending", "Compounding using classical roots", "Clipping"],
    answer: 2,
    explanation: "\"Television\" combines \"tele-\" (Greek, meaning \"far\") and \"vision\" (Latin, meaning \"sight\") — a compound using classical/neoclassical roots."
  },
  {
    question: "\"She doesn't like coffee, ___?\"",
    options: ["does she", "is she", "isn't she", "doesn't she"],
    answer: 0,
    explanation: "Negative statements take positive question tags. Since the main verb is \"doesn't\" (auxiliary \"does\" + not), the tag becomes \"does she.\""
  },
  {
    question: "\"Let's go to the party tonight, ___?\"",
    options: ["do we", "shall we", "will we", "don't we"],
    answer: 1,
    explanation: "With \"Let's\" (suggestions), the standard question tag is \"shall we,\" not \"do/don't we.\""
  },
  {
    question: "\"Nobody called while I was out, ___?\"",
    options: ["did he", "does he", "didn't they", "did they"],
    answer: 3,
    explanation: "\"Nobody\" is treated as negative, so it takes a positive tag. Since \"nobody\" refers to an indefinite person, the pronoun used in the tag is \"they\" (singular they)."
  },
  {
    question: "\"You'd better finish your homework, ___?\"",
    options: ["wouldn't you", "hadn't you", "don't you", "haven't you"],
    answer: 1,
    explanation: "\"Had better\" (even in contracted form \"'d better\") takes the tag \"hadn't,\" matching the auxiliary \"had,\" not \"would.\""
  },
  {
    question: "\"I am the best candidate for this job, ___?\"",
    options: ["am not I", "aren't I", "isn't it", "am I not"],
    answer: 1,
    explanation: "Though \"amn't I\" would be grammatically logical, standard English uses \"aren't I\" as the accepted tag for \"I am\" statements."
  },
  {
    question: "\"He rarely visits his hometown, ___?\"",
    options: ["is he", "doesn't he", "isn't he", "does he"],
    answer: 3,
    explanation: "\"Rarely\" is a negative adverb, so even though the sentence looks positive, it functions negatively — requiring a positive tag \"does he.\""
  },
  {
    question: "\"They have never been to Lagos before, ___?\"",
    options: ["do they", "have they", "haven't they", "did they"],
    answer: 1,
    explanation: "\"Never\" makes the statement negative in meaning, so the tag must be positive — \"have they.\""
  },
  {
    question: "\"Everyone finished their assignment on time, ___?\"",
    options: ["doesn't he", "didn't they", "did he", "does he"],
    answer: 1,
    explanation: "Although \"everyone\" is grammatically singular, question tags conventionally use \"they\" to refer back to it in modern English, matching the positive statement with a negative tag."
  },
  {
    question: "\"There isn't much time left, ___?\"",
    options: ["is it", "isn't it", "is there", "isn't there"],
    answer: 2,
    explanation: "The sentence is negative (\"isn't\"), so the tag must be positive — \"is there,\" matching the dummy subject \"there.\""
  },
  {
    question: "\"I wish I were taller, ___?\"",
    options: ["don't I", "weren't I", "aren't I", "wasn't I"],
    answer: 0,
    explanation: "For sentences beginning with \"I wish,\" the tag typically uses \"don't I,\" referring to the main verb \"wish,\" not the subjunctive \"were.\""
  },
  {
    question: "Which of the following words has a different vowel sound from the others?",
    options: ["Look", "Food", "Book", "Cook"],
    answer: 1,
    explanation: "\"Food\" is pronounced with the long vowel sound /uː/, while \"book,\" \"look,\" and \"cook\" all use the short /ʊ/ sound."
  },
  {
    question: "Identify the word with a silent letter.",
    options: ["Listen", "Lessen", "Lesson", "Lasting"],
    answer: 0,
    explanation: "In \"listen,\" the \"t\" is silent (/ˈlɪsən/), unlike the other words where all consonants are pronounced."
  },
  {
    question: "Which word does NOT rhyme with \"though\"?",
    options: ["Cough", "Dough", "Toe", "Sew"],
    answer: 0,
    explanation: "\"Cough\" is pronounced /kɒf/, with a completely different vowel and ending sound, unlike \"though,\" \"dough,\" \"toe,\" and \"sew,\" which all share the /oʊ/ sound."
  },
  {
    question: "Which of these words has the stress on the first syllable?",
    options: ["Record (verb)", "Record (noun)", "Present (verb)", "Suspect (verb)"],
    answer: 1,
    explanation: "When \"record\" is used as a noun, stress falls on the first syllable (\"RE-cord\"), while as a verb, it shifts to the second syllable (\"re-CORD\") — a classic noun/verb stress-shift pattern."
  },
  {
    question: "Identify the word with three syllables.",
    options: ["Photo", "Photographer", "Photographic", "Photograph"],
    answer: 3,
    explanation: "\"Photograph\" (PHO-to-graph) has three syllables, while \"photographer\" and \"photographic\" have four, and \"photo\" has only two."
  },
  {
    question: "Which word contains the phoneme /ʃ/ (as in \"sh\")?",
    options: ["Chair", "Chorus", "School", "Sure"],
    answer: 3,
    explanation: "\"Sure\" is pronounced /ʃʊər/, beginning with the /ʃ/ sound, unlike \"chair\" (/tʃ/), \"chorus\" (/k/), or \"school\" (/sk/)."
  },
  {
    question: "Which of the following words has a diphthong?",
    options: ["Bat", "But", "Boy", "Bit"],
    answer: 2,
    explanation: "\"Boy\" contains the diphthong /ɔɪ/, a glide from one vowel sound to another within the same syllable, unlike the other words with single (monophthong) vowel sounds."
  },
  {
    question: "Identify the word where \"ch\" is pronounced as /k/.",
    options: ["Chemistry", "Chair", "Church", "Cheese"],
    answer: 0,
    explanation: "In words of Greek origin like \"chemistry,\" \"ch\" is pronounced /k/, unlike native English words like \"chair\" and \"church\" where \"ch\" is /tʃ/."
  },
  {
    question: "Which word has the primary stress on the second syllable?",
    options: ["Character", "Between", "Beautiful", "Family"],
    answer: 1,
    explanation: "\"Between\" (be-TWEEN) places stress on the second syllable, while the other words are stressed on the first syllable."
  },
  {
    question: "Which pair of words are homophones (same sound, different meaning/spelling)?",
    options: ["Bread/Breed", "Bear/Beer", "Cheap/Chip", "Flower/Flour"],
    answer: 3,
    explanation: "\"Flower\" and \"flour\" are pronounced identically (/ˈflaʊər/) but have completely different meanings and spellings — true homophones."
  },
  {
    question: "\"It is not that he doesn't want to help; he simply lacks the means to do so.\" This sentence implies:",
    options: ["He refuses to help", "He is unwilling to help", "He has already helped", "He wants to help but cannot"],
    answer: 3,
    explanation: "The sentence explicitly clarifies that his hesitation is not about willingness but about capability/resources — he wants to help but is constrained."
  },
  {
    question: "\"Had she studied harder, she would have passed the examination.\" This sentence suggests:",
    options: ["She studied hard and passed", "She is currently studying", "She didn't study hard and failed", "She will study harder next time"],
    answer: 2,
    explanation: "This is a third conditional expressing an unreal past situation — implying the opposite happened: she did NOT study hard, and therefore did NOT pass."
  },
  {
    question: "\"Far from being lazy, John is one of the most industrious employees in the company.\" This sentence means:",
    options: ["John is moderately hardworking", "John is lazy", "John used to be lazy", "John is very hardworking"],
    answer: 3,
    explanation: "\"Far from being lazy\" negates the idea of laziness entirely, and \"industrious\" reinforces that John is, in fact, very hardworking."
  },
  {
    question: "\"Little did he know that his decision would change his life forever.\" This sentence implies:",
    options: ["He was fully aware of the consequences", "He had no idea about the future impact", "He planned the outcome carefully", "He regretted his decision immediately"],
    answer: 1,
    explanation: "\"Little did he know\" is an idiomatic expression indicating a lack of awareness or anticipation of what was to come."
  },
  {
    question: "\"Not until the manager arrived did the meeting begin.\" This means:",
    options: ["The meeting began before the manager arrived", "The manager never arrived", "The meeting began only after the manager's arrival", "The meeting was cancelled"],
    answer: 2,
    explanation: "\"Not until X did Y\" structure indicates that Y (the meeting) only happened after X (manager's arrival) occurred."
  },
  {
    question: "\"She would rather resign than compromise her principles.\" This sentence suggests:",
    options: ["She will definitely compromise", "She is undecided", "She prefers resignation over compromising her values", "She has already resigned"],
    answer: 2,
    explanation: "\"Would rather...than\" expresses a clear preference — she prefers to resign rather than compromise her values."
  },
  {
    question: "\"But for his quick thinking, the accident would have been fatal.\" This implies:",
    options: ["He was not present during the accident", "The accident was fatal", "His quick thinking prevented a fatal outcome", "His quick thinking caused the accident"],
    answer: 2,
    explanation: "\"But for\" means \"if not for\" or \"without\" — his quick thinking is credited with preventing what would have otherwise been a fatal accident."
  },
  {
    question: "\"The more you practice, the better you become.\" This sentence expresses:",
    options: ["An unlikely condition", "A contrast", "A sequence of unrelated events", "A proportional/comparative relationship"],
    answer: 3,
    explanation: "The \"the more...the better\" structure shows a direct proportional relationship between two variables — increased practice leads to increased improvement."
  },
  {
    question: "\"He is too stubborn to accept advice from anyone.\" This means:",
    options: ["He is extremely open to suggestions", "He sometimes accepts advice", "He gives advice to others", "His stubbornness prevents him from accepting advice"],
    answer: 3,
    explanation: "\"Too...to\" structure indicates that his level of stubbornness is so high that it results in him being unable/unwilling to accept advice."
  },
  {
    question: "\"Rarely have I witnessed such dedication to a cause.\" This sentence means:",
    options: ["The speaker is indifferent to dedication", "The speaker has never witnessed dedication", "Such dedication is very uncommon in the speaker's experience", "The speaker witnesses this dedication frequently"],
    answer: 2,
    explanation: "\"Rarely\" indicates infrequency, and the inverted structure emphasizes that such a high level of dedication is uncommon based on the speaker's experience."
  },
  {
    question: "\"Mathematics ___ my favorite subject in school.\"",
    options: ["are", "is", "have been", "were"],
    answer: 1,
    explanation: "Though \"mathematics\" ends in \"s,\" subjects/disciplines like mathematics, physics, and economics are treated as singular and take singular verbs."
  },
  {
    question: "\"The police ___ investigating the matter thoroughly.\"",
    options: ["is", "are", "has been", "was"],
    answer: 1,
    explanation: "\"Police\" is always treated as a plural noun in English (no singular form exists for this meaning), so it takes a plural verb — \"are.\""
  },
  {
    question: "\"Ten kilometers ___ a long distance to walk.\"",
    options: ["are", "were", "is", "have been"],
    answer: 2,
    explanation: "When referring to distance, money, weight, or time as a single unit/quantity, the verb is singular, even though the number appears plural — \"is.\""
  },
  {
    question: "\"Either the manager or the employees ___ responsible for this error.\"",
    options: ["has been", "was", "is", "are"],
    answer: 3,
    explanation: "In \"either...or\" constructions, the verb agrees with the noun closer to it — \"employees\" (plural) — hence \"are.\""
  },
  {
    question: "\"The jury ___ still deliberating on the verdict.\"",
    options: ["has been", "is", "are", "was"],
    answer: 1,
    explanation: "When a collective noun like \"jury\" acts as a single unit (deliberating together as one body), it takes a singular verb in standard usage."
  },
  {
    question: "\"A pair of scissors ___ on the table.\"",
    options: ["are", "have been", "was", "is"],
    answer: 3,
    explanation: "Though \"scissors\" is plural in form, when referring to it as \"a pair of,\" the verb agrees with \"pair\" (singular) — \"is.\""
  },
  {
    question: "\"Physics and chemistry ___ compulsory subjects for science students.\"",
    options: ["is", "has been", "are", "was"],
    answer: 2,
    explanation: "When two distinct subjects are joined by \"and\" as separate entities (not a single unified concept), the verb is plural — \"are.\""
  },
  {
    question: "\"One of the students ___ absent today.\"",
    options: ["are", "is", "have been", "were"],
    answer: 1,
    explanation: "\"One\" is the subject (singular), while \"of the students\" is a prepositional phrase that doesn't affect verb agreement — hence \"is.\""
  },
  {
    question: "\"The United Nations ___ various peacekeeping missions worldwide.\"",
    options: ["have conducted", "conducts", "conduct", "are conducting"],
    answer: 1,
    explanation: "\"The United Nations,\" despite appearing plural, refers to a single organization and is treated as singular — \"conducts.\""
  },
  {
    question: "\"Bread and butter ___ his favorite breakfast.\"",
    options: ["is", "are", "have been", "were"],
    answer: 0,
    explanation: "When two nouns joined by \"and\" refer to a single combined idea/unit (bread and butter as one dish/concept), the verb is singular."
  },
];

const ENGLISHC = [
  {
    question: "Choose the word nearest in meaning to \"Meticulous.\"",
    options: ["Careless", "Hasty", "Thorough", "Ambiguous"],
    answer: 2,
    explanation: "\"Meticulous\" means showing great attention to detail — \"thorough\" captures this precision and carefulness."
  },
  {
    question: "Select the synonym of \"Candid.\"",
    options: ["Deceptive", "Frank", "Reserved", "Complicated"],
    answer: 1,
    explanation: "\"Candid\" means truthful and straightforward — \"frank\" shares this meaning of openness and honesty."
  },
  {
    question: "Choose the word closest in meaning to \"Ephemeral.\"",
    options: ["Permanent", "Transient", "Eternal", "Solid"],
    answer: 1,
    explanation: "\"Ephemeral\" means lasting for a very short time — \"transient\" means the same, both describing temporary/fleeting things."
  },
  {
    question: "Select the synonym of \"Pragmatic.\"",
    options: ["Theoretical", "Idealistic", "Emotional", "Practical"],
    answer: 3,
    explanation: "\"Pragmatic\" refers to dealing with things sensibly and realistically — \"practical\" is the closest match."
  },
  {
    question: "Choose the word nearest in meaning to \"Austere.\"",
    options: ["Luxurious", "Generous", "Severe/simple", "Colorful"],
    answer: 2,
    explanation: "\"Austere\" describes something plain, severe, or without luxury — matching \"severe/simple\" rather than opulence."
  },
  {
    question: "Select the synonym of \"Nostalgic.\"",
    options: ["Indifferent", "Forward-looking", "Sentimental", "Confused"],
    answer: 2,
    explanation: "\"Nostalgic\" involves a sentimental longing for the past — \"sentimental\" aligns closely with this emotional connection."
  },
  {
    question: "Choose the word closest in meaning to \"Tenacious.\"",
    options: ["Weak", "Careless", "Persistent", "Flexible"],
    answer: 2,
    explanation: "\"Tenacious\" means holding firmly to something or being persistent — \"persistent\" is the direct synonym."
  },
  {
    question: "Select the synonym of \"Lucid.\"",
    options: ["Complicated", "Obscure", "Confusing", "Clear"],
    answer: 3,
    explanation: "\"Lucid\" means expressed clearly and easy to understand — directly matching \"clear.\""
  },
  {
    question: "Choose the word nearest in meaning to \"Frugal.\"",
    options: ["Generous", "Extravagant", "Economical", "Wasteful"],
    answer: 2,
    explanation: "\"Frugal\" describes someone careful with money/resources — \"economical\" reflects this same prudent, cost-conscious behavior."
  },
  {
    question: "Select the synonym of \"Vigilant.\"",
    options: ["Sleepy", "Careless", "Watchful", "Distracted"],
    answer: 2,
    explanation: "\"Vigilant\" means keeping careful watch for danger or difficulties — \"watchful\" captures this alertness."
  },
  {
    question: "Choose the antonym of \"Reticent.\"",
    options: ["Shy", "Reserved", "Talkative", "Silent"],
    answer: 2,
    explanation: "\"Reticent\" means reserved or not revealing thoughts easily — \"talkative\" is its direct opposite."
  },
  {
    question: "Select the antonym of \"Obsolete.\"",
    options: ["Outdated", "Old-fashioned", "Modern", "Ancient"],
    answer: 2,
    explanation: "\"Obsolete\" means no longer in use or out of date — \"modern\" is the clear opposite, representing current relevance."
  },
  {
    question: "Choose the antonym of \"Benevolent.\"",
    options: ["Malicious", "Charitable", "Generous", "Kind"],
    answer: 0,
    explanation: "\"Benevolent\" means well-meaning and kind — \"malicious\" (intending harm) is the direct opposite."
  },
  {
    question: "Select the antonym of \"Verbose.\"",
    options: ["Concise", "Wordy", "Lengthy", "Talkative"],
    answer: 0,
    explanation: "\"Verbose\" means using more words than necessary — \"concise\" (brief and to the point) is the opposite."
  },
  {
    question: "Choose the antonym of \"Diligent.\"",
    options: ["Lazy", "Hardworking", "Careful", "Attentive"],
    answer: 0,
    explanation: "\"Diligent\" means showing care and effort in work — \"lazy\" is the direct opposite of this industrious quality."
  },
  {
    question: "Select the antonym of \"Abundant.\"",
    options: ["Ample", "Scarce", "Excessive", "Plentiful"],
    answer: 1,
    explanation: "\"Abundant\" means existing in large quantities — \"scarce\" (insufficient or rare) is the opposite."
  },
  {
    question: "Choose the antonym of \"Humble.\"",
    options: ["Arrogant", "Simple", "Modest", "Meek"],
    answer: 0,
    explanation: "\"Humble\" means having a modest view of oneself — \"arrogant\" (excessively proud) is the direct opposite."
  },
  {
    question: "Select the antonym of \"Transparent.\"",
    options: ["Obvious", "Clear", "Ambiguous", "Visible"],
    answer: 2,
    explanation: "\"Transparent\" (in the context of clarity/honesty) means easy to understand or see through — \"ambiguous\" (unclear or vague) is the opposite."
  },
  {
    question: "Choose the antonym of \"Voluntary.\"",
    options: ["Optional", "Free", "Compulsory", "Willing"],
    answer: 2,
    explanation: "\"Voluntary\" means done by choice, without compulsion — \"compulsory\" (required, obligatory) is the direct opposite."
  },
  {
    question: "Select the antonym of \"Amiable.\"",
    options: ["Pleasant", "Friendly", "Hostile", "Kind"],
    answer: 2,
    explanation: "\"Amiable\" means friendly and pleasant — \"hostile\" (unfriendly, antagonistic) is the direct opposite."
  },
  {
    question: "In the sentence \"She sings beautifully,\" the word \"beautifully\" is a:",
    options: ["Adverb", "Noun", "Adjective", "Verb"],
    answer: 0,
    explanation: "\"Beautifully\" modifies the verb \"sings,\" describing how the action is performed — a defining function of adverbs."
  },
  {
    question: "Identify the part of speech of the underlined word: \"The quick brown fox jumped over the lazy dog.\"",
    options: ["Adjective", "Adverb", "Noun", "Verb"],
    answer: 0,
    explanation: "\"Quick\" describes the noun \"fox,\" giving it a quality — making it an adjective."
  },
  {
    question: "In \"He ran despite the rain,\" the word \"despite\" functions as a:",
    options: ["Interjection", "Preposition", "Conjunction", "Adverb"],
    answer: 1,
    explanation: "\"Despite\" introduces a noun phrase (\"the rain\") and shows a relationship (contrast) — functioning as a preposition."
  },
  {
    question: "Identify the part of speech of \"wow\" in: \"Wow! That was an amazing performance.\"",
    options: ["Adverb", "Noun", "Adjective", "Interjection"],
    answer: 3,
    explanation: "\"Wow\" expresses sudden emotion or reaction and stands independently — a classic interjection."
  },
  {
    question: "In the sentence \"Either you or I am responsible,\" \"either...or\" functions as a:",
    options: ["Pronoun", "Preposition", "Correlative conjunction", "Adverb"],
    answer: 2,
    explanation: "\"Either...or\" is a correlative conjunction pair, linking two related elements/choices within a sentence."
  },
  {
    question: "Identify the part of speech of \"swiftly\" in: \"The cheetah moved swiftly across the plain.\"",
    options: ["Adverb", "Verb", "Adjective", "Noun"],
    answer: 0,
    explanation: "\"Swiftly\" modifies the verb \"moved,\" describing the manner of movement — functioning as an adverb."
  },
  {
    question: "In \"This is the book that I bought,\" the word \"that\" functions as a:",
    options: ["Relative pronoun", "Conjunction", "Demonstrative pronoun", "Adjective"],
    answer: 0,
    explanation: "\"That\" introduces a relative clause (\"that I bought\") describing \"the book,\" functioning as a relative pronoun."
  },
  {
    question: "Identify the part of speech of \"under\" in: \"The cat hid under the table.\"",
    options: ["Adverb", "Conjunction", "Preposition", "Adjective"],
    answer: 2,
    explanation: "\"Under\" shows the spatial relationship between \"the cat\" and \"the table,\" functioning as a preposition."
  },
  {
    question: "In \"Although it was raining, we continued the match,\" \"although\" is a:",
    options: ["Coordinating conjunction", "Subordinating conjunction", "Preposition", "Adverb"],
    answer: 1,
    explanation: "\"Although\" introduces a dependent/subordinate clause showing contrast, making it a subordinating conjunction."
  },
  {
    question: "Identify the part of speech of \"himself\" in: \"He blamed himself for the mistake.\"",
    options: ["Reflexive pronoun", "Personal pronoun", "Demonstrative pronoun", "Possessive pronoun"],
    answer: 0,
    explanation: "\"Himself\" reflects the action back onto the subject (\"he\"), making it a reflexive pronoun."
  },
  {
    question: "\"By the time the police arrived, the thief ___ already ___.\"",
    options: ["have / escaped", "has / escaped", "had / escaped", "was / escaping"],
    answer: 2,
    explanation: "This describes an action completed before another past event, requiring the past perfect tense — \"had escaped.\""
  },
  {
    question: "\"She ___ in this company for five years before she resigned.\"",
    options: ["had worked", "works", "has worked", "worked"],
    answer: 0,
    explanation: "The action (working) was completed before another past action (resigning), requiring past perfect tense."
  },
  {
    question: "\"I ___ this book by the time you return.\"",
    options: ["am finishing", "will finish", "will have finished", "finish"],
    answer: 2,
    explanation: "This describes an action that will be completed before a specific point in the future — future perfect tense."
  },
  {
    question: "\"While she ___ dinner, the phone rang.\"",
    options: ["has cooked", "cooks", "was cooking", "cooked"],
    answer: 2,
    explanation: "This describes an ongoing action interrupted by another action in the past — past continuous tense."
  },
  {
    question: "\"He ___ football every weekend since he was a child.\"",
    options: ["has played", "plays", "played", "was playing"],
    answer: 0,
    explanation: "This describes an action that started in the past and continues into the present — present perfect tense, especially with \"since.\""
  },
  {
    question: "\"They ___ to the cinema right now.\"",
    options: ["went", "have gone", "are going", "go"],
    answer: 2,
    explanation: "\"Right now\" indicates an action happening at the present moment — present continuous tense."
  },
  {
    question: "\"By 2025, scientists ___ a cure for many diseases.\"",
    options: ["will discover", "discover", "discovered", "will have discovered"],
    answer: 3,
    explanation: "This refers to an action expected to be completed by a specific future point — future perfect tense."
  },
  {
    question: "\"I ___ my keys somewhere; I can't find them anywhere.\"",
    options: ["have lost", "was losing", "lost", "lose"],
    answer: 0,
    explanation: "The action has present relevance/consequence (can't find them now), which is the hallmark of present perfect tense."
  },
  {
    question: "\"The train ___ by the time we got to the station.\"",
    options: ["has left", "had left", "leaves", "left"],
    answer: 1,
    explanation: "This describes an action completed before another past action (getting to the station) — past perfect tense."
  },
  {
    question: "\"She ___ her homework when her friend called.\"",
    options: ["does", "has done", "was doing", "did"],
    answer: 2,
    explanation: "This describes an ongoing action interrupted by another past event — past continuous tense."
  },
  {
    question: "Convert to passive voice: \"The chef cooked the meal.\"",
    options: ["The meal has cooked by the chef.", "The meal was cooked by the chef.", "The meal is cooked by the chef.", "The meal cooks the chef."],
    answer: 1,
    explanation: "Passive voice structure requires \"was/were + past participle + by,\" matching the past tense of the original sentence."
  },
  {
    question: "Identify the passive form of: \"They will complete the project by Friday.\"",
    options: ["The project will complete by them by Friday.", "The project is completed by them by Friday.", "The project was completed by them by Friday.", "The project will be completed by them by Friday."],
    answer: 3,
    explanation: "Future tense passive voice requires \"will be + past participle,\" maintaining the future time reference."
  },
  {
    question: "Convert to active voice: \"The letter was written by John.\"",
    options: ["John was writing the letter.", "John wrote the letter.", "John has written the letter.", "John writes the letter."],
    answer: 1,
    explanation: "The passive \"was written\" corresponds to simple past active tense — \"wrote,\" maintaining the same time frame."
  },
  {
    question: "Identify the passive form of: \"The workers are building a new bridge.\"",
    options: ["A new bridge has been built by the workers.", "A new bridge was built by the workers.", "A new bridge builds by the workers.", "A new bridge is being built by the workers."],
    answer: 3,
    explanation: "Present continuous passive voice requires \"is/are being + past participle\" to match the ongoing action."
  },
  {
    question: "Convert to passive voice: \"She has completed the assignment.\"",
    options: ["The assignment has been completed by her.", "The assignment is completed by her.", "The assignment was completed by her.", "The assignment had been completed by her."],
    answer: 0,
    explanation: "Present perfect passive voice requires \"has/have been + past participle,\" matching the original tense."
  },
  {
    question: "Identify the correct passive form of: \"You must submit the report by tomorrow.\"",
    options: ["The report must be submitted by tomorrow.", "The report was submitted by tomorrow.", "The report is submitted by tomorrow.", "The report must submitted by tomorrow."],
    answer: 0,
    explanation: "Modal verb passive constructions require \"modal + be + past participle\" — \"must be submitted.\""
  },
  {
    question: "Convert to active voice: \"The cake was eaten by the children.\"",
    options: ["The children eat the cake.", "The children ate the cake.", "The children were eating the cake.", "The children have eaten the cake."],
    answer: 1,
    explanation: "Simple past passive \"was eaten\" corresponds to simple past active — \"ate,\" maintaining the same tense."
  },
  {
    question: "Identify the passive form of: \"The government implemented new policies.\"",
    options: ["New policies have been implemented by the government.", "New policies were implemented by the government.", "New policies are implemented by the government.", "New policies will be implemented by the government."],
    answer: 1,
    explanation: "Simple past active \"implemented\" transforms to simple past passive — \"were implemented,\" keeping the same tense."
  },
  {
    question: "Convert to passive voice: \"The teacher is explaining the lesson.\"",
    options: ["The lesson has been explained by the teacher.", "The lesson is being explained by the teacher.", "The lesson was explained by the teacher.", "The lesson is explained by the teacher."],
    answer: 1,
    explanation: "Present continuous active \"is explaining\" transforms to present continuous passive — \"is being explained.\""
  },
  {
    question: "Identify the passive form of: \"Someone stole my wallet yesterday.\"",
    options: ["My wallet is stolen yesterday.", "My wallet had been stolen yesterday.", "My wallet has been stolen yesterday.", "My wallet was stolen yesterday."],
    answer: 3,
    explanation: "When the agent is unknown/unimportant (\"someone\"), passive voice often omits \"by someone\" — simple past passive \"was stolen\" matches the original tense."
  },
];

const ENGLISHD = [
  {
    question: "Convert to indirect speech: She said, \"I am going to the market.\"",
    options: ["She said that she went to the market.", "She said that she was going to the market.", "She said that she is going to the market.", "She said that she will go to the market."],
    answer: 1,
    explanation: "When the reporting verb is in the past tense (\"said\"), present continuous (\"am going\") shifts to past continuous (\"was going\") in indirect speech."
  },
  {
    question: "Convert to indirect speech: He said, \"I have finished my homework.\"",
    options: ["He said that he has finished his homework.", "He said that he finishes his homework.", "He said that he finished his homework.", "He said that he had finished his homework."],
    answer: 3,
    explanation: "Present perfect (\"have finished\") shifts to past perfect (\"had finished\") in reported speech when the reporting verb is past tense."
  },
  {
    question: "Convert to indirect speech: The teacher said, \"The earth revolves around the sun.\"",
    options: ["The teacher said that the earth had revolved around the sun.", "The teacher said that the earth will revolve around the sun.", "The teacher said that the earth revolved around the sun.", "The teacher said that the earth revolves around the sun."],
    answer: 3,
    explanation: "Universal truths/scientific facts remain in the present tense even in reported speech, regardless of the reporting verb's tense."
  },
  {
    question: "Convert to direct speech: She asked me if I was coming to the party.",
    options: ["She asked, \"Was I coming to the party?\"", "She asked, \"Am I coming to the party?\"", "She said, \"Are you coming to the party?\"", "She said, \"I was coming to the party.\""],
    answer: 2,
    explanation: "Reported questions convert back to direct questions with appropriate pronoun and tense changes reversed — \"you\" (addressee) and present tense \"are.\""
  },
  {
    question: "Convert to indirect speech: He said, \"Please help me with this task.\"",
    options: ["He told me help him with the task.", "He asked that help him with the task.", "He said that please help him with the task.", "He requested me to help him with the task."],
    answer: 3,
    explanation: "Polite requests (\"please\") in direct speech are reported using \"requested,\" with \"to + infinitive\" structure in indirect speech."
  },
  {
    question: "Convert to indirect speech: \"Where do you live?\" she asked him.",
    options: ["She asked him where he lives.", "She asked him where he lived.", "She asked him where he had lived.", "She asked him where did he live."],
    answer: 1,
    explanation: "Reported questions maintain statement word order (not question order) and shift present tense (\"live\") to past tense (\"lived\")."
  },
  {
    question: "Convert to direct speech: They told us that they would visit us the following day.",
    options: ["They said, \"We will visit you the following day.\"", "They said, \"We will visit you tomorrow.\"", "They said, \"We would visit you tomorrow.\"", "They said, \"They will visit us tomorrow.\""],
    answer: 1,
    explanation: "\"The following day\" (indirect) reverts to \"tomorrow\" (direct) when converting back, and \"would\" reverts to \"will\" as the original direct speech tense."
  },
  {
    question: "Convert to indirect speech: \"Don't touch that wire!\" the electrician warned.",
    options: ["The electrician said not touching that wire.", "The electrician warned that don't touch that wire.", "The electrician warned us not to touch that wire.", "The electrician warned to not touch that wire."],
    answer: 2,
    explanation: "Negative commands in indirect speech use \"not + to infinitive\" structure after appropriate reporting verbs like \"warned.\""
  },
  {
    question: "Convert to indirect speech: She said, \"I can swim very well.\"",
    options: ["She said that she is able to swim very well.", "She said that she could swim very well.", "She said that she can swim very well.", "She said that she will be able to swim very well."],
    answer: 1,
    explanation: "Modal verb \"can\" shifts to \"could\" in indirect speech when the reporting verb is in the past tense."
  },
  {
    question: "Convert to direct speech: He exclaimed with joy that he had won the lottery.",
    options: ["He said, \"I had won the lottery!\"", "He said, \"I have won the lottery!\"", "He exclaimed, \"I have won the lottery!\"", "He exclaimed, \"I won the lottery!\""],
    answer: 2,
    explanation: "When converting back to direct speech, the exclamatory tone is retained (\"exclaimed\"), and past perfect reverts to present perfect (\"have won\")."
  },
  {
    question: "\"She has been living in this city ___ 2015.\"",
    options: ["since", "at", "from", "for"],
    answer: 0,
    explanation: "\"Since\" is used with a specific point in time (2015), while \"for\" is used with a duration/period of time."
  },
  {
    question: "\"He is good ___ mathematics.\"",
    options: ["with", "at", "in", "on"],
    answer: 1,
    explanation: "The idiomatic preposition following \"good\" when referring to skill/proficiency in a subject is \"at\" — \"good at.\""
  },
  {
    question: "\"The book is ___ the table.\"",
    options: ["in", "on", "into", "at"],
    answer: 1,
    explanation: "\"On\" indicates a surface relationship (the book resting on top of the table), distinct from \"in\" (inside) or \"at\" (a point)."
  },
  {
    question: "\"She apologized ___ being late.\"",
    options: ["from", "for", "about", "of"],
    answer: 1,
    explanation: "The correct idiomatic preposition following \"apologize\" when referring to a reason/cause is \"for\" — \"apologize for.\""
  },
  {
    question: "\"He divided the cake ___ four equal parts.\"",
    options: ["into", "with", "on", "in"],
    answer: 0,
    explanation: "\"Into\" is used to show a change of state or division from one whole into separate parts, unlike \"in\" (location)."
  },
  {
    question: "\"I am not interested ___ politics.\"",
    options: ["in", "at", "with", "on"],
    answer: 0,
    explanation: "The correct preposition following \"interested\" is \"in,\" as in \"interested in [topic].\""
  },
  {
    question: "\"She arrived ___ the airport two hours early.\"",
    options: ["at", "to", "on", "in"],
    answer: 0,
    explanation: "\"At\" is used for specific points/locations like airports, stations, or buildings, while \"in\" is used for larger areas like cities or countries."
  },
  {
    question: "\"He was accused ___ theft.\"",
    options: ["of", "for", "with", "about"],
    answer: 0,
    explanation: "The correct idiomatic preposition following \"accused\" is \"of\" — \"accused of [crime/wrongdoing].\""
  },
  {
    question: "\"The results are different ___ what we expected.\"",
    options: ["from", "than", "of", "to"],
    answer: 0,
    explanation: "In standard British English, \"different from\" is preferred, though \"different than\" is common in American English; exams typically test the traditional \"different from.\""
  },
  {
    question: "\"She is capable ___ handling this project alone.\"",
    options: ["for", "in", "of", "to"],
    answer: 2,
    explanation: "The correct idiomatic preposition following \"capable\" is \"of\" — \"capable of [doing something].\""
  },
  {
    question: "Choose the sentence with correct punctuation.",
    options: ["\"I can't believe it,\" she said, \"it's already midnight.\"", "\"I can't believe it,\" she said, \"Its already midnight.\"", "\"I cant believe it\", she said, \"its already midnight.\"", "\"I can't believe it\" she said \"it's already midnight\"."],
    answer: 0,
    explanation: "Correct apostrophe usage for contractions (\"can't,\" \"it's\") and proper comma placement within quoted dialogue."
  },
  {
    question: "Choose the correctly punctuated sentence.",
    options: ["My favorite fruits are apples, bananas, and oranges.", "My favorite fruits are, apples, bananas, and oranges.", "My favorite fruits are: apples, bananas, and oranges.", "My favorite fruits: are apples, bananas, and oranges."],
    answer: 0,
    explanation: "A colon should not directly follow a verb like \"are\" — colons introduce lists after a complete independent clause, not mid-sentence."
  },
  {
    question: "Identify the correct use of the apostrophe.",
    options: ["The dog wagged it's tail happily.", "The dogs' bone was buried in the yard.", "The childrens' toys were scattered everywhere.", "Its a beautiful day today."],
    answer: 1,
    explanation: "\"Dogs'\" (plural possessive with apostrophe after 's') correctly shows the bone belongs to multiple dogs; \"it's\" should be \"its\" (possessive) in option A, and \"childrens'\" should be \"children's\" in option C."
  },
  {
    question: "Choose the sentence with correct comma usage.",
    options: ["After, the movie we went to a restaurant, for dinner.", "After the movie we went, to a restaurant for dinner.", "After the movie we went to a restaurant for dinner.", "After the movie, we went to a restaurant for dinner."],
    answer: 3,
    explanation: "A comma is required after an introductory phrase (\"After the movie\") to separate it from the main clause."
  },
  {
    question: "Identify the sentence with correct punctuation.",
    options: ["She asked, \"What time is it?\"", "She asked, \"What time is it\"?", "She asked \"What time is it?\"", "She asked, \"what time is it?\""],
    answer: 0,
    explanation: "The question mark belongs inside the closing quotation mark when the quoted material itself is a question, and a comma properly introduces the direct quote."
  },
  {
    question: "Choose the correctly spelled word.",
    options: ["Receive", "Receve", "Receeve", "Recieve"],
    answer: 0,
    explanation: "The rule \"i before e except after c\" applies here — \"receive\" follows \"c,\" so \"ei\" is correct, not \"ie.\""
  },
  {
    question: "Select the correctly spelled word.",
    options: ["Definitly", "Definately", "Definitely", "Definetly"],
    answer: 2,
    explanation: "\"Definitely\" contains \"finite\" within it — remembering this helps avoid the common misspelling with \"a\" instead of \"i.\""
  },
  {
    question: "Choose the correctly spelled word.",
    options: ["Occureed", "Occured", "Ocurred", "Occurred"],
    answer: 3,
    explanation: "\"Occur\" doubles its final consonant (\"r\") before adding \"-ed\" because it ends in a stressed syllable with a single vowel before the final consonant."
  },
  {
    question: "Select the correctly spelled word.",
    options: ["Privilege", "Priviledge", "Privelege", "Priviliege"],
    answer: 0,
    explanation: "\"Privilege\" has no \"d\" — a commonly confused spelling; remember \"privi-LEGE,\" not \"privi-LEDGE.\""
  },
  {
    question: "Choose the correctly spelled word.",
    options: ["Embbarass", "Embarrass", "Embarras", "Embarass"],
    answer: 1,
    explanation: "\"Embarrass\" has double \"r\" and double \"s\" — a frequently misspelled word requiring attention to both doubled letters."
  },
  {
    question: "In the sentence \"I DID complete the assignment,\" the emphatic stress on \"DID\" is used to:",
    options: ["Ask a question", "Indicate future action", "Express contradiction/emphasis against doubt", "Show uncertainty"],
    answer: 2,
    explanation: "Emphatic stress on auxiliary verbs like \"did\" is used to strongly affirm or contradict a previous doubt or statement (e.g., someone claimed you didn't do it)."
  },
  {
    question: "Which word would likely receive emphatic stress in: \"I said I would help HIM, not her\"?",
    options: ["Help", "Said", "Would", "HIM"],
    answer: 3,
    explanation: "Emphatic stress on \"HIM\" clarifies and contrasts the specific person being referred to, correcting a possible misunderstanding."
  },
  {
    question: "In \"You MUST finish this today,\" the stress on \"MUST\" indicates:",
    options: ["A question", "A strong obligation/urgency", "A suggestion", "Uncertainty"],
    answer: 1,
    explanation: "Emphatic stress on modal verbs like \"must\" intensifies the sense of obligation or urgency being communicated."
  },
  {
    question: "Which syllable receives primary stress in the word \"important\" for emphatic clarity?",
    options: ["im-POR-tant", "import-ANT", "IM-portant", "All syllables equally"],
    answer: 0,
    explanation: "\"Important\" naturally carries primary stress on the second syllable (por), which is standard pronunciation, not for contrastive emphasis but for correct word stress."
  },
  {
    question: "In \"She is the one who solved the problem,\" emphatic stress on \"SHE\" would indicate:",
    options: ["Emphasizing the action", "Indicating a question", "Highlighting a specific person as responsible, possibly contrasting with others", "Showing time reference"],
    answer: 2,
    explanation: "Emphatic stress on a pronoun/subject like \"SHE\" is used to single out and emphasize that particular person, often in contrast to others."
  },
  {
    question: "\"He is married ___ a doctor.\"",
    options: ["to", "by", "for", "with"],
    answer: 0,
    explanation: "The correct idiomatic preposition after \"married\" is \"to\" — \"married to someone,\" not \"with\" or \"by.\""
  },
  {
    question: "\"The children were frightened ___ the loud thunder.\"",
    options: ["with", "about", "of", "from"],
    answer: 2,
    explanation: "\"Frightened of\" is the standard idiomatic pairing when referring to the source of fear."
  },
  {
    question: "\"She is quite similar ___ her elder sister in appearance.\"",
    options: ["from", "as", "with", "to"],
    answer: 3,
    explanation: "\"Similar to\" is the correct idiomatic preposition pairing for comparisons, not \"similar with\" or \"similar as.\""
  },
  {
    question: "Choose the correctly punctuated sentence.",
    options: ["Although he was tired he continued working.", "Although, he was tired he continued working.", "Although he was tired he continued, working.", "Although he was tired, he continued working."],
    answer: 3,
    explanation: "A comma is required after an introductory dependent clause (\"Although he was tired\") before the main clause begins."
  },
  {
    question: "Identify the sentence with correct punctuation.",
    options: ["The three finalists were; John, Mary and Peter.", "The three finalists were: John, Mary, and Peter.", "The three finalists were - John, Mary and Peter.", "The three finalists were, John, Mary and Peter."],
    answer: 1,
    explanation: "A colon correctly introduces a list after a complete independent clause (\"The three finalists were\"), with commas properly separating list items."
  },
  {
    question: "Choose the sentence with correct use of the apostrophe.",
    options: ["The company's profits increased this quarter.", "The company' profits increased this quarter.", "The companys profits increased this quarter.", "The companies profits increased this quarter."],
    answer: 0,
    explanation: "Singular possessive nouns take an apostrophe before \"s\" — \"company's\" shows the profits belong to the company."
  },
  {
    question: "Select the correctly spelled word.",
    options: ["Neccesary", "Necesary", "Necessary", "Neccessary"],
    answer: 2,
    explanation: "\"Necessary\" has one \"c\" and double \"s\" — remember \"one collar, two socks\" as a common mnemonic."
  },
  {
    question: "Choose the correctly spelled word.",
    options: ["Maintainence", "Maintenance", "Maintainance", "Maintenence"],
    answer: 1,
    explanation: "\"Maintenance\" drops the second \"i\" from \"maintain\" and uses \"enance,\" a commonly misspelled pattern."
  },
  {
    question: "Select the correctly spelled word.",
    options: ["Concious", "Consious", "Conscious", "Concsious"],
    answer: 2,
    explanation: "\"Conscious\" contains the tricky \"sci\" combination — a frequently misspelled word due to its unusual letter pattern."
  },
  {
    question: "Choose the correctly spelled word.",
    options: ["Rythem", "Rhytm", "Rythm", "Rhythm"],
    answer: 3,
    explanation: "\"Rhythm\" is notoriously difficult because it has no standard vowels except \"y\" — remember it has two \"h\"s and one \"y.\""
  },
  {
    question: "In \"I NEVER said that,\" the emphatic stress on \"NEVER\" is used to:",
    options: ["Express future intent", "Ask a question", "Strongly deny an accusation", "Show agreement"],
    answer: 2,
    explanation: "Emphatic stress on \"never\" intensifies a denial, strongly rejecting an accusation or assumption made by someone else."
  },
  {
    question: "Which word receives emphatic stress in: \"I want THIS one, not that one\"?",
    options: ["THIS", "Not", "One", "Want"],
    answer: 0,
    explanation: "Stress on \"THIS\" specifically distinguishes and emphasizes the chosen item in contrast to the alternative (\"that one\")."
  },
  {
    question: "In \"It WAS raining, believe me,\" the stress on \"WAS\" serves to:",
    options: ["Indicate uncertainty", "Emphatically confirm a fact being doubted", "Ask for clarification", "Show future possibility"],
    answer: 1,
    explanation: "Emphatic stress on auxiliary \"was\" reinforces the truth of a statement that the listener may doubt or has questioned."
  },
  {
    question: "Which word takes emphatic stress in: \"YOU broke the vase, not your brother\"?",
    options: ["Broke", "Brother", "Vase", "YOU"],
    answer: 3,
    explanation: "Stress on \"YOU\" specifically identifies and emphasizes the responsible party, contrasting with the alternative (\"your brother\")."
  },
  {
    question: "In \"I really DO appreciate your help,\" the stress on \"DO\" indicates:",
    options: ["Doubt", "A question", "Genuine emphasis/sincerity reinforcing the statement", "Future action"],
    answer: 2,
    explanation: "Emphatic \"do\" before a base verb intensifies and confirms sincerity, especially when appreciation might otherwise be assumed absent or doubted."
  },
];
const PHYSICSA = [
  {
    question: "What is the SI unit of force?",
    options: ["Pascal", "Joule", "Watt", "Newton"],
    answer: 3,
    explanation: "Force is defined by Newton's second law (F = ma), and its SI unit — the Newton (N) — equals 1 kg·m/s². Joule measures energy/work, Watt measures power, and Pascal measures pressure."
  },
  {
    question: "Which of the following is a vector quantity?",
    options: ["Mass", "Temperature", "Time", "Displacement"],
    answer: 3,
    explanation: "Displacement has both magnitude and direction (e.g., \"5m East\"), making it a vector, unlike mass, time, and temperature, which are scalars with magnitude only."
  },
  {
    question: "The standard value of acceleration due to gravity on Earth's surface is approximately:",
    options: ["12.0 m/s²", "8.9 m/s²", "9.8 m/s²", "10.8 m/s²"],
    answer: 2,
    explanation: "The internationally accepted standard value of gravitational acceleration near Earth's surface is 9.8 m/s² (sometimes approximated as 10 m/s² for simpler calculations)."
  },
  {
    question: "Calculate the kinetic energy of a 5 kg mass moving at 4 m/s.",
    options: ["20 J", "10 J", "40 J", "80 J"],
    answer: 2,
    explanation: "KE = ½mv² = ½ × 5 × 4² = ½ × 5 × 16 = 40 J."
  },
  {
    question: "Which instrument is used to measure atmospheric pressure?",
    options: ["Manometer", "Barometer", "Hydrometer", "Thermometer"],
    answer: 1,
    explanation: "A barometer specifically measures atmospheric pressure, while a manometer measures gas pressure differences, a hydrometer measures liquid density, and a thermometer measures temperature."
  },
  {
    question: "Sound waves cannot travel through which of the following?",
    options: ["Steel", "Water", "Air", "Vacuum"],
    answer: 3,
    explanation: "Sound is a mechanical wave requiring a medium (solid, liquid, or gas) to propagate through vibrating particles. A vacuum has no particles, so sound cannot travel through it."
  },
  {
    question: "The focal length of a concave mirror is conventionally taken as:",
    options: ["Negative", "Zero", "Infinite", "Positive"],
    answer: 0,
    explanation: "Using the standard sign convention in optics, concave mirrors (converging mirrors) have their focal length measured as negative since the focus lies in front of the mirror (same side as the object)."
  },
  {
    question: "Which equation correctly represents Ohm's Law?",
    options: ["F = ma", "Q = It", "P = IV", "V = IR"],
    answer: 3,
    explanation: "Ohm's Law states that voltage (V) equals current (I) multiplied by resistance (R): V = IR. The other equations represent Newton's second law, electrical power, and electric charge respectively."
  },
  {
    question: "Which color in the visible light spectrum has the longest wavelength?",
    options: ["Violet", "Green", "Blue", "Red"],
    answer: 3,
    explanation: "In the visible spectrum, red light has the longest wavelength (approximately 700nm), while violet has the shortest (approximately 400nm)."
  },
  {
    question: "Work done by a force is zero when the force and displacement are:",
    options: ["Parallel", "Perpendicular", "Equal", "Opposite"],
    answer: 1,
    explanation: "Work = F × d × cos(θ). When the force is perpendicular to displacement (θ = 90°), cos(90°) = 0, making the work done zero."
  },
  {
    question: "What is the SI unit of power?",
    options: ["Watt", "Volt", "Newton", "Joule"],
    answer: 0,
    explanation: "Power is the rate of doing work (Power = Work/Time), and its SI unit is the Watt (W), equivalent to 1 Joule per second."
  },
  {
    question: "A car travels 100m in 10 seconds. Calculate its speed.",
    options: ["100 m/s", "10 m/s", "5 m/s", "1000 m/s"],
    answer: 1,
    explanation: "Speed = distance/time = 100m/10s = 10 m/s."
  },
  {
    question: "At what temperature does ice melt under standard atmospheric pressure, expressed in Kelvin?",
    options: ["100K", "273K", "373K", "0K"],
    answer: 1,
    explanation: "Ice melts at 0°C, which converts to Kelvin using K = °C + 273, giving 273K."
  },
  {
    question: "Total internal reflection occurs when light travels from:",
    options: ["None of the above", "Rarer medium to denser medium", "Denser medium to rarer medium", "Air to air"],
    answer: 2,
    explanation: "Total internal reflection happens when light moves from a denser medium (like glass) to a rarer medium (like air) at an angle greater than the critical angle, causing the light to be completely reflected back."
  },
  {
    question: "Which device is specifically used to measure electric current?",
    options: ["Ammeter", "Galvanometer", "Voltmeter", "Ohmmeter"],
    answer: 0,
    explanation: "An ammeter is specifically calibrated to measure current in amperes, while a voltmeter measures voltage, an ohmmeter measures resistance, and a galvanometer detects small currents but isn't calibrated for direct current measurement."
  },
  {
    question: "What is the approximate escape velocity from Earth's gravitational field?",
    options: ["15 km/s", "7.9 km/s", "11.2 km/s", "3×10⁸ m/s"],
    answer: 2,
    explanation: "Escape velocity is the minimum speed needed to break free from Earth's gravitational pull without further propulsion, calculated to be approximately 11.2 km/s. (7.9 km/s is actually the orbital velocity for low Earth orbit, a common distractor.)"
  },
  {
    question: "Which of the following is NOT considered a renewable energy source?",
    options: ["Coal", "Wind", "Solar", "Hydro"],
    answer: 0,
    explanation: "Coal is a fossil fuel formed over millions of years and is non-renewable, while solar, wind, and hydro are naturally replenished energy sources."
  },
  {
    question: "A wave has a wavelength of 2m and travels at 10 m/s. Calculate its frequency.",
    options: ["10 Hz", "20 Hz", "2 Hz", "5 Hz"],
    answer: 3,
    explanation: "Using v = fλ, frequency f = v/λ = 10/2 = 5 Hz."
  },
  {
    question: "What is the magnification produced by a plane mirror?",
    options: ["0", "0.5", "1", "2"],
    answer: 2,
    explanation: "A plane mirror produces an image of the same size as the object (magnification = image height/object height = 1), unlike curved mirrors which can magnify or diminish images."
  },
  {
    question: "Which statement correctly describes the law of conservation of energy?",
    options: ["Energy changes entirely to mass", "Total energy remains constant in an isolated system", "Energy can be destroyed", "Energy can be created"],
    answer: 1,
    explanation: "The law of conservation of energy states that energy cannot be created or destroyed, only transformed from one form to another — total energy in an isolated system remains constant."
  },
  {
    question: "The resistance of a wire depends on:",
    options: ["Voltage only", "Length only", "Area only", "Material, length, and cross-sectional area"],
    answer: 3,
    explanation: "Resistance is given by R = ρL/A, where ρ is resistivity (material-dependent), L is length, and A is cross-sectional area — all three factors combined determine resistance."
  },
  {
    question: "One horsepower is approximately equal to:",
    options: ["860 W", "550 W", "746 W", "1000 W"],
    answer: 2,
    explanation: "The standard conversion is 1 horsepower = 746 Watts, a commonly tested unit conversion in physics."
  },
  {
    question: "Radio waves are classified as:",
    options: ["Matter waves", "Mechanical waves", "Transverse electromagnetic waves", "Longitudinal waves"],
    answer: 2,
    explanation: "Radio waves are part of the electromagnetic spectrum, and all electromagnetic waves are transverse in nature, requiring no medium to travel (unlike mechanical waves)."
  },
  {
    question: "Which type of lens causes light rays to diverge (spread out)?",
    options: ["Cylindrical", "Convex", "Concave", "Plane"],
    answer: 2,
    explanation: "A concave (diverging) lens is thinner at the center than the edges, causing parallel light rays to spread outward, unlike convex lenses which converge light."
  },
  {
    question: "Nuclear fusion naturally occurs in:",
    options: ["The Sun", "X-ray tubes", "Nuclear reactors", "Atomic bombs"],
    answer: 0,
    explanation: "The Sun generates energy through nuclear fusion, where hydrogen nuclei combine to form helium under extreme temperature and pressure — nuclear reactors typically use fission, not fusion."
  },
  {
    question: "Pressure is defined by which formula?",
    options: ["W/t", "F/A", "m×a", "F×A"],
    answer: 1,
    explanation: "Pressure is defined as force per unit area (P = F/A), measured in Pascals (N/m²)."
  },
  {
    question: "Inertia of an object is directly dependent on its:",
    options: ["Force", "Mass", "Velocity", "Acceleration"],
    answer: 1,
    explanation: "Inertia is the resistance of an object to changes in its state of motion, and this resistance is directly proportional to the object's mass — greater mass means greater inertia."
  },
  {
    question: "What is the correct SI unit for specific heat capacity?",
    options: ["J/(kg·°C)", "J/kg", "J/°C", "W"],
    answer: 0,
    explanation: "Specific heat capacity is defined as the heat energy required to raise the temperature of 1kg of a substance by 1°C, giving units of J/(kg·°C) or J/(kg·K)."
  },
  {
    question: "A transformer operates using which type of current?",
    options: ["AC only", "Neither AC nor DC", "Both AC and DC", "DC only"],
    answer: 0,
    explanation: "Transformers work on the principle of electromagnetic induction, which requires a changing magnetic field — only alternating current (AC) produces this continuously changing field, not steady DC."
  },
  {
    question: "An alpha particle is essentially:",
    options: ["A single electron", "A helium nucleus", "A neutron", "A single proton"],
    answer: 1,
    explanation: "An alpha particle consists of 2 protons and 2 neutrons, making it identical to a helium nucleus (He²⁺), commonly emitted during radioactive decay."
  },
  {
    question: "What is the latent heat of fusion of ice?",
    options: ["4200 J/g", "80 J/g", "336 J/g", "2260 J/g"],
    answer: 2,
    explanation: "The latent heat of fusion of ice is approximately 336 J/g — the energy required to convert 1g of ice at 0°C to water at 0°C without temperature change. (80 cal/g is the value in calories, a common source of confusion; 2260 J/g is actually the latent heat of vaporization of water.)"
  },
  {
    question: "Which type of wave absolutely requires a medium to propagate?",
    options: ["Radio waves", "X-rays", "Light", "Sound"],
    answer: 3,
    explanation: "Sound waves are mechanical waves that require a physical medium (solid, liquid, or gas) to travel through vibrating particles, unlike electromagnetic waves (light, radio, X-rays) which can travel through a vacuum."
  },
  {
    question: "What is the correct SI unit for electric field strength?",
    options: ["V/m", "Both A and C are correct", "N/C", "J"],
    answer: 1,
    explanation: "Electric field strength can be correctly expressed in either N/C (force per unit charge) or V/m (potential difference per unit distance) — both units are dimensionally equivalent and interchangeable."
  },
  {
    question: "A 60W bulb is used for 5 hours. Calculate the energy consumed in watt-hours.",
    options: ["1.08 MJ", "300 Wh", "300 J", "12 kWh"],
    answer: 1,
    explanation: "Energy = Power × Time = 60W × 5h = 300 Wh (watt-hours)."
  },
  {
    question: "The path followed by a projectile under gravity (ignoring air resistance) is a:",
    options: ["Parabola", "Straight line", "Hyperbola", "Circle"],
    answer: 0,
    explanation: "Projectile motion combines constant horizontal velocity with uniformly accelerated vertical motion (due to gravity), producing a parabolic trajectory."
  },
  {
    question: "Which simple machine can have a mechanical advantage greater than 1?",
    options: ["All of the above", "Inclined plane", "Lever", "Pulley"],
    answer: 0,
    explanation: "All simple machines listed (levers, pulleys, inclined planes) can be configured to provide mechanical advantage greater than 1, depending on their specific arrangement (e.g., lever arm lengths, pulley systems, or incline angles)."
  },
  {
    question: "The density of water is:",
    options: ["1000 kg/m³", "9.8 (no unit)", "1 g/cm³", "Both B and C are correct"],
    answer: 3,
    explanation: "1000 kg/m³ and 1 g/cm³ represent the same density value for water, just expressed in different unit systems (SI vs CGS) — both are correct."
  },
  {
    question: "Which of the following materials is a good conductor of electricity?",
    options: ["Copper", "Glass", "Wood", "Plastic"],
    answer: 0,
    explanation: "Copper has free electrons that move easily through its structure, making it an excellent conductor, while wood, glass, and plastic are insulators that resist electron flow."
  },
  {
    question: "The Doppler effect is primarily used to explain changes in:",
    options: ["Pitch", "Speed", "Color", "Intensity"],
    answer: 0,
    explanation: "The Doppler effect describes the change in frequency (perceived as pitch for sound waves) of a wave as the source moves relative to an observer."
  },
  {
    question: "The beat frequency produced by two sound waves is calculated as:",
    options: ["f1 - f2 (absolute difference)", "f1 × f2", "f1/f2", "f1 + f2"],
    answer: 0,
    explanation: "Beat frequency is the absolute difference between two close frequencies (|f1 - f2|), resulting in periodic variations in amplitude/loudness."
  },
  {
    question: "The photoelectric effect provides evidence for which nature of light?",
    options: ["Wave nature", "Both wave and particle nature", "Particle nature", "Neither"],
    answer: 2,
    explanation: "The photoelectric effect demonstrates that light behaves as discrete packets of energy (photons), supporting the particle nature of light — this couldn't be explained by wave theory alone, leading to Einstein's quantum explanation."
  },
  {
    question: "A capacitor primarily stores:",
    options: ["Power", "Electric charge", "Voltage", "Current"],
    answer: 1,
    explanation: "A capacitor stores electrical energy in the form of separated electric charge on its plates, creating an electric field between them."
  },
  {
    question: "A satellite remains in orbit around Earth due to:",
    options: ["Gravitational force providing centripetal force", "Thrust from engines", "Centripetal force alone", "Both gravity and centripetal force acting independently"],
    answer: 0,
    explanation: "Gravity acts as the centripetal force that continuously pulls the satellite toward Earth, causing it to follow a curved orbital path rather than moving in a straight line — they're not independent forces but the same force serving this function."
  },
  {
    question: "What is the SI unit of moment of force (torque)?",
    options: ["J", "Nm", "Pa", "W"],
    answer: 1,
    explanation: "Moment of force (torque) is calculated as Force × perpendicular distance, giving units of Newton-meters (Nm) — dimensionally similar to Joules but conceptually distinct (torque vs energy)."
  },
  {
    question: "The boiling point of water at standard atmospheric pressure (1 atm) is:",
    options: ["100°C", "90°C", "212°F", "Both 100°C and 212°F"],
    answer: 3,
    explanation: "Water boils at 100°C, which is equivalent to 212°F using the conversion formula °F = (°C × 9/5) + 32 — both values correctly describe the same boiling point."
  },
  {
    question: "Heat transfer through a vacuum occurs only by:",
    options: ["Conduction", "Convection", "No heat transfer is possible", "Radiation"],
    answer: 3,
    explanation: "Radiation is the only heat transfer method that doesn't require a medium, traveling as electromagnetic waves — this is how the Sun's heat reaches Earth through the vacuum of space."
  },
  {
    question: "The refractive index of a medium is defined as:",
    options: ["v/c", "λf/c", "c/v", "nλ"],
    answer: 2,
    explanation: "Refractive index (n) is defined as the ratio of the speed of light in vacuum (c) to the speed of light in the medium (v): n = c/v."
  },
  {
    question: "The electron volt (eV) is a unit of:",
    options: ["Current", "Energy", "Charge", "Potential difference"],
    answer: 1,
    explanation: "An electron volt is defined as the energy gained by an electron accelerated through a potential difference of 1 volt — it's a unit of energy, commonly used in atomic and nuclear physics."
  },
  {
    question: "X-rays typically have wavelengths in the range of:",
    options: ["Greater than 1mm", "Greater than 1m", "400-700nm", "0.01-10nm"],
    answer: 3,
    explanation: "X-rays occupy a specific portion of the electromagnetic spectrum with very short wavelengths (0.01-10nm), much shorter than visible light (400-700nm) but longer than gamma rays."
  },
  {
    question: "A Geiger counter is specifically designed to detect:",
    options: ["Sound", "Radiation", "Light", "Heat"],
    answer: 1,
    explanation: "A Geiger counter detects ionizing radiation (alpha, beta, gamma particles) by measuring the ionization they cause in a gas-filled tube, commonly used in nuclear physics and radiation safety."
  },
];

const PHYSICSB = [
  {
    question: "The critical angle for total internal reflection depends on:",
    options: ["Amplitude of light", "The medium only", "Both the wavelength and the medium involved", "Wavelength only"],
    answer: 2,
    explanation: "The critical angle is determined by the refractive indices of the two media involved, and since refractive index itself varies slightly with wavelength (dispersion), both factors influence the critical angle."
  },
  {
    question: "Eddy currents, induced in conductors by changing magnetic fields, primarily cause:",
    options: ["Heating", "Light emission", "Cooling", "Magnetism"],
    answer: 0,
    explanation: "Eddy currents are circulating currents induced within a conductor due to changing magnetic flux, and due to the conductor's resistance, this current flow generates heat (energy loss), a principle used in induction heating and braking systems."
  },
  {
    question: "Lenz's Law, which determines the direction of induced current, is fundamentally based on:",
    options: ["Conservation of mass", "Conservation of energy", "Conservation of momentum", "Conservation of charge"],
    answer: 1,
    explanation: "Lenz's Law states that induced current opposes the change causing it — this direction ensures energy is conserved, preventing the creation of energy from nothing (which would violate the law of conservation of energy)."
  },
  {
    question: "A diode is an electronic component that allows current to flow:",
    options: ["Only during AC cycles", "In one direction only", "In no direction (blocks all current)", "In both directions equally"],
    answer: 1,
    explanation: "A diode is designed to allow current flow in only one direction (forward bias) while blocking flow in the reverse direction, making it useful for rectification (converting AC to DC)."
  },
  {
    question: "How many terminals does a standard transistor have?",
    options: ["4", "5", "2", "3"],
    answer: 3,
    explanation: "A standard bipolar junction transistor (BJT) has three terminals: the base, collector, and emitter, which control current flow for amplification or switching purposes."
  },
  {
    question: "A photocell (photovoltaic cell) primarily converts:",
    options: ["Sound to electricity", "None of the above", "Heat to light", "Light energy to electrical energy"],
    answer: 3,
    explanation: "A photocell uses the photoelectric or photovoltaic effect to convert light energy directly into electrical energy, commonly used in solar panels and light sensors."
  },
  {
    question: "What is the orbital period of a geostationary satellite?",
    options: ["48 hours", "7 days", "24 hours", "12 hours"],
    answer: 2,
    explanation: "A geostationary satellite orbits at a specific altitude and speed such that its orbital period exactly matches Earth's rotational period (24 hours), allowing it to remain fixed relative to a point on Earth's surface."
  },
  {
    question: "Capillarity (the rise or fall of liquid in a narrow tube) is caused by:",
    options: ["Viscosity", "Plasticity", "Elasticity", "Surface tension"],
    answer: 3,
    explanation: "Capillary action occurs due to surface tension and adhesive forces between the liquid and the tube's walls, causing the liquid to rise (or fall) in narrow spaces against gravity."
  },
  {
    question: "What is the correct SI unit for viscosity?",
    options: ["N/m", "W", "Pa·s", "J"],
    answer: 2,
    explanation: "Viscosity, which measures a fluid's resistance to flow, is measured in Pascal-seconds (Pa·s) in SI units, representing the relationship between shear stress and shear rate."
  },
  {
    question: "The elastic limit of a material refers to:",
    options: ["The point where permanent deformation occurs", "Maximum strain experienced", "The point where breaking occurs", "The point of maximum applied stress before permanent deformation begins"],
    answer: 3,
    explanation: "The elastic limit is the maximum stress a material can withstand while still returning to its original shape once the force is removed — beyond this point, permanent (plastic) deformation occurs."
  },
  {
    question: "The period of a simple pendulum primarily depends on:",
    options: ["The amplitude of swing", "The material of the bob", "The length of the pendulum", "The mass of the bob"],
    answer: 2,
    explanation: "The period of a simple pendulum is given by T = 2π√(L/g), showing dependence only on length (L) and gravitational acceleration (g) — not on mass or amplitude (for small oscillations)."
  },
  {
    question: "Resonance in a system occurs when:",
    options: ["The applied frequency is greater than the natural frequency", "The applied frequency equals the natural frequency of the system", "Frequency has no effect on resonance", "The applied frequency is less than the natural frequency"],
    answer: 1,
    explanation: "Resonance occurs when an external driving force matches the natural (resonant) frequency of a system, causing amplitude to increase dramatically due to constructive reinforcement of oscillations."
  },
  {
    question: "A thermos flask reduces heat loss by minimizing which methods of heat transfer?",
    options: ["Conduction only", "All three methods (conduction, convection, and radiation)", "Radiation only", "Convection only"],
    answer: 1,
    explanation: "A thermos flask uses a vacuum layer (prevents conduction and convection) and silvered/reflective walls (minimizes radiation), effectively reducing heat transfer through all three mechanisms."
  },
  {
    question: "Beta particles emitted during radioactive decay are essentially:",
    options: ["Photons", "Protons", "Neutrons", "High-energy electrons"],
    answer: 3,
    explanation: "Beta particles are high-energy, high-speed electrons (or positrons) emitted from the nucleus during beta decay, when a neutron converts into a proton (or vice versa)."
  },
  {
    question: "Gamma rays are characterized as:",
    options: ["Charged particles", "Heavy particles", "Slow-moving particles", "Uncharged electromagnetic radiation"],
    answer: 3,
    explanation: "Unlike alpha and beta particles, gamma rays are high-energy electromagnetic waves (photons) with no mass and no electric charge, making them highly penetrating."
  },
  {
    question: "The half-life of a specific radioactive substance is:",
    options: ["Variable and decreases over time", "Variable and increases over time", "A constant value unique to that substance", "Dependent on external temperature"],
    answer: 2,
    explanation: "Half-life is an intrinsic, constant property of a radioactive isotope, representing the time required for half of the sample to decay — it remains unchanged regardless of external conditions like temperature or pressure."
  },
  {
    question: "Which isotope is commonly used as fuel in nuclear reactors?",
    options: ["Oxygen-16", "Uranium-235", "Carbon-12", "Hydrogen-1"],
    answer: 1,
    explanation: "Uranium-235 is fissile, meaning its nucleus can be split by neutron bombardment to release large amounts of energy through nuclear fission, making it the primary fuel in most nuclear reactors."
  },
  {
    question: "Laser light is distinguished from ordinary light by being:",
    options: ["Coherent (waves in phase)", "Random in phase", "Incoherent", "Diffused in direction"],
    answer: 0,
    explanation: "Laser light is coherent, meaning all light waves are in phase with each other, both spatially and temporally — this property allows lasers to maintain focus over long distances, unlike ordinary incoherent light sources."
  },
  {
    question: "Fiber optic cables transmit light signals primarily using the principle of:",
    options: ["Total internal reflection (TIR)", "Refraction", "Diffraction", "Simple reflection"],
    answer: 0,
    explanation: "Fiber optics work by trapping light within the core of the fiber through total internal reflection, occurring when light hits the core-cladding boundary at an angle greater than the critical angle, allowing signals to travel long distances with minimal loss."
  },
  {
    question: "GPS (Global Positioning System) technology primarily relies on which type of waves for communication?",
    options: ["Ultraviolet waves", "Microwaves", "Infrared waves", "Standard radio waves"],
    answer: 1,
    explanation: "GPS satellites communicate using microwave signals (a subset of radio waves, but specifically in the microwave frequency range), which can penetrate the atmosphere effectively and provide precise timing signals for location triangulation."
  },
];

const PHYSICSC = [
  {
    question: "The dimensional formula for density is:",
    options: ["[ML³]", "[ML⁻²]", "[M⁻¹L³]", "[ML⁻³]"],
    answer: 3,
    explanation: "Density = mass/volume = M/L³, giving dimensions [ML⁻³]."
  },
  {
    question: "Which of the following is a fundamental (base) SI unit?",
    options: ["Watt", "Kilogram", "Newton", "Joule"],
    answer: 1,
    explanation: "The kilogram is one of the seven SI base units (mass), while Newton, Joule, and Watt are all derived units built from combinations of base units."
  },
  {
    question: "A measurement of 0.004050 has how many significant figures?",
    options: ["4", "5", "3", "7"],
    answer: 0,
    explanation: "Leading zeros are not significant, but the zero between non-zero digits (4050) and the trailing zero after the decimal point are significant — giving 4, 0, 5, 0 = 4 significant figures."
  },
  {
    question: "The dimensional formula for force is:",
    options: ["[MLT⁻²]", "[MLT⁻¹]", "[MLT⁻³]", "[ML²T⁻²]"],
    answer: 0,
    explanation: "Force = mass × acceleration = M × (LT⁻²) = [MLT⁻²]."
  },
  {
    question: "Which of the following pairs has the same dimensions?",
    options: ["Momentum and Force", "Work and Torque", "Work and Power", "Force and Pressure"],
    answer: 1,
    explanation: "Both work (F×d) and torque (F×d, perpendicular distance) have dimensions [ML²T⁻²], even though they represent physically different concepts."
  },
  {
    question: "A student measures the length of a table three times and gets 1.20m, 1.22m, and 1.21m. What is considered the precision of these measurements?",
    options: ["Low precision, high accuracy", "High precision, unknown accuracy", "Low precision, low accuracy", "High precision, high accuracy"],
    answer: 1,
    explanation: "Precision refers to how close repeated measurements are to each other (these values are very close, showing high precision), but accuracy (closeness to the true value) cannot be determined without knowing the actual length."
  },
  {
    question: "Convert 72 km/h to m/s.",
    options: ["7.2 m/s", "72 m/s", "20 m/s", "25.9 m/s"],
    answer: 2,
    explanation: "72 km/h × (1000m/1km) × (1h/3600s) = 72 × 1000/3600 = 20 m/s."
  },
  {
    question: "Which instrument is most suitable for measuring the diameter of a thin wire accurately?",
    options: ["Measuring tape", "Meter rule", "Screw gauge (micrometer)", "Vernier caliper"],
    answer: 2,
    explanation: "A screw gauge (micrometer) has the highest precision (up to 0.01mm) among these instruments, making it ideal for measuring very small dimensions like wire diameter."
  },
  {
    question: "The dimensional formula [ML²T⁻³] represents which physical quantity?",
    options: ["Power", "Force", "Energy", "Pressure"],
    answer: 0,
    explanation: "Power = Work/Time = (ML²T⁻²)/T = [ML²T⁻³], distinguishing it from energy which lacks the extra T⁻¹ term."
  },
  {
    question: "Two quantities can only be added or subtracted if they have:",
    options: ["The same numerical value", "The same dimensions", "The same unit system", "The same magnitude"],
    answer: 1,
    explanation: "The principle of dimensional homogeneity requires that only quantities with identical dimensions can be added or subtracted (e.g., you cannot add length to time)."
  },
  {
    question: "Which of the following is a scalar quantity?",
    options: ["Energy", "Momentum", "Velocity", "Acceleration"],
    answer: 0,
    explanation: "Energy has magnitude only and no specific direction, making it a scalar, unlike velocity, acceleration, and momentum, which are all vectors."
  },
  {
    question: "Two forces of 3N and 4N act perpendicular to each other. Find the resultant force.",
    options: ["12N", "5N", "7N", "1N"],
    answer: 1,
    explanation: "For perpendicular vectors, resultant = √(3² + 4²) = √(9+16) = √25 = 5N (Pythagorean theorem)."
  },
  {
    question: "The resultant of two vectors is maximum when the angle between them is:",
    options: ["90°", "45°", "0°", "180°"],
    answer: 2,
    explanation: "When two vectors point in the same direction (0° between them), their magnitudes add directly, producing the maximum possible resultant (R = A + B)."
  },
  {
    question: "A vector of magnitude 10 units is directed at 30° to the horizontal. What is its horizontal component?",
    options: ["5 units", "7.07 units", "8.66 units", "10 units"],
    answer: 2,
    explanation: "Horizontal component = magnitude × cos(θ) = 10 × cos(30°) = 10 × 0.866 = 8.66 units."
  },
  {
    question: "Which of the following statements about vector subtraction is correct?",
    options: ["A - B = B - A", "Vector subtraction always gives a scalar", "Vector subtraction is commutative", "A - B = -(B - A)"],
    answer: 3,
    explanation: "Vector subtraction is not commutative — reversing the order reverses the direction of the resultant vector, hence A - B = -(B - A)."
  },
  {
    question: "The resultant of two equal vectors acting at 120° to each other is:",
    options: ["Equal to one of the vectors", "Equal to twice one vector", "Equal to zero", "Equal to the square root of the sum"],
    answer: 0,
    explanation: "Using the resultant formula R = √(A² + B² + 2AB cos θ), with A = B and θ = 120° (cos120° = -0.5): R = √(A² + A² - A²) = √(A²) = A, equal to one vector's magnitude."
  },
  {
    question: "Which of these is NOT a vector quantity?",
    options: ["Speed", "Torque", "Weight", "Displacement"],
    answer: 0,
    explanation: "Speed is a scalar (magnitude only), unlike velocity which includes direction. Weight, displacement, and torque all have both magnitude and direction."
  },
  {
    question: "A boat's velocity relative to water is 5 m/s, and the water current flows at 3 m/s in the same direction. Find the boat's resultant velocity relative to the ground.",
    options: ["2 m/s", "8 m/s", "15 m/s", "4 m/s"],
    answer: 1,
    explanation: "When both velocities are in the same direction, they simply add: 5 + 3 = 8 m/s."
  },
  {
    question: "The process of finding the components of a vector along perpendicular axes is called:",
    options: ["Vector addition", "Scalar multiplication", "Vector resolution", "Vector multiplication"],
    answer: 2,
    explanation: "Vector resolution is the process of breaking down a single vector into two (or more) perpendicular components, commonly horizontal and vertical."
  },
  {
    question: "Two vectors A and B have magnitudes 6 and 8 respectively, acting at 180° to each other. Find their resultant.",
    options: ["10", "2", "48", "14"],
    answer: 1,
    explanation: "When vectors act in exactly opposite directions (180°), the resultant is simply the difference in magnitudes: 8 - 6 = 2."
  },
  {
    question: "A car accelerates uniformly from rest to 20 m/s in 5 seconds. Calculate its acceleration.",
    options: ["100 m/s²", "4 m/s²", "25 m/s²", "15 m/s²"],
    answer: 1,
    explanation: "a = (v-u)/t = (20-0)/5 = 4 m/s²."
  },
  {
    question: "Which equation of motion correctly relates final velocity, initial velocity, acceleration, and displacement (without time)?",
    options: ["s = vt", "s = ut + ½at²", "v² = u² + 2as", "v = u + at"],
    answer: 2,
    explanation: "This is the third equation of motion, specifically derived to relate velocity and displacement without requiring time as a variable."
  },
  {
    question: "An object is thrown vertically upward with an initial velocity of 20 m/s. How long does it take to reach maximum height? (g = 10 m/s²)",
    options: ["4s", "0.5s", "2s", "1s"],
    answer: 2,
    explanation: "At maximum height, final velocity = 0. Using v = u - gt: 0 = 20 - 10t, so t = 2s."
  },
  {
    question: "The area under a velocity-time graph represents:",
    options: ["Speed", "Displacement", "Force", "Acceleration"],
    answer: 1,
    explanation: "Since velocity × time = displacement, the area enclosed under a velocity-time graph gives the total displacement covered."
  },
  {
    question: "A body falls freely from rest. What is its velocity after falling for 3 seconds? (g = 10 m/s²)",
    options: ["3.33 m/s", "90 m/s", "13 m/s", "30 m/s"],
    answer: 3,
    explanation: "v = u + gt = 0 + (10×3) = 30 m/s."
  },
  {
    question: "The slope of a displacement-time graph represents:",
    options: ["Acceleration", "Force", "Velocity", "Distance"],
    answer: 2,
    explanation: "Velocity is the rate of change of displacement with time, which is exactly what the gradient (slope) of a displacement-time graph shows."
  },
  {
    question: "A stone is dropped from a height of 45m. How long does it take to hit the ground? (g = 10 m/s²)",
    options: ["3s", "2.12s", "4.5s", "9s"],
    answer: 0,
    explanation: "Using s = ½gt²: 45 = ½ × 10 × t², so 90 = 10t², t² = 9, t = 3s."
  },
  {
    question: "Which of the following best describes uniform acceleration?",
    options: ["Velocity changing at varying rates", "Increasing velocity at a constant rate", "Constant velocity", "Zero velocity throughout"],
    answer: 1,
    explanation: "Uniform acceleration means the velocity changes by equal amounts in equal time intervals — a constant rate of change, not necessarily just \"increasing\" (could also be uniformly decreasing/deceleration)."
  },
  {
    question: "A car travels at 30 m/s and decelerates uniformly to rest over 100m. Find the deceleration.",
    options: ["6 m/s²", "15 m/s²", "3 m/s²", "4.5 m/s²"],
    answer: 3,
    explanation: "Using v² = u² - 2as (deceleration): 0 = 30² - 2a(100), so 2a(100) = 900, a = 900/200 = 4.5 m/s²."
  },
  {
    question: "Which quantity remains constant for a body undergoing uniform circular motion at constant speed?",
    options: ["Acceleration", "Direction", "Speed", "Velocity"],
    answer: 2,
    explanation: "In uniform circular motion, speed (magnitude of velocity) remains constant, but velocity itself constantly changes direction, and acceleration (centripetal) is also constantly changing direction while maintaining constant magnitude."
  },
  {
    question: "Newton's First Law of Motion is fundamentally about:",
    options: ["Force and acceleration relationship", "Inertia", "Momentum conservation", "Action-reaction pairs"],
    answer: 1,
    explanation: "Newton's First Law (Law of Inertia) states that an object remains at rest or in uniform motion unless acted upon by an external force — this describes the concept of inertia."
  },
  {
    question: "A net force of 20N acts on a 4kg mass. Calculate the resulting acceleration.",
    options: ["16 m/s²", "5 m/s²", "24 m/s²", "80 m/s²"],
    answer: 1,
    explanation: "Using F = ma: a = F/m = 20/4 = 5 m/s²."
  },
  {
    question: "Newton's Third Law states that:",
    options: ["Force equals mass times acceleration", "Objects in motion stay in motion", "For every action, there is an equal and opposite reaction", "Momentum is conserved"],
    answer: 2,
    explanation: "This is the precise statement of Newton's Third Law, describing how forces always occur in equal and opposite pairs between interacting objects."
  },
  {
    question: "Which of the following best describes mass?",
    options: ["A measure of an object's inertia (amount of matter)", "Dependent on location", "The force of gravity acting on an object", "A vector quantity"],
    answer: 0,
    explanation: "Mass is a scalar measure of the amount of matter in an object and its resistance to acceleration (inertia) — unlike weight, mass does not change with location (like on the Moon vs Earth)."
  },
  {
    question: "A 10kg object rests on a frictionless surface. What horizontal force is needed to accelerate it at 3 m/s²?",
    options: ["13N", "30N", "7N", "3.33N"],
    answer: 1,
    explanation: "F = ma = 10 × 3 = 30N."
  },
  {
    question: "Which of these is an example of Newton's Third Law in action?",
    options: ["A ball rolling to a stop due to friction", "A car accelerating when the accelerator is pressed", "A book remaining stationary on a table", "A rocket propelling forward by expelling gas backward"],
    answer: 3,
    explanation: "Rocket propulsion demonstrates action-reaction pairs directly — the rocket pushes gas backward (action), and the gas pushes the rocket forward (reaction), following Newton's Third Law."
  },
  {
    question: "The weight of a 5kg object on Earth (g = 10 m/s²) is:",
    options: ["5N", "50N", "0.5N", "15N"],
    answer: 1,
    explanation: "Weight = mass × gravitational acceleration = 5 × 10 = 50N."
  },
  {
    question: "Which factor does NOT affect the frictional force between two surfaces?",
    options: ["Nature of the surfaces", "Normal force", "Area of contact", "Type of material"],
    answer: 2,
    explanation: "Contrary to intuition, frictional force is generally independent of the apparent contact area — it depends primarily on the normal force and the coefficient of friction (surface roughness/material)."
  },
  {
    question: "A 2kg ball moving at 5 m/s collides with a wall and bounces back at 3 m/s. If the collision lasts 0.1s, calculate the average force exerted by the wall.",
    options: ["160N", "40N", "16N", "100N"],
    answer: 0,
    explanation: "Using impulse-momentum theorem: F = m(v-u)/t = 2 × (-3 - 5)/0.1 = 2 × (-8)/0.1 = -160N (magnitude 160N, direction opposite to initial motion)."
  },
  {
    question: "According to Newton's Second Law, force is directly proportional to:",
    options: ["Mass only", "Rate of change of momentum", "Velocity only", "Displacement"],
    answer: 1,
    explanation: "Newton's Second Law in its most general form states that force equals the rate of change of momentum (F = dp/dt), which simplifies to F = ma when mass is constant."
  },
  {
    question: "Calculate the work done when a force of 50N moves an object 8m in the direction of the force.",
    options: ["58J", "400J", "42J", "6.25J"],
    answer: 1,
    explanation: "Work = Force × displacement × cos(θ) = 50 × 8 × cos(0°) = 50 × 8 × 1 = 400J."
  },
  {
    question: "The potential energy of a 2kg object raised to a height of 5m is: (g = 10 m/s²)",
    options: ["50J", "10J", "25J", "100J"],
    answer: 3,
    explanation: "PE = mgh = 2 × 10 × 5 = 100J."
  },
  {
    question: "Which of the following is NOT a form of mechanical energy?",
    options: ["Kinetic energy", "Elastic potential energy", "Chemical energy", "Potential energy"],
    answer: 2,
    explanation: "Chemical energy is stored in molecular bonds and released through chemical reactions — it is not classified as mechanical energy, unlike kinetic, gravitational potential, and elastic potential energy."
  },
  {
    question: "A machine does 500J of work in 10 seconds. Calculate its power output.",
    options: ["5000W", "510W", "5W", "50W"],
    answer: 3,
    explanation: "Power = Work/Time = 500/10 = 50W."
  },
  {
    question: "According to the work-energy theorem, the work done on an object equals:",
    options: ["Its momentum change", "Its change in kinetic energy", "Its change in potential energy", "Its total energy"],
    answer: 1,
    explanation: "The work-energy theorem states that the net work done on an object equals the change in its kinetic energy (W = ΔKE), a direct consequence of Newton's laws."
  },
  {
    question: "A spring with spring constant 200 N/m is compressed by 0.1m. Calculate the elastic potential energy stored.",
    options: ["1J", "200J", "2J", "20J"],
    answer: 0,
    explanation: "Elastic PE = ½kx² = ½ × 200 × (0.1)² = ½ × 200 × 0.01 = 1J."
  },
  {
    question: "Which statement about energy conversion is correct in a hydroelectric power plant?",
    options: ["Nuclear energy converts to mechanical energy", "Gravitational PE converts to kinetic energy, then to electrical energy", "Solar energy converts to thermal energy", "Chemical energy converts to electrical energy"],
    answer: 1,
    explanation: "In hydroelectric plants, water stored at height has gravitational potential energy, which converts to kinetic energy as it falls, turning turbines to generate electrical energy."
  },
  {
    question: "A 60kg person climbs a staircase of height 4m in 8 seconds. Calculate the power exerted. (g = 10 m/s²)",
    options: ["30W", "300W", "240W", "480W"],
    answer: 1,
    explanation: "Power = Work/Time = (mgh)/t = (60×10×4)/8 = 2400/8 = 300W."
  },
  {
    question: "The efficiency of a machine is defined as:",
    options: ["The ratio of input work to output work", "Total energy output", "The ratio of useful output energy to total input energy", "Total energy input"],
    answer: 2,
    explanation: "Efficiency = (Useful output energy/Total input energy) × 100%, measuring how effectively a machine converts input energy into useful work, accounting for losses (like friction/heat)."
  },
  {
    question: "A car of mass 1000kg moving at 20 m/s has kinetic energy equal to:",
    options: ["400,000J", "20,000J", "200,000J", "100,000J"],
    answer: 2,
    explanation: "KE = ½mv² = ½ × 1000 × 20² = ½ × 1000 × 400 = 200,000J."
  },
];

const PHYSICSD = [
  {
    question: "A 3kg object moving at 4 m/s collides and sticks to a stationary 1kg object. Calculate their common velocity after collision.",
    options: ["1 m/s", "3 m/s", "2 m/s", "4 m/s"],
    answer: 1,
    explanation: "Using conservation of momentum: m1u1 = (m1+m2)v → 3×4 = (3+1)v → 12 = 4v → v = 3 m/s."
  },
  {
    question: "Which type of collision conserves both momentum and kinetic energy?",
    options: ["Perfectly inelastic collision", "Elastic collision", "Explosive collision", "Inelastic collision"],
    answer: 1,
    explanation: "In an elastic collision, both momentum and kinetic energy are conserved, unlike inelastic collisions where kinetic energy is lost (converted to heat, sound, or deformation)."
  },
  {
    question: "A gun of mass 2kg fires a 0.01kg bullet at 400 m/s. Calculate the recoil velocity of the gun.",
    options: ["8 m/s", "2 m/s", "0.5 m/s", "4 m/s"],
    answer: 1,
    explanation: "Using conservation of momentum (initial momentum = 0): m(gun)×v(gun) = m(bullet)×v(bullet) → 2×v = 0.01×400 → v = 4/2 = 2 m/s."
  },
  {
    question: "Momentum is defined as the product of:",
    options: ["Force and time", "Force and displacement", "Mass and velocity", "Mass and displacement"],
    answer: 2,
    explanation: "Momentum (p) = mass × velocity (p = mv), a vector quantity that indicates the quantity of motion an object possesses."
  },
  {
    question: "In a perfectly inelastic collision, what happens to the colliding objects?",
    options: ["They stick together and move with a common velocity", "They exchange velocities", "They separate with equal speeds", "They bounce back with the same speed"],
    answer: 0,
    explanation: "A perfectly inelastic collision is defined by the colliding objects sticking together after impact, moving with a single common velocity, and kinetic energy is not conserved."
  },
  {
    question: "Two objects of masses 5kg and 3kg move toward each other at 4 m/s and 2 m/s respectively. Calculate the total momentum of the system before collision (taking the 5kg object's direction as positive).",
    options: ["20 kg·m/s", "6 kg·m/s", "14 kg·m/s", "26 kg·m/s"],
    answer: 2,
    explanation: "Total momentum = (5×4) + (3×(-2)) = 20 - 6 = 14 kg·m/s (the second object moves in the opposite direction, hence negative)."
  },
  {
    question: "Impulse is equal to:",
    options: ["Force times distance", "Force divided by time", "Change in momentum", "Mass times acceleration"],
    answer: 2,
    explanation: "Impulse (J = FΔt) is defined as the product of force and the time it acts, and by Newton's Second Law, this equals the change in momentum of the object (J = Δp)."
  },
  {
    question: "In an elastic collision between two objects of equal mass, where one is initially at rest, what happens after collision?",
    options: ["Both objects move together", "The moving object stops, and the stationary object moves with the initial velocity", "Both objects move with half the initial velocity", "The moving object continues, and the stationary one remains at rest"],
    answer: 1,
    explanation: "For elastic collisions between equal masses (one initially at rest), a complete transfer of velocity occurs — the incoming object stops, and the target object moves off with the exact initial velocity, conserving both momentum and kinetic energy."
  },
  {
    question: "A ball of mass 0.5kg hits a wall at 6 m/s and bounces back at 4 m/s. Calculate the change in momentum.",
    options: ["5 kg·m/s", "1 kg·m/s", "2 kg·m/s", "3 kg·m/s"],
    answer: 0,
    explanation: "Change in momentum = m(v-u) = 0.5 × (-4 - 6) = 0.5 × (-10) = -5 kg·m/s (magnitude 5 kg·m/s, direction reversed)."
  },
  {
    question: "The law of conservation of momentum applies to:",
    options: ["All systems regardless of external forces", "Isolated systems with no external forces", "Only elastic collisions", "Only inelastic collisions"],
    answer: 1,
    explanation: "Momentum is conserved specifically in isolated (closed) systems where no external net force acts — this applies to both elastic and inelastic collisions as long as the system remains isolated."
  },
  {
    question: "The centripetal force acting on an object in circular motion is directed:",
    options: ["Toward the center of the circle", "In the direction of motion", "Away from the center", "Tangent to the circle"],
    answer: 0,
    explanation: "Centripetal force always acts toward the center of the circular path, continuously changing the direction of velocity to maintain circular motion (without it, the object would move in a straight line)."
  },
  {
    question: "A 2kg object moves in a circle of radius 0.5m at 4 m/s. Calculate the centripetal force required.",
    options: ["8N", "4N", "16N", "64N"],
    answer: 3,
    explanation: "Fc = mv²/r = 2 × 4²/0.5 = 2 × 16/0.5 = 32/0.5 = 64N."
  },
  {
    question: "Which of the following best describes angular velocity?",
    options: ["Speed of an object", "Rate of change of angular displacement", "Force causing rotation", "Distance traveled per unit time"],
    answer: 1,
    explanation: "Angular velocity (ω) measures how quickly an object rotates or revolves, defined as the rate of change of angular displacement with respect to time."
  },
  {
    question: "For a car navigating a banked curve, the banking angle helps provide:",
    options: ["Reduced gravitational force", "Reduced speed", "Increased friction", "Additional centripetal force component"],
    answer: 3,
    explanation: "Banking a curve tilts the normal force so that a component of it contributes to the centripetal force needed for circular motion, reducing dependency on friction alone (especially useful at high speeds)."
  },
  {
    question: "An object moving in uniform circular motion has constant:",
    options: ["Velocity", "Acceleration", "Speed", "Displacement"],
    answer: 2,
    explanation: "In uniform circular motion, speed remains constant, but velocity changes continuously due to changing direction, and acceleration (centripetal) also constantly changes direction while maintaining constant magnitude."
  },
  {
    question: "The relationship between linear velocity (v) and angular velocity (ω) for circular motion is given by:",
    options: ["v = ω²r", "v = ωr", "v = ω/r", "v = ω + r"],
    answer: 1,
    explanation: "Linear velocity equals angular velocity multiplied by the radius of the circular path (v = ωr), showing points farther from the center move faster for the same angular velocity."
  },
  {
    question: "A car takes a turn too fast on a flat road and skids outward. This happens because:",
    options: ["There is no centripetal force", "Friction force is too high", "The car's mass increased", "Centripetal force exceeds available friction"],
    answer: 3,
    explanation: "When the required centripetal force (based on speed and turn radius) exceeds the maximum static friction available between tires and road, the car cannot maintain the circular path and skids outward."
  },
  {
    question: "Calculate the angular velocity of a wheel completing 10 revolutions in 5 seconds.",
    options: ["10π rad/s", "20π rad/s", "2π rad/s", "4π rad/s"],
    answer: 3,
    explanation: "ω = 2πn/t = 2π×10/5 = 20π/5 = 4π rad/s."
  },
  {
    question: "Which force provides the centripetal force for satellites orbiting Earth?",
    options: ["Frictional force", "Gravitational force", "Normal force", "Tension"],
    answer: 1,
    explanation: "Earth's gravitational pull on the satellite acts as the centripetal force, continuously pulling it toward Earth's center and maintaining its curved orbital path."
  },
  {
    question: "In circular motion, if the radius doubles while speed remains constant, the centripetal force:",
    options: ["Quadruples", "Remains the same", "Doubles", "Halves"],
    answer: 3,
    explanation: "Since Fc = mv²/r, and force is inversely proportional to radius (with v and m constant), doubling r results in the force being halved."
  },
  {
    question: "According to Newton's Law of Universal Gravitation, gravitational force between two masses is:",
    options: ["Directly proportional to distance", "Independent of mass", "Directly proportional to the square of distance", "Inversely proportional to the square of the distance between them"],
    answer: 3,
    explanation: "Newton's Law states F = Gm1m2/r², showing gravitational force decreases with the square of the distance between two masses (inverse square law)."
  },
  {
    question: "If the distance between two masses is tripled, the gravitational force between them becomes:",
    options: ["Nine times weaker", "Three times stronger", "Three times weaker", "Nine times stronger"],
    answer: 0,
    explanation: "Since F ∝ 1/r², tripling the distance (r→3r) means the force becomes 1/3² = 1/9 of the original value — nine times weaker."
  },
  {
    question: "The gravitational field strength on Earth's surface is approximately:",
    options: ["9.8 N/kg", "100 N/kg", "3×10⁸ N/kg", "6.67×10⁻¹¹ N/kg"],
    answer: 0,
    explanation: "Gravitational field strength (g) at Earth's surface equals approximately 9.8 N/kg, numerically identical to the acceleration due to gravity (9.8 m/s²)."
  },
  {
    question: "Which of the following statements about gravitational potential energy is correct?",
    options: ["It increases as objects move closer together", "It is always positive", "It becomes zero at infinite distance and negative closer to the mass", "It only depends on mass, not distance"],
    answer: 2,
    explanation: "Gravitational potential energy is conventionally defined as zero at infinite separation and becomes increasingly negative as objects move closer together (since gravity does positive work as objects approach)."
  },
  {
    question: "Two objects of mass 4kg and 6kg are separated by 2m. Calculate the gravitational force between them. (G = 6.67×10⁻¹¹ Nm²/kg²)",
    options: ["2×10⁻¹⁰ N", "8×10⁻¹⁰ N", "4×10⁻¹¹ N", "4×10⁻¹⁰ N"],
    answer: 3,
    explanation: "F = Gm1m2/r² = (6.67×10⁻¹¹ × 4 × 6)/2² = (6.67×10⁻¹¹ × 24)/4 = 1.6×10⁻⁹/4 ≈ 4×10⁻¹⁰ N."
  },
  {
    question: "Why do astronauts experience \"weightlessness\" in orbit around Earth?",
    options: ["They are in continuous free fall along with their spacecraft", "There is no gravity in space", "Gravity is cancelled by centrifugal force", "Earth's gravitational pull doesn't reach that far"],
    answer: 0,
    explanation: "Astronauts and their spacecraft are both in continuous free fall toward Earth (following the curved orbital path), so there's no normal force from a surface pushing back on them, creating the sensation of weightlessness — not because gravity is absent."
  },
  {
    question: "Kepler's Third Law relates a planet's orbital period to:",
    options: ["Its distance from the sun (specifically the cube of semi-major axis)", "Its rotational speed", "Its mass only", "Its gravitational field strength"],
    answer: 0,
    explanation: "Kepler's Third Law states that the square of a planet's orbital period is proportional to the cube of its semi-major axis (average distance from the sun): T² ∝ r³."
  },
  {
    question: "The value of gravitational acceleration (g) decreases as altitude increases because:",
    options: ["Earth's rotation speeds up", "Air resistance increases", "Distance from Earth's center increases, weakening gravitational pull", "Mass of the object decreases"],
    answer: 2,
    explanation: "Since gravitational force follows an inverse square law with distance from Earth's center, increasing altitude increases this distance, thereby reducing the gravitational acceleration experienced."
  },
  {
    question: "The universal gravitational constant (G) has units of:",
    options: ["m/s²", "N/kg", "kg/m³", "Nm²/kg²"],
    answer: 3,
    explanation: "G is derived from rearranging F = Gm1m2/r² to G = Fr²/m1m2, giving units of N·m²/kg² (Newton meter squared per kilogram squared)."
  },
  {
    question: "If Earth's mass suddenly doubled while its radius remained the same, the gravitational acceleration at its surface would:",
    options: ["Quadruple", "Remain the same", "Halve", "Double"],
    answer: 3,
    explanation: "Since g = GM/r², and g is directly proportional to mass (with radius constant), doubling Earth's mass would directly double the gravitational acceleration."
  },
  {
    question: "Young's modulus is a measure of a material's:",
    options: ["Melting point", "Stiffness/elasticity in the direction of applied force", "Thermal conductivity", "Density"],
    answer: 1,
    explanation: "Young's modulus (E = stress/strain) quantifies how much a material resists deformation under tensile or compressive stress, essentially measuring its stiffness."
  },
  {
    question: "A wire of original length 2m stretches to 2.02m under tension. Calculate the strain.",
    options: ["0.01", "0.1", "1.01", "0.02"],
    answer: 0,
    explanation: "Strain = extension/original length = 0.02/2 = 0.01 (dimensionless ratio)."
  },
  {
    question: "Which state of matter has a definite volume but no definite shape?",
    options: ["Gas", "Solid", "Liquid", "Plasma"],
    answer: 2,
    explanation: "Liquids maintain a fixed volume (particles are closely packed) but take the shape of their container due to their ability to flow, unlike solids (fixed shape and volume) or gases (neither fixed)."
  },
  {
    question: "Surface tension in liquids is primarily caused by:",
    options: ["Temperature differences", "Cohesive forces between liquid molecules at the surface", "Atmospheric pressure", "Gravitational forces between molecules"],
    answer: 1,
    explanation: "Surface tension arises because surface molecules experience net inward cohesive forces (unlike molecules within the bulk liquid), creating a \"skin-like\" effect that minimizes surface area."
  },
  {
    question: "The elastic limit of a material refers to the point beyond which:",
    options: ["Stress becomes zero", "The material breaks immediately", "The material returns to its original shape", "Permanent deformation occurs"],
    answer: 3,
    explanation: "Beyond the elastic limit, a material no longer returns to its original shape when the deforming force is removed — permanent (plastic) deformation occurs."
  },
  {
    question: "Which factor does NOT affect the viscosity of a liquid?",
    options: ["Nature of the liquid", "Color of the liquid", "Intermolecular forces", "Temperature"],
    answer: 1,
    explanation: "Viscosity depends on molecular properties like intermolecular forces, temperature, and the liquid's inherent nature — color is a visual property unrelated to flow resistance."
  },
  {
    question: "A force of 500N is applied to a wire with cross-sectional area 2×10⁻⁶ m². Calculate the stress.",
    options: ["2.5×10⁸ N/m²", "2.5×10⁻⁹ N/m²", "1000 N/m²", "250 N/m²"],
    answer: 0,
    explanation: "Stress = Force/Area = 500/(2×10⁻⁶) = 2.5×10⁸ N/m²."
  },
  {
    question: "Which of the following best describes Hooke's Law?",
    options: ["Stress is inversely proportional to strain", "Extension is directly proportional to applied force (within elastic limit)", "Force equals mass times acceleration", "Pressure equals force over area"],
    answer: 1,
    explanation: "Hooke's Law states that within the elastic limit, the extension (or compression) of a material is directly proportional to the applied force (F = kx), where k is the spring/force constant."
  },
  {
    question: "Capillary rise in a narrow tube is inversely proportional to:",
    options: ["Surface tension", "Density of the liquid", "Angle of contact", "Radius of the tube"],
    answer: 3,
    explanation: "According to the capillary rise formula (h = 2Tcosθ/rρg), the height of liquid rise is inversely proportional to the radius of the tube — narrower tubes cause greater capillary rise."
  },
  {
    question: "A material that returns to its original shape after the removing deforming force is called:",
    options: ["Elastic", "Brittle", "Plastic", "Ductile"],
    answer: 0,
    explanation: "Elasticity is specifically the property of a material to return to its original shape and size after the deforming force is removed, as long as the elastic limit isn't exceeded."
  },
  {
    question: "Calculate the heat energy required to raise the temperature of 2kg of water by 10°C. (Specific heat capacity of water = 4200 J/kg°C)",
    options: ["8400 J", "42,000 J", "840 J", "84,000 J"],
    answer: 3,
    explanation: "Q = mcΔT = 2 × 4200 × 10 = 84,000 J."
  },
  {
    question: "Which temperature scale has no negative values under normal physical conditions?",
    options: ["Fahrenheit", "Celsius", "Both A and B", "Kelvin"],
    answer: 3,
    explanation: "The Kelvin scale is an absolute temperature scale starting at absolute zero (0K = -273°C), the theoretical point where all molecular motion ceases, making negative Kelvin values physically impossible under normal conditions."
  },
  {
    question: "Convert 25°C to Kelvin.",
    options: ["25K", "248K", "273K", "298K"],
    answer: 3,
    explanation: "K = °C + 273 = 25 + 273 = 298K."
  },
  {
    question: "Thermal expansion in solids occurs because:",
    options: ["Molecules gain mass", "Increased kinetic energy causes molecules to vibrate more and occupy more space", "Density increases with temperature", "Molecules increase in size"],
    answer: 1,
    explanation: "As temperature increases, molecules gain kinetic energy and vibrate more vigorously, increasing the average distance between them, causing the material to expand — the molecules themselves don't change size or mass."
  },
  {
    question: "The specific latent heat of vaporization is defined as:",
    options: ["Heat lost during cooling", "Heat required to raise temperature by 1°C", "Heat required to melt 1kg of solid", "Heat required to change 1kg of substance from liquid to gas without temperature change"],
    answer: 3,
    explanation: "Specific latent heat of vaporization specifically refers to the energy needed to convert 1kg of a liquid into vapor at constant temperature (at its boiling point), without any temperature change during the phase transition."
  },
  {
    question: "Calculate the heat required to melt 0.5kg of ice completely. (Latent heat of fusion of ice = 336,000 J/kg)",
    options: ["336,000 J", "67,200 J", "168,000 J", "672,000 J"],
    answer: 2,
    explanation: "Q = mL = 0.5 × 336,000 = 168,000 J."
  },
  {
    question: "Which method of heat transfer involves the actual movement of heated particles/fluid?",
    options: ["Conduction", "Radiation", "Convection", "Insulation"],
    answer: 2,
    explanation: "Convection involves the physical movement of heated fluid particles (liquid or gas), creating currents that transfer heat, unlike conduction (particle vibration) or radiation (electromagnetic waves)."
  },
  {
    question: "A metal rod expands when heated due to increased:",
    options: ["Density", "Mass", "Molecular vibration and spacing", "Chemical composition"],
    answer: 2,
    explanation: "Heating increases the kinetic energy of atoms in the metal, causing them to vibrate more and effectively increase the average spacing between atoms, resulting in overall linear/volume expansion."
  },
  {
    question: "Two bodies are in thermal equilibrium when:",
    options: ["They have the same specific heat capacity", "They have the same mass", "They are touching each other", "They have the same temperature and no net heat flows between them"],
    answer: 3,
    explanation: "Thermal equilibrium is achieved when two bodies reach the same temperature, at which point there is no net heat exchange between them — this is the foundation of the Zeroth Law of Thermodynamics."
  },
  {
    question: "Which of the following substances has the highest specific heat capacity, making it useful for cooling systems?",
    options: ["Aluminum", "Copper", "Iron", "Water"],
    answer: 3,
    explanation: "Water has an unusually high specific heat capacity (4200 J/kg°C) compared to most metals, allowing it to absorb significant heat energy with relatively small temperature changes — ideal for cooling applications like car radiators."
  },
];

const PHYSICSE = [
  {
    question: "According to Boyle's Law, at constant temperature, the pressure of a gas is:",
    options: ["Independent of volume", "Inversely proportional to volume", "Proportional to the square of volume", "Directly proportional to volume"],
    answer: 1,
    explanation: "Boyle's Law states that at constant temperature, pressure and volume of a fixed mass of gas are inversely proportional (PV = constant) — as volume decreases, pressure increases."
  },
  {
    question: "A gas occupies 4L at a pressure of 200kPa. If the pressure increases to 400kPa at constant temperature, calculate the new volume.",
    options: ["8L", "1L", "2L", "4L"],
    answer: 2,
    explanation: "Using Boyle's Law (P1V1 = P2V2): 200×4 = 400×V2, so V2 = 800/400 = 2L."
  },
  {
    question: "Charles' Law states that at constant pressure, the volume of a gas is:",
    options: ["Inversely proportional to pressure", "Inversely proportional to temperature (in Kelvin)", "Directly proportional to temperature (in Kelvin)", "Independent of temperature"],
    answer: 2,
    explanation: "Charles' Law establishes that at constant pressure, volume and absolute temperature (Kelvin) are directly proportional (V/T = constant) — as temperature increases, volume increases proportionally."
  },
  {
    question: "A gas at 27°C occupies 2L. If heated to 127°C at constant pressure, calculate the new volume.",
    options: ["1.5L", "9.4L", "4L", "2.67L"],
    answer: 3,
    explanation: "Convert to Kelvin: T1=300K, T2=400K. Using V1/T1 = V2/T2: 2/300 = V2/400, so V2 = (2×400)/300 = 2.67L."
  },
  {
    question: "The ideal gas equation is represented as:",
    options: ["PV² = nRT", "P = nRT/V²", "PV = nRT", "P/V = nRT"],
    answer: 2,
    explanation: "The ideal gas law combines Boyle's, Charles', and Avogadro's laws into PV = nRT, where n is moles, R is the gas constant, and T is absolute temperature."
  },
  {
    question: "Which of the following best describes an ideal gas?",
    options: ["Any real gas under normal conditions", "A gas that behaves differently at every temperature", "A gas at very high pressure", "A gas with negligible intermolecular forces and negligible molecular volume"],
    answer: 3,
    explanation: "An ideal gas is a theoretical model assuming no intermolecular forces and negligible particle volume compared to the container — real gases only approximate this behavior under specific conditions (low pressure, high temperature)."
  },
  {
    question: "At constant volume, according to Gay-Lussac's Law, pressure is:",
    options: ["Independent of temperature", "Directly proportional to temperature (Kelvin)", "Inversely proportional to volume", "Inversely proportional to temperature"],
    answer: 1,
    explanation: "Gay-Lussac's Law states that at constant volume, pressure is directly proportional to absolute temperature (P/T = constant) — heating a sealed container increases pressure proportionally."
  },
  {
    question: "A sealed gas container at 2 atm and 300K is heated to 600K at constant volume. Calculate the new pressure.",
    options: ["8 atm", "2 atm", "1 atm", "4 atm"],
    answer: 3,
    explanation: "Using Gay-Lussac's Law (P1/T1 = P2/T2): 2/300 = P2/600, so P2 = (2×600)/300 = 4 atm."
  },
  {
    question: "Avogadro's Law states that equal volumes of gases at the same temperature and pressure contain:",
    options: ["Equal densities", "Equal masses", "Equal number of molecules", "Different numbers of molecules depending on the gas"],
    answer: 2,
    explanation: "Avogadro's Law establishes that under identical temperature and pressure conditions, equal volumes of any gas contain the same number of molecules, regardless of the gas's identity."
  },
  {
    question: "Real gases deviate from ideal gas behavior most significantly under conditions of:",
    options: ["Standard temperature and pressure", "Low pressure and high temperature", "High pressure and low temperature", "Any pressure and temperature equally"],
    answer: 2,
    explanation: "At high pressure (molecules forced closer, increasing intermolecular forces) and low temperature (reduced kinetic energy, allowing attractive forces to matter more), real gases deviate most from ideal behavior."
  },
  {
    question: "The distance between two consecutive crests of a wave is called:",
    options: ["Amplitude", "Frequency", "Period", "Wavelength"],
    answer: 3,
    explanation: "Wavelength is defined as the distance between two successive points in phase on a wave, such as consecutive crests or troughs."
  },
  {
    question: "A wave has a frequency of 50Hz and wavelength of 4m. Calculate its speed.",
    options: ["200 m/s", "54 m/s", "12.5 m/s", "46 m/s"],
    answer: 0,
    explanation: "Wave speed = frequency × wavelength = 50 × 4 = 200 m/s."
  },
  {
    question: "Which type of wave requires particles to vibrate parallel to the direction of wave propagation?",
    options: ["Surface wave", "Transverse wave", "Electromagnetic wave", "Longitudinal wave"],
    answer: 3,
    explanation: "In longitudinal waves (like sound), particle vibration occurs parallel to (along) the direction of wave travel, creating compressions and rarefactions, unlike transverse waves where vibration is perpendicular."
  },
  {
    question: "The time taken for one complete wave cycle is called:",
    options: ["Wavelength", "Frequency", "Period", "Amplitude"],
    answer: 2,
    explanation: "Period (T) is defined as the time required for one complete oscillation or wave cycle, related to frequency by T = 1/f."
  },
  {
    question: "If the frequency of a wave increases while speed remains constant, the wavelength:",
    options: ["Remains the same", "Decreases", "Increases", "Becomes zero"],
    answer: 1,
    explanation: "Since v = fλ (speed = frequency × wavelength), with constant speed, frequency and wavelength are inversely proportional — increasing frequency decreases wavelength."
  },
  {
    question: "Which phenomenon occurs when two waves overlap and their amplitudes combine?",
    options: ["Interference", "Reflection", "Diffraction", "Refraction"],
    answer: 0,
    explanation: "Interference occurs when two or more waves meet and superpose, resulting in constructive interference (amplitudes add) or destructive interference (amplitudes cancel)."
  },
  {
    question: "A wave completes 20 oscillations in 4 seconds. Calculate its frequency.",
    options: ["5 Hz", "80 Hz", "0.2 Hz", "24 Hz"],
    answer: 0,
    explanation: "Frequency = number of oscillations/time = 20/4 = 5 Hz."
  },
  {
    question: "Diffraction of waves is most pronounced when:",
    options: ["The wave has high frequency only", "The wavelength is comparable to the size of the obstacle/gap", "The wavelength is much smaller than the obstacle/gap", "Wave speed is very high"],
    answer: 1,
    explanation: "Diffraction (bending of waves around obstacles or through gaps) becomes most noticeable when the wavelength is similar in size to the obstacle or aperture the wave encounters."
  },
  {
    question: "Which of the following is a property unique to transverse waves (not longitudinal)?",
    options: ["They require a medium", "They transfer energy", "They can be polarized", "They can be reflected"],
    answer: 2,
    explanation: "Polarization (restricting oscillation to a single plane) is a property specific to transverse waves because their vibration is perpendicular to propagation — longitudinal waves vibrate along the direction of travel and cannot be polarized."
  },
  {
    question: "The amplitude of a wave is related to:",
    options: ["Wave speed", "Wavelength", "Wave frequency", "Energy/intensity carried by the wave"],
    answer: 3,
    explanation: "Amplitude represents the maximum displacement of particles from their rest position, and it's directly related to the energy (and intensity) the wave carries — larger amplitude means more energy."
  },
  {
    question: "The speed of sound is generally fastest in which medium?",
    options: ["Solids (like steel)", "Water", "Vacuum", "Air"],
    answer: 0,
    explanation: "Sound travels fastest through solids due to closely packed particles allowing rapid transmission of vibrations, slower through liquids, and slowest through gases (air) — and cannot travel through a vacuum at all."
  },
  {
    question: "The loudness of sound is primarily determined by its:",
    options: ["Frequency", "Speed", "Wavelength", "Amplitude"],
    answer: 3,
    explanation: "Loudness is directly related to the amplitude of sound waves — larger amplitude means more energy carried, perceived as louder sound."
  },
  {
    question: "The pitch of a sound is determined by its:",
    options: ["Speed", "Amplitude", "Wavelength", "Frequency"],
    answer: 3,
    explanation: "Pitch corresponds to frequency — higher frequency sound waves are perceived as higher pitched, and lower frequency as lower pitched."
  },
  {
    question: "The audible range of frequencies for human hearing is approximately:",
    options: ["20,000Hz to 200,000Hz", "20Hz to 20,000Hz", "200Hz to 2000Hz", "2Hz to 200Hz"],
    answer: 1,
    explanation: "The typical human audible range spans from 20Hz (lower limit) to 20,000Hz (20kHz, upper limit), though this range can decrease with age."
  },
  {
    question: "Sound waves with frequency above 20,000Hz are called:",
    options: ["Radio waves", "Microwaves", "Ultrasonic waves", "Infrasonic waves"],
    answer: 2,
    explanation: "Ultrasonic waves have frequencies above the human hearing threshold (>20,000Hz), used in applications like medical imaging and sonar."
  },
  {
    question: "An echo is produced due to:",
    options: ["Refraction of sound", "Diffraction of sound", "Absorption of sound", "Reflection of sound waves off a surface"],
    answer: 3,
    explanation: "An echo occurs when sound waves reflect off a hard surface (like a wall or cliff) and return to the listener after a time delay, perceived as a repeated sound."
  },
  {
    question: "The minimum distance required to hear a distinct echo (assuming speed of sound = 340 m/s) is approximately:",
    options: ["1m", "340m", "17m", "680m"],
    answer: 2,
    explanation: "For a distinct echo to be heard (minimum time gap of 0.1s for human ear to distinguish), distance = (speed × time)/2 = (340×0.1)/2 = 17m (sound travels to the surface and back)."
  },
  {
    question: "Resonance in sound occurs when:",
    options: ["Sound waves cancel each other out", "Sound travels through a vacuum", "An object vibrates at its natural frequency due to an external periodic force matching that frequency", "Two different frequencies combine"],
    answer: 2,
    explanation: "Resonance occurs when an external vibrating source matches the natural frequency of an object, causing it to vibrate with dramatically increased amplitude (e.g., a singer shattering a glass by matching its resonant frequency)."
  },
  {
    question: "The Doppler effect causes an apparent change in frequency when:",
    options: ["Sound reflects off a surface", "The medium changes temperature", "Two sound waves interfere", "There is relative motion between the sound source and observer"],
    answer: 3,
    explanation: "The Doppler effect describes the apparent shift in frequency (and pitch) perceived by an observer when there's relative motion between the sound source and the observer (e.g., a siren sounding higher-pitched as it approaches, lower as it recedes)."
  },
  {
    question: "Beats are produced when two sound waves of:",
    options: ["Very different frequencies combine", "Same amplitude but different speeds combine", "Slightly different frequencies interfere, creating periodic variation in amplitude", "The same frequency interfere"],
    answer: 2,
    explanation: "Beats occur due to interference between two sound waves with slightly different frequencies, creating a periodic rise and fall in perceived loudness (beat frequency = |f1-f2|)."
  },
  {
    question: "According to the laws of reflection, the angle of incidence is:",
    options: ["Equal to the angle of reflection", "Unrelated to the angle of reflection", "Always less than the angle of reflection", "Always greater than the angle of reflection"],
    answer: 0,
    explanation: "The law of reflection states that the angle of incidence equals the angle of reflection, both measured from the normal (perpendicular line) to the reflecting surface."
  },
  {
    question: "A concave mirror with focal length 10cm forms an image of an object placed 20cm from the mirror. Calculate the image distance using the mirror formula.",
    options: ["20cm", "6.67cm", "10cm", "30cm"],
    answer: 0,
    explanation: "Using 1/f = 1/u + 1/v: 1/10 = 1/20 + 1/v, so 1/v = 1/10 - 1/20 = 1/20, giving v = 20cm."
  },
  {
    question: "Which type of lens is used to correct short-sightedness (myopia)?",
    options: ["Cylindrical lens", "Convex lens", "Bifocal lens", "Concave lens"],
    answer: 3,
    explanation: "Myopia (short-sightedness) occurs when the eye focuses images in front of the retina; a concave (diverging) lens spreads out light rays before entering the eye, pushing the focal point back onto the retina."
  },
  {
    question: "The refractive index of a medium with speed of light 2×10⁸ m/s (given c = 3×10⁸ m/s) is:",
    options: ["1.0", "0.67", "1.5", "2.0"],
    answer: 2,
    explanation: "Refractive index n = c/v = (3×10⁸)/(2×10⁸) = 1.5."
  },
  {
    question: "Which phenomenon explains why a straw appears bent when placed in a glass of water?",
    options: ["Reflection", "Refraction", "Diffraction", "Dispersion"],
    answer: 1,
    explanation: "Refraction occurs because light changes speed (and bends) when passing from one medium (water) to another (air), causing the visual distortion that makes the straw appear bent at the water's surface."
  },
  {
    question: "A convex lens forms a real, inverted image when the object is placed:",
    options: ["Beyond the focal point", "Between the lens and focal point", "At the focal point", "At infinity only"],
    answer: 0,
    explanation: "When an object is placed beyond the focal length of a convex lens, it produces a real, inverted image (unlike when placed within the focal length, which produces a virtual, upright, magnified image)."
  },
  {
    question: "The splitting of white light into its constituent colors is called:",
    options: ["Diffraction", "Reflection", "Refraction", "Dispersion"],
    answer: 3,
    explanation: "Dispersion occurs when white light passes through a prism, and different wavelengths (colors) refract by different amounts due to varying refractive indices, splitting into a visible spectrum."
  },
  {
    question: "An object is placed 15cm from a convex lens of focal length 10cm. Calculate the image distance.",
    options: ["6cm", "5cm", "30cm", "25cm"],
    answer: 2,
    explanation: "Using 1/f = 1/v - 1/u (with sign convention, u negative for real object): 1/10 = 1/v - 1/(-15), so 1/v = 1/10 - 1/15 = 3/30 - 2/30 = 1/30, giving v = 30cm."
  },
  {
    question: "Which mirror is commonly used in car side mirrors to provide a wider field of view?",
    options: ["Convex mirror", "Parabolic mirror", "Concave mirror", "Plane mirror"],
    answer: 0,
    explanation: "Convex mirrors diverge reflected light, producing a smaller, wider-angle image, making them ideal for side mirrors to give drivers a broader field of view (though objects appear smaller/farther than they are)."
  },
  {
    question: "The critical angle for total internal reflection occurs when the angle of refraction equals:",
    options: ["60°", "45°", "0°", "90°"],
    answer: 3,
    explanation: "The critical angle is specifically defined as the angle of incidence (in the denser medium) at which the refracted ray travels exactly along the boundary surface, meaning the angle of refraction is 90°."
  },
  {
    question: "Like charges:",
    options: ["Have no interaction", "Attract each other", "Neutralize each other", "Repel each other"],
    answer: 3,
    explanation: "According to the fundamental law of electrostatics, charges of the same sign (both positive or both negative) repel each other, while opposite charges attract."
  },
  {
    question: "Calculate the electrostatic force between two charges of 2×10⁻⁶C and 3×10⁻⁶C separated by 0.1m. (k = 9×10⁹ Nm²/C²)",
    options: ["5.4N", "54N", "540N", "0.54N"],
    answer: 0,
    explanation: "F = kq1q2/r² = (9×10⁹ × 2×10⁻⁶ × 3×10⁻⁶)/(0.1)² = (9×10⁹ × 6×10⁻¹²)/0.01 = 5.4×10⁻²/0.01 = 5.4N."
  },
  {
    question: "An object that has gained electrons becomes:",
    options: ["Radioactive", "Negatively charged", "Positively charged", "Neutral"],
    answer: 1,
    explanation: "Electrons carry negative charge, so an object gaining extra electrons accumulates excess negative charge, becoming negatively charged overall."
  },
  {
    question: "Electric field lines around a positive point charge point:",
    options: ["Toward the charge", "Parallel to each other", "In circles around the charge", "Away from the charge (radially outward)"],
    answer: 3,
    explanation: "By convention, electric field lines originate from positive charges and point radially outward, indicating the direction a positive test charge would move if placed in that field."
  },
  {
    question: "Coulomb's Law describes the force between two point charges as:",
    options: ["Independent of charge magnitude", "Inversely proportional to charge", "Directly proportional to the product of charges and inversely proportional to the square of distance", "Directly proportional to distance"],
    answer: 2,
    explanation: "Coulomb's Law states F = kq1q2/r², showing force depends directly on the product of the two charges and inversely on the square of the separation distance."
  },
  {
    question: "A capacitor with capacitance 5μF is charged to a potential difference of 12V. Calculate the charge stored.",
    options: ["60C", "2.4×10⁻⁶ C", "17μC", "60μC"],
    answer: 3,
    explanation: "Q = CV = 5×10⁻⁶ × 12 = 60×10⁻⁶ C = 60μC."
  },
  {
    question: "Electrostatic shielding (Faraday cage effect) works because:",
    options: ["Charges redistribute on the conductor's surface, canceling the field inside", "Electric fields cannot penetrate any material", "Charges accumulate uniformly throughout the conductor", "The conductor absorbs all charge"],
    answer: 0,
    explanation: "In a conductor, free charges redistribute themselves on the surface in response to an external field, creating an internal field that exactly cancels the external field, resulting in zero net electric field inside the conductor (Faraday cage principle)."
  },
  {
    question: "The SI unit of electric charge is:",
    options: ["Farad", "Coulomb", "Ampere", "Volt"],
    answer: 1,
    explanation: "Electric charge is measured in Coulombs (C), named after Charles-Augustin de Coulomb, who formulated the law describing electrostatic force."
  },
  {
    question: "Grounding (earthing) an object allows it to:",
    options: ["Gain maximum charge", "Increase its electric field", "Become permanently charged", "Neutralize excess charge by providing a path to the ground"],
    answer: 3,
    explanation: "Grounding connects an object to the Earth (acting as an infinite charge reservoir), allowing excess charge to flow away (or in) until the object reaches electrical neutrality."
  },
  {
    question: "Electric potential energy between two charges is defined as:",
    options: ["The rate of charge flow", "The charge stored in a capacitor", "The work done in bringing a charge from infinity to a specific point in the field", "The force required to separate them"],
    answer: 2,
    explanation: "Electric potential energy represents the work done (energy required) to move a charge from a reference point (infinity, where potential energy is defined as zero) to its current position within an electric field."
  },
];

const PHYSICSF = [
  {
    question: "Calculate the current flowing through a circuit with a resistance of 20Ω and voltage of 240V.",
    options: ["0.083A", "4800A", "12A", "220A"],
    answer: 2,
    explanation: "Using Ohm's Law: I = V/R = 240/20 = 12A."
  },
  {
    question: "In a series circuit, the total resistance is:",
    options: ["Equal to the reciprocal of the sum of reciprocals", "Always constant regardless of components", "Less than the smallest individual resistance", "Equal to the sum of individual resistances"],
    answer: 3,
    explanation: "In series circuits, resistors are connected end-to-end, so total resistance is simply the sum of all individual resistances (R = R1+R2+R3...)."
  },
  {
    question: "Two resistors of 4Ω and 6Ω are connected in parallel. Calculate the total resistance.",
    options: ["2.4Ω", "24Ω", "10Ω", "1.5Ω"],
    answer: 0,
    explanation: "For parallel resistors: 1/R = 1/4 + 1/6 = 3/12 + 2/12 = 5/12, so R = 12/5 = 2.4Ω."
  },
  {
    question: "Electrical power can be calculated using which formula?",
    options: ["P = VI", "P = V+I", "P = V/I", "P = I/V"],
    answer: 0,
    explanation: "Electrical power is the product of voltage and current (P = VI), derived from combining the definitions of power, voltage, and current."
  },
  {
    question: "A 240V, 2kW electric heater draws how much current?",
    options: ["8.33A", "120A", "0.12A", "480A"],
    answer: 0,
    explanation: "Using P = VI: I = P/V = 2000/240 = 8.33A."
  },
  {
    question: "Which of the following materials is classified as a semiconductor?",
    options: ["Rubber", "Glass", "Copper", "Silicon"],
    answer: 3,
    explanation: "Silicon is a well-known semiconductor material, having electrical conductivity between that of conductors (like copper) and insulators (like rubber/glass), widely used in electronic devices."
  },
  {
    question: "The resistance of a conductor increases with:",
    options: ["Increasing temperature (for metals)", "Decreasing temperature (for metals)", "Increasing cross-sectional area", "Decreasing length"],
    answer: 0,
    explanation: "For most metallic conductors, increased temperature causes greater atomic vibration, increasing collision frequency with electrons and thus increasing resistance."
  },
  {
    question: "Calculate the energy consumed by a 100W bulb operating for 3 hours.",
    options: ["300J", "300Wh", "33.3Wh", "1080Wh"],
    answer: 1,
    explanation: "Energy = Power × Time = 100W × 3h = 300Wh."
  },
  {
    question: "In a parallel circuit, the voltage across each component is:",
    options: ["Divided based on resistance", "The same across all components", "Dependent on current only", "Zero for all but one component"],
    answer: 1,
    explanation: "In parallel circuits, all components share the same two connection points, meaning voltage across each branch is identical, though current can differ based on individual resistance."
  },
  {
    question: "The internal resistance of a battery causes:",
    options: ["Terminal voltage to equal EMF always", "Terminal voltage to exceed EMF", "Terminal voltage to be less than EMF when current flows", "No effect on circuit behavior"],
    answer: 2,
    explanation: "When current flows through a battery, some voltage is \"lost\" due to internal resistance (V=EMF-Ir), making the terminal voltage (available to the external circuit) less than the EMF."
  },
  {
    question: "A current-carrying wire produces a magnetic field in which pattern?",
    options: ["Random directions", "No magnetic field is produced", "Concentric circles around the wire", "Straight lines parallel to the wire"],
    answer: 2,
    explanation: "According to the right-hand rule, a current-carrying conductor produces a magnetic field that forms concentric circles around the wire, with direction determined by current flow direction."
  },
  {
    question: "Which rule determines the direction of the magnetic field around a current-carrying conductor?",
    options: ["Left-hand rule", "Lenz's rule", "Faraday's rule", "Right-hand rule (grip rule)"],
    answer: 3,
    explanation: "The right-hand grip rule states that if you point your right thumb in the direction of current flow, your curled fingers indicate the direction of the magnetic field lines around the conductor."
  },
  {
    question: "The force on a current-carrying conductor in a magnetic field is given by:",
    options: ["F = BIL sin θ", "F = BIL cos θ", "F = BI/L", "F = B/IL"],
    answer: 0,
    explanation: "The force on a current-carrying conductor in a magnetic field is F = BILsinθ, where θ is the angle between the current direction and the magnetic field — maximum force occurs when the conductor is perpendicular to the field (sin90°=1)."
  },
  {
    question: "A solenoid's magnetic field strength can be increased by:",
    options: ["Inserting an iron core", "Decreasing the number of turns", "Reducing current", "Increasing the length of the solenoid without changing turns"],
    answer: 0,
    explanation: "Inserting a ferromagnetic core (like iron) significantly increases the magnetic field strength of a solenoid because the material becomes magnetized, amplifying the overall field."
  },
  {
    question: "Which of the following materials is NOT ferromagnetic?",
    options: ["Iron", "Cobalt", "Nickel", "Copper"],
    answer: 3,
    explanation: "Copper is not ferromagnetic (it's actually diamagnetic, weakly repelled by magnetic fields), while iron, nickel, and cobalt are classic examples of ferromagnetic materials that can be strongly magnetized."
  },
  {
    question: "The magnetic field inside a long solenoid is:",
    options: ["Zero", "Uniform and parallel to the axis", "Circular around the solenoid", "Strongest at the ends"],
    answer: 1,
    explanation: "Inside a long solenoid, the magnetic field is essentially uniform and parallel to the solenoid's axis, similar to the field of a bar magnet, due to the cumulative effect of all the current loops."
  },
  {
    question: "A charged particle moving through a magnetic field experiences maximum force when it moves:",
    options: ["Force is always zero regardless of angle", "Parallel to the field", "Perpendicular to the field", "At 45° to the field"],
    answer: 2,
    explanation: "The magnetic force on a moving charge is F = qvBsinθ, which is maximum when the particle moves perpendicular to the magnetic field (θ=90°, sin90°=1)."
  },
  {
    question: "Which device converts electrical energy into mechanical energy using magnetic principles?",
    options: ["Generator", "Electric motor", "Transformer", "Battery"],
    answer: 1,
    explanation: "An electric motor uses the interaction between magnetic fields and current-carrying conductors to convert electrical energy into mechanical (rotational) energy, unlike a generator which does the reverse."
  },
  {
    question: "The strength of an electromagnet depends on:",
    options: ["Only the length of the wire", "Only the material of the wire", "Number of turns, current, and core material", "Only the current flowing through it"],
    answer: 2,
    explanation: "Electromagnet strength is influenced by multiple factors: the number of coil turns, the magnitude of current flowing, and the presence/type of core material (like iron) used to enhance the field."
  },
  {
    question: "Two parallel wires carrying current in the same direction will:",
    options: ["Have no interaction", "Attract each other", "Rotate around each other", "Repel each other"],
    answer: 1,
    explanation: "Parallel currents flowing in the same direction create magnetic fields that result in an attractive force between the wires, while currents in opposite directions cause repulsion."
  },
  {
    question: "Faraday's Law of electromagnetic induction states that induced EMF is proportional to:",
    options: ["The magnetic field strength only", "The current flowing through the circuit", "The rate of change of magnetic flux", "The resistance of the circuit"],
    answer: 2,
    explanation: "Faraday's Law states that induced EMF equals the negative rate of change of magnetic flux through a circuit (EMF = -dΦ/dt) — faster flux changes produce greater induced EMF."
  },
  {
    question: "A coil with 100 turns experiences a change in magnetic flux from 0.02Wb to 0.08Wb in 2 seconds. Calculate the induced EMF.",
    options: ["3V", "0.03V", "300V", "30V"],
    answer: 0,
    explanation: "EMF = N(ΔΦ/Δt) = 100 × (0.08-0.02)/2 = 100 × 0.06/2 = 100 × 0.03 = 3V."
  },
  {
    question: "Lenz's Law states that the direction of induced current:",
    options: ["Supports the change in magnetic flux", "Is always clockwise", "Opposes the change in magnetic flux that produced it", "Is independent of the change causing it"],
    answer: 2,
    explanation: "Lenz's Law specifies that induced current flows in a direction that creates a magnetic field opposing the change in flux that caused it — this is a direct consequence of energy conservation."
  },
  {
    question: "Which factor does NOT affect the magnitude of induced EMF in a coil?",
    options: ["Rate of change of magnetic flux", "Number of turns in the coil", "Color of the wire", "Strength of the magnetic field"],
    answer: 2,
    explanation: "The color of the wire is a visual property that has no bearing on electromagnetic induction — only physical/electromagnetic factors like turns, field strength, and rate of change matter."
  },
  {
    question: "A generator converts:",
    options: ["Electrical energy to mechanical energy", "Thermal energy to mechanical energy", "Mechanical energy to electrical energy", "Chemical energy to electrical energy"],
    answer: 2,
    explanation: "A generator operates on electromagnetic induction principles, using mechanical motion (like a rotating coil in a magnetic field) to induce and generate electrical energy."
  },
  {
    question: "Self-induction occurs when:",
    options: ["Two separate coils interact", "Current flows through a resistor", "A magnet moves near a stationary coil", "A changing current in a coil induces an EMF in itself"],
    answer: 3,
    explanation: "Self-induction refers to the phenomenon where a changing current within a single coil induces an opposing EMF in that same coil, due to the changing magnetic flux it creates."
  },
  {
    question: "Mutual induction is the basis of operation for which device?",
    options: ["Capacitor", "Transformer", "Diode", "Resistor"],
    answer: 1,
    explanation: "Transformers work on mutual induction, where a changing current in the primary coil induces an EMF in a separate, magnetically coupled secondary coil."
  },
  {
    question: "A step-up transformer increases:",
    options: ["Voltage", "Frequency", "Power", "Current"],
    answer: 0,
    explanation: "A step-up transformer increases voltage from primary to secondary coil (while proportionally decreasing current to conserve power), achieved by having more turns in the secondary coil than the primary."
  },
  {
    question: "The unit of magnetic flux is:",
    options: ["Weber", "Tesla", "Farad", "Henry"],
    answer: 0,
    explanation: "Magnetic flux is measured in Webers (Wb), representing the total magnetic field passing through a given area, while Tesla measures magnetic flux density (field strength)."
  },
  {
    question: "According to the principle of electromagnetic induction, no EMF is induced when:",
    options: ["Current changes in a nearby coil", "There is no relative motion between coil and magnetic field (constant flux)", "A coil rotates within a magnetic field", "The magnetic flux changes rapidly"],
    answer: 1,
    explanation: "EMF induction fundamentally requires a changing magnetic flux — if the flux remains constant (no relative motion, no current change), there is no induced EMF regardless of the field's absolute strength."
  },
  {
    question: "The mechanical advantage of a machine is defined as:",
    options: ["Work output divided by work input", "Load force divided by effort force", "Effort force divided by load force", "Distance moved by load divided by distance moved by effort"],
    answer: 1,
    explanation: "Mechanical advantage (MA) = Load/Effort, indicating how much a machine multiplies the input force to overcome a resistance (load)."
  },
  {
    question: "A lever has a load of 200N positioned 0.5m from the fulcrum, and effort is applied 2m from the fulcrum. Calculate the effort required (assuming ideal lever).",
    options: ["800N", "400N", "50N", "100N"],
    answer: 2,
    explanation: "Using the principle of moments (Load × load arm = Effort × effort arm): 200 × 0.5 = Effort × 2, so Effort = 100/2 = 50N."
  },
  {
    question: "The velocity ratio of a machine is defined as:",
    options: ["Work output/Work input", "Effort/Load", "Distance moved by effort/Distance moved by load", "Load/Effort"],
    answer: 2,
    explanation: "Velocity ratio (VR) compares the distance moved by the effort to the distance moved by the load — it's a geometric property of the machine, independent of friction or efficiency."
  },
  {
    question: "In an ideal (100% efficient) machine, mechanical advantage equals:",
    options: ["Zero", "Double the velocity ratio", "The velocity ratio", "Half the velocity ratio"],
    answer: 2,
    explanation: "For a perfectly efficient (ideal, frictionless) machine, mechanical advantage exactly equals velocity ratio, since efficiency = (MA/VR) × 100%, and 100% efficiency means MA=VR."
  },
  {
    question: "A pulley system has a velocity ratio of 4 and mechanical advantage of 3.2. Calculate its efficiency.",
    options: ["40%", "125%", "12.8%", "80%"],
    answer: 3,
    explanation: "Efficiency = (MA/VR) × 100% = (3.2/4) × 100% = 80%."
  },
  {
    question: "Which class of lever has the fulcrum positioned between the effort and the load?",
    options: ["First class lever", "Third class lever", "Fourth class lever (doesn't exist)", "Second class lever"],
    answer: 0,
    explanation: "In a first-class lever (like a seesaw), the fulcrum sits between the effort and the load, distinguishing it from second-class (load between fulcrum and effort) and third-class (effort between fulcrum and load) levers."
  },
  {
    question: "An inclined plane has a length of 5m and height of 1m. Calculate its velocity ratio.",
    options: ["0.2", "4", "1", "5"],
    answer: 3,
    explanation: "For an inclined plane, velocity ratio = length of incline/height = 5/1 = 5."
  },
  {
    question: "Which of the following is an example of a third-class lever?",
    options: ["Crowbar", "Wheelbarrow", "Seesaw", "Human forearm (biceps lifting)"],
    answer: 3,
    explanation: "In a third-class lever (like the human forearm), the effort (bicep muscle) is applied between the fulcrum (elbow) and the load (hand/object), unlike wheelbarrows (second-class) or seesaws (first-class)."
  },
  {
    question: "Why is efficiency of real machines always less than 100%?",
    options: ["Due to friction and other energy losses", "Due to excessive load", "Due to the material used", "Due to conservation of energy being violated"],
    answer: 0,
    explanation: "Real machines experience energy losses primarily due to friction (and sometimes deformation, air resistance), meaning some input work is converted to heat rather than useful output — hence efficiency is always below 100%."
  },
  {
    question: "A screw jack has a pitch of 5mm and a handle length of 40cm. Calculate its velocity ratio. (VR = 2πL/pitch)",
    options: ["80", "502.4", "8", "50.24"],
    answer: 1,
    explanation: "VR = 2πL/pitch = (2×π×400mm)/5mm = 2513.6/5 ≈ 502.4 (using L=400mm to match pitch units)."
  },
  {
    question: "According to Einstein's mass-energy equivalence, energy is related to mass by:",
    options: ["E = mc", "E = mc²", "E = mc³", "E = m²c"],
    answer: 1,
    explanation: "Einstein's famous equation E=mc² shows that mass and energy are interchangeable, with even small amounts of mass corresponding to enormous amounts of energy (c being the speed of light)."
  },
  {
    question: "Calculate the energy equivalent of 1×10⁻⁶ kg of mass. (c = 3×10⁸ m/s)",
    options: ["3×10² J", "9×10¹⁰ J", "9×10¹³ J", "3×10⁸ J"],
    answer: 1,
    explanation: "E = mc² = 1×10⁻⁶ × (3×10⁸)² = 1×10⁻⁶ × 9×10¹⁶ = 9×10¹⁰ J."
  },
  {
    question: "Nuclear fission involves:",
    options: ["Absorption of neutrons without splitting", "Combining light nuclei to form a heavier nucleus", "Emission of electrons from an atom", "Splitting a heavy nucleus into lighter nuclei"],
    answer: 3,
    explanation: "Nuclear fission is the process where a heavy, unstable nucleus (like Uranium-235) splits into two or more lighter nuclei, releasing significant energy in the process."
  },
  {
    question: "Which particle has no electric charge and no mass (or negligible mass)?",
    options: ["Electron", "Photon", "Neutron", "Proton"],
    answer: 1,
    explanation: "While a neutron has no charge but does have mass, a photon (particle of light) has no rest mass and no electric charge, making it the correct answer for \"no charge and negligible/no mass.\""
  },
  {
    question: "The half-life of a radioactive substance is 10 years. After 30 years, what fraction of the original sample remains?",
    options: ["1/2", "1/8", "1/16", "1/4"],
    answer: 1,
    explanation: "30 years represents 3 half-lives (30/10=3). Remaining fraction = (1/2)³ = 1/8."
  },
  {
    question: "Which type of radioactive decay results in the emission of a helium nucleus?",
    options: ["Gamma decay", "Beta decay", "Neutron emission", "Alpha decay"],
    answer: 3,
    explanation: "Alpha decay specifically involves the emission of an alpha particle, which is identical to a helium nucleus (2 protons and 2 neutrons)."
  },
  {
    question: "The photoelectric equation is given by:",
    options: ["p = h/λ", "E = hf", "hf = Φ + KEmax", "E = mc²"],
    answer: 2,
    explanation: "Einstein's photoelectric equation states that the energy of an incident photon (hf) equals the work function (Φ, minimum energy to release an electron) plus the maximum kinetic energy of the emitted electron (KEmax)."
  },
  {
    question: "In nuclear fusion, energy is released because:",
    options: ["Mass increases during the reaction", "The mass of products is slightly less than the mass of reactants (mass defect converts to energy)", "Neutrons are absorbed", "Electrons are released"],
    answer: 1,
    explanation: "During fusion, some mass is \"lost\" (converted to energy according to E=mc²) because the total mass of the resulting nucleus is slightly less than the combined mass of the original nuclei — this mass defect is released as energy."
  },
  {
    question: "X-rays are produced when:",
    options: ["Atoms undergo radioactive decay", "Protons collide with neutrons", "Electrons combine with protons", "High-speed electrons are suddenly decelerated upon hitting a metal target"],
    answer: 3,
    explanation: "X-rays are typically generated in X-ray tubes when high-energy electrons are rapidly decelerated (or stopped) upon striking a metal target, converting kinetic energy into electromagnetic radiation (X-rays)."
  },
  {
    question: "The atomic number of an element represents:",
    options: ["The total mass of the atom", "The number of protons in the nucleus", "The number of neutrons only", "The total number of protons and neutrons"],
    answer: 1,
    explanation: "Atomic number (Z) specifically refers to the number of protons in an atom's nucleus, which determines the element's identity and its position on the periodic table."
  },
];

const CHEMISTRYA = [
  {
    question: "Which separation technique is most suitable for separating a mixture of sand and salt dissolved in water?",
    options: ["Distillation only", "Decantation", "Filtration followed by evaporation", "Filtration only"],
    answer: 2,
    explanation: "Filtration removes the insoluble sand first, then evaporation of the filtrate (salt solution) recovers the salt by evaporating the water — a two-step process needed since salt is dissolved, not suspended."
  },
  {
    question: "Chromatography is primarily used to separate:",
    options: ["Components of a mixture based on differing solubilities/affinities", "Solids from liquids", "Gases from liquids", "Immiscible liquids"],
    answer: 0,
    explanation: "Chromatography separates mixture components based on their different rates of movement through a stationary phase, determined by solubility and affinity differences — commonly used for separating pigments or dissolved substances."
  },
  {
    question: "Which of the following is a physical change (not chemical)?",
    options: ["Burning of wood", "Souring of milk", "Melting of ice", "Rusting of iron"],
    answer: 2,
    explanation: "Melting ice is a physical change (state change, no new substance formed), while rusting, burning, and souring milk all involve chemical reactions producing new substances."
  },
  {
    question: "Distillation is most appropriate for separating:",
    options: ["Colored components from a solution", "Two miscible liquids with different boiling points", "Two immiscible liquids", "A solid from another solid"],
    answer: 1,
    explanation: "Distillation separates miscible liquids based on differences in boiling points — the liquid with the lower boiling point vaporizes first and is collected separately upon condensation."
  },
  {
    question: "A mixture of iron filings and sulfur can be separated using:",
    options: ["Filtration", "Evaporation", "Distillation", "A magnet"],
    answer: 3,
    explanation: "Since iron is magnetic and sulfur is not, a magnet can easily separate the iron filings from the sulfur powder — a simple physical separation method."
  },
  {
    question: "Which technique is used to separate immiscible liquids like oil and water?",
    options: ["Chromatography", "Separating funnel (decantation)", "Distillation", "Sublimation"],
    answer: 1,
    explanation: "A separating funnel exploits the density difference and immiscibility between oil and water, allowing the layers to be drained off separately based on density."
  },
  {
    question: "Sublimation is the process where a substance changes directly from:",
    options: ["Gas to solid", "Liquid to gas", "Solid to gas without passing through liquid state", "Solid to liquid"],
    answer: 2,
    explanation: "Sublimation is a special phase transition where a solid converts directly into vapor (gas) without passing through the intermediate liquid phase (e.g., dry ice, iodine)."
  },
  {
    question: "Which of the following best classifies a solution of sugar in water?",
    options: ["Homogeneous mixture", "Element", "Compound", "Heterogeneous mixture"],
    answer: 0,
    explanation: "A sugar solution is uniform throughout (same composition and properties at every point), classifying it as a homogeneous mixture, unlike heterogeneous mixtures with visibly distinct components."
  },
  {
    question: "Fractional distillation is specifically used to separate:",
    options: ["Insoluble solids from liquids", "Multiple miscible liquids with close boiling points", "A mixture of solids", "Solutions of salts"],
    answer: 1,
    explanation: "Fractional distillation uses a fractionating column to separate multiple liquids with relatively close boiling points more efficiently than simple distillation, achieved through repeated vaporization-condensation cycles (e.g., separating crude oil components)."
  },
  {
    question: "Which property is exploited when using a centrifuge to separate mixtures?",
    options: ["Density differences", "Solubility differences", "Magnetic properties", "Boiling point differences"],
    answer: 0,
    explanation: "Centrifugation separates components based on density differences, using rapid spinning to force denser particles to settle faster than lighter ones (commonly used for blood separation in labs)."
  },
  {
    question: "The atomic number of an element represents the number of:",
    options: ["Protons and neutrons combined", "Protons in the nucleus", "Electrons in the outermost shell", "Neutrons in the nucleus"],
    answer: 1,
    explanation: "Atomic number (Z) is defined specifically as the number of protons in an atom's nucleus, which uniquely identifies the element."
  },
  {
    question: "An atom of chlorine has atomic number 17 and mass number 35. How many neutrons does it contain?",
    options: ["17", "18", "52", "35"],
    answer: 1,
    explanation: "Neutrons = mass number - atomic number = 35 - 17 = 18."
  },
  {
    question: "Isotopes of an element have the same number of:",
    options: ["Electrons and neutrons but different protons", "Neutrons but different protons", "Protons and neutrons but different electrons", "Protons but different neutrons"],
    answer: 3,
    explanation: "Isotopes are atoms of the same element (same number of protons, hence same atomic number) but with differing numbers of neutrons, resulting in different mass numbers."
  },
  {
    question: "The maximum number of electrons that can occupy the second electron shell (n=2) is:",
    options: ["8", "32", "2", "18"],
    answer: 0,
    explanation: "Using the formula 2n², the second shell (n=2) can hold a maximum of 2×2² = 8 electrons."
  },
  {
    question: "Which subatomic particle has a negligible mass compared to protons and neutrons?",
    options: ["Nucleon", "Neutron", "Proton", "Electron"],
    answer: 3,
    explanation: "Electrons have a mass approximately 1/1836 that of a proton, making their mass negligible in atomic mass calculations compared to protons and neutrons."
  },
  {
    question: "An ion with electronic configuration 2,8 and a charge of +1 most likely corresponds to which element?",
    options: ["Fluorine", "Magnesium", "Sodium", "Neon"],
    answer: 2,
    explanation: "Sodium (atomic number 11) has electronic configuration 2,8,1. Losing one electron (to form Na⁺) gives 2,8, matching the described ion configuration."
  },
  {
    question: "Which model of the atom proposed that electrons orbit the nucleus in fixed energy levels?",
    options: ["Dalton's model", "Thomson's model", "Bohr's model", "Rutherford's model"],
    answer: 2,
    explanation: "Bohr's model specifically introduced the concept of electrons occupying fixed, quantized energy levels (shells) around the nucleus, unlike earlier models that didn't account for energy quantization."
  },
  {
    question: "The relative atomic mass of an element is based on which isotope as standard?",
    options: ["Hydrogen-1", "Helium-4", "Carbon-12", "Oxygen-16"],
    answer: 2,
    explanation: "The modern atomic mass scale uses Carbon-12 as the standard reference, defined as having a mass of exactly 12 atomic mass units (amu)."
  },
  {
    question: "Calculate the number of electrons in a Mg²⁺ ion (atomic number of Mg = 12).",
    options: ["10", "12", "14", "2"],
    answer: 0,
    explanation: "Mg²⁺ has lost 2 electrons from its neutral state (12 electrons), leaving 12-2 = 10 electrons."
  },
  {
    question: "Which statement about isotopes is correct?",
    options: ["They belong to different elements", "They have the same chemical properties but different physical properties (like mass)", "They have different atomic numbers", "They have different chemical properties"],
    answer: 1,
    explanation: "Since isotopes have identical electron configurations (same number of protons/electrons), their chemical properties remain the same, while physical properties like mass and density can differ due to varying neutron numbers."
  },
  {
    question: "Elements in the same group of the periodic table have similar chemical properties because they have the same:",
    options: ["Number of protons", "Number of neutrons", "Atomic mass", "Number of valence electrons"],
    answer: 3,
    explanation: "Elements within the same group share the same number of valence (outermost) electrons, which primarily determines chemical bonding behavior and reactivity patterns."
  },
  {
    question: "As you move across a period from left to right, atomic radius generally:",
    options: ["Increases then decreases", "Increases", "Decreases", "Remains constant"],
    answer: 2,
    explanation: "Moving left to right across a period, protons increase (stronger nuclear charge) while electrons are added to the same shell, pulling electrons closer to the nucleus and decreasing atomic radius."
  },
  {
    question: "Which of the following elements has the highest electronegativity?",
    options: ["Oxygen", "Fluorine", "Sodium", "Chlorine"],
    answer: 1,
    explanation: "Fluorine has the highest electronegativity of all elements (approximately 4.0 on the Pauling scale) due to its small atomic radius and strong attraction for electrons."
  },
  {
    question: "Ionization energy generally increases across a period because:",
    options: ["Electron shielding increases significantly", "Nuclear charge increases while electrons are added to the same shell, increasing attraction", "Atomic mass decreases", "Atomic radius increases"],
    answer: 1,
    explanation: "As you move across a period, protons (nuclear charge) increase without adding new electron shells, resulting in stronger attraction between the nucleus and outer electrons, making them harder to remove (higher ionization energy)."
  },
  {
    question: "Which group in the periodic table is known as the alkali metals?",
    options: ["Group 17", "Group 18", "Group 1", "Group 2"],
    answer: 2,
    explanation: "Group 1 elements (excluding hydrogen) are classified as alkali metals, characterized by having one valence electron and high reactivity, especially with water."
  },
  {
    question: "Noble gases are generally unreactive because they have:",
    options: ["Very small atomic radius", "No electrons in their outer shell", "A complete outer electron shell (stable configuration)", "High atomic mass"],
    answer: 2,
    explanation: "Noble gases (Group 18) have a full valence electron shell, providing exceptional stability and minimal tendency to gain, lose, or share electrons with other atoms."
  },
  {
    question: "Metallic character in the periodic table generally increases:",
    options: ["Down a group and from right to left across a period", "Up a group and left to right across a period", "Down a group and across a period (left to right)", "Across a period (left to right) and up a group"],
    answer: 0,
    explanation: "Metallic character increases down a group (larger atoms, easier electron loss) and from right to left across a period (fewer valence electrons, more metallic behavior)."
  },
  {
    question: "Which of these elements would have the largest atomic radius?",
    options: ["Lithium", "Sodium", "Rubidium", "Potassium"],
    answer: 2,
    explanation: "Atomic radius increases down a group due to additional electron shells; among these alkali metals, rubidium is positioned lowest in Group 1, giving it the largest atomic radius."
  },
  {
    question: "The periodic law states that properties of elements are a periodic function of their:",
    options: ["Density", "Number of neutrons", "Atomic number", "Atomic mass"],
    answer: 2,
    explanation: "The modern periodic law (revised from Mendeleev's original mass-based law) states that chemical and physical properties recur periodically when elements are arranged by increasing atomic number."
  },
  {
    question: "Which trend correctly describes electron affinity across a period (left to right)?",
    options: ["Generally increases (becomes more negative/exothermic)", "Generally decreases", "Remains constant", "Fluctuates randomly with no pattern"],
    answer: 0,
    explanation: "Electron affinity generally becomes more negative (more energy released, indicating greater attraction for an additional electron) across a period due to increasing nuclear charge, though there are some exceptions at specific points."
  },
  {
    question: "Ionic bonds are formed through:",
    options: ["Weak intermolecular attractions", "Overlapping of atomic orbitals", "Transfer of electrons from one atom to another", "Sharing of electrons between atoms"],
    answer: 2,
    explanation: "Ionic bonding occurs when one atom (typically a metal) transfers electrons to another atom (typically a non-metal), creating oppositely charged ions that attract each other electrostatically."
  },
  {
    question: "Which type of bond is formed in a molecule of oxygen gas (O₂)?",
    options: ["Ionic bond", "Covalent bond (double bond)", "Hydrogen bond", "Metallic bond"],
    answer: 1,
    explanation: "Oxygen gas consists of two oxygen atoms sharing two pairs of electrons (double covalent bond) to achieve stable octet configurations."
  },
  {
    question: "Which property is characteristic of ionic compounds?",
    options: ["Poor conductivity in molten state", "Non-polar nature", "High melting and boiling points", "Low melting points"],
    answer: 2,
    explanation: "Ionic compounds typically have high melting and boiling points due to the strong electrostatic forces holding oppositely charged ions together in a rigid lattice structure."
  },
  {
    question: "A coordinate (dative) covalent bond is formed when:",
    options: ["One atom donates both electrons of the shared pair", "Electrons are completely transferred", "Two atoms equally share one electron each", "Metallic atoms share a sea of electrons"],
    answer: 0,
    explanation: "In a coordinate (dative) covalent bond, one atom (the donor) provides both electrons for the shared pair, while the other atom (acceptor) contributes none, unlike normal covalent bonds where each atom contributes one electron."
  },
  {
    question: "Metallic bonding is best described as:",
    options: ["Weak intermolecular forces between metal atoms", "Sharing of electrons between two specific metal atoms", "Transfer of electrons between metal atoms", "A \"sea\" of delocalized electrons surrounding positive metal ions"],
    answer: 3,
    explanation: "Metallic bonding involves a lattice of positive metal ions surrounded by a \"sea\" of delocalized (free-moving) electrons, explaining properties like electrical conductivity and malleability."
  },
  {
    question: "Which type of intermolecular force is responsible for water's unusually high boiling point?",
    options: ["Dipole-dipole forces only", "Hydrogen bonding", "London dispersion forces only", "Ionic bonding"],
    answer: 1,
    explanation: "Water molecules form strong hydrogen bonds (due to highly electronegative oxygen bonded to hydrogen), requiring significant energy to break these bonds during boiling, explaining water's unusually high boiling point compared to similar-sized molecules."
  },
  {
    question: "According to VSEPR theory, a molecule with 4 bonding pairs and no lone pairs around the central atom adopts which geometry?",
    options: ["Trigonal planar", "Octahedral", "Tetrahedral", "Linear"],
    answer: 2,
    explanation: "VSEPR (Valence Shell Electron Pair Repulsion) theory predicts that 4 electron pairs (bonding, no lone pairs) arrange themselves as far apart as possible, resulting in tetrahedral geometry (109.5° bond angles), as seen in methane (CH₄)."
  },
  {
    question: "Which of the following compounds is most likely to be covalent?",
    options: ["CaF₂", "CO₂", "NaCl", "MgO"],
    answer: 1,
    explanation: "CO₂ consists of two non-metals (carbon and oxygen) sharing electrons through covalent bonds, unlike the other options which involve metal-nonmetal combinations typical of ionic bonding."
  },
  {
    question: "Polar covalent bonds occur when:",
    options: ["No electrons are involved in bonding", "Electrons are shared equally between two identical atoms", "Electrons are shared unequally due to differing electronegativities", "Electrons are transferred completely"],
    answer: 2,
    explanation: "Polar covalent bonds form when atoms with different electronegativities share electrons unequally, creating partial positive and negative charges (dipole) within the molecule."
  },
  {
    question: "Which of the following best explains why noble gases rarely form chemical bonds?",
    options: ["Their electron configuration is already stable (full outer shell)", "They lack protons for bonding", "They are too large to bond", "They have too many valence electrons"],
    answer: 0,
    explanation: "Noble gases already possess a complete/stable valence electron configuration, eliminating the driving force (achieving stability) that typically causes atoms to form chemical bonds."
  },
  {
    question: "Balance the equation: Mg + O₂ → MgO. What are the correct coefficients?",
    options: ["1, 1, 1", "1, 2, 1", "2, 1, 2", "2, 2, 1"],
    answer: 2,
    explanation: "Balancing requires equal atoms on both sides: 2Mg + O₂ → 2MgO gives 2 Mg atoms and 2 O atoms on each side, achieving balance."
  },
  {
    question: "What is the correct chemical formula for calcium chloride?",
    options: ["CaCl", "Ca₂Cl₂", "CaCl₂", "Ca₂Cl"],
    answer: 2,
    explanation: "Calcium has a +2 charge (Ca²⁺) and chloride has a -1 charge (Cl⁻), requiring two chloride ions to balance one calcium ion, giving CaCl₂."
  },
  {
    question: "In the reaction Zn + 2HCl → ZnCl₂ + H₂, this is classified as a:",
    options: ["Double decomposition reaction", "Decomposition reaction", "Combination reaction", "Displacement (single replacement) reaction"],
    answer: 3,
    explanation: "This reaction involves zinc displacing hydrogen from hydrochloric acid, a classic example of a single displacement (replacement) reaction where a more reactive metal replaces a less reactive one in a compound."
  },
  {
    question: "What is the empirical formula of a compound containing 40% carbon, 6.7% hydrogen, and 53.3% oxygen by mass? (Assume 100g sample: C=12, H=1, O=16)",
    options: ["CH₄O", "CH₂O", "C₂H₄O₂", "C₂H₂O"],
    answer: 1,
    explanation: "Moles: C=40/12=3.33, H=6.7/1=6.7, O=53.3/16=3.33. Dividing by smallest (3.33): C=1, H=2, O=1, giving empirical formula CH₂O."
  },
  {
    question: "Balance the equation: Fe + O₂ → Fe₂O₃. What are the correct coefficients?",
    options: ["2, 3, 2", "2, 2, 1", "3, 2, 1", "4, 3, 2"],
    answer: 3,
    explanation: "Balancing gives 4Fe + 3O₂ → 2Fe₂O₃, providing 4 Fe atoms and 6 O atoms on each side (2×3=6 from O₂, 2×3=6 from Fe₂O₃)."
  },
  {
    question: "Which type of reaction is represented by: CaCO₃ → CaO + CO₂?",
    options: ["Decomposition reaction", "Combination reaction", "Neutralization reaction", "Displacement reaction"],
    answer: 0,
    explanation: "This reaction shows a single compound (calcium carbonate) breaking down into two simpler substances (calcium oxide and carbon dioxide), characteristic of a decomposition reaction (typically requiring heat)."
  },
  {
    question: "What is the correct formula for aluminum sulfate?",
    options: ["Al₃(SO₄)₂", "Al₂(SO₄)₃", "Al₂SO₄", "AlSO₄"],
    answer: 1,
    explanation: "Aluminum has a +3 charge (Al³⁺) and sulfate has a -2 charge (SO₄²⁻). To balance charges: 2(+3) = 3(-2) = 6, giving the formula Al₂(SO₄)₃."
  },
  {
    question: "In the equation 2H₂ + O₂ → 2H₂O, if 4 moles of H₂ react completely, how many moles of H₂O are produced?",
    options: ["8 moles", "4 moles", "2 moles", "1 mole"],
    answer: 1,
    explanation: "From the balanced equation, the mole ratio of H₂ to H₂O is 2:2 (or 1:1), so 4 moles of H₂ produces 4 moles of H₂O."
  },
  {
    question: "Which of the following represents a combination (synthesis) reaction?",
    options: ["Zn + CuSO₄ → ZnSO₄ + Cu", "AgNO₃ + NaCl → AgCl + NaNO₃", "2H₂O → 2H₂ + O₂", "N₂ + 3H₂ → 2NH₃"],
    answer: 3,
    explanation: "A combination reaction involves two or more simple substances combining to form a single, more complex product — nitrogen and hydrogen combining to form ammonia fits this definition perfectly."
  },
  {
    question: "What is the molecular formula of a compound with empirical formula CH₂O and molar mass 180 g/mol? (Empirical formula mass = 30 g/mol)",
    options: ["C₃H₆O₃", "C₆H₁₂O₆", "C₄H₈O₄", "C₂H₄O₂"],
    answer: 1,
    explanation: "Molecular mass/Empirical mass = 180/30 = 6, so multiply the empirical formula by 6: (CH₂O)×6 = C₆H₁₂O₆ (glucose)."
  },
];

const CHEMISTRYB = [
  {
    question: "Calculate the number of moles in 44g of CO₂. (C=12, O=16)",
    options: ["1 mol", "2 mol", "0.5 mol", "4 mol"],
    answer: 0,
    explanation: "Molar mass of CO₂ = 12 + (16×2) = 44 g/mol. Moles = mass/molar mass = 44/44 = 1 mol."
  },
  {
    question: "Avogadro's number represents the number of particles in:",
    options: ["1 mL of water", "1 liter of any gas", "1 gram of any substance", "1 mole of any substance"],
    answer: 3,
    explanation: "Avogadro's number (6.02×10²³) defines the number of particles (atoms, molecules, ions) contained in exactly one mole of any substance."
  },
  {
    question: "How many molecules are present in 0.5 mol of water? (Avogadro's number = 6.02×10²³)",
    options: ["1.204×10²³", "6.02×10²³", "3.01×10²³", "12.04×10²³"],
    answer: 2,
    explanation: "Number of molecules = moles × Avogadro's number = 0.5 × 6.02×10²³ = 3.01×10²³."
  },
  {
    question: "Calculate the mass of 3 moles of NaOH. (Na=23, O=16, H=1)",
    options: ["120g", "80g", "40g", "60g"],
    answer: 0,
    explanation: "Molar mass of NaOH = 23+16+1 = 40 g/mol. Mass = moles × molar mass = 3 × 40 = 120g."
  },
  {
    question: "In the reaction N₂ + 3H₂ → 2NH₃, how many moles of H₂ are needed to react completely with 2 moles of N₂?",
    options: ["6 mol", "4 mol", "3 mol", "2 mol"],
    answer: 0,
    explanation: "Mole ratio of N₂:H₂ is 1:3, so 2 moles of N₂ requires 2×3 = 6 moles of H₂."
  },
  {
    question: "What volume does 2 moles of an ideal gas occupy at STP? (Molar volume at STP = 22.4 L/mol)",
    options: ["44.8 L", "22.4 L", "11.2 L", "67.2 L"],
    answer: 0,
    explanation: "Volume = moles × molar volume at STP = 2 × 22.4 = 44.8 L."
  },
  {
    question: "Calculate the molar concentration of a solution containing 0.2 mol of NaCl in 500mL of solution.",
    options: ["0.4 mol/L", "0.2 mol/L", "0.1 mol/L", "2.5 mol/L"],
    answer: 0,
    explanation: "Concentration = moles/volume(L) = 0.2/0.5 = 0.4 mol/L."
  },
  {
    question: "In the reaction 2Al + 3CuSO₄ → Al₂(SO₄)₃ + 3Cu, if 4 moles of Al react completely, how many moles of Cu are produced?",
    options: ["2 mol", "4 mol", "6 mol", "3 mol"],
    answer: 2,
    explanation: "Mole ratio of Al:Cu is 2:3, so 4 moles of Al produces (4×3)/2 = 6 moles of Cu."
  },
  {
    question: "What is the limiting reagent when 4 moles of H₂ react with 1 mole of O₂ in the equation 2H₂ + O₂ → 2H₂O?",
    options: ["Both are used up completely", "Neither, water is limiting", "O₂", "H₂"],
    answer: 2,
    explanation: "The required ratio is 2H₂:1O₂. With 1 mole O₂ requiring 2 moles H₂, but 4 moles H₂ available exceeds what's needed, meaning O₂ runs out first, making it the limiting reagent, while H₂ is in excess."
  },
  {
    question: "Calculate the percentage yield if a reaction theoretically should produce 50g of product, but only 40g is actually obtained.",
    options: ["90%", "10%", "80%", "125%"],
    answer: 2,
    explanation: "Percentage yield = (actual yield/theoretical yield) × 100 = (40/50) × 100 = 80%."
  },
  {
    question: "According to the Arrhenius theory, an acid is a substance that:",
    options: ["Produces hydrogen ions (H⁺) in aqueous solution", "Produces hydroxide ions (OH⁻) in solution", "Accepts electron pairs", "Accepts protons"],
    answer: 0,
    explanation: "The Arrhenius definition specifically states that acids increase the concentration of H⁺ ions (or H₃O⁺) when dissolved in water, distinguishing them from bases which produce OH⁻ ions."
  },
  {
    question: "Calculate the pH of a solution with [H⁺] = 1×10⁻⁴ mol/L.",
    options: ["0.0001", "-4", "4", "10"],
    answer: 2,
    explanation: "pH = -log[H⁺] = -log(1×10⁻⁴) = 4."
  },
  {
    question: "A neutralization reaction between an acid and a base produces:",
    options: ["Only a salt", "Only water", "Salt and hydrogen gas", "Salt and water"],
    answer: 3,
    explanation: "The general neutralization reaction is Acid + Base → Salt + Water, where the acid's hydrogen ions combine with the base's hydroxide ions to form water, while the remaining ions form a salt."
  },
  {
    question: "Which of the following is classified as a strong acid?",
    options: ["Carbonic acid", "Citric acid", "Acetic acid", "Hydrochloric acid"],
    answer: 3,
    explanation: "Hydrochloric acid completely dissociates in water, releasing all its H⁺ ions, classifying it as a strong acid, unlike acetic, carbonic, and citric acids which only partially ionize (weak acids)."
  },
  {
    question: "A solution with pH 9 is:",
    options: ["Strongly acidic to neutral", "Strongly acidic", "Basic (alkaline)", "Neutral"],
    answer: 2,
    explanation: "On the pH scale, values above 7 indicate basic (alkaline) solutions, with pH 9 being moderately basic (pH 7 is neutral, below 7 is acidic)."
  },
  {
    question: "Which of the following salts would produce an acidic solution when dissolved in water?",
    options: ["NH₄Cl (weak base + strong acid)", "KNO₃ (strong acid + strong base)", "CH₃COONa (weak acid + strong base)", "NaCl (strong acid + strong base)"],
    answer: 0,
    explanation: "Salts formed from a weak base and strong acid (like NH₄Cl) hydrolyze in water to produce an acidic solution, as the ammonium ion releases H⁺ ions upon reaction with water."
  },
  {
    question: "Calculate the volume of 0.1M HCl needed to neutralize 25mL of 0.2M NaOH.",
    options: ["50mL", "12.5mL", "100mL", "25mL"],
    answer: 0,
    explanation: "Using M1V1 = M2V2 (moles of acid = moles of base for 1:1 reaction): 0.1×V1 = 0.2×25, so V1 = 5/0.1 = 50mL."
  },
  {
    question: "Which indicator turns pink in basic solutions and remains colorless in acidic solutions?",
    options: ["Methyl orange", "Litmus", "Phenolphthalein", "Universal indicator"],
    answer: 2,
    explanation: "Phenolphthalein is a common indicator that remains colorless in acidic/neutral solutions but turns distinctly pink/magenta in basic solutions (pH>8.2), commonly used in titrations."
  },
  {
    question: "According to the Bronsted-Lowry theory, a base is defined as a substance that:",
    options: ["Produces OH⁻ ions only", "Donates electron pairs only", "Accepts protons", "Donates protons"],
    answer: 2,
    explanation: "The Bronsted-Lowry theory broadens the definition of bases beyond Arrhenius theory, defining a base as any species capable of accepting a proton (H⁺), regardless of whether it produces OH⁻ ions."
  },
  {
    question: "Which type of salt is formed when a strong acid completely reacts with a strong base?",
    options: ["Amphoteric salt", "Acidic salt", "Neutral salt", "Basic salt"],
    answer: 2,
    explanation: "When a strong acid (fully dissociating, providing H⁺) reacts completely with a strong base (fully dissociating, providing OH⁻), the resulting salt doesn't hydrolyze significantly, producing a neutral solution (pH≈7)."
  },
  {
    question: "In a redox reaction, oxidation is defined as:",
    options: ["Gain of protons", "Loss of electrons", "Gain of electrons", "Loss of protons"],
    answer: 1,
    explanation: "Oxidation is specifically defined as the loss of electrons by a substance, resulting in an increase in oxidation state, while reduction (the opposite process) involves gaining electrons."
  },
  {
    question: "In the reaction Zn + Cu²⁺ → Zn²⁺ + Cu, which species is reduced?",
    options: ["Cu²⁺", "Zn²⁺", "Zn", "Cu"],
    answer: 0,
    explanation: "Cu²⁺ gains 2 electrons to become Cu (reduction, decrease in oxidation state from +2 to 0), while Zn loses electrons to become Zn²⁺ (oxidation)."
  },
  {
    question: "What is the oxidation state of chlorine in KClO₃?",
    options: ["+1", "+5", "+3", "-1"],
    answer: 1,
    explanation: "In KClO₃, K is +1 and O is -2 (×3=-6). For neutral compound: +1 + Cl + (-6) = 0, so Cl = +5."
  },
  {
    question: "A reducing agent in a redox reaction:",
    options: ["Remains unchanged throughout the reaction", "Gets reduced itself while causing oxidation of another substance", "Only exists in acidic solutions", "Gets oxidized itself while causing reduction of another substance"],
    answer: 3,
    explanation: "A reducing agent donates electrons to another substance (causing that substance to be reduced), and in doing so, the reducing agent itself becomes oxidized (loses electrons)."
  },
  {
    question: "Which half-reaction represents oxidation?",
    options: ["Neither represents oxidation", "Fe³⁺ + e⁻ → Fe²⁺ (reduction)", "Both represent oxidation", "Fe²⁺ → Fe³⁺ + e⁻ (oxidation)"],
    answer: 3,
    explanation: "Fe²⁺ → Fe³⁺ + e⁻ shows iron losing an electron (increasing oxidation state from +2 to +3), which is the definition of oxidation."
  },
  {
    question: "Balance the redox equation (in acidic medium): MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺. What coefficient is needed for Fe²⁺?",
    options: ["2", "1", "5", "3"],
    answer: 2,
    explanation: "MnO₄⁻ undergoes a 5-electron reduction (Mn: +7→+2), while Fe²⁺→Fe³⁺ is a 1-electron oxidation. To balance electrons, 5 Fe²⁺ ions are needed for every 1 MnO₄⁻ ion."
  },
  {
    question: "Which of the following is an example of a disproportionation reaction?",
    options: ["Zn + CuSO₄ → ZnSO₄ + Cu", "Cl₂ + H₂O → HCl + HOCl", "NaOH + HCl → NaCl + H₂O", "2H₂ + O₂ → 2H₂O"],
    answer: 1,
    explanation: "Disproportionation occurs when the same element is simultaneously oxidized and reduced within a single reaction — chlorine (0 oxidation state) forms both HCl (-1) and HOCl (+1), demonstrating this dual change."
  },
  {
    question: "In electrolysis, oxidation occurs at which electrode?",
    options: ["Cathode", "Neither electrode", "Anode", "Both electrodes equally"],
    answer: 2,
    explanation: "By convention, oxidation always occurs at the anode (loss of electrons) in both electrolytic and galvanic cells, while reduction occurs at the cathode."
  },
  {
    question: "What is the oxidation number of sulfur in H₂SO₄?",
    options: ["+2", "+4", "+6", "-2"],
    answer: 2,
    explanation: "In H₂SO₄, H is +1(×2=+2) and O is -2(×4=-8). For neutral compound: +2 + S + (-8) = 0, so S = +6."
  },
  {
    question: "A redox reaction always involves:",
    options: ["Simultaneous oxidation and reduction", "Only oxidation", "Only reduction", "Neither oxidation nor reduction"],
    answer: 0,
    explanation: "By definition, redox (reduction-oxidation) reactions always involve both processes occurring simultaneously — electrons lost by one species (oxidation) must be gained by another (reduction)."
  },
  {
    question: "In a galvanic (voltaic) cell, chemical energy is converted to:",
    options: ["Mechanical energy", "Nuclear energy", "Electrical energy", "Heat energy only"],
    answer: 2,
    explanation: "Galvanic cells harness spontaneous redox reactions to generate electrical energy from chemical energy, forming the basis of batteries."
  },
  {
    question: "In electrolysis, which type of energy conversion occurs?",
    options: ["Chemical to electrical energy", "Mechanical to chemical energy", "Thermal to electrical energy", "Electrical to chemical energy"],
    answer: 3,
    explanation: "Electrolysis uses an external electrical energy source to drive a non-spontaneous chemical reaction, converting electrical energy into chemical energy (opposite of a galvanic cell)."
  },
  {
    question: "Calculate the mass of copper deposited when 2 Faradays of electricity pass through a copper sulfate solution. (Cu=64, Cu²⁺ + 2e⁻ → Cu)",
    options: ["64g", "32g", "16g", "128g"],
    answer: 0,
    explanation: "2 Faradays = 2 moles of electrons. Since 2 moles of electrons deposit 1 mole of Cu (from the half-equation), mass = 1 × 64 = 64g."
  },
  {
    question: "The standard hydrogen electrode has a defined standard reduction potential of:",
    options: ["+0.5V", "+1.0V", "0V", "-1.0V"],
    answer: 2,
    explanation: "By international convention, the standard hydrogen electrode (SHE) is arbitrarily assigned a standard reduction potential of exactly 0V, serving as the reference point for measuring all other electrode potentials."
  },
  {
    question: "In a Daniell cell, which metal acts as the anode?",
    options: ["Platinum", "Copper", "Zinc", "Silver"],
    answer: 2,
    explanation: "In a classic Daniell cell, zinc (more reactive, higher tendency to lose electrons) acts as the anode, undergoing oxidation, while copper acts as the cathode."
  },
  {
    question: "Faraday's first law of electrolysis states that the mass of substance deposited is directly proportional to:",
    options: ["Quantity of electricity passed (charge)", "Current only", "Voltage applied", "Time only"],
    answer: 0,
    explanation: "Faraday's first law specifically states that mass deposited/liberated during electrolysis is directly proportional to the total quantity of electric charge (Q=It) passed through the electrolyte."
  },
  {
    question: "Which electrode in an electrolytic cell attracts positive ions (cations)?",
    options: ["Cathode", "Neither electrode", "Anode", "Both electrodes equally"],
    answer: 0,
    explanation: "The cathode is negatively charged in an electrolytic cell, attracting positively charged cations, which then gain electrons (reduction) at this electrode."
  },
  {
    question: "Calculate the number of Faradays required to deposit 108g of silver. (Ag=108, Ag⁺ + e⁻ → Ag)",
    options: ["4 F", "2 F", "0.5 F", "1 F"],
    answer: 3,
    explanation: "108g of Ag = 108/108 = 1 mole. Since 1 mole of electrons deposits 1 mole of Ag (1:1 ratio from half-equation), 1 Faraday is required."
  },
  {
    question: "The salt bridge in a galvanic cell serves to:",
    options: ["Prevent any ion movement between half-cells", "Complete the circuit and maintain electrical neutrality between half-cells", "Increase the voltage of the cell", "Generate electricity directly"],
    answer: 1,
    explanation: "The salt bridge allows ion flow between half-cells to balance charge buildup (maintaining electrical neutrality) as the reaction proceeds, without allowing direct mixing of the two solutions."
  },
  {
    question: "Which factor does NOT affect the amount of substance deposited during electrolysis?",
    options: ["Time of electrolysis", "Chemical equivalent of the substance", "Color of the electrolyte", "Current strength"],
    answer: 2,
    explanation: "According to Faraday's laws, the amount of substance deposited depends on current, time, and the chemical equivalent weight of the substance — the color of the electrolyte solution has no bearing on deposition amount."
  },
  {
    question: "Which state of matter has particles arranged in a fixed, orderly pattern with minimal movement?",
    options: ["Liquid", "Solid", "Plasma", "Gas"],
    answer: 1,
    explanation: "Solids have particles held tightly together in fixed positions (often in a crystalline lattice), allowing only vibrational movement, unlike liquids and gases where particles have greater freedom of motion."
  },
  {
    question: "The process of a gas changing directly to a solid is called:",
    options: ["Evaporation", "Condensation", "Sublimation", "Deposition"],
    answer: 3,
    explanation: "Deposition is the reverse of sublimation, referring to a gas transitioning directly into a solid state without passing through the liquid phase (e.g., frost formation)."
  },
  {
    question: "Which factor increases the rate of evaporation of a liquid?",
    options: ["Decreasing temperature", "Increasing atmospheric pressure", "Increasing surface area", "Decreasing surface area"],
    answer: 2,
    explanation: "A larger surface area exposes more liquid molecules to the surface, increasing the likelihood of molecules gaining sufficient energy to escape into the gas phase, thus increasing evaporation rate."
  },
  {
    question: "Plasma is often described as the fourth state of matter because it consists of:",
    options: ["Solid particles suspended in gas", "Ionized gas with free electrons and ions", "Neutral atoms only", "A mixture of solid and liquid"],
    answer: 1,
    explanation: "Plasma consists of a highly ionized gas containing free electrons and positive ions, giving it unique electrical and magnetic properties distinct from ordinary gases."
  },
  {
    question: "During melting, the temperature of a substance:",
    options: ["Increases steadily", "Remains constant until melting is complete", "Decreases steadily", "Fluctuates randomly"],
    answer: 1,
    explanation: "During a phase change (like melting), temperature remains constant because the energy absorbed goes into breaking intermolecular forces (latent heat) rather than increasing kinetic energy/temperature."
  },
  {
    question: "Which intermolecular forces are strongest, generally leading to higher boiling points?",
    options: ["London dispersion forces", "Van der Waals forces", "Dipole-dipole forces", "Hydrogen bonds"],
    answer: 3,
    explanation: "Among common intermolecular forces, hydrogen bonds (a special, strong type of dipole-dipole interaction involving H bonded to highly electronegative atoms like O, N, F) are generally the strongest, significantly raising boiling points."
  },
  {
    question: "The kinetic theory of matter states that particles in a gas:",
    options: ["Are stationary", "Are tightly packed with strong forces", "Move randomly and rapidly with negligible intermolecular forces", "Vibrate only around fixed points"],
    answer: 2,
    explanation: "Kinetic theory describes gas particles as being in constant, random, rapid motion, with negligible attractive forces between them (compared to liquids/solids), explaining gas behavior like compressibility and diffusion."
  },
  {
    question: "Which change of state involves the release of energy (exothermic)?",
    options: ["Boiling", "Freezing", "Sublimation (solid to gas)", "Melting"],
    answer: 1,
    explanation: "Freezing (liquid to solid) is exothermic because energy is released as particles lose kinetic energy and form more ordered structures with stronger intermolecular attractions, unlike melting/boiling/sublimation which require energy input (endothermic)."
  },
  {
    question: "Brownian motion provides evidence for:",
    options: ["The existence of atoms only", "Chemical bonding", "Constant random motion of particles in a fluid", "The structure of solids"],
    answer: 2,
    explanation: "Brownian motion (random movement of visible particles suspended in fluid) provides direct observable evidence for the constant, random motion of invisible molecules colliding with larger suspended particles."
  },
  {
    question: "Which of the following best explains why gases can be easily compressed compared to liquids and solids?",
    options: ["Gas particles are stationary", "Gas particles have large spaces between them", "Gas particles are chemically different", "Gas particles have no mass"],
    answer: 1,
    explanation: "Unlike liquids and solids where particles are closely packed, gas particles have large spaces between them, allowing significant reduction in volume when pressure is applied (compression)."
  },
];

const CHEMISTRYC = [
  {
    question: "A gas occupies 6L at 300K. Calculate its volume at 400K if pressure remains constant.",
    options: ["3L", "6L", "8L", "4.5L"],
    answer: 2,
    explanation: "Using Charles' Law (V1/T1 = V2/T2): 6/300 = V2/400, so V2 = (6×400)/300 = 8L."
  },
  {
    question: "According to the ideal gas equation PV=nRT, if temperature and moles remain constant, doubling pressure will cause volume to:",
    options: ["Double", "Remain the same", "Quadruple", "Halve"],
    answer: 3,
    explanation: "With n and T constant, PV=nRT simplifies to PV=constant (Boyle's Law), meaning pressure and volume are inversely proportional — doubling pressure halves volume."
  },
  {
    question: "Calculate the number of moles of gas in a 10L container at 2 atm and 300K. (R = 0.0821 L·atm/mol·K)",
    options: ["2.44 mol", "1.22 mol", "0.81 mol", "0.41 mol"],
    answer: 2,
    explanation: "Using PV=nRT: n = PV/RT = (2×10)/(0.0821×300) = 20/24.63 ≈ 0.81 mol."
  },
  {
    question: "Dalton's Law of partial pressures states that the total pressure of a gas mixture equals:",
    options: ["The pressure of the most abundant gas only", "The sum of partial pressures of individual gases", "The average of individual gas pressures", "The product of individual gas pressures"],
    answer: 1,
    explanation: "Dalton's Law states that in a mixture of non-reacting gases, the total pressure equals the sum of the partial pressures each gas would exert if it alone occupied the entire volume."
  },
  {
    question: "A sample of gas at STP (0°C, 1 atm) occupies 22.4L. If temperature increases to 273°C at constant pressure, what happens to volume?",
    options: ["Halves", "Triples", "Doubles", "Remains the same"],
    answer: 2,
    explanation: "Converting to Kelvin: initial T=273K, final T=273+273=546K. Since V∝T at constant pressure, and 546K is double 273K, volume doubles."
  },
  {
    question: "Graham's Law of diffusion states that the rate of diffusion of a gas is inversely proportional to:",
    options: ["Its pressure", "Its volume", "Its temperature", "The square root of its molar mass"],
    answer: 3,
    explanation: "Graham's Law states that lighter gases diffuse faster than heavier ones, with rate of diffusion inversely proportional to the square root of molar mass (rate ∝ 1/√M)."
  },
  {
    question: "Calculate the volume of 5 moles of gas at STP.",
    options: ["44.8L", "112L", "5L", "22.4L"],
    answer: 1,
    explanation: "Volume = moles × molar volume at STP = 5 × 22.4 = 112L."
  },
  {
    question: "Which gas law combines the relationships between pressure, volume, and temperature into one equation?",
    options: ["Boyle's Law", "Charles' Law", "Avogadro's Law", "Combined Gas Law"],
    answer: 3,
    explanation: "The Combined Gas Law (P1V1/T1 = P2V2/T2) merges Boyle's, Charles', and Gay-Lussac's laws into a single relationship, useful when multiple variables change simultaneously."
  },
  {
    question: "Real gases deviate from ideal behavior because ideal gas assumptions ignore:",
    options: ["Gas color", "Gas density", "Intermolecular forces and molecular volume", "Chemical reactivity"],
    answer: 2,
    explanation: "The ideal gas law assumes no intermolecular forces and negligible molecular volume — real gases deviate from this ideal behavior, especially at high pressure and low temperature, where these factors become significant."
  },
  {
    question: "A 2L container holds nitrogen gas at 3 atm. If transferred to a 6L container at the same temperature, what is the new pressure?",
    options: ["6 atm", "1 atm", "9 atm", "0.5 atm"],
    answer: 1,
    explanation: "Using Boyle's Law (P1V1=P2V2): 3×2 = P2×6, so P2 = 6/6 = 1 atm."
  },
  {
    question: "An exothermic reaction is one where:",
    options: ["Only heat is absorbed, never released", "Energy is released to the surroundings", "Energy is absorbed from the surroundings", "No energy change occurs"],
    answer: 1,
    explanation: "Exothermic reactions release energy (usually as heat) to the surroundings, resulting in products having lower energy than reactants, often causing a temperature increase in the surroundings."
  },
  {
    question: "Calculate the enthalpy change when 2 moles of methane burn, given ΔH = -890 kJ/mol for the combustion of methane.",
    options: ["+1780 kJ", "-445 kJ", "-890 kJ", "-1780 kJ"],
    answer: 3,
    explanation: "Total enthalpy change = moles × ΔH per mole = 2 × (-890) = -1780 kJ."
  },
  {
    question: "Which of the following best describes an endothermic reaction?",
    options: ["Products have lower energy than reactants", "Reactants absorb energy, resulting in products with higher energy", "Energy is released to surroundings", "Temperature of surroundings increases"],
    answer: 1,
    explanation: "Endothermic reactions absorb energy from surroundings (often causing a temperature decrease in surroundings), resulting in products having higher energy content than the original reactants."
  },
  {
    question: "Activation energy is best defined as:",
    options: ["The energy difference between reactants and products", "The energy absorbed during bond breaking only", "The minimum energy required for reactants to form products", "The total energy released in a reaction"],
    answer: 2,
    explanation: "Activation energy represents the energy barrier that must be overcome for a reaction to proceed — the minimum energy needed for reactant particles to successfully collide and transform into products."
  },
  {
    question: "According to Hess's Law, the total enthalpy change for a reaction:",
    options: ["Depends on the specific pathway taken", "Cannot be calculated indirectly", "Only applies to exothermic reactions", "Is independent of the reaction pathway (depends only on initial and final states)"],
    answer: 3,
    explanation: "Hess's Law states that enthalpy change is a state function, meaning total energy change depends only on the initial and final states, regardless of the specific reaction pathway or number of steps taken."
  },
  {
    question: "In an energy profile diagram, the difference between the energy of reactants and the peak (transition state) represents:",
    options: ["Activation energy", "Lattice energy", "Enthalpy change", "Bond energy"],
    answer: 0,
    explanation: "The activation energy is specifically represented as the energy difference between the reactants' initial energy level and the highest point (transition state/activated complex) on the energy profile diagram."
  },
  {
    question: "Calculate the enthalpy change for a reaction where bonds broken require 500kJ and bonds formed release 650kJ.",
    options: ["-150kJ", "+1150kJ", "+150kJ", "-1150kJ"],
    answer: 0,
    explanation: "ΔH = Energy absorbed (bonds broken) - Energy released (bonds formed) = 500 - 650 = -150kJ (negative indicates exothermic reaction)."
  },
  {
    question: "A catalyst affects a chemical reaction by:",
    options: ["Providing an alternative pathway with lower activation energy", "Increasing the enthalpy change", "Being consumed in the reaction", "Shifting the equilibrium position"],
    answer: 0,
    explanation: "Catalysts speed up reactions by providing an alternative reaction pathway with lower activation energy, without being consumed or altering the overall enthalpy change of the reaction."
  },
  {
    question: "Bond breaking is generally:",
    options: ["Endothermic (requires energy)", "Energy neutral", "Only relevant in ionic compounds", "Exothermic (releases energy)"],
    answer: 0,
    explanation: "Breaking chemical bonds requires energy input to overcome the attractive forces holding atoms together, making bond breaking an endothermic process, while bond formation releases energy (exothermic)."
  },
  {
    question: "Standard enthalpy of formation refers to the enthalpy change when:",
    options: ["Bonds are broken in a reaction", "1 mole of a compound forms from its constituent elements in their standard states", "Any reaction occurs at standard conditions", "A compound decomposes into elements"],
    answer: 1,
    explanation: "Standard enthalpy of formation (ΔHf°) is specifically defined as the enthalpy change when exactly 1 mole of a compound is formed from its elements in their standard states under standard conditions (298K, 1 atm)."
  },
  {
    question: "Which factor does NOT generally affect the rate of a chemical reaction?",
    options: ["Presence of a catalyst", "Color of the container", "Concentration of reactants", "Temperature"],
    answer: 1,
    explanation: "The color of the reaction container has no chemical or physical influence on reaction rate — temperature, concentration, surface area, pressure, and catalysts are the actual factors affecting reaction rates."
  },
  {
    question: "Increasing temperature generally increases reaction rate because:",
    options: ["Particles move faster, increasing collision frequency and energy", "Particles have more mass", "Concentration automatically increases", "Particles become larger"],
    answer: 0,
    explanation: "Higher temperature gives particles more kinetic energy, causing them to move faster and collide more frequently with greater energy, increasing the likelihood of successful reactions exceeding activation energy."
  },
  {
    question: "According to collision theory, for a reaction to occur, particles must:",
    options: ["Move at the same speed", "Have identical charges", "Simply come into contact", "Collide with sufficient energy and correct orientation"],
    answer: 3,
    explanation: "Collision theory states that successful reactions require particles to not only collide but do so with energy equal to or exceeding activation energy, AND with proper geometric orientation for bond rearrangement."
  },
  {
    question: "Increasing the surface area of a solid reactant generally:",
    options: ["Increases reaction rate", "Only affects gaseous reactions", "Has no effect on reaction rate", "Decreases reaction rate"],
    answer: 0,
    explanation: "Greater surface area exposes more reactant particles to potential collisions with other reactants, increasing the frequency of successful collisions and thus increasing reaction rate (e.g., powdered vs. lump solid)."
  },
  {
    question: "A catalyst increases reaction rate by:",
    options: ["Being consumed in the reaction", "Increasing temperature", "Increasing the concentration of reactants", "Providing an alternative pathway with lower activation energy"],
    answer: 3,
    explanation: "Catalysts work by offering an alternative reaction mechanism with a lower activation energy barrier, allowing more particles to have sufficient energy to react successfully, without being permanently consumed."
  },
  {
    question: "In a reaction rate experiment, doubling the concentration of a reactant (first order) will:",
    options: ["Halve the reaction rate", "Quadruple the reaction rate", "Have no effect on rate", "Double the reaction rate"],
    answer: 3,
    explanation: "For a first-order reaction with respect to a specific reactant, the rate is directly proportional to that reactant's concentration — doubling concentration directly doubles the rate."
  },
  {
    question: "Which of the following would generally decrease reaction rate?",
    options: ["Increasing temperature", "Decreasing surface area of solid reactants", "Adding a catalyst", "Increasing concentration"],
    answer: 1,
    explanation: "Decreasing surface area reduces the number of exposed reactant particles available for collision, thereby decreasing the frequency of successful collisions and slowing reaction rate."
  },
  {
    question: "The rate of reaction is generally measured as:",
    options: ["Temperature change during reaction", "Change in concentration of reactant/product per unit time", "Total energy released", "Total time for reaction completion"],
    answer: 1,
    explanation: "Reaction rate is quantitatively defined as the change in concentration (of either reactants decreasing or products increasing) divided by the time interval over which this change occurs."
  },
  {
    question: "Why does increased pressure generally increase reaction rate for gaseous reactions?",
    options: ["It increases temperature automatically", "It has no relationship to reaction rate", "It decreases activation energy", "It decreases the volume, increasing concentration and collision frequency"],
    answer: 3,
    explanation: "Increased pressure on a gas system effectively compresses the gas into a smaller volume, increasing the concentration of gas particles and thus increasing collision frequency, leading to faster reaction rates."
  },
  {
    question: "An enzyme acts as a biological catalyst by:",
    options: ["Increasing the activation energy", "Changing the products of a reaction", "Being permanently altered during the reaction", "Lowering the activation energy of biochemical reactions"],
    answer: 3,
    explanation: "Like other catalysts, enzymes work by providing an alternative reaction pathway with lower activation energy, significantly speeding up biochemical reactions without being permanently consumed or altered."
  },
  {
    question: "At chemical equilibrium, which statement is true?",
    options: ["Only the forward reaction continues", "The concentrations of reactants and products remain constant, with forward and reverse rates equal", "The reaction has completely stopped", "All reactants have converted to products"],
    answer: 1,
    explanation: "Chemical equilibrium is a dynamic state where forward and reverse reaction rates become equal, resulting in constant (not necessarily equal) concentrations of reactants and products, even though reactions continue to occur."
  },
  {
    question: "According to Le Chatelier's Principle, if pressure is increased on a gaseous equilibrium system, the equilibrium will shift toward:",
    options: ["No shift occurs", "The side with more gas moles", "Always toward products", "The side with fewer gas moles"],
    answer: 3,
    explanation: "Le Chatelier's Principle states that increasing pressure shifts equilibrium toward the side with fewer gas moles, as this reduces the total number of gas particles and partially counteracts the pressure increase."
  },
  {
    question: "For the equilibrium N₂ + 3H₂ ⇌ 2NH₃, increasing temperature (assuming the forward reaction is exothermic) will shift equilibrium toward:",
    options: ["The reverse direction (more N₂ and H₂)", "No change occurs", "The forward direction (more NH₃)", "Complete conversion to NH₃"],
    answer: 0,
    explanation: "For an exothermic forward reaction, increasing temperature favors the endothermic reverse reaction (as the system tries to absorb the added heat), shifting equilibrium toward reactants (N₂ and H₂)."
  },
  {
    question: "The equilibrium constant (Kc) is defined as:",
    options: ["The activation energy of the reaction", "The rate of forward reaction only", "The ratio of product concentrations to reactant concentrations (raised to their stoichiometric powers) at equilibrium", "The total concentration of all species"],
    answer: 2,
    explanation: "Kc represents the ratio of equilibrium concentrations of products to reactants, each raised to the power of their stoichiometric coefficients, providing a quantitative measure of the equilibrium position."
  },
  {
    question: "If Kc is very large (>>1) for a reaction, this indicates:",
    options: ["The reaction favors products significantly", "The reaction rate is very slow", "The reaction favors reactants significantly", "The reaction is at equilibrium exactly halfway"],
    answer: 0,
    explanation: "A large Kc value indicates that at equilibrium, the concentration of products vastly exceeds that of reactants, meaning the reaction proceeds substantially toward completion (product-favored)."
  },
  {
    question: "Adding a catalyst to an equilibrium system will:",
    options: ["Have no effect on equilibrium position, only speeds up attainment of equilibrium", "Shift equilibrium toward reactants", "Shift equilibrium toward products", "Increase the value of Kc"],
    answer: 0,
    explanation: "Catalysts speed up both forward and reverse reactions equally, helping the system reach equilibrium faster, but they don't affect the equilibrium position or the value of Kc."
  },
  {
    question: "According to Le Chatelier's Principle, adding more reactant to an equilibrium system will shift equilibrium toward:",
    options: ["No shift occurs", "Depends on temperature only", "Products (forward direction)", "Reactants (reverse direction)"],
    answer: 2,
    explanation: "Increasing reactant concentration disturbs the equilibrium, and the system shifts forward (toward products) to consume some of the added reactant, partially restoring equilibrium."
  },
  {
    question: "For a reaction at equilibrium, if Kc = 1, this suggests:",
    options: ["Only reactants are present", "The reaction hasn't started", "Only products are present", "Reactant and product concentrations are comparable"],
    answer: 3,
    explanation: "When Kc equals approximately 1, it indicates that at equilibrium, neither reactants nor products are strongly favored — their concentrations are roughly comparable in magnitude."
  },
  {
    question: "Which of the following factors does NOT affect the position of equilibrium?",
    options: ["Concentration changes", "Presence of a catalyst", "Temperature", "Pressure (for gaseous systems)"],
    answer: 1,
    explanation: "While catalysts speed up the rate of reaching equilibrium, they do not shift the equilibrium position itself — only temperature, pressure, and concentration changes can shift where equilibrium lies."
  },
  {
    question: "For the equilibrium 2SO₂ + O₂ ⇌ 2SO₃, decreasing the volume of the container (increasing pressure) will shift equilibrium toward:",
    options: ["No shift occurs", "Cannot be determined", "Products (right, toward SO₃)", "Reactants (left)"],
    answer: 2,
    explanation: "The product side (2 moles SO₃) has fewer total gas moles than the reactant side (2+1=3 moles), so decreasing volume/increasing pressure shifts equilibrium toward the side with fewer moles — favoring SO₃ production."
  },
  {
    question: "Solubility is generally defined as:",
    options: ["The rate at which a solute dissolves", "The color change during dissolution", "The total volume of solution", "The maximum amount of solute that dissolves in a given amount of solvent at a specific temperature"],
    answer: 3,
    explanation: "Solubility specifically refers to the maximum quantity of a solute that can dissolve in a specified amount of solvent at a given temperature, forming a saturated solution."
  },
  {
    question: "Which of the following generally increases the solubility of most solid solutes in water?",
    options: ["Decreasing pressure", "Decreasing temperature", "Increasing temperature", "Adding more solute beyond saturation"],
    answer: 2,
    explanation: "For most solid solutes, increasing temperature provides more kinetic energy to break intermolecular forces, allowing more solute particles to dissolve, thus increasing solubility."
  },
  {
    question: "A saturated solution is one where:",
    options: ["The maximum amount of solute has dissolved at that temperature, with excess undissolved solute present", "The solvent has completely evaporated", "No solute has been added yet", "The solution is unstable and will decompose"],
    answer: 0,
    explanation: "A saturated solution contains the maximum dissolvable amount of solute at a given temperature, existing in equilibrium with any undissolved excess solute present."
  },
  {
    question: "Calculate the concentration (in mol/L) of a solution containing 5.85g of NaCl dissolved in 500mL of water. (Na=23, Cl=35.5)",
    options: ["1.0 mol/L", "0.2 mol/L", "0.5 mol/L", "0.1 mol/L"],
    answer: 1,
    explanation: "Molar mass NaCl = 23+35.5 = 58.5 g/mol. Moles = 5.85/58.5 = 0.1 mol. Concentration = 0.1mol/0.5L = 0.2 mol/L."
  },
  {
    question: "Which of the following best describes an unsaturated solution?",
    options: ["Cannot dissolve any more solute", "Contains exactly the saturation point of solute", "Contains more solute than can dissolve", "Contains less solute than the maximum that could dissolve at that temperature"],
    answer: 3,
    explanation: "An unsaturated solution has dissolved less solute than the maximum solubility limit at that specific temperature, meaning additional solute could still dissolve if added."
  },
  {
    question: "How does increasing pressure typically affect the solubility of a gas in a liquid?",
    options: ["Has no effect on gas solubility", "Decreases gas solubility", "Only affects solid solubility", "Increases gas solubility"],
    answer: 3,
    explanation: "According to Henry's Law, increasing pressure above a liquid increases the solubility of a gas within that liquid, as higher pressure forces more gas molecules into solution (e.g., carbonated beverages)."
  },
  {
    question: "A supersaturated solution contains:",
    options: ["No solute at all", "Less solute than the saturation point", "Exactly the saturation point of solute", "More dissolved solute than would normally be possible at that temperature (unstable state)"],
    answer: 3,
    explanation: "Supersaturated solutions contain more dissolved solute than the normal saturation limit at that temperature, achieved through careful preparation (like slow cooling) — these solutions are inherently unstable and can rapidly crystallize if disturbed."
  },
  {
    question: "Calculate the mass of solute needed to prepare 250mL of a 0.4M NaOH solution. (Na=23, O=16, H=1)",
    options: ["4g", "8g", "10g", "2g"],
    answer: 0,
    explanation: "Moles needed = M×V = 0.4×0.25 = 0.1 mol. Molar mass NaOH = 40g/mol. Mass = 0.1×40 = 4g."
  },
  {
    question: "Which of the following factors does NOT typically affect solubility?",
    options: ["Nature of solute and solvent", "Container shape", "Temperature", "Pressure (for gases)"],
    answer: 1,
    explanation: "The physical shape of the container holding a solution has no chemical influence on solubility — temperature, pressure (for gases), and the chemical nature of solute/solvent (like polarity) are the actual determining factors."
  },
  {
    question: "The principle \"like dissolves like\" refers to:",
    options: ["Only solids dissolving in solids", "Polar solvents dissolving polar solutes, and non-polar solvents dissolving non-polar solutes", "Temperature having no effect on solubility", "Only gases dissolving in gases"],
    answer: 1,
    explanation: "This fundamental solubility principle explains that substances with similar polarity/intermolecular force characteristics tend to be mutually soluble (e.g., polar water dissolves polar/ionic compounds, while non-polar solvents dissolve non-polar substances like oils)."
  },
];

const CHEMISTRYD = [
  {
    question: "Which functional group characterizes alcohols?",
    options: ["-COOH", "-CHO", "-OH", "-NH₂"],
    answer: 2,
    explanation: "The hydroxyl group (-OH) attached to a carbon chain is the defining functional group of alcohols, distinguishing them from other organic compound classes."
  },
  {
    question: "What is the general formula for alkanes?",
    options: ["CₙH₂ₙ₊₂", "CₙH₂ₙ₊₁", "CₙH₂ₙ₋₂", "CₙH₂ₙ"],
    answer: 0,
    explanation: "Alkanes are saturated hydrocarbons with only single bonds, following the general formula CₙH₂ₙ₊₂ (e.g., methane CH₄, ethane C₂H₆)."
  },
  {
    question: "Which type of hydrocarbon contains at least one carbon-carbon double bond?",
    options: ["Alkane", "Alkyne", "Cycloalkane", "Alkene"],
    answer: 3,
    explanation: "Alkenes are unsaturated hydrocarbons characterized by at least one C=C double bond, following the general formula CₙH₂ₙ, distinguishing them from fully saturated alkanes."
  },
  {
    question: "What is the name of the organic compound CH₃COOH?",
    options: ["Methanol", "Methanoic acid", "Ethanoic acid (acetic acid)", "Ethanol"],
    answer: 2,
    explanation: "CH₃COOH is ethanoic acid (commonly known as acetic acid), characterized by the carboxylic acid functional group (-COOH), commonly found in vinegar."
  },
  {
    question: "Which reaction type converts an alkene into an alkane?",
    options: ["Hydrogenation (addition of H₂)", "Oxidation", "Esterification", "Substitution"],
    answer: 0,
    explanation: "Hydrogenation involves adding hydrogen atoms across the double bond of an alkene, converting it into a saturated alkane, commonly used industrially (e.g., converting vegetable oils to margarine)."
  },
  {
    question: "Isomers are compounds that have:",
    options: ["Different elements entirely", "The same molecular formula but different structural arrangements", "Identical properties in all aspects", "Different molecular formulas but same structure"],
    answer: 1,
    explanation: "Isomers share identical molecular formulas (same types and numbers of atoms) but differ in how these atoms are structurally arranged, often resulting in different physical/chemical properties."
  },
  {
    question: "Which functional group is present in ketones?",
    options: ["-NH₂", "-COOH", "C=O (carbonyl, between two carbon groups)", "-OH"],
    answer: 2,
    explanation: "Ketones are characterized by a carbonyl group (C=O) positioned between two carbon-containing groups (R-CO-R'), distinguishing them from aldehydes where the carbonyl is at the end of the chain."
  },
  {
    question: "The process of converting an alcohol into a carboxylic acid is called:",
    options: ["Oxidation", "Esterification", "Reduction", "Hydrolysis"],
    answer: 0,
    explanation: "Oxidation of primary alcohols (using oxidizing agents) converts them first to aldehydes, then further to carboxylic acids, involving loss of hydrogen and gain of oxygen."
  },
  {
    question: "What type of reaction occurs between an alcohol and a carboxylic acid to form an ester?",
    options: ["Addition reaction", "Elimination reaction", "Substitution reaction", "Esterification (condensation reaction)"],
    answer: 3,
    explanation: "Esterification is a condensation reaction where an alcohol reacts with a carboxylic acid, releasing water and forming an ester bond, commonly catalyzed by an acid catalyst."
  },
  {
    question: "Polymerization is the process where:",
    options: ["Molecules undergo combustion", "Large molecules break down into smaller units", "Atoms are ionized", "Small molecules (monomers) combine to form large molecules (polymers)"],
    answer: 3,
    explanation: "Polymerization involves the joining of numerous small, repeating molecular units (monomers) through chemical bonds to create large macromolecules (polymers), such as forming polyethylene from ethylene monomers."
  },
  {
    question: "Which gas is primarily responsible for the greenhouse effect and is a product of complete combustion of hydrocarbons?",
    options: ["Methane", "Carbon monoxide", "Carbon dioxide", "Nitrogen dioxide"],
    answer: 2,
    explanation: "Carbon dioxide (CO₂) is produced during complete combustion of hydrocarbons and is a major greenhouse gas, trapping heat in the atmosphere and contributing significantly to global warming."
  },
  {
    question: "The Haber process is industrially used to produce:",
    options: ["Ammonia", "Sulfuric acid", "Nitric acid", "Sodium hydroxide"],
    answer: 0,
    explanation: "The Haber process combines nitrogen and hydrogen gases under high pressure/temperature with an iron catalyst to synthesize ammonia (N₂ + 3H₂ ⇌ 2NH₃), crucial for fertilizer production."
  },
  {
    question: "Which of the following is a property of Group 17 elements (halogens)?",
    options: ["Metallic in nature", "Highly unreactive", "Highly reactive, existing as diatomic molecules", "Form only positive ions"],
    answer: 2,
    explanation: "Halogens (Group 17) are highly reactive non-metals that naturally exist as diatomic molecules (F₂, Cl₂, Br₂, I₂), readily forming compounds by gaining one electron to achieve stable octet configuration."
  },
  {
    question: "The Contact process is used industrially to manufacture:",
    options: ["Ammonia", "Sulfuric acid", "Sodium carbonate", "Nitric acid"],
    answer: 1,
    explanation: "The Contact process converts sulfur dioxide to sulfur trioxide (using a vanadium(V) oxide catalyst), which then reacts with water to produce sulfuric acid (H₂SO₄), one of the most important industrial chemicals."
  },
  {
    question: "Which property makes carbon unique among elements, allowing it to form millions of organic compounds?",
    options: ["High electronegativity", "High metallic character", "Large atomic radius", "Ability to form four covalent bonds and catenate (bond to itself extensively)"],
    answer: 3,
    explanation: "Carbon's ability to form four strong covalent bonds and catenate (create long chains/rings by bonding to other carbon atoms) provides the structural diversity necessary for the vast array of organic compounds."
  },
  {
    question: "What is the main component of natural gas?",
    options: ["Butane", "Propane", "Methane", "Ethane"],
    answer: 2,
    explanation: "Natural gas is predominantly composed of methane (CH₄), typically making up 70-90% of its composition, along with smaller amounts of other hydrocarbons."
  },
  {
    question: "Which alkali metal reacts most vigorously with water?",
    options: ["Potassium", "Sodium", "Lithium", "Cesium (among common lab alkali metals)"],
    answer: 3,
    explanation: "Reactivity of alkali metals increases down Group 1 due to decreasing ionization energy (larger atomic radius, weaker attraction to outermost electron), making cesium react most vigorously with water among the commonly discussed alkali metals."
  },
  {
    question: "Which industrial process is used to extract aluminum from its ore (bauxite)?",
    options: ["Solvay process", "Hall-Héroult process (electrolysis)", "Contact process", "Haber process"],
    answer: 1,
    explanation: "The Hall-Héroult process uses electrolysis of molten aluminum oxide (dissolved in cryolite to lower melting point) to extract pure aluminum metal, as aluminum is too reactive to be extracted by simple reduction methods."
  },
  {
    question: "Transition metals are characterized by their ability to:",
    options: ["Exist only as gases", "Be highly reactive with water", "Form only one oxidation state", "Form colored compounds and multiple oxidation states"],
    answer: 3,
    explanation: "Transition metals typically exhibit variable oxidation states and form colored compounds/ions due to unique d-orbital electron configurations, distinguishing them from main group elements."
  },
  {
    question: "Which gas is produced when metal carbonates react with dilute acids?",
    options: ["Sulfur dioxide", "Carbon dioxide", "Hydrogen", "Oxygen"],
    answer: 1,
    explanation: "Metal carbonates react with acids to release carbon dioxide gas, along with forming a salt and water (e.g., CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂)."
  },
  {
    question: "Acid rain is primarily caused by atmospheric pollution from:",
    options: ["Carbon dioxide only", "Water vapor", "Oxygen and nitrogen", "Sulfur dioxide and nitrogen oxides"],
    answer: 3,
    explanation: "Sulfur dioxide (from burning fossil fuels) and nitrogen oxides (from vehicle emissions/industrial processes) react with atmospheric water vapor to form sulfuric and nitric acids, falling as acid rain."
  },
  {
    question: "Which gas is primarily responsible for depleting the ozone layer?",
    options: ["Methane", "Nitrogen", "Carbon dioxide", "Chlorofluorocarbons (CFCs)"],
    answer: 3,
    explanation: "CFCs release chlorine atoms when broken down by UV radiation in the stratosphere, and these chlorine atoms catalytically destroy ozone molecules, significantly depleting the protective ozone layer."
  },
  {
    question: "The greenhouse effect refers to:",
    options: ["The trapping of heat by certain atmospheric gases, warming Earth's surface", "The cooling of Earth's atmosphere", "The depletion of oxygen in the atmosphere", "The formation of acid rain"],
    answer: 0,
    explanation: "The greenhouse effect describes how certain gases (CO₂, methane, water vapor) absorb and re-radiate infrared heat within Earth's atmosphere, preventing excessive heat loss to space and maintaining livable temperatures (though excessive levels cause global warming)."
  },
  {
    question: "Which of the following is a major source of carbon monoxide pollution?",
    options: ["Incomplete combustion of fossil fuels", "Complete combustion of fuels", "Photosynthesis", "Ozone depletion"],
    answer: 0,
    explanation: "Carbon monoxide (CO) forms specifically during incomplete combustion of carbon-based fuels (insufficient oxygen supply), unlike complete combustion which produces carbon dioxide."
  },
  {
    question: "Eutrophication in water bodies is primarily caused by:",
    options: ["Temperature decrease", "Excess nutrients (like nitrates/phosphates) causing algal overgrowth", "Acid rain only", "Excessive oxygen levels"],
    answer: 1,
    explanation: "Eutrophication occurs when excess nutrients (often from agricultural runoff containing nitrates and phosphates) cause excessive algae growth, which subsequently depletes oxygen levels when the algae decompose, harming aquatic life."
  },
  {
    question: "Which pollutant is primarily responsible for the formation of photochemical smog?",
    options: ["Nitrogen oxides and volatile organic compounds (VOCs) reacting with sunlight", "Sulfur dioxide", "Carbon dioxide", "Water vapor"],
    answer: 0,
    explanation: "Photochemical smog forms when nitrogen oxides and VOCs (from vehicle emissions) react with sunlight (UV radiation), producing harmful ground-level ozone and other secondary pollutants."
  },
  {
    question: "Global warming potential (GWP) is used to compare:",
    options: ["The reactivity of different gases", "The relative ability of different gases to trap heat compared to CO₂", "The toxicity of different pollutants", "The solubility of gases in water"],
    answer: 1,
    explanation: "GWP quantifies how much heat a greenhouse gas traps in the atmosphere relative to the same mass of CO₂ over a specific time period, helping assess the relative climate impact of different gases (e.g., methane has a much higher GWP than CO₂)."
  },
  {
    question: "Which of the following practices helps reduce carbon footprint?",
    options: ["Increased use of fossil fuels", "Using renewable energy sources", "Increased industrial emissions", "Deforestation"],
    answer: 1,
    explanation: "Renewable energy sources (solar, wind, hydro) produce little to no direct carbon emissions during operation, significantly reducing the carbon footprint compared to fossil fuel combustion."
  },
  {
    question: "Biodegradable pollutants are those that:",
    options: ["Are always non-toxic", "Only exist in solid form", "Cannot be broken down naturally", "Can be broken down by natural biological processes over time"],
    answer: 3,
    explanation: "Biodegradable pollutants can be decomposed by natural biological processes (bacteria, fungi, etc.) into simpler, often less harmful substances over time, unlike non-biodegradable pollutants (like plastics) which persist in the environment."
  },
  {
    question: "Which process helps mitigate the effects of excess atmospheric CO₂?",
    options: ["Deforestation", "Increased fossil fuel combustion", "Afforestation (planting trees) and carbon capture", "Ozone depletion"],
    answer: 2,
    explanation: "Trees absorb CO₂ during photosynthesis, acting as natural carbon sinks, while carbon capture technologies actively remove/store CO₂ from industrial emissions — both strategies help reduce atmospheric CO₂ concentrations."
  },
  {
    question: "Which type of radioactive emission has the least penetrating power?",
    options: ["Gamma rays", "Beta particles", "X-rays", "Alpha particles"],
    answer: 3,
    explanation: "Alpha particles, being relatively large and heavy (helium nuclei), have the least penetrating power among common radioactive emissions, easily stopped by just a sheet of paper or skin."
  },
  {
    question: "The half-life of a radioactive isotope is 5 years. After 15 years, what fraction of the original sample remains?",
    options: ["1/4", "1/16", "1/2", "1/8"],
    answer: 3,
    explanation: "15 years represents 3 half-lives (15/5=3). Remaining fraction = (1/2)³ = 1/8."
  },
  {
    question: "Nuclear fission differs from nuclear fusion in that fission involves:",
    options: ["Only occurring in stars", "Splitting heavy nuclei into lighter ones", "No change in nuclear mass", "Combining light nuclei"],
    answer: 1,
    explanation: "Nuclear fission specifically involves splitting a heavy, unstable nucleus (like Uranium-235) into two or more lighter nuclei, releasing energy, distinct from fusion which combines light nuclei."
  },
  {
    question: "Which particle is emitted during beta decay?",
    options: ["Helium nucleus", "Photon only", "High-energy electron", "Proton"],
    answer: 2,
    explanation: "Beta decay involves the emission of a high-energy, high-speed electron (or positron) from the nucleus, occurring when a neutron converts to a proton (or vice versa) within the nucleus."
  },
  {
    question: "Radioactive isotopes are commonly used in medicine for:",
    options: ["Only cancer treatment", "Only diagnostic imaging", "Both diagnostic imaging and cancer treatment", "Neither, they're only used in industry"],
    answer: 2,
    explanation: "Radioactive isotopes serve dual medical purposes: diagnostic imaging (like PET scans using specific radioactive tracers) and therapeutic treatment (like radiotherapy for cancer, using radiation to destroy cancerous cells)."
  },
  {
    question: "Which type of nuclear radiation carries no electric charge?",
    options: ["Alpha particles", "All carry charge", "Beta particles", "Gamma rays"],
    answer: 3,
    explanation: "Gamma rays are high-energy electromagnetic radiation (photons), carrying no mass and no electric charge, unlike alpha particles (+2 charge) and beta particles (-1 charge, if electrons)."
  },
  {
    question: "Carbon-14 dating is used to determine the age of:",
    options: ["Rocks and minerals only", "Water samples", "Organic materials (once-living matter)", "Metal artifacts only"],
    answer: 2,
    explanation: "Carbon-14 dating exploits the known half-life of radioactive Carbon-14 (found in organic matter) to estimate the age of once-living materials, based on measuring remaining C-14 relative to stable C-12."
  },
  {
    question: "Which safety measure is commonly used to protect against gamma radiation exposure?",
    options: ["Thick lead or concrete shielding", "Thin aluminum foil", "No shielding is necessary", "Paper shielding"],
    answer: 0,
    explanation: "Due to gamma rays' high penetrating power, only dense materials like thick lead or concrete provide effective shielding, unlike alpha (stopped by paper) or beta particles (stopped by aluminum)."
  },
  {
    question: "Nuclear power plants primarily use which process to generate energy?",
    options: ["Radioactive decay only", "Nuclear fusion", "Nuclear fission", "Chemical combustion"],
    answer: 2,
    explanation: "Current commercial nuclear power plants use controlled nuclear fission (typically of Uranium-235) to generate heat, which then produces steam to drive turbines for electricity generation."
  },
  {
    question: "What happens to the atomic number of an element during alpha decay?",
    options: ["Increases by 2", "Remains unchanged", "Decreases by 2", "Decreases by 4"],
    answer: 2,
    explanation: "Alpha decay involves emission of an alpha particle (2 protons, 2 neutrons), directly reducing the atomic number by 2 (loss of 2 protons) and mass number by 4."
  },
  {
    question: "Hard water is primarily caused by the presence of:",
    options: ["Dissolved oxygen", "Calcium and magnesium ions", "Chloride ions only", "Sodium and potassium ions"],
    answer: 1,
    explanation: "Water hardness results from dissolved calcium (Ca²⁺) and magnesium (Mg²⁺) ions, typically originating from minerals like limestone that water passes through in the ground."
  },
  {
    question: "Temporary hardness in water can be removed by:",
    options: ["Boiling the water", "Cannot be removed", "Adding acid", "Adding more calcium"],
    answer: 0,
    explanation: "Temporary hardness (caused by calcium/magnesium bicarbonates) can be removed by boiling, which decomposes the bicarbonates into insoluble carbonates that precipitate out, effectively softening the water."
  },
  {
    question: "Permanent hardness in water is caused by which type of salts?",
    options: ["Sulfates and chlorides of calcium/magnesium", "Carbonates only", "Nitrates", "Bicarbonates"],
    answer: 0,
    explanation: "Unlike temporary hardness (bicarbonates), permanent hardness results from calcium and magnesium sulfates/chlorides, which don't decompose upon boiling and require alternative softening methods (like ion exchange)."
  },
  {
    question: "Which method is commonly used to soften permanently hard water?",
    options: ["Adding more minerals", "Ion exchange (using resins or zeolites)", "Boiling only", "Simple filtration"],
    answer: 1,
    explanation: "Ion exchange methods (using ion exchange resins or zeolites) replace calcium/magnesium ions with sodium ions, effectively softening both temporary and permanent hard water where boiling alone is ineffective."
  },
  {
    question: "Hard water causes problems primarily by:",
    options: ["Changing water color", "Forming scale/scum and reducing soap effectiveness", "Increasing water's boiling point significantly", "Making water unsafe to drink"],
    answer: 1,
    explanation: "Hard water reacts with soap to form insoluble scum (reducing lathering effectiveness) and can deposit mineral scale in pipes/appliances when heated, though it's generally not harmful to drink."
  },
  {
    question: "Which test is commonly used to determine water hardness?",
    options: ["Temperature measurement", "Soap solution test (measuring lather formation)", "Color observation", "pH testing only"],
    answer: 1,
    explanation: "A classic method for detecting water hardness involves adding soap solution and observing lather formation — hard water requires significantly more soap to produce lasting lather due to calcium/magnesium ions reacting with soap first."
  },
  {
    question: "The chemical formula for limescale (commonly found in hard water deposits) is primarily:",
    options: ["NaCl", "CaSO₄", "CaCO₃", "MgCl₂"],
    answer: 2,
    explanation: "Limescale is primarily composed of calcium carbonate (CaCO₃), formed when calcium bicarbonate in temporarily hard water decomposes upon heating, depositing as solid scale."
  },
  {
    question: "Which of the following is an advantage of hard water?",
    options: ["Always tastes better", "No advantages exist", "Better lathering with soap", "Prevents lead poisoning by coating pipes with protective mineral layer"],
    answer: 3,
    explanation: "Interestingly, hard water can form a protective mineral coating inside pipes, which can help prevent toxic metals (like lead) from leaching into the water supply, providing an unexpected health benefit."
  },
  {
    question: "Distilled water is generally:",
    options: ["Soft (free from dissolved minerals)", "Cannot be used for any purpose", "Very hard", "Contains high calcium content"],
    answer: 0,
    explanation: "The distillation process removes dissolved minerals (including calcium and magnesium), resulting in soft water that's essentially free from the ions responsible for hardness."
  },
  {
    question: "Water softening using washing soda (sodium carbonate) works by:",
    options: ["Removing all water molecules", "Precipitating calcium/magnesium ions as insoluble carbonates", "Adding more hardness ions", "Evaporating the water completely"],
    answer: 1,
    explanation: "Sodium carbonate reacts with calcium and magnesium ions in hard water, forming insoluble calcium/magnesium carbonate precipitates, effectively removing these hardness-causing ions from solution."
  },
];

const MATHSA = [
  {
    question: "Convert 25 (base 10) to binary (base 2).",
    options: ["10101", "10011", "11001", "11010"],
    answer: 2,
    explanation: "25 = 16+8+1 = 2⁴+2³+2⁰ → binary: 11001. Check: 1(16)+1(8)+0(4)+0(2)+1(1) = 25."
  },
  {
    question: "Convert 1101₂ to base 10.",
    options: ["15", "13", "11", "14"],
    answer: 1,
    explanation: "1101₂ = (1×2³)+(1×2²)+(0×2¹)+(1×2⁰) = 8+4+0+1 = 13."
  },
  {
    question: "In number base systems, the base of a number determines:",
    options: ["Whether the number is even or odd", "The total value of the number", "The number of decimal places", "The number of symbols/digits available for that system"],
    answer: 3,
    explanation: "A number base (radix) defines how many unique digit symbols exist in that system — base 10 uses digits 0-9, base 2 uses only 0-1, base 8 uses 0-7, and so on."
  },
  {
    question: "Convert 45 (base 10) to base 8 (octal).",
    options: ["54₈", "55₈", "45₈", "56₈"],
    answer: 1,
    explanation: "45÷8 = 5 remainder 5; 5÷8 = 0 remainder 5. Reading remainders bottom-up: 55₈. Check: (5×8)+5 = 45."
  },
  {
    question: "Add the following in base 2: 1011₂ + 1101₂",
    options: ["10101₂", "10111₂", "11000₂", "11001₂"],
    answer: 2,
    explanation: "1011₂(11) + 1101₂(13) = 24 in base 10. Converting 24 to binary: 16+8 = 11000₂."
  },
  {
    question: "Convert 2A₁₆ (base 16/hexadecimal) to base 10.",
    options: ["26", "44", "40", "42"],
    answer: 3,
    explanation: "In hex, A=10. So 2A₁₆ = (2×16)+(10×1) = 32+10 = 42."
  },
  {
    question: "Which of the following number bases uses digits 0-7 only?",
    options: ["Hexadecimal", "Decimal", "Octal", "Binary"],
    answer: 2,
    explanation: "Octal (base 8) uses exactly 8 digit symbols (0-7), unlike binary (0-1, base 2), decimal (0-9, base 10), or hexadecimal (0-9, A-F, base 16)."
  },
  {
    question: "Convert 111₂ to base 10.",
    options: ["5", "8", "6", "7"],
    answer: 3,
    explanation: "111₂ = (1×4)+(1×2)+(1×1) = 4+2+1 = 7."
  },
  {
    question: "Subtract in base 2: 1100₂ - 101₂",
    options: ["111₂", "1001₂", "110₂", "101₂"],
    answer: 0,
    explanation: "1100₂(12) - 101₂(5) = 7 in decimal. Converting 7 to binary: 4+2+1 = 111₂."
  },
  {
    question: "Why is base 2 (binary) fundamentally important in computer systems?",
    options: ["It was arbitrarily chosen with no technical reason", "Computer circuits naturally represent two states (on/off, 0/1)", "It's easier for humans to read", "It requires fewer digits than decimal"],
    answer: 1,
    explanation: "Binary directly corresponds to the two physical states of electronic circuits (voltage present/absent, representing 1/0), making it the natural language for digital computing hardware."
  },
  {
    question: "Convert 3/8 to a decimal.",
    options: ["0.425", "0.38", "0.325", "0.375"],
    answer: 3,
    explanation: "3÷8 = 0.375."
  },
  {
    question: "Express 0.65 as a fraction in its simplest form.",
    options: ["6/10", "65/10", "13/20", "65/100"],
    answer: 2,
    explanation: "0.65 = 65/100, simplifying by dividing both by GCD(65,100)=5: 65/100 = 13/20."
  },
  {
    question: "Calculate 25% of 340.",
    options: ["68", "76.5", "90", "85"],
    answer: 3,
    explanation: "25% of 340 = (25/100) × 340 = 0.25 × 340 = 85."
  },
  {
    question: "A price increases from ₦200 to ₦250. Calculate the percentage increase.",
    options: ["25%", "30%", "20%", "50%"],
    answer: 0,
    explanation: "Percentage increase = (Increase/Original) × 100 = (50/200) × 100 = 25%."
  },
  {
    question: "Simplify: 2/3 + 1/4",
    options: ["3/7", "11/12", "1/2", "5/6"],
    answer: 1,
    explanation: "Finding common denominator (12): 2/3=8/12, 1/4=3/12. Sum = 8/12+3/12 = 11/12."
  },
  {
    question: "Which of the following correctly describes a recurring (repeating) decimal?",
    options: ["A decimal with a digit or group of digits that repeats infinitely", "A decimal that terminates after a fixed number of digits", "A decimal that cannot be converted to a fraction", "A decimal equal to a whole number"],
    answer: 0,
    explanation: "A recurring decimal has one or more digits that repeat indefinitely (e.g., 1/3 = 0.333...), and importantly, all recurring decimals CAN be converted to fractions (as rational numbers)."
  },
  {
    question: "A student scores 45 out of 60 in a test. Calculate the percentage score.",
    options: ["70%", "65%", "80%", "75%"],
    answer: 3,
    explanation: "Percentage = (45/60) × 100 = 0.75 × 100 = 75%."
  },
  {
    question: "Simplify: 5/6 ÷ 2/3",
    options: ["15/12", "5/9", "5/4", "10/18"],
    answer: 2,
    explanation: "Dividing fractions: 5/6 ÷ 2/3 = 5/6 × 3/2 = 15/12 = 5/4 (simplified)."
  },
  {
    question: "A shirt originally priced at ₦1500 is sold at a 20% discount. Calculate the sale price.",
    options: ["₦1350", "₦1200", "₦1300", "₦1250"],
    answer: 1,
    explanation: "Discount amount = 20% × 1500 = 300. Sale price = 1500-300 = ₦1200."
  },
  {
    question: "Convert 7/20 to a percentage.",
    options: ["40%", "35%", "30%", "33%"],
    answer: 1,
    explanation: "7/20 = 0.35 = 35%."
  },
  {
    question: "Divide ₦4500 in the ratio 2:3:4.",
    options: ["₦1000, ₦1500, ₦2000", "₦900, ₦1350, ₦1800", "₦1200, ₦1400, ₦1900", "₦1500, ₦1500, ₦1500"],
    answer: 0,
    explanation: "Total ratio parts = 2+3+4=9. Value per part = 4500/9 = 500. Shares: 2×500=₦1000, 3×500=₦1500, 4×500=₦2000."
  },
  {
    question: "If a:b = 3:5 and b:c = 2:7, find a:c.",
    options: ["5:14", "3:7", "6:35", "6:7"],
    answer: 2,
    explanation: "To combine ratios, make b consistent: a:b=3:5=6:10, b:c=2:7=10:35 (multiplying to match b=10). So a:b:c = 6:10:35, giving a:c = 6:35."
  },
  {
    question: "A car travels 240km in 3 hours. Calculate its average speed.",
    options: ["70 km/h", "60 km/h", "90 km/h", "80 km/h"],
    answer: 3,
    explanation: "Speed = Distance/Time = 240/3 = 80 km/h."
  },
  {
    question: "In a proportion a:b = c:d, which of the following is always true?",
    options: ["a+b = c+d", "a÷c = b×d", "a-b = c-d", "a×d = b×c"],
    answer: 3,
    explanation: "The fundamental property of proportions states that the product of extremes equals the product of means: a×d = b×c (cross multiplication)."
  },
  {
    question: "If 8 workers complete a job in 15 days, how many days would 12 workers take (assuming same work rate)?",
    options: ["12 days", "10 days", "20 days", "8 days"],
    answer: 1,
    explanation: "This is inverse proportion (more workers = less time). Total work = 8×15=120 worker-days. Time for 12 workers = 120/12 = 10 days."
  },
  {
    question: "A recipe requires flour and sugar in ratio 5:2. If 15kg of flour is used, how much sugar is needed?",
    options: ["6kg", "4kg", "5kg", "7kg"],
    answer: 0,
    explanation: "Ratio 5:2 means for every 5 parts flour, 2 parts sugar. Scale factor = 15/5=3. Sugar needed = 2×3 = 6kg."
  },
  {
    question: "Which statement correctly distinguishes direct and inverse proportion?",
    options: ["In direct proportion, both variables increase or decrease together; in inverse, one increases as the other decreases", "Inverse proportion only applies to whole numbers", "In direct proportion, as one variable increases, the other decreases", "Both types behave identically"],
    answer: 0,
    explanation: "Direct proportion means variables change in the same direction (both increase/decrease together, y=kx), while inverse proportion means variables change in opposite directions (as one increases, the other decreases, y=k/x)."
  },
  {
    question: "A map has a scale of 1:50000. If a distance on the map is 4cm, calculate the actual distance in km.",
    options: ["2.5km", "2km", "5km", "1km"],
    answer: 1,
    explanation: "Actual distance = 4cm × 50000 = 200000cm = 2000m = 2km."
  },
  {
    question: "If x is directly proportional to y, and x=12 when y=4, find x when y=10.",
    options: ["30", "35", "25", "20"],
    answer: 0,
    explanation: "x=ky, so 12=k×4, giving k=3. When y=10: x=3×10=30."
  },
  {
    question: "A car uses 8 liters of fuel to travel 120km. Calculate the fuel needed to travel 300km at the same rate.",
    options: ["24 liters", "15 liters", "18 liters", "20 liters"],
    answer: 3,
    explanation: "Fuel rate = 8/120 = 1/15 liters per km. For 300km: 300 × (1/15) = 20 liters."
  },
  {
    question: "Simplify: 2³ × 2⁴",
    options: ["4⁷", "2¹", "2⁷", "2¹²"],
    answer: 2,
    explanation: "When multiplying powers with the same base, add the exponents: 2³ × 2⁴ = 2^(3+4) = 2⁷."
  },
  {
    question: "Simplify: (3²)³",
    options: ["3⁶", "3⁵", "3⁹", "9⁶"],
    answer: 0,
    explanation: "When raising a power to another power, multiply the exponents: (3²)³ = 3^(2×3) = 3⁶."
  },
  {
    question: "Evaluate: 5⁰",
    options: ["Undefined", "1", "5", "0"],
    answer: 1,
    explanation: "Any non-zero number raised to the power of 0 equals 1, a fundamental rule of indices (x⁰=1 for x≠0)."
  },
  {
    question: "Simplify: 2⁻³",
    options: ["8", "-8", "1/8", "-6"],
    answer: 2,
    explanation: "A negative exponent indicates a reciprocal: 2⁻³ = 1/2³ = 1/8."
  },
  {
    question: "Simplify: (2³)/(2⁵)",
    options: ["2²", "2⁻²", "2⁸", "4⁻²"],
    answer: 1,
    explanation: "When dividing powers with the same base, subtract exponents: 2³/2⁵ = 2^(3-5) = 2⁻²."
  },
  {
    question: "Which of the following correctly represents the law of indices for aᵐ × aⁿ?",
    options: ["a^(m+n)", "a^(m/n)", "a^(m-n)", "a^(m×n)"],
    answer: 0,
    explanation: "The multiplication law of indices states that when multiplying powers with the same base, exponents are added: aᵐ × aⁿ = a^(m+n)."
  },
  {
    question: "Evaluate: 4^(1/2)",
    options: ["8", "2", "16", "4"],
    answer: 1,
    explanation: "A fractional exponent of 1/2 represents a square root: 4^(1/2) = √4 = 2."
  },
  {
    question: "Simplify: (2x²)³",
    options: ["8x⁶", "2x⁶", "8x⁵", "6x⁶"],
    answer: 0,
    explanation: "Apply the power to both the coefficient and variable: (2x²)³ = 2³ × x^(2×3) = 8x⁶."
  },
  {
    question: "Evaluate: 27^(2/3)",
    options: ["9", "6", "18", "3"],
    answer: 0,
    explanation: "27^(2/3) means (27^(1/3))² = (cube root of 27)² = 3² = 9."
  },
  {
    question: "Simplify: x⁵ ÷ x⁵",
    options: ["1", "x¹⁰", "x", "0"],
    answer: 0,
    explanation: "Any non-zero base divided by itself with equal exponents gives x^(5-5)=x⁰=1, following the division law and zero exponent rule."
  },
  {
    question: "If log₁₀ 100 = 2, this means:",
    options: ["10² = 100", "100² = 10", "2¹⁰ = 100", "10¹⁰⁰ = 2"],
    answer: 0,
    explanation: "Logarithms and exponents are inverse operations — log₁₀ 100 = 2 means \"10 raised to what power gives 100?\", answered by 10²=100."
  },
  {
    question: "Evaluate: log₂ 8",
    options: ["2", "8", "3", "4"],
    answer: 2,
    explanation: "log₂ 8 asks \"2 raised to what power equals 8?\" Since 2³=8, log₂ 8 = 3."
  },
  {
    question: "Simplify: log 5 + log 4 (using log base 10)",
    options: ["log 20", "log 9", "log 45", "log 1.25"],
    answer: 0,
    explanation: "The logarithm product rule states log a + log b = log(a×b), so log 5 + log 4 = log(5×4) = log 20."
  },
  {
    question: "Simplify: log 100 - log 10",
    options: ["log 1000", "log 1", "log 10", "log 90"],
    answer: 2,
    explanation: "The logarithm quotient rule states log a - log b = log(a/b), so log 100 - log 10 = log(100/10) = log 10."
  },
  {
    question: "Evaluate: log₃ 81",
    options: ["4", "3", "9", "27"],
    answer: 0,
    explanation: "log₃ 81 asks \"3 raised to what power equals 81?\" Since 3⁴=81, log₃ 81 = 4."
  },
  {
    question: "Which law of logarithms states that log(aⁿ) = n log a?",
    options: ["Power rule", "Change of base rule", "Product rule", "Quotient rule"],
    answer: 0,
    explanation: "The power rule of logarithms specifically allows an exponent within a logarithm to be brought down as a coefficient multiplying the logarithm: log(aⁿ) = n log a."
  },
  {
    question: "Solve for x: log₁₀ x = 3",
    options: ["x = 30", "x = 300", "x = 1000", "x = 3000"],
    answer: 2,
    explanation: "log₁₀ x = 3 means 10³ = x, so x = 1000."
  },
  {
    question: "Simplify: 2 log 5 (as a single logarithm)",
    options: ["log 25", "log 10", "log 50", "log 7"],
    answer: 0,
    explanation: "Using the power rule in reverse: 2 log 5 = log(5²) = log 25."
  },
  {
    question: "Why is the logarithm of a negative number undefined in the real number system?",
    options: ["Negative numbers cannot be multiplied", "No real exponent applied to a positive base yields a negative result", "Logarithms only work with even numbers", "Logarithms only apply to base 10"],
    answer: 1,
    explanation: "Since logarithms are defined based on positive bases raised to real exponents (which always yield positive results for positive bases), there's no real number exponent that would produce a negative output, making log of negative numbers undefined in real numbers."
  },
  {
    question: "Evaluate: log₅ 1",
    options: ["Undefined", "5", "1", "0"],
    answer: 3,
    explanation: "Any base raised to the power 0 equals 1, so log₅ 1 = 0 (since 5⁰=1), a universal property of logarithms regardless of base."
  },
];

const MATHSB = [
  {
    question: "Simplify: √50",
    options: ["5√2", "10√5", "25√2", "2√5"],
    answer: 0,
    explanation: "√50 = √(25×2) = √25 × √2 = 5√2."
  },
  {
    question: "Simplify: √12 + √27",
    options: ["6√3", "3√13", "5√3", "√39"],
    answer: 2,
    explanation: "√12=2√3, √27=3√3. Adding: 2√3+3√3 = 5√3."
  },
  {
    question: "Which of the following best defines a surd?",
    options: ["A rational number expressed as a fraction", "Any number with a decimal point", "An irrational root that cannot be simplified to a whole number", "Any square root"],
    answer: 2,
    explanation: "A surd is specifically an irrational number expressed as a root (like √2, √3) that cannot be simplified to remove the root sign, remaining irrational (non-terminating, non-repeating decimal)."
  },
  {
    question: "Rationalize the denominator: 1/√3",
    options: ["√3/3", "3/√3", "1/3", "√3"],
    answer: 0,
    explanation: "Multiply numerator and denominator by √3: (1×√3)/(√3×√3) = √3/3."
  },
  {
    question: "Simplify: (√5)²",
    options: ["√5", "5", "10", "25"],
    answer: 1,
    explanation: "Squaring a square root cancels the root: (√5)² = 5."
  },
  {
    question: "Simplify: √8 × √2",
    options: ["16", "√16", "2√4", "4"],
    answer: 3,
    explanation: "√8 × √2 = √(8×2) = √16 = 4."
  },
  {
    question: "Rationalize: 2/(√5-1)",
    options: ["2(√5-1)", "(2√5+2)/4", "(√5-1)/2", "(√5+1)/2"],
    answer: 3,
    explanation: "Multiply by conjugate (√5+1)/(√5+1): [2(√5+1)]/[(√5)²-1²] = [2(√5+1)]/(5-1) = [2(√5+1)]/4 = (√5+1)/2."
  },
  {
    question: "Simplify: 3√2 × 2√8",
    options: ["12√2", "6√16", "24", "5√10"],
    answer: 2,
    explanation: "3√2 × 2√8 = 6√(2×8) = 6√16 = 6×4 = 24."
  },
  {
    question: "Which of these is an example of a surd in its simplest form?",
    options: ["√16", "√4", "√9", "√7"],
    answer: 3,
    explanation: "√7 cannot be simplified further since 7 has no perfect square factors, remaining as an irrational surd, unlike √4=2, √9=3, √16=4 which simplify to whole numbers."
  },
  {
    question: "Simplify: √18 - √8",
    options: ["√10", "2√2", "3√2", "√2"],
    answer: 3,
    explanation: "√18=3√2, √8=2√2. Subtracting: 3√2-2√2 = √2."
  },
  {
    question: "Expand: (x+3)(x+5)",
    options: ["x²+8x+8", "x²+15", "x²+15x+8", "x²+8x+15"],
    answer: 3,
    explanation: "Using FOIL: x×x + x×5 + 3×x + 3×5 = x²+5x+3x+15 = x²+8x+15."
  },
  {
    question: "Factorize: x²-9",
    options: ["(x-3)(x-3)", "(x-9)(x+1)", "(x+9)(x-1)", "(x+3)(x-3)"],
    answer: 3,
    explanation: "This is a difference of squares (a²-b² = (a+b)(a-b)), where x²-9 = x²-3² = (x+3)(x-3)."
  },
  {
    question: "Simplify: 3x + 5y - 2x + 3y",
    options: ["5x + 8y", "x + 8y", "5x + 2y", "x + 2y"],
    answer: 1,
    explanation: "Combining like terms: (3x-2x)+(5y+3y) = x+8y."
  },
  {
    question: "Factorize: x²+7x+12",
    options: ["(x+1)(x+12)", "(x+5)(x+2)", "(x+3)(x+4)", "(x+2)(x+6)"],
    answer: 2,
    explanation: "Looking for two numbers that multiply to 12 and add to 7: 3×4=12, 3+4=7. So x²+7x+12 = (x+3)(x+4)."
  },
  {
    question: "Expand: (2x-3)²",
    options: ["4x²-9", "4x²+9", "4x²-12x+9", "2x²-6x+9"],
    answer: 2,
    explanation: "Using (a-b)²=a²-2ab+b²: (2x)²-2(2x)(3)+3² = 4x²-12x+9."
  },
  {
    question: "Which term correctly describes expressions like 3x² and 5x² (with identical variable parts)?",
    options: ["Like terms", "Constants", "Coefficients", "Unlike terms"],
    answer: 0,
    explanation: "Like terms have identical variable parts (same variables raised to the same powers) — 3x² and 5x² both have x² as their variable component, making them like terms that can be combined."
  },
  {
    question: "Simplify: (x+2)(x-2)",
    options: ["x²-4", "x²-2x-4", "x²+2x-4", "x²+4"],
    answer: 0,
    explanation: "This is a difference of squares pattern: (x+2)(x-2) = x²-2² = x²-4."
  },
  {
    question: "Factorize completely: 2x²+8x",
    options: ["2x(x+4)", "x(2x+8)", "2(x²+4x)", "4x(x/2+2)"],
    answer: 0,
    explanation: "The greatest common factor is 2x: 2x²+8x = 2x(x+4), fully factored with no further common factors remaining."
  },
  {
    question: "Simplify: (3x²y)(2xy³)",
    options: ["5x³y⁴", "6x³y⁴", "6x²y³", "6xy³"],
    answer: 1,
    explanation: "Multiply coefficients and add exponents of like variables: (3×2)(x^(2+1))(y^(1+3)) = 6x³y⁴."
  },
  {
    question: "What does the term \"coefficient\" refer to in an algebraic expression like 5x²?",
    options: ["The entire expression", "The exponent 2", "The variable x", "The numerical factor multiplying the variable (5)"],
    answer: 3,
    explanation: "A coefficient is the numerical value that multiplies a variable term — in 5x², the coefficient is 5, distinct from the variable (x) and exponent (2)."
  },
  {
    question: "Solve for x: 3x + 5 = 20",
    options: ["x = 7", "x = 5", "x = 15", "x = 3"],
    answer: 1,
    explanation: "3x = 20-5 = 15, so x = 15/3 = 5."
  },
  {
    question: "Solve the inequality: 2x - 3 > 7",
    options: ["x > 5", "x < 5", "x > 2", "x > 10"],
    answer: 0,
    explanation: "2x > 7+3 = 10, so x > 10/2 = 5."
  },
  {
    question: "Solve for x: (x/4) + 3 = 8",
    options: ["x = 20", "x = 5", "x = 11", "x = 32"],
    answer: 0,
    explanation: "x/4 = 8-3 = 5, so x = 5×4 = 20."
  },
  {
    question: "When solving an inequality, if both sides are multiplied or divided by a negative number, the inequality sign:",
    options: ["Must be reversed", "Becomes an equal sign", "Is removed entirely", "Remains unchanged"],
    answer: 0,
    explanation: "A fundamental rule of inequalities states that multiplying or dividing both sides by a negative number reverses the direction of the inequality sign to maintain a true statement."
  },
  {
    question: "Solve: 5(x-2) = 3x+4",
    options: ["x = 9", "x = 5", "x = 3", "x = 7"],
    answer: 3,
    explanation: "5x-10 = 3x+4 → 5x-3x = 4+10 → 2x=14 → x=7."
  },
  {
    question: "Solve the inequality: -3x + 6 ≤ 15",
    options: ["x ≤ 3", "x ≥ 3", "x ≤ -3", "x ≥ -3"],
    answer: 3,
    explanation: "-3x ≤ 15-6=9, dividing by -3 (reverse inequality): x ≥ 9/(-3) = -3."
  },
  {
    question: "A linear equation in one variable has how many solutions typically?",
    options: ["Infinite", "Zero", "Exactly two", "One (unique solution)"],
    answer: 3,
    explanation: "A standard linear equation in one variable (like ax+b=c, where a≠0) typically has exactly one unique solution, unlike quadratic equations which can have two solutions."
  },
  {
    question: "Solve: 2(3x-1) - 4 = 3(x+2)",
    options: ["x = 4", "x = 2", "x = 3", "x = 12/3"],
    answer: 0,
    explanation: "6x-2-4 = 3x+6 → 6x-6=3x+6 → 6x-3x=6+6 → 3x=12 → x=4."
  },
  {
    question: "Solve for x: (2x+1)/3 = 5",
    options: ["x = 8", "x = 14", "x = 6", "x = 7"],
    answer: 3,
    explanation: "2x+1 = 5×3=15, so 2x=14, giving x=7."
  },
  {
    question: "Which of the following represents a valid linear inequality?",
    options: ["2x - 7 ≤ 10", "x³ = 27", "x² + 3 > 5", "√x = 4"],
    answer: 0,
    explanation: "A linear inequality involves variables raised only to the first power with an inequality symbol — 2x-7≤10 fits this definition, unlike the others which involve squares, cubes, or roots."
  },
  {
    question: "Solve: x² - 5x + 6 = 0",
    options: ["x = 2 or x = 3", "x = 1 or x = 6", "x = 5 or x = 6", "x = -2 or x = -3"],
    answer: 0,
    explanation: "Factoring: (x-2)(x-3)=0, giving x=2 or x=3."
  },
  {
    question: "Using the quadratic formula, solve: x² - 4x - 5 = 0",
    options: ["x = 4 or x = -1", "x = 5 or x = -1", "x = 5 or x = 1", "x = -5 or x = 1"],
    answer: 1,
    explanation: "Using x = [-b±√(b²-4ac)]/2a with a=1,b=-4,c=-5: x = [4±√(16+20)]/2 = [4±6]/2, giving x=5 or x=-1."
  },
  {
    question: "The discriminant (b²-4ac) of a quadratic equation determines:",
    options: ["The nature of roots (real, equal, or complex)", "The sum of roots", "The value of x directly", "The product of roots"],
    answer: 0,
    explanation: "The discriminant reveals the nature of solutions: positive discriminant gives two distinct real roots, zero gives one repeated real root, and negative gives complex (no real) roots."
  },
  {
    question: "If the discriminant of a quadratic equation is zero, this means:",
    options: ["Two distinct real roots exist", "No real roots exist", "Exactly one repeated real root exists", "Infinite roots exist"],
    answer: 2,
    explanation: "A discriminant of exactly zero indicates the quadratic has one repeated (double) real root, where the parabola touches the x-axis at exactly one point."
  },
  {
    question: "Solve by factoring: x² + 7x + 10 = 0",
    options: ["x = 2 or x = -5", "x = -2 or x = 5", "x = 2 or x = 5", "x = -2 or x = -5"],
    answer: 3,
    explanation: "Looking for factors of 10 that sum to 7: 2 and 5. So (x+2)(x+5)=0, giving x=-2 or x=-5."
  },
  {
    question: "Solve using the quadratic formula: 2x² + 3x - 2 = 0",
    options: ["x = 1/2 or x = -2", "x = 2 or x = -1/2", "x = -1/2 or x = 2", "x = -2 or x = -1/2"],
    answer: 0,
    explanation: "Using x=[-3±√(9+16)]/4 = [-3±5]/4, giving x=1/2 or x=-2."
  },
  {
    question: "For a quadratic equation ax²+bx+c=0, the sum of roots equals:",
    options: ["-c/a", "c/a", "b/a", "-b/a"],
    answer: 3,
    explanation: "For a quadratic in standard form, Vieta's formulas state that sum of roots = -b/a, derived from the relationship between coefficients and roots."
  },
  {
    question: "Solve: x² - 16 = 0",
    options: ["x = -4 only", "x = 4 or x = -4", "x = 8 or x = -8", "x = 4 only"],
    answer: 1,
    explanation: "x²=16, taking square root of both sides gives x=±4 (both positive and negative roots satisfy the equation since (-4)²=16 too)."
  },
  {
    question: "For a quadratic equation ax²+bx+c=0, the product of roots equals:",
    options: ["-c/a", "c/a", "-b/a", "b/a"],
    answer: 1,
    explanation: "Vieta's formulas state that the product of roots for a quadratic equation equals c/a."
  },
  {
    question: "Solve: x² + 6x + 9 = 0",
    options: ["x = -3 or x = 3", "x = 3 (repeated root)", "x = 9 or x = -9", "x = -3 (repeated root)"],
    answer: 3,
    explanation: "This factors as (x+3)²=0 (perfect square trinomial), giving a repeated root of x=-3 (discriminant=36-36=0, confirming one repeated root)."
  },
  {
    question: "Solve simultaneously: x+y=10, x-y=4",
    options: ["x=6, y=4", "x=7, y=3", "x=8, y=2", "x=5, y=5"],
    answer: 1,
    explanation: "Adding both equations: 2x=14, so x=7. Substituting: 7+y=10, giving y=3."
  },
  {
    question: "Solve simultaneously: 2x+y=8, x-y=1",
    options: ["x=2, y=4", "x=4, y=0", "x=3, y=2", "x=1, y=6"],
    answer: 2,
    explanation: "Adding equations: 3x=9, so x=3. Substituting into x-y=1: 3-y=1, giving y=2."
  },
  {
    question: "In the elimination method for solving simultaneous equations, the goal is to:",
    options: ["Add or subtract equations to eliminate one variable", "Graph both equations", "Multiply variables together", "Substitute one variable's expression into the other equation"],
    answer: 0,
    explanation: "The elimination method involves manipulating equations (multiplying by constants if needed) so that adding or subtracting them cancels out one variable, allowing you to solve for the remaining variable."
  },
  {
    question: "Solve simultaneously: 3x+2y=16, x+y=6",
    options: ["x=2, y=4", "x=6, y=0", "x=3, y=3", "x=4, y=2"],
    answer: 3,
    explanation: "From x+y=6: x=6-y. Substituting: 3(6-y)+2y=16 → 18-3y+2y=16 → -y=-2 → y=2. Then x=6-2=4."
  },
  {
    question: "Solve simultaneously: 4x-3y=1, 2x+3y=11",
    options: ["x=1, y=1", "x=2, y=7/3", "x=2, y=7", "x=3, y=11/3"],
    answer: 1,
    explanation: "Adding equations: 6x=12, so x=2. Substituting into 2x+3y=11: 4+3y=11, giving 3y=7, y=7/3."
  },
  {
    question: "Which method involves graphing both equations and finding their intersection point?",
    options: ["Elimination method", "Substitution method", "Matrix method", "Graphical method"],
    answer: 3,
    explanation: "The graphical method solves simultaneous equations by plotting both equations on the same coordinate system and identifying the point(s) where the lines intersect — this intersection represents the solution."
  },
  {
    question: "Solve simultaneously: y=2x+1, y=x+4",
    options: ["x=4, y=8", "x=1, y=5", "x=3, y=7", "x=2, y=6"],
    answer: 2,
    explanation: "Setting equal: 2x+1=x+4, so x=3. Substituting: y=2(3)+1=7."
  },
  {
    question: "For two simultaneous linear equations to have a unique solution, their graphs must:",
    options: ["Never intersect", "Be parallel lines", "Be the same line", "Intersect at exactly one point"],
    answer: 3,
    explanation: "A unique solution to simultaneous linear equations corresponds to the lines intersecting at exactly one point — parallel lines (never intersecting) indicate no solution, while identical lines indicate infinite solutions."
  },
  {
    question: "Solve simultaneously: 5x+2y=19, 3x-2y=5",
    options: ["x=4, y=1", "x=1, y=4", "x=2, y=3", "x=3, y=2"],
    answer: 3,
    explanation: "Adding equations: 8x=24, so x=3. Substituting into 3x-2y=5: 9-2y=5, giving 2y=4, y=2."
  },
  {
    question: "If a system of two linear equations has no solution, this indicates that the lines are:",
    options: ["Intersecting at one point", "Parallel with different y-intercepts", "Identical (same line)", "Perpendicular"],
    answer: 1,
    explanation: "No solution occurs when two lines are parallel (same slope) but have different y-intercepts, meaning they never intersect at any point."
  },
];

const MATHSC = [
  {
    question: "Find the 10th term of the arithmetic sequence: 3, 7, 11, 15, ...",
    options: ["43", "47", "35", "39"],
    answer: 3,
    explanation: "Using Tₙ = a + (n-1)d, where a=3, d=4, n=10: T₁₀ = 3 + (9×4) = 3+36 = 39."
  },
  {
    question: "Find the sum of the first 5 terms of the arithmetic series: 2, 5, 8, 11, 14",
    options: ["40", "45", "35", "30"],
    answer: 0,
    explanation: "Sum = n/2 × (first term + last term) = 5/2 × (2+14) = 2.5×16 = 40."
  },
  {
    question: "In a geometric sequence, each term is obtained by:",
    options: ["Dividing by the term number", "Adding a constant value to the previous term", "Multiplying the previous term by a constant ratio", "Subtracting a constant value"],
    answer: 2,
    explanation: "A geometric sequence is defined by a common ratio (r) that each term is multiplied by to get the next term, distinguishing it from arithmetic sequences (constant difference)."
  },
  {
    question: "Find the 6th term of the geometric sequence: 2, 6, 18, 54, ...",
    options: ["162", "324", "972", "486"],
    answer: 3,
    explanation: "Common ratio r=3. Using Tₙ=ar^(n-1): T₆=2×3⁵=2×243=486."
  },
  {
    question: "Calculate the sum of the first 4 terms of the geometric series: 3, 6, 12, 24",
    options: ["45", "51", "48", "42"],
    answer: 0,
    explanation: "Sum = 3+6+12+24 = 45."
  },
  {
    question: "What distinguishes an arithmetic sequence from a geometric sequence?",
    options: ["Both have common differences", "Arithmetic has a common ratio; geometric has a common difference", "Both have common ratios", "Arithmetic has a common difference; geometric has a common ratio"],
    answer: 3,
    explanation: "Arithmetic sequences progress by adding/subtracting a constant value (common difference), while geometric sequences progress by multiplying/dividing by a constant value (common ratio)."
  },
  {
    question: "Find the sum to infinity of the geometric series: 8, 4, 2, 1, ... (where |r|<1)",
    options: ["12", "8", "20", "16"],
    answer: 3,
    explanation: "For infinite geometric series with |r|<1: S∞ = a/(1-r) = 8/(1-0.5) = 8/0.5 = 16."
  },
  {
    question: "The nth term of an arithmetic sequence with first term 5 and common difference 3 is:",
    options: ["5+3n", "5+3(n-1)", "3+5(n-1)", "3n-5"],
    answer: 1,
    explanation: "The general formula for arithmetic sequences is Tₙ=a+(n-1)d, so with a=5, d=3: Tₙ=5+3(n-1)."
  },
  {
    question: "Find the common ratio of the geometric sequence: 100, 20, 4, 0.8, ...",
    options: ["5", "4", "1/5", "1/4"],
    answer: 2,
    explanation: "Common ratio = second term/first term = 20/100 = 1/5."
  },
  {
    question: "Calculate the sum of the first 20 terms of the arithmetic series where first term=1 and common difference=2.",
    options: ["420", "360", "380", "400"],
    answer: 3,
    explanation: "Sum = n/2[2a+(n-1)d] = 20/2[2(1)+19(2)] = 10[2+38] = 10×40 = 400."
  },
  {
    question: "If A = {1,2,3,4} and B = {3,4,5,6}, find A∩B (intersection).",
    options: ["{1,2,3,4,5,6}", "{3,4}", "{1,2,5,6}", "{}"],
    answer: 1,
    explanation: "The intersection (A∩B) contains elements common to both sets — only 3 and 4 appear in both A and B."
  },
  {
    question: "If A = {1,2,3} and B = {4,5,6}, find A∪B (union).",
    options: ["{4,5,6}", "{1,2,3,4,5,6}", "{1,2,3}", "{}"],
    answer: 1,
    explanation: "The union (A∪B) combines all unique elements from both sets — since A and B share no common elements, the union simply lists all elements from both."
  },
  {
    question: "What is meant by the complement of a set A (denoted A')?",
    options: ["Elements that are in both A and the universal set", "Elements only in A", "Elements in the universal set that are NOT in A", "An empty set"],
    answer: 2,
    explanation: "The complement of set A (A') consists of all elements within the universal set that do not belong to A, essentially representing \"everything else.\""
  },
  {
    question: "If the universal set U = {1,2,3,4,5,6,7,8} and A = {2,4,6,8}, find A'.",
    options: ["{1,3,5,7}", "{1,2,3,4,5,6,7,8}", "{}", "{2,4,6,8}"],
    answer: 0,
    explanation: "A' contains elements in U but not in A — since A contains all even numbers, A' contains the remaining odd numbers: {1,3,5,7}."
  },
  {
    question: "If n(A)=15, n(B)=20, and n(A∩B)=8, find n(A∪B).",
    options: ["43", "20", "35", "27"],
    answer: 3,
    explanation: "Using the formula n(A∪B)=n(A)+n(B)-n(A∩B) = 15+20-8 = 27."
  },
  {
    question: "Two sets are called disjoint if:",
    options: ["They share no common elements (A∩B = ∅)", "One set contains the other", "They have the same number of elements", "They have identical elements"],
    answer: 0,
    explanation: "Disjoint sets have no elements in common, meaning their intersection is the empty set (∅) — this doesn't require equal size, just zero overlap."
  },
  {
    question: "If A = {a,b,c} and B = {b,c,d,e}, find A-B (elements in A but not in B).",
    options: ["{a,b,c,d,e}", "{b,c}", "{a}", "{d,e}"],
    answer: 2,
    explanation: "A-B (set difference) contains elements present in A but absent from B — only 'a' exists in A but not in B."
  },
  {
    question: "A set with no elements is called:",
    options: ["A universal set", "An empty set (null set)", "A subset", "A complement set"],
    answer: 1,
    explanation: "An empty set (denoted ∅ or {}) is specifically defined as a set containing no elements whatsoever."
  },
  {
    question: "If n(U)=50, n(A)=30, find n(A').",
    options: ["30", "80", "20", "50"],
    answer: 2,
    explanation: "Since A and A' together make up the entire universal set: n(A)+n(A')=n(U), so n(A')=50-30=20."
  },
  {
    question: "Which symbol represents \"is a subset of\"?",
    options: ["∈", "⊆", "∩", "∪"],
    answer: 1,
    explanation: "The symbol ⊆ specifically denotes \"is a subset of,\" indicating that all elements of one set are contained within another set."
  },
  {
    question: "If f(x) = 2x + 3, find f(4).",
    options: ["7", "9", "11", "14"],
    answer: 2,
    explanation: "Substitute x=4: f(4)=2(4)+3=8+3=11."
  },
  {
    question: "If f(x) = x² - 2x + 1, find f(3).",
    options: ["6", "2", "4", "10"],
    answer: 2,
    explanation: "Substitute x=3: f(3)=3²-2(3)+1=9-6+1=4."
  },
  {
    question: "What defines a function in mathematics?",
    options: ["A relation where outputs can have multiple inputs", "An equation with two unknowns", "A relation where each input has exactly one output", "Any relationship between two variables"],
    answer: 2,
    explanation: "A function is specifically defined as a relation where every input (x-value) maps to exactly one unique output (y-value)."
  },
  {
    question: "If f(x) = 3x - 1 and g(x) = x + 2, find (f+g)(x).",
    options: ["4x+1", "4x-1", "3x+1", "2x-3"],
    answer: 0,
    explanation: "(f+g)(x) = f(x)+g(x) = (3x-1)+(x+2) = 4x+1."
  },
  {
    question: "If f(x) = 2x+1, find f⁻¹(x) (the inverse function).",
    options: ["(x-2)/1", "(x-1)/2", "2x-1", "(x+1)/2"],
    answer: 1,
    explanation: "To find the inverse, swap x and y then solve: y=2x+1 → x=2y+1 → x-1=2y → y=(x-1)/2."
  },
  {
    question: "If f(x)=x² and g(x)=x+3, find (fog)(x) [f composed with g].",
    options: ["x²+9", "(x+3)²", "x²+3", "x+9"],
    answer: 1,
    explanation: "(fog)(x) means f(g(x)) — substitute g(x) into f: f(x+3) = (x+3)²."
  },
  {
    question: "A function f(x) is called \"one-to-one\" if:",
    options: ["Every input has multiple outputs", "Every output has exactly one input", "It only works for positive numbers", "The function is undefined for some values"],
    answer: 1,
    explanation: "A one-to-one (injective) function ensures that different inputs always produce different outputs."
  },
  {
    question: "If f(x) = 5, this represents:",
    options: ["A linear function", "A constant function", "An undefined function", "A quadratic function"],
    answer: 1,
    explanation: "A constant function always outputs the same value regardless of input — f(x)=5 means every x-value maps to the output 5."
  },
  {
    question: "If f(x) = 4x - 7 and f(a) = 9, find the value of a.",
    options: ["4", "2", "5", "3"],
    answer: 0,
    explanation: "Set up equation: 4a-7=9, so 4a=16, giving a=4."
  },
  {
    question: "The domain of a function refers to:",
    options: ["The set of all possible input values", "The y-intercept only", "The graph of the function", "The set of all possible output values"],
    answer: 0,
    explanation: "The domain specifically represents all valid input values (x-values) for which the function is defined."
  },
  {
    question: "The sum of interior angles in a triangle is always:",
    options: ["90°", "180°", "270°", "360°"],
    answer: 1,
    explanation: "The three interior angles of any triangle always sum to exactly 180°."
  },
  {
    question: "Calculate the size of each interior angle in a regular hexagon.",
    options: ["100°", "108°", "135°", "120°"],
    answer: 3,
    explanation: "Sum of interior angles = (n-2)×180° = (6-2)×180° = 720°. For a regular hexagon, each angle = 720°/6 = 120°."
  },
  {
    question: "Two angles that sum to 90° are called:",
    options: ["Complementary angles", "Supplementary angles", "Alternate angles", "Vertical angles"],
    answer: 0,
    explanation: "Complementary angles are specifically defined as two angles whose measures add up to exactly 90°."
  },
  {
    question: "In a right-angled triangle, if one angle is 35°, find the other non-right angle.",
    options: ["145°", "55°", "65°", "45°"],
    answer: 1,
    explanation: "Since angles sum to 180° and one angle is 90° (right angle): 180-90-35 = 55°."
  },
  {
    question: "Which property is true for all parallelograms?",
    options: ["All sides are equal", "Diagonals are always equal", "All angles are equal", "Opposite sides are parallel and equal in length"],
    answer: 3,
    explanation: "A defining property of parallelograms is that opposite sides are both parallel and equal in length."
  },
  {
    question: "Calculate the exterior angle of a regular pentagon.",
    options: ["72°", "60°", "90°", "108°"],
    answer: 0,
    explanation: "Sum of exterior angles of any polygon = 360°. For a regular pentagon: 360°/5 = 72°."
  },
  {
    question: "Vertically opposite angles formed by two intersecting lines are always:",
    options: ["Supplementary", "Adjacent", "Complementary", "Equal"],
    answer: 3,
    explanation: "When two lines intersect, the angles opposite each other (vertical angles) are always equal in measure."
  },
  {
    question: "In a triangle, if two sides are equal, the triangle is classified as:",
    options: ["Scalene", "Right-angled", "Equilateral", "Isosceles"],
    answer: 3,
    explanation: "An isosceles triangle is specifically defined as having exactly two equal sides."
  },
  {
    question: "Calculate angle x if two parallel lines are cut by a transversal, and the co-interior angles are x and 110°.",
    options: ["110°", "80°", "70°", "90°"],
    answer: 2,
    explanation: "Co-interior (allied) angles between parallel lines are supplementary (sum to 180°): x+110=180, so x=70°."
  },
  {
    question: "The angle sum of interior angles in any quadrilateral is:",
    options: ["360°", "450°", "180°", "270°"],
    answer: 0,
    explanation: "Using the formula (n-2)×180° for a 4-sided polygon: (4-2)×180° = 360°."
  },
  {
    question: "Calculate the area of a rectangle with length 12cm and width 7cm.",
    options: ["38cm²", "19cm²", "84cm²", "42cm²"],
    answer: 2,
    explanation: "Area of rectangle = length × width = 12×7 = 84cm²."
  },
  {
    question: "Calculate the circumference of a circle with radius 7cm. (π=22/7)",
    options: ["44cm", "49cm", "154cm", "22cm"],
    answer: 0,
    explanation: "Circumference = 2πr = 2×(22/7)×7 = 44cm."
  },
  {
    question: "Calculate the area of a triangle with base 10cm and height 6cm.",
    options: ["60cm²", "16cm²", "30cm²", "45cm²"],
    answer: 2,
    explanation: "Area of triangle = ½ × base × height = ½×10×6 = 30cm²."
  },
  {
    question: "Calculate the volume of a cube with side length 4cm.",
    options: ["12cm³", "64cm³", "48cm³", "16cm³"],
    answer: 1,
    explanation: "Volume of cube = side³ = 4³ = 64cm³."
  },
  {
    question: "Calculate the area of a circle with radius 14cm. (π=22/7)",
    options: ["308cm²", "88cm²", "616cm²", "176cm²"],
    answer: 2,
    explanation: "Area = πr² = (22/7)×14² = (22/7)×196 = 616cm²."
  },
  {
    question: "Calculate the volume of a cylinder with radius 3cm and height 10cm. (π=3.14)",
    options: ["188.4cm³", "942cm³", "282.6cm³", "94.2cm³"],
    answer: 2,
    explanation: "Volume = πr²h = 3.14×3²×10 = 3.14×9×10 = 282.6cm³."
  },
  {
    question: "The formula for the surface area of a sphere is:",
    options: ["2πr²", "4πr²", "(4/3)πr³", "πr²"],
    answer: 1,
    explanation: "The surface area of a sphere is calculated using the formula 4πr², distinct from the volume formula (4/3)πr³."
  },
  {
    question: "Calculate the perimeter of a rectangle with length 15cm and width 8cm.",
    options: ["120cm", "23cm", "60cm", "46cm"],
    answer: 3,
    explanation: "Perimeter = 2(length+width) = 2(15+8) = 2×23 = 46cm."
  },
  {
    question: "Calculate the volume of a cone with radius 6cm and height 9cm. (π=3.14)",
    options: ["113.04cm³", "452.16cm³", "339.12cm³", "1017.36cm³"],
    answer: 2,
    explanation: "Volume of cone = (1/3)πr²h = (1/3)×3.14×36×9 = (1/3)×1017.36 = 339.12cm³."
  },
  {
    question: "Calculate the total surface area of a cube with side length 5cm.",
    options: ["25cm²", "125cm²", "100cm²", "150cm²"],
    answer: 3,
    explanation: "Total surface area of a cube = 6×side² = 6×5² = 6×25 = 150cm² (accounting for all 6 faces)."
  },
];

const MATHSD = [
  {
    question: "In a right-angled triangle, if the opposite side is 3cm and the hypotenuse is 5cm, calculate sin θ.",
    options: ["4/5", "3/4", "5/3", "3/5"],
    answer: 3,
    explanation: "sin θ = opposite/hypotenuse = 3/5."
  },
  {
    question: "Calculate the value of cos 60°.",
    options: ["0.5", "1", "0", "0.866"],
    answer: 0,
    explanation: "cos 60° is a standard trigonometric value equal to 1/2 (0.5)."
  },
  {
    question: "In a right-angled triangle, if the adjacent side is 4cm and hypotenuse is 5cm, find the opposite side using Pythagoras' theorem.",
    options: ["9cm", "3cm", "2cm", "6cm"],
    answer: 1,
    explanation: "Using a²+b²=c²: 4²+b²=5² → 16+b²=25 → b²=9 → b=3cm."
  },
  {
    question: "Which trigonometric ratio is defined as opposite/adjacent?",
    options: ["Cosine", "Secant", "Sine", "Tangent"],
    answer: 3,
    explanation: "Tangent (tan θ) is specifically defined as the ratio of the opposite side to the adjacent side in a right-angled triangle."
  },
  {
    question: "Calculate tan 45°.",
    options: ["√2", "0.5", "0", "1"],
    answer: 3,
    explanation: "tan 45° = 1, a standard value derived from an isosceles right triangle where opposite and adjacent sides are equal."
  },
  {
    question: "Using the sine rule, if a=8, sin A=0.6, and sin B=0.75, find b.",
    options: ["12", "9", "10", "6"],
    answer: 2,
    explanation: "Sine rule states a/sinA = b/sinB. So 8/0.6 = b/0.75, giving b = (8×0.75)/0.6 = 6/0.6 = 10."
  },
  {
    question: "What is the value of sin 90°?",
    options: ["0.5", "1", "Undefined", "0"],
    answer: 1,
    explanation: "sin 90° equals exactly 1, representing the maximum value of the sine function."
  },
  {
    question: "Calculate the height of a tree if the angle of elevation from a point 20m away is 30°. (tan 30° = 0.577)",
    options: ["34.6m", "10m", "17.3m", "11.5m"],
    answer: 3,
    explanation: "tan(angle) = height/distance, so height = distance × tan(30°) = 20×0.577 = 11.54m ≈ 11.5m."
  },
  {
    question: "Using the cosine rule, calculate side c if a=7, b=9, and angle C=60°. (cos 60°=0.5)",
    options: ["8.5", "8", "7.5", "6.9"],
    answer: 1,
    explanation: "c²=a²+b²-2ab·cosC = 49+81-2(7)(9)(0.5) = 130-63 = 67. c=√67≈8.19, closest to 8."
  },
  {
    question: "Which identity correctly represents sin²θ + cos²θ?",
    options: ["2", "1", "tan²θ", "0"],
    answer: 1,
    explanation: "This is the fundamental Pythagorean trigonometric identity, always equal to 1 for any angle θ."
  },
  {
    question: "Calculate the mean of the data set: 4, 8, 6, 10, 12.",
    options: ["9", "10", "7", "8"],
    answer: 3,
    explanation: "Mean = sum of values/number of values = (4+8+6+10+12)/5 = 40/5 = 8."
  },
  {
    question: "Find the median of the data set: 3, 7, 9, 12, 15.",
    options: ["12", "9", "9.2", "7"],
    answer: 1,
    explanation: "With data already ordered and 5 values (odd number), the median is the middle value: 9."
  },
  {
    question: "Which measure of central tendency is most affected by extreme outlier values?",
    options: ["Range", "Mode", "Median", "Mean"],
    answer: 3,
    explanation: "The mean is calculated using all values in the dataset, making it highly sensitive to extreme outliers."
  },
  {
    question: "Find the mode of the data set: 2, 4, 4, 6, 8, 4, 9.",
    options: ["No mode exists", "8", "4", "6"],
    answer: 2,
    explanation: "Mode is the value that appears most frequently — 4 appears three times, more than any other value in the set."
  },
  {
    question: "Calculate the range of the data set: 15, 22, 8, 30, 12.",
    options: ["18", "30", "22", "8"],
    answer: 2,
    explanation: "Range = highest value - lowest value = 30-8 = 22."
  },
  {
    question: "For a data set with an even number of values, the median is calculated by:",
    options: ["Taking the middle value directly", "Averaging the two middle values", "Taking the mode instead", "Taking the smallest value"],
    answer: 1,
    explanation: "When there's an even number of data points, the median is found by averaging the two central values after arranging data in order."
  },
  {
    question: "Calculate the mean of the data set: 10, 15, 20, 25, 30.",
    options: ["18", "15", "20", "22"],
    answer: 2,
    explanation: "Mean = (10+15+20+25+30)/5 = 100/5 = 20."
  },
  {
    question: "In a frequency distribution table, the class with the highest frequency is called the:",
    options: ["Mean class", "Range class", "Median class", "Modal class"],
    answer: 3,
    explanation: "The modal class is specifically defined as the class interval with the highest frequency in a grouped frequency distribution."
  },
  {
    question: "Which statement correctly describes standard deviation?",
    options: ["It equals the range divided by 2", "It measures the average value of a dataset", "It measures how spread out data values are from the mean", "It represents the most frequent value"],
    answer: 2,
    explanation: "Standard deviation quantifies the dispersion or spread of data points relative to the mean."
  },
  {
    question: "A data set has values: 5, 5, 5, 5, 5. What is the standard deviation?",
    options: ["5", "25", "0", "1"],
    answer: 2,
    explanation: "Since all values are identical (no variation from the mean), the standard deviation is exactly 0."
  },
  {
    question: "A fair coin is tossed once. What is the probability of getting heads?",
    options: ["1", "1/4", "0", "1/2"],
    answer: 3,
    explanation: "A fair coin has two equally likely outcomes (heads/tails), so probability of heads = 1/2."
  },
  {
    question: "A die is rolled once. Calculate the probability of getting a number greater than 4.",
    options: ["1/3", "1/6", "2/3", "1/2"],
    answer: 0,
    explanation: "Numbers greater than 4 on a die are 5 and 6 (2 favorable outcomes out of 6 total): probability = 2/6 = 1/3."
  },
  {
    question: "If two events are mutually exclusive, this means:",
    options: ["They can occur simultaneously", "One always causes the other", "They cannot occur at the same time", "They are independent events"],
    answer: 2,
    explanation: "Mutually exclusive events cannot both happen at the same time."
  },
  {
    question: "A bag contains 4 red balls and 6 blue balls. Calculate the probability of picking a red ball.",
    options: ["1/4", "6/10", "4/6", "4/10"],
    answer: 3,
    explanation: "Probability = favorable outcomes/total outcomes = 4 red/(4+6 total) = 4/10 = 2/5."
  },
  {
    question: "For two independent events A and B, P(A and B) is calculated as:",
    options: ["P(A) + P(B)", "P(A) / P(B)", "P(A) × P(B)", "P(A) - P(B)"],
    answer: 2,
    explanation: "For independent events, the probability of both occurring together equals the product of their individual probabilities."
  },
  {
    question: "A card is drawn from a standard deck of 52 cards. Calculate the probability of drawing a King.",
    options: ["1/52", "13/52", "4/52", "1/13"],
    answer: 3,
    explanation: "There are 4 Kings in a deck of 52 cards: probability = 4/52 = 1/13."
  },
  {
    question: "If P(A) = 0.3, calculate P(not A) [complement].",
    options: ["0", "1.3", "0.7", "0.3"],
    answer: 2,
    explanation: "Since probabilities of an event and its complement always sum to 1: P(not A) = 1-P(A) = 1-0.3 = 0.7."
  },
  {
    question: "Two dice are rolled. Calculate the probability of getting a sum of 7.",
    options: ["1/12", "6/36", "1/6", "5/36"],
    answer: 1,
    explanation: "Combinations giving sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 favorable outcomes out of 36 total: 6/36 = 1/6."
  },
  {
    question: "What is the probability of an impossible event?",
    options: ["0.5", "0", "1", "Undefined"],
    answer: 1,
    explanation: "An impossible event has zero probability of occurring."
  },
  {
    question: "A bag contains 5 white and 3 black balls. If one ball is drawn, calculate the probability it is black.",
    options: ["5/3", "3/8", "5/8", "3/5"],
    answer: 1,
    explanation: "Probability = favorable/total = 3 black/(5+3 total) = 3/8."
  },
  {
    question: "Calculate the distance between points (2,3) and (5,7).",
    options: ["4", "6", "5", "7"],
    answer: 2,
    explanation: "Using distance formula: √[(5-2)²+(7-3)²] = √[9+16] = √25 = 5."
  },
  {
    question: "Find the gradient (slope) of the line passing through points (1,2) and (4,8).",
    options: ["2", "3", "1", "6"],
    answer: 0,
    explanation: "Gradient = (y₂-y₁)/(x₂-x₁) = (8-2)/(4-1) = 6/3 = 2."
  },
  {
    question: "Find the midpoint of the line segment joining (2,4) and (6,8).",
    options: ["(4,6)", "(2,3)", "(3,5)", "(8,12)"],
    answer: 0,
    explanation: "Midpoint formula: [(x₁+x₂)/2, (y₁+y₂)/2] = [(2+6)/2, (4+8)/2] = (4,6)."
  },
  {
    question: "The equation of a line in the form y=mx+c represents:",
    options: ["m as the gradient, c as the y-intercept", "Neither m nor c has specific meaning", "Both m and c as gradients", "m as the y-intercept, c as the gradient"],
    answer: 0,
    explanation: "In the slope-intercept form y=mx+c, m represents the gradient (slope) of the line, while c represents the y-intercept."
  },
  {
    question: "Find the equation of a line with gradient 3 passing through point (2,5).",
    options: ["y=3x+1", "y=3x-1", "y=3x-5", "y=3x+5"],
    answer: 1,
    explanation: "Using y-y₁=m(x-x₁): y-5=3(x-2) → y-5=3x-6 → y=3x-1."
  },
  {
    question: "Two lines are parallel if their gradients are:",
    options: ["Both zero", "Opposite in sign only", "Equal", "Negative reciprocals of each other"],
    answer: 2,
    explanation: "Parallel lines share the exact same gradient (slope)."
  },
  {
    question: "Two lines are perpendicular if the product of their gradients equals:",
    options: ["-1", "0", "1", "Undefined"],
    answer: 0,
    explanation: "Perpendicular lines have gradients that are negative reciprocals of each other, meaning their product always equals -1."
  },
  {
    question: "Find the y-intercept of the line y=4x-7.",
    options: ["7", "4", "-4", "-7"],
    answer: 3,
    explanation: "In the form y=mx+c, the y-intercept is the constant term c, which here is -7."
  },
  {
    question: "Calculate the gradient of a line perpendicular to a line with gradient 2/3.",
    options: ["-3/2", "2/3", "3/2", "-2/3"],
    answer: 0,
    explanation: "Perpendicular gradients are negative reciprocals: if original gradient is 2/3, perpendicular gradient = -1/(2/3) = -3/2."
  },
  {
    question: "Which of the following points lies on the line y=2x+1?",
    options: ["(1,2)", "(2,5)", "(3,6)", "(0,2)"],
    answer: 1,
    explanation: "Testing (2,5): y=2(2)+1=5. This matches, confirming the point lies on the line."
  },
  {
    question: "Add the matrices: [[1,2],[3,4]] + [[5,6],[7,8]]",
    options: ["[[5,8],[10,12]]", "[[5,12],[21,32]]", "[[6,8],[10,12]]", "[[6,6],[10,10]]"],
    answer: 2,
    explanation: "Matrix addition adds corresponding elements: [1+5,2+6],[3+7,4+8] = [[6,8],[10,12]]."
  },
  {
    question: "Calculate the determinant of matrix [[3,4],[2,5]].",
    options: ["15", "8", "23", "7"],
    answer: 3,
    explanation: "For a 2×2 matrix [[a,b],[c,d]], determinant = ad-bc = (3×5)-(4×2) = 15-8 = 7."
  },
  {
    question: "Which condition must be met for two matrices to be multiplied together?",
    options: ["Both matrices must be square", "They must both be 2×2 matrices", "They must have the same dimensions", "The number of columns in the first matrix must equal the number of rows in the second"],
    answer: 3,
    explanation: "Matrix multiplication requires the number of columns in the first matrix to match the number of rows in the second matrix."
  },
  {
    question: "Find vector AB if A=(2,3) and B=(5,7).",
    options: ["(-3,-4)", "(7,10)", "(2.5,3.5)", "(3,4)"],
    answer: 3,
    explanation: "Vector AB = B-A (coordinates) = (5-2, 7-3) = (3,4)."
  },
  {
    question: "Calculate the magnitude of vector (3,4).",
    options: ["12", "25", "5", "7"],
    answer: 2,
    explanation: "Magnitude = √(x²+y²) = √(3²+4²) = √(9+16) = √25 = 5."
  },
  {
    question: "Multiply the matrix [[2,3]] by scalar 4.",
    options: ["[[8,12]]", "[[2,3,4]]", "[[8,3]]", "[[6,7]]"],
    answer: 0,
    explanation: "Scalar multiplication multiplies every element by the scalar: [2×4, 3×4] = [8,12]."
  },
  {
    question: "For a 2×2 matrix to have an inverse, its determinant must be:",
    options: ["Not equal to zero", "Always negative", "Always positive", "Equal to zero"],
    answer: 0,
    explanation: "A matrix inverse only exists when the determinant is non-zero."
  },
  {
    question: "Add vectors: (2,5) + (3,-2)",
    options: ["(6,-10)", "(-1,7)", "(5,3)", "(1,7)"],
    answer: 2,
    explanation: "Vector addition adds corresponding components: (2+3, 5+(-2)) = (5,3)."
  },
  {
    question: "Find the inverse of matrix [[2,0],[0,3]] (a diagonal matrix).",
    options: ["[[3,0],[0,2]]", "[[0.5,0.5],[0.5,0.5]]", "[[1/2,0],[0,1/3]]", "[[-2,0],[0,-3]]"],
    answer: 2,
    explanation: "For a diagonal matrix, the inverse simply takes the reciprocal of each diagonal element: [[1/2,0],[0,1/3]]."
  },
  {
    question: "Which of the following describes a null (zero) vector?",
    options: ["A vector with maximum magnitude", "A vector equal to (1,1)", "A vector pointing in the positive x-direction only", "A vector with zero magnitude and no specific direction"],
    answer: 3,
    explanation: "A null vector has zero magnitude (length) and, by convention, has no defined direction."
  },
];

const BIOLOGYA = [
  {
    question: "Which organelle is responsible for producing energy (ATP) in a cell?",
    options: ["Golgi apparatus", "Nucleus", "Ribosome", "Mitochondrion"],
    answer: 3,
    explanation: "Mitochondria are known as the \"powerhouse of the cell\" because they carry out cellular respiration, converting glucose and oxygen into ATP (usable energy)."
  },
  {
    question: "Which structure controls the entry and exit of substances into and out of a cell?",
    options: ["Cytoplasm", "Nucleus", "Cell wall", "Cell membrane"],
    answer: 3,
    explanation: "The cell (plasma) membrane is selectively permeable, regulating what substances can pass into or out of the cell, maintaining internal homeostasis."
  },
  {
    question: "Which of the following organelles is found in plant cells but NOT in animal cells?",
    options: ["Mitochondria", "Chloroplast", "Ribosome", "Nucleus"],
    answer: 1,
    explanation: "Chloroplasts, responsible for photosynthesis, are unique to plant cells (and some protists), while animal cells lack this organelle since they don't photosynthesize."
  },
  {
    question: "The nucleus of a cell primarily functions to:",
    options: ["Break down waste materials", "Generate energy", "Control cellular activities and store genetic material (DNA)", "Produce proteins"],
    answer: 2,
    explanation: "The nucleus houses the cell's DNA and acts as the control center, directing cellular activities like growth, metabolism, and reproduction through gene expression."
  },
  {
    question: "Which organelle is responsible for protein synthesis?",
    options: ["Lysosome", "Ribosome", "Vacuole", "Golgi apparatus"],
    answer: 1,
    explanation: "Ribosomes are the cellular structures where amino acids are assembled into proteins based on genetic instructions from mRNA."
  },
  {
    question: "The rigid outer layer found in plant cells (but absent in animal cells) is called the:",
    options: ["Cytoplasm", "Cell wall", "Cell membrane", "Nuclear membrane"],
    answer: 1,
    explanation: "The cell wall, primarily made of cellulose, provides structural support and protection specifically to plant cells, a feature absent in animal cells."
  },
  {
    question: "Lysosomes primarily function to:",
    options: ["Store water", "Break down waste materials and cellular debris", "Produce energy", "Control cell division"],
    answer: 1,
    explanation: "Lysosomes contain digestive enzymes that break down waste materials, damaged organelles, and foreign substances, acting as the cell's \"recycling and disposal\" system."
  },
  {
    question: "Which of the following best describes the difference between prokaryotic and eukaryotic cells?",
    options: ["Eukaryotic cells are always smaller", "Prokaryotic cells have a nucleus; eukaryotic cells don't", "Both have identical structures", "Prokaryotic cells lack a true nucleus; eukaryotic cells have a membrane-bound nucleus"],
    answer: 3,
    explanation: "The defining distinction is that prokaryotic cells (like bacteria) lack a membrane-enclosed nucleus, with genetic material floating freely in the cytoplasm, while eukaryotic cells have a true, membrane-bound nucleus."
  },
  {
    question: "The Golgi apparatus primarily functions to:",
    options: ["Produce ATP", "Break down large molecules", "Modify, package, and transport proteins", "Store genetic material"],
    answer: 2,
    explanation: "The Golgi apparatus acts as the cell's \"post office,\" receiving proteins from the endoplasmic reticulum, modifying them, and packaging them for transport to their final destinations."
  },
  {
    question: "Which structure is responsible for maintaining cell shape and enabling movement of organelles within animal cells?",
    options: ["Nuclear membrane", "Vacuole", "Cytoskeleton", "Cell wall"],
    answer: 2,
    explanation: "The cytoskeleton, a network of protein fibers, provides structural support, maintains cell shape, and facilitates the movement of organelles and the cell itself."
  },
  {
    question: "Mitosis results in the production of:",
    options: ["One large cell", "Two genetically identical daughter cells", "Four genetically different daughter cells", "Four identical daughter cells"],
    answer: 1,
    explanation: "Mitosis is a type of cell division that produces two genetically identical daughter cells, each with the same chromosome number as the parent cell, essential for growth and repair."
  },
  {
    question: "Meiosis specifically produces:",
    options: ["Four identical daughter cells with full chromosome number", "One daughter cell", "Four genetically different daughter cells with half the chromosome number", "Two identical daughter cells"],
    answer: 2,
    explanation: "Meiosis is specifically involved in producing gametes (sex cells), resulting in four genetically diverse daughter cells, each with half the original chromosome number (haploid)."
  },
  {
    question: "During which phase of mitosis do chromosomes align at the cell's equator?",
    options: ["Telophase", "Metaphase", "Anaphase", "Prophase"],
    answer: 1,
    explanation: "Metaphase is characterized by chromosomes aligning along the metaphase plate (cell's equator), ensuring accurate separation during the subsequent anaphase."
  },
  {
    question: "Why is meiosis essential for sexual reproduction?",
    options: ["It maintains the same chromosome number across generations by halving it during gamete formation", "It doubles the chromosome number", "It produces more cells for growth", "It has no specific importance"],
    answer: 0,
    explanation: "Meiosis halves the chromosome number in gametes, ensuring that when two gametes fuse during fertilization, the resulting offspring has the correct diploid chromosome number."
  },
  {
    question: "During which phase of the cell cycle does DNA replication occur?",
    options: ["Telophase", "Interphase (S phase)", "Metaphase", "Prophase"],
    answer: 1,
    explanation: "DNA replication specifically occurs during the S (synthesis) phase of interphase, before the cell enters the actual division phases."
  },
  {
    question: "What is the significance of crossing over during meiosis?",
    options: ["It reduces genetic diversity", "It increases genetic variation by exchanging genetic material between homologous chromosomes", "It only occurs during mitosis", "It has no biological significance"],
    answer: 1,
    explanation: "Crossing over involves the exchange of genetic segments between homologous chromosomes during meiosis, creating new combinations of alleles and significantly increasing genetic diversity in offspring."
  },
  {
    question: "Which of the following is a key difference between mitosis and meiosis?",
    options: ["Mitosis maintains chromosome number; meiosis halves it", "Mitosis occurs only in plants", "Meiosis produces genetically identical cells, mitosis doesn't", "There is no difference"],
    answer: 0,
    explanation: "A fundamental distinction is that mitosis produces daughter cells with the same chromosome number as the parent, while meiosis specifically reduces the chromosome number by half for sexual reproduction."
  },
  {
    question: "During cytokinesis, what specifically occurs?",
    options: ["Nuclear membrane breakdown", "DNA replication", "Chromosome alignment", "Division of the cytoplasm to form two separate cells"],
    answer: 3,
    explanation: "Cytokinesis is the final stage of cell division where the cytoplasm physically divides, creating two separate daughter cells, following the division of genetic material."
  },
  {
    question: "How many chromosomes would a human gamete (sperm or egg) contain, given that human somatic cells have 46 chromosomes?",
    options: ["46", "23", "92", "12"],
    answer: 1,
    explanation: "Since meiosis halves the chromosome number, human gametes contain 23 chromosomes (haploid number), which combine during fertilization to restore the full 46 chromosomes (diploid) in the offspring."
  },
  {
    question: "Uncontrolled cell division, often associated with damaged regulatory mechanisms, can lead to:",
    options: ["No significant consequences", "Improved organism health", "Faster healing only", "Cancer (tumor formation)"],
    answer: 3,
    explanation: "When normal cell division control mechanisms fail (due to genetic mutations), cells can divide uncontrollably, forming tumors and potentially leading to cancer."
  },
  {
    question: "Photosynthesis in plants primarily occurs in which organelle?",
    options: ["Chloroplast", "Ribosome", "Mitochondria", "Nucleus"],
    answer: 0,
    explanation: "Chloroplasts contain chlorophyll, the pigment essential for capturing light energy and converting carbon dioxide and water into glucose and oxygen during photosynthesis."
  },
  {
    question: "Which of the following is the correct overall equation for photosynthesis?",
    options: ["6O₂ + 6H₂O → C₆H₁₂O₆ + 6CO₂", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O", "C₆H₁₂O₆ → 6CO₂ + 6H₂O", "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (using light energy)"],
    answer: 3,
    explanation: "Photosynthesis converts carbon dioxide and water into glucose and oxygen, using light energy captured by chlorophyll."
  },
  {
    question: "Herbivores are animals that primarily feed on:",
    options: ["Decomposed matter only", "Other animals", "Both plants and animals", "Plants only"],
    answer: 3,
    explanation: "Herbivores are specifically classified as animals whose diet consists mainly or entirely of plant material, distinguishing them from carnivores and omnivores."
  },
  {
    question: "Which type of nutrition involves organisms making their own food using light energy?",
    options: ["Parasitic nutrition", "Saprophytic nutrition", "Heterotrophic nutrition", "Autotrophic (photosynthetic) nutrition"],
    answer: 3,
    explanation: "Autotrophic nutrition, specifically photosynthetic autotrophy, describes organisms (like plants) that synthesize their own organic food from inorganic materials using light energy."
  },
  {
    question: "Which enzyme in human saliva begins the digestion of starch?",
    options: ["Lipase", "Trypsin", "Amylase", "Pepsin"],
    answer: 2,
    explanation: "Salivary amylase specifically breaks down starch into simpler sugars (maltose) as the initial step of carbohydrate digestion, beginning in the mouth."
  },
  {
    question: "Which part of the human digestive system is primarily responsible for nutrient absorption?",
    options: ["Stomach", "Large intestine", "Small intestine", "Esophagus"],
    answer: 2,
    explanation: "The small intestine, with its extensive surface area created by villi and microvilli, is the primary site where digested nutrients are absorbed into the bloodstream."
  },
  {
    question: "Parasitic nutrition involves an organism that:",
    options: ["Only consumes decaying matter", "Makes its own food", "Lives on or in another organism, deriving nutrients while harming the host", "Photosynthesizes for energy"],
    answer: 2,
    explanation: "Parasites obtain nutrition by living on or within a host organism, typically causing harm to the host while benefiting themselves nutritionally."
  },
  {
    question: "Which of the following nutrients is primarily broken down by the enzyme pepsin in the stomach?",
    options: ["Proteins", "Fats", "Vitamins", "Carbohydrates"],
    answer: 0,
    explanation: "Pepsin, secreted in the stomach, specifically breaks down proteins into smaller peptide chains, functioning optimally in the stomach's acidic environment."
  },
  {
    question: "Saprophytic nutrition refers to organisms that:",
    options: ["Produce their own food through photosynthesis", "Only consume living plants", "Cannot digest any food", "Obtain nutrients by feeding on dead and decaying organic matter"],
    answer: 3,
    explanation: "Saprophytes (like many fungi and bacteria) obtain nutrition by decomposing and absorbing nutrients from dead organic material, playing a crucial role in nutrient recycling."
  },
  {
    question: "Which mineral element is essential for chlorophyll formation in plants?",
    options: ["Calcium", "Phosphorus", "Potassium", "Magnesium"],
    answer: 3,
    explanation: "Magnesium is a central component of the chlorophyll molecule structure, making it essential for chlorophyll synthesis and, consequently, photosynthesis."
  },
  {
    question: "Which plant tissue is responsible for transporting water and minerals from roots to leaves?",
    options: ["Epidermis", "Cortex", "Xylem", "Phloem"],
    answer: 2,
    explanation: "Xylem tissue specifically transports water and dissolved minerals upward from roots to other parts of the plant, primarily through a passive process driven by transpiration."
  },
  {
    question: "Phloem tissue in plants is primarily responsible for transporting:",
    options: ["Water only", "Manufactured food (sugars) from leaves to other plant parts", "Oxygen", "Minerals only"],
    answer: 1,
    explanation: "Phloem transports organic nutrients, primarily sucrose produced during photosynthesis, from source tissues to sink tissues throughout the plant."
  },
  {
    question: "In the human circulatory system, which chamber of the heart pumps oxygenated blood to the body?",
    options: ["Right ventricle", "Right atrium", "Left ventricle", "Left atrium"],
    answer: 2,
    explanation: "The left ventricle receives oxygenated blood from the left atrium and pumps it with significant force through the aorta to circulate throughout the entire body."
  },
  {
    question: "Which blood vessels carry blood away from the heart?",
    options: ["Arteries", "Veins", "Capillaries", "Venules"],
    answer: 0,
    explanation: "Arteries are specifically defined as blood vessels carrying blood away from the heart (regardless of oxygen content), while veins carry blood back toward the heart."
  },
  {
    question: "What is the primary function of red blood cells?",
    options: ["Transporting oxygen throughout the body", "Blood clotting", "Fighting infections", "Producing antibodies"],
    answer: 0,
    explanation: "Red blood cells contain hemoglobin, a protein that binds to oxygen in the lungs and releases it to body tissues, making oxygen transport their primary function."
  },
  {
    question: "Which process describes the movement of water from roots through the plant and its evaporation from leaves?",
    options: ["Germination", "Photosynthesis", "Respiration", "Transpiration"],
    answer: 3,
    explanation: "Transpiration is the process by which water evaporates from plant leaves (primarily through stomata), creating a pull that draws water upward through the xylem from the roots."
  },
  {
    question: "Which blood cells are primarily responsible for fighting infections?",
    options: ["White blood cells", "Platelets", "Red blood cells", "Plasma cells only"],
    answer: 0,
    explanation: "White blood cells (leukocytes) are the immune system's primary defenders, identifying and destroying pathogens like bacteria and viruses."
  },
  {
    question: "In double circulation (as in mammals), blood passes through the heart:",
    options: ["Twice per complete circuit (once for pulmonary, once for systemic circulation)", "Never passes through the heart", "Once per complete circuit", "Three times per circuit"],
    answer: 0,
    explanation: "Double circulation involves blood passing through the heart twice in one complete cycle — once through pulmonary circulation and once through systemic circulation."
  },
  {
    question: "What is the function of platelets in blood?",
    options: ["Producing hormones", "Blood clotting", "Oxygen transport", "Fighting infections"],
    answer: 1,
    explanation: "Platelets (thrombocytes) are essential for blood clotting, aggregating at injury sites to form clots that prevent excessive blood loss."
  },
  {
    question: "Root hairs increase the efficiency of water absorption in plants primarily by:",
    options: ["Increasing the surface area for water and mineral uptake", "Storing food reserves", "Producing more chlorophyll", "Photosynthesizing more efficiently"],
    answer: 0,
    explanation: "Root hairs are thin extensions of root epidermal cells that significantly increase the surface area in contact with soil, maximizing water and mineral ion absorption efficiency."
  },
  {
    question: "Which type of respiration requires oxygen?",
    options: ["Aerobic respiration", "Fermentation", "Anaerobic respiration", "Photosynthesis"],
    answer: 0,
    explanation: "Aerobic respiration specifically requires oxygen to fully break down glucose, producing significantly more ATP energy compared to oxygen-independent processes."
  },
  {
    question: "What is the primary end product of anaerobic respiration in human muscle cells during intense exercise?",
    options: ["Water", "Carbon dioxide only", "Ethanol", "Lactic acid"],
    answer: 3,
    explanation: "When oxygen supply is insufficient during intense exercise, human muscle cells undergo anaerobic respiration, producing lactic acid as a byproduct."
  },
  {
    question: "In which cellular organelle does aerobic respiration primarily occur?",
    options: ["Golgi apparatus", "Mitochondria", "Nucleus", "Ribosome"],
    answer: 1,
    explanation: "Mitochondria house the enzymes and structures necessary for the later stages of aerobic respiration, where most ATP is generated."
  },
  {
    question: "Write the general word equation for aerobic respiration.",
    options: ["Glucose + water → oxygen + energy", "Carbon dioxide + water → glucose + oxygen", "Glucose + oxygen → carbon dioxide + water + energy", "Glucose → ethanol + carbon dioxide"],
    answer: 2,
    explanation: "Aerobic respiration breaks down glucose using oxygen, releasing carbon dioxide, water, and energy (ATP) as products."
  },
  {
    question: "Which gas is exchanged during breathing, specifically taken IN by the lungs?",
    options: ["Oxygen", "Methane", "Nitrogen", "Carbon dioxide"],
    answer: 0,
    explanation: "During inhalation, oxygen from the atmosphere enters the lungs and diffuses into the bloodstream, essential for cellular aerobic respiration."
  },
  {
    question: "Yeast undergoing anaerobic respiration (fermentation) produces:",
    options: ["Only water", "Only oxygen", "Lactic acid", "Ethanol and carbon dioxide"],
    answer: 3,
    explanation: "Yeast performs alcoholic fermentation under anaerobic conditions, converting glucose into ethanol and carbon dioxide."
  },
  {
    question: "Why does anaerobic respiration release significantly less energy than aerobic respiration?",
    options: ["It uses more oxygen", "Glucose is only partially broken down, releasing less stored chemical energy", "It occurs faster", "It doesn't involve glucose at all"],
    answer: 1,
    explanation: "Anaerobic respiration incompletely breaks down glucose, releasing far less ATP compared to the complete breakdown achieved through aerobic respiration."
  },
  {
    question: "Which structures in the lungs are the primary sites of gas exchange?",
    options: ["Alveoli", "Trachea", "Bronchioles", "Bronchi"],
    answer: 0,
    explanation: "Alveoli are tiny, thin-walled air sacs with extensive surface area and rich blood supply, specifically structured to maximize efficient gas exchange."
  },
  {
    question: "During vigorous exercise, breathing rate increases primarily to:",
    options: ["Decrease oxygen supply to muscles", "Increase oxygen intake and remove excess carbon dioxide more efficiently", "Slow down metabolism", "Reduce heart rate"],
    answer: 1,
    explanation: "Increased breathing rate during exercise helps meet the elevated oxygen demand of actively respiring muscle tissue while efficiently expelling the increased carbon dioxide produced."
  },
  {
    question: "Which of the following correctly compares aerobic and anaerobic respiration in terms of ATP yield per glucose molecule?",
    options: ["Neither process produces ATP", "Anaerobic produces more ATP than aerobic", "Aerobic produces significantly more ATP than anaerobic", "Both produce identical amounts of ATP"],
    answer: 2,
    explanation: "Aerobic respiration can yield approximately 36-38 ATP molecules per glucose molecule, while anaerobic respiration yields only about 2 ATP molecules."
  },
];

const BIOLOGYB = [
  {
    question: "Which organ is primarily responsible for filtering waste products from the blood in humans?",
    options: ["Lungs", "Skin", "Liver", "Kidney"],
    answer: 3,
    explanation: "Kidneys filter blood to remove metabolic waste products (especially urea) and excess substances, forming urine as the primary excretory product."
  },
  {
    question: "What is the main nitrogenous waste product excreted by humans?",
    options: ["Carbon dioxide", "Urea", "Ammonia", "Uric acid"],
    answer: 1,
    explanation: "Humans primarily excrete urea, a less toxic form of nitrogenous waste converted from ammonia by the liver, then filtered out by the kidneys."
  },
  {
    question: "Which structure within the kidney is the functional unit responsible for filtration?",
    options: ["Ureter", "Renal pelvis", "Nephron", "Bladder"],
    answer: 2,
    explanation: "The nephron is the microscopic functional unit of the kidney, responsible for the entire process of blood filtration, reabsorption, and urine formation."
  },
  {
    question: "Which organ produces urea as a byproduct of protein metabolism?",
    options: ["Pancreas", "Kidney", "Spleen", "Liver"],
    answer: 3,
    explanation: "The liver converts toxic ammonia (from protein breakdown) into less harmful urea through the urea cycle, which is then transported to the kidneys for excretion."
  },
  {
    question: "Sweat glands in human skin primarily help excrete:",
    options: ["Digestive enzymes", "Carbon dioxide only", "Bile", "Water, salts, and small amounts of urea"],
    answer: 3,
    explanation: "Sweat glands excrete water, salts, and trace amounts of urea through the skin, serving a dual function of excretion and temperature regulation."
  },
  {
    question: "Which excretory structure do insects use, distinct from human kidneys?",
    options: ["Malpighian tubules", "Nephridia", "Gills", "Contractile vacuoles"],
    answer: 0,
    explanation: "Insects possess Malpighian tubules, specialized excretory structures that filter waste from the hemolymph and produce a concentrated waste product."
  },
  {
    question: "In plants, excess water and some waste gases are primarily removed through:",
    options: ["Stomata (in leaves)", "Flowers", "Roots", "Seeds"],
    answer: 0,
    explanation: "Stomata, tiny pores mainly on leaf surfaces, facilitate the exchange of gases and water vapor loss (transpiration), serving excretory-like functions in plants."
  },
  {
    question: "Why is ammonia, though a natural waste product, dangerous if allowed to accumulate in the human body?",
    options: ["It has no biological effects", "It causes excessive urination only", "It provides too much energy", "It is highly toxic even in small concentrations"],
    answer: 3,
    explanation: "Ammonia is extremely toxic to cells even at low concentrations, which is why the liver rapidly converts it to the safer, less toxic compound urea."
  },
  {
    question: "The process of removing metabolic waste products from an organism's body is called:",
    options: ["Respiration", "Excretion", "Absorption", "Digestion"],
    answer: 1,
    explanation: "Excretion is specifically defined as the biological process of eliminating metabolic waste products that could become toxic if allowed to accumulate."
  },
  {
    question: "Which of the following is NOT typically considered an excretory organ/structure in humans?",
    options: ["Kidneys", "Skin", "Lungs", "Stomach"],
    answer: 3,
    explanation: "While kidneys, lungs, and skin are recognized excretory organs, the stomach is primarily involved in digestion, not excretion of metabolic waste."
  },
  {
    question: "Homeostasis refers to:",
    options: ["The maintenance of a stable internal environment despite external changes", "The breakdown of food", "The growth of an organism", "The process of reproduction"],
    answer: 0,
    explanation: "Homeostasis describes the body's ability to maintain relatively constant internal conditions regardless of fluctuations in the external environment."
  },
  {
    question: "Which organ primarily regulates blood glucose levels through hormone secretion?",
    options: ["Kidney", "Pancreas", "Spleen", "Liver"],
    answer: 1,
    explanation: "The pancreas secretes insulin and glucagon, hormones that work antagonistically to regulate blood glucose levels."
  },
  {
    question: "When body temperature rises above normal, which mechanism helps cool the body down?",
    options: ["Vasoconstriction", "Reduced blood flow to skin", "Shivering", "Sweating and vasodilation"],
    answer: 3,
    explanation: "When body temperature increases, sweat glands increase perspiration while blood vessels near the skin dilate, increasing heat loss to the environment."
  },
  {
    question: "Insulin's primary function is to:",
    options: ["Regulate body temperature", "Decrease blood glucose levels by promoting cellular uptake and storage", "Control water balance", "Increase blood glucose levels"],
    answer: 1,
    explanation: "Insulin, released when blood glucose is high, stimulates cells to absorb glucose from the blood and convert excess into glycogen for storage."
  },
  {
    question: "Which hormone raises blood glucose levels when they become too low?",
    options: ["Glucagon", "Insulin", "Estrogen", "Adrenaline (only)"],
    answer: 0,
    explanation: "Glucagon, also secreted by the pancreas, stimulates the liver to convert stored glycogen back into glucose, raising blood glucose levels."
  },
  {
    question: "Negative feedback mechanisms in homeostasis work by:",
    options: ["Amplifying the initial change", "Only working during illness", "Counteracting changes to return the system to its normal set point", "Having no effect on the original stimulus"],
    answer: 2,
    explanation: "Negative feedback is the primary homeostatic mechanism where the body detects a deviation from normal and initiates responses that counteract and reverse that change."
  },
  {
    question: "When body temperature drops below normal, which response helps generate heat?",
    options: ["Shivering (muscle contractions generating heat)", "Vasodilation", "Sweating", "Increased blood flow to skin"],
    answer: 0,
    explanation: "Shivering involves rapid, involuntary muscle contractions that generate heat through increased metabolic activity."
  },
  {
    question: "Which organ plays a key role in regulating water balance in the human body?",
    options: ["Liver", "Pancreas", "Stomach", "Kidney"],
    answer: 3,
    explanation: "Kidneys regulate water balance by adjusting the amount of water reabsorbed back into the blood versus excreted as urine."
  },
  {
    question: "Diabetes mellitus is primarily characterized by:",
    options: ["No connection to blood sugar regulation", "Overproduction of glucagon only", "Inability to properly regulate blood glucose levels (often due to insufficient insulin or insulin resistance)", "Excess insulin production"],
    answer: 2,
    explanation: "Diabetes mellitus results from either insufficient insulin production or the body's cells becoming resistant to insulin's effects, leading to chronically elevated blood glucose levels."
  },
  {
    question: "Vasoconstriction (narrowing of blood vessels near the skin) helps the body:",
    options: ["Have no thermoregulatory effect", "Increase heat loss", "Increase sweating", "Conserve heat by reducing blood flow to the skin surface"],
    answer: 3,
    explanation: "When body temperature drops, vasoconstriction reduces blood flow to skin surface capillaries, minimizing heat loss to the environment."
  },
  {
    question: "Which type of joint allows movement in multiple directions, as seen in the shoulder?",
    options: ["Hinge joint", "Fixed joint", "Pivot joint", "Ball and socket joint"],
    answer: 3,
    explanation: "Ball and socket joints allow extensive multidirectional movement due to their unique rounded structure fitting into a cup-shaped socket."
  },
  {
    question: "The human skeleton primarily functions to:",
    options: ["Regulate body temperature", "Provide support, protection, and enable movement (with muscles)", "Only produce blood cells", "Only store minerals"],
    answer: 1,
    explanation: "The skeletal system serves multiple crucial functions: providing structural support, protecting vital organs, enabling movement, and storing minerals."
  },
  {
    question: "Which type of muscle is responsible for voluntary movement, such as walking?",
    options: ["Involuntary muscle only", "Smooth muscle", "Skeletal muscle", "Cardiac muscle"],
    answer: 2,
    explanation: "Skeletal muscles are attached to bones and are under voluntary (conscious) control, enabling deliberate movements like walking."
  },
  {
    question: "Tendons connect:",
    options: ["Bone to skin", "Muscle to bone", "Bone to bone", "Muscle to muscle"],
    answer: 1,
    explanation: "Tendons are tough connective tissue structures that specifically attach muscles to bones."
  },
  {
    question: "Ligaments primarily function to:",
    options: ["Generate movement", "Connect muscle to bone", "Connect bone to bone, providing joint stability", "Store energy"],
    answer: 2,
    explanation: "Ligaments are fibrous connective tissues that specifically connect bones to other bones at joints, providing stability."
  },
  {
    question: "Which type of joint allows movement in only one plane, like the elbow?",
    options: ["Ball and socket joint", "Pivot joint", "Hinge joint", "Gliding joint"],
    answer: 2,
    explanation: "Hinge joints permit movement in a single plane, similar to a door hinge, allowing flexion and extension but not rotation."
  },
  {
    question: "The human vertebral column (spine) primarily functions to:",
    options: ["Support the body, protect the spinal cord, and enable flexibility", "Only produce blood cells", "Only enable digestion", "Store excess fat"],
    answer: 0,
    explanation: "The vertebral column provides crucial structural support for the body, protects the delicate spinal cord, and its segmented structure allows flexible movement."
  },
  {
    question: "In muscle contraction, which two proteins primarily interact to cause shortening of muscle fibers?",
    options: ["Hemoglobin and myoglobin", "Collagen and elastin", "Keratin and collagen", "Actin and myosin"],
    answer: 3,
    explanation: "Actin and myosin are the primary contractile proteins within muscle fibers that interact to cause muscle contraction and shortening."
  },
  {
    question: "Cartilage differs from bone primarily in that cartilage is:",
    options: ["More flexible and less rigid than bone", "Only found in fish", "Not found in the human body", "Harder than bone"],
    answer: 0,
    explanation: "Cartilage is a flexible, somewhat rubbery connective tissue that provides cushioning and support in areas requiring flexibility."
  },
  {
    question: "Antagonistic muscle pairs (like biceps and triceps) work by:",
    options: ["Contracting simultaneously to create movement", "Working independently with no coordination", "One muscle contracting while the other relaxes, creating opposite movements", "Both muscles staying permanently relaxed"],
    answer: 2,
    explanation: "Antagonistic muscle pairs work in opposition — when one muscle contracts to bend a joint, its antagonist relaxes, and vice versa."
  },
  {
    question: "Which type of reproduction involves the fusion of male and female gametes?",
    options: ["Sexual reproduction", "Budding", "Binary fission", "Asexual reproduction"],
    answer: 0,
    explanation: "Sexual reproduction specifically involves the fusion of specialized sex cells (gametes) from two parents, combining genetic material."
  },
  {
    question: "Which of the following is an example of asexual reproduction?",
    options: ["Human reproduction", "Binary fission in bacteria", "Flowering plant pollination", "Animal mating"],
    answer: 1,
    explanation: "Binary fission, where a single organism splits into two genetically identical daughter cells, is a classic example of asexual reproduction."
  },
  {
    question: "In flowering plants, fertilization occurs when:",
    options: ["Petals fall off", "The male gamete (from pollen) fuses with the female gamete (ovule) after pollen tube growth", "Pollen lands on the stigma only", "Leaves photosynthesize"],
    answer: 1,
    explanation: "True fertilization in flowering plants requires pollen grains to germinate and grow a pollen tube down to the ovule, allowing the male gamete to fuse with the female gamete."
  },
  {
    question: "Which human reproductive organ produces sperm cells?",
    options: ["Ovary", "Testis", "Fallopian tube", "Uterus"],
    answer: 1,
    explanation: "Testes are the male reproductive organs specifically responsible for producing sperm cells and secreting testosterone."
  },
  {
    question: "Where does fertilization typically occur in the human female reproductive system?",
    options: ["Fallopian tube", "Ovary", "Vagina", "Uterus"],
    answer: 0,
    explanation: "Fertilization typically occurs in the fallopian tube, after which the resulting zygote travels to the uterus for implantation."
  },
  {
    question: "Which of the following best describes an advantage of sexual reproduction over asexual reproduction?",
    options: ["It produces genetic variation, potentially aiding species survival", "It requires only one parent", "It's faster", "It always produces more offspring"],
    answer: 0,
    explanation: "Sexual reproduction combines genetic material from two parents, creating genetically diverse offspring, which can enhance a species' ability to adapt."
  },
  {
    question: "In plants, vegetative propagation (like using stem cuttings) is an example of:",
    options: ["Fertilization", "Sexual reproduction", "Pollination", "Asexual reproduction"],
    answer: 3,
    explanation: "Vegetative propagation involves producing new plants from parts of a single parent plant without gamete fusion, making it a form of asexual reproduction."
  },
  {
    question: "The process by which pollen is transferred from the anther to the stigma is called:",
    options: ["Pollination", "Photosynthesis", "Fertilization", "Germination"],
    answer: 0,
    explanation: "Pollination specifically refers to the transfer of pollen grains from the anther to the stigma, a necessary precursor to fertilization."
  },
  {
    question: "Which hormone is primarily responsible for triggering ovulation in the human female menstrual cycle?",
    options: ["Estrogen only", "Luteinizing hormone (LH) surge", "Progesterone only", "Testosterone"],
    answer: 1,
    explanation: "A sudden surge in luteinizing hormone (LH) triggers ovulation, causing the mature egg to be released from the ovary."
  },
  {
    question: "Budding, as seen in organisms like Hydra, is a form of:",
    options: ["Internal fertilization", "External fertilization", "Sexual reproduction", "Asexual reproduction"],
    answer: 3,
    explanation: "Budding involves a new individual developing as an outgrowth from the parent organism's body, requiring only one parent."
  },
  {
    question: "Which type of growth involves an increase in both cell number and cell size?",
    options: ["Growth (combining cell division and cell enlargement)", "Only cell division", "Only cell enlargement", "Cell death"],
    answer: 0,
    explanation: "Biological growth typically involves both an increase in cell number (through mitosis) and an increase in individual cell size."
  },
  {
    question: "Metamorphosis, as seen in butterflies, refers to:",
    options: ["No change during development", "Reproduction only", "Only growth in size without form change", "A dramatic change in body form during development from larva to adult"],
    answer: 3,
    explanation: "Metamorphosis describes the significant transformation in body structure that certain organisms undergo during development."
  },
  {
    question: "Which hormone is primarily responsible for stimulating growth in humans?",
    options: ["Thyroxine only", "Growth hormone (from the pituitary gland)", "Insulin", "Adrenaline"],
    answer: 1,
    explanation: "Growth hormone, secreted by the pituitary gland, stimulates growth in tissues throughout the body, particularly bone and muscle growth."
  },
  {
    question: "Puberty in humans is primarily triggered by:",
    options: ["Environmental temperature changes", "Decreased metabolism", "Growth hormone alone", "Increased secretion of sex hormones (testosterone/estrogen)"],
    answer: 3,
    explanation: "Puberty is triggered by increased secretion of sex hormones, leading to the development of secondary sexual characteristics and reproductive maturity."
  },
  {
    question: "Which of the following best describes indeterminate growth (seen in many plants)?",
    options: ["Growth only during embryonic development", "No growth after birth", "Continuous growth throughout the organism's life", "Growth that stops at a specific predetermined size"],
    answer: 2,
    explanation: "Indeterminate growth describes organisms (like most plants) that continue growing throughout their entire lifespan."
  },
  {
    question: "In human development, the stage immediately following the embryo stage (from about 9 weeks until birth) is called:",
    options: ["Fetal stage", "Infant stage", "Zygote stage", "Blastocyst stage"],
    answer: 0,
    explanation: "After the embryonic stage, human development enters the fetal stage, continuing from 9 weeks until birth."
  },
  {
    question: "Which factor is NOT typically considered essential for normal growth and development?",
    options: ["Genetic factors", "Proper hormone balance", "Adequate nutrition", "Random environmental noise"],
    answer: 3,
    explanation: "While nutrition, hormones, and genetics are all critical factors, random environmental noise has no established biological role in these processes."
  },
  {
    question: "Which stage of insect metamorphosis is typically inactive/non-feeding, undergoing significant internal transformation?",
    options: ["Pupa stage", "Adult stage", "Egg stage", "Larva stage"],
    answer: 0,
    explanation: "The pupa stage is characterized by dramatic internal restructuring, during which the organism typically doesn't feed and appears externally inactive."
  },
  {
    question: "Growth curves in organisms typically show which pattern?",
    options: ["Immediate maximum growth at birth", "An S-shaped (sigmoid) curve — slow initial growth, rapid growth phase, then plateau", "No predictable pattern", "Constant linear growth throughout life"],
    answer: 1,
    explanation: "Many organisms display sigmoid (S-shaped) growth curves — starting with slower initial growth, followed by a rapid growth phase, and eventually leveling off."
  },
  {
    question: "Which of the following is an example of complete metamorphosis (four distinct stages)?",
    options: ["Grasshopper development", "Cockroach development", "Butterfly development (egg-larva-pupa-adult)", "Human development"],
    answer: 2,
    explanation: "Butterflies undergo complete metamorphosis with four distinct stages, each looking dramatically different, unlike incomplete metamorphosis."
  },
];

const BIOLOGYC = [
  {
    question: "A cross between a homozygous tall plant (TT) and a homozygous short plant (tt) produces offspring that are:",
    options: ["All short", "All tall (heterozygous, Tt)", "All homozygous short", "Half tall, half short"],
    answer: 1,
    explanation: "Since T (tall) is typically dominant, crossing TT×tt produces all Tt offspring, which display the dominant tall phenotype despite being heterozygous."
  },
  {
    question: "In a monohybrid cross between two heterozygous parents (Aa × Aa), what is the expected phenotypic ratio in offspring?",
    options: ["1:2:1", "1:1", "3:1", "9:3:3:1"],
    answer: 2,
    explanation: "Crossing Aa×Aa produces genotypes AA:Aa:aA:aa (1:2:1 ratio), but phenotypically results in a 3:1 ratio since A is dominant."
  },
  {
    question: "Which term describes the genetic makeup of an organism, as opposed to its physical appearance?",
    options: ["Trait", "Phenotype", "Genotype", "Allele"],
    answer: 2,
    explanation: "Genotype specifically refers to an organism's genetic composition, while phenotype refers to the observable physical characteristics resulting from that genotype."
  },
  {
    question: "If a person has blood type AB, this demonstrates which genetic concept?",
    options: ["Recessive inheritance", "Sex-linked inheritance", "Complete dominance", "Codominance (both A and B alleles are expressed)"],
    answer: 3,
    explanation: "Blood type AB demonstrates codominance, where both A and B alleles are fully and simultaneously expressed in the phenotype."
  },
  {
    question: "In humans, red-green color blindness is a sex-linked recessive trait carried on the X chromosome. Why are males more commonly affected than females?",
    options: ["Females cannot carry the trait", "The trait only affects males biologically", "Males have only one X chromosome, so a single recessive allele will be expressed", "Males have two X chromosomes"],
    answer: 2,
    explanation: "Since males are XY, a single recessive allele on their X chromosome will be expressed, while females need two recessive alleles to show the trait."
  },
  {
    question: "A dihybrid cross between two heterozygous individuals (AaBb × AaBb) produces which classic phenotypic ratio?",
    options: ["1:2:1", "3:1", "1:1:1:1", "9:3:3:1"],
    answer: 3,
    explanation: "A dihybrid cross involving two independently assorting genes typically produces the classic 9:3:3:1 phenotypic ratio."
  },
  {
    question: "Which structure carries genetic information in the form of a double helix?",
    options: ["DNA", "Ribosome", "RNA", "Protein"],
    answer: 0,
    explanation: "DNA is the molecule that stores genetic information in its characteristic double helix structure, composed of nucleotide base pairs."
  },
  {
    question: "A mutation is best defined as:",
    options: ["The process of cell division", "A change in the DNA sequence that can potentially alter an organism's traits", "A normal genetic process with no effects", "Only beneficial changes in DNA"],
    answer: 1,
    explanation: "A mutation is any change in the DNA nucleotide sequence, which may be neutral, harmful, or occasionally beneficial."
  },
  {
    question: "If both parents are carriers of a recessive genetic disorder (Aa × Aa), what is the probability their child will be affected (aa)?",
    options: ["0%", "25%", "100%", "50%"],
    answer: 1,
    explanation: "Using a Punnett square for Aa×Aa: offspring genotypes are AA:Aa:Aa:aa (1:2:1), meaning 1 out of 4 (25%) will be homozygous recessive."
  },
  {
    question: "Which scientist is credited with establishing the fundamental laws of inheritance through pea plant experiments?",
    options: ["Charles Darwin", "Gregor Mendel", "Rosalind Franklin", "James Watson"],
    answer: 1,
    explanation: "Gregor Mendel's systematic pea plant breeding experiments established the fundamental principles of inheritance, earning him recognition as the \"father of genetics.\""
  },
  {
    question: "Natural selection, as proposed by Darwin, describes the process where:",
    options: ["Evolution occurs within a single generation", "All organisms survive equally", "Traits are randomly distributed with no survival advantage", "Organisms with favorable traits are more likely to survive and reproduce"],
    answer: 3,
    explanation: "Natural selection describes how organisms with traits better suited to their environment have a survival and reproductive advantage."
  },
  {
    question: "Which of the following provides evidence for evolution through comparative anatomy?",
    options: ["Identical genetic codes across all species", "Homologous structures (similar bone structures with different functions across species)", "Random mutations only", "Lack of any structural similarities between species"],
    answer: 1,
    explanation: "Homologous structures provide strong evidence of common ancestry and evolutionary divergence."
  },
  {
    question: "Which term describes the process by which a new species arises from an existing one?",
    options: ["Adaptation", "Speciation", "Selection", "Mutation"],
    answer: 1,
    explanation: "Speciation specifically refers to the evolutionary process through which populations evolve to become distinct species."
  },
  {
    question: "Fossil evidence supports evolution by showing:",
    options: ["A chronological record of gradual changes in organisms across geological time", "Only modern species existed historically", "No changes in organisms over time", "All species appeared simultaneously"],
    answer: 0,
    explanation: "The fossil record demonstrates a chronological sequence showing gradual anatomical changes in organisms over vast time periods."
  },
  {
    question: "Analogous structures (like the wings of insects and birds) demonstrate:",
    options: ["Common ancestry", "Identical genetic origin", "Convergent evolution (similar function evolving independently, not from common ancestry)", "No evolutionary significance"],
    answer: 2,
    explanation: "Analogous structures serve similar functions but evolved independently in unrelated lineages, demonstrating convergent evolution."
  },
  {
    question: "Which factor is essential for natural selection to occur within a population?",
    options: ["All individuals must be genetically identical", "No environmental pressures should be present", "Genetic variation must exist within the population", "Reproduction must be asexual only"],
    answer: 2,
    explanation: "Natural selection requires genetic variation within a population — without differences in traits, there would be nothing for environmental pressures to select."
  },
  {
    question: "Antibiotic resistance in bacteria is a modern example of:",
    options: ["Natural selection in action", "Artificial selection only", "No evolutionary relevance", "Genetic engineering"],
    answer: 0,
    explanation: "Antibiotic resistance demonstrates natural selection in real-time — resistant bacteria survive and reproduce while susceptible bacteria die."
  },
  {
    question: "Which of the following best describes \"survival of the fittest\" in evolutionary context?",
    options: ["Organisms best adapted to their specific environment are more likely to survive and reproduce", "All organisms have equal survival chances", "Fitness refers only to physical strength", "Only the physically strongest organisms survive"],
    answer: 0,
    explanation: "\"Fitness\" refers to an organism's reproductive success relative to others in its environment, not physical strength alone."
  },
  {
    question: "Genetic drift refers to:",
    options: ["Random changes in allele frequencies within a population, especially significant in small populations", "No change in genetic composition", "Only beneficial mutations spreading", "Directed evolution toward a specific goal"],
    answer: 0,
    explanation: "Genetic drift describes random fluctuations in allele frequencies due to chance events, more pronounced in smaller populations."
  },
  {
    question: "Charles Darwin's observations during his voyage on the HMS Beagle, particularly in the Galápagos Islands, primarily contributed to his theory of:",
    options: ["Cell theory", "Natural selection and evolution", "Photosynthesis", "Genetic inheritance"],
    answer: 1,
    explanation: "Darwin's observations of varied finch species with different beak adaptations provided crucial evidence supporting his theory of evolution through natural selection."
  },
  {
    question: "In an ecosystem, organisms that produce their own food through photosynthesis are called:",
    options: ["Decomposers", "Consumers", "Predators", "Producers"],
    answer: 3,
    explanation: "Producers form the base of ecological food chains, converting light energy into chemical energy through photosynthesis."
  },
  {
    question: "Which trophic level consists of organisms that break down dead organic matter, recycling nutrients back into the ecosystem?",
    options: ["Primary producers", "Primary consumers", "Decomposers", "Secondary consumers"],
    answer: 2,
    explanation: "Decomposers break down dead organisms and waste products, releasing nutrients back into the environment for reuse."
  },
  {
    question: "A food chain typically shows:",
    options: ["A simple, linear sequence of who eats whom", "Complex feeding relationships among many species", "Only producer organisms", "Random relationships with no order"],
    answer: 0,
    explanation: "A food chain represents a simplified, linear pathway of energy flow, unlike food webs which show more complex, interconnected feeding relationships."
  },
  {
    question: "Which ecological term describes all the living organisms in a specific area, interacting with each other and their environment?",
    options: ["Biome", "Population", "Ecosystem", "Community"],
    answer: 2,
    explanation: "An ecosystem encompasses both the biotic community and the abiotic environmental factors within a specific area."
  },
  {
    question: "In energy flow through an ecosystem, approximately what percentage of energy is typically transferred from one trophic level to the next?",
    options: ["90%", "100%", "50%", "10%"],
    answer: 3,
    explanation: "The \"10% rule\" in ecology states that only about 10% of energy is transferred from one trophic level to the next, with the rest lost as heat."
  },
  {
    question: "Which term describes a group of the same species living in a specific area, capable of interbreeding?",
    options: ["Population", "Ecosystem", "Biosphere", "Community"],
    answer: 0,
    explanation: "A population specifically refers to individuals of the same species living within a defined geographic area, capable of interbreeding."
  },
  {
    question: "Symbiosis where both organisms benefit from the relationship is called:",
    options: ["Mutualism", "Predation", "Commensalism", "Parasitism"],
    answer: 0,
    explanation: "Mutualism describes a symbiotic relationship where both interacting species derive benefit."
  },
  {
    question: "Which type of pyramid in ecology typically shows a decrease in numbers/biomass/energy as you move up trophic levels?",
    options: ["Population pyramid", "Age pyramid", "Food pyramid (dietary)", "Pyramid of numbers, biomass, or energy (ecological pyramids)"],
    answer: 3,
    explanation: "Ecological pyramids typically show a decreasing pattern from producers at the base to top predators, reflecting energy loss at each trophic transfer."
  },
  {
    question: "Commensalism is a symbiotic relationship where:",
    options: ["One organism benefits while the other is unaffected (neither helped nor harmed)", "Both organisms are harmed", "Both organisms benefit", "One organism benefits while the other is harmed"],
    answer: 0,
    explanation: "Commensalism specifically describes a relationship where one species benefits while the other experiences neither significant benefit nor harm."
  },
  {
    question: "Biomagnification refers to:",
    options: ["A process unrelated to food chains", "The increasing concentration of certain toxins/pollutants as they move up trophic levels", "The magnification of organisms' physical size", "The dilution of toxins as they move up the food chain"],
    answer: 1,
    explanation: "Biomagnification describes how certain persistent toxins become increasingly concentrated in organisms' tissues as they move up the food chain."
  },
  {
    question: "Structural adaptations refer to:",
    options: ["Physical/anatomical features that help an organism survive in its environment", "Behavioral changes only", "Changes that occur within a single lifetime through learning", "Temporary changes with no genetic basis"],
    answer: 0,
    explanation: "Structural adaptations are physical characteristics that have evolved over generations to help organisms survive and reproduce successfully."
  },
  {
    question: "Camouflage in animals is an example of which type of adaptation?",
    options: ["Physiological adaptation", "Structural/physical adaptation", "Temporary adaptation", "Behavioral adaptation"],
    answer: 1,
    explanation: "Camouflage involves physical coloring or patterning that helps an organism blend into its environment, making it a structural adaptation."
  },
  {
    question: "Hibernation in animals during winter is an example of:",
    options: ["Behavioral adaptation", "Genetic mutation only", "Structural adaptation", "No adaptation at all"],
    answer: 0,
    explanation: "Hibernation is a behavioral adaptation where animals modify their activity patterns to survive harsh winter conditions."
  },
  {
    question: "Which of the following is an example of a physiological adaptation?",
    options: ["A polar bear's white fur", "A chameleon's shape", "A bird's migration pattern", "A camel's ability to produce highly concentrated urine to conserve water"],
    answer: 3,
    explanation: "Physiological adaptations involve internal bodily processes — a camel's kidney efficiently concentrating urine is a physiological adaptation."
  },
  {
    question: "Cacti having spines instead of broad leaves is an adaptation primarily for:",
    options: ["Attracting pollinators", "Producing more oxygen", "Reducing water loss through transpiration in arid environments", "Enhancing photosynthesis rate"],
    answer: 2,
    explanation: "Cactus spines have minimal surface area compared to broad leaves, significantly reducing water loss through transpiration."
  },
  {
    question: "Migration in birds is best classified as which type of adaptation?",
    options: ["Structural", "Physiological", "Genetic mutation", "Behavioral"],
    answer: 3,
    explanation: "Migration represents a behavioral adaptation where birds seasonally travel to more favorable environments."
  },
  {
    question: "Why do desert animals often exhibit nocturnal behavior (being active at night)?",
    options: ["Only for social reasons", "To increase daytime hunting success", "It has no survival benefit", "To avoid extreme daytime heat and conserve water"],
    answer: 3,
    explanation: "Being active during cooler night hours helps desert animals avoid extreme daytime heat and reduce water loss through evaporation."
  },
  {
    question: "Which of the following describes convergent evolution in relation to adaptation?",
    options: ["Adaptation occurring randomly with no environmental influence", "Unrelated species independently evolving similar adaptations due to similar environmental pressures", "Only one species can adapt to an environment", "Closely related species developing identical traits"],
    answer: 1,
    explanation: "Convergent evolution occurs when unrelated species facing similar environmental challenges independently evolve similar adaptive traits."
  },
  {
    question: "Thick blubber layers in Arctic marine mammals (like seals) serve as an adaptation for:",
    options: ["Improving vision underwater", "Enhancing swimming speed only", "Increasing buoyancy only", "Insulation against extreme cold and energy storage"],
    answer: 3,
    explanation: "Blubber provides crucial thermal insulation, helping marine mammals maintain body temperature in frigid Arctic waters, while also serving as an energy reserve."
  },
  {
    question: "Which term describes the evolutionary process where a species becomes highly specialized to a particular ecological niche over time?",
    options: ["Random mutation", "Generalization", "Extinction", "Specialization (specialized adaptation)"],
    answer: 3,
    explanation: "Specialization refers to the evolutionary process where organisms develop highly specific adaptations suited to a particular ecological niche."
  },
  {
    question: "The scientific classification system that groups organisms based on shared characteristics, developed by Linnaeus, is called:",
    options: ["Ecology", "Genetics", "Taxonomy", "Evolution theory"],
    answer: 2,
    explanation: "Taxonomy is the scientific discipline concerned with classifying organisms into hierarchical categories based on shared characteristics."
  },
  {
    question: "In the taxonomic hierarchy, which level is more specific: Genus or Species?",
    options: ["Neither represents a specific classification", "Species is more specific", "Genus is more specific", "Both are equally specific"],
    answer: 1,
    explanation: "Species represents the most specific taxonomic rank, while genus is a broader category that can include multiple related species."
  },
  {
    question: "Which kingdom includes organisms that are prokaryotic (lacking a true nucleus)?",
    options: ["Fungi", "Animalia", "Monera (Bacteria)", "Plantae"],
    answer: 2,
    explanation: "Kingdom Monera specifically includes prokaryotic organisms lacking a membrane-bound nucleus."
  },
  {
    question: "The scientific naming system using two names (genus and species) is called:",
    options: ["Taxonomic ranking", "Common naming", "Classification coding", "Binomial nomenclature"],
    answer: 3,
    explanation: "Binomial nomenclature assigns each species a unique two-part scientific name, providing a standardized, universal naming system."
  },
  {
    question: "Which of the following represents the correct hierarchical order from broadest to most specific in taxonomic classification?",
    options: ["Phylum→Kingdom→Class→Family→Order→Genus→Species", "Species→Genus→Family→Order→Class→Phylum→Kingdom", "Kingdom→Phylum→Class→Order→Family→Genus→Species", "Kingdom→Class→Phylum→Order→Family→Species→Genus"],
    answer: 2,
    explanation: "The standard taxonomic hierarchy progresses from the broadest category (Kingdom) down to the most specific (Species)."
  },
  {
    question: "Fungi are classified separately from plants primarily because fungi:",
    options: ["Can photosynthesize like plants", "Lack chlorophyll and obtain nutrients through absorption (heterotrophic), unlike photosynthetic plants", "Cannot reproduce", "Have identical cell structures to plants"],
    answer: 1,
    explanation: "Unlike plants, fungi lack chlorophyll and obtain nutrients through absorption from their environment, representing a fundamentally different nutritional strategy."
  },
  {
    question: "Which characteristic is used to classify organisms into the Kingdom Animalia?",
    options: ["Multicellular, eukaryotic, heterotrophic organisms typically capable of movement", "Ability to photosynthesize", "Cell walls made of cellulose", "Prokaryotic cell structure"],
    answer: 0,
    explanation: "Kingdom Animalia includes multicellular, eukaryotic organisms that are heterotrophic and typically capable of movement."
  },
  {
    question: "Viruses are often considered unique in biological classification because they:",
    options: ["Are classified within Kingdom Monera", "Exhibit characteristics of both living and non-living entities, existing outside traditional taxonomic kingdoms", "Fit perfectly into existing kingdom classifications", "Are always classified as plants"],
    answer: 1,
    explanation: "Viruses present a classification challenge because they lack cellular structure and cannot reproduce independently, blurring the line between living and non-living matter."
  },
  {
    question: "Which kingdom includes organisms like amoeba and algae, often characterized by simple eukaryotic structures?",
    options: ["Plantae", "Fungi", "Monera", "Protista"],
    answer: 3,
    explanation: "Kingdom Protista includes diverse, mostly unicellular eukaryotic organisms that don't fit neatly into animal, plant, or fungal kingdoms."
  },
  {
    question: "Why is classification important in biology?",
    options: ["It has no practical purpose", "It only matters for naming purposes", "It prevents species from evolving", "It helps organize the diversity of life, showing evolutionary relationships and aiding scientific communication"],
    answer: 3,
    explanation: "Classification systems provide a structured framework for organizing the immense diversity of living organisms, revealing evolutionary relationships and enabling standardized scientific communication."
  },
];

const BIOLOGYD = [
  {
    question: "Which type of microorganism causes diseases like the common cold and influenza?",
    options: ["Bacteria", "Protozoa", "Viruses", "Fungi"],
    answer: 2,
    explanation: "Viruses, being much smaller than bacteria and requiring host cells to replicate, cause diseases like the common cold and influenza."
  },
  {
    question: "Which of the following diseases is caused by a bacterial infection?",
    options: ["Influenza", "HIV/AIDS", "Tuberculosis", "Malaria"],
    answer: 2,
    explanation: "Tuberculosis is caused by the bacterium Mycobacterium tuberculosis, unlike malaria, influenza, and HIV/AIDS."
  },
  {
    question: "Malaria is transmitted to humans through:",
    options: ["Direct skin contact", "Contaminated water", "Airborne droplets", "Bite of infected female Anopheles mosquito"],
    answer: 3,
    explanation: "Malaria is specifically transmitted when an infected female Anopheles mosquito bites a human, injecting Plasmodium parasites into the bloodstream."
  },
  {
    question: "Which type of microorganism is responsible for diseases like athlete's foot and ringworm?",
    options: ["Fungi", "Bacteria", "Virus", "Protozoa"],
    answer: 0,
    explanation: "Fungal infections like athlete's foot and ringworm are caused by dermatophyte fungi that thrive on keratin in skin, hair, and nails."
  },
  {
    question: "Antibiotics are effective against which type of pathogen?",
    options: ["Bacteria", "Fungi only", "Both viruses and bacteria equally", "Viruses"],
    answer: 0,
    explanation: "Antibiotics specifically target bacterial cell structures/processes, making them effective against bacterial infections but ineffective against viruses."
  },
  {
    question: "Vaccines work by:",
    options: ["Having no effect on immune response", "Stimulating the immune system to develop memory/immunity against a specific pathogen before actual infection", "Providing antibiotics preemptively", "Directly killing pathogens already in the body"],
    answer: 1,
    explanation: "Vaccines introduce a weakened, inactivated, or partial form of a pathogen, triggering the immune system to produce specific antibodies and memory cells."
  },
  {
    question: "How is HIV (Human Immunodeficiency Virus) primarily transmitted?",
    options: ["Contaminated food only", "Casual contact like hugging", "Bodily fluids (blood, sexual contact, mother-to-child)", "Airborne droplets"],
    answer: 2,
    explanation: "HIV is transmitted through specific bodily fluids including blood, semen, vaginal fluids, and breast milk."
  },
  {
    question: "Which of the following best describes how the immune system's white blood cells combat pathogens?",
    options: ["By identifying, engulfing, and destroying pathogens or producing antibodies against them", "By increasing heart rate only", "By having no specific function against pathogens", "By producing more red blood cells"],
    answer: 0,
    explanation: "White blood cells combat infections through phagocytosis and antibody production, forming the core of the immune response."
  },
  {
    question: "Cholera, a severe diarrheal disease, is primarily transmitted through:",
    options: ["Insect bites", "Contaminated water and food", "Airborne transmission", "Direct blood contact"],
    answer: 1,
    explanation: "Cholera is typically transmitted through consumption of water or food contaminated with fecal matter from infected individuals."
  },
  {
    question: "Why is it generally ineffective to treat viral infections (like the common cold) with antibiotics?",
    options: ["Viruses lack the cellular structures/processes that antibiotics target (which are specific to bacteria)", "Viruses are immune to all medications", "Antibiotics only work on plants", "Antibiotics are too strong for viral infections"],
    answer: 0,
    explanation: "Antibiotics work by targeting specific bacterial structures or processes that are fundamentally different from or absent in viruses."
  },
  {
    question: "Which of the following is classified as a non-communicable disease?",
    options: ["Tuberculosis", "Diabetes", "Influenza", "Malaria"],
    answer: 1,
    explanation: "Diabetes is a non-communicable disease, typically resulting from genetic factors, lifestyle, or autoimmune responses, unlike infectious diseases."
  },
  {
    question: "Which lifestyle factor is most strongly associated with increased risk of cardiovascular disease?",
    options: ["Regular exercise", "High intake of saturated fats and sedentary lifestyle", "Adequate sleep", "Balanced nutrition"],
    answer: 1,
    explanation: "A diet high in saturated fats combined with lack of physical activity significantly increases the risk of cardiovascular diseases."
  },
  {
    question: "Which vitamin deficiency is associated with the disease scurvy?",
    options: ["Vitamin A", "Vitamin D", "Vitamin C", "Vitamin B12"],
    answer: 2,
    explanation: "Scurvy results specifically from vitamin C deficiency, impairing collagen synthesis."
  },
  {
    question: "Hypertension (high blood pressure) is a significant risk factor for which of the following conditions?",
    options: ["Common cold", "Malaria", "Athlete's foot", "Stroke and heart disease"],
    answer: 3,
    explanation: "Chronic hypertension damages blood vessels over time, significantly increasing the risk of serious cardiovascular events."
  },
  {
    question: "Which of the following best describes obesity's relationship to Type 2 diabetes?",
    options: ["Obesity is a significant risk factor, often contributing to insulin resistance", "Obesity prevents diabetes", "No relationship exists", "Obesity only affects blood pressure"],
    answer: 0,
    explanation: "Excess body fat is strongly associated with insulin resistance, significantly increasing the risk of developing Type 2 diabetes."
  },
  {
    question: "Which cancer-causing agent is specifically found in tobacco smoke?",
    options: ["Vitamin C", "Water", "Carcinogens like tar and nicotine byproducts", "Protein"],
    answer: 2,
    explanation: "Tobacco smoke contains numerous carcinogenic compounds that damage DNA and cellular processes."
  },
  {
    question: "Regular physical exercise primarily helps prevent lifestyle diseases by:",
    options: ["Increasing disease susceptibility", "Improving cardiovascular health, weight management, and metabolic function", "Having no significant health impact", "Only building muscle mass"],
    answer: 1,
    explanation: "Regular exercise provides comprehensive health benefits including improved heart function, better weight management, and enhanced insulin sensitivity."
  },
  {
    question: "Which of the following is a primary risk factor for developing lung cancer?",
    options: ["Regular exercise", "Cigarette smoking", "High water intake", "Adequate sleep"],
    answer: 1,
    explanation: "Cigarette smoking is the leading cause of lung cancer, as carcinogens in tobacco smoke directly damage lung tissue and DNA."
  },
  {
    question: "What is the primary cause of Type 1 diabetes?",
    options: ["Bacterial infection", "Autoimmune destruction of insulin-producing pancreatic cells", "Excessive sugar consumption alone", "Viral infection only"],
    answer: 1,
    explanation: "Type 1 diabetes results from an autoimmune response where the immune system mistakenly attacks and destroys insulin-producing beta cells."
  },
  {
    question: "Which of the following dietary practices would most likely help prevent malnutrition-related diseases?",
    options: ["Eating only one food type exclusively", "Avoiding all fruits and vegetables", "Consuming a balanced diet with adequate vitamins, minerals, and macronutrients", "Consuming excessive processed foods only"],
    answer: 2,
    explanation: "A balanced diet providing appropriate amounts of all essential nutrients is crucial for preventing various malnutrition-related health issues."
  },
  {
    question: "Which of the following is a common method of contraception that prevents fertilization by creating a physical barrier?",
    options: ["Intrauterine devices (copper)", "Condoms", "Hormonal injections", "Oral contraceptive pills"],
    answer: 1,
    explanation: "Condoms work by providing a physical barrier that prevents sperm from reaching the egg."
  },
  {
    question: "Sexually transmitted infections (STIs) are primarily transmitted through:",
    options: ["Insect bites", "Contaminated food", "Airborne droplets", "Sexual contact (including vaginal, anal, oral)"],
    answer: 3,
    explanation: "STIs are specifically transmitted through intimate sexual contact, allowing pathogens to pass between partners."
  },
  {
    question: "Which of the following practices significantly reduces the risk of STI transmission?",
    options: ["Consistent and correct condom use", "Avoiding regular health checkups", "Ignoring symptoms of infection", "Having multiple unprotected sexual partners"],
    answer: 0,
    explanation: "Consistent, correct condom use creates a barrier that significantly reduces the risk of transmitting many STIs."
  },
  {
    question: "Why is early prenatal care important for reproductive health?",
    options: ["It has no significant benefits", "It helps monitor maternal and fetal health, identifying potential complications early", "It only matters in the final month of pregnancy", "It's only relevant for high-risk pregnancies"],
    answer: 1,
    explanation: "Early and regular prenatal care allows healthcare providers to monitor both maternal and fetal health, enabling early detection of potential complications."
  },
  {
    question: "Which of the following is a significant risk associated with teenage pregnancy?",
    options: ["Reduced need for prenatal care", "No significant risks exist", "Automatically improved health outcomes", "Higher risk of complications for both mother and baby due to physical immaturity and other factors"],
    answer: 3,
    explanation: "Teenage pregnancies often carry increased health risks for both mother and child, including higher rates of premature birth and low birth weight."
  },
  {
    question: "Family planning primarily aims to:",
    options: ["Have no relationship to health outcomes", "Help individuals/couples control the timing and number of children through informed choices", "Only benefit governments", "Prevent all forms of reproduction"],
    answer: 1,
    explanation: "Family planning empowers individuals and couples to make informed decisions about reproduction, contributing to better maternal, child, and family health outcomes."
  },
  {
    question: "Which of the following STIs, if untreated, can lead to infertility in both men and women?",
    options: ["Malaria", "Athlete's foot", "Chlamydia", "Common cold"],
    answer: 2,
    explanation: "Chlamydia, if left untreated, can cause pelvic inflammatory disease in women and epididymitis in men, potentially leading to infertility."
  },
  {
    question: "Breastfeeding provides which significant benefit related to reproductive/infant health?",
    options: ["Only benefits the mother", "No specific health benefits", "Increases infant susceptibility to disease", "Provides essential nutrients and antibodies, supporting infant immune development"],
    answer: 3,
    explanation: "Breast milk provides optimal nutrition along with maternal antibodies that help protect infants from various infections."
  },
  {
    question: "Which reproductive health practice is specifically recommended to detect cervical cancer early?",
    options: ["Vision screening", "Regular Pap smear tests", "Hearing tests", "Blood pressure monitoring"],
    answer: 1,
    explanation: "Pap smear tests specifically screen for abnormal cervical cell changes that could indicate precancerous conditions or early cervical cancer."
  },
  {
    question: "Comprehensive sex education primarily aims to:",
    options: ["Have no impact on health outcomes", "Only discuss abstinence", "Encourage risky sexual behavior", "Provide accurate information to promote informed decisions and healthy reproductive practices"],
    answer: 3,
    explanation: "Comprehensive sex education provides medically accurate information, empowering individuals to make informed, responsible decisions about their reproductive health."
  },
  {
    question: "Which part of the brain is primarily responsible for controlling balance and coordination?",
    options: ["Cerebellum", "Medulla oblongata", "Cerebrum", "Hypothalamus"],
    answer: 0,
    explanation: "The cerebellum specifically coordinates voluntary movements, maintains posture and balance, integrating sensory information."
  },
  {
    question: "Which type of neuron carries impulses from sense organs toward the central nervous system?",
    options: ["Sensory neuron", "Interneuron only", "Motor neuron", "Relay neuron"],
    answer: 0,
    explanation: "Sensory neurons specifically transmit information from sensory receptors toward the central nervous system for processing."
  },
  {
    question: "The reflex arc allows for rapid, involuntary responses by:",
    options: ["Only working during sleep", "Bypassing the brain and processing directly through the spinal cord for faster response", "Requiring extensive decision-making", "Requiring conscious brain processing first"],
    answer: 1,
    explanation: "Reflex arcs allow for extremely rapid responses by processing the response directly at the spinal cord level, bypassing conscious brain processing."
  },
  {
    question: "Which part of the eye is responsible for controlling the amount of light entering the eye?",
    options: ["Cornea", "Retina", "Iris (controlling pupil size)", "Lens"],
    answer: 2,
    explanation: "The iris contains muscles that adjust pupil size, controlling how much light enters the eye based on lighting conditions."
  },
  {
    question: "Which structure in the ear is primarily responsible for converting sound vibrations into nerve impulses?",
    options: ["Cochlea", "Outer ear", "Ear canal", "Eardrum (tympanic membrane)"],
    answer: 0,
    explanation: "The cochlea contains specialized hair cells that convert mechanical sound vibrations into electrical nerve impulses sent to the brain."
  },
  {
    question: "The autonomic nervous system primarily controls:",
    options: ["Conscious thought processes", "Memory formation only", "Involuntary functions like heart rate, digestion, and breathing", "Voluntary movements only"],
    answer: 2,
    explanation: "The autonomic nervous system regulates involuntary bodily functions without conscious control, maintaining essential life processes automatically."
  },
  {
    question: "Which part of the brain controls vital functions like heart rate and breathing?",
    options: ["Medulla oblongata", "Frontal lobe", "Cerebellum", "Cerebrum"],
    answer: 0,
    explanation: "The medulla oblongata controls essential involuntary functions crucial for survival, including heart rate and breathing rhythm."
  },
  {
    question: "Which type of neuron transmits impulses from the central nervous system to muscles or glands?",
    options: ["Motor neuron", "Sensory neuron", "Interneuron only", "Receptor cell"],
    answer: 0,
    explanation: "Motor neurons specifically carry signals from the central nervous system outward to effector organs like muscles or glands."
  },
  {
    question: "The retina of the eye contains which specialized cells responsible for detecting light?",
    options: ["Only cone cells", "Only rod cells", "Neither rods nor cones", "Rods and cones (photoreceptor cells)"],
    answer: 3,
    explanation: "The retina contains two types of photoreceptor cells — rods and cones — both essential for converting light into neural signals."
  },
  {
    question: "Which lobe of the cerebrum is primarily associated with processing visual information?",
    options: ["Temporal lobe", "Frontal lobe", "Occipital lobe", "Parietal lobe"],
    answer: 2,
    explanation: "The occipital lobe contains the primary visual cortex, specifically responsible for processing and interpreting visual information."
  },
  {
    question: "Which gland is often referred to as the \"master gland\" because it regulates other endocrine glands?",
    options: ["Pancreas", "Thyroid gland", "Adrenal gland", "Pituitary gland"],
    answer: 3,
    explanation: "The pituitary gland is called the \"master gland\" because it produces hormones that regulate the activity of many other endocrine glands."
  },
  {
    question: "Which hormone, produced by the adrenal glands, is often called the \"fight or flight\" hormone?",
    options: ["Thyroxine", "Adrenaline (epinephrine)", "Estrogen", "Insulin"],
    answer: 1,
    explanation: "Adrenaline is rapidly released during stressful or dangerous situations, triggering physiological changes that prepare the body for immediate action."
  },
  {
    question: "Which gland produces thyroxine, a hormone regulating metabolic rate?",
    options: ["Adrenal gland", "Pituitary gland", "Thyroid gland", "Pancreas"],
    answer: 2,
    explanation: "The thyroid gland produces thyroxine, which plays a crucial role in regulating the body's overall metabolic rate."
  },
  {
    question: "Which hormone, produced by the ovaries, is primarily responsible for developing female secondary sexual characteristics?",
    options: ["Adrenaline", "Estrogen", "Insulin", "Testosterone"],
    answer: 1,
    explanation: "Estrogen, primarily produced by the ovaries, drives the development of female secondary sexual characteristics during puberty."
  },
  {
    question: "Hormones are transported throughout the body primarily via:",
    options: ["The bloodstream", "Muscle contractions", "Nerve impulses", "Lymphatic system only"],
    answer: 0,
    explanation: "The endocrine system releases hormones directly into the bloodstream, allowing them to travel throughout the body to reach target organs/tissues."
  },
  {
    question: "Which endocrine gland produces testosterone, responsible for male secondary sexual characteristics?",
    options: ["Testes", "Thyroid gland", "Adrenal gland", "Pancreas"],
    answer: 0,
    explanation: "The testes primarily produce testosterone, which drives the development of male secondary sexual characteristics during puberty."
  },
  {
    question: "Hypothyroidism (underactive thyroid) typically results in:",
    options: ["Increased metabolic rate and weight loss", "Decreased metabolic rate, potentially causing weight gain and fatigue", "No metabolic changes", "Only affects reproductive function"],
    answer: 1,
    explanation: "Insufficient thyroxine production slows the body's metabolic processes, often resulting in weight gain, fatigue, and cold intolerance."
  },
  {
    question: "Which gland, located near the kidneys, produces hormones involved in stress response and metabolism regulation?",
    options: ["Adrenal gland", "Pancreas", "Thyroid gland", "Pituitary gland"],
    answer: 0,
    explanation: "The adrenal glands produce various hormones including adrenaline and cortisol, crucial for stress response and metabolism regulation."
  },
  {
    question: "Compared to nervous system responses, hormonal (endocrine) responses are typically:",
    options: ["Non-existent in humans", "Faster but shorter-lasting", "Slower to initiate but longer-lasting in effect", "Identical in speed and duration"],
    answer: 2,
    explanation: "While nervous responses are nearly instantaneous but brief, hormonal responses take longer to initiate but typically produce more sustained, longer-lasting effects."
  },
  {
    question: "Which condition results from insufficient insulin production or ineffective insulin function, leading to elevated blood glucose levels?",
    options: ["Hyperthyroidism", "Addison's disease", "Diabetes mellitus", "Hypothyroidism"],
    answer: 2,
    explanation: "Diabetes mellitus specifically results from problems with insulin, leading to chronically elevated blood glucose levels."
  },
];

const CURRENTAFFAIRSA = [
  {
    question: "In which town/city is OAUSTECH located?",
    options: ["Okitipupa", "Akure", "Ondo City", "Owo"],
    answer: 0,
    explanation: "OAUSTECH's main campus is located in Okitipupa, in the Southern Senatorial District of Ondo State."
  },
  {
    question: "What year was OAUSTECH established?",
    options: ["2011", "2005", "2019", "2008"],
    answer: 3,
    explanation: "The university was established by the Ondo State Government in 2008, though it commenced academic activities later in January 2011."
  },
  {
    question: "What was OAUSTECH originally called before its current name?",
    options: ["Ondo State University of Science and Technology (OSUSTECH)", "Ondo State Polytechnic", "Agagu Institute of Technology", "Federal University of Technology, Okitipupa"],
    answer: 0,
    explanation: "The institution was initially named Ondo State University of Science and Technology (OSUSTECH) before being renamed."
  },
  {
    question: "Who was the Ondo State Governor under whose leadership OAUSTECH was established?",
    options: ["Olusegun Mimiko", "Olusegun Agagu", "Lucky Aiyedatiwa", "Rotimi Akeredolu"],
    answer: 1,
    explanation: "The university was founded in 2008 under the leadership of Dr. Olusegun Agagu, the then-Governor of Ondo State, after whom the university is now named."
  },
  {
    question: "In what year was the university renamed to Olusegun Agagu University of Science and Technology (OAUSTECH)?",
    options: ["2017", "2019", "2011", "2021"],
    answer: 1,
    explanation: "The Ondo State government changed the name to OAUSTECH in 2019, honoring the late Governor Olusegun Agagu."
  },
  {
    question: "When did OAUSTECH commence academic activities?",
    options: ["2008", "2019", "2017", "January 2011"],
    answer: 3,
    explanation: "Although established in 2008, the university officially began academic activities in January 2011, initially under the Faculty of Science."
  },
  {
    question: "What is OAUSTECH's official motto?",
    options: ["Knowledge and Excellence", "Technology for Humanity", "For Society and Development", "Character and Learning"],
    answer: 2,
    explanation: "OAUSTECH's official motto is \"For Society and Development,\" reflecting its mission of technological and industrial development for Ondo State and Nigeria."
  },
  {
    question: "Which two additional faculties were introduced at OAUSTECH in 2017?",
    options: ["Faculty of Management Sciences and Faculty of Social Sciences", "Faculty of Arts and Faculty of Education", "Faculty of Agriculture & Agricultural Technology, and Faculty of Engineering and Engineering Technology", "Faculty of Law and Faculty of Medicine"],
    answer: 2,
    explanation: "In 2017, OAUSTECH expanded beyond its original Faculty of Science by introducing the Faculty of Agriculture & Agricultural Technology and the Faculty of Engineering and Engineering Technology."
  },
  {
    question: "Who is the current (4th substantive) Vice-Chancellor of OAUSTECH?",
    options: ["Prof. Foluso Adetuyi", "Prof. Olusegun Agagu", "Prof. Temi Ologunorisa", "Prof. Dipo Akomolafe"],
    answer: 2,
    explanation: "Prof. Temi E. Ologunorisa, a climate and environmental scientist, currently serves as the 4th substantive Vice-Chancellor of OAUSTECH."
  },
  {
    question: "What is Prof. Temi Ologunorisa's academic specialization?",
    options: ["Meteorology and Climate Science", "Biochemistry", "Civil Engineering", "Agricultural Economics"],
    answer: 0,
    explanation: "Prof. Ologunorisa is a Professor of Meteorology and Climate Science, and has held academic positions including at the Federal University of Technology, Akure."
  },
  {
    question: "Along which major road is OAUSTECH's campus situated?",
    options: ["Akure-Ondo Road", "Ore-Benin Expressway", "Okitipupa-Igbokoda Road", "Owo-Ikare Road"],
    answer: 2,
    explanation: "The university's Admissions Office and main campus are located along the Okitipupa-Igbokoda Road (Km. 6), in Ondo State."
  },
  {
    question: "As of the 2021 NUC ranking, how was OAUSTECH ranked among state-owned universities in Nigeria?",
    options: ["5th", "9th", "1st", "15th"],
    answer: 1,
    explanation: "OAUSTECH was ranked 9th among the best state-owned universities in Nigeria by the National Universities Commission (NUC) in 2021."
  },
  {
    question: "Which of the following departments falls under OAUSTECH's science-related programmes?",
    options: ["Law", "Biochemistry", "Mass Communication", "Theatre Arts"],
    answer: 1,
    explanation: "Biochemistry is one of the science departments at OAUSTECH, alongside others like Botany, Microbiology, Chemical Sciences, and Zoology."
  },
  {
    question: "Which engineering discipline is offered at OAUSTECH?",
    options: ["Petroleum and Gas Engineering", "Marine Engineering", "Nuclear Engineering", "Aerospace Engineering"],
    answer: 0,
    explanation: "Petroleum and Gas Engineering is one of the engineering programs offered under OAUSTECH's School of Engineering and Engineering Technology."
  },
  {
    question: "OAUSTECH is owned by which body?",
    options: ["A religious mission", "A private proprietor", "Ondo State Government", "Federal Government of Nigeria"],
    answer: 2,
    explanation: "OAUSTECH is a state-owned university, established and funded by the Ondo State Government."
  },
  {
    question: "Which senatorial district of Ondo State is OAUSTECH located in?",
    options: ["Ondo East", "Ondo North", "Ondo Central", "Ondo South"],
    answer: 3,
    explanation: "Okitipupa, where OAUSTECH is sited, falls within the Southern Senatorial District of Ondo State."
  },
  {
    question: "Which of these is a department under OAUSTECH's science programmes?",
    options: ["Pharmacy", "Nursing", "Geophysics", "Architecture"],
    answer: 2,
    explanation: "Geophysics is listed among the science departments at OAUSTECH, alongside Geology, Physics, Mathematics, and Statistics."
  },
  {
    question: "What type of institution is OAUSTECH primarily focused on, based on its founding mandate?",
    options: ["Technology-based manpower training for industrial/technological development", "Purely medical training", "Religious and theological studies", "Liberal arts education"],
    answer: 0,
    explanation: "OAUSTECH was specifically established as a technology-based institution aimed at providing manpower training for industrial and technological development in Ondo State and Nigeria."
  },
  {
    question: "Which building houses OAUSTECH's Admissions Office?",
    options: ["Agagu Library Complex", "Oluwarotimi Akeredolu Senate Building", "Okitipupa Central Hall", "Ologunorisa Administrative Block"],
    answer: 1,
    explanation: "The Admissions Office is located in the Oluwarotimi Akeredolu Senate building on OAUSTECH's campus."
  },
  {
    question: "OAUSTECH currently organizes its academic units into which three \"Schools\" (alongside Postgraduate Studies)?",
    options: ["School of Law, School of Medicine, School of Arts", "School of Postgraduate Studies only", "School of Business, School of Education, School of Social Sciences", "School of Sciences, School of Engineering and Engineering Technology, School of Agriculture, Food and Natural Resources"],
    answer: 3,
    explanation: "OAUSTECH's website lists these three Schools as its main current academic divisions, alongside a separate Postgraduate Studies school."
  },
  {
    question: "Who is the current University Bursar of OAUSTECH?",
    options: ["Dipo Akomolafe", "Ganiyu Bamidele Aminu", "Peter Abiodun Okunniga", "Olurotimi Adekanle"],
    answer: 1,
    explanation: "Mr. Ganiyu Bamidele Aminu, FCA, has served as (Acting) Bursar since January 2022, having risen through the ranks after joining OAUSTECH as a Senior Accountant in 2009."
  },
  {
    question: "Who is the current University Librarian at OAUSTECH?",
    options: ["Adesola Victoria Alade", "Foluso Olutope Adetuyi", "Idowu Falemora", "Dr. Adetoun Adebisi Oyelude"],
    answer: 3,
    explanation: "Dr. Adetoun Adebisi Oyelude, a librarian with about 30 years of academic library experience, serves as the University Librarian."
  },
  {
    question: "Who was appointed as OAUSTECH's first-ever Deputy Librarian?",
    options: ["Mr. Babarinde Moriyole", "Mrs. Adesola Victoria Alade", "Mr. Idowu Falemora", "Dr. Adetoun Oyelude"],
    answer: 1,
    explanation: "Mrs. Adesola Victoria Alade, formerly Principal Librarian, was appointed as the university's first-ever Deputy Librarian, effective June 18, 2025."
  },
  {
    question: "What is the minimum O'Level requirement for admission into OAUSTECH (UTME/Direct Entry)?",
    options: ["3 credit passes including English only", "6 credit passes at one sitting only", "No specific O'Level requirement", "5 'O' Level credit passes including Mathematics and English Language, at not more than 2 sittings"],
    answer: 3,
    explanation: "OAUSTECH's official admissions notice specifies candidates must possess five (5) 'O' Level credit passes in relevant subjects, including Mathematics and English Language, at not more than two sittings."
  },
  {
    question: "For the 2025/2026 admission screening exercise, what was the minimum UTME score to be eligible for OAUSTECH's Post-UTME screening (as first-choice candidates)?",
    options: ["140", "120", "150", "180"],
    answer: 2,
    explanation: "Candidates who made OAUSTECH their first choice and scored 150 and above in the 2025 UTME were eligible for the Post-UTME Screening Exercise."
  },
  {
    question: "What must candidates who chose a different institution (not OAUSTECH) as first choice do to be considered for OAUSTECH admission?",
    options: ["Change their institution to OAUSTECH as first choice on the JAMB portal", "Retake UTME entirely", "Nothing; they are automatically considered", "Apply directly to the Vice-Chancellor's office"],
    answer: 0,
    explanation: "OAUSTECH's admissions notice advises candidates who chose it as second choice (or not at all) to do a change of institution to OAUSTECH as first choice on the JAMB portal."
  },
  {
    question: "Which of the following was newly appointed as a Deputy Registrar at OAUSTECH, effective December 10, 2024?",
    options: ["Ganiyu Aminu", "Idowu Falemora", "Olurotimi Adekanle", "Babarinde Aaron Moriyole"],
    answer: 3,
    explanation: "Mr. Babarinde Aaron Moriyole, formerly Principal Assistant Registrar and Secretary of the School of Postgraduate Studies, was appointed Deputy Registrar effective December 10, 2024."
  },
  {
    question: "What database access did OAUSTECH's library benefit from (2020–2025), aiding research?",
    options: ["Research4Life", "JSTOR only", "ScienceDirect exclusive access", "Google Scholar Premium"],
    answer: 0,
    explanation: "Research4Life granted OAUSTECH five years (2020–2025) of free access to its research database, benefiting students and researchers at the university."
  },
  {
    question: "Where was Mr. Babarinde Moriyole (Deputy Registrar) born?",
    options: ["Okitipupa", "Odigbo Local Government, Ondo State", "Lagos State", "Ibadan, Oyo State"],
    answer: 1,
    explanation: "Mr. Moriyole was born on October 25, 1974, in Odigbo Local Government of Ondo State, Nigeria."
  },
  {
    question: "OAUSTECH's academic calendar downloads (as of recent uploads) cover which academic sessions?",
    options: ["2019/2020 and 2020/2021 only", "Only 2025/2026", "2024/2025 and 2025/2026", "No academic calendars are published"],
    answer: 2,
    explanation: "OAUSTECH's official downloads page lists academic calendars for both the 2024/2025 and 2025/2026 academic sessions."
  },
  {
    question: "Which of these best describes OAUSTECH's institutional category?",
    options: ["State-owned university", "Private university", "Federal university", "Faith-based university"],
    answer: 0,
    explanation: "OAUSTECH is explicitly classified as a state-owned university, funded and run by the Ondo State Government."
  },
  {
    question: "In what capacity did Mr. Ganiyu Aminu serve before becoming (Acting) Bursar?",
    options: ["Vice-Chancellor", "Deputy Bursar", "Librarian", "Registrar"],
    answer: 1,
    explanation: "Mr. Aminu rose through the ranks to become Deputy Bursar in 2019, before his appointment as Acting Bursar in January 2022."
  },
  {
    question: "Which faculty/department combination is correctly matched at OAUSTECH?",
    options: ["Faculty of Engineering – Zoology", "School of Sciences – Microbiology", "School of Engineering – Botany", "School of Agriculture – Petroleum Engineering"],
    answer: 1,
    explanation: "Microbiology is one of the departments correctly listed under OAUSTECH's science-related programmes (School of Sciences)."
  },
  {
    question: "OAUSTECH's Postgraduate School operates as part of which broader academic structure?",
    options: ["It only exists on paper, with no actual programmes", "It's entirely separate and unrelated to the three schools", "It's listed alongside the three Schools (Sciences; Engineering & Engineering Technology; Agriculture, Food & Natural Resources) as a distinct unit", "It merged into the School of Sciences only"],
    answer: 2,
    explanation: "OAUSTECH's official structure lists Postgraduate Studies as a distinct academic unit alongside its three main Schools."
  },
  {
    question: "What is notable about Mrs. Adesola Victoria Alade's appointment as Deputy Librarian?",
    options: ["She was the second person to hold the post", "It was a temporary, one-month appointment", "She was the first person ever to hold that specific post at OAUSTECH", "It was a demotion from Librarian"],
    answer: 2,
    explanation: "Mrs. Alade's appointment made her the university's first-ever Deputy Librarian, a newly created position, effective June 18, 2025."
  },
  {
    question: "Which of the following statements about OAUSTECH's Faculty of Engineering departments is correct?",
    options: ["It includes Mechanical, Electrical, and Civil Engineering", "It has no engineering technology programmes", "It only offers one engineering discipline", "It excludes Chemical Engineering"],
    answer: 0,
    explanation: "OAUSTECH's Faculty/School of Engineering and Engineering Technology includes Mechanical, Electrical, and Civil Engineering, alongside Chemical Engineering and Petroleum and Gas Engineering."
  },
  {
    question: "What professional qualification does Bursar Ganiyu Aminu hold, as indicated by his title?",
    options: ["No professional qualification indicated", "FCIB", "FCPA", "FCA (Fellow, Institute of Chartered Accountants)"],
    answer: 3,
    explanation: "Mr. Ganiyu Bamidele Aminu holds the FCA designation, indicating he is a Fellow of the Institute of Chartered Accountants."
  },
  {
    question: "Which of these committees is Bursar Ganiyu Aminu a member of, based on his university roles?",
    options: ["Students' Union Executive Council", "Finance and General Purposes Committee of the Governing Council", "Sports Council", "Academic Planning Committee only"],
    answer: 1,
    explanation: "Mr. Aminu serves as a member of the Finance and General Purposes Committee of the University's Governing Council, among other roles."
  },
  {
    question: "What was Mr. Idowu Falemora's role before his appointment as Deputy Registrar (effective September 17, 2025)?",
    options: ["Bursar", "Principal Assistant Registrar, Advancement Unit", "University Librarian", "Head of Postgraduate School"],
    answer: 1,
    explanation: "Mr. Falemora previously served as Principal Assistant Registrar in the Advancement Unit before his appointment as Deputy Registrar."
  },
  {
    question: "Which of the following is true regarding OAUSTECH's approved but not-yet-verified faculties (as of recent official updates)?",
    options: ["Two additional faculties have been approved by the Governing Council, awaiting NUC resource verification/approval", "The university has stopped expanding its faculties", "All proposed faculties have already commenced", "No additional faculties have been proposed"],
    answer: 0,
    explanation: "According to OAUSTECH's official \"About Us\" information, two additional faculties have been approved by the Governing Council and are awaiting National Universities Commission (NUC) resource verification and approval."
  },
];

const CURRENTAFFAIRSB = [
  {
    question: "What system of government does Nigeria currently practice?",
    options: ["Monarchy", "One-party state", "Presidential system (federal republic)", "Parliamentary system"],
    answer: 2,
    explanation: "Nigeria operates a presidential system of government under a federal republic structure, with power shared between federal, state, and local governments."
  },
  {
    question: "How many arms of government does Nigeria's constitution provide for?",
    options: ["Three (Executive, Legislature, Judiciary)", "Two", "Five", "Four"],
    answer: 0,
    explanation: "Nigeria's 1999 Constitution establishes three arms of government: the Executive, the Legislature, and the Judiciary, ensuring separation of powers."
  },
  {
    question: "Nigeria's National Assembly is made up of which two chambers?",
    options: ["House of Lords and House of Commons", "Federal Assembly and State Assembly", "Senate and House of Representatives", "Upper Chamber and Lower Chamber only (unnamed)"],
    answer: 2,
    explanation: "Nigeria's National Assembly is bicameral, consisting of the Senate (109 members, upper chamber) and the House of Representatives (360 members, lower chamber)."
  },
  {
    question: "Who is the current President of the Nigerian Senate?",
    options: ["Godswill Akpabio", "Tajudeen Abbas", "Ahmad Lawan", "Barau Jibrin"],
    answer: 0,
    explanation: "Godswill Akpabio has served as President of the Nigerian Senate since 13 June 2023, leading the 10th National Assembly."
  },
  {
    question: "Who is the current Speaker of Nigeria's House of Representatives?",
    options: ["Femi Gbajabiamila", "Benjamin Kalu", "Yakubu Dogara", "Tajudeen Abbas"],
    answer: 3,
    explanation: "Tajudeen Abbas has served as Speaker of the House of Representatives since 13 June 2023."
  },
  {
    question: "How many states make up the Federal Republic of Nigeria (excluding the FCT)?",
    options: ["30", "36", "38", "33"],
    answer: 1,
    explanation: "Nigeria is made up of 36 states, plus the Federal Capital Territory (FCT), Abuja, which is not itself a state."
  },
  {
    question: "Which arm of government is primarily responsible for interpreting laws in Nigeria?",
    options: ["Legislature", "Executive", "Local Government", "Judiciary"],
    answer: 3,
    explanation: "The Judiciary interprets and applies laws, resolving disputes and ensuring justice, distinct from the Executive and Legislature."
  },
  {
    question: "What is the tenure length for a Nigerian President per term, before re-election eligibility?",
    options: ["4 years", "6 years", "3 years", "5 years"],
    answer: 0,
    explanation: "Under Nigeria's constitution, a President serves a 4-year term and may be re-elected for one additional term (maximum of two terms, 8 years total)."
  },
  {
    question: "Who is the current Vice President of Nigeria?",
    options: ["Yemi Osinbajo", "Namadi Sambo", "Kashim Shettima", "Atiku Abubakar"],
    answer: 2,
    explanation: "Kashim Shettima has served as Vice President of Nigeria since 29 May 2023, under President Bola Tinubu."
  },
  {
    question: "Who is the current Chief Justice of Nigeria?",
    options: ["Olukayode Ariwoola", "Kudirat Kekere-Ekun", "Walter Onnoghen", "Tanko Muhammad"],
    answer: 1,
    explanation: "Kudirat Kekere-Ekun currently serves as the Chief Justice of Nigeria, the head of the country's judiciary."
  },
  {
    question: "Who is the current President of Nigeria?",
    options: ["Atiku Abubakar", "Goodluck Jonathan", "Bola Ahmed Tinubu", "Muhammadu Buhari"],
    answer: 2,
    explanation: "Bola Ahmed Tinubu has served as President of Nigeria since 29 May 2023, following his election victory in the 2023 presidential election."
  },
  {
    question: "Who was Nigeria's first Prime Minister at independence in 1960?",
    options: ["Yakubu Gowon", "Obafemi Awolowo", "Nnamdi Azikiwe", "Abubakar Tafawa Balewa"],
    answer: 3,
    explanation: "Sir Abubakar Tafawa Balewa served as Nigeria's first Prime Minister from independence in 1960 until 1966, under a parliamentary system with a ceremonial Governor-General."
  },
  {
    question: "Who was Nigeria's first President (following the move to a republic in 1963)?",
    options: ["Shehu Shagari", "Olusegun Obasanjo", "Nnamdi Azikiwe", "Yakubu Gowon"],
    answer: 2,
    explanation: "Dr. Nnamdi Azikiwe, who had earlier served as Governor-General, became Nigeria's first President when the country became a republic in 1963."
  },
  {
    question: "Who succeeded General Johnson Aguiyi-Ironsi as Head of State following the 1966 counter-coup?",
    options: ["Murtala Muhammed", "Yakubu Gowon", "Olusegun Obasanjo", "Sani Abacha"],
    answer: 1,
    explanation: "General Yakubu Gowon became Head of State in 1966 after Aguiyi-Ironsi's assassination during the July 1966 counter-coup, ruling until 1975."
  },
  {
    question: "Which Nigerian leader served as Head of State twice — first as a military ruler, and later as a democratically elected President?",
    options: ["Muhammadu Buhari", "Ibrahim Babangida", "Sani Abacha", "Yakubu Gowon"],
    answer: 0,
    explanation: "Muhammadu Buhari served as military Head of State from 1983–1985, and later returned as a democratically elected civilian President from 2015–2023."
  },
  {
    question: "When did former President Muhammadu Buhari pass away?",
    options: ["He is still alive", "13 July 2025", "13 July 2024", "5 May 2023"],
    answer: 1,
    explanation: "Muhammadu Buhari passed away on 13 July 2025, after having served as Nigeria's civilian President from 2015 to 2023."
  },
  {
    question: "Which Nigerian civilian leader had the shortest tenure as Head of State, lasting only 83 days?",
    options: ["Shehu Shagari", "Umaru Musa Yar'Adua", "Ernest Shonekan", "Sani Abacha"],
    answer: 2,
    explanation: "Ernest Shonekan led an Interim National Government for just 83 days in 1993 before being deposed, making his tenure the shortest in Nigeria's presidential history."
  },
  {
    question: "Who was Nigeria's President immediately before Bola Tinubu?",
    options: ["Umaru Musa Yar'Adua", "Olusegun Obasanjo", "Muhammadu Buhari", "Goodluck Jonathan"],
    answer: 2,
    explanation: "Muhammadu Buhari served as President from 2015 to 29 May 2023, when he was succeeded by Bola Ahmed Tinubu."
  },
  {
    question: "Which Nigerian President died in office in 2010, leading to Goodluck Jonathan's succession?",
    options: ["Umaru Musa Yar'Adua", "Muhammadu Buhari", "Shehu Shagari", "Sani Abacha"],
    answer: 0,
    explanation: "President Umaru Musa Yar'Adua died on 5 May 2010 while in office, leading Vice President Goodluck Jonathan to succeed him as President."
  },
  {
    question: "Who was the youngest person to ever become Nigeria's Head of State?",
    options: ["Goodluck Jonathan", "Yakubu Gowon", "Murtala Muhammed", "Muhammadu Buhari"],
    answer: 1,
    explanation: "Yakubu Gowon became Head of State in 1966 at just 31 years old, making him the youngest person ever to hold that position in Nigeria's history."
  },
  {
    question: "What is the capital city of Nigeria?",
    options: ["Lagos", "Port Harcourt", "Abuja", "Kano"],
    answer: 2,
    explanation: "Abuja, located in the Federal Capital Territory (FCT), has been Nigeria's capital since 12 December 1991, replacing Lagos."
  },
  {
    question: "What is the capital of Lagos State?",
    options: ["Ikeja", "Lagos Island", "Badagry", "Victoria Island"],
    answer: 0,
    explanation: "Although Lagos city is Nigeria's most populous city and former national capital, Ikeja specifically serves as the administrative capital of Lagos State."
  },
  {
    question: "What is the capital of Ondo State?",
    options: ["Ondo City", "Akure", "Okitipupa", "Owo"],
    answer: 1,
    explanation: "Akure serves as the capital of Ondo State, distinct from Ondo City (a different town) and Okitipupa (where OAUSTECH is located)."
  },
  {
    question: "Which Nigerian state is known as the \"Centre of Excellence\"?",
    options: ["Kano State", "Oyo State", "Lagos State", "Rivers State"],
    answer: 2,
    explanation: "Lagos State is popularly branded \"Centre of Excellence,\" reflecting its status as Nigeria's commercial and economic hub."
  },
  {
    question: "What is the capital of Kano State?",
    options: ["Kaduna", "Kano", "Katsina", "Zaria"],
    answer: 1,
    explanation: "Kano city serves as both the name and capital of Kano State, one of Nigeria's most populous states, located in the North-West geopolitical zone."
  },
  {
    question: "Which Nigerian state is known for its large oil and gas production, with Port Harcourt as its capital?",
    options: ["Delta State", "Bayelsa State", "Akwa Ibom State", "Rivers State"],
    answer: 3,
    explanation: "Rivers State, with its capital Port Harcourt, is one of Nigeria's key oil-producing states, often called the \"Treasure Base of the Nation.\""
  },
  {
    question: "What is the capital of Oyo State?",
    options: ["Ogbomoso", "Iseyin", "Ife", "Ibadan"],
    answer: 3,
    explanation: "Ibadan serves as the capital of Oyo State and is historically one of the largest cities in West Africa by landmass."
  },
  {
    question: "Which state is located in Nigeria's Federal Capital Territory zone but is NOT itself a state?",
    options: ["Niger State", "Kogi State", "Nasarawa State", "FCT (Abuja)"],
    answer: 3,
    explanation: "The Federal Capital Territory (FCT), home to Abuja, is a distinct federal entity, not classified as one of Nigeria's 36 states."
  },
  {
    question: "What is the capital of Enugu State?",
    options: ["Awgu", "Enugu", "Agbani", "Nsukka"],
    answer: 1,
    explanation: "Enugu city serves as the capital of Enugu State, historically significant as a former coal-mining hub in Nigeria's South-East region."
  },
  {
    question: "Which Nigerian state has Sokoto as its capital, and is historically significant as the seat of the Sokoto Caliphate?",
    options: ["Zamfara State", "Sokoto State", "Kebbi State", "Katsina State"],
    answer: 1,
    explanation: "Sokoto State, with Sokoto city as its capital, holds historical importance as the former center of the Sokoto Caliphate."
  },
  {
    question: "In what year did Nigeria gain independence from British colonial rule?",
    options: ["1957", "1966", "1963", "1960"],
    answer: 3,
    explanation: "Nigeria gained independence from Britain on 1 October 1960, a date still celebrated annually as Nigeria's Independence Day."
  },
  {
    question: "In what year did Nigeria become a republic, replacing the Queen as Head of State with a President?",
    options: ["1963", "1966", "1960", "1979"],
    answer: 0,
    explanation: "Nigeria became a republic in 1963, adopting a new constitution that replaced Queen Elizabeth II with a President as Head of State."
  },
  {
    question: "The Nigerian Civil War (Biafran War) took place between which years?",
    options: ["1967–1970", "1966–1970", "1960–1963", "1970–1975"],
    answer: 0,
    explanation: "The Nigerian Civil War, also known as the Biafran War, was fought from 1967 to 1970, following the secession attempt by the Eastern Region."
  },
  {
    question: "Which event marked the end of Nigeria's First Republic in 1966?",
    options: ["A military coup d'état", "Nigeria joining the UN", "A general election", "Independence celebrations"],
    answer: 0,
    explanation: "A series of military coups in 1966 ended Nigeria's First Republic, ushering in an extended period of military rule."
  },
  {
    question: "When did Nigeria return to civilian democratic rule after prolonged military governance, marking the start of the Fourth Republic?",
    options: ["1999", "2003", "1993", "1979"],
    answer: 0,
    explanation: "Nigeria returned to civilian democratic rule on 29 May 1999, when Olusegun Obasanjo was inaugurated as President."
  },
  {
    question: "Which Nigerian city served as the capital before Abuja officially took over?",
    options: ["Enugu", "Ibadan", "Kaduna", "Lagos"],
    answer: 3,
    explanation: "Lagos served as Nigeria's capital from independence until 12 December 1991, when the capital officially moved to Abuja."
  },
  {
    question: "May 29 is significant in Nigerian history as:",
    options: ["Democracy Day", "Independence Day", "Workers' Day", "Republic Day"],
    answer: 0,
    explanation: "May 29 is observed as Democracy Day in Nigeria, marking the anniversary of the 1999 return to civilian democratic rule."
  },
  {
    question: "Which historic date is now also recognized in Nigeria to commemorate the annulled 1993 presidential election (won by MKO Abiola)?",
    options: ["October 1", "June 12", "January 15", "May 29"],
    answer: 1,
    explanation: "June 12 is recognized as Democracy Day in Nigeria (since a 2018 redesignation), commemorating the 1993 presidential election won by MKO Abiola."
  },
  {
    question: "Who was Nigeria's military Head of State assassinated in a coup in 1976?",
    options: ["Ibrahim Babangida", "Sani Abacha", "Yakubu Gowon", "Murtala Muhammed"],
    answer: 3,
    explanation: "General Murtala Muhammed was assassinated on 13 February 1976 during an unsuccessful coup attempt."
  },
  {
    question: "Nigeria's amalgamation of the Northern and Southern Protectorates into a single entity occurred in which year?",
    options: ["1960", "1914", "1922", "1900"],
    answer: 1,
    explanation: "The Northern and Southern Protectorates of Nigeria were amalgamated into a single colonial entity in 1914, under British colonial administrator Lord Frederick Lugard."
  },
  {
    question: "What are the colors of the Nigerian national flag?",
    options: ["Green, Red, Green", "Red, White, Red", "Green, White, Green", "Green, Yellow, Green"],
    answer: 2,
    explanation: "Nigeria's flag consists of three vertical stripes — green, white, green — where green symbolizes agriculture/natural wealth, and white represents peace and unity."
  },
  {
    question: "Who designed Nigeria's national flag?",
    options: ["Michael Taiwo Akinkunmi", "Nnamdi Azikiwe", "Tafawa Balewa", "Obafemi Awolowo"],
    answer: 0,
    explanation: "Michael Taiwo Akinkunmi, a Nigerian student, designed the national flag, winning a national competition ahead of Nigeria's independence in 1960."
  },
  {
    question: "What is Nigeria's official national currency?",
    options: ["Dollar", "Cedi", "Franc", "Naira"],
    answer: 3,
    explanation: "The Naira (₦) is Nigeria's official currency, introduced in 1973, replacing the Nigerian pound."
  },
  {
    question: "What is depicted on Nigeria's Coat of Arms alongside the black shield?",
    options: ["Two horses (chargers) and an eagle atop the shield", "Two elephants and a lion", "Two lions and an eagle", "A dove and two doves"],
    answer: 0,
    explanation: "Nigeria's Coat of Arms features a black shield crossed by a wavy white \"Y\" pane, supported by two white horses, with an eagle perched on top."
  },
  {
    question: "What does the eagle on Nigeria's Coat of Arms symbolize?",
    options: ["Wealth", "Strength", "Unity", "Peace"],
    answer: 1,
    explanation: "The eagle on Nigeria's Coat of Arms represents strength, standing prominently atop the national emblem."
  },
  {
    question: "What is Nigeria's national anthem currently titled (as of its most recent 2024 reinstatement)?",
    options: ["\"One Nigeria, One Destiny\"", "\"Arise, O Compatriots\"", "\"God Bless Nigeria\"", "\"Nigeria, We Hail Thee\""],
    answer: 3,
    explanation: "In May 2024, Nigeria officially reinstated \"Nigeria, We Hail Thee\" as its national anthem, replacing \"Arise, O Compatriots\" which had been in use since 1978."
  },
  {
    question: "What is Nigeria's national bird, as depicted on the Coat of Arms?",
    options: ["Eagle", "Ostrich", "Peacock", "Vulture"],
    answer: 0,
    explanation: "The eagle is Nigeria's national bird, prominently featured atop the Coat of Arms as a symbol of strength and vision."
  },
  {
    question: "What flower is recognized as Nigeria's national flower?",
    options: ["Costus spectabilis (yellow trumpet flower)", "Sunflower", "Rose", "Hibiscus"],
    answer: 0,
    explanation: "Costus spectabilis, a bright yellow flower native to Nigeria, is recognized as the country's national flower."
  },
  {
    question: "Which motto is inscribed on Nigeria's Coat of Arms?",
    options: ["\"Freedom and Justice\"", "\"Peace and Progress\"", "\"One Nation, One Destiny\"", "\"Unity and Faith, Peace and Progress\""],
    answer: 3,
    explanation: "Nigeria's national motto, inscribed on the Coat of Arms, is \"Unity and Faith, Peace and Progress.\""
  },
  {
    question: "What is Nigeria's official language for government, business, and education?",
    options: ["Igbo", "Yoruba", "English", "Hausa"],
    answer: 2,
    explanation: "English is Nigeria's official language, chosen as a unifying language for administration and education, given the country's numerous indigenous languages."
  },
];

const CURRENTAFFAIRSC = [
  {
    question: "Which sector currently contributes the largest share to Nigeria's GDP?",
    options: ["Manufacturing", "Agriculture", "Services", "Oil and gas"],
    answer: 2,
    explanation: "The services sector is currently the largest contributor to Nigeria's GDP, accounting for over half of total output, even though oil remains the dominant export earner."
  },
  {
    question: "What is Nigeria's official currency, and which body issues/regulates it?",
    options: ["Naira; Nigerian Stock Exchange", "Naira; Central Bank of Nigeria (CBN)", "Cedi; Central Bank of Nigeria", "Naira; Federal Ministry of Finance"],
    answer: 1,
    explanation: "The Naira is issued and regulated by the Central Bank of Nigeria (CBN), which also sets monetary policy including interest rates."
  },
  {
    question: "Despite contributing a smaller share to GDP directly, which sector remains Nigeria's dominant source of foreign exchange earnings?",
    options: ["Telecommunications", "Agriculture", "Oil and gas (crude petroleum)", "Manufacturing"],
    answer: 2,
    explanation: "Crude petroleum and natural gas remain Nigeria's primary source of foreign exchange earnings and government revenue."
  },
  {
    question: "Which of the following is NOT typically listed among Nigeria's major agricultural export/food crops?",
    options: ["Wheat (as a major export crop)", "Palm oil", "Cassava", "Cocoa"],
    answer: 0,
    explanation: "While Nigeria produces cassava, cocoa, and palm oil in significant quantities, wheat is not a major Nigerian export crop — Nigeria imports substantial wheat to meet domestic demand."
  },
  {
    question: "Nigeria's economy is often described as Africa's largest by which primary measure?",
    options: ["Land area", "Number of airports", "Number of universities", "Population and overall GDP size"],
    answer: 3,
    explanation: "Nigeria is widely recognized as both Africa's most populous country and, by nominal GDP, one of its largest economies on the continent."
  },
  {
    question: "Which Nigerian industry has grown into one of the world's largest film industries by volume?",
    options: ["Nollywood (film industry)", "Fashion industry", "Publishing industry", "Music industry"],
    answer: 0,
    explanation: "Nollywood, Nigeria's film industry, has grown to become one of the world's largest by volume of films produced annually, alongside India's Bollywood and Hollywood."
  },
  {
    question: "What has been a major economic challenge for Nigeria in recent years, significantly affecting household purchasing power?",
    options: ["High inflation", "Currency appreciation", "Trade surplus with all partners", "Deflation"],
    answer: 0,
    explanation: "Nigeria has faced persistently high inflation in recent years, driven by factors including fuel subsidy removal and exchange rate reforms."
  },
  {
    question: "Which economic reform, implemented in recent years, involved the removal of a long-standing government subsidy on petrol?",
    options: ["Fuel subsidy removal", "Import ban policy", "Tax reform", "Naira redesign"],
    answer: 0,
    explanation: "The removal of the fuel (petrol) subsidy has been one of Nigeria's most significant recent economic reforms, aimed at reducing government expenditure."
  },
  {
    question: "Which of the following best describes Nigeria's manufacturing sector output?",
    options: ["Includes cement, food processing, textiles, and petroleum products", "Focuses exclusively on car manufacturing", "Only produces textiles", "No manufacturing exists"],
    answer: 0,
    explanation: "Nigeria's manufacturing sector spans several areas including cement production, food processing, textiles, fertilizers, and petroleum products."
  },
  {
    question: "Nigeria's fintech and digital economy sector has grown significantly, becoming a notable part of which broader economic sector?",
    options: ["Mining", "Services (particularly telecommunications/technology)", "Oil and gas", "Agriculture"],
    answer: 1,
    explanation: "Nigeria's rapidly growing fintech, e-commerce, and digital payments industry falls under the broader services sector."
  },
  {
    question: "Which body is responsible for conducting elections in Nigeria?",
    options: ["National Assembly", "Independent National Electoral Commission (INEC)", "Federal Ministry of Justice", "Nigeria Police Force"],
    answer: 1,
    explanation: "INEC is the constitutionally established body responsible for organizing and supervising elections in Nigeria at federal and state levels."
  },
  {
    question: "Which agency is Nigeria's central bank, responsible for monetary policy?",
    options: ["Nigerian Deposit Insurance Corporation (NDIC)", "Central Bank of Nigeria (CBN)", "Debt Management Office (DMO)", "Securities and Exchange Commission (SEC)"],
    answer: 1,
    explanation: "The Central Bank of Nigeria (CBN) is responsible for formulating and implementing monetary policy, regulating the banking sector, and issuing the national currency."
  },
  {
    question: "Which agency is primarily responsible for admissions screening (JAMB examinations) into Nigerian tertiary institutions?",
    options: ["NECO", "WAEC", "NUC", "JAMB (Joint Admissions and Matriculation Board)"],
    answer: 3,
    explanation: "JAMB conducts the UTME and coordinates admissions into Nigerian universities, polytechnics, and colleges of education."
  },
  {
    question: "Which body regulates and accredits university education standards in Nigeria?",
    options: ["WAEC", "JAMB", "NECO", "NUC (National Universities Commission)"],
    answer: 3,
    explanation: "The National Universities Commission (NUC) is responsible for regulating, accrediting, and ensuring quality standards for university education across Nigeria."
  },
  {
    question: "Which agency examines students for the West African Senior School Certificate (WASSCE)?",
    options: ["WAEC (West African Examinations Council)", "NECO", "JAMB", "NUC"],
    answer: 0,
    explanation: "WAEC conducts the WASSCE across West African countries, distinct from NECO which conducts Nigeria's own SSCE."
  },
  {
    question: "Which agency is responsible for fighting corruption and economic crimes in Nigeria?",
    options: ["Nigeria Police Force only", "INEC", "NNPC", "EFCC (Economic and Financial Crimes Commission)"],
    answer: 3,
    explanation: "The EFCC is specifically mandated to investigate and prosecute financial crimes, corruption, and economic fraud in Nigeria."
  },
  {
    question: "Which national oil company oversees Nigeria's petroleum industry interests?",
    options: ["Chevron Nigeria", "Shell Nigeria", "Dangote Group", "NNPC (Nigerian National Petroleum Company)"],
    answer: 3,
    explanation: "NNPC (now NNPC Limited) is Nigeria's state oil company, overseeing the country's interests in petroleum exploration, production, and distribution."
  },
  {
    question: "Which body is responsible for regulating and combating drug trafficking in Nigeria?",
    options: ["NAFDAC", "NDLEA (National Drug Law Enforcement Agency)", "Customs Service", "Immigration Service"],
    answer: 1,
    explanation: "NDLEA is specifically tasked with combating illicit drug trafficking and abuse within Nigeria."
  },
  {
    question: "Which agency regulates food and drug safety standards in Nigeria?",
    options: ["SON", "FIRS", "NDLEA", "NAFDAC (National Agency for Food and Drug Administration and Control)"],
    answer: 3,
    explanation: "NAFDAC is responsible for regulating and controlling the manufacture, importation, and distribution of food, drugs, and related products."
  },
  {
    question: "Which body is responsible for collecting federal taxes in Nigeria?",
    options: ["Debt Management Office", "FIRS (Federal Inland Revenue Service)", "Central Bank of Nigeria", "Nigerian Customs Service"],
    answer: 1,
    explanation: "FIRS is the primary agency responsible for assessing, collecting, and accounting for federal tax revenues in Nigeria."
  },
  {
    question: "What does ECOWAS stand for?",
    options: ["Eastern Council of West African States", "Economic Cooperation of West African States", "European Community of West African States", "Economic Community of West African States"],
    answer: 3,
    explanation: "ECOWAS is a regional political and economic union established in 1975 to promote economic integration among West African nations."
  },
  {
    question: "As of early 2025, which three countries formally withdrew from ECOWAS?",
    options: ["Burkina Faso, Mali, Niger", "Senegal, Guinea, Sierra Leone", "Ghana, Togo, Benin", "Chad, Cameroon, Central African Republic"],
    answer: 0,
    explanation: "Burkina Faso, Mali, and Niger — grouped together as the Alliance of Sahel States (AES) — formally withdrew from ECOWAS effective 29 January 2025."
  },
  {
    question: "Where is ECOWAS headquartered?",
    options: ["Accra, Ghana", "Lomé, Togo", "Dakar, Senegal", "Abuja, Nigeria"],
    answer: 3,
    explanation: "ECOWAS is headquartered in Abuja, Nigeria's capital, reflecting Nigeria's significant role in the organization's founding and ongoing operations."
  },
  {
    question: "In what year was ECOWAS founded?",
    options: ["1980", "1963", "1999", "1975"],
    answer: 3,
    explanation: "ECOWAS was established in 1975 through the Treaty of Lagos, aiming to promote economic cooperation and integration across West Africa."
  },
  {
    question: "What alliance did Burkina Faso, Mali, and Niger form after tensions with ECOWAS, ahead of their formal withdrawal?",
    options: ["Francophone Unity Front", "Sahel Cooperation Union", "Alliance of Sahel States (AES)", "West African Defense Pact"],
    answer: 2,
    explanation: "The three military-led governments formed the Alliance of Sahel States (AES), a confederation strengthening their mutual cooperation."
  },
  {
    question: "Which organization serves as the primary continental body promoting unity and cooperation among African nations?",
    options: ["African Union (AU)", "ECOWAS", "Commonwealth of Nations", "United Nations Africa Office"],
    answer: 0,
    explanation: "The African Union (AU), successor to the Organisation of African Unity (OAU), is the primary continental body promoting political and economic integration across all of Africa."
  },
  {
    question: "Where is the African Union headquartered?",
    options: ["Pretoria, South Africa", "Addis Ababa, Ethiopia", "Abuja, Nigeria", "Cairo, Egypt"],
    answer: 1,
    explanation: "The African Union is headquartered in Addis Ababa, Ethiopia, which also hosts many other continental diplomatic institutions."
  },
  {
    question: "What organization did the African Union succeed in 2002?",
    options: ["The Commonwealth", "ECOWAS", "The Organisation of African Unity (OAU)", "The United Nations"],
    answer: 2,
    explanation: "The African Union was formally established in 2002, replacing the Organisation of African Unity (OAU), which had existed since 1963."
  },
  {
    question: "What is the main goal of the African Continental Free Trade Area (AfCFTA)?",
    options: ["To promote free trade and economic integration across African countries", "To create a single African military force", "To establish a single African currency immediately", "To replace the African Union"],
    answer: 0,
    explanation: "AfCFTA aims to create a single continental market for goods and services, boosting intra-African trade by reducing tariffs and other trade barriers."
  },
  {
    question: "How many countries currently remain in ECOWAS following the 2025 withdrawals?",
    options: ["15", "10", "12", "18"],
    answer: 2,
    explanation: "Following the formal exit of Burkina Faso, Mali, and Niger in January 2025, ECOWAS's remaining membership stands at 12 countries (down from the original 15)."
  },
  {
    question: "What does UN stand for?",
    options: ["United Nations", "United Nigeria", "United Nationalities", "Universal Nations"],
    answer: 0,
    explanation: "UN stands for United Nations, an international organization founded in 1945 to promote international cooperation, peace, and security."
  },
  {
    question: "In what year was the United Nations founded?",
    options: ["1960", "1945", "1919", "1975"],
    answer: 1,
    explanation: "The United Nations was founded in 1945, immediately after World War II, replacing the earlier League of Nations."
  },
  {
    question: "Where is the United Nations headquarters located?",
    options: ["Vienna, Austria", "New York City, USA", "Geneva, Switzerland", "The Hague, Netherlands"],
    answer: 1,
    explanation: "The UN's main headquarters is located in New York City, USA, though it maintains other major offices in Geneva, Vienna, and Nairobi."
  },
  {
    question: "How many permanent members does the UN Security Council have?",
    options: ["10", "5", "15", "3"],
    answer: 1,
    explanation: "The UN Security Council has 5 permanent members (USA, UK, France, Russia, and China), each holding veto power, alongside 10 non-permanent rotating members."
  },
  {
    question: "Which UN agency is primarily focused on children's welfare worldwide?",
    options: ["UNICEF", "UNESCO", "UNHCR", "WHO"],
    answer: 0,
    explanation: "UNICEF (United Nations Children's Fund) is specifically dedicated to providing humanitarian and developmental aid to children worldwide."
  },
  {
    question: "Which UN agency focuses on global health issues?",
    options: ["WHO (World Health Organization)", "FAO", "UNESCO", "UNICEF"],
    answer: 0,
    explanation: "The World Health Organization (WHO) is the UN specialized agency responsible for international public health."
  },
  {
    question: "Which international organization focuses on education, science, and culture?",
    options: ["UNESCO", "WHO", "UNDP", "UNICEF"],
    answer: 0,
    explanation: "UNESCO promotes international collaboration in education, science, and cultural preservation, including World Heritage Site designations."
  },
  {
    question: "Nigeria is a member of which of the following international organizations?",
    options: ["NATO", "United Nations only", "United Nations, African Union, ECOWAS, and Commonwealth of Nations", "European Union"],
    answer: 2,
    explanation: "Nigeria holds membership in multiple international organizations including the UN, African Union, ECOWAS, and the Commonwealth of Nations, but is not part of NATO or the EU."
  },
  {
    question: "Which international organization is primarily concerned with international peace, labor rights, and humanitarian standards through various specialized agencies?",
    options: ["World Trade Organization only", "The United Nations and its specialized agencies", "OPEC", "IMF only"],
    answer: 1,
    explanation: "The United Nations, through its various specialized agencies, addresses a broad range of international peace, humanitarian, and development issues."
  },
  {
    question: "Who is the current Secretary-General of the United Nations?",
    options: ["Kofi Annan", "Boutros Boutros-Ghali", "António Guterres", "Ban Ki-moon"],
    answer: 2,
    explanation: "António Guterres has served as UN Secretary-General since 2017, continuing in this role through his current term."
  },
  {
    question: "Who currently serves as President of Nigeria, having taken office in May 2023?",
    options: ["Atiku Abubakar", "Peter Obi", "Muhammadu Buhari", "Bola Ahmed Tinubu"],
    answer: 3,
    explanation: "Bola Ahmed Tinubu has served as Nigeria's President since 29 May 2023, continuing to lead the country through 2025 and 2026."
  },
  {
    question: "Former President Muhammadu Buhari passed away in which year?",
    options: ["2024", "2026", "2025", "2023"],
    answer: 2,
    explanation: "Muhammadu Buhari passed away on 13 July 2025, a significant recent event in Nigeria's political history."
  },
  {
    question: "What major economic reform has been a central focus of the Tinubu administration since 2023?",
    options: ["Removal of fuel subsidy and foreign exchange rate reforms", "Nationalization of all banks", "Reintroduction of fuel subsidies", "Closure of the stock exchange"],
    answer: 0,
    explanation: "President Tinubu's administration has pursued significant economic reforms including the removal of the long-standing fuel subsidy and adjustments to foreign exchange policy."
  },
  {
    question: "As of 2025-2026, which three West African countries have formed the Alliance of Sahel States after leaving ECOWAS?",
    options: ["Togo, Benin, Ivory Coast", "Burkina Faso, Mali, Niger", "Chad, Cameroon, Gabon", "Nigeria, Ghana, Senegal"],
    answer: 1,
    explanation: "Burkina Faso, Mali, and Niger formed the Alliance of Sahel States (AES) and formally withdrew from ECOWAS in January 2025."
  },
  {
    question: "What was notable about Nigeria's national anthem status as of May 2024?",
    options: ["Nigeria adopted its first-ever national anthem", "The national anthem was translated into all local languages officially", "Nigeria abolished having a national anthem", "\"Nigeria, We Hail Thee\" was reinstated as the national anthem, replacing \"Arise, O Compatriots\""],
    answer: 3,
    explanation: "In May 2024, the Nigerian government reinstated \"Nigeria, We Hail Thee\" as the national anthem, a notable and somewhat controversial policy change."
  },
  {
    question: "Which sector has been highlighted as a key driver of Nigeria's economic growth projections for 2026?",
    options: ["Only agriculture", "Only oil and gas", "Services, technology/telecommunications, agriculture, and non-oil exports", "Only manufacturing"],
    answer: 2,
    explanation: "Economic outlooks for 2026 point to a broad-based recovery driven by services, oil and gas, agriculture, construction, and the growing digital economy."
  },
  {
    question: "What has been a persistent macroeconomic challenge for Nigeria despite recent reforms (as of 2025-2026)?",
    options: ["Zero inflation", "High inflation, though gradually easing from a 2024 peak", "Currency appreciation causing problems", "No economic challenges remain"],
    answer: 1,
    explanation: "Nigeria's inflation peaked above 33% in late 2024 following subsidy removal and exchange rate reforms, and while easing, remains a significant challenge."
  },
  {
    question: "Which of the following reflects a recent global trend affecting international current affairs?",
    options: ["Continued global focus on issues like climate change, artificial intelligence development, and geopolitical tensions", "Declining use of digital technology worldwide", "Total elimination of global trade", "Complete resolution of all international conflicts"],
    answer: 0,
    explanation: "Ongoing global current affairs continue to center around climate change mitigation, the rapid advancement of artificial intelligence, and various geopolitical tensions."
  },
  {
    question: "Which body remains responsible for organizing Nigeria's general elections, including the most recent 2023 presidential election?",
    options: ["INEC", "Nigerian Army", "National Assembly", "Supreme Court"],
    answer: 0,
    explanation: "INEC organized Nigeria's 2023 general elections, which brought President Bola Tinubu into office, and remains the body responsible for future elections."
  },
  {
    question: "Why is it particularly important for post-UTME candidates to verify current affairs facts (like office holders) close to their exam date?",
    options: ["Current affairs never change", "Only historical facts matter for exams", "Current affairs questions are never asked in Nigerian exams", "Office holders, government policies, and international memberships can change, making up-to-date verification essential"],
    answer: 3,
    explanation: "Unlike fixed historical facts, current affairs — such as who holds a particular office or recent policy changes — can and do change, making it essential to verify such details close to the exam date."
  },
];

function getCourse(course) {
  return {
    ENGLISH,
    ENGLISHB,
    ENGLISHC,
    ENGLISHD,
    PHYSICSA,
    PHYSICSB,
    PHYSICSC,
    PHYSICSD,
    PHYSICSE,
    PHYSICSF,
    CHEMISTRYA,
    CHEMISTRYB,
    CHEMISTRYC,
    CHEMISTRYD,
    MATHSA,
    MATHSB,
    MATHSC,
    MATHSD,
    BIOLOGYA,
    BIOLOGYB,
    BIOLOGYC,
    BIOLOGYD,
    CURRENTAFFAIRSA,
    CURRENTAFFAIRSB,
    CURRENTAFFAIRSC
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

// ===== QUESTION PALETTE =====
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
