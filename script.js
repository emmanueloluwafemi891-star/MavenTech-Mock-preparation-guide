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
function getCourse(course) {
  return {
    ENGLISH,
    ENGLISHB,
    ENGLISHC,
    ENGLISHD
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
