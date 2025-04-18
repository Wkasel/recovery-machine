// lib/logger/index.ts
// Logger instance & configuration will go here.
import { simpleTextFormatter } from "./formatters";
import { Logger } from "./Logger";
import { consoleTransport } from "./transport";

const logger = Logger.getInstance();
logger.setFormatter(simpleTextFormatter);
logger.addTransport(consoleTransport);

export * from "./Logger";
export { logger };
