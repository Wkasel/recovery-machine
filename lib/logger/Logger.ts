import { LogEntry, LogFormatter, LogLevel, LogMetadata, LogTransport } from "@/types/logger";
import { AppError } from "../errors/AppError";

export class Logger {
  private static instance: Logger;
  private transports: LogTransport[] = [];
  private formatter: LogFormatter;
  private defaultMetadata: Partial<LogMetadata> = {};

  private constructor() {
    // Default formatter just returns the entry as is
    this.formatter = {
      format: (entry) => entry,
    };
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  public setFormatter(formatter: LogFormatter): void {
    this.formatter = formatter;
  }

  public setDefaultMetadata(metadata: Partial<LogMetadata>): void {
    this.defaultMetadata = { ...this.defaultMetadata, ...metadata };
  }

  private createEntry(
    level: LogLevel,
    message: string,
    metadata?: Partial<LogMetadata>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      message,
      metadata: {
        ...this.defaultMetadata,
        ...metadata,
        timestamp: new Date().toISOString(),
        level,
      } as LogMetadata,
    };

    if (error) {
      entry.error =
        error instanceof AppError
          ? error
          : new AppError(error.message, "UNKNOWN_ERROR", "medium", error);
    }

    return entry;
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Partial<LogMetadata>,
    error?: Error
  ): void {
    const entry = this.createEntry(level, message, metadata, error);
    const formattedEntry = this.formatter.format(entry);

    this.transports.forEach((transport) => {
      try {
        transport.log(entry);
      } catch (e) {
        console.error("Failed to log via transport:", e);
      }
    });
  }

  public debug(message: string, metadata?: Partial<LogMetadata>): void {
    this.log("debug", message, metadata);
  }

  public info(message: string, metadata?: Partial<LogMetadata>): void {
    this.log("info", message, metadata);
  }

  public warn(message: string, metadata?: Partial<LogMetadata>, error?: Error): void {
    this.log("warn", message, metadata, error);
  }

  public error(message: string, metadata?: Partial<LogMetadata>, error?: Error): void {
    this.log("error", message, metadata, error);
  }
}
