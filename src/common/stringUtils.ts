export function formatDuration(startTime: Date, finishTime: Date): string {
  const seconds = Math.floor((new Date(finishTime).getTime() - new Date(startTime).getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}

export function createCodeSpan(text: string): string {
  const backtickRuns = text.match(/`+/g);
  const maxRun = backtickRuns ? Math.max(...backtickRuns.map((r) => r.length)) : 0;
  const delimiter = "`".repeat(maxRun + 1);
  return `${delimiter}${text}${delimiter}`;
}
