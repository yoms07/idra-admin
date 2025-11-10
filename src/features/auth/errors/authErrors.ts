export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public userMessage: string,
    public field?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AuthError";
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class EmailNotVerifiedError extends AuthError {
  constructor(message?: string) {
    super(
      "AUTH_EMAIL_NOT_VERIFIED",
      message || "Email is not verified",
      "Email not verified. Please register first.",
      "email"
    );
    this.name = "EmailNotVerifiedError";
    Object.setPrototypeOf(this, EmailNotVerifiedError.prototype);
  }
}

/**
 * User not found error
 * User doesn't exist in the system
 */
export class UserNotFoundError extends AuthError {
  constructor(message?: string) {
    super(
      "AUTH_USER_NOT_FOUND",
      message || "User not found",
      "User not found. Please register.",
      "email"
    );
    this.name = "UserNotFoundError";
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

/**
 * Invalid password error
 * Password is incorrect
 */
export class InvalidPasswordError extends AuthError {
  constructor(message?: string) {
    super(
      "AUTH_UNAUTHORIZED",
      message || "Unauthorized",
      "Invalid password.",
      "password"
    );
    this.name = "InvalidPasswordError";
    Object.setPrototypeOf(this, InvalidPasswordError.prototype);
  }
}

/**
 * User already registered error
 * User is trying to register with existing email
 */
export class UserAlreadyRegisteredError extends AuthError {
  constructor(message?: string) {
    super(
      "AUTH_USER_ALREADY_REGISTERED",
      message || "User already registered",
      "Email already registered. Please login.",
      "email"
    );
    this.name = "UserAlreadyRegisteredError";
    Object.setPrototypeOf(this, UserAlreadyRegisteredError.prototype);
  }
}

/**
 * OTP invalid code error
 * OTP code is incorrect, includes remaining attempts
 */
export class OtpInvalidError extends AuthError {
  public remainingAttempts?: number;

  constructor(message?: string, remainingAttempts?: number) {
    super(
      "AUTH_OTP_INVALID_CODE",
      message || "Invalid OTP code",
      remainingAttempts
        ? `Invalid code. ${remainingAttempts} attempts remaining.`
        : "Invalid code.",
      "otp",
      remainingAttempts ? { remainingAttempts } : undefined
    );
    this.remainingAttempts = remainingAttempts;
    this.name = "OtpInvalidError";
    Object.setPrototypeOf(this, OtpInvalidError.prototype);
  }
}

/**
 * OTP not found error
 * OTP record doesn't exist or is invalid
 */
export class OtpNotFoundError extends AuthError {
  constructor(message?: string) {
    super(
      "AUTH_OTP_NOT_FOUND",
      message || "OTP not found or invalid",
      "OTP not found. Please request a new one.",
      "otp"
    );
    this.name = "OtpNotFoundError";
    Object.setPrototypeOf(this, OtpNotFoundError.prototype);
  }
}

/**
 * OTP expired error
 * OTP has expired and can no longer be used
 */
export class OtpExpiredError extends AuthError {
  constructor(message?: string) {
    super(
      "AUTH_OTP_EXPIRED",
      message || "OTP has expired",
      "OTP expired. Please request a new one.",
      "otp"
    );
    this.name = "OtpExpiredError";
    Object.setPrototypeOf(this, OtpExpiredError.prototype);
  }
}

/**
 * OTP already consumed error
 * OTP has already been used
 */
export class OtpAlreadyConsumedError extends AuthError {
  constructor(message?: string) {
    super(
      "AUTH_OTP_ALREADY_CONSUMED",
      message || "OTP has already been used",
      "OTP already used. Please request a new one.",
      "otp"
    );
    this.name = "OtpAlreadyConsumedError";
    Object.setPrototypeOf(this, OtpAlreadyConsumedError.prototype);
  }
}

/**
 * OTP max attempts error
 * Maximum verification attempts reached
 */
export class OtpMaxAttemptsError extends AuthError {
  constructor(message?: string) {
    super(
      "AUTH_OTP_MAX_ATTEMPTS",
      message || "Maximum OTP verification attempts reached",
      "Maximum attempts reached. Please request a new OTP.",
      "otp"
    );
    this.name = "OtpMaxAttemptsError";
    Object.setPrototypeOf(this, OtpMaxAttemptsError.prototype);
  }
}

/**
 * OTP email mismatch error
 * Email doesn't match the OTP record
 */
export class OtpEmailMismatchError extends AuthError {
  constructor(message?: string) {
    super(
      "AUTH_OTP_EMAIL_MISMATCH",
      message || "Email does not match OTP record",
      "Email does not match. Please use the correct email.",
      "email"
    );
    this.name = "OtpEmailMismatchError";
    Object.setPrototypeOf(this, OtpEmailMismatchError.prototype);
  }
}

/**
 * Generic authentication error
 * For unknown or unhandled error codes
 */
export class GenericAuthError extends AuthError {
  constructor(
    code: string,
    message: string,
    userMessage?: string,
    field?: string
  ) {
    super(
      code,
      message,
      userMessage || "An authentication error occurred. Please try again.",
      field
    );
    this.name = "GenericAuthError";
    Object.setPrototypeOf(this, GenericAuthError.prototype);
  }
}

/**
 * Network or unknown error
 * For network failures or unexpected errors
 */
export class UnknownAuthError extends AuthError {
  constructor(message?: string) {
    super(
      "UNKNOWN_ERROR",
      message || "An unexpected error occurred",
      "Something went wrong. Please try again.",
      undefined
    );
    this.name = "UnknownAuthError";
    Object.setPrototypeOf(this, UnknownAuthError.prototype);
  }
}
