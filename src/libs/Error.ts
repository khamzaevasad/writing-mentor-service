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

  // Writing Task
  TASK_NOT_FOUND = "Writing task not found.",
  TASK_CREATION_FAILED = "Failed to create writing task.",
  TASK_TIME_EXPIRED = "Time limit for this writing task has expired.",

  // Submission
  SUBMISSION_FAILED = "Failed to submit writing task.",
  SUBMISSION_NOT_FOUND = "Submission not found.",
  SUBMISSION_ALREADY_EVALUATED = "This submission has already been evaluated.",

  // Evaluation / AI
  EVALUATION_FAILED = "Failed to evaluate the submission.",
  AI_RESPONSE_INVALID = "AI returned an invalid response.",
  AI_SERVICE_UNAVAILABLE = "AI service is temporarily unavailable.",

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
