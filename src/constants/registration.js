/**
 * Set when user finishes signup step 5 with "Student" (Professional identity) —
 * unlocks steps 7–12 at `/onboarding/student`. Cleared when that flow finishes.
 * Role-selection "Student" also checks this for edge cases.
 */
export const POST_SIGNUP_COMPLETE_KEY = "worklink_post_signup_complete";

/**
 * Set when user finishes signup step 5 as "Employer" — unlocks recruiter steps 7–12
 * at `/onboarding/recruiter`. Cleared when that flow finishes.
 */
export const POST_SIGNUP_EMPLOYER_KEY = "worklink_post_signup_employer";

/**
 * Set when user finishes signup step 5 as "Institute / College" — unlocks institute
 * steps 7–12 at `/onboarding/institute`. Cleared when that flow finishes.
 */
export const POST_SIGNUP_INSTITUTE_KEY = "worklink_post_signup_institute";
