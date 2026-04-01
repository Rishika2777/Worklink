import { useState } from "react";
import "./GiveTest.css";

function GiveTest({ testTitle, onBack }) {

  const [step, setStep] = useState(0);

  const questions = [
    {
      question: "Which of the following are behavioral user research methods?",
      options: ["Focus groups", "Online Surveys", "In-lab usability Studies"]
    },
    {
      question: "Which is Jitter mainly used for?",
      options: ["Editing", "Design", "Motion"]
    },
    {
      question: "Which of the following is not an animation property in jitter?",
      options: ["Opacity", "Position", "Rotation"]
    }
  ];

  const current = questions[step];

  return (
    <div className="test-wrapper">
      <div className="test-container">

        {/* BACK TO ASSESSMENT */}
        <button className="back-btn" onClick={onBack}>←</button>

        <h3>{testTitle}</h3>

        {/* PROGRESS */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>

        <p>Questions: {step + 1} of {questions.length}</p>

        {/* QUESTION */}
        <h4 className="question">{current.question}</h4>

        {/* OPTIONS */}
        <div className="options">
          {current.options.map((opt, i) => (
            <button key={i} className="option-btn">
              {opt}
            </button>
          ))}
        </div>

        {/*  BUTTONS LOGIC */}
      <div className="btn-group">

  {/* STEP 1 */}
  {step === 0 && (
    <button
      className="next-btn"
      onClick={() => setStep((prev) => prev + 1)}
    >
      Next
    </button>
  )}

  {/* STEP 2 */}
  {step === 1 && (
    <>
      <button
        className="back-step-btn"
        onClick={() => setStep((prev) => prev - 1)}
      >
        Back
      </button>

      <button
        className="next-btn"
        onClick={() => setStep((prev) => prev + 1)}
      >
        Next
      </button>
    </>
  )}

  {/* STEP 3 */}
  {step === 2 && (
    <>
      <button
        className="back-step-btn"
        onClick={() => setStep((prev) => prev - 1)}
      >
        Back
      </button>

      <button
        className="submit-btn"
        onClick={() => {
          alert("Test Submitted ");
          onBack();
        }}
      >
        Submit
      </button>
    </>
  )}

</div>

      </div>
    </div>
  );
}

export default GiveTest;