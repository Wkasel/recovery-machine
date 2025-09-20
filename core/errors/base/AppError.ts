export interface ErrorContext {
  [key: string]: any;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: ErrorContext;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: ErrorContext
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  public toUserMessage(): string {
    // Return user-friendly message, filtering out sensitive details
    return this.isOperational ? this.message : "An unexpected error occurred";
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }

  static from(error: Error): AppError {
    if (error instanceof AppError) {
      return error;
    }
    return new AppError(error.message, 500, false);
  }
}

// Common error types
export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 400, true, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed", context?: ErrorContext) {
    super(message, 401, true, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied", context?: ErrorContext) {
    super(message, 403, true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", context?: ErrorContext) {
    super(message, 404, true, context);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 500, true, context);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 502, true, context);
  }
}
