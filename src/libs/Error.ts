export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum Message {
  // Common
  SOMETHING_WENT_WRONG = "Something went wrong.",
  NO_DATA_FOUND = "No data found.",
  INVALID_REQUEST = "Invalid request data.",

  // Auth / User
  USER_NOT_AUTHENTICATED = "Please login to continue.",
  USER_FORBIDDEN = "You do not have permission to perform this action.",
  USER_BLOCKED = "Your account has been blocked. Please contact support.",
  USED_NICK_PHONE = "You are inserting already used nick or phone!",
  NO_MEMBER_NICK = "No member found with that nickname or email address.",
  WRONG_PASSWORD = "Wrong password, please try again!",
  TOKEN_CREATION_FAILED = "Token creation Error!",
  TOKEN_NOT_PROVIDED = "Token not provided",
  ALREADY_VERIFIED = "Account Already verified",
  INVALID_OTP = "Invalid OTP",
  OTP_EXPIRED = "OTP Expired",
  EMAIL_REQUIRED = "Email is required",
  ALL_REQUIRED = "All required fields must be provided.",
  RESET_PASSWORD = "Password has been successfully",
  ALREADY_EXISTS = "This email or username is already in use.",
  ADMIN_ACCESS = "Admin access only",
  UPDATE_FAILED = "Update is failed!",

  // Writing Task
  TASK_NOT_FOUND = "Writing task not found.",
  TASK_CREATION_FAILED = "Failed to create writing task.",
  CREATION_FAILED = "Creation Failed.",
  TASK_TIME_EXPIRED = "Time limit for this writing task has expired.",
  ACTIVE_EXAM = "You already have an active exam session",
  SESSION_IS_NOT_ACTIVE = "Session is not active",

  // Submission
  SUBMISSION_FAILED = "Failed to submit writing task.",
  SUBMISSION_NOT_FOUND = "Submission not found.",
  SUBMISSION_ALREADY_EVALUATED = "This submission has already been evaluated.",

  // Evaluation / AI
  EVALUATION_FAILED = "Failed to evaluate the submission.",
  AI_RESPONSE_INVALID = "AI returned an invalid response.",
  AI_SERVICE_UNAVAILABLE = "AI service is temporarily unavailable.",
  UNSUPPORTED_QUESTION_TYPE = "The specified question type is not supported.",
  KEY_NOT_FOUND = "OPENAI_API_KEY not found in .env file",
  TASK_GENERATION_FAILED = "Error occurred while generating question",
  OPEN_AI_ERR = "OpenAI API error",
  PARSE_FAILED = "Failed to parse AI response",
  CHART_NOT_FOUND = "Chart data not found for question 53",
  PROMPT_NOT_FOUND = "Evaluation prompt not found",

  // Rate / Limits
  TOO_MANY_REQUESTS = "Too many requests. Please try again later.",
}

class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  };

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super();
    (this.code = statusCode), (this.message = statusMessage);
  }
}

export default Errors;
