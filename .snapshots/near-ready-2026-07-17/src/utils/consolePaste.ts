/**
 * CS2 developer console (~) typically executes only the first line of a
 * multiline paste. Join commands with "; " so one paste runs everything.
 * Also works in autoexec.cfg.
 */
export function toConsolePaste(text: string): string {
  return text
    .split(/[\n\r]+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join('; ')
}

export function joinConsoleCommands(lines: string[]): string {
  return toConsolePaste(lines.join('\n'))
}
