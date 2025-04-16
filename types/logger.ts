export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogMetadata = {
  timestamp: string;
  level: LogLevel;
  requestId?: string;
  userId?: string;
  path?: string;
  component?: string;
  [key: string]: unknown;
};

export type LogEntry = {
  message: string;
  metadata: LogMetadata;
  error?: Error;
};

export interface LogTransport {
  log(entry: LogEntry): void;
}

export interface LogFormatter {
  format(entry: LogEntry): string | object;
}
