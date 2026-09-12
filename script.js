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
    PHYSICSF
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
