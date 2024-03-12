import { createLogger, format, transports } from "winston";

const httpTransportOptions = {
  host: "http-intake.logs.datadoghq.com",
  path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=NO_NAME`,
  ssl: true
};

export const logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.json(),
  transports: [new transports.Http(httpTransportOptions)]
});
