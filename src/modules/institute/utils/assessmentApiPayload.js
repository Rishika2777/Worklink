/** Maps UI difficulty to API strings (Swagger examples: "Easy", "Medium", "Hard"). */
const DIFFICULTY_TO_API = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

const LETTER_TO_INDEX = { A: 0, B: 1, C: 2, D: 3 };

/** LocalDate / ISO string → YYYY-MM-DD for date inputs */
export function apiDateToInputValue(d) {
  if (d == null || d === "") return "";
  const s = String(d);
  if (s.length >= 10) return s.slice(0, 10);
  return s;
}

/** API attemptLimit number → modal select label */
export function apiAttemptLimitToSelectLabel(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "5 Attempts";
  if (num >= 900) return "Unlimited";
  if (num === 1) return "1 Attempt";
  if (num === 2) return "2 Attempts";
  if (num === 3) return "3 Attempts";
  if (num === 5) return "5 Attempts";
  return `${num} Attempts`;
}

/** Swagger difficultyLevel → modal difficulty value (accepts Easy/Medium/Hard or EASY/MEDIUM/HARD). */
export function apiDifficultyLevelToUi(level) {
  const s = String(level ?? "Medium").trim().toUpperCase();
  if (s === "EASY") return "easy";
  if (s === "HARD") return "hard";
  if (s === "MEDIUM") return "medium";
  return "medium";
}

/**
 * GET /assessments/{id} question[] → modal MCQ state (prompt, options, correctIndex).
 */
export function apiQuestionsToModalQuestions(questions, genQuestionId) {
  const list = Array.isArray(questions) ? questions : [];
  return list.map((q) => {
    const letter = String(q.correctOption ?? "A").trim().toUpperCase().charAt(0);
    return {
      id: genQuestionId(),
      kind: "mcq",
      prompt: q.questionText ?? "",
      marks: Math.max(1, Number(q.marks) || 1),
      options: [
        { text: String(q.optionA ?? "") },
        { text: String(q.optionB ?? "") },
        { text: String(q.optionC ?? "") },
        { text: String(q.optionD ?? "") },
      ],
      correctIndex: LETTER_TO_INDEX[letter] ?? 0,
    };
  });
}

/**
 * Full GET-by-id JSON body → fields for CreateAssessmentModal state.
 */
export function mapAssessmentApiResponseToModalForm(api, genQuestionId) {
  const qs = apiQuestionsToModalQuestions(api?.questions, genQuestionId);
  const tm = Math.max(1, Number(api.totalMarks ?? api.marks) || 1);
  let passingMarksPercent = 50;
  if (api.marks != null && tm > 0) {
    const mp = Number(api.marks);
    if (Number.isFinite(mp)) {
      passingMarksPercent = Math.min(100, Math.max(0, Math.round((mp / tm) * 100)));
    }
  }
  return {
    title: api.assessmentTitle ?? "",
    course: api.courseName ?? "",
    batch: api.batch ?? "",
    description: api.description ?? "",
    timeLimitMinutes: Math.max(1, Number(api.timeLimitMinutes) || 1),
    totalMarks: tm,
    difficulty: apiDifficultyLevelToUi(api.difficultyLevel),
    startDate: apiDateToInputValue(api.startDate),
    endDate: apiDateToInputValue(api.endDate),
    attemptLimit: apiAttemptLimitToSelectLabel(api.attemptLimit),
    questions: qs,
    passingMarksPercent,
  };
}

/**
 * Parses attempt dropdown to integer for API.
 * "Unlimited" → large number (backend-dependent; avoids string type errors).
 */
export function parseAttemptLimitToNumber(attemptLabel) {
  const s = String(attemptLabel || "").trim().toLowerCase();
  if (s.includes("unlimited")) return 999;
  const m = String(attemptLabel).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 1;
}

/**
 * Converts one MCQ from modal state to API question object.
 */
export function mapQuestionToApi(q) {
  const correctOpt = OPTION_LETTERS[q.correctIndex] ?? "A";
  return {
    questionText: String(q.prompt || "").trim(),
    optionA: String(q.options?.[0]?.text ?? "").trim(),
    optionB: String(q.options?.[1]?.text ?? "").trim(),
    optionC: String(q.options?.[2]?.text ?? "").trim(),
    optionD: String(q.options?.[3]?.text ?? "").trim(),
    correctOption: correctOpt,
    marks: Math.max(1, Number(q.marks) || 1),
  };
}

/** Sum of per-question marks (for validation against total marks). */
export function sumQuestionMarksFromState(questions) {
  return (questions || []).reduce(
    (s, q) => s + Math.max(1, Number(q.marks) || 1),
    0
  );
}

/**
 * Builds POST/PUT body matching Swagger: assessmentTitle, courseName, batch, description,
 * timeLimitMinutes, totalMarks, difficultyLevel ("Easy"|"Medium"|"Hard"), startDate, endDate,
 * attemptLimit, marks (passing marks in points — e.g. 50 of 100), questions[].
 *
 * Dates: YYYY-MM-DD from date inputs — valid for Java LocalDate.
 */
export function buildCreateAssessmentRequestBody(state) {
  const {
    title,
    course,
    courseId,
    batch,
    description,
    timeLimitMinutes,
    totalMarks,
    difficulty,
    startDate,
    endDate,
    attemptLimit,
    questions,
    passingMarksPercent,
  } = state;

  const questionsApi = questions.map(mapQuestionToApi);
  const sumQ = questionsApi.reduce((s, q) => s + q.marks, 0);
  /** Call after validating sumQ === totalMarks (many backends enforce this). */
  const tm = Math.max(1, Number(totalMarks) || sumQ);
  const pct = Math.min(100, Math.max(0, Number(passingMarksPercent) || 0));
  const marksPassing = Math.min(tm, Math.round((tm * pct) / 100));

  const body = {
    assessmentTitle: String(title || "").trim(),
    courseName: String(course || "").trim(),
    batch: String(batch || "").trim(),
    description: String(description || "").trim(),
    timeLimitMinutes: Math.max(1, Number(timeLimitMinutes) || 1),
    totalMarks: tm,
    difficultyLevel: DIFFICULTY_TO_API[difficulty] || "Medium",
    startDate: String(startDate || "").trim(),
    endDate: String(endDate || "").trim(),
    attemptLimit: parseAttemptLimitToNumber(attemptLimit),
    marks: marksPassing,
    questions: questionsApi,
  };

  const cid = courseId != null && String(courseId).trim() !== "" ? String(courseId).trim() : null;
  if (cid) {
    body.courseId = cid;
  }

  return body;
}
