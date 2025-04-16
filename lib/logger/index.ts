// lib/logger/index.ts
// Logger instance & configuration will go here.
import { Logger } from "./Logger";
import { consoleTransport } from "./transport";
import { simpleTextFormatter } from "./formatters";

const logger = Logger.getInstance();
logger.setFormatter(simpleTextFormatter);
logger.addTransport(consoleTransport);

export { logger };
export * from "./Logger";
