/**
 * CS2 console (~) truncates very long pastes. ~500 chars is a safe chunk size
 * so each paste fits and runs fully. Prefer autoexec.cfg for huge configs.
 */
export const CS2_CONSOLE_CHAR_LIMIT = 500

/** Split individual commands into paste chunks under the console char limit. */
export function splitConsoleCommands(
  commands: string[],
  maxLen = CS2_CONSOLE_CHAR_LIMIT,
): string[] {
  const chunks: string[] = []
  let current = ''

  for (const raw of commands) {
    const cmd = raw.trim()
    if (!cmd) continue

    if (cmd.length > maxLen) {
      if (current) {
        chunks.push(current)
        current = ''
      }
      chunks.push(cmd)
      continue
    }

    const next = current ? `${current}; ${cmd}` : cmd
    if (next.length <= maxLen) {
      current = next
    } else {
      if (current) chunks.push(current)
      current = cmd
    }
  }

  if (current) chunks.push(current)
  return chunks
}
