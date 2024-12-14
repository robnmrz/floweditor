import { intervalToDuration } from "date-fns";

export function datesToDurationString(
  end: Date | null | undefined,
  start: Date | null | undefined
) {
  if (!end || !start) return null;

  const timeElapsed = end.getTime() - start.getTime();
  if (timeElapsed < 1000) {
    // less than 1 second
    return `${timeElapsed}ms`;
  }

  const duration = intervalToDuration({
    start: 0,
    end: timeElapsed,
  });

  // don't expect workflows to take more than minutes
  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}