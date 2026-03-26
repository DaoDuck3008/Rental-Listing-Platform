import AppError from "./AppError.js";

class TooManyRequestsError extends AppError {
  constructor(message = "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.") {
    super(message, 429, "TOO_MANY_REQUESTS");
  }
}

export default TooManyRequestsError;
