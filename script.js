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
function getCourse(course) {
  return {
    GST112,
    MTH132,
    PHY102,
    PHY102B,
    PHY102C,
    PHY102D,
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

  
  
         
    

    
    
  
  
    
      
    
    

  


  
    





    
    
  
    
