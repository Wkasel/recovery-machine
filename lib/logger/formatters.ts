// lib/logger/formatters.ts
// Log formatters will go here.

import { LogEntry, LogFormatter } from "@/types/logger";

export const jsonFormatter: LogFormatter = {
  format(entry: LogEntry) {
    return JSON.stringify(entry);
  },
};

export const simpleTextFormatter: LogFormatter = {
  format(entry: LogEntry) {
    let msg = `[${entry.metadata.timestamp}] [${entry.metadata.level.toUpperCase()}] ${entry.message}`;
    if (entry.error) {
      msg += `\nError: ${entry.error.name}: ${entry.error.message}`;
    }
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      msg += `\nMeta: ${JSON.stringify(entry.metadata)}`;
    }
    return msg;
  },
};
