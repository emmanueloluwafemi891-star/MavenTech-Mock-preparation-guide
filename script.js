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
const PHY102B = [
  {
    question: "Two point charges of +4 μC and +9 μC are placed 0.5 m apart in air. Calculate the electrostatic force between them. (k = 9 × 10⁹ N·m²/C²)",
    options: [
      "6.48 N",
      "1.30 N",
      "2.16 N",
      "0.65 N"
    ],
    answer: 1,
    explanation: "F = kq₁q₂/r² = (9×10⁹ × 4×10⁻⁶ × 9×10⁻⁶)/(0.5)² = 0.324/0.25 = 1.296 N ≈ 1.30 N."
  },
  {
    question: "Which of the following best describes an equipotential surface?",
    options: [
      "A surface where all points have the same electric potential",
      "A surface where charge density is constant",
      "A surface where the electric field is maximum",
      "A surface perpendicular to itself"
    ],
    answer: 0,
    explanation: "By definition, an equipotential surface is one on which every point has the same electric potential; no work is done moving a charge along it, and the electric field is always perpendicular to it."
  },
  {
    question: "A parallel plate capacitor has plate area 0.02 m² and separation 2 mm, with vacuum between the plates. Find its capacitance. (ε₀ = 8.85 × 10⁻¹² F/m)",
    options: [
      "8.85 pF",
      "8.85 × 10⁻¹¹ F",
      "88.5 pF",
      "885 pF"
    ],
    answer: 1,
    explanation: "C = ε₀A/d = (8.85×10⁻¹² × 0.02)/(2×10⁻³) = 8.85×10⁻¹¹ F."
  },
  {
    question: "Gauss's law relates the electric flux through a closed surface to:",
    options: [
      "The surface area only",
      "The magnetic flux through the surface",
      "The potential difference across the surface",
      "The net charge enclosed by the surface divided by ε₀"
    ],
    answer: 3,
    explanation: "Gauss's law states ∮E·dA = Q_enclosed/ε₀; the total electric flux through a closed surface equals the enclosed charge divided by the permittivity of free space."
  },
  {
    question: "A 12 V battery is connected across a 4 Ω and 8 Ω resistor in series. Find the current flowing in the circuit.",
    options: [
      "0.5 A",
      "1.5 A",
      "1 A",
      "3 A"
    ],
    answer: 2,
    explanation: "Total resistance R = 4 + 8 = 12 Ω. Current I = V/R = 12/12 = 1 A."
  },
  {
    question: "What is the SI unit of magnetic flux?",
    options: [
      "Weber",
      "Gauss",
      "Henry",
      "Tesla"
    ],
    answer: 0,
    explanation: "Magnetic flux (Φ) is measured in Webers (Wb); Tesla is the unit of magnetic flux density (B), Henry is the unit of inductance."
  },
  {
    question: "A charge of 5 μC experiences a force of 0.02 N at a certain point in an electric field. Calculate the electric field intensity at that point.",
    options: [
      "40000 N/C",
      "250 N/C",
      "400 N/C",
      "4000 N/C"
    ],
    answer: 3,
    explanation: "E = F/q = 0.02/(5×10⁻⁶) = 4000 N/C."
  },
  {
    question: "Which statement correctly describes the behavior of a dielectric placed between the plates of a charged, isolated capacitor?",
    options: [
      "It reduces the electric field and increases the capacitance",
      "It has no effect on capacitance or field",
      "It increases the electric field between the plates",
      "It decreases the capacitance"
    ],
    answer: 0,
    explanation: "A dielectric polarizes and creates an opposing field, reducing the net electric field; since Q is fixed (isolated capacitor) and V decreases, capacitance increases by factor κ."
  },
  {
    question: "Two capacitors of 6 μF and 3 μF are connected in series across a 9 V battery. Find the equivalent capacitance.",
    options: [
      "4.5 μF",
      "18 μF",
      "2 μF",
      "9 μF"
    ],
    answer: 2,
    explanation: "For series: 1/C = 1/6 + 1/3 = 3/6 = 1/2, so C = 2 μF."
  },
  {
    question: "Faraday's law of electromagnetic induction states that the induced EMF in a circuit is:",
    options: [
      "Independent of the rate of change of flux",
      "Equal to the negative rate of change of magnetic flux linkage",
      "Directly proportional to the resistance of the circuit",
      "Proportional to the square of the magnetic flux"
    ],
    answer: 1,
    explanation: "Faraday's law: EMF = −N(dΦ/dt); the induced EMF equals the negative rate of change of magnetic flux linkage."
  },
  {
    question: "A wire carrying a current of 5 A is placed in a magnetic field of 0.2 T, perpendicular to the field, over a length of 0.4 m. Calculate the force on the wire.",
    options: [
      "4 N",
      "0.04 N",
      "1 N",
      "0.4 N"
    ],
    answer: 3,
    explanation: "F = BIL sinθ = 0.2 × 5 × 0.4 × sin90° = 0.4 N."
  },
  {
    question: "According to Maxwell's equations, a changing electric field produces:",
    options: [
      "A displacement current and an induced magnetic field",
      "No effect on magnetic fields",
      "A gravitational field",
      "A static magnetic field only"
    ],
    answer: 0,
    explanation: "Maxwell's modification of Ampere's law shows that a time-varying electric field creates a displacement current, which in turn produces a magnetic field."
  },
  {
    question: "Calculate the electric potential at a point 0.3 m from a point charge of 6 μC. (k = 9 × 10⁹ N·m²/C²)",
    options: [
      "5.4 × 10⁴ V",
      "1.8 × 10⁵ V",
      "1.8 × 10⁴ V",
      "9 × 10⁴ V"
    ],
    answer: 1,
    explanation: "V = kq/r = (9×10⁹ × 6×10⁻⁶)/0.3 = 5.4×10⁴/0.3 = 1.8×10⁵ V."
  },
  {
    question: "Which of the following is NOT one of Maxwell's four equations?",
    options: [
      "Faraday's law of induction",
      "Gauss's law for magnetism",
      "Ohm's law",
      "Gauss's law for electricity"
    ],
    answer: 2,
    explanation: "Maxwell's equations comprise Gauss's law (electricity), Gauss's law (magnetism), Faraday's law, and the Ampere-Maxwell law. Ohm's law (V=IR) is a separate empirical relation."
  },
  {
    question: "A cylindrical capacitor is being charged. If the potential difference across it is 20 V and it stores 4 × 10⁻⁴ C of charge, calculate its capacitance.",
    options: [
      "0.2 μF",
      "20 μF",
      "200 μF",
      "2 μF"
    ],
    answer: 1,
    explanation: "C = Q/V = (4×10⁻⁴)/20 = 2×10⁻⁵ F = 20 μF."
  },
  {
    question: "In an RC circuit, what happens to the current as a capacitor charges fully from a DC source?",
    options: [
      "It oscillates",
      "It increases exponentially",
      "It decreases exponentially to zero",
      "It remains constant"
    ],
    answer: 2,
    explanation: "As a capacitor charges in a DC RC circuit, current follows I(t) = (V/R)e^(−t/RC), decaying exponentially from its initial maximum toward zero."
  },
  {
    question: "Three resistors of 2 Ω, 3 Ω, and 5 Ω are connected in parallel. Find the equivalent resistance.",
    options: [
      "3.33 Ω",
      "1.03 Ω",
      "10.00 Ω",
      "0.97 Ω"
    ],
    answer: 3,
    explanation: "1/R = 1/2 + 1/3 + 1/5 = 0.500 + 0.333 + 0.200 = 1.033. Therefore R = 1/1.033 ≈ 0.97 Ω."
  },
  {
    question: "The dielectric constant (relative permittivity) of a material is a measure of:",
    options: [
      "Its ability to reduce the electric field relative to vacuum when polarized",
      "Its magnetic permeability",
      "Its ability to conduct electric current",
      "Its resistance to current flow"
    ],
    answer: 0,
    explanation: "The dielectric constant κ = ε/ε₀ indicates how much a material reduces an external electric field due to polarization compared to vacuum."
  },
  {
    question: "A proton moving at 2 × 10⁶ m/s enters a magnetic field of 0.5 T perpendicular to its velocity. Calculate the magnetic force on the proton. (q = 1.6 × 10⁻¹⁹ C)",
    options: [
      "8 × 10⁻¹⁴ N",
      "1.6 × 10⁻¹³ N",
      "1.6 × 10⁻¹⁹ N",
      "3.2 × 10⁻¹³ N"
    ],
    answer: 1,
    explanation: "F = qvB sinθ = 1.6×10⁻¹⁹ × 2×10⁶ × 0.5 × sin90° = 1.6×10⁻¹³ N."
  },
  {
    question: "What is the primary function of a capacitor in a smoothing (filter) circuit for a rectifier?",
    options: [
      "To convert AC to DC directly",
      "To increase resistance in the circuit",
      "To store and release charge, reducing voltage ripple",
      "To increase the frequency of the signal"
    ],
    answer: 2,
    explanation: "In a smoothing circuit, the capacitor charges when voltage rises and discharges when voltage falls, filling gaps in the rectified waveform and reducing voltage ripple."
  },
  {
    question: "Calculate the energy stored in a 10 μF capacitor charged to a potential difference of 100 V.",
    options: [
      "0.05 J",
      "0.1 J",
      "1 J",
      "0.5 J"
    ],
    answer: 0,
    explanation: "Energy U = ½CV² = ½ × 10×10⁻⁶ × (100)² = ½ × 10×10⁻⁶ × 10000 = 0.05 J."
  },
  {
    question: "Lenz's law is essentially a statement of which fundamental physical principle?",
    options: [
      "Conservation of mass",
      "Conservation of charge",
      "Conservation of momentum",
      "Conservation of energy"
    ],
    answer: 3,
    explanation: "Lenz's law states that induced current opposes the change producing it; this ensures energy is conserved since work must be done against the induced effect to change the flux."
  },
  {
    question: "A solenoid of 500 turns carries a current of 2 A and has a length of 0.25 m. Calculate the magnetic field inside the solenoid. (μ₀ = 4π × 10⁻⁷ T·m/A)",
    options: [
      "1.26 × 10⁻² T",
      "5.03 × 10⁻³ T",
      "2.51 × 10⁻³ T",
      "6.28 × 10⁻³ T"
    ],
    answer: 1,
    explanation: "B = μ₀nI, where n = N/L = 500/0.25 = 2000 turns/m. B = 4π×10⁻⁷ × 2000 × 2 = 5.027×10⁻³ T."
  },
  {
    question: "Which of these correctly represents the relationship between electric field (E) and potential (V) in a uniform field?",
    options: [
      "E = d/V",
      "E = V × d",
      "E = V²/d",
      "E = V/d"
    ],
    answer: 3,
    explanation: "In a uniform electric field between two points separated by distance d with potential difference V, the field magnitude is E = V/d."
  },
  {
    question: "An electron (charge −1.6 × 10⁻¹⁹ C) is accelerated through a potential difference of 500 V. Calculate the kinetic energy gained by the electron in joules.",
    options: [
      "8 × 10⁻¹⁷ J",
      "1.6 × 10⁻¹⁶ J",
      "8 × 10⁻¹⁶ J",
      "3.2 × 10⁻¹⁷ J"
    ],
    answer: 0,
    explanation: "KE = qV = 1.6×10⁻¹⁹ × 500 = 8×10⁻¹⁷ J."
  },
  {
    question: "In the context of Gauss's law, why is it particularly useful for calculating fields of charge distributions with high symmetry?",
    options: [
      "It only works for point charges",
      "It eliminates the need for any charge information",
      "Symmetry allows E to be pulled out of the flux integral, simplifying calculation",
      "It only applies to conductors"
    ],
    answer: 2,
    explanation: "When charge distribution has high symmetry, a Gaussian surface can be chosen so that E is constant in magnitude and parallel or perpendicular to the surface, allowing E to be factored out of the flux integral."
  },
  {
    question: "A copper wire has resistance 10 Ω at 20°C. If its temperature coefficient of resistance is 0.004 /°C, calculate its resistance at 70°C.",
    options: [
      "10.4 Ω",
      "12 Ω",
      "14 Ω",
      "11 Ω"
    ],
    answer: 1,
    explanation: "R = R₀[1 + α(T−T₀)] = 10[1 + 0.004(70−20)] = 10[1 + 0.2] = 12 Ω."
  },
  {
    question: "What does the term 'displacement current' introduced by Maxwell primarily explain?",
    options: [
      "Resistance change due to temperature",
      "Current caused by mechanical displacement of a wire",
      "Current flow in a broken (capacitor) circuit due to changing electric field",
      "The motion of electrons in a conductor"
    ],
    answer: 2,
    explanation: "Maxwell introduced displacement current to account for the apparent current between capacitor plates where there's no actual charge flow, due to the changing electric field, making Ampere's law consistent."
  },
  {
    question: "A 24 V EMF source with internal resistance 2 Ω is connected to an external resistor of 4 Ω. Calculate the terminal voltage of the source.",
    options: [
      "16 V",
      "8 V",
      "20 V",
      "24 V"
    ],
    answer: 0,
    explanation: "I = EMF/(R+r) = 24/(4+2) = 4 A. Terminal voltage V = IR = 4 × 4 = 16 V."
  },
  {
    question: "Which of the following best explains why electric field lines never cross each other?",
    options: [
      "Field lines are always straight",
      "Field lines repel each other physically",
      "Crossing lines would violate Newton's third law",
      "At any point, the field has a unique direction, so two lines crossing would imply two directions at that point"
    ],
    answer: 3,
    explanation: "The electric field at any given point has one specific direction; if two field lines crossed, that point would have two different directions simultaneously, which is physically impossible."
  },
  {
    question: "Calculate the total charge that flows through a wire carrying a steady current of 3 A for 2 minutes.",
    options: [
      "360 C",
      "180 C",
      "90 C",
      "6 C"
    ],
    answer: 0,
    explanation: "Q = It = 3 × (2×60) = 3 × 120 = 360 C."
  },
  {
    question: "A step-up transformer has 100 turns on the primary coil and 500 turns on the secondary coil. If the primary voltage is 20 V, what is the secondary voltage?",
    options: [
      "500 V",
      "20 V",
      "4 V",
      "100 V"
    ],
    answer: 3,
    explanation: "Vs/Vp = Ns/Np → Vs = Vp × (Ns/Np) = 20 × (500/100) = 20 × 5 = 100 V."
  },
  {
    question: "Which of the following correctly describes the direction of the magnetic force on a positive charge moving in a magnetic field, according to the right-hand rule?",
    options: [
      "Parallel to velocity",
      "Perpendicular to both velocity and magnetic field",
      "Parallel to the magnetic field",
      "Opposite to velocity"
    ],
    answer: 1,
    explanation: "The magnetic force is given by F = qv × B, a cross product, meaning the force is always perpendicular to both the velocity vector and the magnetic field vector."
  },
  {
    question: "Four identical 8 μF capacitors are connected in parallel. Find the total capacitance.",
    options: [
      "16 μF",
      "8 μF",
      "32 μF",
      "2 μF"
    ],
    answer: 2,
    explanation: "For capacitors in parallel, C_total = C₁+C₂+C₃+C₄ = 8+8+8+8 = 32 μF."
  },
  {
    question: "Electromagnetic waves are transverse waves because:",
    options: [
      "The E and B fields oscillate perpendicular to each other and to the direction of propagation",
      "They travel only in a vacuum",
      "They have no magnetic component",
      "They require a medium to propagate"
    ],
    answer: 0,
    explanation: "In an electromagnetic wave, the electric field, magnetic field, and direction of propagation are all mutually perpendicular, the defining characteristic of a transverse wave."
  },
  {
    question: "A current-carrying conductor of length 0.6 m experiences a force of 1.2 N when placed in a magnetic field of 0.4 T at 90° to the field. Calculate the current in the conductor.",
    options: [
      "8 A",
      "2 A",
      "5 A",
      "0.5 A"
    ],
    answer: 2,
    explanation: "F = BIL → I = F/(BL) = 1.2/(0.4 × 0.6) = 1.2/0.24 = 5 A."
  },
  {
    question: "What is the physical significance of the negative sign in Lenz's law (EMF = −N dΦ/dt)?",
    options: [
      "It means current flows backward in the circuit",
      "It has no physical meaning, just a mathematical convention",
      "It shows the EMF is always negative in value",
      "It indicates the induced EMF opposes the change in flux that produces it"
    ],
    answer: 3,
    explanation: "The negative sign indicates that the induced EMF acts in a direction that opposes the change in magnetic flux that caused it, consistent with conservation of energy."
  },
  {
    question: "Two identical charges of +2 μC each are separated by 1 m. Calculate the work done in bringing them from infinity to this separation.",
    options: [
      "36 J",
      "0.036 J",
      "3.6 J",
      "0.0036 J"
    ],
    answer: 1,
    explanation: "Work done = kq₁q₂/r = (9×10⁹ × 2×10⁻⁶ × 2×10⁻⁶)/1 = 9×10⁹ × 4×10⁻¹² = 0.036 J."
  },
  {
    question: "Why do conductors have zero electric field inside them under electrostatic equilibrium?",
    options: [
      "Because conductors are always neutral",
      "Because conductors have no free charges",
      "Because free charges redistribute on the surface until the internal field cancels to zero",
      "Because the electric field cannot penetrate any material"
    ],
    answer: 2,
    explanation: "In electrostatic equilibrium, free electrons in a conductor move in response to any internal field until they redistribute on the surface in a way that exactly cancels the field inside."
  },
  {
    question: "A capacitor of 5 μF is charged to 200 V then disconnected and connected to an uncharged 15 μF capacitor. Find the common potential difference after connection.",
    options: [
      "66.7 V",
      "50 V",
      "150 V",
      "200 V"
    ],
    answer: 1,
    explanation: "Q_initial = C₁V₁ = 5×10⁻⁶×200 = 1×10⁻³ C. Common V = Q/(C₁+C₂) = 1×10⁻³/(20×10⁻⁶) = 50 V."
  },
  {
    question: "Which of the following is a correct statement regarding magnetic monopoles based on Gauss's law for magnetism?",
    options: [
      "Magnetic field lines start and end on monopoles like electric field lines on charges",
      "Magnetic monopoles have been experimentally confirmed to exist abundantly",
      "Magnetic monopoles are responsible for electromagnetic induction",
      "Gauss's law for magnetism states that the net magnetic flux through any closed surface is zero, implying no magnetic monopoles"
    ],
    answer: 3,
    explanation: "∮B·dA = 0 is Gauss's law for magnetism, showing magnetic field lines always form closed loops without source or sink, meaning isolated magnetic monopoles have never been observed."
  },
  {
    question: "A galvanometer with resistance 50 Ω gives full-scale deflection for a current of 5 mA. What shunt resistance is needed to convert it into an ammeter reading up to 5 A?",
    options: [
      "0.05 Ω",
      "0.5 Ω",
      "0.005 Ω",
      "5 Ω"
    ],
    answer: 0,
    explanation: "Shunt Rs = IgRg/(I−Ig) = (0.005×50)/(5−0.005) = 0.25/4.995 ≈ 0.05 Ω."
  },
  {
    question: "In a purely resistive DC circuit, how does power dissipated relate to current and resistance?",
    options: [
      "P = I/R",
      "P = R/I²",
      "P = I²R",
      "P = IR²"
    ],
    answer: 2,
    explanation: "By Joule's law, power dissipated in a resistor is P = I²R (equivalently P = VI = V²/R using Ohm's law V=IR)."
  },
  {
    question: "Calculate the capacitance of a spherical conductor of radius 0.09 m in air. (k = 9 × 10⁹ N·m²/C²)",
    options: [
      "10 pF",
      "20 pF",
      "100 pF",
      "1 pF"
    ],
    answer: 0,
    explanation: "C = 4πε₀r = r/k = 0.09/(9×10⁹) = 1×10⁻¹¹ F = 10 pF."
  },
  {
    question: "What is the principal reason capacitors are used in AC coupling and filtering applications rather than simple resistors?",
    options: [
      "Capacitors convert AC into DC permanently",
      "Capacitors block DC while allowing AC to pass, due to frequency-dependent reactance",
      "Capacitors have zero resistance to all currents",
      "Capacitors amplify the signal"
    ],
    answer: 1,
    explanation: "A capacitor's reactance Xc = 1/(2πfC) is infinite at f=0 (DC) and decreases with increasing frequency, so it blocks DC while passing AC signals."
  },
  {
    question: "An electric heater draws a current of 10 A from a 220 V supply. Calculate the power consumed.",
    options: [
      "220 W",
      "1000 W",
      "22 W",
      "2200 W"
    ],
    answer: 3,
    explanation: "P = VI = 220 × 10 = 2200 W."
  },
  {
    question: "Which of the following correctly states the relationship in the Ampere-Maxwell law regarding the sources of magnetic field?",
    options: [
      "Magnetic fields are produced only by permanent magnets",
      "Magnetic fields have no relation to electric currents",
      "Magnetic fields are produced by conduction current and displacement current (changing electric flux)",
      "Magnetic fields are produced only by moving magnetic monopoles"
    ],
    answer: 2,
    explanation: "The Ampere-Maxwell law, ∮B·dl = μ₀I + μ₀ε₀(dΦE/dt), shows magnetic fields arise from both conduction current and displacement current due to a changing electric flux."
  },
  {
    question: "A wire loop of area 0.1 m² is placed in a magnetic field that changes from 0.2 T to 0.8 T in 0.3 s. Calculate the average induced EMF.",
    options: [
      "0.2 V",
      "0.6 V",
      "0.02 V",
      "2 V"
    ],
    answer: 0,
    explanation: "EMF = ΔΦ/Δt = A(B₂−B₁)/Δt = 0.1×(0.8−0.2)/0.3 = 0.1×0.6/0.3 = 0.2 V."
  },
  {
    question: "Why does increasing the distance between capacitor plates decrease its capacitance (for a parallel plate capacitor)?",
    options: [
      "Because C is directly proportional to distance d",
      "Because C is inversely proportional to d, so larger d reduces the field's ability to store charge per unit voltage",
      "Because larger plate separation increases the dielectric constant",
      "Because charge leaks out faster over larger distances"
    ],
    answer: 1,
    explanation: "Since C = ε₀A/d, capacitance is inversely proportional to plate separation d; increasing d weakens the electric field for a given charge, requiring higher voltage, thus lowering capacitance."
  },
  {
    question: "A 100 Ω resistor, an inductor, and a capacitor are in series with an AC source. If at resonance the circuit behaves purely resistively, what is true about the inductive and capacitive reactances at that frequency?",
    options: [
      "XL is much greater than XC",
      "XC is much greater than XL",
      "Both XL and XC are zero",
      "XL equals XC, so they cancel out"
    ],
    answer: 3,
    explanation: "At resonance in a series RLC circuit, XL = XC, so the net reactance (XL−XC) is zero, leaving only resistance R — this is why the circuit behaves purely resistively at resonance."
  }
];
const PHY102C = [
  {
    question: "A charge of +3 μC is placed 0.2 m from a charge of +6 μC. Calculate the force between them. (k = 9 × 10⁹ N·m²/C²)",
    options: [
      "4.05 N",
      "1.35 N",
      "0.405 N",
      "40.5 N"
    ],
    answer: 0,
    explanation: "F = kq₁q₂/r² = (9×10⁹ × 3×10⁻⁶ × 6×10⁻⁶)/(0.2)² = 0.162/0.04 = 4.05 N."
  },
  {
    question: "What happens to the electric field inside a hollow charged conductor in electrostatic equilibrium?",
    options: [
      "It varies linearly from center to wall",
      "It is zero throughout the cavity",
      "It is maximum at the geometric center",
      "It equals the field just outside the surface"
    ],
    answer: 1,
    explanation: "All excess charge resides on the outer surface; by Gauss's law the field inside a hollow conductor cavity with no enclosed charge is zero."
  },
  {
    question: "Calculate the potential difference required to store 2 × 10⁻⁴ C of charge on a 40 μF capacitor.",
    options: [
      "8 V",
      "80 V",
      "5 V",
      "0.5 V"
    ],
    answer: 2,
    explanation: "V = Q/C = (2×10⁻⁴)/(40×10⁻⁶) = 5 V."
  },
  {
    question: "Which of the following materials would best maximize capacitance in a parallel plate capacitor?",
    options: [
      "One with the lowest dielectric constant",
      "One with the highest dielectric constant",
      "One with the lowest electrical resistivity",
      "One with the highest electrical conductivity"
    ],
    answer: 1,
    explanation: "Since C = κε₀A/d, a higher dielectric constant κ directly increases capacitance; conductors would short the plates."
  },
  {
    question: "Two resistors, 6 Ω and 12 Ω, are connected in parallel. Find the equivalent resistance.",
    options: [
      "4 Ω",
      "9 Ω",
      "6 Ω",
      "18 Ω"
    ],
    answer: 0,
    explanation: "1/R = 1/6 + 1/12 = 3/12 = 1/4, so R = 4 Ω."
  },
  {
    question: "In Gauss's law, if a closed surface encloses zero net charge, what can be said about the total electric flux through it?",
    options: [
      "It is infinite",
      "It depends on the surface shape",
      "It is always negative",
      "It is zero"
    ],
    answer: 3,
    explanation: "By Gauss's law, Φ = Q_enclosed/ε₀; if Q_enclosed = 0, the net flux through the closed surface is zero."
  },
  {
    question: "A straight conductor of length 0.8 m carries a current of 6 A in a magnetic field of 0.25 T, perpendicular to the field. Calculate the force on the conductor.",
    options: [
      "0.12 N",
      "1.2 N",
      "12 N",
      "2.4 N"
    ],
    answer: 1,
    explanation: "F = BIL = 0.25 × 6 × 0.8 = 1.2 N."
  },
  {
    question: "What is the main function of Maxwell's displacement current correction to Ampère's law?",
    options: [
      "To make Ampère's law consistent with charge conservation where electric fields vary with time",
      "To eliminate the need for magnetic fields entirely",
      "To explain only electrostatic induction phenomena",
      "To increase the calculated speed of light"
    ],
    answer: 0,
    explanation: "Maxwell added displacement current to resolve an inconsistency in Ampère's law in circuits with capacitors, ensuring charge conservation holds even where no conduction current flows."
  },
  {
    question: "An electron is placed in a uniform electric field of 500 N/C. Calculate the force on the electron. (q = 1.6 × 10⁻¹⁹ C)",
    options: [
      "3.2 × 10⁻¹⁷ N",
      "1.6 × 10⁻¹⁶ N",
      "8 × 10⁻¹⁷ N",
      "8 × 10⁻¹⁶ N"
    ],
    answer: 2,
    explanation: "F = qE = 1.6×10⁻¹⁹ × 500 = 8×10⁻¹⁷ N."
  },
  {
    question: "Why does the capacitance of a capacitor remain unaffected by the amount of charge stored on it (for a given geometry)?",
    options: [
      "Because capacitance increases proportionally with stored charge",
      "Because capacitance is determined solely by the power source",
      "Because charge and voltage are physically unrelated",
      "Because capacitance depends only on geometry and the medium, not on Q or V individually"
    ],
    answer: 3,
    explanation: "Capacitance C = Q/V is a constant ratio; Q and V change together, but their ratio stays fixed, depending only on physical geometry and dielectric medium."
  },
  {
    question: "A solenoid with 800 turns over a length of 0.4 m carries a current of 3 A. Calculate the magnetic field inside. (μ₀ = 4π × 10⁻⁷ T·m/A)",
    options: [
      "3.77 × 10⁻³ T",
      "1.51 × 10⁻² T",
      "7.54 × 10⁻³ T",
      "6.28 × 10⁻³ T"
    ],
    answer: 2,
    explanation: "n = N/L = 800/0.4 = 2000 turns/m. B = μ₀nI = 4π×10⁻⁷ × 2000 × 3 = 7.54×10⁻³ T."
  },
  {
    question: "In electromagnetic induction, what does the term 'motional EMF' refer to?",
    options: [
      "EMF generated exclusively by AC voltage sources",
      "EMF induced by relative motion of a conductor through a magnetic field",
      "EMF produced by resistive heating in a wire",
      "EMF generated by a stationary conductor in a static field"
    ],
    answer: 1,
    explanation: "Motional EMF arises when a conductor moves through a magnetic field; it is given by EMF = BLv for a rod moving perpendicular to B."
  },
  {
    question: "Calculate the electric potential energy of two point charges, +2 μC and −3 μC, separated by 0.6 m. (k = 9 × 10⁹ N·m²/C²)",
    options: [
      "−0.9 J",
      "−9 × 10⁻⁵ J",
      "0.09 J",
      "−0.09 J"
    ],
    answer: 3,
    explanation: "U = kq₁q₂/r = (9×10⁹ × 2×10⁻⁶ × (−3×10⁻⁶))/0.6 = −0.054/0.6 = −0.09 J."
  },
  {
    question: "Which of the following correctly compares conduction current and displacement current?",
    options: [
      "Conduction current involves movement of charge carriers; displacement current arises from a changing electric field with no charge crossing the gap",
      "Displacement current involves actual charge flow through a wire, unlike conduction current",
      "Both always have identical magnitudes in every type of circuit",
      "They are completely unrelated phenomena governed by different physical laws"
    ],
    answer: 0,
    explanation: "Conduction current is due to real charge carriers moving through a conductor; displacement current represents the effect of a changing electric field producing a magnetic field without actual charges crossing the gap."
  },
  {
    question: "A battery with EMF 15 V and internal resistance 1 Ω delivers current to an external resistor of 4 Ω. Calculate the current in the circuit.",
    options: [
      "3.75 A",
      "15 A",
      "3 A",
      "5 A"
    ],
    answer: 2,
    explanation: "I = EMF/(R+r) = 15/(4+1) = 3 A."
  },
  {
    question: "What is the relationship between the direction of induced current and the change in magnetic flux, according to Lenz's law?",
    options: [
      "The induced current always flows in a clockwise direction",
      "The induced current flows in the same direction as the flux change",
      "The induced current direction is independent of flux change direction",
      "The induced current flows in a direction that opposes the change in flux"
    ],
    answer: 3,
    explanation: "Lenz's law states the induced current creates its own magnetic field that opposes the change in the original flux, whether that change is an increase or decrease."
  },
  {
    question: "Two capacitors of 4 μF and 12 μF are connected in series. Find the equivalent capacitance.",
    options: [
      "48 μF",
      "3 μF",
      "8 μF",
      "16 μF"
    ],
    answer: 1,
    explanation: "1/C = 1/4 + 1/12 = 4/12 = 1/3, so C = 3 μF."
  },
  {
    question: "Why is copper commonly used as a conducting material in electrical wiring?",
    options: [
      "It has low resistivity, allowing efficient current flow with minimal energy loss",
      "It has an unusually high dielectric constant",
      "It acts as an effective electrical insulator",
      "It has high resistivity, generating useful amounts of heat"
    ],
    answer: 0,
    explanation: "Copper has low electrical resistivity, offering little opposition to current flow, minimizing energy loss as heat and making it efficient for wiring."
  },
  {
    question: "A charged particle moves in a circular path in a magnetic field of 0.6 T with speed 4 × 10⁵ m/s and radius 0.02 m. Calculate the charge-to-mass ratio (q/m).",
    options: [
      "1.2 × 10⁷ C/kg",
      "2.4 × 10⁷ C/kg",
      "3.33 × 10⁷ C/kg",
      "8.33 × 10⁶ C/kg"
    ],
    answer: 2,
    explanation: "q/m = v/(rB) = (4×10⁵)/(0.02 × 0.6) = 3.33×10⁷ C/kg."
  },
  {
    question: "Which statement is true regarding electric field lines around a negative point charge?",
    options: [
      "They originate from infinity and terminate on the charge",
      "They have no defined direction or orientation",
      "They radiate outward away from the charge",
      "They form closed loops encircling the charge"
    ],
    answer: 0,
    explanation: "For a negative charge, field lines point inward (toward the charge), so they originate from infinity and terminate on it."
  },
  {
    question: "A 2000 W electric kettle is used for 15 minutes. Calculate the electrical energy consumed in kWh.",
    options: [
      "2 kWh",
      "30 kWh",
      "5 kWh",
      "0.5 kWh"
    ],
    answer: 3,
    explanation: "Energy = Pt = 2 kW × (15/60) h = 2 × 0.25 = 0.5 kWh."
  },
  {
    question: "In an electromagnetic wave, what is the relationship between the speed of the wave and the electric and magnetic field amplitudes (E₀ and B₀)?",
    options: [
      "c = E₀ × B₀",
      "c = E₀/B₀",
      "c = B₀/E₀",
      "c = E₀ + B₀"
    ],
    answer: 1,
    explanation: "For an electromagnetic wave in vacuum, the ratio of electric field amplitude to magnetic field amplitude equals the speed of light: c = E₀/B₀."
  },
  {
    question: "Calculate the resistance of a copper wire of length 2 m and cross-sectional area 1 × 10⁻⁶ m². (ρ = 1.7 × 10⁻⁸ Ω·m)",
    options: [
      "0.034 Ω",
      "3.4 Ω",
      "0.34 Ω",
      "0.0034 Ω"
    ],
    answer: 0,
    explanation: "R = ρL/A = (1.7×10⁻⁸ × 2)/(1×10⁻⁶) = 0.034 Ω."
  },
  {
    question: "What determines the direction of the induced EMF in a rotating coil within a generator?",
    options: [
      "The resistance of the external load circuit only",
      "The colour of the conducting wire used",
      "The operating temperature of the rotating coil",
      "The rate of change of magnetic flux through the coil, per Faraday's and Lenz's laws"
    ],
    answer: 3,
    explanation: "Faraday's law gives the magnitude of induced EMF from the rate of flux change; Lenz's law determines the direction, ensuring the induced current opposes the flux change."
  },
  {
    question: "A parallel plate capacitor with air between the plates has capacitance 6 μF. A dielectric of constant κ = 5 is inserted. Find the new capacitance.",
    options: [
      "11 μF",
      "30 μF",
      "1.2 μF",
      "6 μF"
    ],
    answer: 1,
    explanation: "C_new = κC_old = 5 × 6 = 30 μF."
  },
  {
    question: "Which of the following best explains why electric potential is a scalar while electric field is a vector?",
    options: [
      "Potential and electric field are actually the same type of physical quantity",
      "Potential depends on the path taken, while field does not",
      "Potential is work done per unit charge (energy-related); field is force per unit charge and has inherent direction",
      "Electric field has magnitude but no physical direction"
    ],
    answer: 2,
    explanation: "Electric potential is derived from potential energy (a scalar), whereas electric field is force per unit charge, inherently having direction and thus being a vector."
  },
  {
    question: "Two long parallel wires carry currents of 5 A and 8 A in the same direction, separated by 0.1 m. Calculate the force per unit length between them. (μ₀ = 4π × 10⁻⁷ T·m/A)",
    options: [
      "1.6 × 10⁻⁴ N/m",
      "8 × 10⁻⁴ N/m",
      "4 × 10⁻⁵ N/m",
      "8 × 10⁻⁵ N/m"
    ],
    answer: 3,
    explanation: "F/L = μ₀I₁I₂/(2πr) = (2×10⁻⁷ × 5 × 8)/0.1 = 8×10⁻⁵ N/m."
  },
  {
    question: "What role does a dielectric play in preventing dielectric breakdown in a capacitor?",
    options: [
      "It increases the breakdown voltage by withstanding higher field strengths than air before ionizing",
      "It decreases the maximum voltage the capacitor can safely handle",
      "It has no measurable role in determining breakdown voltage",
      "It causes the capacitor plates to gradually short-circuit"
    ],
    answer: 0,
    explanation: "A good dielectric has higher dielectric strength than air, withstanding a higher electric field before ionizing and breaking down, allowing the capacitor to handle higher voltages safely."
  },
  {
    question: "A wire loop rotates in a magnetic field of 0.4 T with area 0.05 m² at angular velocity 100 rad/s. Calculate the peak EMF (EMF_max = BAω).",
    options: [
      "20 V",
      "0.02 V",
      "2 V",
      "0.2 V"
    ],
    answer: 2,
    explanation: "EMF_max = BAω = 0.4 × 0.05 × 100 = 2 V."
  },
  {
    question: "Why do electric field lines always emerge perpendicular to the surface of a conductor in electrostatic equilibrium?",
    options: [
      "Because conductors carry no charge at any point on their surface",
      "Because any field component parallel to the surface would drive charges to move until that component vanishes",
      "Because the electric field inside conductors is always at its maximum value",
      "Because conductors physically repel all incoming field lines"
    ],
    answer: 1,
    explanation: "If there were a field component parallel to the conductor's surface, free charges would move until they cancel it; equilibrium requires the field to be purely perpendicular to the surface."
  },
  {
    question: "A 20 Ω resistor and a 30 Ω resistor are connected in series with a 100 V supply. Calculate the voltage drop across the 30 Ω resistor.",
    options: [
      "60 V",
      "30 V",
      "100 V",
      "40 V"
    ],
    answer: 0,
    explanation: "I = V/R_total = 100/50 = 2 A. V₃₀ = IR = 2 × 30 = 60 V."
  },
  {
    question: "According to Maxwell's equations, what produces a magnetic field when no time-varying electric field is present?",
    options: [
      "Changing electric flux acting alone",
      "Gravitational fields interacting with charge",
      "Only the field of permanent magnets",
      "Only steady conduction current, as in the original Ampère's law"
    ],
    answer: 3,
    explanation: "With no changing electric field, the displacement current term vanishes and the Ampère-Maxwell law reduces to the original Ampère's law, where steady conduction current alone produces the magnetic field."
  },
  {
    question: "Calculate the number of electrons flowing through a conductor carrying 2 A for 1 second. (e = 1.6 × 10⁻¹⁹ C)",
    options: [
      "8 × 10¹⁸",
      "3.2 × 10¹⁹",
      "1.25 × 10¹⁹",
      "1.6 × 10¹⁹"
    ],
    answer: 2,
    explanation: "Q = It = 2 C. n = Q/e = 2/(1.6×10⁻¹⁹) = 1.25×10¹⁹ electrons."
  },
  {
    question: "In an RC circuit, what does the time constant τ = RC physically represent?",
    options: [
      "The total energy stored in the fully charged capacitor",
      "The time for the capacitor to charge to about 63.2% of its final value, or discharge to 36.8% of its initial value",
      "The maximum voltage the capacitor can ultimately reach",
      "The fixed resistance value of the circuit alone"
    ],
    answer: 1,
    explanation: "τ = RC is the time for the capacitor voltage to reach ~63.2% of its final value during charging, or fall to ~36.8% of its initial value during discharging."
  },
  {
    question: "Four resistors of 10 Ω each are connected in parallel. Find the equivalent resistance.",
    options: [
      "2.5 Ω",
      "40 Ω",
      "10 Ω",
      "5 Ω"
    ],
    answer: 0,
    explanation: "1/R = 4 × (1/10) = 4/10, so R = 10/4 = 2.5 Ω."
  },
  {
    question: "Which of the following best describes the polarization of a dielectric in an external electric field?",
    options: [
      "The material becomes permanently magnetized by the applied field",
      "Free electrons flow completely through the material as in a metallic conductor",
      "Bound charges within molecules shift slightly, creating induced dipoles that align with the field",
      "The atomic structure of the material is destroyed by the field"
    ],
    answer: 2,
    explanation: "In a dielectric, bound charges shift slightly within each molecule creating induced dipoles, or existing dipoles align with the field, opposing the external field."
  },
  {
    question: "A capacitor charged to 300 V stores 6 × 10⁻⁴ C. Calculate the energy stored.",
    options: [
      "0.18 J",
      "0.9 J",
      "1.8 J",
      "0.09 J"
    ],
    answer: 3,
    explanation: "U = ½QV = ½ × 6×10⁻⁴ × 300 = 0.09 J."
  },
  {
    question: "What is the significance of the right-hand grip rule for a current-carrying straight wire?",
    options: [
      "It determines the electrical resistance of the wire",
      "It determines the direction of the circular magnetic field lines around the wire based on current direction",
      "It applies only to alternating current and not direct current",
      "It determines the direction of the electric field around the wire"
    ],
    answer: 1,
    explanation: "Pointing the right thumb in the direction of conventional current, the curled fingers indicate the direction of the circular magnetic field lines encircling the wire."
  },
  {
    question: "A charge of 8 μC is at a point where the electric potential is 3600 V. Calculate the potential energy of the charge at that point.",
    options: [
      "28.8 J",
      "4.5 × 10² J",
      "2.88 × 10⁻³ J",
      "2.88 × 10⁻² J"
    ],
    answer: 3,
    explanation: "U = qV = 8×10⁻⁶ × 3600 = 2.88×10⁻² J."
  },
  {
    question: "Why does a changing magnetic field induce an electric field, according to Faraday's law in Maxwell's equation form?",
    options: [
      "Because a time-varying B field produces a curling induced E field, as shown by ∇ × E = −∂B/∂t",
      "Because of the principle of conservation of mass in electromagnetism",
      "Because magnetic fields cannot physically exist in the absence of electric fields",
      "Because electric fields always cause magnetic fields to subsequently change"
    ],
    answer: 0,
    explanation: "Maxwell's form of Faraday's law, ∇ × E = −∂B/∂t, shows that a changing magnetic field directly gives rise to a circulating electric field, even in regions without any charges."
  },
  {
    question: "A 5 Ω and 15 Ω resistor are connected in parallel, and this combination is in series with a 2 Ω resistor. Find the total resistance.",
    options: [
      "6 Ω",
      "5.75 Ω",
      "22 Ω",
      "3.75 Ω"
    ],
    answer: 1,
    explanation: "Parallel: 1/R = 1/5 + 1/15 = 4/15, R_parallel = 3.75 Ω. Total = 3.75 + 2 = 5.75 Ω."
  },
  {
    question: "What is the primary reason transformers only work with AC and not DC?",
    options: [
      "DC voltage is always too high for the transformer's primary coil",
      "A steady DC current causes immediate physical damage to the transformer core",
      "Transformers require a continuously changing magnetic flux to induce EMF in the secondary, which only AC can provide",
      "AC current has zero resistance while DC has significant resistance"
    ],
    answer: 2,
    explanation: "Transformer operation requires a changing magnetic flux per Faraday's law; a steady DC current produces constant flux after its initial transient, inducing no continuous EMF in the secondary coil."
  },
  {
    question: "Calculate the magnetic flux through a loop of area 0.25 m² when a magnetic field of 0.6 T is perpendicular to the loop.",
    options: [
      "1.5 Wb",
      "0.15 Wb",
      "2.4 Wb",
      "0.024 Wb"
    ],
    answer: 1,
    explanation: "Φ = BA cosθ = 0.6 × 0.25 × cos0° = 0.15 Wb."
  },
  {
    question: "In a series RLC circuit driven below resonance frequency, which reactance dominates?",
    options: [
      "Both reactances remain equal regardless of the driving frequency",
      "Inductive reactance (XL) dominates over capacitive reactance (XC)",
      "Capacitive reactance (XC) dominates over inductive reactance (XL)",
      "Neither inductive nor capacitive reactance exists below resonance"
    ],
    answer: 2,
    explanation: "Below resonance, XC = 1/(2πfC) is large while XL = 2πfL is small, so the circuit behaves more capacitively with XC dominating."
  },
  {
    question: "A 15 μF capacitor is connected to a 12 V battery. Calculate the charge stored on the capacitor.",
    options: [
      "1.8 × 10⁻⁴ C",
      "1.25 × 10⁻⁶ C",
      "0.8 C",
      "180 C"
    ],
    answer: 0,
    explanation: "Q = CV = 15×10⁻⁶ × 12 = 1.8×10⁻⁴ C."
  },
  {
    question: "What happens to the capacitance of a parallel plate capacitor if the plate area is doubled while separation remains constant?",
    options: [
      "Capacitance quadruples",
      "Capacitance is halved",
      "Capacitance remains unchanged",
      "Capacitance doubles"
    ],
    answer: 3,
    explanation: "Since C = ε₀A/d, capacitance is directly proportional to plate area A; doubling A while keeping d constant doubles the capacitance."
  },
  {
    question: "An AC generator produces a peak voltage of 170 V. Calculate the RMS voltage. (Vrms = Vpeak/√2)",
    options: [
      "170 V",
      "120.2 V",
      "240 V",
      "85 V"
    ],
    answer: 1,
    explanation: "Vrms = 170/√2 = 170/1.414 ≈ 120.2 V."
  },
  {
    question: "What is the physical meaning of magnetic permeability (μ) of a material?",
    options: [
      "Its capacity to store electric charge on its surface",
      "Its ability to withstand high electric fields without breaking down",
      "A measure of how easily a material can be magnetized or support magnetic field formation within itself",
      "Its resistance to the flow of electric current through it"
    ],
    answer: 2,
    explanation: "Magnetic permeability μ quantifies how much a material can support the formation of magnetic field lines within it in response to an applied magnetic field."
  },
  {
    question: "A wire of resistance 8 Ω is stretched so that its length doubles (volume constant). Calculate the new resistance.",
    options: [
      "4 Ω",
      "8 Ω",
      "16 Ω",
      "32 Ω"
    ],
    answer: 3,
    explanation: "With volume constant, if L doubles then A halves. R' = ρ(2L)/(A/2) = 4 × ρL/A = 4 × 8 = 32 Ω."
  },
  {
    question: "Why is it important that ∇ · B = 0 (Gauss's law for magnetism) holds true in Maxwell's equations?",
    options: [
      "It confirms magnetic field lines have no beginning or end, implying no isolated magnetic monopoles exist",
      "It demonstrates that magnetic flux always equals electric flux in free space",
      "It proves that magnetic forces always exceed electric forces",
      "It shows electric charges are the direct source of all magnetic fields"
    ],
    answer: 0,
    explanation: "∇ · B = 0 means the divergence of B is always zero, so magnetic field lines always form closed loops with no source or sink — confirming no isolated magnetic monopoles exist."
  }
];
const PHY102D = [
  {
    question: "Two point charges of +5 μC and −2 μC are separated by 0.3 m. Calculate the magnitude of the force between them. (k = 9 × 10⁹ N·m²/C²)",
    options: [
      "0.3 N",
      "1 N",
      "10 N",
      "3 N"
    ],
    answer: 1,
    explanation: "F = kq₁q₂/r² = (9×10⁹ × 5×10⁻⁶ × 2×10⁻⁶)/(0.3)² = 0.09/0.09 = 1 N."
  },
  {
    question: "What is the physical meaning of 'work done moving a charge along an equipotential surface is zero'?",
    options: [
      "The charge is physically unable to move along the surface",
      "The surface must necessarily be made of a conductor",
      "Since all points are at the same potential, there is no potential difference to do work against",
      "The charge experiences no force anywhere on the surface"
    ],
    answer: 2,
    explanation: "Work W = qΔV; since ΔV = 0 between any two points on an equipotential surface, no work is done moving a charge along it regardless of the path taken."
  },
  {
    question: "A capacitor stores 5 × 10⁻³ C of charge at a potential difference of 250 V. Calculate its capacitance.",
    options: [
      "20 μF",
      "2 μF",
      "50 μF",
      "0.05 μF"
    ],
    answer: 0,
    explanation: "C = Q/V = (5×10⁻³)/250 = 2×10⁻⁵ F = 20 μF."
  },
  {
    question: "A Gaussian surface encloses no charge, but external charges exist outside it. What is true about the electric field on this surface?",
    options: [
      "Gauss's law cannot be applied to this situation",
      "The field can be non-zero on the surface, but the net flux through it is zero",
      "The net flux through the surface is always positive",
      "The field must be zero everywhere on the surface"
    ],
    answer: 1,
    explanation: "External charges can produce a non-zero field at points on the surface, but since as many field lines enter as leave (no enclosed charge), the net flux integrates to zero."
  },
  {
    question: "A 6 Ω, 4 Ω, and 2 Ω resistor are connected in series to a 24 V battery. Calculate the current in the circuit.",
    options: [
      "1 A",
      "4 A",
      "2 A",
      "12 A"
    ],
    answer: 2,
    explanation: "R_total = 6+4+2 = 12 Ω. I = V/R = 24/12 = 2 A."
  },
  {
    question: "Which of the following is the correct SI unit for electric field strength?",
    options: [
      "Volt per meter (V/m)",
      "Newton per coulomb-meter (N/C·m)",
      "Weber (Wb)",
      "Coulomb per meter (C/m)"
    ],
    answer: 0,
    explanation: "Electric field is expressed as N/C or equivalently V/m (potential gradient); both are dimensionally equivalent."
  },
  {
    question: "A conducting rod of length 0.5 m moves at 8 m/s perpendicular to a magnetic field of 0.3 T. Calculate the motional EMF induced.",
    options: [
      "12 V",
      "0.12 V",
      "2.4 V",
      "1.2 V"
    ],
    answer: 3,
    explanation: "EMF = BLv = 0.3 × 0.5 × 8 = 1.2 V."
  },
  {
    question: "According to Maxwell's equations, electromagnetic waves are self-sustaining because:",
    options: [
      "A changing E field creates a changing B field, which recreates a changing E field, and so on indefinitely",
      "They can only exist in the immediate vicinity of their source",
      "They lose energy at a steady constant rate as they travel",
      "They require a medium to continuously push them forward"
    ],
    answer: 0,
    explanation: "The mutual regeneration of electric and magnetic fields — a changing E field induces B, and that changing B induces E — allows the wave to propagate through space without needing a medium."
  },
  {
    question: "Calculate the electric potential at a point 0.25 m from a charge of −4 μC. (k = 9 × 10⁹ N·m²/C²)",
    options: [
      "−9 × 10⁴ V",
      "−1.44 × 10⁵ V",
      "1.44 × 10⁵ V",
      "−3.6 × 10⁴ V"
    ],
    answer: 1,
    explanation: "V = kq/r = (9×10⁹ × (−4×10⁻⁶))/0.25 = −3.6×10⁴/0.25 = −1.44×10⁵ V."
  },
  {
    question: "Why does an isolated charged conductor's excess charge reside entirely on its outer surface?",
    options: [
      "Because like charges attract each other and cluster at the center",
      "Because the conductor's core has effectively infinite resistance",
      "Because mutual repulsion between like charges pushes them as far apart as possible, which is the outer surface",
      "Because charge carriers are heavier than the surrounding conductor material"
    ],
    answer: 2,
    explanation: "Like charges repel; free charges in a conductor redistribute to minimize repulsive interaction energy, placing them on the outer surface as far apart as the geometry allows."
  },
  {
    question: "A wire carries 4 A in a magnetic field of 0.5 T at 30° to the field, over a length of 0.6 m. Calculate the force on the wire.",
    options: [
      "1.2 N",
      "2.4 N",
      "0.3 N",
      "0.6 N"
    ],
    answer: 3,
    explanation: "F = BIL sinθ = 0.5 × 4 × 0.6 × sin30° = 1.2 × 0.5 = 0.6 N."
  },
  {
    question: "Which of the following best describes the concept of electric flux?",
    options: [
      "The resistance encountered by an electric field in a medium",
      "The total electric charge within a given volume",
      "A measure of the number of electric field lines passing through a given surface",
      "The rate of flow of electric charge through a conductor"
    ],
    answer: 2,
    explanation: "Electric flux Φ = ∫E·dA quantifies how much of the electric field passes through a surface, conceptually related to the count of field lines crossing it."
  },
  {
    question: "Three 4 μF capacitors are connected in parallel. Find the total capacitance.",
    options: [
      "12 μF",
      "4 μF",
      "1.33 μF",
      "8 μF"
    ],
    answer: 0,
    explanation: "For parallel capacitors: C_total = 4+4+4 = 12 μF."
  },
  {
    question: "What is the primary difference between conductors and dielectrics under an applied electric field?",
    options: [
      "Conductors cannot be polarized under any circumstances",
      "Conductors have free charges that move to cancel the internal field; dielectrics have bound charges that only slightly shift, reducing but not eliminating the field",
      "Dielectrics allow free current flow through them, unlike conductors",
      "Both materials behave in an identical manner under any applied electric field"
    ],
    answer: 1,
    explanation: "In conductors, free electrons move until the internal field is completely cancelled; in dielectrics, bound charges only shift slightly (polarize), reducing the internal field without eliminating it."
  },
  {
    question: "A current of 0.5 A flows through a resistor for 4 minutes. Calculate the total charge transferred.",
    options: [
      "2 C",
      "30 C",
      "0.125 C",
      "120 C"
    ],
    answer: 3,
    explanation: "Q = It = 0.5 × (4×60) = 0.5 × 240 = 120 C."
  },
  {
    question: "In electromagnetic induction, what does it mean for a coil to have 'self-inductance'?",
    options: [
      "The coil induces an EMF in itself due to a change in its own current",
      "The coil is physically incapable of conducting alternating current",
      "The coil generates current independently without any external magnetic field",
      "The coil has zero resistance to any flowing current"
    ],
    answer: 0,
    explanation: "Self-inductance describes how a changing current in a coil induces an EMF in that same coil, opposing the current change, due to the changing magnetic flux the coil itself produces."
  },
  {
    question: "A 9 μF and 18 μF capacitor are connected in series across a 30 V supply. Find the equivalent capacitance.",
    options: [
      "27 μF",
      "6 μF",
      "13.5 μF",
      "3 μF"
    ],
    answer: 1,
    explanation: "1/C = 1/9 + 1/18 = 3/18 = 1/6, so C = 6 μF."
  },
  {
    question: "Why is the concept of 'drift velocity' important in understanding current flow in conductors?",
    options: [
      "It applies exclusively to insulating materials rather than conductors",
      "It measures the speed at which light travels through the conductor",
      "It describes the slow net electron movement that constitutes current at the microscopic level, despite electrons' fast random thermal motion",
      "It has no quantitative relationship to the magnitude of electric current"
    ],
    answer: 2,
    explanation: "Drift velocity is the small net velocity electrons gain from the applied field; despite being slow compared to thermal motion, this net drift constitutes the electric current."
  },
  {
    question: "A particle with mass 2 × 10⁻²⁷ kg and charge 1.6 × 10⁻¹⁹ C moves in a circle of radius 0.1 m in a magnetic field of 0.4 T. Calculate its speed.",
    options: [
      "8 × 10⁴ m/s",
      "6.4 × 10⁵ m/s",
      "1.6 × 10⁵ m/s",
      "3.2 × 10⁶ m/s"
    ],
    answer: 3,
    explanation: "v = rqB/m = (0.1 × 1.6×10⁻¹⁹ × 0.4)/(2×10⁻²⁷) = 6.4×10⁻²¹/2×10⁻²⁷ = 3.2×10⁶ m/s."
  },
  {
    question: "Why is the electric field just outside a charged conductor's surface always perpendicular to the surface?",
    options: [
      "Because any tangential field component would drive charges to move until only the perpendicular component remains",
      "Because all conductor surfaces are perfectly flat and smooth",
      "Because field lines physically repel the conductor's surface",
      "Because conductors carry no surface charge in any configuration"
    ],
    answer: 0,
    explanation: "In electrostatic equilibrium, any tangential field component would exert a force on surface charges, causing them to move until that component vanishes, leaving a purely perpendicular field."
  },
  {
    question: "Calculate the energy dissipated as heat in a 10 Ω resistor carrying 2 A for 30 seconds.",
    options: [
      "20 J",
      "1200 J",
      "600 J",
      "60 J"
    ],
    answer: 1,
    explanation: "P = I²R = 4 × 10 = 40 W. Energy = Pt = 40 × 30 = 1200 J."
  },
  {
    question: "What fundamentally distinguishes radio waves from gamma rays in the electromagnetic spectrum?",
    options: [
      "Gamma rays are not classified as electromagnetic waves",
      "Radio waves cannot propagate through a vacuum unlike other EM waves",
      "Radio waves travel significantly faster than gamma rays in a vacuum",
      "They differ in frequency and wavelength — radio waves have much lower frequency and longer wavelength than gamma rays"
    ],
    answer: 3,
    explanation: "All EM waves travel at c in vacuum; they differ in frequency and wavelength, with radio waves at the low-frequency long-wavelength end and gamma rays at the high-frequency short-wavelength end."
  },
  {
    question: "A toroid has 600 turns, mean radius 0.15 m, and carries a current of 2.5 A. Calculate the magnetic field inside. (μ₀ = 4π × 10⁻⁷ T·m/A)",
    options: [
      "1 × 10⁻³ T",
      "4 × 10⁻³ T",
      "2 × 10⁻³ T",
      "8 × 10⁻³ T"
    ],
    answer: 2,
    explanation: "B = μ₀NI/(2πr) = (4π×10⁻⁷ × 600 × 2.5)/(2π × 0.15) = 6×10⁻⁴/0.3 = 2×10⁻³ T."
  },
  {
    question: "What does it mean when a physicist says the electric field is 'conservative'?",
    options: [
      "The field never changes its magnitude or direction with time",
      "The work done moving a charge between two points is independent of the path taken",
      "The field always points vertically downward toward the ground",
      "The field exists only within conductors and cannot penetrate insulators"
    ],
    answer: 1,
    explanation: "A conservative field is one where the work done between two points depends only on the endpoints, not the path — this allows definition of a scalar electric potential."
  },
  {
    question: "A proton is accelerated from rest through a potential difference of 2000 V. Calculate the final kinetic energy. (q = 1.6 × 10⁻¹⁹ C)",
    options: [
      "1.6 × 10⁻¹⁶ J",
      "8 × 10⁻¹⁷ J",
      "3.2 × 10⁻¹⁶ J",
      "6.4 × 10⁻¹⁶ J"
    ],
    answer: 2,
    explanation: "KE = qV = 1.6×10⁻¹⁹ × 2000 = 3.2×10⁻¹⁶ J."
  },
  {
    question: "Why can't two electric field lines intersect at a single point in space?",
    options: [
      "Because the field at any point has one unique direction; intersection would imply two directions simultaneously",
      "Because intersecting field lines would directly violate Coulomb's law",
      "Because field lines are physical wires that cannot overlap",
      "Because field lines only exist in the vicinity of conductors"
    ],
    answer: 0,
    explanation: "The electric field vector at any point has a single defined direction; if two lines crossed, that point would have two different directions at once, which is physically impossible."
  },
  {
    question: "A wire carries a current of 12 A for 5 minutes. How much charge flows through the wire?",
    options: [
      "60 C",
      "2.4 C",
      "600 C",
      "3600 C"
    ],
    answer: 3,
    explanation: "Q = It = 12 × (5×60) = 12 × 300 = 3600 C."
  },
  {
    question: "A transformer has 200 turns on the primary and 50 on the secondary. If the primary current is 2 A, what is the secondary current (ideal transformer)?",
    options: [
      "2 A",
      "8 A",
      "0.5 A",
      "4 A"
    ],
    answer: 1,
    explanation: "For an ideal transformer, Ip·Np = Is·Ns → Is = Ip×(Np/Ns) = 2×(200/50) = 8 A."
  },
  {
    question: "Which of the following best describes 'polarization' in the context of dielectrics?",
    options: [
      "The separation of positive and negative charge centers within a material due to an external electric field",
      "The process of transferring charge to the surface of a conductor",
      "The complete removal of electrons from the atomic structure of a material",
      "The alignment of magnetic domains within a ferromagnetic material"
    ],
    answer: 0,
    explanation: "Polarization is the slight displacement or alignment of bound charges within a dielectric in response to an external field, creating induced dipole moments throughout the material."
  },
  {
    question: "A 50 μF capacitor is charged to 40 V. Calculate the energy stored.",
    options: [
      "4 J",
      "0.004 J",
      "0.04 J",
      "0.4 J"
    ],
    answer: 2,
    explanation: "U = ½CV² = ½ × 50×10⁻⁶ × 1600 = 0.04 J."
  },
  {
    question: "Why does a changing magnetic flux through a loop induce a current without physical contact?",
    options: [
      "This phenomenon occurs exclusively in superconducting materials",
      "The changing flux directly pushes electrons through empty space",
      "Magnetic fields spontaneously generate current in all nearby materials",
      "The changing magnetic field induces a circulating electric field per Faraday's law, which drives current in any conducting loop present"
    ],
    answer: 3,
    explanation: "A time-varying magnetic field creates a circulating electric field in surrounding space (Faraday's law); a conducting loop in this region has current driven through it by this induced E field."
  },
  {
    question: "Two long parallel wires carry currents of 3 A each in opposite directions, separated by 0.05 m. Calculate the force per unit length and state whether attractive or repulsive. (μ₀ = 4π × 10⁻⁷ T·m/A)",
    options: [
      "3.6 × 10⁻⁵ N/m, attractive",
      "3.6 × 10⁻⁵ N/m, repulsive",
      "1.8 × 10⁻⁵ N/m, repulsive",
      "7.2 × 10⁻⁵ N/m, repulsive"
    ],
    answer: 1,
    explanation: "F/L = μ₀I₁I₂/(2πr) = (2×10⁻⁷×9)/0.05 = 3.6×10⁻⁵ N/m. Opposite direction currents repel."
  },
  {
    question: "Why is the electric field due to an infinite sheet of charge independent of distance from the sheet?",
    options: [
      "Because Gauss's law cannot be applied to planar charge distributions",
      "Because infinite sheets are always made of conducting material",
      "Because the sheet carries zero net charge",
      "Because field lines from an infinite sheet are parallel and don't diverge with distance, unlike those from a point charge"
    ],
    answer: 3,
    explanation: "Field lines from an infinite sheet remain parallel and uniformly spaced regardless of distance, giving constant field E = σ/2ε₀, unlike a point charge where lines spread giving 1/r² dependence."
  },
  {
    question: "A 60 W bulb operates at 120 V. Calculate the resistance of the bulb's filament.",
    options: [
      "120 Ω",
      "0.5 Ω",
      "240 Ω",
      "2 Ω"
    ],
    answer: 2,
    explanation: "P = V²/R → R = V²/P = (120)²/60 = 14400/60 = 240 Ω."
  },
  {
    question: "In a series RLC circuit, what happens to the impedance at very high frequencies well above resonance?",
    options: [
      "It is dominated by the inductive reactance and increases with frequency",
      "It remains constant and independent of frequency",
      "It is dominated by the capacitive reactance",
      "It approaches zero"
    ],
    answer: 0,
    explanation: "At high frequencies, XL = 2πfL grows large while XC = 1/(2πfC) shrinks toward zero, so impedance becomes dominated by inductive reactance and increases with frequency."
  },
  {
    question: "A capacitor with air dielectric has capacitance 8 μF. When filled with a dielectric, capacitance becomes 24 μF. Calculate the dielectric constant.",
    options: [
      "2",
      "4",
      "16",
      "3"
    ],
    answer: 3,
    explanation: "κ = C_new/C_old = 24/8 = 3."
  },
  {
    question: "Which statement correctly describes the behavior of magnetic field lines around a bar magnet?",
    options: [
      "They start at the north pole and terminate at the south pole, never forming closed loops",
      "They radiate outward from both poles infinitely without returning",
      "They leave the north pole, travel to the south pole externally, then continue inside the magnet back to north, forming closed loops",
      "They only exist in the external space and not inside the magnet"
    ],
    answer: 2,
    explanation: "Magnetic field lines have no start or end; they form continuous closed loops, running north to south outside and south to north inside the magnet."
  },
  {
    question: "A coil of 300 turns has magnetic flux changing from 0.002 Wb to 0.008 Wb in 0.2 s. Calculate the induced EMF.",
    options: [
      "30 V",
      "9 V",
      "3 V",
      "0.3 V"
    ],
    answer: 1,
    explanation: "EMF = N(ΔΦ/Δt) = 300 × (0.008−0.002)/0.2 = 300 × 0.03 = 9 V."
  },
  {
    question: "Why does connecting capacitors in parallel increase total capacitance, while series connection decreases it?",
    options: [
      "Parallel connection increases effective plate area for charge storage; series connection increases effective plate separation",
      "Parallel connections always reduce voltage to zero regardless of source",
      "Series connections increase the effective plate area unlike parallel",
      "There is no real practical difference between series and parallel capacitor combinations"
    ],
    answer: 0,
    explanation: "Parallel connection increases effective plate area (each capacitor stores charge at the same voltage), while series increases effective separation — both consistent with C = ε₀A/d."
  },
  {
    question: "A 100 Ω, 200 Ω, and 300 Ω resistor are connected in parallel. Calculate the equivalent resistance (to 1 d.p.).",
    options: [
      "200 Ω",
      "100 Ω",
      "54.5 Ω",
      "600 Ω"
    ],
    answer: 2,
    explanation: "1/R = 1/100 + 1/200 + 1/300 = 11/600. R = 600/11 ≈ 54.5 Ω."
  },
  {
    question: "What is the key insight behind Maxwell's prediction that light itself is an electromagnetic wave?",
    options: [
      "He observed light physically bending around the poles of strong magnets",
      "The speed calculated from his equations (1/√(μ₀ε₀)) matched the experimentally known speed of light exactly",
      "He proved light is a mechanical wave requiring a physical medium like sound",
      "He observed that light has no relation to electric or magnetic fields"
    ],
    answer: 1,
    explanation: "Maxwell found that EM waves must travel at c = 1/√(μ₀ε₀); this matched the measured speed of light so closely he concluded light itself must be an electromagnetic wave."
  },
  {
    question: "A charge of 10 μC is moved from a point at 500 V to a point at 200 V. Calculate the work done by the electric field on the charge.",
    options: [
      "5 × 10⁻³ J",
      "7 × 10⁻³ J",
      "−3 × 10⁻³ J",
      "3 × 10⁻³ J"
    ],
    answer: 3,
    explanation: "W = q(V_initial − V_final) = 10×10⁻⁶ × (500−200) = 10×10⁻⁶ × 300 = 3×10⁻³ J (positive; field does positive work moving positive charge from high to low potential)."
  },
  {
    question: "In an AC circuit containing only a capacitor, what is the phase relationship between current and voltage?",
    options: [
      "Current leads voltage by 90°",
      "Current and voltage are exactly 180° out of phase",
      "Current and voltage are perfectly in phase with each other",
      "Voltage leads current by 90°"
    ],
    answer: 0,
    explanation: "In a purely capacitive AC circuit, the current reaches its maximum a quarter-cycle before the voltage does, so current leads voltage by 90°."
  },
  {
    question: "A wire loop of radius 0.1 m carries a current of 3 A. Calculate the magnetic field at the center of the loop. (μ₀ = 4π × 10⁻⁷ T·m/A)",
    options: [
      "9.42 × 10⁻⁶ T",
      "1.88 × 10⁻⁵ T",
      "3.77 × 10⁻⁵ T",
      "6 × 10⁻⁵ T"
    ],
    answer: 1,
    explanation: "B = μ₀I/(2r) = (4π×10⁻⁷ × 3)/(2×0.1) = 3.77×10⁻⁶/0.2 = 1.88×10⁻⁵ T."
  },
  {
    question: "Which factor does NOT affect the capacitance of a parallel plate capacitor?",
    options: [
      "The amount of charge currently stored on the plates",
      "The area of the plates",
      "The distance between the plates",
      "The dielectric constant of the medium between the plates"
    ],
    answer: 0,
    explanation: "Capacitance C = κε₀A/d depends only on geometry and dielectric medium; it does not depend on the charge currently stored on it."
  },
  {
    question: "A 12 V car battery with internal resistance 0.5 Ω is short-circuited. Calculate the maximum current that flows.",
    options: [
      "6 A",
      "12 A",
      "0.5 A",
      "24 A"
    ],
    answer: 3,
    explanation: "In a short circuit, external resistance ≈ 0, so I = EMF/r = 12/0.5 = 24 A."
  },
  {
    question: "Why does Gauss's law take the form ∮E·dA = Q_enc/ε₀ with ε₀ specifically as the proportionality constant?",
    options: [
      "ε₀ is chosen to make all numerical answers come out to exactly 1",
      "It is an arbitrary definition chosen with no physical basis",
      "ε₀ (permittivity of free space) arises naturally from the fundamental electric force law (Coulomb's law) and reflects the strength of electromagnetic interaction in vacuum",
      "ε₀ is determined solely by the magnetic permeability of the medium"
    ],
    answer: 2,
    explanation: "ε₀ emerges from Coulomb's law (k = 1/4πε₀) and represents the fundamental relationship between electric field and charge in vacuum, making Gauss's law a natural consequence of the inverse-square law."
  },
  {
    question: "What is the fundamental difference between a step-up and a step-down transformer?",
    options: [
      "Both types have identical turn ratios but differ in core material",
      "Step-up transformers only work with DC while step-down work with AC",
      "A step-up transformer has fewer turns on the secondary than the primary; step-down has more turns on secondary",
      "A step-up transformer has more turns on the secondary than the primary, increasing voltage; step-down has fewer, decreasing voltage"
    ],
    answer: 3,
    explanation: "A step-up transformer has more secondary turns than primary (Ns > Np), increasing voltage; a step-down has fewer secondary turns (Ns < Np), decreasing voltage, both governed by Vs/Vp = Ns/Np."
  },
  {
    question: "Why must the electric field be zero inside a conductor under electrostatic conditions, even if the conductor carries a net charge?",
    options: [
      "Because net charge on a conductor neutralizes all internal fields instantly",
      "Because conductors are made of neutral atoms that block electric fields",
      "Because free charges redistribute until their collective field exactly cancels any externally applied field inside, reaching equilibrium",
      "Because conductors absorb all electric field lines that enter them"
    ],
    answer: 2,
    explanation: "Free charges in a conductor respond to any internal field by moving until they create an opposing field that cancels it exactly — equilibrium requires zero net internal field."
  },
  {
    question: "In a purely inductive AC circuit, what is the phase relationship between current and voltage?",
    options: [
      "Voltage leads current by 90°",
      "Current and voltage are exactly 180° out of phase",
      "Current and voltage are perfectly in phase with each other",
      "Current leads voltage by 90°"
    ],
    answer: 0,
    explanation: "In a purely inductive circuit, the voltage across the inductor leads the current through it by 90° (or equivalently, current lags voltage by 90°), due to the inductor opposing changes in current."
  },
  {
    question: "What is the significance of the superposition principle in electrostatics?",
    options: [
      "It only applies when all charges are of equal magnitude",
      "It states that the net electric field from multiple charges equals the vector sum of the individual fields, allowing complex distributions to be analyzed charge by charge",
      "It states that only one charge can exist in a region of space at a time",
      "It states that charges in a system must always cancel to zero"
    ],
    answer: 1,
    explanation: "The superposition principle states that the total electric field from multiple charges is the vector sum of individual contributions, making complex charge distributions tractable by analyzing one charge at a time."
  }
];
const CSC122B = [
  {
    question: "What is the most accurate definition of 'data' in data processing?",
    options: [
      "Raw, unorganized facts and figures",
      "Processed facts arranged for decision-making",
      "Information stored in a database only",
      "A printed report from a computer"
    ],
    answer: 0,
    explanation: "Data refers to raw, unprocessed facts and figures that have not yet been given meaning; once organized and processed, data becomes information."
  },
  {
    question: "Which of the following best distinguishes information from data?",
    options: [
      "Information is always numerical",
      "Information is data that has been processed and given meaning",
      "Data and information mean the same thing",
      "Information cannot be stored on a computer"
    ],
    answer: 1,
    explanation: "Information is the output of processing raw data, structured and given context so it becomes useful for decision-making, unlike data which is raw and unorganized."
  },
  {
    question: "Which of the following is NOT a desirable property of good data?",
    options: [
      "Accuracy",
      "Relevance",
      "Ambiguity",
      "Timeliness"
    ],
    answer: 2,
    explanation: "Good data should be accurate, timely, and relevant; ambiguity means vague or unclear meaning, which is a flaw rather than a desirable quality."
  },
  {
    question: "Which of these is an example of a primary source of data?",
    options: [
      "A government publication of past statistics",
      "A textbook summary",
      "A newspaper report on a survey",
      "Data collected directly through interviews"
    ],
    answer: 3,
    explanation: "Primary data is collected firsthand for a specific purpose, such as through interviews, surveys, or direct observation, unlike secondary data which is gathered from existing sources."
  },
  {
    question: "Which of the following best describes secondary data?",
    options: [
      "Data already collected and published by someone else",
      "Data that is always false",
      "Data collected directly by the researcher",
      "Data obtained only through questionnaires"
    ],
    answer: 0,
    explanation: "Secondary data refers to data that already exists, having been collected by another person or organization for a different original purpose, then reused."
  },
  {
    question: "Which of the following is a common method of data collection?",
    options: [
      "Data validation",
      "Data encryption",
      "Interviews and questionnaires",
      "File compression"
    ],
    answer: 2,
    explanation: "Interviews and questionnaires are standard methods for gathering data directly from respondents; the other options are processing or security operations, not collection methods."
  },
  {
    question: "In the data processing cycle, what does 'origin of data' refer to?",
    options: [
      "The processing software",
      "The point where data is first created or captured",
      "The final printed report",
      "The storage device used"
    ],
    answer: 1,
    explanation: "The origin of data is the initial stage where data first comes into existence, such as when a transaction occurs or an observation is recorded, before any processing."
  },
  {
    question: "What is the main purpose of the data preparation stage?",
    options: [
      "To distribute finished reports",
      "To delete unnecessary files",
      "To design computer hardware",
      "To organize and convert raw data into a form suitable for processing"
    ],
    answer: 3,
    explanation: "Data preparation involves collecting, verifying, and converting raw data into a format the processing system can work with efficiently."
  },
  {
    question: "Which of the following best describes the output stage of data processing?",
    options: [
      "The stage where files are deleted",
      "The stage where processed information is presented to the user",
      "The stage where data is encrypted",
      "The point where raw data is first collected"
    ],
    answer: 1,
    explanation: "The output stage is where processed data, now meaningful information, is presented to the end user in usable form, such as a report or display."
  },
  {
    question: "Which data processing method relies entirely on human effort without machines?",
    options: [
      "Manual method",
      "Automatic method",
      "Electronic method",
      "Mechanical method"
    ],
    answer: 0,
    explanation: "The manual method involves performing all processing tasks by hand, without mechanical or electronic assistance."
  },
  {
    question: "Which method uses devices like calculators and typewriters, but not electronic computers?",
    options: [
      "Manual method",
      "Real-time method",
      "Mechanical method",
      "Automatic method"
    ],
    answer: 2,
    explanation: "The mechanical method uses simple mechanical or electromechanical devices to assist processing, sitting between manual and electronic processing."
  },
  {
    question: "Which method uses computers to process data at high speed with minimal manual intervention?",
    options: [
      "Electronic method",
      "Batch method",
      "Mechanical method",
      "Manual method"
    ],
    answer: 0,
    explanation: "The electronic method uses computers to process data, offering greater speed and accuracy than manual or mechanical approaches."
  },
  {
    question: "What best describes automatic data processing?",
    options: [
      "Processing done only once a year",
      "Processing that needs constant manual recalculation",
      "Processing that, once set up, runs with little ongoing human input",
      "Processing that avoids using computers"
    ],
    answer: 2,
    explanation: "Automatic data processing refers to systems that carry out tasks on their own once initiated, requiring minimal further human intervention."
  },
  {
    question: "Which processing style collects data over time and processes it all together later?",
    options: [
      "Time-sharing processing",
      "Online processing",
      "Real-time processing",
      "Batch processing"
    ],
    answer: 3,
    explanation: "Batch processing accumulates data over a period and processes the entire batch together at a scheduled time, rather than immediately."
  },
  {
    question: "Which processing style allows data to be entered and processed immediately as it occurs?",
    options: [
      "Batch processing",
      "Online processing",
      "Distributed processing",
      "Multiprogramming"
    ],
    answer: 1,
    explanation: "Online processing allows data to be input and processed immediately, giving direct interactive access rather than waiting for a scheduled run."
  },
  {
    question: "Which processing style lets multiple users share a system by rapidly switching between their tasks?",
    options: [
      "Time-sharing processing",
      "Batch processing",
      "Multitasking",
      "Real-time processing"
    ],
    answer: 0,
    explanation: "Time-sharing divides CPU time among multiple users in quick succession, giving each the impression of dedicated access."
  },
  {
    question: "Which processing style requires output fast enough to influence the process it monitors, such as air traffic control?",
    options: [
      "Multiprocessing",
      "Distributed processing",
      "Batch processing",
      "Real-time processing"
    ],
    answer: 3,
    explanation: "Real-time processing demands immediate handling of input, with responses fast enough to affect the system being controlled."
  },
  {
    question: "What is the key feature of distributed processing?",
    options: [
      "Only one user can access it at a time",
      "Tasks are spread across multiple connected computers",
      "All processing happens on one machine",
      "Data cannot be shared between systems"
    ],
    answer: 1,
    explanation: "Distributed processing spreads tasks across multiple interconnected computers, often in different locations, working together on a common goal."
  },
  {
    question: "What does multiprogramming refer to?",
    options: [
      "Running one program on many computers",
      "Writing programs in several languages",
      "One CPU holding multiple programs in memory and switching between them",
      "Using several monitors for one program"
    ],
    answer: 2,
    explanation: "Multiprogramming allows several programs to reside in memory at once, with the CPU switching between them to maximize utilization while one waits for input/output."
  },
  {
    question: "What distinguishes multiprocessing from multiprogramming?",
    options: [
      "Multiprocessing only works with one program at a time",
      "Multiprocessing uses two or more CPUs working simultaneously, while multiprogramming uses one CPU switching tasks",
      "Multiprocessing cannot run on modern computers",
      "They are exactly the same concept"
    ],
    answer: 1,
    explanation: "Multiprocessing involves two or more processors executing instructions simultaneously, whereas multiprogramming uses a single CPU that rapidly switches between multiple programs."
  },
  {
    question: "What does multitasking generally refer to in computing?",
    options: [
      "A single user running several applications seemingly at once on one system",
      "Backup of data across devices",
      "A network of distributed servers",
      "Several users sharing one file"
    ],
    answer: 0,
    explanation: "Multitasking is the ability of an operating system to let a single user run multiple applications or tasks concurrently, with the CPU rapidly switching between them."
  },
  {
    question: "Which of the following best defines a 'computer file'?",
    options: [
      "A physical storage device",
      "A single character stored temporarily",
      "A collection of related records stored together under a common name",
      "A type of software application"
    ],
    answer: 2,
    explanation: "A computer file is an organized collection of related records or data stored together and identified by a unique name, allowing it to be retrieved and managed as a unit."
  },
  {
    question: "Which of the following is a type of computer file based on its content?",
    options: [
      "Indexed file",
      "Direct file",
      "Sequential file",
      "Master file"
    ],
    answer: 3,
    explanation: "Master files, transaction files, and reference files are classified by content/purpose; sequential, direct, and indexed files are classified by organization method, not content type."
  },
  {
    question: "What is a 'master file' in file processing?",
    options: [
      "A file that holds relatively permanent, ongoing records that are periodically updated",
      "A temporary file deleted after each use",
      "A file used solely for backup purposes",
      "A file containing only error logs"
    ],
    answer: 0,
    explanation: "A master file contains relatively permanent data about an entity (such as customer or employee records) that is periodically updated with new transactions."
  },
  {
    question: "What is a 'transaction file' used for?",
    options: [
      "Holding backup copies of software",
      "Storing permanent records that never change",
      "Storing only system error messages",
      "Temporarily holding data about current transactions before it updates the master file"
    ],
    answer: 3,
    explanation: "A transaction file holds data related to day-to-day activities or transactions, which is later used to update the corresponding master file."
  },
  {
    question: "What does 'file processing' primarily involve?",
    options: [
      "Designing computer hardware",
      "Writing programming languages",
      "Creating, updating, retrieving, and maintaining data stored in files",
      "Physically manufacturing storage devices"
    ],
    answer: 2,
    explanation: "File processing encompasses the operations performed on files, including creating, reading, updating, deleting, and maintaining records stored within them."
  },
  {
    question: "Which of the following is a common file processing operation?",
    options: [
      "Installing an operating system",
      "Sorting records into a particular order",
      "Designing a keyboard layout",
      "Manufacturing circuit boards"
    ],
    answer: 1,
    explanation: "Sorting is a standard file processing activity used to arrange records in a specific order to facilitate easier searching and processing."
  },
  {
    question: "What does 'file organization' refer to?",
    options: [
      "The physical location of the computer in a room",
      "The brand of the storage device used",
      "The color-coding system for folders",
      "The way records are logically arranged and stored within a file for efficient access"
    ],
    answer: 3,
    explanation: "File organization refers to the method used to structure and store records within a file, which determines how efficiently data can be accessed, updated, or retrieved."
  },
  {
    question: "In sequential file organization, how are records typically stored and accessed?",
    options: [
      "Records can be accessed randomly in any order instantly",
      "Records are stored and accessed in a particular order, one after another",
      "Records are stored based on a mathematical hash function only",
      "Records have no defined storage order at all"
    ],
    answer: 1,
    explanation: "In sequential file organization, records are stored one after another in a specific order and must generally be accessed in that same sequence."
  },
  {
    question: "What is a key characteristic of direct (random) file organization?",
    options: [
      "It is only usable with paper-based files",
      "Records must always be read from the beginning of the file",
      "Records can be accessed directly using their address or key, without reading previous records",
      "It requires records to be sorted alphabetically first"
    ],
    answer: 2,
    explanation: "Direct (or random) file organization allows records to be accessed immediately using their storage address or a key value, without needing to sequentially read through preceding records."
  },
  {
    question: "What is the main advantage of indexed sequential file organization?",
    options: [
      "It allows both sequential processing and direct access via an index, combining benefits of both methods",
      "It requires no key field",
      "It eliminates the need for any index at all",
      "It can only be used for very small files"
    ],
    answer: 0,
    explanation: "Indexed sequential organization maintains records in sequential order while also providing an index, allowing for both efficient sequential processing and quick direct access to individual records."
  },
  {
    question: "Which of the following best describes a 'data processing environment'?",
    options: [
      "The physical temperature of a computer room",
      "The overall setup of hardware, software, people, and procedures involved in processing data within an organization",
      "The brand of computer used exclusively",
      "Only the software installed on a single computer"
    ],
    answer: 1,
    explanation: "A data processing environment encompasses all the resources — hardware, software, personnel, procedures, and data — that work together within an organization to process data effectively."
  },
  {
    question: "Which of the following is typically a stage in the data processing cycle?",
    options: [
      "Installation, Configuration, Removal",
      "Compilation, Debugging, Execution",
      "Input, Processing, Output",
      "Login, Browse, Logout"
    ],
    answer: 2,
    explanation: "The standard data processing cycle consists of three basic stages: Input (data entry), Processing (transformation of data), and Output (presentation of results as information)."
  },
  {
    question: "What is the primary role of 'storage' in the data processing cycle?",
    options: [
      "To retain data and information for future use or reference",
      "To physically print documents",
      "To permanently discard unused data",
      "To convert data into sound only"
    ],
    answer: 0,
    explanation: "Storage in the data processing cycle serves to hold data and processed information so that it can be retrieved and used again in the future."
  },
  {
    question: "Which of the following best describes a 'field' in the context of a computer file?",
    options: [
      "A complete file containing thousands of entries",
      "An entire collection of related records",
      "A backup copy of the whole database",
      "The smallest unit of data representing a single characteristic, such as a name or age"
    ],
    answer: 3,
    explanation: "A field is the smallest logical unit of data in a file, representing a single characteristic or attribute within a record."
  },
  {
    question: "What is a 'record' in file terminology?",
    options: [
      "The entire database system",
      "A collection of related fields treated as a single unit, representing one entity",
      "A physical disk drive",
      "A single character stored in memory"
    ],
    answer: 1,
    explanation: "A record is a collection of related fields grouped together to represent all the information about a single entity, such as one employee or one customer."
  },
  {
    question: "Which of the following correctly orders file structure from smallest to largest unit?",
    options: [
      "Character, Field, Record, File",
      "File, Record, Field, Character",
      "Field, Character, File, Record",
      "Record, File, Character, Field"
    ],
    answer: 0,
    explanation: "The hierarchy of data organization goes from character (smallest) to field, then to record, and finally to file (the largest collective unit)."
  },
  {
    question: "What is the primary purpose of 'data validation' during data processing?",
    options: [
      "To convert data into a foreign language",
      "To make data processing slower",
      "To delete all incorrect data permanently without review",
      "To check that data entered meets certain rules or criteria before processing, reducing errors"
    ],
    answer: 3,
    explanation: "Data validation involves checking that input data conforms to predefined rules or formats before it is accepted for processing, helping to catch errors early."
  },
  {
    question: "Which of the following is an example of a 'manual' data processing activity?",
    options: [
      "Running a batch program overnight",
      "Using an automated teller machine (ATM)",
      "Recording sales transactions by hand in a ledger book",
      "Using a computer spreadsheet to calculate totals"
    ],
    answer: 2,
    explanation: "Recording transactions by hand in a ledger, without any mechanical or electronic assistance, is a classic example of manual data processing."
  },
  {
    question: "Which processing style would be most appropriate for a payroll system that processes employee salaries once every month?",
    options: [
      "Batch processing",
      "Real-time processing",
      "Online processing",
      "Time-sharing processing"
    ],
    answer: 0,
    explanation: "Payroll is typically processed periodically after accumulating data, making batch processing the most suitable and efficient method."
  },
  {
    question: "Which processing style would be most appropriate for an airline seat reservation system?",
    options: [
      "Mechanical processing",
      "Real-time processing",
      "Manual processing",
      "Batch processing"
    ],
    answer: 1,
    explanation: "An airline reservation system needs to immediately reflect seat availability to prevent double-booking, requiring real-time processing so that each booking updates the system instantly."
  },
  {
    question: "What is the main difference between online processing and real-time processing?",
    options: [
      "They are identical with no difference",
      "Real-time processing cannot use computers",
      "Online processing is always slower than batch processing",
      "Real-time processing requires immediate response within a strict time constraint, while online processing simply means direct interactive access"
    ],
    answer: 3,
    explanation: "While both involve direct interaction, real-time processing has a strict requirement that output be produced within a specific time frame to control a process, whereas online simply means direct interactive access."
  },
  {
    question: "Which of the following best explains why batch processing is often more efficient for large volumes of routine data?",
    options: [
      "It can only handle one record at a time",
      "It requires constant human supervision throughout",
      "It processes many records together at once, reducing overhead compared to handling each one individually",
      "It always requires more computing power than real-time processing"
    ],
    answer: 2,
    explanation: "By grouping many similar transactions and processing them together in one run, batch processing reduces repeated overhead, making it efficient for large routine workloads."
  },
  {
    question: "What does 'data integrity' refer to in a data processing system?",
    options: [
      "The color scheme of the user interface",
      "The accuracy, consistency, and reliability of data throughout its lifecycle",
      "The physical size of the storage device",
      "The speed at which data is processed"
    ],
    answer: 1,
    explanation: "Data integrity refers to maintaining the accuracy, consistency, and trustworthiness of data over its entire lifecycle, ensuring it remains unaltered and reliable."
  },
  {
    question: "Which of the following is considered an advantage of electronic data processing over manual methods?",
    options: [
      "Lower initial equipment cost",
      "No need for trained personnel",
      "Complete immunity to all errors",
      "Greater speed and accuracy in handling large volumes of data"
    ],
    answer: 3,
    explanation: "Electronic data processing can handle vastly larger volumes of data with much greater speed and accuracy than manual methods, though it does require investment and trained personnel."
  },
  {
    question: "What is a key characteristic of 'multiprocessing' systems?",
    options: [
      "They use two or more processors that can execute instructions concurrently, improving overall system performance",
      "They can only run one program at a time",
      "They eliminate the need for memory",
      "They use a single processor exclusively"
    ],
    answer: 0,
    explanation: "Multiprocessing systems use two or more CPUs working together, allowing multiple instructions to be executed simultaneously, increasing overall throughput."
  },
  {
    question: "In which situation would real-time processing be essential rather than optional?",
    options: [
      "Printing annual financial summaries",
      "Archiving old employee records",
      "Controlling a nuclear reactor where instant monitoring and response is critical",
      "Generating quarterly reports from stored data"
    ],
    answer: 2,
    explanation: "Nuclear reactor control requires immediate processing of sensor data and responses within extremely tight time constraints, making real-time processing not just preferred but essential."
  },
  {
    question: "Which of these file types is specifically designed to record system events for monitoring or troubleshooting?",
    options: [
      "Log file",
      "Master file",
      "Backup file",
      "Transaction file"
    ],
    answer: 0,
    explanation: "A log file is a special-purpose file used to record events, errors, or activities occurring within a system, primarily for monitoring or troubleshooting purposes."
  },
  {
    question: "The process of combining two or more sorted files into one larger sorted file is called:",
    options: [
      "Partitioning",
      "Sorting",
      "Merging",
      "Indexing"
    ],
    answer: 2,
    explanation: "Merging is the process of combining two or more already-sorted files into a single sorted file, often used in batch processing to consolidate related data."
  },
  {
    question: "What does the term 'data lifecycle' refer to?",
    options: [
      "The speed of a storage device",
      "The stages data goes through from creation to deletion, including collection, processing, storage, and disposal",
      "The number of users who access a file",
      "The time it takes to back up a single file"
    ],
    answer: 1,
    explanation: "The data lifecycle covers all stages a piece of data passes through: creation or capture, processing, storage, use, and eventual deletion or archiving."
  },
  {
    question: "Which of the following best explains the role of an index in indexed sequential file organization?",
    options: [
      "It prevents unauthorized access to records",
      "It compresses records to save space",
      "It deletes redundant records automatically",
      "It provides key-based pointers to record locations, enabling fast direct access without full sequential scanning"
    ],
    answer: 3,
    explanation: "An index stores key values and their corresponding record locations, allowing the system to jump directly to a specific record rather than scanning the entire file sequentially."
  }
];
const CSC122C = [
  {
    question: "Which term best describes facts and figures that have not yet been processed or interpreted?",
    options: [
      "Information",
      "Data",
      "Knowledge",
      "Report"
    ],
    answer: 1,
    explanation: "Data is the raw, unprocessed form of facts and figures before any organization or interpretation is applied to give it meaning."
  },
  {
    question: "What condition must be met before data can be considered 'information'?",
    options: [
      "It must be processed and given context",
      "It must be numerical in nature",
      "It must be stored on a hard drive",
      "It must be written by an expert"
    ],
    answer: 0,
    explanation: "Data becomes information only after it has been processed, organized, and given meaningful context that makes it useful for decision-making."
  },
  {
    question: "Which property ensures that data reflects the true state of what it represents?",
    options: [
      "Speed",
      "Format",
      "Accuracy",
      "Volume"
    ],
    answer: 2,
    explanation: "Accuracy is the property ensuring that data correctly reflects the real facts or values it is meant to represent, free from errors."
  },
  {
    question: "Which property of data refers to it being available when needed for decision-making?",
    options: [
      "Consistency",
      "Timeliness",
      "Compression",
      "Redundancy"
    ],
    answer: 1,
    explanation: "Timeliness refers to data being up-to-date and available at the time it is needed, since outdated data loses much of its value for decisions."
  },
  {
    question: "Data gathered directly from an experiment conducted by the researcher is classified as:",
    options: [
      "Tertiary data",
      "Compiled data",
      "Archived data",
      "Primary data"
    ],
    answer: 3,
    explanation: "Data collected firsthand by the researcher, such as through an experiment, survey, or direct observation, is classified as primary data."
  },
  {
    question: "Which term describes data obtained from a source that already processed it for another purpose?",
    options: [
      "Secondary data",
      "Sample data",
      "Field data",
      "Live data"
    ],
    answer: 0,
    explanation: "Secondary data is data that has already been collected and possibly processed by someone else for a different original purpose, then reused by another party."
  },
  {
    question: "Which of these is a widely used tool for gathering opinions from a large group of people?",
    options: [
      "Spreadsheet",
      "Compiler",
      "Questionnaire",
      "Debugger"
    ],
    answer: 2,
    explanation: "A questionnaire is a structured set of written questions used to collect data or opinions from a large number of respondents efficiently."
  },
  {
    question: "Observing and recording events as they naturally happen, without interference, is called:",
    options: [
      "Extraction",
      "Observation",
      "Aggregation",
      "Simulation"
    ],
    answer: 1,
    explanation: "Observation involves watching and recording events or behaviors as they naturally occur, without manipulating the situation."
  },
  {
    question: "The stage where data is first generated or captured is known as the:",
    options: [
      "Origin of data",
      "Storage stage",
      "Output stage",
      "Retrieval stage"
    ],
    answer: 0,
    explanation: "The origin of data is the point at which data first comes into existence, such as when a transaction takes place or a measurement is taken."
  },
  {
    question: "Verifying and converting raw data into a usable format before processing is called:",
    options: [
      "Data archiving",
      "Data destination",
      "Data encryption",
      "Data preparation"
    ],
    answer: 3,
    explanation: "Data preparation involves checking, organizing, and converting raw data into a suitable format that a processing system can accept."
  },
  {
    question: "The stage where processed results are delivered to the end user is called the:",
    options: [
      "Destination stage",
      "Coding stage",
      "Collection stage",
      "Input stage"
    ],
    answer: 0,
    explanation: "The destination stage is where the final processed information reaches its intended recipient, completing the data processing cycle."
  },
  {
    question: "A data processing method that uses no machines of any kind is known as the:",
    options: [
      "Automatic method",
      "Digital method",
      "Manual method",
      "Electronic method"
    ],
    answer: 2,
    explanation: "The manual method relies entirely on human effort, without the use of any mechanical or electronic devices, to process data."
  },
  {
    question: "A processing method that uses devices like adding machines but not computers is the:",
    options: [
      "Real-time method",
      "Mechanical method",
      "Batch method",
      "Electronic method"
    ],
    answer: 1,
    explanation: "The mechanical method uses simple devices such as calculators or adding machines to assist processing, without involving full electronic computers."
  },
  {
    question: "The processing method that uses computers for high-speed, accurate data handling is the:",
    options: [
      "Manual method",
      "Mechanical method",
      "Paper-based method",
      "Electronic method"
    ],
    answer: 3,
    explanation: "The electronic method uses computers and related technology to process data with high speed, accuracy, and efficiency compared to earlier methods."
  },
  {
    question: "A system designed to operate with minimal human intervention once configured is described as:",
    options: [
      "Sequential",
      "Automatic",
      "Mechanical",
      "Manual"
    ],
    answer: 1,
    explanation: "An automatic system, once properly set up, performs its tasks largely on its own, requiring little further human input during operation."
  },
  {
    question: "Accumulating data over time and processing it together at intervals describes:",
    options: [
      "Time-sharing processing",
      "Real-time processing",
      "Batch processing",
      "Online processing"
    ],
    answer: 2,
    explanation: "Batch processing gathers data over a period and processes the entire collection together at a scheduled time, rather than immediately."
  },
  {
    question: "Processing that occurs immediately as data is entered, with direct system access, is called:",
    options: [
      "Online processing",
      "Batch processing",
      "Distributed processing",
      "Multiprogramming"
    ],
    answer: 0,
    explanation: "Online processing allows data to be entered and processed right away, giving the user direct, interactive access to the system."
  },
  {
    question: "A system where several users share CPU time in rapid rotation is known as:",
    options: [
      "Multitasking",
      "Batch processing",
      "Real-time processing",
      "Time-sharing processing"
    ],
    answer: 3,
    explanation: "Time-sharing allocates small slices of CPU time to multiple users in quick succession, giving each the appearance of simultaneous access."
  },
  {
    question: "Processing that must respond within a strict time limit to control an ongoing process is:",
    options: [
      "Real-time processing",
      "Batch processing",
      "Multiprocessing",
      "Distributed processing"
    ],
    answer: 0,
    explanation: "Real-time processing requires that data be processed and a response generated fast enough to influence or control the process being monitored."
  },
  {
    question: "Spreading processing tasks across several interconnected computers describes:",
    options: [
      "Sequential processing",
      "Centralized processing",
      "Distributed processing",
      "Manual processing"
    ],
    answer: 2,
    explanation: "Distributed processing divides workloads across multiple connected computers, often in different physical locations, working cooperatively."
  },
  {
    question: "Allowing a single CPU to hold several programs in memory and switch between them is called:",
    options: [
      "Time-slicing only",
      "Multiprogramming",
      "Multitasking",
      "Multiprocessing"
    ],
    answer: 1,
    explanation: "Multiprogramming enables a single processor to keep multiple programs in memory simultaneously, switching between them to maximize CPU usage."
  },
  {
    question: "The use of two or more processors executing tasks at the same time is known as:",
    options: [
      "Batch processing",
      "Multiprogramming",
      "Sequential processing",
      "Multiprocessing"
    ],
    answer: 3,
    explanation: "Multiprocessing involves two or more CPUs working simultaneously on different tasks, increasing overall processing throughput."
  },
  {
    question: "A single user running several applications concurrently on one system describes:",
    options: [
      "Batch processing",
      "Multitasking",
      "Real-time processing",
      "Distributed processing"
    ],
    answer: 1,
    explanation: "Multitasking allows one user to operate multiple applications at once on a single system, with the CPU switching rapidly between them."
  },
  {
    question: "A named, organized collection of related records stored together is called a:",
    options: [
      "Byte",
      "Index",
      "Field",
      "File"
    ],
    answer: 3,
    explanation: "A file is a structured collection of related records stored under a common name, allowing the data to be managed and retrieved as a unit."
  },
  {
    question: "A file containing fairly permanent records that are periodically updated is called a:",
    options: [
      "Master file",
      "Backup file",
      "Log file",
      "Transaction file"
    ],
    answer: 0,
    explanation: "A master file stores relatively permanent information about an entity, such as customer details, which is periodically updated as new data arrives."
  },
  {
    question: "A file that temporarily holds current activity data before it updates a permanent file is a:",
    options: [
      "Reference file",
      "Master file",
      "Transaction file",
      "Archive file"
    ],
    answer: 2,
    explanation: "A transaction file holds records of recent activities or events, which are later used to update the corresponding master file."
  },
  {
    question: "Creating, retrieving, updating, and maintaining data within files is collectively known as:",
    options: [
      "File compression",
      "File processing",
      "File encryption",
      "File organization"
    ],
    answer: 1,
    explanation: "File processing refers to the set of operations performed on stored files, including creation, retrieval, updating, and general maintenance."
  },
  {
    question: "Arranging records into a specific sequence, such as alphabetical order, is called:",
    options: [
      "Formatting",
      "Indexing",
      "Merging",
      "Sorting"
    ],
    answer: 3,
    explanation: "Sorting is the process of arranging records within a file into a particular order, typically based on a key field, to aid access and processing."
  },
  {
    question: "The method used to logically arrange and store records within a file is called:",
    options: [
      "File security",
      "File compression",
      "File organization",
      "File duplication"
    ],
    answer: 2,
    explanation: "File organization refers to the technique used to structure and store records so that they can be efficiently accessed, retrieved, and updated."
  },
  {
    question: "In this file organization type, records are stored and read one after another in order:",
    options: [
      "Sequential organization",
      "Random organization",
      "Direct organization",
      "Indexed organization"
    ],
    answer: 0,
    explanation: "Sequential file organization stores records one after another, typically ordered by a key field, and requires reading through them in that same order."
  },
  {
    question: "This file organization allows immediate access to a record using its address, without reading prior records:",
    options: [
      "Sequential organization",
      "Batch organization",
      "Manual organization",
      "Direct organization"
    ],
    answer: 3,
    explanation: "Direct (random) organization allows a record to be accessed immediately via its storage address or key, bypassing the need to read preceding records."
  },
  {
    question: "This file organization combines an index with sequential storage to allow both types of access:",
    options: [
      "Direct organization",
      "Indexed sequential organization",
      "Hierarchical organization",
      "Batch organization"
    ],
    answer: 1,
    explanation: "Indexed sequential organization keeps records in order while also maintaining an index, enabling both sequential reading and fast direct access."
  },
  {
    question: "The overall setup of hardware, software, people, and procedures used to process data in an organization is called the:",
    options: [
      "File structure",
      "Input medium",
      "Data processing environment",
      "Processing cycle"
    ],
    answer: 2,
    explanation: "The data processing environment includes all the combined resources — hardware, software, staff, and procedures — used within an organization to carry out data processing."
  },
  {
    question: "The three basic stages of the data processing cycle are:",
    options: [
      "Input, Processing, Output",
      "Design, Test, Deploy",
      "Collect, Sort, Delete",
      "Compile, Link, Run"
    ],
    answer: 0,
    explanation: "The standard data processing cycle consists of Input (entering data), Processing (transforming it), and Output (presenting the resulting information)."
  },
  {
    question: "Retaining data or information so it can be used again later is the function of:",
    options: [
      "Formatting",
      "Transmission",
      "Storage",
      "Deletion"
    ],
    answer: 2,
    explanation: "Storage retains data and processed information for future retrieval and use, rather than discarding it after a single processing run."
  },
  {
    question: "The smallest unit of data representing a single characteristic, such as a name, is called a:",
    options: [
      "Byte",
      "Field",
      "File",
      "Record"
    ],
    answer: 1,
    explanation: "A field is the smallest meaningful unit of data, representing one specific attribute, such as an age or a name, within a record."
  },
  {
    question: "A group of related fields treated as a single unit, representing one entity, is called a:",
    options: [
      "Record",
      "File",
      "Database",
      "Directory"
    ],
    answer: 0,
    explanation: "A record is a collection of related fields grouped together to represent complete information about a single entity, such as one student or one product."
  },
  {
    question: "Which sequence correctly represents the file structure hierarchy from smallest to largest?",
    options: [
      "File, Record, Field, Character",
      "Field, File, Character, Record",
      "Record, Character, Field, File",
      "Character, Field, Record, File"
    ],
    answer: 3,
    explanation: "Data organization progresses from the smallest unit, a character, up through field, record, and finally to file as the largest structure."
  },
  {
    question: "Checking that entered data meets required rules before it is accepted for processing is called:",
    options: [
      "Data validation",
      "Data replication",
      "Data archiving",
      "Data indexing"
    ],
    answer: 0,
    explanation: "Data validation checks that input data conforms to predefined rules or formats before being accepted, helping to catch errors early in processing."
  },
  {
    question: "Recording daily sales transactions by hand in a ledger book is an example of:",
    options: [
      "Automatic processing",
      "Distributed processing",
      "Manual processing",
      "Electronic processing"
    ],
    answer: 2,
    explanation: "Writing transactions by hand, without any mechanical or electronic aid, is a classic example of the manual data processing method."
  },
  {
    question: "Which processing style is most suitable for generating monthly utility bills for thousands of customers?",
    options: [
      "Real-time processing",
      "Time-sharing processing",
      "Online processing",
      "Batch processing"
    ],
    answer: 3,
    explanation: "Generating bills monthly for many customers at once, after accumulating usage data, is a routine, large-volume task well-suited to batch processing."
  },
  {
    question: "Which processing style is most appropriate for a hospital's patient monitoring system?",
    options: [
      "Manual processing",
      "Real-time processing",
      "Batch processing",
      "Mechanical processing"
    ],
    answer: 1,
    explanation: "Patient monitoring requires immediate detection and response to changes in vital signs, which demands real-time processing to ensure timely alerts."
  },
  {
    question: "What primarily distinguishes online processing from real-time processing?",
    options: [
      "They are the same with no distinction",
      "Online processing cannot use a computer",
      "Real-time processing is always slower",
      "Real-time has a strict response deadline, while online mainly means direct interactive access"
    ],
    answer: 3,
    explanation: "Both involve direct interaction, but real-time processing has a strict time constraint for response to control a process, while online simply means immediate interactive access without such strict timing."
  },
  {
    question: "Why is batch processing often efficient for handling large volumes of routine, similar transactions?",
    options: [
      "It requires constant manual checking of each record",
      "It processes many records together, reducing repeated setup overhead",
      "It always demands more computing power than real-time methods",
      "It can process only a single record per session"
    ],
    answer: 1,
    explanation: "Grouping many similar transactions together for one processing run reduces the repeated overhead of starting and stopping for each individual item, making batch processing efficient for large routine workloads."
  },
  {
    question: "Maintaining the accuracy and consistency of data throughout its lifecycle is referred to as:",
    options: [
      "Data variety",
      "Data velocity",
      "Data integrity",
      "Data volume"
    ],
    answer: 2,
    explanation: "Data integrity refers to the accuracy, consistency, and trustworthiness of data as it is stored, transferred, and processed over time."
  },
  {
    question: "Which is a genuine advantage of electronic data processing over manual methods?",
    options: [
      "It processes large volumes of data with greater speed and accuracy",
      "It needs no initial setup cost",
      "It requires no trained staff at all",
      "It is completely free of any errors"
    ],
    answer: 0,
    explanation: "Electronic data processing can handle much larger volumes of data far more quickly and accurately than manual methods, though it still requires investment and skilled personnel."
  },
  {
    question: "Withdrawing money from an ATM, with the transaction processed immediately, is an example of:",
    options: [
      "Manual processing",
      "Distributed archiving",
      "Batch processing",
      "Online processing"
    ],
    answer: 3,
    explanation: "An ATM transaction is entered and processed right away in an interactive manner, which is characteristic of online data processing."
  },
  {
    question: "A key reason organizations adopt distributed processing over a single centralized system is to:",
    options: [
      "Reduce the risk of a single point of failure and process data closer to its source",
      "Guarantee lower costs regardless of scale",
      "Avoid using any network connections",
      "Rely entirely on one computer for all tasks"
    ],
    answer: 0,
    explanation: "Distributed processing spreads workloads across multiple systems, reducing dependence on a single machine and allowing processing to occur closer to where data originates."
  },
  {
    question: "The overall goal of data processing can best be summarized as:",
    options: [
      "Making raw data more complex and confusing",
      "Turning raw data into accurate, useful information for decisions",
      "Removing the need for any human judgment",
      "Storing data permanently without any future use"
    ],
    answer: 1,
    explanation: "Data processing exists fundamentally to transform raw, unorganized data into meaningful, accurate information that supports effective decision-making."
  },
  {
    question: "A report file used to record system events or errors for later review is typically called a:",
    options: [
      "Master file",
      "Sequential file",
      "Log file",
      "Index file"
    ],
    answer: 2,
    explanation: "A log file is a special-purpose file used to record events, errors, or activities occurring within a system, primarily for monitoring or troubleshooting purposes."
  }
];
const CSC122D = [
  {
    question: "Facts and figures that carry no meaning until they are organized are referred to as:",
    options: [
      "Reports",
      "Data",
      "Knowledge",
      "Statistics"
    ],
    answer: 1,
    explanation: "Data consists of raw facts and figures that have no inherent meaning until they are organized, processed, and interpreted."
  },
  {
    question: "What must happen to data before it can support a business decision?",
    options: [
      "It must be processed into information",
      "It must be printed on paper",
      "It must be translated into another language",
      "It must be deleted after use"
    ],
    answer: 0,
    explanation: "Raw data must first be processed and given context, becoming information, before it can meaningfully support decision-making."
  },
  {
    question: "Which property of data ensures that the same figure is recorded the same way across all records?",
    options: [
      "Speed",
      "Consistency",
      "Volume",
      "Complexity"
    ],
    answer: 1,
    explanation: "Consistency ensures that data values are represented uniformly across records, avoiding contradictions or mismatches in the same dataset."
  },
  {
    question: "Which property refers to data being free from unnecessary or irrelevant details for the task at hand?",
    options: [
      "Latency",
      "Duplication",
      "Relevance",
      "Redundancy"
    ],
    answer: 2,
    explanation: "Relevance means the data collected is pertinent and directly useful for the specific purpose or decision it is meant to support."
  },
  {
    question: "Data collected by a student directly through a lab experiment is an example of:",
    options: [
      "Published data",
      "Historical data",
      "Secondary data",
      "Primary data"
    ],
    answer: 3,
    explanation: "Data gathered firsthand through direct experimentation or observation by the researcher is classified as primary data."
  },
  {
    question: "A researcher using population figures published years earlier by a government agency is using:",
    options: [
      "Secondary data",
      "Primary data",
      "Live data",
      "Sample data"
    ],
    answer: 0,
    explanation: "Data that was already collected and published by another party for a different original purpose, and is now reused, is secondary data."
  },
  {
    question: "Which method involves asking people direct questions face-to-face or by phone to gather data?",
    options: [
      "Extraction",
      "Compilation",
      "Interview",
      "Simulation"
    ],
    answer: 2,
    explanation: "An interview is a data collection method involving direct verbal questioning of respondents, either in person or remotely."
  },
  {
    question: "Watching customer behavior in a store without interacting with them is an example of:",
    options: [
      "Archiving",
      "Observation",
      "Sampling",
      "Interviewing"
    ],
    answer: 1,
    explanation: "Observation involves recording behavior or events as they naturally occur, without direct interference or interaction with the subjects."
  },
  {
    question: "The point at which data is first created, such as during a sales transaction, is called the:",
    options: [
      "Origin",
      "Destination",
      "Index point",
      "Checkpoint"
    ],
    answer: 0,
    explanation: "The origin is the initial stage in the data processing cycle where data first comes into existence, before any processing takes place."
  },
  {
    question: "Organizing and converting raw data into a form a computer can accept is called:",
    options: [
      "Data destination",
      "Data disposal",
      "Data replication",
      "Data preparation"
    ],
    answer: 3,
    explanation: "Data preparation involves checking, coding, and converting raw data so it is in a suitable format for input into a processing system."
  },
  {
    question: "The point where finished information reaches the person who requested it is the:",
    options: [
      "Destination",
      "Origin",
      "Coding stage",
      "Collection point"
    ],
    answer: 0,
    explanation: "The destination is the final stage of the data processing cycle, where the processed output reaches its intended user."
  },
  {
    question: "A processing approach that uses no machine assistance whatsoever is called the:",
    options: [
      "Digital method",
      "Manual method",
      "Electronic method",
      "Automatic method"
    ],
    answer: 1,
    explanation: "The manual method processes data purely through human effort, without any mechanical or electronic tools."
  },
  {
    question: "A processing approach using devices such as calculating machines, but not full computers, is the:",
    options: [
      "Batch method",
      "Electronic method",
      "Mechanical method",
      "Real-time method"
    ],
    answer: 2,
    explanation: "The mechanical method relies on simple electromechanical devices, like calculators, to assist processing, without using complete computer systems."
  },
  {
    question: "A processing approach using computers for fast, accurate handling of data is the:",
    options: [
      "Manual method",
      "Paper-based method",
      "Mechanical method",
      "Electronic method"
    ],
    answer: 3,
    explanation: "The electronic method uses computer systems to process data with far greater speed and accuracy than manual or mechanical approaches."
  },
  {
    question: "A system that, once configured, runs largely without further human input is called:",
    options: [
      "Interactive",
      "Mechanical",
      "Automatic",
      "Manual"
    ],
    answer: 2,
    explanation: "An automatic system performs its designated tasks on its own after initial setup, needing little ongoing human involvement."
  },
  {
    question: "Gathering transactions over a period and processing them all at a set time describes:",
    options: [
      "Real-time processing",
      "Multitasking",
      "Online processing",
      "Batch processing"
    ],
    answer: 3,
    explanation: "Batch processing collects data over time and processes the accumulated batch together at a scheduled interval, rather than instantly."
  },
  {
    question: "Entering and processing data immediately, with direct access to the system, describes:",
    options: [
      "Online processing",
      "Batch processing",
      "Multiprogramming",
      "Distributed processing"
    ],
    answer: 0,
    explanation: "Online processing allows data to be entered and processed right away through direct, interactive access to the system."
  },
  {
    question: "Multiple users sharing a computer by rapidly rotating small slices of CPU time describes:",
    options: [
      "Batch processing",
      "Time-sharing processing",
      "Multiprocessing",
      "Real-time processing"
    ],
    answer: 1,
    explanation: "Time-sharing divides processor time among several users in quick rotation, giving each the impression of simultaneous, dedicated access."
  },
  {
    question: "Processing that must respond within a strict, very short time frame to control a live process is:",
    options: [
      "Distributed processing",
      "Multitasking",
      "Real-time processing",
      "Batch processing"
    ],
    answer: 2,
    explanation: "Real-time processing requires immediate handling of data, with responses fast enough to directly influence or control the ongoing process."
  },
  {
    question: "Spreading data processing tasks over several linked computers is known as:",
    options: [
      "Batch processing",
      "Distributed processing",
      "Manual processing",
      "Centralized processing"
    ],
    answer: 1,
    explanation: "Distributed processing divides processing work across multiple interconnected computers, which may be located in different places, working together."
  },
  {
    question: "A single processor holding several programs in memory and switching between them describes:",
    options: [
      "Multitasking",
      "Multiprocessing",
      "Time-slicing alone",
      "Multiprogramming"
    ],
    answer: 3,
    explanation: "Multiprogramming lets one CPU keep multiple programs loaded in memory, switching between them to make efficient use of processing time."
  },
  {
    question: "Two or more processors carrying out instructions at the same time describes:",
    options: [
      "Multiprocessing",
      "Sequential processing",
      "Multiprogramming",
      "Batch processing"
    ],
    answer: 0,
    explanation: "Multiprocessing uses two or more CPUs working concurrently on different tasks, increasing the system's overall processing capacity."
  },
  {
    question: "One user operating several applications at once on a single machine describes:",
    options: [
      "Batch processing",
      "Distributed processing",
      "Real-time processing",
      "Multitasking"
    ],
    answer: 3,
    explanation: "Multitasking allows a single user to run and switch between multiple applications concurrently on one system."
  },
  {
    question: "A named collection of related records stored together as a unit is called a:",
    options: [
      "File",
      "Field",
      "Bit",
      "Cache"
    ],
    answer: 0,
    explanation: "A file is an organized, named collection of related records grouped together so they can be stored, retrieved, and managed as one unit."
  },
  {
    question: "A file holding fairly permanent records that get updated from time to time is called a:",
    options: [
      "Log file",
      "Transaction file",
      "Master file",
      "Temporary file"
    ],
    answer: 2,
    explanation: "A master file stores relatively stable, long-term data about an entity, which is periodically updated as new information arrives."
  },
  {
    question: "A file that holds recent activity data used to update a permanent file is called a:",
    options: [
      "Master file",
      "Transaction file",
      "Reference file",
      "Archive file"
    ],
    answer: 1,
    explanation: "A transaction file temporarily stores records of recent activities, which are later applied to update the corresponding master file."
  },
  {
    question: "The set of activities involving creating, updating, and retrieving data in files is called:",
    options: [
      "File compression",
      "File organization",
      "File processing",
      "File encryption"
    ],
    answer: 2,
    explanation: "File processing covers the operations performed on stored files, such as creating, updating, retrieving, and maintaining records."
  },
  {
    question: "Placing records into a defined order, such as by date or name, is called:",
    options: [
      "Merging",
      "Formatting",
      "Indexing",
      "Sorting"
    ],
    answer: 3,
    explanation: "Sorting arranges records in a file into a specific sequence, often based on a chosen key field, to make access and processing easier."
  },
  {
    question: "The technique used to logically structure and store records in a file is:",
    options: [
      "File duplication",
      "File organization",
      "File compression",
      "File security"
    ],
    answer: 1,
    explanation: "File organization refers to how records are logically arranged and stored within a file to support efficient access and management."
  },
  {
    question: "A file organization where records are stored and processed one after another in order is called:",
    options: [
      "Sequential organization",
      "Random organization",
      "Indexed organization",
      "Direct organization"
    ],
    answer: 0,
    explanation: "In sequential organization, records are stored one after another, typically by a key field, and are generally accessed in that same order."
  },
  {
    question: "A file organization allowing a record to be accessed instantly using its address is called:",
    options: [
      "Manual organization",
      "Direct organization",
      "Batch organization",
      "Sequential organization"
    ],
    answer: 1,
    explanation: "Direct (random) file organization permits immediate access to any record via its storage address, without reading through prior records."
  },
  {
    question: "A file organization that combines an index with ordered storage for flexible access is called:",
    options: [
      "Direct organization",
      "Batch organization",
      "Indexed sequential organization",
      "Hierarchical organization"
    ],
    answer: 2,
    explanation: "Indexed sequential organization keeps records ordered while maintaining an index, allowing both sequential and fast direct access methods."
  },
  {
    question: "The complete setup of hardware, software, staff, and procedures used for processing data in a company is the:",
    options: [
      "Data processing environment",
      "Output medium",
      "Processing cycle",
      "File hierarchy"
    ],
    answer: 0,
    explanation: "The data processing environment refers to all the combined resources — equipment, programs, personnel, and procedures — an organization uses to process its data."
  },
  {
    question: "The three fundamental stages of the data processing cycle are:",
    options: [
      "Compile, Link, Execute",
      "Gather, Sort, Discard",
      "Plan, Build, Test",
      "Input, Processing, Output"
    ],
    answer: 3,
    explanation: "The core data processing cycle consists of Input (entering data), Processing (transforming the data), and Output (delivering the results)."
  },
  {
    question: "Keeping data and information available for later retrieval and use is the role of:",
    options: [
      "Deletion",
      "Compilation",
      "Storage",
      "Transmission"
    ],
    answer: 2,
    explanation: "Storage preserves data and processed information so it can be accessed and reused after the initial processing has been completed."
  },
  {
    question: "The smallest logical unit of data representing a single attribute is called a:",
    options: [
      "File",
      "Field",
      "Directory",
      "Record"
    ],
    answer: 1,
    explanation: "A field is the smallest meaningful data unit, representing one specific piece of information, such as a phone number or date of birth."
  },
  {
    question: "A collection of related fields grouped to represent one entity is called a:",
    options: [
      "Record",
      "Table only",
      "Database",
      "File"
    ],
    answer: 0,
    explanation: "A record groups together related fields to represent complete information about a single entity, such as one customer or one order."
  },
  {
    question: "Which sequence correctly shows the file structure hierarchy from smallest to largest?",
    options: [
      "File, Field, Record, Character",
      "Record, Character, File, Field",
      "Field, Record, Character, File",
      "Character, Field, Record, File"
    ],
    answer: 3,
    explanation: "Data structure builds up from character (smallest), to field, then record, and finally file, which is the largest organizational unit."
  },
  {
    question: "Confirming that entered data satisfies defined rules before processing continues is called:",
    options: [
      "Data partitioning",
      "Data validation",
      "Data mirroring",
      "Data archiving"
    ],
    answer: 1,
    explanation: "Data validation ensures input data meets specific rules or formatting requirements before it is accepted for further processing, catching errors early."
  },
  {
    question: "Writing down daily attendance records by hand in a register is an example of:",
    options: [
      "Manual processing",
      "Electronic processing",
      "Distributed processing",
      "Automatic processing"
    ],
    answer: 0,
    explanation: "Recording information entirely by hand, without any mechanical or electronic tool, exemplifies the manual data processing method."
  },
  {
    question: "Which processing style suits generating annual tax assessment reports for a whole city?",
    options: [
      "Real-time processing",
      "Time-sharing processing",
      "Online processing",
      "Batch processing"
    ],
    answer: 3,
    explanation: "Producing large-scale annual reports from accumulated records is a routine, high-volume task well-suited to batch processing."
  },
  {
    question: "Which processing style best fits a stock trading platform where prices must update instantly?",
    options: [
      "Mechanical processing",
      "Batch processing",
      "Real-time processing",
      "Manual processing"
    ],
    answer: 2,
    explanation: "Stock trading requires immediate reflection of price changes and trades, demanding real-time processing to keep data current."
  },
  {
    question: "What is the main difference between time-sharing and batch processing?",
    options: [
      "Time-sharing cannot support more than one user",
      "Time-sharing gives interactive access to multiple users at once, while batch groups jobs for later processing",
      "There is no real difference between them",
      "Batch processing always responds faster than time-sharing"
    ],
    answer: 1,
    explanation: "Time-sharing allows multiple users to interact with the system directly and concurrently, while batch processing groups tasks together to run later without immediate interaction."
  },
  {
    question: "Why might a company prefer real-time processing despite its higher cost compared to batch processing?",
    options: [
      "It provides immediate responses needed for time-critical operations",
      "It is always cheaper to implement",
      "It processes data only once a year",
      "It requires no computing infrastructure"
    ],
    answer: 0,
    explanation: "Despite generally higher costs, real-time processing is chosen when immediate response is essential for operations like monitoring or control systems, where delays would cause problems."
  },
  {
    question: "Ensuring that stored data remains accurate and unaltered over time is known as maintaining:",
    options: [
      "Data volume",
      "Data variety",
      "Data integrity",
      "Data velocity"
    ],
    answer: 2,
    explanation: "Data integrity involves preserving the accuracy, consistency, and reliability of data throughout its storage and use."
  },
  {
    question: "A genuine benefit of automatic data processing systems is that they:",
    options: [
      "Require constant manual recalculation of every result",
      "Cannot process large volumes of data",
      "Always eliminate the need for any programming",
      "Reduce the need for repetitive human intervention once set up"
    ],
    answer: 3,
    explanation: "Automatic systems are designed to carry out repetitive tasks on their own after initial configuration, reducing the need for ongoing manual involvement."
  },
  {
    question: "Checking your account balance through a banking app, with results shown immediately, is an example of:",
    options: [
      "Manual processing",
      "Online processing",
      "Batch processing",
      "Distributed archiving"
    ],
    answer: 1,
    explanation: "Viewing account information through an app that responds immediately to the request reflects the direct, interactive nature of online processing."
  },
  {
    question: "A key reason for using multiprocessing systems in an organization is to:",
    options: [
      "Limit the system to running one task at a time",
      "Guarantee that no errors will ever occur",
      "Increase overall processing speed by running tasks on multiple processors simultaneously",
      "Avoid the need for any operating system"
    ],
    answer: 2,
    explanation: "Multiprocessing systems use multiple processors working together, which increases the overall speed and throughput of task execution compared to a single processor."
  },
  {
    question: "The fundamental purpose of organizing data into well-structured files is to:",
    options: [
      "Make retrieval and updating of records more difficult",
      "Prevent any form of data access",
      "Increase the physical size of storage devices unnecessarily",
      "Enable efficient storage, retrieval, and maintenance of related records"
    ],
    answer: 3,
    explanation: "Structured file organization exists to make it easier and more efficient to store, retrieve, update, and maintain related records over time."
  },
  {
    question: "A file used to keep a permanent copy of important data in case the original is lost or damaged is called a:",
    options: [
      "Backup file",
      "Sequential file",
      "Reference file",
      "Index file"
    ],
    answer: 0,
    explanation: "A backup file is a duplicate copy of data kept specifically to restore information in case the original file is lost, corrupted, or damaged."
  }
];
const BIO102B = [
  {
    question: "Which taxonomic rank is the highest in modern biological classification?",
    options: [
      "Domain",
      "Class",
      "Kingdom",
      "Phylum"
    ],
    answer: 0,
    explanation: "Domain is the highest taxonomic rank and includes Bacteria, Archaea, and Eukarya."
  },
  {
    question: "Which kingdom consists mainly of multicellular organisms that obtain food by ingestion?",
    options: [
      "Protista",
      "Animalia",
      "Fungi",
      "Plantae"
    ],
    answer: 1,
    explanation: "Animals are multicellular organisms that feed by ingesting food."
  },
  {
    question: "Members of the kingdom Fungi obtain nutrients primarily by:",
    options: [
      "Photosynthesis",
      "Chemosynthesis",
      "Absorption",
      "Ingestion"
    ],
    answer: 2,
    explanation: "Fungi absorb dissolved nutrients from their surroundings."
  },
  {
    question: "Which of the following is a characteristic of plants?",
    options: [
      "Cell wall made of chitin",
      "Lack of chlorophyll",
      "No nucleus",
      "Cell wall made of cellulose"
    ],
    answer: 3,
    explanation: "Plant cells possess cellulose cell walls and chloroplasts."
  },
  {
    question: "Which kingdom contains organisms that may be unicellular or simple multicellular eukaryotes?",
    options: [
      "Animalia",
      "Protista",
      "Fungi",
      "Plantae"
    ],
    answer: 1,
    explanation: "Protists include mostly unicellular eukaryotes and some simple multicellular forms."
  },
  {
    question: "Which domain contains organisms without a true nucleus?",
    options: [
      "Bacteria and Archaea",
      "Plantae only",
      "Eukarya only",
      "Protista only"
    ],
    answer: 0,
    explanation: "Bacteria and Archaea are prokaryotic domains."
  },
  {
    question: "Which kingdom includes mushrooms and moulds?",
    options: [
      "Protista",
      "Plantae",
      "Fungi",
      "Animalia"
    ],
    answer: 2,
    explanation: "Mushrooms and moulds belong to Kingdom Fungi."
  },
  {
    question: "Which scientist introduced the binomial system of naming organisms?",
    options: [
      "Charles Darwin",
      "Carolus Linnaeus",
      "Louis Pasteur",
      "Robert Hooke"
    ],
    answer: 1,
    explanation: "Linnaeus developed binomial nomenclature."
  },
  {
    question: "Which kingdom contains organisms with chlorophyll that manufacture their own food?",
    options: [
      "Plantae",
      "Fungi",
      "Animalia",
      "Protista"
    ],
    answer: 0,
    explanation: "Plants carry out photosynthesis using chlorophyll."
  },
  {
    question: "Which of the following belongs to Kingdom Protista?",
    options: [
      "Grasshopper",
      "Moss",
      "Mushroom",
      "Amoeba"
    ],
    answer: 3,
    explanation: "Amoeba is a unicellular protist."
  },
  {
    question: "Which taxonomic rank comes immediately below kingdom?",
    options: [
      "Phylum",
      "Order",
      "Class",
      "Domain"
    ],
    answer: 0,
    explanation: "The order is Domain → Kingdom → Phylum → Class."
  },
  {
    question: "Animals differ from plants mainly because animals:",
    options: [
      "Produce spores only",
      "Have cell walls",
      "Lack chloroplasts",
      "Contain chlorophyll"
    ],
    answer: 2,
    explanation: "Animal cells do not contain chloroplasts."
  },
  {
    question: "Which of the following is NOT a kingdom of Eukarya?",
    options: [
      "Animalia",
      "Plantae",
      "Fungi",
      "Archaea"
    ],
    answer: 3,
    explanation: "Archaea is a domain, not a kingdom within Eukarya."
  },
  {
    question: "Which feature is common to fungi and plants?",
    options: [
      "Ingestion of food",
      "Cell wall",
      "Motility",
      "Photosynthesis"
    ],
    answer: 1,
    explanation: "Both have cell walls, though their compositions differ."
  },
  {
    question: "The scientific name of an organism consists of:",
    options: [
      "Family and genus",
      "Order and class",
      "Genus and species",
      "Kingdom and species"
    ],
    answer: 2,
    explanation: "Binomial nomenclature uses genus and species names."
  },
  {
    question: "Which kingdom includes yeast?",
    options: [
      "Plantae",
      "Animalia",
      "Protista",
      "Fungi"
    ],
    answer: 3,
    explanation: "Yeast is a unicellular fungus."
  },
  {
    question: "Which domain includes humans?",
    options: [
      "Eukarya",
      "Bacteria",
      "Archaea",
      "Monera"
    ],
    answer: 0,
    explanation: "Humans are eukaryotic organisms."
  },
  {
    question: "An organism that lacks membrane-bound organelles belongs to:",
    options: [
      "Protista",
      "Prokaryotes",
      "Plantae",
      "Animalia"
    ],
    answer: 1,
    explanation: "Prokaryotes do not possess membrane-bound organelles."
  },
  {
    question: "Which kingdom is composed entirely of multicellular organisms?",
    options: [
      "Bacteria",
      "Archaea",
      "Animalia",
      "Protista"
    ],
    answer: 2,
    explanation: "Animals are multicellular organisms."
  },
  {
    question: "Which of the following organisms is most likely to reproduce by spores?",
    options: [
      "Mushroom",
      "Cat",
      "Fish",
      "Goat"
    ],
    answer: 0,
    explanation: "Many fungi reproduce through spores."
  },
  {
    question: "Which kingdom contains organisms that can be autotrophic or heterotrophic?",
    options: [
      "Animalia",
      "Protista",
      "Fungi",
      "Plantae"
    ],
    answer: 1,
    explanation: "Some protists photosynthesize, while others feed on organic matter."
  },
  {
    question: "The presence of chitin in the cell wall is characteristic of:",
    options: [
      "Animalia",
      "Plantae",
      "Protista",
      "Fungi"
    ],
    answer: 3,
    explanation: "Fungal cell walls are made mainly of chitin."
  },
  {
    question: "Which of the following is an example of a multicellular plant?",
    options: [
      "Amoeba",
      "Paramecium",
      "Fern",
      "Euglena"
    ],
    answer: 2,
    explanation: "Ferns are multicellular plants."
  },
  {
    question: "Which kingdom contains organisms that do not have cell walls?",
    options: [
      "Fungi",
      "Animalia",
      "Plantae",
      "Bacteria"
    ],
    answer: 1,
    explanation: "Animal cells lack cell walls."
  },
  {
    question: "The primary purpose of biological classification is to:",
    options: [
      "Eliminate extinct organisms",
      "Prevent evolution",
      "Increase the number of species",
      "Simplify the study of living organisms"
    ],
    answer: 3,
    explanation: "Classification organizes living organisms into groups based on similarities, making identification and study easier."
  },
  {
    question: "Which of the following kingdoms contains organisms that are primarily decomposers?",
    options: [
      "Fungi",
      "Plantae",
      "Protista",
      "Animalia"
    ],
    answer: 0,
    explanation: "Most fungi obtain nutrients by decomposing dead organic matter."
  },
  {
    question: "Which characteristic is shared by all members of the domain Eukarya?",
    options: [
      "They have peptidoglycan cell walls",
      "They lack a nucleus",
      "They are all multicellular",
      "They possess membrane-bound organelles"
    ],
    answer: 3,
    explanation: "All eukaryotes have a true nucleus and membrane-bound organelles."
  },
  {
    question: "Which of the following organisms belongs to Kingdom Animalia?",
    options: [
      "Hydra",
      "Spirogyra",
      "Amoeba",
      "Rhizopus"
    ],
    answer: 0,
    explanation: "Hydra is a simple multicellular animal."
  },
  {
    question: "The taxonomic rank immediately below class is:",
    options: [
      "Family",
      "Phylum",
      "Order",
      "Genus"
    ],
    answer: 2,
    explanation: "The sequence is Domain → Kingdom → Phylum → Class → Order → Family → Genus → Species."
  },
  {
    question: "Which of the following is NOT a feature of fungi?",
    options: [
      "Cell walls contain chitin",
      "They possess chlorophyll",
      "They reproduce by spores",
      "They absorb nutrients"
    ],
    answer: 1,
    explanation: "Fungi do not contain chlorophyll and therefore cannot photosynthesize."
  },
  {
    question: "Euglena is difficult to classify because it:",
    options: [
      "Has characteristics of both plants and animals",
      "Has no nucleus",
      "Is both unicellular and multicellular",
      "Is a bacterium"
    ],
    answer: 0,
    explanation: "Euglena photosynthesizes but can also feed heterotrophically."
  },
  {
    question: "Which kingdom is characterized by cellulose cell walls and chloroplasts?",
    options: [
      "Animalia",
      "Fungi",
      "Protista",
      "Plantae"
    ],
    answer: 3,
    explanation: "Plants have cellulose cell walls and chloroplasts for photosynthesis."
  },
  {
    question: "Which of the following is the correct sequence from highest to lowest taxonomic rank?",
    options: [
      "Domain → Phylum → Kingdom → Order",
      "Domain → Kingdom → Phylum → Class",
      "Kingdom → Domain → Phylum → Class",
      "Kingdom → Phylum → Domain → Class"
    ],
    answer: 1,
    explanation: "Domain → Kingdom → Phylum → Class is the correct hierarchical order."
  },
  {
    question: "Which of the following belongs to Kingdom Fungi?",
    options: [
      "Earthworm",
      "Moss",
      "Penicillium",
      "Paramecium"
    ],
    answer: 2,
    explanation: "Penicillium is a genus of fungi."
  },
  {
    question: "Which kingdom includes organisms that are capable of voluntary movement?",
    options: [
      "Animalia",
      "Bacteria",
      "Fungi",
      "Plantae"
    ],
    answer: 0,
    explanation: "Most animals can move voluntarily at some stage of their life cycle."
  },
  {
    question: "Organisms in the kingdom Protista are mostly:",
    options: [
      "Multicellular fungi",
      "Multicellular prokaryotes",
      "Unicellular eukaryotes",
      "Non-living organisms"
    ],
    answer: 2,
    explanation: "Most protists are single-celled organisms with a true nucleus."
  },
  {
    question: "Which taxonomic category contains closely related genera?",
    options: [
      "Phylum",
      "Family",
      "Species",
      "Order"
    ],
    answer: 1,
    explanation: "A family consists of one or more closely related genera."
  },
  {
    question: "Which of the following is correctly matched?",
    options: [
      "Peptidoglycan — Fungi",
      "Chitin — Plantae",
      "Cellulose — Animalia",
      "Chlorophyll — Plantae"
    ],
    answer: 3,
    explanation: "Chlorophyll is the green pigment responsible for photosynthesis in plants."
  },
  {
    question: "Which kingdom includes algae such as Chlamydomonas?",
    options: [
      "Protista",
      "Fungi",
      "Plantae",
      "Animalia"
    ],
    answer: 0,
    explanation: "Chlamydomonas is a unicellular green alga classified as a protist."
  },
  {
    question: "The smallest unit of biological classification is:",
    options: [
      "Order",
      "Family",
      "Species",
      "Genus"
    ],
    answer: 2,
    explanation: "Species is the basic and smallest unit of classification."
  },
  {
    question: "Which kingdom contains organisms that lack chlorophyll but possess cell walls?",
    options: [
      "Plantae",
      "Animalia",
      "Protista",
      "Fungi"
    ],
    answer: 3,
    explanation: "Fungi have cell walls but do not contain chlorophyll."
  },
  {
    question: "Which feature distinguishes animals from fungi?",
    options: [
      "Presence of a nucleus",
      "Ingestion of food",
      "Presence of cell walls",
      "Ability to absorb nutrients"
    ],
    answer: 1,
    explanation: "Animals ingest food, whereas fungi absorb nutrients."
  },
  {
    question: "Which of the following is correctly written as a scientific name?",
    options: [
      "Homo sapiens",
      "HOMO SAPIENS",
      "homo sapiens",
      "Homo Sapiens"
    ],
    answer: 0,
    explanation: "The genus starts with a capital letter, while the species name is lowercase."
  },
  {
    question: "Which kingdom includes slime molds?",
    options: [
      "Animalia",
      "Protista",
      "Plantae",
      "Fungi"
    ],
    answer: 1,
    explanation: "Slime molds are generally classified under Protista."
  },
  {
    question: "Organisms belonging to Kingdom Plantae are generally:",
    options: [
      "Heterotrophic and motile",
      "Parasitic and unicellular",
      "Autotrophic and non-motile",
      "Saprophytic and motile"
    ],
    answer: 2,
    explanation: "Most plants produce their own food and remain fixed in one place."
  },
  {
    question: "Which kingdom contains organisms that lack cell walls entirely?",
    options: [
      "Plantae",
      "Protista",
      "Fungi",
      "Animalia"
    ],
    answer: 3,
    explanation: "Animal cells do not have cell walls."
  },
  {
    question: "Which of the following organisms is correctly classified under Kingdom Plantae?",
    options: [
      "Hydra",
      "Amoeba",
      "Moss",
      "Mushroom"
    ],
    answer: 2,
    explanation: "Moss is a simple non-flowering plant."
  },
  {
    question: "The main purpose of assigning scientific names to organisms is to:",
    options: [
      "Replace all common names permanently",
      "Group organisms by size",
      "Increase the number of species",
      "Avoid confusion caused by local names"
    ],
    answer: 3,
    explanation: "Scientific names provide a universal system of identification."
  },
  {
    question: "Which kingdom is most likely to include organisms that are both aquatic and terrestrial?",
    options: [
      "Plantae",
      "Animalia",
      "Fungi",
      "Protista"
    ],
    answer: 1,
    explanation: "Animals inhabit a wide range of environments, including water and land."
  },
  {
    question: "Which statement best explains the importance of biological classification?",
    options: [
      "It helps scientists identify relationships among organisms",
      "It reduces the number of living organisms",
      "It prevents the discovery of new species",
      "It eliminates the need for scientific names"
    ],
    answer: 0,
    explanation: "Biological classification groups organisms based on similarities and evolutionary relationships, making identification and study easier."
  }
];
const BIO102C = [
  {
    question: "Which of the following taxonomic groups contains the greatest number of different organisms?",
    options: [
      "Family",
      "Kingdom",
      "Species",
      "Genus"
    ],
    answer: 1,
    explanation: "Kingdom is a broader taxonomic rank than family, genus, and species."
  },
  {
    question: "Which kingdom includes organisms that digest food outside their bodies before absorbing it?",
    options: [
      "Fungi",
      "Plantae",
      "Protista",
      "Animalia"
    ],
    answer: 0,
    explanation: "Fungi secrete enzymes onto their food and absorb the digested nutrients."
  },
  {
    question: "Which of the following is an example of a protist?",
    options: [
      "Earthworm",
      "Euglena",
      "Mushroom",
      "Moss"
    ],
    answer: 1,
    explanation: "Euglena is a unicellular eukaryote classified under Protista."
  },
  {
    question: "Which kingdom contains organisms that are exclusively multicellular?",
    options: [
      "Animalia",
      "Fungi",
      "Protista",
      "Bacteria"
    ],
    answer: 0,
    explanation: "All animals are multicellular."
  },
  {
    question: "Which feature is found in both plants and fungi?",
    options: [
      "Chlorophyll",
      "Ability to move freely",
      "Cell wall",
      "Cellulose cell wall"
    ],
    answer: 2,
    explanation: "Plants and fungi both have cell walls, though they differ in composition."
  },
  {
    question: "Organisms in the domain Archaea differ from bacteria mainly because they:",
    options: [
      "Lack DNA",
      "Are multicellular",
      "Possess chloroplasts",
      "Have unique cell membrane chemistry"
    ],
    answer: 3,
    explanation: "Archaea have distinct membrane lipids and genetic features."
  },
  {
    question: "Which of the following represents the correct order from the lowest to the highest taxonomic rank?",
    options: [
      "Genus → Species → Family → Order",
      "Species → Family → Genus → Order",
      "Species → Genus → Family → Order",
      "Family → Species → Genus → Class"
    ],
    answer: 2,
    explanation: "Taxonomic ranks increase from species upward."
  },
  {
    question: "Which kingdom contains organisms capable of photosynthesis but lacking true roots, stems, and leaves?",
    options: [
      "Fungi",
      "Protista",
      "Archaea",
      "Animalia"
    ],
    answer: 1,
    explanation: "Many algae are protists and lack true plant organs."
  },
  {
    question: "Which scientist is regarded as the father of taxonomy?",
    options: [
      "Carolus Linnaeus",
      "Charles Darwin",
      "Robert Koch",
      "Gregor Mendel"
    ],
    answer: 0,
    explanation: "Linnaeus developed the modern classification system."
  },
  {
    question: "Which kingdom contains bread mould?",
    options: [
      "Plantae",
      "Animalia",
      "Protista",
      "Fungi"
    ],
    answer: 3,
    explanation: "Bread mould belongs to Kingdom Fungi."
  },
  {
    question: "Which of the following is NOT a characteristic of animals?",
    options: [
      "Multicellular body",
      "Ability to respond to stimuli",
      "Cellulose cell wall",
      "Heterotrophic nutrition"
    ],
    answer: 2,
    explanation: "Animal cells do not have cell walls."
  },
  {
    question: "Which taxonomic rank contains one or more related families?",
    options: [
      "Class",
      "Species",
      "Genus",
      "Order"
    ],
    answer: 3,
    explanation: "Orders consist of related families."
  },
  {
    question: "Which of the following is a flowering plant?",
    options: [
      "Mango",
      "Mushroom",
      "Moss",
      "Fern"
    ],
    answer: 0,
    explanation: "Mango is an angiosperm (flowering plant)."
  },
  {
    question: "Which kingdom includes organisms such as Paramecium?",
    options: [
      "Animalia",
      "Protista",
      "Fungi",
      "Plantae"
    ],
    answer: 1,
    explanation: "Paramecium is a unicellular protist."
  },
  {
    question: "Which feature is common to all eukaryotic organisms?",
    options: [
      "Absence of DNA",
      "Lack of cytoplasm",
      "No chromosomes",
      "Membrane-bound nucleus"
    ],
    answer: 3,
    explanation: "All eukaryotes possess a true nucleus."
  },
  {
    question: "Which kingdom includes organisms that produce spores as one method of reproduction?",
    options: [
      "Plantae only",
      "Animalia",
      "Fungi",
      "Archaea"
    ],
    answer: 2,
    explanation: "Most fungi reproduce through spores."
  },
  {
    question: "Which of the following organisms belongs to Kingdom Plantae?",
    options: [
      "Amoeba",
      "Pine tree",
      "Hydra",
      "Mushroom"
    ],
    answer: 1,
    explanation: "Pine is a gymnosperm plant."
  },
  {
    question: "A species is best defined as a group of organisms that:",
    options: [
      "Can interbreed to produce fertile offspring",
      "Have similar body size",
      "Share the same colour",
      "Live in the same habitat only"
    ],
    answer: 0,
    explanation: "This is the biological definition of a species."
  },
  {
    question: "Which kingdom contains organisms that are primarily consumers?",
    options: [
      "Fungi",
      "Plantae",
      "Protista",
      "Animalia"
    ],
    answer: 3,
    explanation: "Animals obtain food by consuming other organisms."
  },
  {
    question: "Which domain includes organisms commonly known as 'true bacteria'?",
    options: [
      "Bacteria",
      "Archaea",
      "Protista",
      "Eukarya"
    ],
    answer: 0,
    explanation: "The domain Bacteria contains the true bacteria."
  },
  {
    question: "Which of the following is an advantage of biological classification?",
    options: [
      "It prevents evolution",
      "It eliminates scientific research",
      "It helps identify organisms accurately",
      "It reduces biodiversity"
    ],
    answer: 2,
    explanation: "Classification makes identification and comparison easier."
  },
  {
    question: "Which kingdom contains organisms with hyphae?",
    options: [
      "Plantae",
      "Fungi",
      "Protista",
      "Animalia"
    ],
    answer: 1,
    explanation: "Hyphae are thread-like structures that make up most fungi."
  },
  {
    question: "Which of the following belongs to Kingdom Animalia?",
    options: [
      "Starfish",
      "Spirogyra",
      "Rhizopus",
      "Yeast"
    ],
    answer: 0,
    explanation: "Starfish are marine animals."
  },
  {
    question: "The scientific name Zea mays refers to:",
    options: [
      "Millet",
      "Maize",
      "Rice",
      "Wheat"
    ],
    answer: 1,
    explanation: "Zea mays is the scientific name for maize (corn)."
  },
  {
    question: "Which of the following is the main basis for modern biological classification?",
    options: [
      "Colour of the organism",
      "Habitat only",
      "Evolutionary relationships and shared characteristics",
      "Body size alone"
    ],
    answer: 2,
    explanation: "Modern classification groups organisms based on shared features and evolutionary history."
  },
  {
    question: "Which of the following organisms belongs to Kingdom Fungi?",
    options: [
      "Euglena",
      "Hydra",
      "Spirogyra",
      "Rhizopus"
    ],
    answer: 3,
    explanation: "Rhizopus is a common bread mould and belongs to Kingdom Fungi."
  },
  {
    question: "Which kingdom contains organisms that are mostly non-motile and produce their own food?",
    options: [
      "Fungi",
      "Plantae",
      "Animalia",
      "Protista"
    ],
    answer: 1,
    explanation: "Plants are generally non-motile and manufacture food through photosynthesis."
  },
  {
    question: "The branch of biology concerned with naming and classifying organisms is known as:",
    options: [
      "Taxonomy",
      "Genetics",
      "Ecology",
      "Physiology"
    ],
    answer: 0,
    explanation: "Taxonomy deals with the identification, naming, and classification of organisms."
  },
  {
    question: "Which of the following belongs to the domain Eukarya?",
    options: [
      "Escherichia coli",
      "Methanobacterium",
      "Cyanobacterium",
      "Mushroom"
    ],
    answer: 3,
    explanation: "Mushrooms are fungi and belong to Domain Eukarya."
  },
  {
    question: "Which characteristic is common to all animals?",
    options: [
      "Presence of chlorophyll",
      "Cell walls made of cellulose",
      "Heterotrophic mode of nutrition",
      "Reproduction by spores only"
    ],
    answer: 2,
    explanation: "Animals cannot make their own food; they depend on other organisms."
  },
  {
    question: "Which of the following is NOT a member of Kingdom Protista?",
    options: [
      "Mushroom",
      "Euglena",
      "Amoeba",
      "Paramecium"
    ],
    answer: 0,
    explanation: "Mushrooms belong to Kingdom Fungi."
  },
  {
    question: "Which kingdom includes organisms with tissues such as xylem and phloem?",
    options: [
      "Protista",
      "Fungi",
      "Plantae",
      "Animalia"
    ],
    answer: 2,
    explanation: "Vascular plants possess xylem and phloem for transport."
  },
  {
    question: "In the scientific name Homo sapiens, the word Homo represents the:",
    options: [
      "Species",
      "Genus",
      "Family",
      "Order"
    ],
    answer: 1,
    explanation: "The first word in a scientific name is the genus."
  },
  {
    question: "Which of the following is a characteristic of protists?",
    options: [
      "All possess chitin cell walls",
      "They lack nuclei",
      "All are multicellular",
      "Most are unicellular eukaryotes"
    ],
    answer: 3,
    explanation: "Most protists are single-celled organisms with true nuclei."
  },
  {
    question: "Which kingdom contains organisms that lack chloroplasts but possess chitinous cell walls?",
    options: [
      "Protista",
      "Fungi",
      "Plantae",
      "Animalia"
    ],
    answer: 1,
    explanation: "Chitin is the main component of fungal cell walls."
  },
  {
    question: "Which taxonomic rank is immediately above genus?",
    options: [
      "Family",
      "Class",
      "Species",
      "Order"
    ],
    answer: 0,
    explanation: "A family contains one or more closely related genera."
  },
  {
    question: "Which of the following organisms is correctly matched with its kingdom?",
    options: [
      "Mushroom — Protista",
      "Amoeba — Plantae",
      "Yeast — Fungi",
      "Moss — Animalia"
    ],
    answer: 2,
    explanation: "Yeast is a unicellular fungus."
  },
  {
    question: "The primary function of chlorophyll in plants is to:",
    options: [
      "Protect against disease",
      "Carry water to the leaves",
      "Absorb nutrients from the soil",
      "Trap light energy for photosynthesis"
    ],
    answer: 3,
    explanation: "Chlorophyll captures sunlight for food production."
  },
  {
    question: "Which of the following kingdoms contains only heterotrophic organisms?",
    options: [
      "Animalia and Fungi",
      "Plantae",
      "Protista",
      "Animalia"
    ],
    answer: 0,
    explanation: "Both animals and fungi obtain food from other organisms."
  },
  {
    question: "Which scientist proposed the five-kingdom classification system?",
    options: [
      "Charles Darwin",
      "Gregor Mendel",
      "Carolus Linnaeus",
      "Robert Whittaker"
    ],
    answer: 3,
    explanation: "Robert Whittaker proposed the five-kingdom system in 1969."
  },
  {
    question: "Which of the following is an autotrophic protist?",
    options: [
      "Amoeba",
      "Hydra",
      "Euglena",
      "Mushroom"
    ],
    answer: 2,
    explanation: "Euglena can photosynthesize because it contains chloroplasts."
  },
  {
    question: "Which kingdom includes organisms that store food mainly as glycogen?",
    options: [
      "Bacteria only",
      "Animalia and Fungi",
      "Plantae",
      "Protista only"
    ],
    answer: 1,
    explanation: "Animals and fungi store carbohydrates as glycogen."
  },
  {
    question: "Which characteristic best distinguishes plants from animals?",
    options: [
      "Ability to produce food by photosynthesis",
      "Presence of cytoplasm",
      "Presence of DNA",
      "Cellular respiration"
    ],
    answer: 0,
    explanation: "Plants are generally autotrophic due to photosynthesis."
  },
  {
    question: "Which kingdom includes lichens as one of its members?",
    options: [
      "Plantae",
      "Animalia",
      "Fungi",
      "Protista"
    ],
    answer: 2,
    explanation: "Lichens are formed through a partnership involving fungi and are classified with fungi."
  },
  {
    question: "Which of the following is a benefit of using scientific names?",
    options: [
      "They are easier than common names",
      "They provide a universal means of identification",
      "They differ from country to country",
      "They eliminate all local names"
    ],
    answer: 1,
    explanation: "Scientific names are recognized worldwide."
  },
  {
    question: "Which kingdom contains seaweeds in many introductory classification systems?",
    options: [
      "Animalia",
      "Fungi",
      "Plantae",
      "Protista"
    ],
    answer: 3,
    explanation: "Many algae, including seaweeds, are placed in Protista in introductory biology."
  },
  {
    question: "Which taxonomic rank contains the largest number of species?",
    options: [
      "Kingdom",
      "Order",
      "Family",
      "Genus"
    ],
    answer: 0,
    explanation: "Kingdom is one of the broadest taxonomic ranks and includes many species."
  },
  {
    question: "Which statement about fungi is correct?",
    options: [
      "They manufacture food using sunlight",
      "They are all unicellular",
      "Their cell walls contain cellulose only",
      "They obtain nutrients by absorption"
    ],
    answer: 3,
    explanation: "Fungi absorb nutrients after secreting digestive enzymes."
  },
  {
    question: "Which of the following is a multicellular member of Kingdom Plantae?",
    options: [
      "Yeast",
      "Amoeba",
      "Fern",
      "Euglena"
    ],
    answer: 2,
    explanation: "Ferns are multicellular vascular plants."
  },
  {
    question: "Which of the following best explains why organisms are classified into groups?",
    options: [
      "To reduce the number of living organisms",
      "To make the study and identification of organisms easier",
      "To prevent new species from being discovered",
      "To replace ecological studies"
    ],
    answer: 1,
    explanation: "Classification organizes organisms based on shared characteristics and evolutionary relationships, making them easier to study, compare, and identify."
  }
];
function getCourse(course) {
  return {
    GST112,
    MTH132,
    MTH132B,
    MTH132C,
    MTH132D,
    PHY102,
    PHY102B,
    PHY102C,
    PHY102D,
    CSC104,
    CSC104B,
    CSC104C,
    CSC104D,
    CSC122,
    CSC122B,
    CSC122C,
    CSC122D,
    COS102,
    COS102B,
    COS102C,
    COS102D,
    COS102E,
    STA112,
    CYB102,
    CYB102B,
    CYB102C,
    CYB104,
    CHM102,
    BIO102,
    BIO102B,
    BIO102C
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
    question: "Which of the following best describes the geographical location of Nigeria in Africa?",
    options: [
      "Southern Africa",
      "West Africa",
      "East Africa",
      "North Africa"
    ],
    answer: 1,
    explanation: "Nigeria is located in West Africa, bordered by Benin, Niger, Chad, and Cameroon."
  },
  {
    question: "The three major ethnic groups in Nigeria are commonly identified as:",
    options: [
      "Yoruba, Igbo, Hausa-Fulani",
      "Igala, Nupe, Efik",
      "Ijaw, Tiv, Kanuri",
      "Ibibio, Edo, Urhobo"
    ],
    answer: 0,
    explanation: "The Hausa-Fulani, Yoruba, and Igbo are traditionally regarded as Nigeria's three major ethnic groups due to their population size and political influence."
  },
  {
    question: "Pre-colonial Yoruba political organization was primarily structured around:",
    options: [
      "Warrant chief system",
      "Emirate system",
      "Segmentary lineage system without central authority",
      "City-states with an Oba as ruler"
    ],
    answer: 3,
    explanation: "Yoruba pre-colonial society was organized into city-states, each headed by a divine king known as an Oba."
  },
  {
    question: "The pre-colonial Igbo political system is best described as:",
    options: [
      "Federal system",
      "Republican/acephalous (stateless) system",
      "Theocratic caliphate",
      "Highly centralized monarchy"
    ],
    answer: 1,
    explanation: "The Igbo operated a decentralized, republican system without kings, governed through councils of elders, age grades, and title societies."
  },
  {
    question: "The Hausa-Fulani political structure before colonial rule was based on:",
    options: [
      "The emirate system under an Emir",
      "Village democracy",
      "Council of women elders",
      "Age-grade governance"
    ],
    answer: 0,
    explanation: "Following the Sokoto Jihad of 1804, the Hausa states were reorganized into emirates under Fulani emirs, subordinate to the Sokoto Caliphate."
  },
  {
    question: "The Benin Kingdom's political authority in pre-colonial times was headed by the:",
    options: [
      "Obi",
      "Eze",
      "Oba",
      "Emir"
    ],
    answer: 2,
    explanation: "The Benin Kingdom was a centralized monarchy ruled by the Oba, supported by chiefs and palace associations."
  },
  {
    question: "Which culture area is associated with the Efik, Ibibio, and Annang peoples?",
    options: [
      "Cross River culture area",
      "Hausa culture area",
      "Niger-Delta culture area",
      "Middle Belt culture area"
    ],
    answer: 0,
    explanation: "The Efik, Ibibio, and Annang are indigenous to the Cross River region in southeastern Nigeria."
  },
  {
    question: "The term 'culture area' in Nigerian studies refers to:",
    options: [
      "A single ethnic group's territory",
      "Regions with the same religion only",
      "A geographical region where groups share similar cultural traits",
      "Areas colonized by the British"
    ],
    answer: 2,
    explanation: "A culture area denotes a region where different but related groups share common cultural features such as language, customs, and social organization."
  },
  {
    question: "The Kanuri people, associated with the Borno Empire, are located primarily in:",
    options: [
      "South-West Nigeria",
      "South-South Nigeria",
      "North-Central Nigeria",
      "North-East Nigeria"
    ],
    answer: 3,
    explanation: "The Kanuri are historically centered in Borno State and the surrounding areas of North-East Nigeria."
  },
  {
    question: "The Berlin Conference of 1884-1885 was significant to Nigeria's evolution because it:",
    options: [
      "Created the Nigerian constitution",
      "Partitioned Africa among European powers",
      "Granted Nigeria independence",
      "Established the Nigerian currency"
    ],
    answer: 1,
    explanation: "The Berlin Conference formalized the Scramble for Africa, leading to European powers including Britain claiming territories that became Nigeria."
  },
  {
    question: "The amalgamation of the Northern and Southern Protectorates of Nigeria occurred in:",
    options: [
      "1914",
      "1960",
      "1900",
      "1922"
    ],
    answer: 0,
    explanation: "Lord Frederick Lugard amalgamated the Northern and Southern Protectorates into a single entity called Nigeria in 1914."
  },
  {
    question: "Who is credited with naming 'Nigeria'?",
    options: [
      "Queen Victoria",
      "Lord Lugard",
      "Flora Shaw",
      "Herbert Macaulay"
    ],
    answer: 2,
    explanation: "Flora Shaw, a British journalist who later married Lugard, coined the name Nigeria in 1897, derived from the River Niger."
  },
  {
    question: "Nigeria gained political independence from Britain on:",
    options: [
      "January 1, 1966",
      "October 1, 1960",
      "May 29, 1999",
      "October 1, 1963"
    ],
    answer: 1,
    explanation: "Nigeria became an independent nation on October 1, 1960."
  },
  {
    question: "Nigeria became a republic on:",
    options: [
      "July 29, 1966",
      "May 29, 1999",
      "October 1, 1960",
      "October 1, 1963"
    ],
    answer: 3,
    explanation: "Nigeria transitioned from a dominion under the British monarch to a republic on October 1, 1963, with Nnamdi Azikiwe as the first President."
  },
  {
    question: "The Richards Constitution of 1946 is notable for:",
    options: [
      "Introducing regionalism into Nigerian governance",
      "Establishing state creation",
      "Granting full independence",
      "Abolishing indirect rule"
    ],
    answer: 0,
    explanation: "The Richards Constitution divided Nigeria into three regions (North, East, West), laying the foundation for federalism."
  },
  {
    question: "The Macpherson Constitution was introduced in the year:",
    options: [
      "1954",
      "1951",
      "1946",
      "1960"
    ],
    answer: 1,
    explanation: "The Macpherson Constitution of 1951 expanded regional legislative powers and increased Nigerian participation in governance."
  },
  {
    question: "The Lyttleton Constitution of 1954 is significant because it:",
    options: [
      "Established Nigeria as a republic",
      "Created six geopolitical zones",
      "Formally introduced federalism to Nigeria",
      "Granted independence"
    ],
    answer: 2,
    explanation: "The Lyttleton Constitution formally established a federal system of government for Nigeria."
  },
  {
    question: "The system of indirect rule in colonial Nigeria was most successfully applied in the:",
    options: [
      "Niger Delta",
      "South-East",
      "Middle Belt",
      "North"
    ],
    answer: 3,
    explanation: "Indirect rule worked effectively in the North because the existing emirate system provided a ready-made centralized structure for the British to govern through."
  },
  {
    question: "Indirect rule faced significant challenges in Igbo land mainly because:",
    options: [
      "There were no British administrators available",
      "The Igbo political system was decentralized/acephalous",
      "The Igbo had strong centralized kingdoms",
      "The Igbo refused all forms of leadership"
    ],
    answer: 1,
    explanation: "Since Igbo society lacked centralized chiefs, the British had to impose warrant chiefs, which often lacked legitimacy and caused unrest including the 1929 Aba Women's Riot."
  },
  {
    question: "The 1914 amalgamation is often criticized by scholars primarily because it:",
    options: [
      "Reduced Nigeria's population",
      "Ended British colonial rule",
      "United peoples with vastly different cultures and administrative systems for British economic convenience",
      "Created too many ethnic groups"
    ],
    answer: 2,
    explanation: "Critics argue the amalgamation merged diverse peoples without regard for their cultural, religious, and political differences, mainly to ease British administrative and economic interests."
  },
  {
    question: "Traditional education in pre-colonial Nigeria was primarily aimed at:",
    options: [
      "Preparing for international trade only",
      "Preparing individuals for white-collar jobs",
      "Teaching Western literacy",
      "Integrating the individual into the community and imparting vocational/moral skills"
    ],
    answer: 3,
    explanation: "Indigenous education focused on character formation, vocational skills, and socialization into communal values rather than formal literacy."
  },
  {
    question: "Western formal education was first introduced into Nigeria by:",
    options: [
      "Christian missionaries",
      "Traditional rulers",
      "Islamic scholars",
      "The colonial government"
    ],
    answer: 0,
    explanation: "Christian missionaries established the earliest formal Western schools in Nigeria, beginning in the coastal areas in the 19th century."
  },
  {
    question: "The first Western-style school in Nigeria was established in:",
    options: [
      "Kano",
      "Badagry",
      "Calabar",
      "Lagos"
    ],
    answer: 1,
    explanation: "The first mission school, Nursery of the Infant Church, was established in Badagry in 1843 by Methodist missionaries."
  },
  {
    question: "Quranic (Islamic) education in Northern Nigeria historically emphasized:",
    options: [
      "Memorization and study of the Quran and Arabic literacy",
      "Western science",
      "Vocational carpentry only",
      "Physical education"
    ],
    answer: 0,
    explanation: "Traditional Islamic education (Almajiri system) centered on Quranic memorization, Arabic language, and Islamic jurisprudence."
  },
  {
    question: "The Ashby Commission of 1959 was set up to:",
    options: [
      "Draft Nigeria's independence constitution",
      "Establish the Central Bank of Nigeria",
      "Review and plan Nigeria's higher education needs",
      "Create Nigeria's first political parties"
    ],
    answer: 2,
    explanation: "The Ashby Commission investigated Nigeria's needs in higher education, leading to the establishment of more universities post-independence."
  },
  {
    question: "Education is linked to national development mainly because it:",
    options: [
      "Increases population growth",
      "Eliminates the need for governance",
      "Reduces the number of ethnic groups",
      "Develops human capital necessary for socio-economic progress"
    ],
    answer: 3,
    explanation: "Education builds skills, knowledge, and critical thinking that drive economic productivity, innovation, and civic participation — key pillars of national development."
  },
  {
    question: "The pre-colonial Nigerian economy was primarily based on:",
    options: [
      "Industrial manufacturing",
      "Agriculture, trade, and craft production",
      "Oil exports",
      "Banking and finance"
    ],
    answer: 1,
    explanation: "Before colonization, Nigerian communities relied on farming, local and long-distance trade including trans-Saharan trade, and craftsmanship such as weaving and blacksmithing."
  },
  {
    question: "The Trans-Saharan trade route connected pre-colonial Northern Nigeria with:",
    options: [
      "Southern Africa",
      "Europe directly",
      "North Africa and the Mediterranean world",
      "The Americas"
    ],
    answer: 2,
    explanation: "The Trans-Saharan trade linked Northern Nigerian kingdoms like Kanem-Borno to North African markets, exchanging goods such as salt, gold, and slaves."
  },
  {
    question: "The colonial economy in Nigeria was primarily structured to:",
    options: [
      "Promote industrialization within Nigeria",
      "Encourage Nigerian self-sufficiency",
      "Establish Nigeria as a manufacturing hub",
      "Extract raw materials for the benefit of the metropole (Britain)"
    ],
    answer: 3,
    explanation: "Colonial economic policy was extractive, focused on exporting raw materials like palm oil, cocoa, and groundnuts to Britain while importing finished goods."
  },
  {
    question: "The discovery of crude oil in commercial quantity in Nigeria occurred in Oloibiri in the year:",
    options: [
      "1956",
      "1960",
      "1946",
      "1970"
    ],
    answer: 0,
    explanation: "Shell-BP discovered oil in commercial quantities at Oloibiri, in present-day Bayelsa State, in 1956."
  },
  {
    question: "Nigeria's over-dependence on oil revenue is often criticized because it:",
    options: [
      "Increased manufacturing output",
      "Diversified the economy successfully",
      "Led to neglect of agriculture and other sectors",
      "Eliminated corruption"
    ],
    answer: 2,
    explanation: "The oil boom led to the neglect of agriculture and manufacturing, a phenomenon often referred to as the resource curse or Dutch disease."
  },
  {
    question: "Indigenous religions in pre-colonial Nigeria were largely characterized by:",
    options: [
      "Atheism",
      "Monotheism only",
      "Organized centralized churches",
      "Belief in a Supreme Being, ancestral spirits, and deities"
    ],
    answer: 3,
    explanation: "Traditional Nigerian religions typically involved belief in a Supreme Being, lesser gods/deities, and ancestor veneration, expressed through rituals and festivals."
  },
  {
    question: "Islam was introduced into Northern Nigeria primarily through:",
    options: [
      "British colonial administrators",
      "Trans-Saharan trade and Arab/Berber influence",
      "Portuguese missionaries",
      "American missionaries"
    ],
    answer: 1,
    explanation: "Islam spread into Northern Nigeria via trade routes across the Sahara, facilitated by Arab and Berber traders and scholars from as early as the 11th century."
  },
  {
    question: "The Sokoto Jihad led by Usman Dan Fodio in 1804 primarily aimed to:",
    options: [
      "Reform and purify Islamic practice and establish an Islamic state",
      "Establish British rule",
      "Create the Yoruba kingdom",
      "Introduce Christianity"
    ],
    answer: 0,
    explanation: "Dan Fodio's jihad sought to purify Islamic practices among the Hausa states and establish the Sokoto Caliphate governed by Islamic law."
  },
  {
    question: "Christianity was reintroduced to Nigeria in the 19th century primarily through:",
    options: [
      "Trans-Saharan traders",
      "The Sokoto Caliphate",
      "The Benin Kingdom",
      "European missionary societies"
    ],
    answer: 3,
    explanation: "European and returnee ex-slave missionaries reintroduced Christianity to coastal Nigeria in the 19th century, following earlier Portuguese attempts in the 15th-16th centuries."
  },
  {
    question: "Religion has contributed to national development in Nigeria primarily through:",
    options: [
      "Establishment of schools, hospitals, and moral value systems",
      "Fueling ethnic division only",
      "Discouraging trade",
      "Preventing education"
    ],
    answer: 0,
    explanation: "Both Christian and Islamic institutions historically built schools and hospitals and promoted moral and social values that contributed to societal development."
  },
  {
    question: "Religious pluralism in Nigeria, while enriching, has also been a source of:",
    options: [
      "Economic growth exclusively",
      "Inter-religious tension and conflict",
      "National unity only",
      "Educational advancement only"
    ],
    answer: 1,
    explanation: "Nigeria's religious diversity has at times fueled tension, particularly where religion intersects with ethnic and political interests."
  },
  {
    question: "Socio-political rights refer to:",
    options: [
      "Rights limited to voting only",
      "Rights only for traditional rulers",
      "Entitlements guaranteeing citizens' participation in social and political life",
      "Economic privileges of the elite"
    ],
    answer: 2,
    explanation: "Socio-political rights encompass freedoms such as expression, association, and political participation that enable citizens to engage meaningfully in society and governance."
  },
  {
    question: "In pre-colonial Nigerian societies, moral values were primarily transmitted through:",
    options: [
      "Colonial legislation",
      "Formal written law codes",
      "The internet",
      "Oral tradition, proverbs, and customs"
    ],
    answer: 3,
    explanation: "Moral and ethical values in traditional Nigerian societies were passed down through oral traditions, storytelling, proverbs, and communal customs."
  },
  {
    question: "The 1999 Nigerian Constitution (as amended) guarantees fundamental human rights in:",
    options: [
      "Chapter IV",
      "Chapter VI",
      "Chapter II",
      "Chapter I"
    ],
    answer: 0,
    explanation: "Chapter IV of the 1999 Constitution specifically outlines the Fundamental Human Rights of Nigerian citizens, including rights to life, dignity, and freedom of expression."
  },
  {
    question: "Chapter II of the 1999 Constitution, dealing with Fundamental Objectives and Directive Principles of State Policy, is:",
    options: [
      "Applicable only to state governors",
      "Fully justiciable in court",
      "Non-justiciable",
      "Applicable only to the military"
    ],
    answer: 2,
    explanation: "Chapter II provisions are considered directive principles guiding government policy but are non-justiciable, meaning citizens cannot sue to enforce them directly in court."
  },
  {
    question: "The right to freedom of expression in Nigeria is important for national development because it:",
    options: [
      "Limits citizen participation",
      "Enables accountability and civic engagement",
      "Encourages authoritarian rule",
      "Prevents economic growth"
    ],
    answer: 1,
    explanation: "Freedom of expression allows citizens to hold leaders accountable, participate in public discourse, and contribute to democratic governance."
  },
  {
    question: "Social justice in the Nigerian context primarily refers to:",
    options: [
      "Military rule",
      "Preferential treatment for one ethnic group",
      "Fair and equitable treatment, access to resources and opportunities for all citizens",
      "Equal distribution of wealth only"
    ],
    answer: 2,
    explanation: "Social justice involves fairness in the distribution of resources, opportunities, and privileges, and equal treatment under the law regardless of ethnicity, religion, or status."
  },
  {
    question: "The Federal Character Principle in Nigeria was introduced primarily to:",
    options: [
      "Abolish the federal system",
      "Ensure equitable representation of Nigeria's diverse groups in government and public institutions",
      "Reduce the number of states",
      "Promote a single ethnic group's dominance"
    ],
    answer: 1,
    explanation: "The Federal Character Principle aims to prevent domination by a few groups and ensure fair representation of all Nigerian groups in public appointments."
  },
  {
    question: "Which historical event highlighted the struggle for social justice among Nigerian women in the colonial era?",
    options: [
      "The Aba Women's Riot of 1929",
      "The Sokoto Jihad",
      "The Berlin Conference",
      "Amalgamation of 1914"
    ],
    answer: 0,
    explanation: "The Aba Women's Riot was a protest by Igbo and Ibibio women against colonial taxation policies and the warrant chief system, symbolizing resistance for justice and rights."
  },
  {
    question: "National integration in Nigeria is challenged mainly by:",
    options: [
      "Absence of natural resources",
      "Lack of a written constitution",
      "Uniform culture across the country",
      "Ethnic, religious, and regional diversity coupled with resource competition"
    ],
    answer: 3,
    explanation: "Nigeria's deep ethnic, religious, and regional diversity, combined with competition over resources and political power, poses ongoing challenges to national unity."
  },
  {
    question: "The concept of 'unity in diversity' as applied to Nigeria emphasizes:",
    options: [
      "Peaceful coexistence and cooperation despite cultural differences",
      "Elimination of ethnic differences",
      "Isolation of ethnic groups",
      "Dominance of one culture over others"
    ],
    answer: 0,
    explanation: "Unity in diversity promotes the idea that Nigeria's different ethnic and cultural groups can coexist harmoniously while contributing collectively to national development."
  },
  {
    question: "The 1999 Constitution's provision for 'Federal Character' is most directly linked to promoting which value?",
    options: [
      "Military governance",
      "Regional secession",
      "Equity and inclusiveness in national development",
      "Ethnic marginalization"
    ],
    answer: 2,
    explanation: "Federal Character ensures inclusiveness by preventing any single ethnic or regional group from monopolizing government positions and resources, fostering national cohesion."
  },
  {
    question: "A major lesson from Nigeria's pre-colonial political systems for contemporary governance is:",
    options: [
      "Centralized systems are always superior",
      "Only monarchy works in Africa",
      "Traditional systems have no relevance today",
      "Different governance structures (centralized and decentralized) can effectively organize society when suited to context"
    ],
    answer: 3,
    explanation: "Nigeria's pre-colonial history shows diverse successful governance models, demonstrating that governance structures should fit societal context."
  },
  {
    question: "The overarching goal of studying Nigerian Peoples and Culture (GST 112) is to:",
    options: [
      "Promote a single ethnic identity",
      "Foster mutual understanding, national consciousness, and unity among Nigerian students",
      "Discourage cultural diversity",
      "Focus solely on colonial history"
    ],
    answer: 1,
    explanation: "GST 112 is designed to expose students to Nigeria's diverse peoples, history, and culture in order to promote national consciousness, tolerance, and unity among the citizenry."
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
const MTH132B = [
  {
    question: "If f(x) = 2x² − 3x + 1, find f(−2).",
    options: [
      "11",
      "15",
      "3",
      "7"
    ],
    answer: 1,
    explanation: "f(−2) = 2(4) − 3(−2) + 1 = 8 + 6 + 1 = 15."
  },
  {
    question: "Which of the following best describes a function?",
    options: [
      "A rule that assigns every output to exactly one input",
      "A relation where inputs can repeat with different outputs",
      "Any set of ordered pairs",
      "A rule that assigns every input to exactly one output"
    ],
    answer: 3,
    explanation: "Each element of the domain maps to a unique element of the range."
  },
  {
    question: "Evaluate lim (x→3) (x² − 9)/(x − 3).",
    options: [
      "9",
      "6",
      "0",
      "Undefined"
    ],
    answer: 1,
    explanation: "Factor: (x−3)(x+3)/(x−3) = x+3. As x→3, limit = 6."
  },
  {
    question: "A function f is continuous at x = a if:",
    options: [
      "f(a) exists only",
      "lim(x→a) f(x) = f(a)",
      "f is differentiable at a",
      "lim(x→a) f(x) exists only"
    ],
    answer: 1,
    explanation: "Continuity requires the value and limit to exist and be equal."
  },
  {
    question: "Differentiate y = 5x³ − 4x² + 7.",
    options: [
      "5x² − 8x",
      "15x² − 8x",
      "15x³ − 8x",
      "15x² − 8x + 7"
    ],
    answer: 1,
    explanation: "dy/dx = 15x² − 8x since the constant term differentiates to 0."
  },
  {
    question: "The derivative of a function at a point represents:",
    options: [
      "The instantaneous rate of change at that point",
      "The area under the curve",
      "The average rate of change over an interval",
      "The total displacement"
    ],
    answer: 0,
    explanation: "f'(a) gives the slope of the tangent line at that point."
  },
  {
    question: "Find dy/dx if y = (3x + 1)⁴.",
    options: [
      "4(3x+1)³",
      "3(3x+1)³",
      "12(3x+1)³",
      "12(3x+1)⁴"
    ],
    answer: 2,
    explanation: "Chain rule: dy/dx = 4(3x+1)³ · 3 = 12(3x+1)³."
  },
  {
    question: "At a local maximum point of a differentiable function, the second derivative is generally:",
    options: [
      "Undefined",
      "Positive",
      "Negative",
      "Zero always"
    ],
    answer: 2,
    explanation: "A negative second derivative indicates downward concavity at a maximum."
  },
  {
    question: "Find the critical points of f(x) = x³ − 3x + 2.",
    options: [
      "x = 1 only",
      "x = 1 and x = −1",
      "x = 3 and x = −3",
      "x = 0 only"
    ],
    answer: 1,
    explanation: "f'(x) = 3x² − 3 = 0 gives x = ±1."
  },
  {
    question: "∫(4x³ − 6x + 5) dx = ?",
    options: [
      "4x⁴ − 3x² + 5x + C",
      "12x² − 6 + C",
      "x⁴ − 6x² + 5x + C",
      "x⁴ − 3x² + 5x + C"
    ],
    answer: 3,
    explanation: "Integrate term by term: 4x³→x⁴, −6x→−3x², 5→5x."
  },
  {
    question: "Which statement about indefinite integrals is true?",
    options: [
      "They are equal to the derivative of the function",
      "They represent a family of functions differing by a constant",
      "They always have a unique numerical value",
      "They require specified limits"
    ],
    answer: 1,
    explanation: "Antiderivatives are defined up to an arbitrary constant C."
  },
  {
    question: "Evaluate ∫₁³ (2x) dx.",
    options: [
      "4",
      "6",
      "8",
      "9"
    ],
    answer: 2,
    explanation: "∫2x dx = x². Evaluate: 9 − 1 = 8."
  },
  {
    question: "The definite integral ∫ₐᵇ f(x)dx geometrically represents:",
    options: [
      "The rate of change of f(x)",
      "The net signed area between f(x) and the x-axis from a to b",
      "The maximum value of f(x)",
      "The slope of f(x) between a and b"
    ],
    answer: 1,
    explanation: "This is the fundamental geometric interpretation of the definite integral."
  },
  {
    question: "Find the area bounded by y = x² and the x-axis from x = 0 to x = 2.",
    options: [
      "2",
      "16/3",
      "8/3",
      "4"
    ],
    answer: 2,
    explanation: "∫₀² x² dx = [x³/3]₀² = 8/3."
  },
  {
    question: "The equation of a straight line with slope 2 passing through (1, 3) is:",
    options: [
      "y = 2x + 5",
      "y = 2x + 3",
      "y = 2x + 1",
      "y = 2x − 1"
    ],
    answer: 2,
    explanation: "y − 3 = 2(x − 1) gives y = 2x + 1."
  },
  {
    question: "Two lines are perpendicular if the product of their slopes equals:",
    options: [
      "0",
      "Undefined",
      "1",
      "−1"
    ],
    answer: 3,
    explanation: "Perpendicularity condition: m₁ × m₂ = −1."
  },
  {
    question: "Find the distance between points (2, 3) and (5, 7).",
    options: [
      "6",
      "5",
      "7",
      "4"
    ],
    answer: 1,
    explanation: "d = √[(5−2)² + (7−3)²] = √25 = 5."
  },
  {
    question: "The general equation of a circle with center (a, b) and radius r is:",
    options: [
      "x² − y² = r²",
      "(x+a)² + (y+b)² = r",
      "(x−a)² + (y−b)² = r²",
      "x² + y² = r²"
    ],
    answer: 2,
    explanation: "This is the standard form of a circle centered at (a,b)."
  },
  {
    question: "Which of the following is NOT a property required for a limit to exist at x = a?",
    options: [
      "Left and right limits must be equal",
      "The left-hand limit must exist",
      "f(a) must be defined",
      "The right-hand limit must exist"
    ],
    answer: 2,
    explanation: "A limit can exist even if the function is undefined there."
  },
  {
    question: "Find lim (x→0) (sin x)/x.",
    options: [
      "Infinity",
      "Undefined",
      "0",
      "1"
    ],
    answer: 3,
    explanation: "A standard trigonometric limit, provable via the squeeze theorem."
  },
  {
    question: "If f(x) = 1/(x−2), the function is discontinuous at:",
    options: [
      "x = 2",
      "x = −2",
      "x = 1",
      "x = 0"
    ],
    answer: 0,
    explanation: "The denominator becomes zero at x = 2."
  },
  {
    question: "Find the derivative of y = ln(x² + 1).",
    options: [
      "x/(x²+1)",
      "2x",
      "1/(x²+1)",
      "2x/(x²+1)"
    ],
    answer: 3,
    explanation: "Chain rule: dy/dx = (1/(x²+1)) · 2x = 2x/(x²+1)."
  },
  {
    question: "A function is said to be increasing on an interval if:",
    options: [
      "f'(x) < 0 throughout the interval",
      "f''(x) > 0 throughout the interval",
      "f'(x) = 0 throughout the interval",
      "f'(x) > 0 throughout the interval"
    ],
    answer: 3,
    explanation: "A positive derivative means the function's values are rising."
  },
  {
    question: "Find the slope of the tangent to y = x² − 4x at x = 3.",
    options: [
      "2",
      "1",
      "−1",
      "3"
    ],
    answer: 0,
    explanation: "y' = 2x − 4. At x = 3: 2(3) − 4 = 2."
  },
  {
    question: "Which of these represents an even function?",
    options: [
      "f(x) = x",
      "f(x) = sin(x)",
      "f(x) = x³",
      "f(x) = x² + 1"
    ],
    answer: 3,
    explanation: "f(−x) = f(x): (−x)² + 1 = x² + 1."
  },
  {
    question: "Using the product rule, differentiate y = x²·sin(x).",
    options: [
      "x²·cos(x)",
      "2x·cos(x)",
      "2x·sin(x) − x²·cos(x)",
      "2x·sin(x) + x²·cos(x)"
    ],
    answer: 3,
    explanation: "Product rule: (uv)' = u'v + uv' = 2x·sin(x) + x²·cos(x)."
  },
  {
    question: "The Mean Value Theorem requires the function to be:",
    options: [
      "Continuous on [a,b] and differentiable on (a,b)",
      "Only continuous on [a,b]",
      "Only differentiable on [a,b]",
      "Continuous and differentiable everywhere on ℝ"
    ],
    answer: 0,
    explanation: "These are the standard hypotheses of the Mean Value Theorem."
  },
  {
    question: "Find the maximum value of f(x) = −x² + 4x + 1.",
    options: [
      "4",
      "3",
      "5",
      "1"
    ],
    answer: 2,
    explanation: "f'(x) = 0 at x = 2. f(2) = 5, and f''(x) < 0 confirms a maximum."
  },
  {
    question: "In optimization problems, a critical point where f'(x) = 0 but f''(x) = 0 also requires:",
    options: [
      "Further testing, since the second derivative test is inconclusive",
      "No further analysis; it is automatically a minimum",
      "No further analysis; it is automatically a maximum",
      "It cannot be a critical point"
    ],
    answer: 0,
    explanation: "When f''(x) = 0, the second derivative test fails to classify the point."
  },
  {
    question: "Find ∫ cos(x) dx.",
    options: [
      "−cos(x) + C",
      "cos(x) + C",
      "−sin(x) + C",
      "sin(x) + C"
    ],
    answer: 3,
    explanation: "The antiderivative of cos(x) is sin(x)."
  },
  {
    question: "Find the volume of the solid formed when y = x is rotated about the x-axis from x = 0 to x = 2.",
    options: [
      "2π",
      "16π/3",
      "8π/3",
      "4π"
    ],
    answer: 2,
    explanation: "V = π∫₀² x² dx = π(8/3) = 8π/3."
  },
  {
    question: "The technique of integration by substitution is most useful when:",
    options: [
      "The limits of integration are equal",
      "The integrand is a simple polynomial",
      "The integrand is a constant",
      "The integrand contains a composite function whose derivative is also present"
    ],
    answer: 3,
    explanation: "Substitution replaces a composite expression and its derivative with one variable."
  },
  {
    question: "Evaluate ∫ (2x)(x²+1)⁴ dx using substitution.",
    options: [
      "(x²+1)⁴/4 + C",
      "5(x²+1)⁵ + C",
      "(x²+1)⁵ + C",
      "(x²+1)⁵/5 + C"
    ],
    answer: 3,
    explanation: "Let u = x²+1, du = 2x dx. Integral becomes u⁵/5 + C."
  },
  {
    question: "Which of the following correctly states the Fundamental Theorem of Calculus (Part 1)?",
    options: [
      "It states that differentiation and integration are inverse processes",
      "It gives the formula for area of a circle",
      "It defines the limit of a function",
      "It connects continuity and differentiability"
    ],
    answer: 0,
    explanation: "The FTC shows differentiation and integration undo each other."
  },
  {
    question: "Find the equation of the tangent line to y = x² at the point (2, 4).",
    options: [
      "y = 2x − 4",
      "y = 2x",
      "y = 4x + 4",
      "y = 4x − 4"
    ],
    answer: 3,
    explanation: "y' = 2x, slope at x=2 is 4. Line: y = 4x − 4."
  },
  {
    question: "The point-slope form of a straight line is given by:",
    options: [
      "y = mx + c",
      "ax + by + c = 0",
      "x/a + y/b = 1",
      "y − y₁ = m(x − x₁)"
    ],
    answer: 3,
    explanation: "This is the standard point-slope formula."
  },
  {
    question: "Find the midpoint of the line segment joining (4, −2) and (−2, 6).",
    options: [
      "(1, 4)",
      "(2, 2)",
      "(1, 2)",
      "(3, 2)"
    ],
    answer: 2,
    explanation: "Midpoint = ((4+(−2))/2, (−2+6)/2) = (1, 2)."
  },
  {
    question: "A function f(x) has a removable discontinuity at x = a if:",
    options: [
      "f(x) is a constant function",
      "The function is undefined for all x",
      "The limit exists at x = a but does not equal f(a), or f(a) is undefined",
      "The limit does not exist at x = a"
    ],
    answer: 2,
    explanation: "A removable discontinuity is a mismatch between the limit and the function value."
  },
  {
    question: "Differentiate y = e^(3x).",
    options: [
      "e^(x)",
      "3e^(3x)",
      "e^(3x)",
      "3xe^(3x−1)"
    ],
    answer: 1,
    explanation: "By chain rule, derivative of e^(kx) is k·e^(kx)."
  },
  {
    question: "In the study of rates of change, if s(t) represents displacement, then s'(t) represents:",
    options: [
      "Jerk",
      "Position",
      "Velocity",
      "Acceleration"
    ],
    answer: 2,
    explanation: "The first derivative of displacement gives velocity."
  },
  {
    question: "Find the second derivative of f(x) = x⁴ − 2x².",
    options: [
      "4x³ − 4x",
      "4x² − 4",
      "12x²",
      "12x² − 4"
    ],
    answer: 3,
    explanation: "f'(x) = 4x³ − 4x, f''(x) = 12x² − 4."
  },
  {
    question: "A point of inflection occurs where:",
    options: [
      "f'(x) = 0 only",
      "f''(x) changes sign",
      "f(x) = 0",
      "f'(x) is undefined only"
    ],
    answer: 1,
    explanation: "A point of inflection is identified by a sign change in the second derivative."
  },
  {
    question: "Find the area between the curve y = 4 − x² and the x-axis from x = −2 to x = 2.",
    options: [
      "16/3",
      "8",
      "32/3",
      "10"
    ],
    answer: 2,
    explanation: "∫₋₂² (4−x²)dx = 32/3."
  },
  {
    question: "For the general quadratic function f(x) = ax² + bx + c with a > 0, the graph is:",
    options: [
      "A parabola opening upwards",
      "A straight line",
      "A parabola opening downwards",
      "A circle"
    ],
    answer: 0,
    explanation: "A positive leading coefficient gives a parabola opening upward."
  },
  {
    question: "Evaluate lim (x→∞) (3x² + 2x)/(x² − 5).",
    options: [
      "1",
      "3",
      "0",
      "Infinity"
    ],
    answer: 1,
    explanation: "Dividing by x², the limit approaches 3/1 = 3."
  },
  {
    question: "The derivative of a constant function is always:",
    options: [
      "Equal to 1",
      "Equal to the constant",
      "Zero",
      "Undefined"
    ],
    answer: 2,
    explanation: "A constant function has no rate of change."
  },
  {
    question: "Find ∫₀^(π/2) cos(x) dx.",
    options: [
      "1",
      "0",
      "−1",
      "π/2"
    ],
    answer: 0,
    explanation: "sin(π/2) − sin(0) = 1."
  },
  {
    question: "Which of the following best describes an asymptote of a function?",
    options: [
      "A line that the graph approaches but never touches as x or y tends to infinity",
      "The maximum value of the function",
      "A point of discontinuity only",
      "A point where the function crosses the x-axis"
    ],
    answer: 0,
    explanation: "Asymptotes describe the long-run boundary behavior of a curve."
  },
  {
    question: "A car's velocity is given by v(t) = 3t² − 2t. Find the distance travelled between t = 0 and t = 2.",
    options: [
      "6",
      "10",
      "4",
      "8"
    ],
    answer: 2,
    explanation: "∫₀²(3t²−2t)dt = [t³−t²]₀² = 8−4 = 4."
  },
  {
    question: "In analytic geometry, the general form of a parabola with vertical axis of symmetry is:",
    options: [
      "x² + y² = r²",
      "(x−a)² + (y−b)² = r²",
      "x = ay² + by + c",
      "y = ax² + bx + c"
    ],
    answer: 3,
    explanation: "This standard quadratic form gives a parabola with a vertical axis of symmetry."
  }
];

const MTH132C = [
  {
    question: "If g(x) = √(x + 4), what is the domain of g?",
    options: [
      "All real numbers",
      "x ≤ −4",
      "x ≥ −4",
      "x ≥ 4"
    ],
    answer: 2,
    explanation: "The expression under the root must be non-negative: x ≥ −4."
  },
  {
    question: "A one-to-one function is one where:",
    options: [
      "It is always increasing",
      "Every input has multiple outputs",
      "The domain equals the range",
      "Every output has exactly one input mapped to it"
    ],
    answer: 3,
    explanation: "This is the injective property: distinct inputs give distinct outputs."
  },
  {
    question: "Evaluate lim (x→2) (x² − x − 2)/(x − 2).",
    options: [
      "3",
      "1",
      "2",
      "4"
    ],
    answer: 0,
    explanation: "Factor: (x−2)(x+1)/(x−2) = x+1. As x→2, limit = 3."
  },
  {
    question: "Which type of discontinuity occurs when a function has a vertical asymptote?",
    options: [
      "Removable discontinuity",
      "Jump discontinuity",
      "No discontinuity occurs",
      "Infinite discontinuity"
    ],
    answer: 3,
    explanation: "Near a vertical asymptote, function values grow without bound."
  },
  {
    question: "Differentiate y = 7x⁴ − 2x³ + x.",
    options: [
      "28x⁴ − 6x² + 1",
      "28x³ − 6x² + 1",
      "7x³ − 6x² + 1",
      "28x³ − 6x²"
    ],
    answer: 1,
    explanation: "Differentiate term by term: 7x⁴→28x³, −2x³→−6x², x→1."
  },
  {
    question: "The chain rule is applied when differentiating:",
    options: [
      "A sum of two functions",
      "A composite function",
      "A constant function",
      "A product of two functions"
    ],
    answer: 1,
    explanation: "The chain rule handles functions nested within other functions."
  },
  {
    question: "Find dy/dx if y = (2x − 5)³.",
    options: [
      "6(2x−5)³",
      "2(2x−5)²",
      "6(2x−5)²",
      "3(2x−5)²"
    ],
    answer: 2,
    explanation: "Chain rule: dy/dx = 3(2x−5)² · 2 = 6(2x−5)²."
  },
  {
    question: "At an inflection point, which of the following must be true?",
    options: [
      "f''(x) = 0 or undefined, with a sign change",
      "f'(x) = 0",
      "f(x) = 0",
      "f'(x) is at a maximum"
    ],
    answer: 0,
    explanation: "An inflection point requires the concavity to change."
  },
  {
    question: "Find the critical points of f(x) = x³ − 6x² + 9x.",
    options: [
      "x = 1, x = 2",
      "x = 2, x = 3",
      "x = 1, x = 3",
      "x = 0, x = 3"
    ],
    answer: 2,
    explanation: "f'(x) = 3(x−1)(x−3) = 0 gives x = 1, 3."
  },
  {
    question: "∫(6x² − 4x + 3) dx = ?",
    options: [
      "2x³ − 2x² + 3x + C",
      "2x³ − 4x² + 3x + C",
      "12x − 4 + C",
      "6x³ − 4x² + 3x + C"
    ],
    answer: 0,
    explanation: "Integrate term by term: 6x²→2x³, −4x→−2x², 3→3x."
  },
  {
    question: "Which of the following is true regarding definite and indefinite integrals?",
    options: [
      "A definite integral yields a numerical value; an indefinite integral yields a function plus a constant",
      "Both always include a constant of integration",
      "There is no difference between them",
      "A definite integral yields a function; an indefinite integral yields a number"
    ],
    answer: 0,
    explanation: "Definite integrals give a number; indefinite integrals give a general antiderivative."
  },
  {
    question: "Evaluate ∫₀² (3x²) dx.",
    options: [
      "6",
      "4",
      "9",
      "8"
    ],
    answer: 3,
    explanation: "∫3x² dx = x³. Evaluate: 8 − 0 = 8."
  },
  {
    question: "If a curve lies entirely below the x-axis between a and b, the definite integral ∫ₐᵇ f(x)dx will be:",
    options: [
      "Always negative",
      "Always zero",
      "Undefined",
      "Always positive"
    ],
    answer: 0,
    explanation: "Since f(x) < 0 throughout, the signed area is negative."
  },
  {
    question: "Find the area bounded by y = 3x² and the x-axis from x = 1 to x = 3.",
    options: [
      "18",
      "26",
      "30",
      "24"
    ],
    answer: 1,
    explanation: "∫₁³ 3x² dx = [x³]₁³ = 27 − 1 = 26."
  },
  {
    question: "Find the equation of a line passing through (−1, 2) with slope −3.",
    options: [
      "y = 3x − 1",
      "y = −3x − 2",
      "y = −3x + 2",
      "y = −3x − 1"
    ],
    answer: 3,
    explanation: "y − 2 = −3(x+1) gives y = −3x − 1."
  },
  {
    question: "Two lines are parallel if:",
    options: [
      "Their slopes are equal",
      "They intersect at one point",
      "Their slopes are negative reciprocals",
      "Their y-intercepts are equal"
    ],
    answer: 0,
    explanation: "Parallel lines maintain the same gradient."
  },
  {
    question: "Find the distance between points (−3, 1) and (1, −2).",
    options: [
      "6",
      "5",
      "3",
      "4"
    ],
    answer: 1,
    explanation: "d = √[(1+3)² + (−2−1)²] = √25 = 5."
  },
  {
    question: "The equation x²/9 + y²/4 = 1 represents:",
    options: [
      "An ellipse",
      "A parabola",
      "A hyperbola",
      "A circle"
    ],
    answer: 0,
    explanation: "This is the standard form of an ellipse."
  },
  {
    question: "For lim (x→a) f(x) to exist, which condition is essential?",
    options: [
      "f(a) must be defined",
      "The function must be a polynomial",
      "f must be increasing near a",
      "The left-hand and right-hand limits must both exist and be equal"
    ],
    answer: 3,
    explanation: "This is the formal requirement for a two-sided limit to exist."
  },
  {
    question: "Find lim (x→0) (1 − cos x)/x².",
    options: [
      "Infinity",
      "1/2",
      "0",
      "1"
    ],
    answer: 1,
    explanation: "A standard limit result: lim = 1/2."
  },
  {
    question: "If f(x) = (x−1)/(x²−1), the function has a removable discontinuity at:",
    options: [
      "x = 0",
      "x = 2",
      "x = −1",
      "x = 1"
    ],
    answer: 3,
    explanation: "f(x) simplifies to 1/(x+1) for x≠1, so x=1 is removable."
  },
  {
    question: "Find the derivative of y = cos(3x²).",
    options: [
      "−6x·sin(3x²)",
      "6x·cos(3x²)",
      "−sin(3x²)",
      "−6x²·sin(3x)"
    ],
    answer: 0,
    explanation: "Chain rule: dy/dx = −sin(3x²) · 6x."
  },
  {
    question: "A function is concave up on an interval when:",
    options: [
      "f(x) > 0",
      "f''(x) > 0",
      "f'(x) > 0",
      "f''(x) < 0"
    ],
    answer: 1,
    explanation: "Positive second derivative means the graph curves upward."
  },
  {
    question: "Find the slope of the tangent to y = x³ − 2x at x = 1.",
    options: [
      "3",
      "1",
      "2",
      "0"
    ],
    answer: 1,
    explanation: "y' = 3x² − 2. At x=1: 1."
  },
  {
    question: "Which of these is an odd function?",
    options: [
      "f(x) = |x|",
      "f(x) = cos(x)",
      "f(x) = x³ − x",
      "f(x) = x² + 3"
    ],
    answer: 2,
    explanation: "f(−x) = −f(x): (−x)³ − (−x) = −(x³−x)."
  },
  {
    question: "Using the quotient rule, differentiate y = x/(x+1).",
    options: [
      "x/(x+1)²",
      "−1/(x+1)²",
      "1/(x+1)",
      "1/(x+1)²"
    ],
    answer: 3,
    explanation: "Quotient rule gives [x+1−x]/(x+1)² = 1/(x+1)²."
  },
  {
    question: "Rolle's Theorem is a special case of which theorem?",
    options: [
      "The Fundamental Theorem of Calculus",
      "The Squeeze Theorem",
      "The Mean Value Theorem",
      "The Intermediate Value Theorem"
    ],
    answer: 2,
    explanation: "Rolle's Theorem applies when f(a) = f(b), a special case of the MVT."
  },
  {
    question: "Find the minimum value of f(x) = x² − 6x + 10.",
    options: [
      "0",
      "1",
      "2",
      "−1"
    ],
    answer: 1,
    explanation: "f'(x)=0 at x=3. f(3)=1, and f''(x)=2>0 confirms a minimum."
  },
  {
    question: "Which statement about optimization problems is correct?",
    options: [
      "They cannot be solved using derivatives",
      "They only apply to physics problems",
      "They always require integration",
      "They involve finding maximum or minimum values of a function, often subject to constraints"
    ],
    answer: 3,
    explanation: "Optimization uses derivatives to find extreme values under constraints."
  },
  {
    question: "Find ∫ sin(x) dx.",
    options: [
      "−sin(x) + C",
      "−cos(x) + C",
      "cos(x) + C",
      "sin(x) + C"
    ],
    answer: 1,
    explanation: "The antiderivative of sin(x) is −cos(x)."
  },
  {
    question: "Find the volume generated when y = √x is rotated about the x-axis from x = 0 to x = 4.",
    options: [
      "16π",
      "8π",
      "4π",
      "2π"
    ],
    answer: 1,
    explanation: "V = π∫₀⁴ x dx = π(16/2) = 8π."
  },
  {
    question: "Integration by parts is derived from which differentiation rule?",
    options: [
      "The power rule",
      "The chain rule",
      "The product rule",
      "The quotient rule"
    ],
    answer: 2,
    explanation: "Integration by parts rearranges the product rule for differentiation."
  },
  {
    question: "Evaluate ∫ x·cos(x²) dx using substitution.",
    options: [
      "sin(x²)/2 + C",
      "2sin(x²) + C",
      "−sin(x²)/2 + C",
      "sin(x²) + C"
    ],
    answer: 0,
    explanation: "Let u = x², du = 2x dx. Integral becomes sin(u)/2 + C."
  },
  {
    question: "The Fundamental Theorem of Calculus (Part 2) is primarily used to:",
    options: [
      "Evaluate definite integrals using antiderivatives",
      "Find derivatives of implicit functions",
      "Find the domain of a function",
      "Determine continuity at a point"
    ],
    answer: 0,
    explanation: "It allows definite integrals to be computed as F(b) − F(a)."
  },
  {
    question: "Find the equation of the tangent line to y = x² − 3x at the point (1, −2).",
    options: [
      "y = −x − 1",
      "y = −x",
      "y = −x + 1",
      "y = x − 1"
    ],
    answer: 0,
    explanation: "y' = 2x − 3, slope at x=1 is −1. Line: y = −x − 1."
  },
  {
    question: "The general form of a linear equation in two variables is:",
    options: [
      "x² + y² = r²",
      "y = mx + c",
      "y − y₁ = m(x − x₁)",
      "ax + by + c = 0"
    ],
    answer: 3,
    explanation: "This standard general form represents any straight line."
  },
  {
    question: "Find the midpoint of the segment joining (−5, 3) and (7, −9).",
    options: [
      "(2, −3)",
      "(6, −3)",
      "(1, −6)",
      "(1, −3)"
    ],
    answer: 3,
    explanation: "Midpoint = ((−5+7)/2, (3−9)/2) = (1, −3)."
  },
  {
    question: "A jump discontinuity occurs when:",
    options: [
      "The left-hand and right-hand limits exist but are not equal",
      "The two-sided limit exists but differs from the function value",
      "The function is continuous everywhere else",
      "The function approaches infinity"
    ],
    answer: 0,
    explanation: "A jump discontinuity happens when one-sided limits differ."
  },
  {
    question: "Differentiate y = ln(5x).",
    options: [
      "1/(5x)",
      "5x",
      "1/x",
      "5/x"
    ],
    answer: 2,
    explanation: "y = ln5 + lnx, so dy/dx = 1/x."
  },
  {
    question: "If v(t) represents velocity, then v'(t) represents:",
    options: [
      "Distance",
      "Acceleration",
      "Displacement",
      "Speed only"
    ],
    answer: 1,
    explanation: "The derivative of velocity with respect to time gives acceleration."
  },
  {
    question: "Find the second derivative of f(x) = 3x⁵ − 5x³.",
    options: [
      "60x⁴ − 30x²",
      "15x⁴ − 15x²",
      "60x³ − 30x",
      "15x³ − 30x"
    ],
    answer: 2,
    explanation: "f'(x) = 15x⁴ − 15x², f''(x) = 60x³ − 30x."
  },
  {
    question: "The second derivative test fails when:",
    options: [
      "f'(x) = 0 and f''(x) > 0",
      "f'(x) ≠ 0",
      "f'(x) = 0 and f''(x) < 0",
      "f'(x) = 0 and f''(x) = 0"
    ],
    answer: 3,
    explanation: "When both conditions hold, the test is inconclusive."
  },
  {
    question: "Find the area between the curve y = x² − 4 and the x-axis from x = −2 to x = 2 (as a positive area).",
    options: [
      "32/3",
      "10",
      "16/3",
      "8"
    ],
    answer: 0,
    explanation: "Since y ≤ 0 on this interval, the positive area is 32/3."
  },
  {
    question: "For f(x) = ax² + bx + c with a < 0, the vertex represents:",
    options: [
      "A minimum point",
      "An asymptote",
      "A point of inflection",
      "A maximum point"
    ],
    answer: 3,
    explanation: "When a is negative, the parabola opens downward, so the vertex is a maximum."
  },
  {
    question: "Evaluate lim (x→∞) (5x³ − x)/(2x³ + 7).",
    options: [
      "Infinity",
      "5/2",
      "0",
      "1"
    ],
    answer: 1,
    explanation: "Dividing by x³, the limit approaches 5/2."
  },
  {
    question: "The derivative of y = xⁿ with respect to x, using the power rule, is:",
    options: [
      "n·x^n",
      "x^(n−1)",
      "nx^(n−1)",
      "nx"
    ],
    answer: 2,
    explanation: "This is the standard power rule of differentiation."
  },
  {
    question: "Find ∫₀^π sin(x) dx.",
    options: [
      "0",
      "2",
      "−2",
      "1"
    ],
    answer: 1,
    explanation: "−cos(π) − (−cos(0)) = 1 + 1 = 2."
  },
  {
    question: "A vertical asymptote of a rational function typically occurs where:",
    options: [
      "Both numerator and denominator are zero",
      "The numerator equals zero",
      "The function is at its maximum",
      "The denominator equals zero (and the numerator does not also vanish there)"
    ],
    answer: 3,
    explanation: "Vertical asymptotes occur where the denominator vanishes without cancellation."
  },
  {
    question: "An object's velocity is given by v(t) = 4t − 3. Find the total distance travelled from t = 0 to t = 3, assuming velocity stays non-negative.",
    options: [
      "10.5",
      "9",
      "12",
      "13.5"
    ],
    answer: 1,
    explanation: "∫₀³(4t−3)dt = [2t²−3t]₀³ = 18−9 = 9."
  },
  {
    question: "In analytic geometry, the equation y² = 4ax represents:",
    options: [
      "A hyperbola",
      "A circle",
      "An ellipse",
      "A parabola with horizontal axis of symmetry"
    ],
    answer: 3,
    explanation: "This standard form represents a parabola opening along the x-axis."
  }
];

const MTH132D = [
  {
    question: "If h(x) = 1/(x−3), what is the domain of h?",
    options: [
      "x ≠ 0",
      "x > 3",
      "All real numbers",
      "x ≠ 3"
    ],
    answer: 3,
    explanation: "The function is undefined when x = 3, so it's excluded from the domain."
  },
  {
    question: "The range of a function refers to:",
    options: [
      "The domain restricted to positive numbers",
      "The set of all possible output values",
      "The set of all possible input values",
      "The set of x-intercepts"
    ],
    answer: 1,
    explanation: "The range is the complete set of values the function can produce."
  },
  {
    question: "Evaluate lim (x→1) (x³ − 1)/(x − 1).",
    options: [
      "3",
      "0",
      "1",
      "2"
    ],
    answer: 0,
    explanation: "Factor: (x−1)(x²+x+1)/(x−1). As x→1: 1+1+1 = 3."
  },
  {
    question: "A function f(x) = |x|/x is discontinuous at x = 0 because:",
    options: [
      "The function is a polynomial",
      "The limit exists but f(0) is defined differently",
      "The function equals zero at x = 0",
      "The function is undefined and the left/right limits differ"
    ],
    answer: 3,
    explanation: "As x→0⁻, f(x)→−1; as x→0⁺, f(x)→1; f(0) is undefined."
  },
  {
    question: "Differentiate y = 9x⁵ − 3x² + 4x.",
    options: [
      "45x⁴ − 6x + 4",
      "45x⁴ − 6x",
      "9x⁴ − 6x + 4",
      "45x⁵ − 6x + 4"
    ],
    answer: 0,
    explanation: "Differentiate term by term: 9x⁵→45x⁴, −3x²→−6x, 4x→4."
  },
  {
    question: "The derivative measures which of the following geometrically?",
    options: [
      "The concavity of a curve only",
      "The area under a curve",
      "The slope of the secant line between two points",
      "The slope of the tangent line at a point"
    ],
    answer: 3,
    explanation: "The derivative at a point gives the gradient of the tangent line there."
  },
  {
    question: "Find dy/dx if y = (4 − x²)⁵.",
    options: [
      "−10x(4−x²)⁴",
      "−5x(4−x²)⁴",
      "5(4−x²)⁴",
      "10x(4−x²)⁴"
    ],
    answer: 0,
    explanation: "Chain rule: dy/dx = 5(4−x²)⁴ · (−2x) = −10x(4−x²)⁴."
  },
  {
    question: "Which of the following is a necessary condition for a local extremum at an interior point of a differentiable function?",
    options: [
      "f''(x) = 0",
      "f(x) = 0",
      "f'(x) = 0",
      "f'(x) is undefined"
    ],
    answer: 2,
    explanation: "At an interior local extremum, the derivative must vanish."
  },
  {
    question: "Find the critical points of f(x) = 2x³ − 3x² − 12x.",
    options: [
      "x = −1, x = 2",
      "x = 0, x = 2",
      "x = 2, x = −2",
      "x = 1, x = −2"
    ],
    answer: 0,
    explanation: "f'(x) = 6(x−2)(x+1) = 0 gives x = 2, −1."
  },
  {
    question: "∫(10x⁴ − 3x² + 2) dx = ?",
    options: [
      "2x⁵ − x³ + 2x + C",
      "40x³ − 6x + C",
      "10x⁵ − x³ + 2x + C",
      "2x⁵ − x³ + C"
    ],
    answer: 0,
    explanation: "Integrate term by term: 10x⁴→2x⁵, −3x²→−x³, 2→2x."
  },
  {
    question: "What does the constant of integration (C) represent?",
    options: [
      "The initial value of the function",
      "An arbitrary constant accounting for the family of antiderivatives",
      "The slope of the tangent",
      "The area under the curve"
    ],
    answer: 1,
    explanation: "C accounts for all possible vertical shifts of the antiderivative."
  },
  {
    question: "Evaluate ∫₁⁴ (2√x) dx.",
    options: [
      "28/9",
      "28/3",
      "14",
      "26/3"
    ],
    answer: 1,
    explanation: "∫2√x dx = (4/3)x^(3/2). Evaluate: 32/3 − 4/3 = 28/3."
  },
  {
    question: "If f(x) ≥ g(x) on [a,b], then ∫ₐᵇ f(x)dx compared to ∫ₐᵇ g(x)dx is:",
    options: [
      "Always greater than or equal",
      "Always equal",
      "Always smaller",
      "Cannot be determined"
    ],
    answer: 0,
    explanation: "Since f(x) ≥ g(x) throughout, the area under f is at least as large."
  },
  {
    question: "Find the area bounded by y = 2x and the x-axis from x = 0 to x = 5.",
    options: [
      "20",
      "25",
      "10",
      "15"
    ],
    answer: 1,
    explanation: "∫₀⁵ 2x dx = [x²]₀⁵ = 25."
  },
  {
    question: "Find the equation of the line through (0, 4) and (2, 0).",
    options: [
      "y = 2x + 4",
      "y = −2x − 4",
      "y = −4x + 2",
      "y = −2x + 4"
    ],
    answer: 3,
    explanation: "Slope = −2. Using y-intercept 4: y = −2x + 4."
  },
  {
    question: "The x-intercept of a line is the point where:",
    options: [
      "y = 0",
      "Both x and y equal 0",
      "x = 0",
      "The line is undefined"
    ],
    answer: 0,
    explanation: "The x-intercept occurs where the line crosses the x-axis, so y = 0."
  },
  {
    question: "Find the distance between points (0, 0) and (6, 8).",
    options: [
      "12",
      "8",
      "10",
      "9"
    ],
    answer: 2,
    explanation: "d = √(36+64) = √100 = 10."
  },
  {
    question: "The equation x² − y² = 1 represents:",
    options: [
      "An ellipse",
      "A parabola",
      "A hyperbola",
      "A circle"
    ],
    answer: 2,
    explanation: "This is the standard form of a hyperbola centered at the origin."
  },
  {
    question: "The Squeeze (Sandwich) Theorem is used to:",
    options: [
      "Find limits of functions bounded between two other functions with the same limit",
      "Prove a function is discontinuous",
      "Compute derivatives directly",
      "Determine the domain of a function"
    ],
    answer: 0,
    explanation: "If g(x) ≤ f(x) ≤ h(x) near a, and g, h share a limit, f shares it too."
  },
  {
    question: "Find lim (x→0) (tan x)/x.",
    options: [
      "Infinity",
      "0",
      "1",
      "Undefined"
    ],
    answer: 2,
    explanation: "tan x = sin x/cos x, so the limit becomes 1·1 = 1."
  },
  {
    question: "If f(x) = (x²−4)/(x−2), the discontinuity at x = 2 is:",
    options: [
      "An infinite discontinuity",
      "A jump discontinuity",
      "Not a discontinuity",
      "A removable discontinuity"
    ],
    answer: 3,
    explanation: "f(x) simplifies to x+2 for x≠2, so x=2 is a removable hole."
  },
  {
    question: "Find the derivative of y = tan(x²).",
    options: [
      "2x·tan(x²)",
      "2x·sec²(x)",
      "2x·sec²(x²)",
      "sec²(x²)"
    ],
    answer: 2,
    explanation: "Chain rule: dy/dx = sec²(x²) · 2x."
  },
  {
    question: "A decreasing function on an interval satisfies:",
    options: [
      "f'(x) < 0",
      "f''(x) < 0",
      "f(x) < 0",
      "f'(x) > 0"
    ],
    answer: 0,
    explanation: "A negative derivative throughout the interval means values are falling."
  },
  {
    question: "Find the slope of the tangent to y = 1/x at x = 2.",
    options: [
      "1/4",
      "−1/4",
      "1/2",
      "−1/2"
    ],
    answer: 1,
    explanation: "y' = −1/x². At x=2: −1/4."
  },
  {
    question: "Which condition confirms that a function is neither even nor odd?",
    options: [
      "f(−x) = −f(x) for all x",
      "f(x) = 0 for all x",
      "f(−x) ≠ f(x) and f(−x) ≠ −f(x) for some x",
      "f(−x) = f(x) for all x"
    ],
    answer: 2,
    explanation: "If neither symmetry condition holds, the function is neither even nor odd."
  },
  {
    question: "Differentiate y = (x²+1)(x−3) using the product rule.",
    options: [
      "3x² − 6x − 1",
      "2x(x−3)",
      "3x² − 6x + 1",
      "2x(x−3) + (x²+1)"
    ],
    answer: 2,
    explanation: "Product rule: 2x(x−3) + (x²+1) = 3x²−6x+1."
  },
  {
    question: "The Intermediate Value Theorem guarantees that:",
    options: [
      "A function has a maximum on [a,b]",
      "A continuous function on [a,b] takes every value between f(a) and f(b) at least once",
      "A function is differentiable on (a,b)",
      "A function's derivative is zero somewhere on [a,b]"
    ],
    answer: 1,
    explanation: "This is the formal statement of the IVT."
  },
  {
    question: "Find the maximum value of f(x) = −2x² + 8x − 3.",
    options: [
      "6",
      "8",
      "5",
      "3"
    ],
    answer: 2,
    explanation: "f'(x)=0 at x=2. f(2)=5, and f''(x)=−4<0 confirms a maximum."
  },
  {
    question: "A rectangular field is to be enclosed with 200m of fencing. What is the primary calculus technique used to find dimensions that maximize area?",
    options: [
      "Finding the second derivative only",
      "Using the distance formula",
      "Integration of the perimeter function",
      "Setting the derivative of the area function (in terms of one variable) to zero"
    ],
    answer: 3,
    explanation: "Differentiate the area function (using the constraint) and set it to zero."
  },
  {
    question: "Find ∫ sec²(x) dx.",
    options: [
      "−cot(x) + C",
      "sec(x) + C",
      "tan(x) + C",
      "cot(x) + C"
    ],
    answer: 2,
    explanation: "The derivative of tan(x) is sec²(x)."
  },
  {
    question: "Find the volume generated when y = 3 (a constant) is rotated about the x-axis from x = 0 to x = 5.",
    options: [
      "15π",
      "45π",
      "25π",
      "9π"
    ],
    answer: 1,
    explanation: "V = π∫₀⁵ 9 dx = 45π."
  },
  {
    question: "When choosing u in integration by parts (LIATE rule), which type of function is generally prioritized first?",
    options: [
      "Exponential functions",
      "Trigonometric functions",
      "Algebraic functions",
      "Logarithmic functions"
    ],
    answer: 3,
    explanation: "LIATE prioritizes Logarithmic functions first for choosing u."
  },
  {
    question: "Evaluate ∫ 3x²(x³+2)³ dx using substitution.",
    options: [
      "(x³+2)³/3 + C",
      "(x³+2)⁴/4 + C",
      "4(x³+2)⁴ + C",
      "(x³+2)⁴ + C"
    ],
    answer: 1,
    explanation: "Let u = x³+2, du = 3x² dx. Integral becomes u⁴/4 + C."
  },
  {
    question: "The Fundamental Theorem of Calculus establishes a connection between:",
    options: [
      "Slopes of parallel lines",
      "Differentiation and integration",
      "Domain and range",
      "Limits and continuity"
    ],
    answer: 1,
    explanation: "The theorem shows these two operations of calculus are inverses."
  },
  {
    question: "Find the equation of the tangent line to y = √x at the point (4, 2).",
    options: [
      "y = x/4 − 1",
      "y = x/2 + 1",
      "y = x/4 + 1",
      "y = 4x + 2"
    ],
    answer: 2,
    explanation: "y' = 1/(2√x). At x=4: 1/4. Line: y = x/4 + 1."
  },
  {
    question: "The slope-intercept form of a line is useful primarily because it directly shows:",
    options: [
      "The slope and y-intercept",
      "The x-intercept and slope",
      "The distance from the origin",
      "Two points on the line"
    ],
    answer: 0,
    explanation: "In y = mx + c, m is the slope and c is the y-intercept."
  },
  {
    question: "Find the midpoint of the segment joining (3, −7) and (−9, 1).",
    options: [
      "(3, −3)",
      "(−3, −3)",
      "(−3, 3)",
      "(6, −3)"
    ],
    answer: 1,
    explanation: "Midpoint = ((3−9)/2, (−7+1)/2) = (−3, −3)."
  },
  {
    question: "For a piecewise function to be continuous at a boundary point, which condition must hold?",
    options: [
      "The pieces must have equal slopes",
      "The pieces must meet at the same y-value at that x-value",
      "Both pieces must be linear",
      "The domain must be restricted"
    ],
    answer: 1,
    explanation: "Continuity requires both pieces and the function value to agree there."
  },
  {
    question: "Differentiate y = log₁₀(x).",
    options: [
      "1/x",
      "ln10/x",
      "10/x",
      "1/(x·ln10)"
    ],
    answer: 3,
    explanation: "log₁₀(x) = ln(x)/ln(10), so its derivative is 1/(x·ln10)."
  },
  {
    question: "In kinematics, the area under a velocity-time graph represents:",
    options: [
      "Displacement",
      "Speed at an instant",
      "Jerk",
      "Acceleration"
    ],
    answer: 0,
    explanation: "Integrating velocity with respect to time gives net displacement."
  },
  {
    question: "Find the second derivative of f(x) = 2x⁶ − x⁴.",
    options: [
      "12x⁴ − 4x²",
      "12x⁵ − 4x³",
      "60x⁵ − 12x³",
      "60x⁴ − 12x²"
    ],
    answer: 3,
    explanation: "f'(x) = 12x⁵ − 4x³, f''(x) = 60x⁴ − 12x²."
  },
  {
    question: "If f''(x) > 0 for all x in an interval, the graph of f(x) on that interval is:",
    options: [
      "Concave up",
      "Constant",
      "Concave down",
      "Linear"
    ],
    answer: 0,
    explanation: "A positive second derivative means the curve bends upward."
  },
  {
    question: "Find the area between the curve y = x³ and the x-axis from x = 0 to x = 2.",
    options: [
      "8",
      "2",
      "4",
      "16"
    ],
    answer: 2,
    explanation: "∫₀² x³ dx = [x⁴/4]₀² = 4."
  },
  {
    question: "The vertex of the parabola y = 2x² − 8x + 5 occurs at:",
    options: [
      "x = 4",
      "x = 1",
      "x = 2",
      "x = −2"
    ],
    answer: 2,
    explanation: "Vertex x-coordinate = −b/2a = 8/4 = 2."
  },
  {
    question: "Evaluate lim (x→∞) (7x + 3)/(2x² − 1).",
    options: [
      "7/2",
      "Infinity",
      "3",
      "0"
    ],
    answer: 3,
    explanation: "The denominator's degree exceeds the numerator's, so the limit is 0."
  },
  {
    question: "For a function f(x) = c (a constant), the graph is:",
    options: [
      "A horizontal line",
      "A vertical line",
      "A parabola",
      "A curve with varying slope"
    ],
    answer: 0,
    explanation: "Since output never changes, the graph is a flat horizontal line."
  },
  {
    question: "Find ∫₀¹ eˣ dx.",
    options: [
      "e − 1",
      "1",
      "e",
      "e + 1"
    ],
    answer: 0,
    explanation: "∫eˣ dx = eˣ. Evaluate: e¹ − e⁰ = e − 1."
  },
  {
    question: "A horizontal asymptote of a rational function describes the behavior of the function as:",
    options: [
      "x approaches a specific finite value where the denominator is zero",
      "The function crosses the x-axis",
      "y approaches zero",
      "x approaches positive or negative infinity"
    ],
    answer: 3,
    explanation: "Horizontal asymptotes describe long-term behavior as input grows without bound."
  },
  {
    question: "A particle's velocity is v(t) = 6t² − 6t. Find the displacement from t = 0 to t = 2.",
    options: [
      "12",
      "6",
      "8",
      "4"
    ],
    answer: 3,
    explanation: "∫₀²(6t²−6t)dt = [2t³−3t²]₀² = 16−12 = 4."
  },
  {
    question: "In analytic geometry, the eccentricity of a circle is always:",
    options: [
      "1",
      "0",
      "Greater than 1",
      "Undefined"
    ],
    answer: 1,
    explanation: "A circle is a special ellipse case where eccentricity equals 0."
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
const CSC104B = [
  {
    question: "Which of the following is an example of an application package?",
    options: [
      "BIOS",
      "Device Driver",
      "Operating System",
      "Microsoft PowerPoint"
    ],
    answer: 3,
    explanation: "Microsoft PowerPoint is application software used for creating presentations."
  },
  {
    question: "The primary purpose of Microsoft Access is to:",
    options: [
      "Edit videos",
      "Create presentations",
      "Manage databases",
      "Browse the internet"
    ],
    answer: 2,
    explanation: "Microsoft Access is a Database Management System used to create and manage databases."
  },
  {
    question: "A Database Management System (DBMS) is mainly used to:",
    options: [
      "Create computer hardware",
      "Design websites",
      "Increase internet speed",
      "Organize and manage data efficiently"
    ],
    answer: 3,
    explanation: "A DBMS helps users store, organize, retrieve, and manage data."
  },
  {
    question: "In Microsoft Access, a collection of related records is stored in a:",
    options: [
      "Table",
      "Report",
      "Form",
      "Query"
    ],
    answer: 0,
    explanation: "Tables store related records in rows and columns."
  },
  {
    question: "Which of the following is the first step in creating a new database in Microsoft Access?",
    options: [
      "Print the database",
      "Choose Blank Database or a template",
      "Create a report",
      "Insert a query"
    ],
    answer: 1,
    explanation: "A new database begins by selecting a blank database or template."
  },
  {
    question: "Which Access object is mainly used to retrieve specific information from one or more tables?",
    options: [
      "Form",
      "Report",
      "Macro",
      "Query"
    ],
    answer: 3,
    explanation: "Queries are used to search, filter, and retrieve specific data."
  },
  {
    question: "Which view allows users to modify the structure of a table?",
    options: [
      "Datasheet View",
      "Print Preview",
      "Layout View",
      "Design View"
    ],
    answer: 3,
    explanation: "Design View is used to define fields and data types."
  },
  {
    question: "Which of the following best describes a field in a database?",
    options: [
      "A complete database",
      "A row of related data",
      "A column containing one type of information",
      "A printed report"
    ],
    answer: 2,
    explanation: "A field is a column that stores one type of data."
  },
  {
    question: "Which Access object provides a user-friendly interface for entering data?",
    options: [
      "Module",
      "Form",
      "Query",
      "Macro"
    ],
    answer: 1,
    explanation: "Forms simplify data entry and editing."
  },
  {
    question: "Which of the following data types is suitable for storing a person's age?",
    options: [
      "Hyperlink",
      "Short Text",
      "Number",
      "Attachment"
    ],
    answer: 2,
    explanation: "Ages are numerical values."
  },
  {
    question: "Which of the following is NOT an object in Microsoft Access?",
    options: [
      "Query",
      "Report",
      "Table",
      "Worksheet"
    ],
    answer: 3,
    explanation: "Worksheets belong to Microsoft Excel, not Access."
  },
  {
    question: "Data formatting in Microsoft Access is mainly used to:",
    options: [
      "Change the appearance of data",
      "Create backups",
      "Compress files",
      "Delete records"
    ],
    answer: 0,
    explanation: "Formatting changes how data is displayed without changing its value."
  },
  {
    question: "A filter in Microsoft Access is used to:",
    options: [
      "Permanently delete records",
      "Encrypt the database",
      "Close the application",
      "Display records that meet specified conditions"
    ],
    answer: 3,
    explanation: "Filtering temporarily displays only matching records."
  },
  {
    question: "Which Microsoft Office application is primarily used for creating slide presentations?",
    options: [
      "Word",
      "Excel",
      "Access",
      "PowerPoint"
    ],
    answer: 3,
    explanation: "PowerPoint is designed for creating presentations."
  },
  {
    question: "Which slide is usually created first in a presentation?",
    options: [
      "Picture Slide",
      "Chart Slide",
      "Summary Slide",
      "Title Slide"
    ],
    answer: 3,
    explanation: "The title slide introduces the presentation."
  },
  {
    question: "Which feature changes the appearance of all slides in a presentation?",
    options: [
      "Design Template",
      "Animation Pane",
      "Spell Checker",
      "Zoom Tool"
    ],
    answer: 0,
    explanation: "Design templates apply a consistent appearance to slides."
  },
  {
    question: "Which command is used to insert another slide into a presentation?",
    options: [
      "Replace",
      "Print",
      "New Slide",
      "Save As"
    ],
    answer: 2,
    explanation: "The New Slide command adds additional slides."
  },
  {
    question: "Slide Transition refers to:",
    options: [
      "File compression",
      "Effects between slides",
      "Image cropping",
      "Text formatting"
    ],
    answer: 1,
    explanation: "Transitions control how one slide changes to another."
  },
  {
    question: "Animation in PowerPoint is applied mainly to:",
    options: [
      "File folders",
      "Objects on a slide",
      "Database tables",
      "Entire operating system"
    ],
    answer: 1,
    explanation: "Animations affect text, pictures, and other slide objects."
  },
  {
    question: "Which of the following can be animated in PowerPoint?",
    options: [
      "Shapes",
      "Images",
      "All of the above",
      "Text"
    ],
    answer: 2,
    explanation: "PowerPoint allows animations on different slide objects."
  },
  {
    question: "Which Access view displays records in rows and columns?",
    options: [
      "Layout View",
      "Report View",
      "Design View",
      "Datasheet View"
    ],
    answer: 3,
    explanation: "Datasheet View resembles a spreadsheet for viewing and editing records."
  },
  {
    question: "Which of the following best defines a record in a database table?",
    options: [
      "A database file",
      "A field name",
      "A report page",
      "A single row of related information"
    ],
    answer: 3,
    explanation: "A record consists of related fields describing one item."
  },
  {
    question: "Which option is commonly used to open an existing Access database?",
    options: [
      "Export",
      "Publish",
      "Animate",
      "Open"
    ],
    answer: 3,
    explanation: "The Open command loads an existing database file."
  },
  {
    question: "Which of the following is an advantage of using Microsoft Access?",
    options: [
      "Increased battery life",
      "Automatic hardware repair",
      "Efficient storage and retrieval of data",
      "Faster internet browsing"
    ],
    answer: 2,
    explanation: "Access makes storing, organizing, and retrieving data easier."
  },
  {
    question: "Before presenting a PowerPoint slideshow to an audience, it is most important to:",
    options: [
      "Review the slides for errors",
      "Delete all animations",
      "Remove the title slide",
      "Convert every slide into a picture"
    ],
    answer: 0,
    explanation: "Reviewing helps identify and correct mistakes before presentation."
  },
  {
    question: "Which of the following is the default file extension for a Microsoft Access database?",
    options: [
      ".xlsx",
      ".docx",
      ".accdb",
      ".pptx"
    ],
    answer: 2,
    explanation: "Modern Access databases are saved with the .accdb extension."
  },
  {
    question: "Which Access object is mainly used to produce printable summaries of data?",
    options: [
      "Table",
      "Query",
      "Report",
      "Form"
    ],
    answer: 2,
    explanation: "Reports present data in a format suitable for printing."
  },
  {
    question: "Which of the following is an advantage of using a database instead of paper records?",
    options: [
      "Occupies more physical space",
      "Requires no electricity",
      "Cannot be edited",
      "Easier searching and updating of records"
    ],
    answer: 3,
    explanation: "Databases allow quick searching, editing, and retrieval of information."
  },
  {
    question: "Which Access object stores the actual data?",
    options: [
      "Form",
      "Query",
      "Table",
      "Report"
    ],
    answer: 2,
    explanation: "Tables are the primary storage objects in a database."
  },
  {
    question: "Which of the following is an example of a field name in a student database?",
    options: [
      "Student Record",
      "Access Window",
      "Student Name",
      "Database File"
    ],
    answer: 2,
    explanation: "A field name identifies a specific type of data stored in a table."
  },
  {
    question: "Which view is most suitable for entering records into an existing table?",
    options: [
      "Print Preview",
      "Datasheet View",
      "Design View",
      "Slide Show View"
    ],
    answer: 1,
    explanation: "Datasheet View allows users to add and edit records directly."
  },
  {
    question: "A query in Microsoft Access can be used to:",
    options: [
      "Replace the operating system",
      "Design presentation slides",
      "Install software updates",
      "Retrieve records that meet specific criteria"
    ],
    answer: 3,
    explanation: "Queries search for and display records matching specified conditions."
  },
  {
    question: "What is the purpose of sorting records in Microsoft Access?",
    options: [
      "To protect the database with a password",
      "To delete unwanted records",
      "To create a new database",
      "To arrange data in a specific order"
    ],
    answer: 3,
    explanation: "Sorting organizes records in ascending or descending order."
  },
  {
    question: "Which PowerPoint feature controls how one slide changes to the next?",
    options: [
      "Slide Transition",
      "Hyperlink",
      "Theme",
      "Animation"
    ],
    answer: 0,
    explanation: "Slide transitions determine the effect used when moving between slides."
  },
  {
    question: "Which of the following is an example of a presentation theme?",
    options: [
      "A spreadsheet formula",
      "A network connection",
      "A database table",
      "A collection of colors, fonts, and effects"
    ],
    answer: 3,
    explanation: "A theme provides a consistent design throughout a presentation."
  },
  {
    question: "Which tab in PowerPoint is commonly used to insert pictures into a slide?",
    options: [
      "Insert",
      "Home",
      "Review",
      "View"
    ],
    answer: 0,
    explanation: "The Insert tab contains commands for adding pictures and other objects."
  },
  {
    question: "Which of the following is true about animations in PowerPoint?",
    options: [
      "They can only be applied to text.",
      "They automatically affect every slide.",
      "They permanently change the theme.",
      "They can be applied to different slide objects."
    ],
    answer: 3,
    explanation: "Animations can be applied to text, images, shapes, charts, and other objects."
  },
  {
    question: "Which keyboard shortcut is commonly used to save a presentation?",
    options: [
      "Ctrl + X",
      "Ctrl + S",
      "Ctrl + C",
      "Ctrl + P"
    ],
    answer: 1,
    explanation: "Ctrl + S saves the current presentation or database."
  },
  {
    question: "Which of the following best describes a primary key in Microsoft Access?",
    options: [
      "A field used only for printing",
      "The first field in every table",
      "A field that uniquely identifies each record",
      "A field containing only numbers"
    ],
    answer: 2,
    explanation: "A primary key uniquely identifies every record in a table."
  },
  {
    question: "Which of the following actions can improve the appearance of a PowerPoint presentation?",
    options: [
      "Disabling transitions permanently",
      "Applying a suitable design template",
      "Removing all images",
      "Deleting all slides except one"
    ],
    answer: 1,
    explanation: "Design templates give presentations a professional and consistent appearance."
  },
  {
    question: "What is the main purpose of a title slide?",
    options: [
      "To print reports",
      "To introduce the presentation",
      "To create database tables",
      "To display calculations"
    ],
    answer: 1,
    explanation: "The title slide introduces the topic and presenter."
  },
  {
    question: "Which of the following can be used as a criterion when filtering records?",
    options: [
      "File Size of Windows",
      "Student Department",
      "CPU Speed",
      "Screen Resolution"
    ],
    answer: 1,
    explanation: "Filters can display records based on field values such as department."
  },
  {
    question: "Which of the following statements about Microsoft Access is correct?",
    options: [
      "It is mainly used for editing videos.",
      "It is only used for creating presentations.",
      "It is a web browser.",
      "It is a database management application."
    ],
    answer: 3,
    explanation: "Microsoft Access is designed for creating and managing databases."
  },
  {
    question: "What happens when a filter is removed in Microsoft Access?",
    options: [
      "All records are permanently deleted.",
      "The database closes automatically.",
      "The hidden records become visible again.",
      "The primary key changes."
    ],
    answer: 2,
    explanation: "Removing a filter displays all records again."
  },
  {
    question: "Which of the following should be avoided in a good PowerPoint presentation?",
    options: [
      "Consistent slide design",
      "Clear and readable text",
      "Appropriate font size",
      "Excessive animations on every object"
    ],
    answer: 3,
    explanation: "Too many animations can distract the audience."
  },
  {
    question: "Which Access object is most appropriate for displaying data without changing the table structure?",
    options: [
      "Design View",
      "Relationship View",
      "Datasheet View",
      "SQL View"
    ],
    answer: 2,
    explanation: "Datasheet View is used for viewing and editing records without modifying the table design."
  },
  {
    question: "Which of the following best explains data formatting?",
    options: [
      "Creating a new database",
      "Encrypting files",
      "Deleting duplicate records",
      "Changing the way data appears without changing its value"
    ],
    answer: 3,
    explanation: "Formatting affects appearance only, not the stored value."
  },
  {
    question: "Which of the following is NOT a benefit of Microsoft PowerPoint?",
    options: [
      "Managing relational databases",
      "Organizing ideas into slides",
      "Presenting information visually",
      "Supporting multimedia content"
    ],
    answer: 0,
    explanation: "Database management is performed by Microsoft Access, not PowerPoint."
  },
  {
    question: "Which of the following is most likely to improve audience understanding during a presentation?",
    options: [
      "Using different fonts on every line",
      "Using simple and well-organized slides",
      "Filling every slide with long paragraphs",
      "Applying every available animation effect"
    ],
    answer: 1,
    explanation: "Simple, organized slides make presentations easier to understand."
  },
  {
    question: "Which statement best describes Microsoft PowerPoint?",
    options: [
      "It is software designed for creating and delivering presentations.",
      "It is an operating system.",
      "It is used only for database administration.",
      "It is mainly used for programming applications."
    ],
    answer: 0,
    explanation: "PowerPoint is presentation software used to create and deliver slide-based presentations."
  }
];

const CSC104C = [
  {
    question: "Which of the following best describes an application package?",
    options: [
      "Software used to control computer hardware",
      "A computer network",
      "A programming language",
      "A program designed to perform specific user tasks"
    ],
    answer: 3,
    explanation: "Application packages help users perform specific tasks such as creating databases or presentations."
  },
  {
    question: "Which Microsoft Access object is used to establish relationships between tables?",
    options: [
      "Relationship Window",
      "Form",
      "Report",
      "Query"
    ],
    answer: 0,
    explanation: "The Relationship Window is used to define how tables are connected."
  },
  {
    question: "In a student database, which field is most appropriate as a primary key?",
    options: [
      "Department",
      "Student Name",
      "Course of Study",
      "Matriculation Number"
    ],
    answer: 3,
    explanation: "A primary key must uniquely identify each record, and a matriculation number is unique."
  },
  {
    question: "Which feature in Microsoft Access allows users to select records that satisfy certain conditions?",
    options: [
      "Filter",
      "Animation",
      "Theme",
      "Transition"
    ],
    answer: 0,
    explanation: "A filter displays only records that match specified criteria."
  },
  {
    question: "Which of the following data types is best for storing students' names?",
    options: [
      "Date/Time",
      "Number",
      "Short Text",
      "Currency"
    ],
    answer: 2,
    explanation: "Names consist of letters and are stored as Short Text."
  },
  {
    question: "What is the main function of the Navigation Pane in Microsoft Access?",
    options: [
      "To create animations",
      "To start a slideshow",
      "To display database objects",
      "To print reports"
    ],
    answer: 2,
    explanation: "The Navigation Pane lists tables, queries, forms, and reports."
  },
  {
    question: "Which of the following is NOT a database object in Microsoft Access?",
    options: [
      "Workbook",
      "Query",
      "Report",
      "Form"
    ],
    answer: 0,
    explanation: "A workbook is associated with Microsoft Excel, not Access."
  },
  {
    question: "Which command should be used to preserve an existing presentation while creating another version?",
    options: [
      "Save As",
      "Close",
      "Save",
      "Export"
    ],
    answer: 0,
    explanation: "Save As creates a new copy without replacing the original file."
  },
  {
    question: "Which PowerPoint view displays one slide at a time for editing?",
    options: [
      "Normal View",
      "Slide Show View",
      "Slide Sorter View",
      "Reading View"
    ],
    answer: 0,
    explanation: "Normal View is the default editing view."
  },
  {
    question: "Which of the following is an advantage of using templates in PowerPoint?",
    options: [
      "They increase computer memory.",
      "They convert slides into databases.",
      "They remove animations automatically.",
      "They provide a consistent design."
    ],
    answer: 3,
    explanation: "Templates help maintain a professional and consistent appearance."
  },
  {
    question: "Which Access object can be created to simplify data entry for users?",
    options: [
      "Report",
      "Relationship",
      "Table",
      "Form"
    ],
    answer: 3,
    explanation: "Forms provide a convenient interface for entering and editing records."
  },
  {
    question: "Which of the following actions can be performed using a query?",
    options: [
      "Create presentation themes",
      "Install antivirus software",
      "Replace the operating system",
      "Display students whose GPA is above 4.0"
    ],
    answer: 3,
    explanation: "Queries retrieve records that meet specified conditions."
  },
  {
    question: "Which symbol is commonly used as a wildcard representing multiple characters in Access?",
    options: [
      "#",
      "@",
      "*",
      "%"
    ],
    answer: 2,
    explanation: "The asterisk (*) is commonly used as a wildcard in Access searches."
  },
  {
    question: "Which of the following is the main purpose of Slide Master?",
    options: [
      "To sort records",
      "To control the overall appearance of slides",
      "To create tables in Access",
      "To open databases"
    ],
    answer: 1,
    explanation: "Slide Master applies consistent formatting throughout a presentation."
  },
  {
    question: "Which animation category draws attention to an object already visible on a slide?",
    options: [
      "Emphasis",
      "Motion Path",
      "Entrance",
      "Exit"
    ],
    answer: 0,
    explanation: "Emphasis animations highlight existing objects."
  },
  {
    question: "Which keyboard shortcut is commonly used to start a slideshow from the beginning?",
    options: [
      "F7",
      "F12",
      "F1",
      "F5"
    ],
    answer: 3,
    explanation: "Pressing F5 starts the presentation from the first slide."
  },
  {
    question: "In Microsoft Access, records are arranged horizontally while fields are arranged:",
    options: [
      "Diagonally",
      "Circularly",
      "Randomly",
      "Vertically"
    ],
    answer: 3,
    explanation: "Records are rows, while fields are columns."
  },
  {
    question: "Which of the following best describes a database?",
    options: [
      "A collection of presentation slides",
      "A collection of related data organized for easy access",
      "A web browser",
      "A programming language"
    ],
    answer: 1,
    explanation: "Databases organize related information for efficient management."
  },
  {
    question: "Which command is used to duplicate an object in PowerPoint quickly?",
    options: [
      "Ctrl + P",
      "Ctrl + N",
      "Ctrl + V",
      "Ctrl + D"
    ],
    answer: 3,
    explanation: "Ctrl + D duplicates the selected object or slide."
  },
  {
    question: "Which feature allows PowerPoint slides to change automatically after a specified time?",
    options: [
      "Transition Timing",
      "Animation Timing",
      "Notes Pane",
      "Font Settings"
    ],
    answer: 0,
    explanation: "Transition timing controls automatic movement between slides."
  },
  {
    question: "Which Access feature is used to arrange records from highest to lowest?",
    options: [
      "Find",
      "Group",
      "Filter",
      "Sort Descending"
    ],
    answer: 3,
    explanation: "Sort Descending arranges values from highest to lowest or Z to A."
  },
  {
    question: "Which of the following is a good presentation practice?",
    options: [
      "Place all information on one slide",
      "Add animations to every object",
      "Use readable fonts and simple layouts",
      "Use many font styles on every slide"
    ],
    answer: 2,
    explanation: "Simple layouts and readable fonts improve audience understanding."
  },
  {
    question: "Which database object is mainly intended for presenting information to users in a printable format?",
    options: [
      "Relationship",
      "Table",
      "Report",
      "Query"
    ],
    answer: 2,
    explanation: "Reports organize data for printing and presentation."
  },
  {
    question: "Which of the following can be inserted into a PowerPoint presentation?",
    options: [
      "All of the above",
      "Charts",
      "Audio",
      "Video"
    ],
    answer: 0,
    explanation: "PowerPoint supports multimedia, charts, tables, and other objects."
  },
  {
    question: "Which of the following should be done before delivering a PowerPoint presentation?",
    options: [
      "Delete the title slide",
      "Convert all text into images",
      "Preview the slideshow",
      "Remove all pictures"
    ],
    answer: 2,
    explanation: "Previewing the slideshow helps identify and correct any errors before presenting."
  },
  {
    question: "Which of the following is the main purpose of a database table?",
    options: [
      "To create presentation slides",
      "To store related data in rows and columns",
      "To print documents",
      "To design animations"
    ],
    answer: 1,
    explanation: "A table is the primary object used to store data in a database."
  },
  {
    question: "In Microsoft Access, which property determines the maximum number of characters allowed in a Short Text field?",
    options: [
      "Format",
      "Caption",
      "Validation Rule",
      "Field Size"
    ],
    answer: 3,
    explanation: "The Field Size property specifies the maximum number of characters for a Short Text field."
  },
  {
    question: "Which of the following allows users to move from one record to another in Datasheet View?",
    options: [
      "Formula Bar",
      "Slide Pane",
      "Record Navigation Bar",
      "Status Bar"
    ],
    answer: 2,
    explanation: "The Record Navigation Bar is used to move through records in a table or query."
  },
  {
    question: "Which command is used to create a copy of an existing Access database with a different name?",
    options: [
      "Save As",
      "Open",
      "Close",
      "Import"
    ],
    answer: 0,
    explanation: "Save As creates another copy while preserving the original database."
  },
  {
    question: "Which of the following is an advantage of using forms instead of entering data directly into tables?",
    options: [
      "They replace queries.",
      "They provide a more user-friendly interface.",
      "They automatically create reports.",
      "They increase storage capacity."
    ],
    answer: 1,
    explanation: "Forms simplify data entry and reduce input errors."
  },
  {
    question: "Which PowerPoint feature is used to change the background color of all slides at once?",
    options: [
      "Notes Page",
      "Slide Master",
      "Animation Pane",
      "Design Theme"
    ],
    answer: 1,
    explanation: "Changes made in Slide Master can affect all slides in the presentation."
  },
  {
    question: "Which of the following is NOT commonly inserted into a PowerPoint slide?",
    options: [
      "SmartArt",
      "Spreadsheet Formula Bar",
      "Chart",
      "Picture"
    ],
    answer: 1,
    explanation: "The Formula Bar is an Excel feature, not a PowerPoint object."
  },
  {
    question: "Which keyboard shortcut starts a slideshow from the currently selected slide?",
    options: [
      "Alt + F5",
      "Shift + F5",
      "F5",
      "Ctrl + F5"
    ],
    answer: 1,
    explanation: "Shift + F5 begins the slideshow from the current slide."
  },
  {
    question: "Which of the following can be used to highlight important information on a PowerPoint slide?",
    options: [
      "Emphasis animation",
      "Bold text",
      "Appropriate color contrast",
      "All of the above"
    ],
    answer: 3,
    explanation: "All these techniques can help draw attention to important content."
  },
  {
    question: "Which of the following best describes a query?",
    options: [
      "A storage device",
      "An object used to search, filter, and retrieve data",
      "A tool for creating slides",
      "A programming language"
    ],
    answer: 1,
    explanation: "Queries retrieve records that meet specified criteria."
  },
  {
    question: "Which of the following actions can improve the readability of a PowerPoint presentation?",
    options: [
      "Using many font colors randomly",
      "Filling each slide with long paragraphs",
      "Using large, clear fonts",
      "Applying every animation available"
    ],
    answer: 2,
    explanation: "Large, readable fonts make presentations easier to follow."
  },
  {
    question: "Which of the following database objects is most suitable for printing students' results?",
    options: [
      "Query",
      "Table",
      "Form",
      "Report"
    ],
    answer: 3,
    explanation: "Reports are designed for formatted printing."
  },
  {
    question: "Which PowerPoint tab contains commands for applying transitions?",
    options: [
      "Transitions",
      "View",
      "Review",
      "Home"
    ],
    answer: 0,
    explanation: "The Transitions tab is used to apply and modify slide transitions."
  },
  {
    question: "Which of the following is true about database records?",
    options: [
      "Every record is a database.",
      "Every record contains only numbers.",
      "Every record contains related fields.",
      "Records cannot be edited."
    ],
    answer: 2,
    explanation: "A record is a collection of related fields describing one item."
  },
  {
    question: "Which feature allows users to search for a particular word in an Access table?",
    options: [
      "Find",
      "Replace",
      "Sort",
      "Filter by Form"
    ],
    answer: 0,
    explanation: "The Find command locates specific text or values quickly."
  },
  {
    question: "Which animation category makes an object disappear from a slide?",
    options: [
      "Exit",
      "Emphasis",
      "Motion Path",
      "Entrance"
    ],
    answer: 0,
    explanation: "Exit animations remove objects from view during the presentation."
  },
  {
    question: "Which of the following is considered good practice when designing presentation slides?",
    options: [
      "Using paragraphs of over 300 words on every slide",
      "Using different fonts for every sentence",
      "Keeping each slide focused on one main idea",
      "Avoiding headings"
    ],
    answer: 2,
    explanation: "One main idea per slide improves clarity and audience understanding."
  },
  {
    question: "Which component of Microsoft Access displays all available database objects?",
    options: [
      "Ribbon",
      "Navigation Pane",
      "Quick Access Toolbar",
      "Status Bar"
    ],
    answer: 1,
    explanation: "The Navigation Pane lists tables, forms, queries, and reports."
  },
  {
    question: "Which of the following best explains a presentation template?",
    options: [
      "A backup copy of a presentation",
      "A printer setting",
      "A ready-made design used to create presentations",
      "A database containing records"
    ],
    answer: 2,
    explanation: "Templates provide predefined layouts, colors, and fonts."
  },
  {
    question: "Which of the following can be used to arrange slides into a preferred sequence?",
    options: [
      "Notes View",
      "Slide Sorter View",
      "Outline View",
      "Reading View"
    ],
    answer: 1,
    explanation: "Slide Sorter View makes it easy to rearrange slides."
  },
  {
    question: "Which Access feature helps ensure that data entered into a field follows specific rules?",
    options: [
      "Animation",
      "Validation Rule",
      "Theme",
      "Transition"
    ],
    answer: 1,
    explanation: "Validation rules help prevent invalid data entry."
  },
  {
    question: "Which of the following is an advantage of using Microsoft Access over keeping records manually?",
    options: [
      "Slower retrieval of information",
      "Faster searching and updating of records",
      "Greater risk of duplication",
      "Increased paper usage"
    ],
    answer: 1,
    explanation: "Access enables quick searching, editing, and management of records."
  },
  {
    question: "Which of the following should be considered when choosing a PowerPoint design theme?",
    options: [
      "It should include as many animations as possible.",
      "It must contain the brightest colors only.",
      "It must use different fonts on every slide.",
      "It should suit the presentation topic."
    ],
    answer: 3,
    explanation: "A suitable theme enhances professionalism and readability."
  },
  {
    question: "Which command is used to insert a blank slide into an existing PowerPoint presentation?",
    options: [
      "Replace Slide",
      "Slide Layout",
      "Duplicate Slide",
      "New Slide"
    ],
    answer: 3,
    explanation: "The New Slide command adds another slide to the presentation."
  },
  {
    question: "Which statement correctly compares Microsoft Access and Microsoft PowerPoint?",
    options: [
      "Both applications are used mainly for database management.",
      "Access creates spreadsheets, while PowerPoint manages databases.",
      "Both applications perform exactly the same functions.",
      "Access manages databases, while PowerPoint creates presentations."
    ],
    answer: 3,
    explanation: "Access is a database management application, while PowerPoint is presentation software."
  }
];

const CSC104D = [
  {
    question: "Which of the following is the main reason for using application packages?",
    options: [
      "To control electrical power",
      "To perform specialized user tasks",
      "To replace computer memory",
      "To manufacture computer hardware"
    ],
    answer: 1,
    explanation: "Application packages are designed to perform specific tasks such as creating databases and presentations."
  },
  {
    question: "Microsoft Access belongs to which category of software?",
    options: [
      "Utility Software",
      "Firmware",
      "System Software",
      "Application Software"
    ],
    answer: 3,
    explanation: "Microsoft Access is an application software used for database management."
  },
  {
    question: "Which of the following is the smallest meaningful unit of information stored in a database table?",
    options: [
      "Field",
      "Report",
      "Query",
      "Record"
    ],
    answer: 0,
    explanation: "A field stores one particular type of information, such as Name or Age."
  },
  {
    question: "A table in Microsoft Access consists of:",
    options: [
      "Records and fields",
      "Pages and paragraphs",
      "Charts and pictures",
      "Slides and animations"
    ],
    answer: 0,
    explanation: "Tables are made up of rows (records) and columns (fields)."
  },
  {
    question: "Which Microsoft Access object is mainly used for displaying selected information from a database?",
    options: [
      "Query",
      "Relationship",
      "Module",
      "Table"
    ],
    answer: 0,
    explanation: "Queries retrieve and display data based on specified conditions."
  },
  {
    question: "Which of the following is required before records can be entered into a new table?",
    options: [
      "The database must be exported.",
      "The table structure must be created.",
      "A presentation must be designed.",
      "A report must be printed."
    ],
    answer: 1,
    explanation: "Fields and data types should be defined before entering records."
  },
  {
    question: "Which Microsoft Access feature helps prevent duplicate values in a primary key field?",
    options: [
      "Primary Key Constraint",
      "Filter Feature",
      "Validation Rule",
      "Sort Feature"
    ],
    answer: 0,
    explanation: "A primary key ensures every record has a unique identifier."
  },
  {
    question: "Which of the following is an example of database software?",
    options: [
      "Adobe Reader",
      "Microsoft Access",
      "VLC Media Player",
      "Microsoft Paint"
    ],
    answer: 1,
    explanation: "Microsoft Access is a Database Management System."
  },
  {
    question: "When opening an existing Access database, which command is commonly selected?",
    options: [
      "Save As",
      "New Database",
      "Open",
      "Print"
    ],
    answer: 2,
    explanation: "The Open command is used to access an existing database."
  },
  {
    question: "Which feature allows records to be arranged alphabetically from A to Z?",
    options: [
      "Formatting",
      "Sorting",
      "Printing",
      "Filtering"
    ],
    answer: 1,
    explanation: "Sorting arranges records in ascending or descending order."
  },
  {
    question: "Which of the following is a benefit of formatting data?",
    options: [
      "It creates new tables automatically.",
      "It improves the appearance of information.",
      "It deletes duplicate records.",
      "It increases storage capacity."
    ],
    answer: 1,
    explanation: "Formatting changes how data appears without changing its actual value."
  },
  {
    question: "Which view is most suitable for changing the name of a field?",
    options: [
      "Print Preview",
      "Datasheet View",
      "Report View",
      "Design View"
    ],
    answer: 3,
    explanation: "Design View allows modification of field names and properties."
  },
  {
    question: "Which PowerPoint feature controls how text or objects appear during a presentation?",
    options: [
      "Notes",
      "Slide Transition",
      "Theme",
      "Animation"
    ],
    answer: 3,
    explanation: "Animations affect objects within a slide."
  },
  {
    question: "Which PowerPoint feature affects the movement between two slides?",
    options: [
      "Theme",
      "Transition",
      "Layout",
      "Animation"
    ],
    answer: 1,
    explanation: "Transitions determine how one slide changes to the next."
  },
  {
    question: "Which of the following can be inserted into a PowerPoint slide?",
    options: [
      "Audio",
      "All of the above",
      "Pictures",
      "Charts"
    ],
    answer: 1,
    explanation: "PowerPoint supports many multimedia and graphical objects."
  },
  {
    question: "Which of the following is the purpose of a title slide?",
    options: [
      "To store database records",
      "To create formulas",
      "To print reports",
      "To introduce the presentation topic"
    ],
    answer: 3,
    explanation: "The title slide gives the audience an overview of the presentation."
  },
  {
    question: "Which PowerPoint tab is commonly used for inserting tables and pictures?",
    options: [
      "Review",
      "Home",
      "View",
      "Insert"
    ],
    answer: 3,
    explanation: "The Insert tab contains commands for adding objects."
  },
  {
    question: "Which keyboard shortcut is commonly used to create a new presentation?",
    options: [
      "Ctrl + O",
      "Ctrl + N",
      "Ctrl + P",
      "Ctrl + X"
    ],
    answer: 1,
    explanation: "Ctrl + N creates a new presentation."
  },
  {
    question: "Which of the following best describes a report in Microsoft Access?",
    options: [
      "A database table",
      "A collection of animations",
      "A formatted presentation of database information",
      "A presentation template"
    ],
    answer: 2,
    explanation: "Reports organize data into a professional format for viewing or printing."
  },
  {
    question: "Which Access object allows users to enter information without directly editing a table?",
    options: [
      "Form",
      "Report",
      "Query",
      "Relationship"
    ],
    answer: 0,
    explanation: "Forms provide a user-friendly interface for entering records."
  },
  {
    question: "Which of the following actions is performed before applying a slide transition?",
    options: [
      "Print the presentation",
      "Close the presentation",
      "Delete the slide",
      "Select the slide"
    ],
    answer: 3,
    explanation: "A slide must first be selected before a transition can be applied."
  },
  {
    question: "Which of the following is an advantage of Slide Sorter View?",
    options: [
      "It filters records.",
      "It creates relationships.",
      "It edits database tables.",
      "It displays all slides as thumbnails."
    ],
    answer: 3,
    explanation: "Slide Sorter View makes it easy to rearrange slides."
  },
  {
    question: "Which feature is used to emphasize an important point without changing slides?",
    options: [
      "Hyperlink",
      "Transition",
      "Theme",
      "Animation"
    ],
    answer: 3,
    explanation: "Animations highlight objects within the same slide."
  },
  {
    question: "Which of the following is good practice when creating a PowerPoint presentation?",
    options: [
      "Use simple and consistent formatting.",
      "Use many different fonts on one slide.",
      "Use bright colors for every background.",
      "Fill every slide with long paragraphs."
    ],
    answer: 0,
    explanation: "Consistent formatting improves readability and professionalism."
  },
  {
    question: "Which statement is correct?",
    options: [
      "Microsoft Access manages databases, while Microsoft PowerPoint creates presentations.",
      "Microsoft Access is used only for typing letters.",
      "Both applications perform exactly the same function.",
      "Microsoft PowerPoint is a database management system."
    ],
    answer: 0,
    explanation: "Access is used for databases, while PowerPoint is used for presentations."
  },
  {
    question: "Which of the following database objects stores information permanently?",
    options: [
      "Report",
      "Table",
      "Query",
      "Form"
    ],
    answer: 1,
    explanation: "Tables are the primary objects that permanently store data in Microsoft Access."
  },
  {
    question: "Which of the following is most appropriate for storing students' dates of birth?",
    options: [
      "Date/Time",
      "Short Text",
      "Number",
      "Currency"
    ],
    answer: 0,
    explanation: "The Date/Time data type is used for storing dates and times."
  },
  {
    question: "Which of the following can be used to display only students from the Computer Science department?",
    options: [
      "Slide Transition",
      "Filter",
      "Theme",
      "Animation"
    ],
    answer: 1,
    explanation: "A filter displays only records that meet specified conditions."
  },
  {
    question: "Which Microsoft Access object can collect data from users in an organized manner?",
    options: [
      "Report",
      "Macro",
      "Relationship",
      "Form"
    ],
    answer: 3,
    explanation: "Forms provide an organized interface for entering and editing records."
  },
  {
    question: "Which of the following statements about a primary key is correct?",
    options: [
      "It may contain duplicate values.",
      "It stores only text values.",
      "It uniquely identifies each record.",
      "It is optional in every table."
    ],
    answer: 2,
    explanation: "A primary key uniquely identifies every record in a table."
  },
  {
    question: "Which view is mainly used to modify field properties in Microsoft Access?",
    options: [
      "Design View",
      "Report View",
      "Print Preview",
      "Datasheet View"
    ],
    answer: 0,
    explanation: "Design View allows you to edit field names, data types, and properties."
  },
  {
    question: "Which feature enables a presenter to move to any slide during a slideshow?",
    options: [
      "Hyperlink or slide navigation",
      "Query",
      "Filter",
      "Validation Rule"
    ],
    answer: 0,
    explanation: "Hyperlinks and navigation controls allow movement to specific slides."
  },
  {
    question: "Which of the following is an example of multimedia that can be inserted into PowerPoint?",
    options: [
      "Video",
      "All of the above",
      "Audio",
      "Picture"
    ],
    answer: 1,
    explanation: "PowerPoint supports various multimedia objects, including audio, video, and pictures."
  },
  {
    question: "Which of the following helps maintain a professional appearance throughout a presentation?",
    options: [
      "Applying one consistent theme",
      "Using different colors for every heading",
      "Using random font styles on every slide",
      "Changing backgrounds on every slide"
    ],
    answer: 0,
    explanation: "A consistent theme gives the presentation a uniform and professional appearance."
  },
  {
    question: "Which Access feature displays records in ascending or descending order?",
    options: [
      "Transition",
      "Animation",
      "Insert",
      "Sort"
    ],
    answer: 3,
    explanation: "Sorting arranges records according to selected criteria."
  },
  {
    question: "Which of the following is a benefit of using queries instead of searching records manually?",
    options: [
      "Increased file size",
      "Faster retrieval of required information",
      "Automatic printing of reports",
      "Reduced database security"
    ],
    answer: 1,
    explanation: "Queries quickly retrieve records that match specified conditions."
  },
  {
    question: "Which keyboard shortcut is commonly used to save a Microsoft Access database or PowerPoint presentation?",
    options: [
      "Ctrl + C",
      "Ctrl + Z",
      "Ctrl + P",
      "Ctrl + S"
    ],
    answer: 3,
    explanation: "Ctrl + S saves the current file."
  },
  {
    question: "Which of the following is NOT a presentation view in Microsoft PowerPoint?",
    options: [
      "Slide Show View",
      "Slide Sorter View",
      "Notes Page View",
      "Database View"
    ],
    answer: 3,
    explanation: "Database View is not a PowerPoint view."
  },
  {
    question: "Which Access object can display information from more than one table?",
    options: [
      "Datasheet only",
      "Report only",
      "Query",
      "Form only"
    ],
    answer: 2,
    explanation: "Queries can combine data from multiple related tables."
  },
  {
    question: "What is the purpose of applying animations to slide objects?",
    options: [
      "To attract attention to important content",
      "To change database fields",
      "To improve internet speed",
      "To reduce file size"
    ],
    answer: 0,
    explanation: "Animations help emphasize information during a presentation."
  },
  {
    question: "Which of the following best describes a presentation layout?",
    options: [
      "The order of records in a database",
      "The arrangement of placeholders on a slide",
      "The type of storage device used",
      "The database relationship diagram"
    ],
    answer: 1,
    explanation: "A slide layout determines where titles, text, and other objects appear."
  },
  {
    question: "Which command should be used if you accidentally delete a slide?",
    options: [
      "Save As",
      "Print",
      "Close",
      "Undo"
    ],
    answer: 3,
    explanation: "The Undo command reverses the last action."
  },
  {
    question: "Which of the following is the primary purpose of a database?",
    options: [
      "To edit videos",
      "To browse the internet",
      "To create presentation effects",
      "To organize and manage related data"
    ],
    answer: 3,
    explanation: "Databases are designed for efficient storage and management of data."
  },
  {
    question: "Which PowerPoint feature allows text to appear one bullet point at a time?",
    options: [
      "Transition",
      "Theme",
      "Slide Master",
      "Animation"
    ],
    answer: 3,
    explanation: "Animation effects can display bullet points one after another."
  },
  {
    question: "Which of the following actions is commonly performed in Datasheet View?",
    options: [
      "Applying slide transitions",
      "Editing records directly",
      "Creating presentation themes",
      "Running animations"
    ],
    answer: 1,
    explanation: "Datasheet View allows users to add, edit, and delete records."
  },
  {
    question: "Which of the following is an advantage of using Microsoft Access?",
    options: [
      "Automatic creation of websites",
      "Editing audio recordings",
      "Efficient storage and retrieval of data",
      "Faster internet connection"
    ],
    answer: 2,
    explanation: "Microsoft Access makes it easy to organize, store, and retrieve information."
  },
  {
    question: "Which of the following should be considered when selecting fonts for a presentation?",
    options: [
      "Decorative appearance only",
      "Randomness",
      "Complexity",
      "Readability"
    ],
    answer: 3,
    explanation: "Fonts should be easy for the audience to read."
  },
  {
    question: "Which feature allows all slides in a presentation to share the same font and background?",
    options: [
      "Slide Master",
      "Animation Pane",
      "Review Tab",
      "Record Navigation Bar"
    ],
    answer: 0,
    explanation: "Slide Master applies consistent formatting to all slides."
  },
  {
    question: "Which of the following is a good reason for previewing a presentation before delivery?",
    options: [
      "To convert the presentation into a database",
      "To delete every animation",
      "To reduce the number of slides automatically",
      "To identify and correct errors"
    ],
    answer: 3,
    explanation: "Previewing helps ensure the presentation is accurate and runs smoothly."
  },
  {
    question: "Which statement best describes the relationship between Microsoft Access and Microsoft PowerPoint?",
    options: [
      "Both are application packages designed for different purposes.",
      "Both perform database management only.",
      "Both are programming languages.",
      "Both are operating systems."
    ],
    answer: 0,
    explanation: "Access is used for database management, while PowerPoint is used for creating presentations."
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
const COS102B = [
  {
    question: "Visual Basic is primarily classified as a:",
    options: [
      "Database Management System",
      "Operating System",
      "Web Browser",
      "Programming Language"
    ],
    answer: 3,
    explanation: "Visual Basic is a programming language used to develop Windows applications."
  },
  {
    question: "Which of the following is the main purpose of a programming language?",
    options: [
      "To increase computer memory",
      "To browse the internet",
      "To repair hardware automatically",
      "To communicate instructions to a computer"
    ],
    answer: 3,
    explanation: "Programming languages are used to write instructions that a computer can execute."
  },
  {
    question: "Which of the following is the default starting point of a Visual Basic application?",
    options: [
      "Toolbox",
      "Module",
      "Form",
      "Debugger"
    ],
    answer: 2,
    explanation: "A Visual Basic project typically starts with a form that serves as the application's interface."
  },
  {
    question: "Which window in Visual Basic displays the properties of the selected object?",
    options: [
      "Project Explorer",
      "Output Window",
      "Properties Window",
      "Code Window"
    ],
    answer: 2,
    explanation: "The Properties Window allows you to modify an object's characteristics."
  },
  {
    question: "Which control is commonly used to display text that users cannot edit?",
    options: [
      "Button",
      "TextBox",
      "Label",
      "ListBox"
    ],
    answer: 2,
    explanation: "A Label displays information without allowing user input."
  },
  {
    question: "Which control allows users to type information?",
    options: [
      "Shape",
      "TextBox",
      "PictureBox",
      "Label"
    ],
    answer: 1,
    explanation: "A TextBox is used to receive input from users."
  },
  {
    question: "Which event occurs when a command button is pressed?",
    options: [
      "Change",
      "Paint",
      "Load",
      "Click"
    ],
    answer: 3,
    explanation: "The Click event is triggered when the user clicks a button."
  },
  {
    question: "Which statement is used to make a decision between two alternatives?",
    options: [
      "Select Case End",
      "For...Next",
      "Do...Loop",
      "If...Then...Else"
    ],
    answer: 3,
    explanation: "The If...Then...Else statement performs conditional decision-making."
  },
  {
    question: "Which looping statement repeats a block of code a specified number of times?",
    options: [
      "While...End While",
      "For...Next",
      "Do Until",
      "Select Case"
    ],
    answer: 1,
    explanation: "A For...Next loop executes a known number of iterations."
  },
  {
    question: "Which loop continues executing as long as a condition remains true?",
    options: [
      "While...End While",
      "If...Else",
      "Select Case",
      "Exit Sub"
    ],
    answer: 0,
    explanation: "A While loop repeats while its condition evaluates to True."
  },
  {
    question: "Which statement is best used when testing multiple possible values of one expression?",
    options: [
      "For Each",
      "If...Then",
      "Do While",
      "Select Case"
    ],
    answer: 3,
    explanation: "Select Case provides a cleaner way to evaluate multiple conditions."
  },
  {
    question: "Which Visual Basic control is mainly used to execute a command?",
    options: [
      "PictureBox",
      "Label",
      "Button",
      "TextBox"
    ],
    answer: 2,
    explanation: "A Button executes code when clicked."
  },
  {
    question: "Which property determines the text displayed on a button?",
    options: [
      "Name",
      "Text",
      "Size",
      "Font"
    ],
    answer: 1,
    explanation: "The Text property controls what appears on the button."
  },
  {
    question: "Which property uniquely identifies a control in the code?",
    options: [
      "Name",
      "Width",
      "Caption",
      "Color"
    ],
    answer: 0,
    explanation: "The Name property is used to reference controls in code."
  },
  {
    question: "Which dialog box allows users to choose a file to open?",
    options: [
      "OpenFileDialog",
      "PrintDialog",
      "ColorDialog",
      "FontDialog"
    ],
    answer: 0,
    explanation: "OpenFileDialog lets users browse and select files."
  },
  {
    question: "Which dialog box is used to select a font?",
    options: [
      "SaveFileDialog",
      "FolderBrowserDialog",
      "OpenFileDialog",
      "FontDialog"
    ],
    answer: 3,
    explanation: "FontDialog allows users to choose font style, size, and appearance."
  },
  {
    question: "What is debugging?",
    options: [
      "Saving a project",
      "Finding and correcting program errors",
      "Creating new forms",
      "Designing user interfaces"
    ],
    answer: 1,
    explanation: "Debugging involves identifying and fixing errors in a program."
  },
  {
    question: "A syntax error occurs when:",
    options: [
      "The program gives an incorrect result.",
      "A file is deleted accidentally.",
      "The program violates the rules of the programming language.",
      "The computer is switched off."
    ],
    answer: 2,
    explanation: "Syntax errors occur when code does not follow language rules."
  },
  {
    question: "Which type of error allows a program to run but produces incorrect results?",
    options: [
      "Logical Error",
      "Syntax Error",
      "Compilation Error",
      "Installation Error"
    ],
    answer: 0,
    explanation: "Logical errors affect program output even though the program executes."
  },
  {
    question: "A procedure is mainly used to:",
    options: [
      "Divide a program into smaller reusable parts",
      "Create databases",
      "Store pictures",
      "Print documents"
    ],
    answer: 0,
    explanation: "Procedures improve program organization and code reuse."
  },
  {
    question: "Which keyword is commonly used to define a procedure in Visual Basic?",
    options: [
      "Class",
      "Module",
      "Array",
      "Sub"
    ],
    answer: 3,
    explanation: "Procedures are commonly declared using the Sub keyword."
  },
  {
    question: "Which data structure stores multiple values under one variable name?",
    options: [
      "Control",
      "Procedure",
      "Array",
      "Constant"
    ],
    answer: 2,
    explanation: "Arrays allow several related values to be stored using one variable name."
  },
  {
    question: "Array elements are usually accessed using:",
    options: [
      "File names",
      "Index numbers",
      "Passwords",
      "Control names"
    ],
    answer: 1,
    explanation: "Each array element is identified by its index."
  },
  {
    question: "Which file operation saves information into a data file?",
    options: [
      "Search",
      "Write",
      "Close",
      "Read"
    ],
    answer: 1,
    explanation: "Writing stores data in a file."
  },
  {
    question: "Which of the following is a major advantage of using data files?",
    options: [
      "They automatically debug programs.",
      "They allow data to be stored permanently.",
      "They increase processor speed.",
      "They reduce monitor size."
    ],
    answer: 1,
    explanation: "Data files preserve information even after the program is closed."
  },
  {
    question: "Which of the following best describes an algorithm?",
    options: [
      "A step-by-step procedure for solving a problem",
      "A database table",
      "A computer virus",
      "A type of computer hardware"
    ],
    answer: 0,
    explanation: "An algorithm is a logical sequence of steps used to solve a problem."
  },
  {
    question: "Which stage of problem-solving comes immediately before writing the program code?",
    options: [
      "Program maintenance",
      "Program testing",
      "Documentation",
      "Algorithm design"
    ],
    answer: 3,
    explanation: "An algorithm is usually developed before coding begins."
  },
  {
    question: "Which of the following symbols is commonly used for assignment in Visual Basic?",
    options: [
      ":=",
      "<>",
      "==",
      "="
    ],
    answer: 3,
    explanation: "The equals sign (=) is used to assign values to variables in Visual Basic."
  },
  {
    question: "A variable is best described as:",
    options: [
      "A type of loop",
      "A programming error",
      "A permanent value that never changes",
      "A named memory location used to store data"
    ],
    answer: 3,
    explanation: "Variables temporarily store data during program execution."
  },
  {
    question: "Which keyword is used to declare a variable in Visual Basic?",
    options: [
      "Input",
      "Public",
      "Let",
      "Dim"
    ],
    answer: 3,
    explanation: "The Dim keyword is commonly used to declare variables."
  },
  {
    question: "Which of the following is a valid numeric data type in Visual Basic?",
    options: [
      "Integer",
      "Label",
      "Menu",
      "Picture"
    ],
    answer: 0,
    explanation: "Integer is used to store whole numbers."
  },
  {
    question: "Which control is most suitable for displaying a list of items from which only one item can be selected?",
    options: [
      "PictureBox",
      "Timer",
      "Label",
      "ListBox"
    ],
    answer: 3,
    explanation: "A ListBox displays a list of items for selection."
  },
  {
    question: "Which control allows users to choose only one option from a group?",
    options: [
      "TextBox",
      "RichTextBox",
      "CheckBox",
      "RadioButton"
    ],
    answer: 3,
    explanation: "Radio buttons allow only one selection within a group."
  },
  {
    question: "Which control allows users to select more than one option?",
    options: [
      "RadioButton",
      "Button",
      "CheckBox",
      "Label"
    ],
    answer: 2,
    explanation: "Check boxes allow multiple selections."
  },
  {
    question: "Which event occurs automatically when a form is first displayed?",
    options: [
      "Leave",
      "Click",
      "Load",
      "DoubleClick"
    ],
    answer: 2,
    explanation: "The Load event occurs before the form appears to the user."
  },
  {
    question: "Which statement is used to terminate a loop before all iterations are completed?",
    options: [
      "End Program",
      "Exit For",
      "Continue",
      "Return"
    ],
    answer: 1,
    explanation: "Exit For immediately leaves a For...Next loop."
  },
  {
    question: "What is the purpose of a nested loop?",
    options: [
      "To remove syntax errors",
      "To create variables automatically",
      "To create multiple forms",
      "To place one loop inside another loop"
    ],
    answer: 3,
    explanation: "A nested loop is a loop contained within another loop."
  },
  {
    question: "Which debugging tool allows a programmer to execute code one statement at a time?",
    options: [
      "Build",
      "Step Into",
      "Save",
      "Compile"
    ],
    answer: 1,
    explanation: "Step Into executes the program one line at a time for debugging."
  },
  {
    question: "Which of the following is an example of a run-time error?",
    options: [
      "Forgetting a closing bracket before compilation",
      "Dividing a number by zero during execution",
      "Using an invalid variable name",
      "Misspelling a keyword"
    ],
    answer: 1,
    explanation: "Run-time errors occur while the program is executing."
  },
  {
    question: "A procedure that returns a value is commonly known as a:",
    options: [
      "Module",
      "Form",
      "Label",
      "Function"
    ],
    answer: 3,
    explanation: "A Function performs a task and returns a value."
  },
  {
    question: "Which of the following is an advantage of using procedures?",
    options: [
      "They increase file size.",
      "They remove variables automatically.",
      "They reduce code repetition.",
      "They eliminate all program errors."
    ],
    answer: 2,
    explanation: "Procedures promote code reuse and improve readability."
  },
  {
    question: "Which of the following is true about arrays?",
    options: [
      "All elements usually have the same data type.",
      "Arrays cannot be modified.",
      "Every element must have a different data type.",
      "Arrays can store only text values."
    ],
    answer: 0,
    explanation: "Arrays typically store multiple values of the same data type."
  },
  {
    question: "Which operation retrieves information from a data file?",
    options: [
      "Save",
      "Print",
      "Write",
      "Read"
    ],
    answer: 3,
    explanation: "Reading obtains previously stored data from a file."
  },
  {
    question: "Which file mode allows new information to be added to the end of an existing file?",
    options: [
      "Design Mode",
      "Input Mode",
      "Read Mode",
      "Append Mode"
    ],
    answer: 3,
    explanation: "Append Mode adds new records without deleting existing ones."
  },
  {
    question: "Which of the following best explains a menu in a Visual Basic application?",
    options: [
      "A collection of variables",
      "A data file",
      "A debugging tool",
      "A list of commands available to the user"
    ],
    answer: 3,
    explanation: "Menus provide users with organized program commands."
  },
  {
    question: "Which dialog box is most appropriate for selecting a location to save a file?",
    options: [
      "SaveFileDialog",
      "FontDialog",
      "OpenFileDialog",
      "ColorDialog"
    ],
    answer: 0,
    explanation: "SaveFileDialog allows users to choose where a file should be saved."
  },
  {
    question: "Which of the following is the main purpose of testing a program?",
    options: [
      "To increase the computer's memory",
      "To verify that it works correctly",
      "To replace the operating system",
      "To install Visual Basic"
    ],
    answer: 1,
    explanation: "Testing ensures the program performs as expected."
  },
  {
    question: "Which programming structure repeats a set of statements while a condition is true?",
    options: [
      "Declaration",
      "Selection",
      "Sequence",
      "Iteration"
    ],
    answer: 3,
    explanation: "Iteration (looping) repeatedly executes statements based on a condition."
  },
  {
    question: "Which of the following is considered good programming practice?",
    options: [
      "Ignoring comments in code",
      "Writing the entire program in one procedure",
      "Using meaningful variable names",
      "Using one variable for every purpose"
    ],
    answer: 2,
    explanation: "Meaningful variable names improve readability and maintenance."
  },
  {
    question: "Which statement best describes Visual Basic?",
    options: [
      "It is an operating system for personal computers.",
      "It is a programming language used to develop applications with graphical user interfaces.",
      "It is software used only for creating databases.",
      "It is a web browser used for internet access."
    ],
    answer: 1,
    explanation: "Visual Basic is an event-driven programming language commonly used to build Windows applications with GUIs."
  }
];

const COS102C = [
  {
    question: "Which of the following is the primary purpose of Visual Basic?",
    options: [
      "To repair damaged hardware",
      "To create application programs",
      "To format storage devices",
      "To manage network traffic"
    ],
    answer: 1,
    explanation: "Visual Basic is a programming language used to develop software applications."
  },
  {
    question: "A Visual Basic project is made up of one or more:",
    options: [
      "Tables",
      "Slides",
      "Forms",
      "Records"
    ],
    answer: 2,
    explanation: "A Visual Basic project consists of one or more forms that make up the application's interface."
  },
  {
    question: "Which component of the Visual Basic environment contains the controls used to design a form?",
    options: [
      "Taskbar",
      "Toolbox",
      "Output Window",
      "Status Bar"
    ],
    answer: 1,
    explanation: "The Toolbox contains controls such as buttons, labels, and text boxes."
  },
  {
    question: "Which control is most suitable for displaying a company logo?",
    options: [
      "Label",
      "PictureBox",
      "CheckBox",
      "Button"
    ],
    answer: 1,
    explanation: "The PictureBox control is used to display images."
  },
  {
    question: "Which property changes the background color of a control?",
    options: [
      "Text",
      "Name",
      "Font",
      "BackColor"
    ],
    answer: 3,
    explanation: "The BackColor property changes the background color of a control."
  },
  {
    question: "Which property determines whether a control is visible on a form?",
    options: [
      "Visible",
      "Width",
      "Height",
      "Enabled"
    ],
    answer: 0,
    explanation: "Setting the Visible property determines whether a control appears on the form."
  },
  {
    question: "Which control is commonly used to allow users to select a date?",
    options: [
      "Label",
      "ListBox",
      "DateTimePicker",
      "GroupBox"
    ],
    answer: 2,
    explanation: "DateTimePicker provides a calendar interface for selecting dates."
  },
  {
    question: "Which statement is used to repeat a block of code until a condition becomes true?",
    options: [
      "If...Then",
      "Do Until...Loop",
      "Select Case",
      "End If"
    ],
    answer: 1,
    explanation: "A Do Until loop continues until the specified condition becomes true."
  },
  {
    question: "Which loop is most suitable when the number of repetitions is unknown?",
    options: [
      "For...Next",
      "Select Case",
      "While...End While",
      "If...Then"
    ],
    answer: 2,
    explanation: "A While loop is useful when the number of iterations depends on a condition."
  },
  {
    question: "Which statement transfers program execution to another procedure?",
    options: [
      "Print",
      "Exit",
      "Read",
      "Call"
    ],
    answer: 3,
    explanation: "The Call statement invokes another procedure."
  },
  {
    question: "Which of the following is an example of a Boolean value?",
    options: [
      "\"Computer\"",
      "100",
      "15.6",
      "True"
    ],
    answer: 3,
    explanation: "Boolean values are either True or False."
  },
  {
    question: "Which data type is most suitable for storing decimal numbers?",
    options: [
      "Double",
      "Boolean",
      "String",
      "Integer"
    ],
    answer: 0,
    explanation: "Double stores numbers with decimal points."
  },
  {
    question: "Which operator is commonly used for multiplication in Visual Basic?",
    options: [
      "%",
      "#",
      "&",
      "*"
    ],
    answer: 3,
    explanation: "The asterisk (*) is the multiplication operator."
  },
  {
    question: "Which operator is used to join two text strings together?",
    options: [
      "/",
      "&",
      "*",
      "^"
    ],
    answer: 1,
    explanation: "The ampersand (&) concatenates strings."
  },
  {
    question: "Which menu normally contains commands such as Save, Open, and Exit?",
    options: [
      "Edit",
      "File",
      "Help",
      "View"
    ],
    answer: 1,
    explanation: "The File menu contains file management commands."
  },
  {
    question: "Which dialog box allows users to choose a color?",
    options: [
      "ColorDialog",
      "SaveFileDialog",
      "FontDialog",
      "PrintDialog"
    ],
    answer: 0,
    explanation: "ColorDialog lets users select colors."
  },
  {
    question: "Which of the following is a benefit of debugging?",
    options: [
      "It increases RAM capacity.",
      "It creates forms automatically.",
      "It helps locate and correct program errors.",
      "It improves internet speed."
    ],
    answer: 2,
    explanation: "Debugging helps identify and fix programming errors."
  },
  {
    question: "Which type of error prevents a program from compiling successfully?",
    options: [
      "Logical Error",
      "Syntax Error",
      "Run-time Error",
      "Calculation Error"
    ],
    answer: 1,
    explanation: "Syntax errors violate programming language rules."
  },
  {
    question: "Which statement immediately ends a procedure?",
    options: [
      "Continue For",
      "End While",
      "Exit Sub",
      "Break"
    ],
    answer: 2,
    explanation: "Exit Sub terminates the current procedure."
  },
  {
    question: "Which keyword is commonly used to declare a constant?",
    options: [
      "Static",
      "Fixed",
      "Const",
      "Let"
    ],
    answer: 2,
    explanation: "The Const keyword defines values that cannot change."
  },
  {
    question: "Which of the following is an advantage of using arrays?",
    options: [
      "They eliminate loops.",
      "They automatically create files.",
      "They prevent all syntax errors.",
      "They reduce the need for multiple related variables."
    ],
    answer: 3,
    explanation: "Arrays store multiple related values under one variable name."
  },
  {
    question: "Which array index represents the first element in a zero-based array?",
    options: [
      "1",
      "2",
      "0",
      "-1"
    ],
    answer: 2,
    explanation: "In a zero-based array, the first element has an index of 0."
  },
  {
    question: "Which operation removes a file from storage permanently?",
    options: [
      "Write",
      "Read",
      "Delete",
      "Append"
    ],
    answer: 2,
    explanation: "Delete removes a file from storage."
  },
  {
    question: "Which file operation stores additional information without removing existing contents?",
    options: [
      "Append",
      "Read",
      "Rename",
      "Close"
    ],
    answer: 0,
    explanation: "Append adds new data to the end of an existing file."
  },
  {
    question: "Which of the following best explains modular programming?",
    options: [
      "Using only one procedure for the entire program",
      "Avoiding the use of variables",
      "Writing every statement on one line",
      "Dividing a program into smaller, manageable procedures"
    ],
    answer: 3,
    explanation: "Modular programming improves readability, maintenance, and code reuse."
  },
  {
    question: "Which Visual Basic control is commonly used to group related controls together?",
    options: [
      "TextBox",
      "PictureBox",
      "GroupBox",
      "Label"
    ],
    answer: 2,
    explanation: "A GroupBox organizes related controls, especially RadioButtons and CheckBoxes."
  },
  {
    question: "Which property determines whether a user can interact with a control?",
    options: [
      "Enabled",
      "BackColor",
      "Font",
      "Height"
    ],
    answer: 0,
    explanation: "Setting the Enabled property to False prevents user interaction."
  },
  {
    question: "Which of the following is an example of an input device in a Visual Basic application?",
    options: [
      "Label",
      "Shape",
      "PictureBox",
      "TextBox"
    ],
    answer: 3,
    explanation: "A TextBox allows users to enter data into an application."
  },
  {
    question: "Which programming structure executes statements one after another without making decisions?",
    options: [
      "Iteration",
      "Sequence",
      "Recursion",
      "Selection"
    ],
    answer: 1,
    explanation: "Sequence is the simplest control structure where instructions are executed in order."
  },
  {
    question: "Which statement is used to execute one block of code when a condition is true and another when it is false?",
    options: [
      "If...Then...Else",
      "Do...Loop",
      "For...Next",
      "Select Case"
    ],
    answer: 0,
    explanation: "If...Then...Else allows a program to choose between two alternatives."
  },
  {
    question: "Which loop is guaranteed to execute its body at least once?",
    options: [
      "Do...Loop",
      "While...End While",
      "Select Case",
      "For...Next"
    ],
    answer: 0,
    explanation: "A Do...Loop with the condition checked at the end executes at least once."
  },
  {
    question: "Which Visual Basic statement is most appropriate when there are many possible values for one variable?",
    options: [
      "Do Until",
      "Select Case",
      "While...End While",
      "Exit Sub"
    ],
    answer: 1,
    explanation: "Select Case is efficient when comparing one expression against many values."
  },
  {
    question: "Which menu option is commonly used to close an application?",
    options: [
      "Exit",
      "Save",
      "View",
      "Edit"
    ],
    answer: 0,
    explanation: "The Exit command closes the application."
  },
  {
    question: "Which dialog box allows a user to choose a printer before printing?",
    options: [
      "OpenFileDialog",
      "ColorDialog",
      "FontDialog",
      "PrintDialog"
    ],
    answer: 3,
    explanation: "PrintDialog lets users select a printer and printing options."
  },
  {
    question: "Which of the following best describes a breakpoint?",
    options: [
      "A file storage location",
      "A place where program execution pauses during debugging",
      "A command used to end a program",
      "A type of syntax error"
    ],
    answer: 1,
    explanation: "Breakpoints allow programmers to pause execution and inspect variables."
  },
  {
    question: "Which debugging technique involves checking the value of variables while the program is running?",
    options: [
      "Variable inspection",
      "Documentation",
      "Compilation",
      "Formatting"
    ],
    answer: 0,
    explanation: "Inspecting variables helps identify incorrect values during execution."
  },
  {
    question: "Which type of procedure does not return a value?",
    options: [
      "Event Procedure",
      "Sub Procedure",
      "Constructor",
      "Function Procedure"
    ],
    answer: 1,
    explanation: "A Sub procedure performs actions but does not return a value."
  },
  {
    question: "Which keyword is commonly used to send a value back from a Function procedure?",
    options: [
      "Exit",
      "Return",
      "Stop",
      "End"
    ],
    answer: 1,
    explanation: "The Return statement sends the function's result back to the calling code."
  },
  {
    question: "Which of the following is an advantage of passing arguments to a procedure?",
    options: [
      "It allows procedures to work with different values.",
      "It removes syntax errors.",
      "It automatically creates arrays.",
      "It prevents loops from executing."
    ],
    answer: 0,
    explanation: "Arguments make procedures more flexible and reusable."
  },
  {
    question: "Which statement correctly describes an array?",
    options: [
      "It stores a collection of related values.",
      "It stores one value only.",
      "It stores only text.",
      "It stores only numbers."
    ],
    answer: 0,
    explanation: "Arrays store multiple related values under one variable name."
  },
  {
    question: "If an array contains 10 elements and uses zero-based indexing, what is the index of the last element?",
    options: [
      "11",
      "10",
      "9",
      "8"
    ],
    answer: 2,
    explanation: "Zero-based arrays start at index 0, so the tenth element has index 9."
  },
  {
    question: "Which file operation is performed first before data can be read from a file?",
    options: [
      "Open the file",
      "Rename the file",
      "Delete the file",
      "Close the file"
    ],
    answer: 0,
    explanation: "A file must be opened before it can be read."
  },
  {
    question: "Which statement is true about data files?",
    options: [
      "They are used only for images.",
      "They allow information to be stored permanently.",
      "They exist only while the program is running.",
      "They cannot be edited."
    ],
    answer: 1,
    explanation: "Data files keep information even after the program is closed."
  },
  {
    question: "Which of the following is an example of external data storage?",
    options: [
      "Data File",
      "Array",
      "Variable",
      "Constant"
    ],
    answer: 0,
    explanation: "Data files are stored on storage devices outside the program's memory."
  },
  {
    question: "Which of the following is most important when naming variables?",
    options: [
      "The name should contain spaces.",
      "The name should be meaningful.",
      "The name should begin with a number.",
      "The name should be as short as possible, even if unclear."
    ],
    answer: 1,
    explanation: "Meaningful variable names improve program readability."
  },
  {
    question: "Which of the following best explains an event-driven program?",
    options: [
      "It contains no procedures.",
      "It responds to user or system actions.",
      "It runs only on the internet.",
      "It cannot use loops."
    ],
    answer: 1,
    explanation: "Event-driven programs respond to events such as mouse clicks and key presses."
  },
  {
    question: "Which control is most appropriate for displaying information that the user should not edit?",
    options: [
      "Label",
      "CheckBox",
      "TextBox",
      "ComboBox"
    ],
    answer: 0,
    explanation: "Labels display text without allowing user modification."
  },
  {
    question: "Which of the following is the main purpose of comments in a program?",
    options: [
      "To remove logical errors automatically",
      "To increase execution speed",
      "To explain the code for easier understanding",
      "To reduce memory usage"
    ],
    answer: 2,
    explanation: "Comments make programs easier to understand and maintain."
  },
  {
    question: "Which of the following is a benefit of modular programming?",
    options: [
      "Increased hardware speed",
      "Easier testing and maintenance",
      "Reduced storage capacity",
      "Elimination of all programming errors"
    ],
    answer: 1,
    explanation: "Breaking programs into modules makes them easier to test, debug, and maintain."
  },
  {
    question: "During program development, what should be done after coding is completed?",
    options: [
      "Install another programming language",
      "Format the hard drive",
      "Test and debug the program",
      "Delete the source code"
    ],
    answer: 2,
    explanation: "After coding, the program should be tested and debugged to ensure it works correctly."
  }
];

const COS102D = [
  {
    question: "Which of the following best describes a compiler?",
    options: [
      "A software used to create presentations",
      "A device used to store data permanently",
      "A program that converts source code into machine code",
      "A programming language"
    ],
    answer: 2,
    explanation: "A compiler translates an entire program from source code into machine code before execution."
  },
  {
    question: "Which of the following is an example of an event in Visual Basic?",
    options: [
      "Integer",
      "Click",
      "Module",
      "String"
    ],
    answer: 1,
    explanation: "An event is an action such as clicking a button or pressing a key."
  },
  {
    question: "Which control is most suitable for allowing users to choose one option from a drop-down list?",
    options: [
      "PictureBox",
      "ComboBox",
      "Timer",
      "Label"
    ],
    answer: 1,
    explanation: "A ComboBox combines a text box with a drop-down list."
  },
  {
    question: "Which of the following is NOT a valid reason for using variables in programming?",
    options: [
      "To replace the operating system",
      "To improve program flexibility",
      "To hold values that may change during execution",
      "To store data temporarily"
    ],
    answer: 0,
    explanation: "Variables store data; they do not replace an operating system."
  },
  {
    question: "Which arithmetic operator is used to calculate the remainder after division in Visual Basic?",
    options: [
      "/",
      "*",
      "Mod",
      "^"
    ],
    answer: 2,
    explanation: "The Mod operator returns the remainder after division."
  },
  {
    question: "Which relational operator checks whether two values are not equal?",
    options: [
      "<=",
      "<>",
      ">=",
      "="
    ],
    answer: 1,
    explanation: "The <> operator means \"not equal to.\""
  },
  {
    question: "Which logical operator returns True only when both conditions are True?",
    options: [
      "Or",
      "And",
      "Xor",
      "Not"
    ],
    answer: 1,
    explanation: "The And operator requires both conditions to be true."
  },
  {
    question: "Which programming structure is represented by decision-making?",
    options: [
      "Output",
      "Sequence",
      "Selection",
      "Input"
    ],
    answer: 2,
    explanation: "Selection chooses between different actions based on conditions."
  },
  {
    question: "Which of the following is the purpose of indentation in programming?",
    options: [
      "To improve code readability",
      "To reduce memory usage",
      "To prevent compilation",
      "To increase execution speed"
    ],
    answer: 0,
    explanation: "Indentation makes code easier to read and understand."
  },
  {
    question: "Which statement is used to stop the execution of the current loop immediately?",
    options: [
      "Return",
      "End",
      "Continue While",
      "Exit Do"
    ],
    answer: 3,
    explanation: "Exit Do immediately terminates a Do loop."
  },
  {
    question: "Which Visual Basic control is mainly used to display a list from which multiple items may be selected?",
    options: [
      "Button",
      "ListBox",
      "Timer",
      "Label"
    ],
    answer: 1,
    explanation: "A ListBox can be configured to allow multiple selections."
  },
  {
    question: "Which property determines the size of text displayed in a control?",
    options: [
      "Width",
      "Font",
      "Visible",
      "Enabled"
    ],
    answer: 1,
    explanation: "The Font property controls font style, type, and size."
  },
  {
    question: "Which of the following best describes an infinite loop?",
    options: [
      "A loop used only for arrays",
      "A loop that always produces an error",
      "A loop that never ends because its stopping condition is never met",
      "A loop that executes once only"
    ],
    answer: 2,
    explanation: "Infinite loops continue indefinitely unless interrupted."
  },
  {
    question: "Which statement is true about comments in Visual Basic?",
    options: [
      "They are used to declare variables.",
      "They increase program speed.",
      "They are ignored during program execution.",
      "They are executed before every statement."
    ],
    answer: 2,
    explanation: "Comments explain code and are ignored by the compiler."
  },
  {
    question: "Which debugging feature allows a programmer to observe variable values while execution is paused?",
    options: [
      "Watch Window",
      "Toolbox",
      "Solution Explorer",
      "Project Explorer"
    ],
    answer: 0,
    explanation: "The Watch Window monitors variable values during debugging."
  },
  {
    question: "Which of the following is the main purpose of testing a procedure separately?",
    options: [
      "To reduce processor speed",
      "To verify that it performs its intended task correctly",
      "To increase RAM size",
      "To create more variables"
    ],
    answer: 1,
    explanation: "Individual testing helps identify errors before integrating procedures."
  },
  {
    question: "Which statement correctly describes a parameter?",
    options: [
      "A menu option",
      "A storage device",
      "A programming error",
      "A value passed into a procedure or function"
    ],
    answer: 3,
    explanation: "Parameters allow procedures to receive information."
  },
  {
    question: "Which of the following is an advantage of functions over repeated calculations?",
    options: [
      "They increase file size.",
      "They eliminate variables.",
      "They reduce code duplication.",
      "They prevent syntax errors automatically."
    ],
    answer: 2,
    explanation: "Functions promote code reuse and easier maintenance."
  },
  {
    question: "Which array operation retrieves the value stored at a specific position?",
    options: [
      "Debugging",
      "Compiling",
      "Indexing",
      "Formatting"
    ],
    answer: 2,
    explanation: "Array elements are accessed using their index."
  },
  {
    question: "Which statement is true about array indices?",
    options: [
      "They identify the position of elements in an array.",
      "They determine file size.",
      "They store procedure names.",
      "They are used only in loops."
    ],
    answer: 0,
    explanation: "Each array element is identified by an index."
  },
  {
    question: "Which file operation is performed after reading or writing data?",
    options: [
      "Compile",
      "Close",
      "Rename",
      "Delete"
    ],
    answer: 1,
    explanation: "Files should be closed after use to free system resources."
  },
  {
    question: "Which file organization stores information in records?",
    options: [
      "Label",
      "Menu",
      "Button",
      "Data File"
    ],
    answer: 3,
    explanation: "Data files store information as records that can be read or updated."
  },
  {
    question: "Which of the following is considered good programming practice?",
    options: [
      "Using descriptive procedure names",
      "Avoiding comments completely",
      "Writing all code inside one procedure",
      "Using meaningless variable names"
    ],
    answer: 0,
    explanation: "Descriptive names improve readability and maintenance."
  },
  {
    question: "Which Visual Basic window displays all forms and modules in a project?",
    options: [
      "Output Window",
      "Status Bar",
      "Immediate Window",
      "Project Explorer"
    ],
    answer: 3,
    explanation: "Project Explorer lists all project components."
  },
  {
    question: "Which of the following best explains problem-solving in programming?",
    options: [
      "The replacement of computer hardware",
      "An organized process of analyzing a problem and developing a solution",
      "The creation of presentation slides",
      "The installation of programming software"
    ],
    answer: 1,
    explanation: "Problem-solving involves understanding a problem, designing a solution, coding, testing, and refining the program."
  },
  {
    question: "Which of the following controls is commonly used to display time at regular intervals in a Visual Basic application?",
    options: [
      "Label",
      "Timer",
      "CheckBox",
      "ComboBox"
    ],
    answer: 1,
    explanation: "The Timer control generates events at specified time intervals."
  },
  {
    question: "Which property determines the text shown in the title bar of a form?",
    options: [
      "Width",
      "Text",
      "Caption",
      "Name"
    ],
    answer: 1,
    explanation: "In modern Visual Basic (.NET), the Text property determines the form's title."
  },
  {
    question: "Which statement is used to declare an array named Scores with 20 elements?",
    options: [
      "Dim Scores(19) As Integer",
      "Scores = New Integer(20)",
      "Array Scores = 20",
      "Integer Scores(20)"
    ],
    answer: 0,
    explanation: "In a zero-based array, Scores(19) creates 20 elements (indices 0-19)."
  },
  {
    question: "Which of the following is the primary purpose of a menu in an application?",
    options: [
      "To replace procedures",
      "To increase processor speed",
      "To store variables permanently",
      "To provide users with organized commands"
    ],
    answer: 3,
    explanation: "Menus group commands so users can easily access program functions."
  },
  {
    question: "Which debugging window allows a programmer to execute commands during program execution?",
    options: [
      "Toolbox",
      "Properties Window",
      "Immediate Window",
      "Form Designer"
    ],
    answer: 2,
    explanation: "The Immediate Window allows execution of commands and evaluation of expressions during debugging."
  },
  {
    question: "Which of the following is an example of a run-time error?",
    options: [
      "Forgetting to close quotation marks",
      "Using an invalid variable name",
      "Misspelling a keyword",
      "Attempting to open a file that does not exist"
    ],
    answer: 3,
    explanation: "Run-time errors occur while the program is executing."
  },
  {
    question: "Which keyword is commonly used to exit a Function procedure before reaching the end?",
    options: [
      "End Function",
      "Stop Function",
      "Break Function",
      "Exit Function"
    ],
    answer: 3,
    explanation: "Exit Function terminates the function immediately."
  },
  {
    question: "Which of the following is the main advantage of using functions?",
    options: [
      "They eliminate debugging.",
      "They can return calculated values.",
      "They replace variables completely.",
      "They automatically create forms."
    ],
    answer: 1,
    explanation: "Functions process data and return results to the calling code."
  },
  {
    question: "Which statement is true about arrays?",
    options: [
      "Arrays can contain only one value.",
      "Every element occupies a separate memory location.",
      "Arrays are used only for text.",
      "Arrays cannot be sorted."
    ],
    answer: 1,
    explanation: "Each array element has its own memory location and index."
  },
  {
    question: "Which operation is used to retrieve stored information from a data file?",
    options: [
      "Read",
      "Rename",
      "Delete",
      "Append"
    ],
    answer: 0,
    explanation: "Reading retrieves data from an existing file."
  },
  {
    question: "Which file mode preserves existing records while adding new ones?",
    options: [
      "Binary Mode",
      "Output Mode",
      "Append Mode",
      "Input Mode"
    ],
    answer: 2,
    explanation: "Append Mode adds new records to the end of the file."
  },
  {
    question: "Which Visual Basic control allows users to increase or decrease a numeric value using arrows?",
    options: [
      "GroupBox",
      "NumericUpDown",
      "Label",
      "PictureBox"
    ],
    answer: 1,
    explanation: "NumericUpDown provides arrow buttons for adjusting numeric values."
  },
  {
    question: "Which event occurs when a user changes the contents of a TextBox?",
    options: [
      "TextChanged",
      "Paint",
      "Load",
      "Click"
    ],
    answer: 0,
    explanation: "The TextChanged event occurs whenever the text changes."
  },
  {
    question: "Which programming principle encourages breaking large programs into smaller sections?",
    options: [
      "Binary programming",
      "Machine coding",
      "Sequential programming",
      "Modular programming"
    ],
    answer: 3,
    explanation: "Modular programming improves organization, testing, and maintenance."
  },
  {
    question: "Which statement best describes a logical operator?",
    options: [
      "It combines or evaluates conditions.",
      "It declares variables.",
      "It performs arithmetic calculations only.",
      "It stores values permanently."
    ],
    answer: 0,
    explanation: "Logical operators such as And, Or, and Not evaluate conditions."
  },
  {
    question: "Which of the following is most suitable for storing a person's full name?",
    options: [
      "String",
      "Boolean",
      "Double",
      "Integer"
    ],
    answer: 0,
    explanation: "The String data type stores text."
  },
  {
    question: "Which symbol is commonly used to begin a comment in Visual Basic?",
    options: [
      "' (apostrophe)",
      "&",
      "*",
      "#"
    ],
    answer: 0,
    explanation: "An apostrophe (') marks the beginning of a comment."
  },
  {
    question: "Which step usually follows debugging during program development?",
    options: [
      "Flowchart creation",
      "Algorithm design",
      "Variable declaration",
      "Documentation or deployment"
    ],
    answer: 3,
    explanation: "After debugging, programs are commonly documented or deployed."
  },
  {
    question: "Which of the following best describes source code?",
    options: [
      "A printed copy of a program",
      "Machine language executed directly by hardware",
      "Data stored in a database",
      "Instructions written by a programmer in a programming language"
    ],
    answer: 3,
    explanation: "Source code is the human-readable code written by programmers."
  },
  {
    question: "Which control is commonly used to allow users to select a single item from a drop-down list?",
    options: [
      "Timer",
      "ComboBox",
      "Label",
      "PictureBox"
    ],
    answer: 1,
    explanation: "A ComboBox displays a drop-down list for selecting an item."
  },
  {
    question: "Which of the following is an advantage of proper program documentation?",
    options: [
      "It increases processor speed.",
      "It eliminates all errors.",
      "It reduces hard disk size.",
      "It makes programs easier to understand and maintain."
    ],
    answer: 3,
    explanation: "Documentation helps programmers understand and maintain software."
  },
  {
    question: "Which type of testing checks whether the complete program works as expected?",
    options: [
      "Data Type Testing",
      "System Testing",
      "Variable Testing",
      "Syntax Testing"
    ],
    answer: 1,
    explanation: "System testing verifies the complete application."
  },
  {
    question: "Which statement is true about event-driven programming?",
    options: [
      "Programs execute only from top to bottom without interruption.",
      "Program execution is triggered by events such as clicks and key presses.",
      "Events are ignored during execution.",
      "It does not support graphical interfaces."
    ],
    answer: 1,
    explanation: "Event-driven programs respond to user and system events."
  },
  {
    question: "Which of the following is a common reason for using procedures?",
    options: [
      "To prevent user input",
      "To replace arrays completely",
      "To avoid repeating the same code in multiple places",
      "To remove all variables from a program"
    ],
    answer: 2,
    explanation: "Procedures improve code reuse and reduce duplication."
  },
  {
    question: "Which of the following best describes Visual Basic?",
    options: [
      "A computer operating system",
      "An event-driven programming language used to develop Windows applications",
      "A database management package",
      "A spreadsheet application"
    ],
    answer: 1,
    explanation: "Visual Basic is an event-driven programming language widely used for building Windows-based applications."
  }
];

const COS102E = [
  {
    question: "What is the output?\n\nDim x As Integer = 8\nDim y As Integer = 5\nConsole.WriteLine(x - y)",
    options: [
      "8",
      "40",
      "3",
      "13"
    ],
    answer: 2,
    explanation: "8 - 5 = 3."
  },
  {
    question: "What is the output?\n\nDim a As Integer = 4\na = a * 3\nConsole.WriteLine(a)",
    options: [
      "12",
      "3",
      "16",
      "7"
    ],
    answer: 0,
    explanation: "4 x 3 = 12."
  },
  {
    question: "What will be displayed?\n\nDim x As Integer = 10\nIf x > 6 Then\n  Console.WriteLine(\"Yes\")\nElse\n  Console.WriteLine(\"No\")\nEnd If",
    options: [
      "No",
      "Yes",
      "Error",
      "Nothing"
    ],
    answer: 1,
    explanation: "Since 10 is greater than 6, Yes is displayed."
  },
  {
    question: "What is the value of sum after execution?\n\nDim sum As Integer = 0\nFor i = 1 To 4\n  sum += i\nNext",
    options: [
      "10",
      "6",
      "8",
      "12"
    ],
    answer: 0,
    explanation: "1 + 2 + 3 + 4 = 10."
  },
  {
    question: "What is printed?\n\nDim n As Integer = 15\nIf n Mod 2 = 0 Then\n  Console.WriteLine(\"Even\")\nElse\n  Console.WriteLine(\"Odd\")\nEnd If",
    options: [
      "15",
      "Even",
      "Odd",
      "Error"
    ],
    answer: 2,
    explanation: "15 is not divisible by 2."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 9\nx += 2\nConsole.WriteLine(x)",
    options: [
      "11",
      "18",
      "7",
      "9"
    ],
    answer: 0,
    explanation: "9 + 2 = 11."
  },
  {
    question: "How many times will the loop execute?\n\nFor i = 2 To 8 Step 2\nNext",
    options: [
      "4",
      "2",
      "5",
      "3"
    ],
    answer: 0,
    explanation: "Values are 2, 4, 6, 8 (4 iterations)."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 20\nSelect Case x\n  Case 10\n    Console.WriteLine(\"A\")\n  Case 20\n    Console.WriteLine(\"B\")\n  Case Else\n    Console.WriteLine(\"C\")\nEnd Select",
    options: [
      "B",
      "A",
      "C",
      "Error"
    ],
    answer: 0,
    explanation: "The value matches Case 20."
  },
  {
    question: "What is displayed?\n\nDim i As Integer = 5\nDo While i > 2\n  i -= 1\nLoop\nConsole.WriteLine(i)",
    options: [
      "1",
      "2",
      "5",
      "3"
    ],
    answer: 1,
    explanation: "The loop stops when i becomes 2."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 6\nDim y As Integer = 4\nConsole.WriteLine(x + y * 2)",
    options: [
      "10",
      "14",
      "16",
      "20"
    ],
    answer: 1,
    explanation: "Multiplication first: 4 x 2 = 8; then 6 + 8 = 14."
  },
  {
    question: "Which control is mainly used to accept user input?",
    options: [
      "PictureBox",
      "Timer",
      "Label",
      "TextBox"
    ],
    answer: 3,
    explanation: "A TextBox allows users to enter data."
  },
  {
    question: "What is the output?\n\nDim a As Integer = 3\nFor i = 1 To 2\n  a += 2\nNext\nConsole.WriteLine(a)",
    options: [
      "7",
      "5",
      "8",
      "6"
    ],
    answer: 0,
    explanation: "3 -> 5 -> 7."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 12\nIf x < 10 Then\n  Console.WriteLine(\"Low\")\nElse\n  Console.WriteLine(\"High\")\nEnd If",
    options: [
      "High",
      "12",
      "Low",
      "Error"
    ],
    answer: 0,
    explanation: "12 is greater than 10."
  },
  {
    question: "What is the value of i after execution?\n\nDim i As Integer = 1\nWhile i < 6\n  i += 2\nEnd While",
    options: [
      "6",
      "7",
      "8",
      "5"
    ],
    answer: 1,
    explanation: "1 -> 3 -> 5 -> 7, then the condition becomes false."
  },
  {
    question: "Which keyword is used to declare a variable?",
    options: [
      "Loop",
      "Dim",
      "Const",
      "Sub"
    ],
    answer: 1,
    explanation: "Dim declares variables in Visual Basic."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 7\nConsole.WriteLine(x Mod 3)",
    options: [
      "1",
      "2",
      "3",
      "4"
    ],
    answer: 0,
    explanation: "The remainder when 7 is divided by 3 is 1."
  },
  {
    question: "What is displayed?\n\nDim total As Integer = 5\ntotal *= 4\nConsole.WriteLine(total)",
    options: [
      "9",
      "10",
      "20",
      "25"
    ],
    answer: 2,
    explanation: "5 x 4 = 20."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 4\nIf x = 4 Then\n  Console.WriteLine(\"Correct\")\nEnd If",
    options: [
      "Wrong",
      "Error",
      "Nothing",
      "Correct"
    ],
    answer: 3,
    explanation: "The condition is true."
  },
  {
    question: "Which event occurs when a button is pressed?",
    options: [
      "Close",
      "Paint",
      "Load",
      "Click"
    ],
    answer: 3,
    explanation: "The Click event occurs when the button is clicked."
  },
  {
    question: "What is the output?\n\nDim arr() As Integer = {2,4,6,8}\nConsole.WriteLine(arr(2))",
    options: [
      "8",
      "2",
      "6",
      "4"
    ],
    answer: 2,
    explanation: "Arrays start at index 0, so arr(2) is the third element: 6."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 18\nConsole.WriteLine(x / 3)",
    options: [
      "18",
      "9",
      "6",
      "5"
    ],
    answer: 2,
    explanation: "18 / 3 = 6."
  },
  {
    question: "Which of the following is used to store many values under one variable name?",
    options: [
      "Label",
      "Form",
      "Procedure",
      "Array"
    ],
    answer: 3,
    explanation: "An array stores multiple related values."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 2\nFor i = 1 To 3\n  x *= 2\nNext\nConsole.WriteLine(x)",
    options: [
      "16",
      "12",
      "8",
      "10"
    ],
    answer: 0,
    explanation: "2 -> 4 -> 8 -> 16."
  },
  {
    question: "What is displayed?\n\nDim x As Integer = 5\nSelect Case x\n  Case 1 To 4\n    Console.WriteLine(\"Small\")\n  Case 5 To 8\n    Console.WriteLine(\"Medium\")\nEnd Select",
    options: [
      "Error",
      "Small",
      "Large",
      "Medium"
    ],
    answer: 3,
    explanation: "5 falls within the range 5 to 8."
  },
  {
    question: "Which statement is used to define a procedure that does not return a value?",
    options: [
      "Module",
      "Sub",
      "Function",
      "Dim"
    ],
    answer: 1,
    explanation: "A Sub procedure performs actions but does not return a value."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 3\nDim y As Integer = 4\nConsole.WriteLine(x ^ 2 + y)",
    options: [
      "7",
      "9",
      "13",
      "12"
    ],
    answer: 2,
    explanation: "3^2 = 9, then 9 + 4 = 13."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 12\nIf x >= 10 And x < 20 Then\n  Console.WriteLine(\"Valid\")\nElse\n  Console.WriteLine(\"Invalid\")\nEnd If",
    options: [
      "Error",
      "Invalid",
      "Valid",
      "Nothing"
    ],
    answer: 2,
    explanation: "Both conditions are true, so Valid is displayed."
  },
  {
    question: "What is the value of sum after execution?\n\nDim sum As Integer = 5\nFor i = 1 To 3\n  sum += 2\nNext",
    options: [
      "11",
      "9",
      "12",
      "10"
    ],
    answer: 0,
    explanation: "The loop adds 2 three times: 5 + 2 + 2 + 2 = 11."
  },
  {
    question: "What is the output?\n\nDim arr() As Integer = {5, 10, 15}\nConsole.WriteLine(arr(0) + arr(2))",
    options: [
      "20",
      "25",
      "30",
      "15"
    ],
    answer: 0,
    explanation: "5 + 15 = 20."
  },
  {
    question: "What will be displayed?\n\nDim x As Integer = 9\nDo Until x = 6\n  x -= 1\nLoop\nConsole.WriteLine(x)",
    options: [
      "9",
      "5",
      "6",
      "7"
    ],
    answer: 2,
    explanation: "The loop stops when x becomes 6."
  },
  {
    question: "Which statement correctly declares a string variable?",
    options: [
      "Dim name As String",
      "Dim String = name",
      "name String Dim",
      "String Dim name"
    ],
    answer: 0,
    explanation: "This is the correct Visual Basic syntax."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 4\nIf x <> 5 Then\n  Console.WriteLine(\"True\")\nElse\n  Console.WriteLine(\"False\")\nEnd If",
    options: [
      "False",
      "Nothing",
      "Error",
      "True"
    ],
    answer: 3,
    explanation: "Since 4 is not equal to 5, the condition is true."
  },
  {
    question: "What is printed?\n\nDim i As Integer\nFor i = 3 To 9 Step 3\n  Console.Write(i & \" \")\nNext",
    options: [
      "9",
      "3 4 5 6 7 8 9",
      "3 6 9",
      "6 9"
    ],
    answer: 2,
    explanation: "The values are 3, 6, and 9."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 16\nConsole.WriteLine(x \\ 5)",
    options: [
      "4",
      "3",
      "3.2",
      "1"
    ],
    answer: 1,
    explanation: "\\ performs integer division. 16 \\ 5 = 3."
  },
  {
    question: "Which property is used to change the name of a button as seen in code?",
    options: [
      "Text",
      "Name",
      "Size",
      "Font"
    ],
    answer: 1,
    explanation: "The Name property identifies the control in code."
  },
  {
    question: "What is the output?\n\nDim a As Integer = 2\nDim b As Integer = 5\nConsole.WriteLine(a + b * a)",
    options: [
      "7",
      "12",
      "10",
      "14"
    ],
    answer: 1,
    explanation: "Multiply first: 5 x 2 = 10; then 2 + 10 = 12."
  },
  {
    question: "What is displayed?\n\nDim score As Integer = 45\nSelect Case score\n  Case 0 To 39\n    Console.WriteLine(\"Fail\")\n  Case 40 To 100\n    Console.WriteLine(\"Pass\")\nEnd Select",
    options: [
      "Fail",
      "Pass",
      "Error",
      "Nothing"
    ],
    answer: 1,
    explanation: "45 falls within the range 40-100."
  },
  {
    question: "What is the output?\n\nDim arr() As Integer = {8, 6, 4, 2}\nConsole.WriteLine(arr(1))",
    options: [
      "2",
      "4",
      "8",
      "6"
    ],
    answer: 3,
    explanation: "Index 1 is the second element, which is 6."
  },
  {
    question: "Which debugging tool pauses execution at a selected line?",
    options: [
      "MenuStrip",
      "Breakpoint",
      "Timer",
      "Toolbox"
    ],
    answer: 1,
    explanation: "A breakpoint temporarily stops program execution."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 5\nWhile x < 9\n  x += 1\nEnd While\nConsole.WriteLine(x)",
    options: [
      "8",
      "10",
      "9",
      "5"
    ],
    answer: 2,
    explanation: "The loop ends when x reaches 9."
  },
  {
    question: "Which of the following is used to store information permanently?",
    options: [
      "Procedure",
      "Loop",
      "Variable",
      "Data File"
    ],
    answer: 3,
    explanation: "Data files retain information even after the program ends."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 7\nConsole.WriteLine(x Mod 4)",
    options: [
      "1",
      "3",
      "2",
      "4"
    ],
    answer: 1,
    explanation: "The remainder when 7 is divided by 4 is 3."
  },
  {
    question: "What is the output?\n\nDim total As Integer = 0\nFor i = 2 To 6 Step 2\n  total += i\nNext\nConsole.WriteLine(total)",
    options: [
      "12",
      "8",
      "14",
      "10"
    ],
    answer: 0,
    explanation: "2 + 4 + 6 = 12."
  },
  {
    question: "Which statement is used to return a value from a Function?",
    options: [
      "Next",
      "Exit Sub",
      "Return",
      "End"
    ],
    answer: 2,
    explanation: "Return sends the function's result back to the caller."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 10\nIf x <= 5 Then\n  Console.WriteLine(\"Low\")\nElse\n  Console.WriteLine(\"High\")\nEnd If",
    options: [
      "Nothing",
      "Error",
      "High",
      "Low"
    ],
    answer: 2,
    explanation: "Since 10 is greater than 5, \"High\" is displayed."
  },
  {
    question: "What is the output?\n\nDim arr() As Integer = {1, 3, 5}\nConsole.WriteLine(arr(0) + arr(1) + arr(2))",
    options: [
      "11",
      "9",
      "8",
      "10"
    ],
    answer: 1,
    explanation: "1 + 3 + 5 = 9."
  },
  {
    question: "Which control is mainly used to display pictures?",
    options: [
      "TextBox",
      "Label",
      "PictureBox",
      "Button"
    ],
    answer: 2,
    explanation: "A PictureBox displays image files."
  },
  {
    question: "What is the output?\n\nDim n As Integer = 3\nDo While n < 7\n  n += 2\nLoop\nConsole.WriteLine(n)",
    options: [
      "8",
      "6",
      "5",
      "7"
    ],
    answer: 3,
    explanation: "3 -> 5 -> 7, then the condition becomes false."
  },
  {
    question: "Which file operation is used to add new data without removing existing records?",
    options: [
      "Close",
      "Append",
      "Delete",
      "Read"
    ],
    answer: 1,
    explanation: "Append adds new information to the end of an existing file."
  },
  {
    question: "What is the output?\n\nDim x As Integer = 2\nFor i = 1 To 4\n  x = x + i\nNext\nConsole.WriteLine(x)",
    options: [
      "10",
      "13",
      "11",
      "12"
    ],
    answer: 3,
    explanation: "Starting with x = 2: after adding 1, 2, 3, 4, the final value is 12."
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
const CYB102B = [
  {
    question: "Which of the following best describes data?",
    options: [
      "Organized reports",
      "Raw facts without meaning",
      "Computer instructions",
      "Processed facts ready for decision-making"
    ],
    answer: 1,
    explanation: "Data is raw facts before processing into meaning."
  },
  {
    question: "Information is obtained when data is:",
    options: [
      "Printed on paper",
      "Processed into a meaningful form",
      "Deleted from storage",
      "Randomly arranged"
    ],
    answer: 1,
    explanation: "Information is data processed into a meaningful form."
  },
  {
    question: "Which storage device uses flash memory?",
    options: [
      "USB Flash Drive",
      "Floppy Disk",
      "Magnetic Tape",
      "Hard Disk Drive"
    ],
    answer: 0,
    explanation: "USB flash drives use flash memory."
  },
  {
    question: "Which of the following is a magnetic storage device?",
    options: [
      "SSD",
      "Hard Disk Drive",
      "DVD",
      "Memory Card"
    ],
    answer: 1,
    explanation: "HDDs store data using magnetic platters."
  },
  {
    question: "Data integrity refers to:",
    options: [
      "The accuracy and consistency of data",
      "The amount of data stored",
      "The cost of storing data",
      "The speed of data processing"
    ],
    answer: 0,
    explanation: "Data integrity means data stays accurate and consistent."
  },
  {
    question: "Which backup method stores only files changed since the last backup?",
    options: [
      "Mirror backup",
      "Manual backup",
      "Incremental backup",
      "Full backup"
    ],
    answer: 2,
    explanation: "Incremental backups save only recently changed data."
  },
  {
    question: "Which of the following is an example of information?",
    options: [
      "Random letters",
      "Student result showing grades",
      "45, 60, 80, 92",
      "Binary digits only"
    ],
    answer: 1,
    explanation: "Processed exam results give meaningful information."
  },
  {
    question: "Data validation is mainly carried out to:",
    options: [
      "Ensure data entered is acceptable",
      "Encrypt documents",
      "Increase storage space",
      "Delete unnecessary files"
    ],
    answer: 0,
    explanation: "Validation checks whether entered data meets rules."
  },
  {
    question: "Which of the following is NOT a cyber threat?",
    options: [
      "Malware",
      "Firewall",
      "Phishing",
      "Ransomware"
    ],
    answer: 1,
    explanation: "A firewall is a security tool, not a threat."
  },
  {
    question: "Which attack attempts to trick users into revealing sensitive information?",
    options: [
      "Defragmentation",
      "Compression",
      "Brute-force attack",
      "Phishing"
    ],
    answer: 3,
    explanation: "Phishing deceives users into giving confidential data."
  },
  {
    question: "Which cloud service provides virtual servers and networking resources?",
    options: [
      "IaaS",
      "PaaS",
      "DaaS",
      "SaaS"
    ],
    answer: 0,
    explanation: "IaaS offers virtual computing resources."
  },
  {
    question: "Which of the following improves password security?",
    options: [
      "Sharing passwords with friends",
      "Using a strong, unique password",
      "Using \"123456\"",
      "Using your name"
    ],
    answer: 1,
    explanation: "Strong, unique passwords reduce unauthorized access."
  },
  {
    question: "Which storage medium is mainly used for long-term archival backups?",
    options: [
      "Cache Memory",
      "SSD",
      "Magnetic Tape",
      "RAM"
    ],
    answer: 2,
    explanation: "Magnetic tape suits long-term backup due to reliability and cost."
  },
  {
    question: "Data cleaning involves:",
    options: [
      "Formatting the computer",
      "Encrypting files",
      "Detecting and correcting inaccurate data",
      "Physically washing storage devices"
    ],
    answer: 2,
    explanation: "Data cleaning removes errors and inconsistencies."
  },
  {
    question: "Which of the following is considered personal data?",
    options: [
      "Weather forecast",
      "Population of Africa",
      "School timetable",
      "National Identification Number"
    ],
    answer: 3,
    explanation: "A National ID Number identifies an individual."
  },
  {
    question: "Malware designed to replicate itself across computers is called:",
    options: [
      "Driver",
      "Firewall",
      "Browser",
      "Worm"
    ],
    answer: 3,
    explanation: "A worm spreads automatically across networks."
  },
  {
    question: "Which storage device has no moving mechanical parts?",
    options: [
      "Magnetic Tape",
      "Floppy Disk",
      "Solid-State Drive",
      "Hard Disk Drive"
    ],
    answer: 2,
    explanation: "SSDs use flash memory without moving parts."
  },
  {
    question: "Digital responsibility includes:",
    options: [
      "Respecting others online",
      "Hacking websites for fun",
      "Sharing copyrighted materials illegally",
      "Spreading fake news"
    ],
    answer: 0,
    explanation: "Responsible digital behavior means respecting others online."
  },
  {
    question: "Which of the following helps protect data privacy?",
    options: [
      "Using weak passwords",
      "Ignoring software updates",
      "Encryption",
      "Publicly sharing passwords"
    ],
    answer: 2,
    explanation: "Encryption protects data from unauthorized access."
  },
  {
    question: "Which cyber attack locks a victim's files until payment is made?",
    options: [
      "Spyware",
      "Virus",
      "Ransomware",
      "Trojan Horse"
    ],
    answer: 2,
    explanation: "Ransomware encrypts files and demands payment."
  },
  {
    question: "Which cloud deployment model is owned and managed by a single organization?",
    options: [
      "Public Cloud",
      "Private Cloud",
      "Community Cloud",
      "Hybrid Cloud"
    ],
    answer: 1,
    explanation: "A private cloud is dedicated to one organization."
  },
  {
    question: "Which of the following is an example of data organization?",
    options: [
      "Arranging files into folders",
      "Installing a browser",
      "Replacing a keyboard",
      "Restarting a computer"
    ],
    answer: 0,
    explanation: "Organizing files into folders improves data management."
  },
  {
    question: "Which of the following is an ethical practice in data handling?",
    options: [
      "Sharing users' passwords",
      "Selling customer data illegally",
      "Protecting confidential information",
      "Accessing confidential files without permission"
    ],
    answer: 2,
    explanation: "Ethical handling requires protecting confidential information."
  },
  {
    question: "What is the primary purpose of two-factor authentication (2FA)?",
    options: [
      "Add an extra layer of security during login",
      "Prevent software installation",
      "Increase internet speed",
      "Reduce file size"
    ],
    answer: 0,
    explanation: "2FA requires extra verification beyond a password."
  },
  {
    question: "Which of the following best describes digital identity?",
    options: [
      "A network cable",
      "A computer's operating system",
      "Information representing a person online",
      "A storage device"
    ],
    answer: 2,
    explanation: "Digital identity is the info/credentials tied to a person online."
  },
  {
    question: "Which of the following is the primary purpose of organizing data?",
    options: [
      "To reduce internet speed",
      "To damage stored files",
      "To make data easier to access and manage",
      "To increase file size"
    ],
    answer: 2,
    explanation: "Organizing data improves storage, retrieval, and management."
  },
  {
    question: "Which of the following is an example of secondary storage?",
    options: [
      "CPU Register",
      "Hard Disk Drive",
      "Cache Memory",
      "RAM"
    ],
    answer: 1,
    explanation: "Secondary storage keeps data even when power is off."
  },
  {
    question: "A Trojan Horse is best described as:",
    options: [
      "Malware disguised as legitimate software",
      "A cloud service",
      "A hardware component",
      "A backup device"
    ],
    answer: 0,
    explanation: "Trojans look harmless but act maliciously once installed."
  },
  {
    question: "Which of the following is an example of cloud storage?",
    options: [
      "DVD-ROM",
      "USB Flash Drive",
      "RAM",
      "Online file storage service"
    ],
    answer: 3,
    explanation: "Cloud storage keeps files on remote servers via the internet."
  },
  {
    question: "Which type of backup copies every selected file each time a backup is performed?",
    options: [
      "Differential Backup",
      "Incremental Backup",
      "Full Backup",
      "Selective Backup"
    ],
    answer: 2,
    explanation: "A full backup makes a complete copy of all selected data."
  },
  {
    question: "Which of the following is used to verify that data falls within a specified range?",
    options: [
      "Type Check",
      "Range Check",
      "Format Check",
      "Presence Check"
    ],
    answer: 1,
    explanation: "A range check ensures values fall within acceptable limits."
  },
  {
    question: "Which practice best protects your online accounts?",
    options: [
      "Using one password for every account",
      "Sharing passwords with trusted friends",
      "Enabling multi-factor authentication",
      "Writing passwords publicly"
    ],
    answer: 2,
    explanation: "Multi-factor authentication adds an extra security layer."
  },
  {
    question: "Which of the following is an example of personally identifiable information (PII)?",
    options: [
      "Weather report",
      "Student ID number linked to a student",
      "Football score",
      "Public holiday calendar"
    ],
    answer: 1,
    explanation: "PII can be used to identify a specific individual."
  },
  {
    question: "Which cyber attack secretly records a user's activities?",
    options: [
      "Firewall",
      "Router",
      "Spyware",
      "Backup Software"
    ],
    answer: 2,
    explanation: "Spyware monitors user activities without consent."
  },
  {
    question: "Which storage device generally provides the fastest data access?",
    options: [
      "Floppy Disk",
      "Solid-State Drive (SSD)",
      "Magnetic Tape",
      "DVD"
    ],
    answer: 1,
    explanation: "SSDs access data much faster than magnetic devices."
  },
  {
    question: "Which of the following best describes data quality?",
    options: [
      "The usefulness, accuracy, and completeness of data",
      "The color of stored files",
      "The age of a computer",
      "The quantity of data collected"
    ],
    answer: 0,
    explanation: "Quality data is accurate, complete, relevant, and reliable."
  },
  {
    question: "Which of the following is an ethical responsibility when handling data?",
    options: [
      "Respecting users' privacy",
      "Sharing confidential information without consent",
      "Selling private records",
      "Ignoring security policies"
    ],
    answer: 0,
    explanation: "Ethical handling requires respecting privacy and confidentiality."
  },
  {
    question: "Which cloud service model allows users to access software over the internet?",
    options: [
      "IaaS",
      "PaaS",
      "SaaS",
      "LAN"
    ],
    answer: 2,
    explanation: "SaaS delivers applications through the internet."
  },
  {
    question: "Which of the following is NOT a magnetic storage device?",
    options: [
      "Magnetic Tape",
      "Hard Disk Drive",
      "Solid-State Drive",
      "Floppy Disk"
    ],
    answer: 2,
    explanation: "SSDs use flash memory, not magnetic technology."
  },
  {
    question: "What is the main objective of cyber security?",
    options: [
      "To slow internet access",
      "To protect systems, networks, and data from attacks",
      "To reduce storage capacity",
      "To increase computer prices"
    ],
    answer: 1,
    explanation: "Cyber security protects digital assets from threats."
  },
  {
    question: "Which of the following is a strong example of digital responsibility?",
    options: [
      "Downloading pirated software",
      "Respecting copyright laws",
      "Posting false information online",
      "Sharing someone else's account details"
    ],
    answer: 1,
    explanation: "Responsible users respect intellectual property rights."
  },
  {
    question: "Which validation rule checks that a required field is not left empty?",
    options: [
      "Format Check",
      "Range Check",
      "Presence Check",
      "Type Check"
    ],
    answer: 2,
    explanation: "A presence check ensures mandatory fields contain data."
  },
  {
    question: "Which of the following is a benefit of cloud computing?",
    options: [
      "Permanent hardware ownership",
      "Access to resources from different locations",
      "No internet connection required",
      "Limited accessibility"
    ],
    answer: 1,
    explanation: "Cloud computing allows access from anywhere online."
  },
  {
    question: "Which of the following can help prevent phishing attacks?",
    options: [
      "Ignoring browser security warnings",
      "Clicking every email link",
      "Sharing passwords through email",
      "Verifying the sender before responding"
    ],
    answer: 3,
    explanation: "Verifying the sender helps avoid fraudulent emails."
  },
  {
    question: "Which of the following is considered a cyber attack?",
    options: [
      "SQL Injection",
      "Data Compression",
      "Disk Formatting",
      "File Organization"
    ],
    answer: 0,
    explanation: "SQL Injection exploits database-driven application flaws."
  },
  {
    question: "Which of the following best protects sensitive files stored on a computer?",
    options: [
      "Renaming files only",
      "Encryption",
      "Compressing files",
      "Increasing screen brightness"
    ],
    answer: 1,
    explanation: "Encryption converts readable data into unreadable form."
  },
  {
    question: "Which of the following is a common source of malware infection?",
    options: [
      "Printing documents",
      "Opening suspicious email attachments",
      "Turning off the monitor",
      "Trusted software updates"
    ],
    answer: 1,
    explanation: "Malicious attachments often contain harmful software."
  },
  {
    question: "Which of the following best describes digital identity protection?",
    options: [
      "Protecting online personal information from misuse",
      "Posting passwords on social media",
      "Sharing login credentials with friends",
      "Using the same password for every account"
    ],
    answer: 0,
    explanation: "It helps prevent identity theft and unauthorized access."
  },
  {
    question: "Which of the following is the greatest advantage of maintaining regular data backups?",
    options: [
      "Increased screen resolution",
      "Faster internet speed",
      "Recovery of important files after data loss",
      "Lower electricity consumption"
    ],
    answer: 2,
    explanation: "Backups allow lost or damaged data to be restored."
  },
  {
    question: "Which of the following is the best practice for protecting personal information online?",
    options: [
      "Share passwords with classmates",
      "Disable security software permanently",
      "Ignore suspicious login alerts",
      "Use strong passwords and keep software updated"
    ],
    answer: 3,
    explanation: "Strong passwords and updates greatly reduce cyber risks."
  }
];

const CYB102C = [
  {
    question: "Which of the following best distinguishes information from data?",
    options: [
      "Information cannot be stored electronically.",
      "Information is processed data with meaning.",
      "Data is obtained after processing information.",
      "Information is always numerical."
    ],
    answer: 1,
    explanation: "Information is data processed into a meaningful form."
  },
  {
    question: "Which of the following is an input device used for data collection?",
    options: [
      "Monitor",
      "Speaker",
      "Printer",
      "Keyboard"
    ],
    answer: 3,
    explanation: "A keyboard allows users to enter data into a computer."
  },
  {
    question: "Which storage device is most suitable for carrying files between computers?",
    options: [
      "Magnetic Tape",
      "Blu-ray Drive",
      "Internal Hard Disk",
      "USB Flash Drive"
    ],
    answer: 3,
    explanation: "USB flash drives are portable and convenient for transfer."
  },
  {
    question: "Which of the following is a characteristic of high-quality data?",
    options: [
      "It is duplicated several times.",
      "It is always handwritten.",
      "It occupies little storage space.",
      "It is accurate and complete."
    ],
    answer: 3,
    explanation: "High-quality data should be accurate, complete, and reliable."
  },
  {
    question: "Which backup method copies all selected files every time it runs?",
    options: [
      "Mirror Synchronization",
      "Incremental Backup",
      "Full Backup",
      "Differential Backup"
    ],
    answer: 2,
    explanation: "A full backup copies every selected file each run."
  },
  {
    question: "Which of the following is an example of logical data organization?",
    options: [
      "Arranging records in a database table",
      "Connecting a monitor",
      "Cleaning a keyboard",
      "Replacing a hard disk"
    ],
    answer: 0,
    explanation: "Logical organization arranges data for efficient retrieval."
  },
  {
    question: "Which cyber threat attempts to guess passwords repeatedly?",
    options: [
      "Phishing",
      "Brute-force Attack",
      "Spyware",
      "Worm"
    ],
    answer: 1,
    explanation: "Brute-force attacks repeatedly try password combinations."
  },
  {
    question: "Which of the following is NOT considered malware?",
    options: [
      "Virus",
      "Firewall",
      "Ransomware",
      "Trojan Horse"
    ],
    answer: 1,
    explanation: "A firewall protects systems; it is not malicious software."
  },
  {
    question: "What is the primary purpose of data validation?",
    options: [
      "To increase storage capacity",
      "To compress files",
      "To ensure entered data follows specified rules",
      "To improve internet speed"
    ],
    answer: 2,
    explanation: "Validation checks whether data meets predefined conditions."
  },
  {
    question: "Which of the following can reduce the risk of identity theft?",
    options: [
      "Posting personal details publicly",
      "Sharing passwords with friends",
      "Using the same password everywhere",
      "Using multi-factor authentication"
    ],
    answer: 3,
    explanation: "Multi-factor authentication makes unauthorized access harder."
  },
  {
    question: "Which storage medium stores data using magnetic coating?",
    options: [
      "Magnetic Tape",
      "CD-ROM",
      "Flash Card",
      "SSD"
    ],
    answer: 0,
    explanation: "Magnetic tape stores information magnetically."
  },
  {
    question: "Which of the following is a responsibility of a digital citizen?",
    options: [
      "Sending spam emails",
      "Creating fake accounts",
      "Respecting privacy online",
      "Sharing pirated software"
    ],
    answer: 2,
    explanation: "Responsible digital citizens respect others' privacy and rights."
  },
  {
    question: "Which cloud deployment model combines public and private clouds?",
    options: [
      "Hybrid Cloud",
      "Private Cloud",
      "Community Cloud",
      "Public Cloud"
    ],
    answer: 0,
    explanation: "A hybrid cloud combines public and private cloud features."
  },
  {
    question: "Which of the following is a benefit of encrypting sensitive data?",
    options: [
      "Faster typing speed",
      "Prevents unauthorized reading of data",
      "Deletes duplicate files",
      "Increases monitor resolution"
    ],
    answer: 1,
    explanation: "Encryption protects data from unauthorized access."
  },
  {
    question: "Which cyber attack encrypts a victim's files and demands payment?",
    options: [
      "Adware",
      "Worm",
      "Spyware",
      "Ransomware"
    ],
    answer: 3,
    explanation: "Ransomware locks files until a ransom is paid."
  },
  {
    question: "Which of the following is an example of confidential information?",
    options: [
      "Football match schedule",
      "Student examination records",
      "Public weather forecast",
      "Bus timetable"
    ],
    answer: 1,
    explanation: "Examination records should be kept confidential."
  },
  {
    question: "What does data cleaning mainly involve?",
    options: [
      "Removing errors and inconsistencies from data",
      "Installing antivirus software",
      "Increasing RAM size",
      "Formatting storage devices"
    ],
    answer: 0,
    explanation: "Data cleaning improves quality by correcting errors."
  },
  {
    question: "Which of the following is commonly used for disaster recovery?",
    options: [
      "Disconnecting from the internet permanently",
      "Deleting old files daily",
      "Disabling antivirus software",
      "Regular data backups"
    ],
    answer: 3,
    explanation: "Backups allow data to be restored after disasters."
  },
  {
    question: "Which cloud service model provides a platform for application development?",
    options: [
      "SaaS",
      "LAN",
      "IaaS",
      "PaaS"
    ],
    answer: 3,
    explanation: "PaaS provides tools for developing and deploying applications."
  },
  {
    question: "Which of the following helps maintain data integrity?",
    options: [
      "Restricting unauthorized modifications",
      "Allowing unrestricted editing",
      "Ignoring validation errors",
      "Sharing administrator passwords"
    ],
    answer: 0,
    explanation: "Preventing unauthorized changes preserves data integrity."
  },
  {
    question: "Which of the following best describes phishing?",
    options: [
      "Compressing files for storage",
      "Sending fake messages to obtain sensitive information",
      "Organizing folders alphabetically",
      "Stealing physical storage devices"
    ],
    answer: 1,
    explanation: "Phishing tricks users into revealing confidential information."
  },
  {
    question: "Which of the following is an example of digital identity?",
    options: [
      "Online username and profile details",
      "External speaker",
      "Computer motherboard",
      "USB cable"
    ],
    answer: 0,
    explanation: "Digital identity includes info that represents a user online."
  },
  {
    question: "Which validation rule checks whether the entered data matches the required data type?",
    options: [
      "Range Check",
      "Length Check",
      "Presence Check",
      "Type Check"
    ],
    answer: 3,
    explanation: "A type check ensures data is of the expected type."
  },
  {
    question: "Which of the following storage devices generally has the largest storage capacity?",
    options: [
      "Magnetic Tape Cartridge",
      "DVD",
      "CD-ROM",
      "Floppy Disk"
    ],
    answer: 0,
    explanation: "Magnetic tape cartridges store very large amounts of data."
  },
  {
    question: "Which of the following is the most appropriate action after receiving a suspicious email requesting your password?",
    options: [
      "Forward it to all your contacts.",
      "Reply with your password immediately.",
      "Ignore security warnings and click the link.",
      "Verify the sender before taking any action."
    ],
    answer: 3,
    explanation: "Always verify the sender before acting on such requests."
  },
  {
    question: "Which of the following best describes data redundancy?",
    options: [
      "Compressing files to save space",
      "Organizing data alphabetically",
      "Encrypting data before storage",
      "Storing the same data in multiple places unnecessarily"
    ],
    answer: 3,
    explanation: "Data redundancy is unnecessary duplication, causing inconsistency."
  },
  {
    question: "Which of the following is a common physical storage device?",
    options: [
      "USB Flash Drive",
      "Email Account",
      "Web Browser",
      "Cloud Server"
    ],
    answer: 0,
    explanation: "A USB flash drive is a physical data storage device."
  },
  {
    question: "Which cyber security principle ensures that only authorized users can access information?",
    options: [
      "Confidentiality",
      "Accuracy",
      "Portability",
      "Availability"
    ],
    answer: 0,
    explanation: "Confidentiality protects information from unauthorized access."
  },
  {
    question: "Which of the following is an example of biometric authentication?",
    options: [
      "PIN code",
      "Fingerprint scan",
      "Username",
      "Password"
    ],
    answer: 1,
    explanation: "Biometric authentication uses unique physical characteristics."
  },
  {
    question: "Which of the following is most likely to spread through infected email attachments?",
    options: [
      "Router",
      "Virus",
      "Switch",
      "Firewall"
    ],
    answer: 1,
    explanation: "Viruses commonly spread through infected files and attachments."
  },
  {
    question: "Which data validation rule checks that the number of characters entered is acceptable?",
    options: [
      "Length Check",
      "Presence Check",
      "Range Check",
      "Type Check"
    ],
    answer: 0,
    explanation: "A length check verifies the character count meets limits."
  },
  {
    question: "Which of the following is a benefit of cloud computing?",
    options: [
      "Automatic accessibility from multiple devices",
      "Unlimited free hardware upgrades",
      "Permanent internet disconnection",
      "Elimination of all cyber threats"
    ],
    answer: 0,
    explanation: "Cloud services allow access from different connected devices."
  },
  {
    question: "Which of the following is considered unethical in data handling?",
    options: [
      "Encrypting confidential files",
      "Performing regular backups",
      "Accessing records without authorization",
      "Updating antivirus software"
    ],
    answer: 2,
    explanation: "Unauthorized access to confidential data is unethical."
  },
  {
    question: "What is the primary purpose of an antivirus program?",
    options: [
      "Improve internet speed",
      "Compress large files",
      "Increase storage capacity",
      "Detect and remove malicious software"
    ],
    answer: 3,
    explanation: "Antivirus software identifies and removes malware."
  },
  {
    question: "Which of the following is an example of optical storage?",
    options: [
      "Magnetic Tape",
      "DVD",
      "SSD",
      "Hard Disk Drive"
    ],
    answer: 1,
    explanation: "DVDs store data using laser technology."
  },
  {
    question: "Which of the following best protects confidential data sent over the internet?",
    options: [
      "Encryption",
      "Formatting",
      "File compression",
      "Defragmentation"
    ],
    answer: 0,
    explanation: "Encryption makes data unreadable during transmission."
  },
  {
    question: "Which backup method copies all files changed since the last full backup?",
    options: [
      "Differential Backup",
      "Incremental Backup",
      "Mirror Backup",
      "Full Backup"
    ],
    answer: 0,
    explanation: "Differential backups copy changes since the last full backup."
  },
  {
    question: "Which of the following is a social engineering attack?",
    options: [
      "Formatting",
      "Data Compression",
      "Disk Cleanup",
      "Phishing"
    ],
    answer: 3,
    explanation: "Phishing manipulates people into revealing confidential info."
  },
  {
    question: "Which of the following helps improve data quality?",
    options: [
      "Disabling validation rules",
      "Deleting all records",
      "Ignoring duplicate records",
      "Data cleaning"
    ],
    answer: 3,
    explanation: "Data cleaning removes duplicates, errors, and inconsistencies."
  },
  {
    question: "Which of the following is an example of strong password practice?",
    options: [
      "P@ss2026!Secure",
      "password123",
      "yourname",
      "12345678"
    ],
    answer: 0,
    explanation: "Strong passwords mix uppercase, lowercase, numbers, symbols."
  },
  {
    question: "Which of the following is a major objective of data backup?",
    options: [
      "Reduce electricity usage",
      "Increase processor speed",
      "Improve monitor quality",
      "Recover data after loss or damage"
    ],
    answer: 3,
    explanation: "Backups ensure important files can be restored if lost."
  },
  {
    question: "Which cloud deployment model is available to the general public?",
    options: [
      "Internal Cloud",
      "Hybrid Cloud",
      "Private Cloud",
      "Public Cloud"
    ],
    answer: 3,
    explanation: "Public clouds are offered to users over the internet."
  },
  {
    question: "Which of the following can help prevent unauthorized access to a computer?",
    options: [
      "Disabling authentication",
      "Using screen lock and passwords",
      "Leaving it unlocked",
      "Sharing login credentials"
    ],
    answer: 1,
    explanation: "Passwords and screen locks prevent unauthorized access."
  },
  {
    question: "Which of the following is an example of digital responsibility?",
    options: [
      "Respecting online privacy policies",
      "Downloading pirated software",
      "Sharing fake news",
      "Posting harmful content intentionally"
    ],
    answer: 0,
    explanation: "Responsible behavior includes respecting privacy and rules."
  },
  {
    question: "Which of the following is NOT part of the CIA Triad of cyber security?",
    options: [
      "Confidentiality",
      "Compatibility",
      "Availability",
      "Integrity"
    ],
    answer: 1,
    explanation: "The CIA Triad is Confidentiality, Integrity, and Availability."
  },
  {
    question: "What is the purpose of a firewall?",
    options: [
      "Increase RAM capacity",
      "Store backup files",
      "Filter incoming and outgoing network traffic",
      "Create spreadsheets"
    ],
    answer: 2,
    explanation: "Firewalls monitor and control network traffic by rules."
  },
  {
    question: "Which of the following is most important before deleting data permanently?",
    options: [
      "Disconnect the keyboard",
      "Turn off the monitor",
      "Create a backup if the data may be needed later",
      "Restart the computer"
    ],
    answer: 2,
    explanation: "Backing up important data prevents accidental permanent loss."
  },
  {
    question: "Which of the following best describes digital footprint?",
    options: [
      "The trail of activities a user leaves online",
      "A backup method",
      "A type of storage device",
      "A computer's storage capacity"
    ],
    answer: 0,
    explanation: "A digital footprint is the record of online activities."
  },
  {
    question: "Which of the following is a good practice for protecting your digital identity?",
    options: [
      "Reusing the same password everywhere",
      "Sharing personal information with strangers online",
      "Using public Wi-Fi for banking without protection",
      "Reviewing privacy settings regularly"
    ],
    answer: 3,
    explanation: "Regularly checking privacy settings protects personal info."
  },
  {
    question: "Which of the following best explains cyber security?",
    options: [
      "Installing computer hardware only",
      "Protecting computer systems, networks, and data from digital attacks",
      "Organizing files into folders",
      "The process of manufacturing computers"
    ],
    answer: 1,
    explanation: "Cyber security safeguards digital systems and information."
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

  
  
         
    

    
    
  
  
    
      
    
    

  


  
    





    
    
  
    
