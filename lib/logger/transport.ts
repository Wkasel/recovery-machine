// lib/logger/transport.ts
// Log transport setup will go here.

import { LogEntry, LogTransport } from "@/types/logger";

export const consoleTransport: LogTransport = {
  log(entry: LogEntry) {
    if (entry.metadata.level === "error" || entry.metadata.level === "warn") {
      // Print errors and warnings to stderr
      console.error(entry);
    } else {
      // Print info/debug to stdout
      console.log(entry);
    }
  },
};
