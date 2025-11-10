import { AxiosError } from "axios";
import {
  AuthError,
  EmailNotVerifiedError,
  UserNotFoundError,
  InvalidPasswordError,
  UserAlreadyRegisteredError,
  OtpInvalidError,
  OtpNotFoundError,
  OtpExpiredError,
  OtpAlreadyConsumedError,
  OtpMaxAttemptsError,
  OtpEmailMismatchError,
  GenericAuthError,
  UnknownAuthError,
} from "./authErrors";

interface ApiErrorResponse {
  error: {
    code?: string;
    message?: string;
    details?: {
      [key: string]: unknown;
    };
  };
}

export function parseAuthError(error: unknown): AuthError {
  // Handle non-Axios errors
  if (!(error instanceof Error)) {
    return new UnknownAuthError("An unexpected error occurred");
  }

  // Handle non-Axios errors that are Error instances
  if (!("response" in error)) {
    return new UnknownAuthError(
      error.message || "An unexpected error occurred"
    );
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;

  const errorData = axiosError.response?.data?.error;

  if (!errorData) {
    // Network error or no response
    if (axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT") {
      return new UnknownAuthError("Request timed out. Please try again.");
    }
    if (axiosError.message.includes("Network Error")) {
      return new UnknownAuthError(
        "Network error. Please check your connection."
      );
    }
    return new UnknownAuthError(
      axiosError.message || "An unexpected error occurred"
    );
  }

  const errorCode = errorData.code;
  const errorMessage = errorData.message || "An error occurred";
  const errorDetails = errorData.details;

  // Map error codes to specific error classes
  switch (errorCode) {
    case "AUTH_EMAIL_NOT_VERIFIED":
      return new EmailNotVerifiedError(errorMessage);

    case "AUTH_USER_NOT_FOUND":
      return new UserNotFoundError(errorMessage);

    case "AUTH_UNAUTHORIZED":
      return new InvalidPasswordError(errorMessage);

    case "AUTH_USER_ALREADY_REGISTERED":
      return new UserAlreadyRegisteredError(errorMessage);

    case "AUTH_OTP_INVALID_CODE":
      return new OtpInvalidError(
        errorMessage,
        errorDetails?.remainingAttempts as number | undefined
      );

    case "AUTH_OTP_NOT_FOUND":
      return new OtpNotFoundError(errorMessage);

    case "AUTH_OTP_EXPIRED":
      return new OtpExpiredError(errorMessage);

    case "AUTH_OTP_ALREADY_CONSUMED":
      return new OtpAlreadyConsumedError(errorMessage);

    case "AUTH_OTP_MAX_ATTEMPTS":
      return new OtpMaxAttemptsError(errorMessage);

    case "AUTH_OTP_EMAIL_MISMATCH":
      return new OtpEmailMismatchError(errorMessage);

    default:
      if (errorCode && errorCode.startsWith("AUTH_")) {
        return new GenericAuthError(
          errorCode,
          errorMessage,
          errorMessage,
          undefined
        );
      }
      return new UnknownAuthError(errorMessage);
  }
}
