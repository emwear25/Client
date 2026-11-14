import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

type PostHogLogAttributes = Record<string, boolean | number | string>;

type PostHogLog = {
  severityText: "ERROR" | "INFO" | "WARN";
  body: string;
  attributes?: PostHogLogAttributes;
};

let loggerProvider: LoggerProvider | undefined;
let posthogLogger: ReturnType<LoggerProvider["getLogger"]> | undefined;

export function initializePostHogLogs({
  host,
  projectToken,
}: {
  host?: string;
  projectToken?: string;
}) {
  if (loggerProvider || !host || !projectToken) {
    return;
  }

  try {
    const exporter = new OTLPLogExporter({
      url: new URL("/i/v1/logs", host).toString(),
      headers: {
        Authorization: `Bearer ${projectToken}`,
      },
    });

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "emwear-nuxt",
      }),
      processors: [
        new BatchLogRecordProcessor(exporter, {
          exportTimeoutMillis: 2_000,
          scheduledDelayMillis: 1_000,
        }),
      ],
    });
    posthogLogger = loggerProvider.getLogger("emwear.posthog");

    emitPostHogLog({
      severityText: "INFO",
      body: "PostHog log capture initialized",
    });
  } catch {
    loggerProvider = undefined;
    posthogLogger = undefined;
  }
}

export function emitPostHogLog(log: PostHogLog) {
  posthogLogger?.emit(log);
}

export async function shutdownPostHogLogs() {
  const provider = loggerProvider;
  loggerProvider = undefined;
  posthogLogger = undefined;

  if (!provider) {
    return;
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<void>((resolve) => {
    timeoutId = setTimeout(resolve, 2_000);
  });

  await Promise.race([provider.shutdown().catch(() => undefined), timeout]);

  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}
