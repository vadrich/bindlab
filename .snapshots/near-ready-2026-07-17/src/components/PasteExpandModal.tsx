import { useEffect, useState } from 'react'
import { useMessages } from '../i18n/I18nProvider'
import { toConsolePaste } from '../utils/consolePaste'
import { tryIncrementUsage } from '../utils/usageCounter'

interface PasteExpandModalProps {
  chunks: string[]
  initialIndex?: number
  onClose: () => void
}

export function PasteExpandModal({
  chunks,
  initialIndex = 0,
  onClose,
}: PasteExpandModalProps) {
  const m = useMessages()
  const [index, setIndex] = useState(() =>
    Math.max(0, Math.min(initialIndex, Math.max(0, chunks.length - 1))),
  )
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIndex(Math.max(0, Math.min(initialIndex, Math.max(0, chunks.length - 1))))
  }, [chunks, initialIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowLeft' && index > 0) setIndex((i) => i - 1)
      if (e.key === 'ArrowRight' && index < chunks.length - 1) {
        setIndex((i) => i + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chunks.length, index, onClose])

  if (chunks.length === 0) return null

  const chunk = chunks[index] ?? ''
  const multi = chunks.length > 1

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toConsolePaste(chunk))
      if (tryIncrementUsage() !== null) {
        window.dispatchEvent(new Event('cs2-usage-updated'))
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard denied
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-1 py-1">
      <div className="rounded-lg border border-[#3a4555] bg-[#1a1f28] px-5 py-6 shadow-2xl shadow-black/50">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white">
              {multi
                ? m.profile.pastePart
                    .replace('{i}', String(index + 1))
                    .replace('{n}', String(chunks.length))
                : m.profile.pasteExpandTitle}
            </h2>
            <p className="mt-1 font-mono text-[11px] text-[#6b7280]">
              {m.profile.pasteChars.replace('{n}', String(chunk.length))}
            </p>
          </div>
          {multi && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={index <= 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="inline-grid h-9 w-9 place-items-center rounded border border-[#6b7280] bg-[#2a3340] text-white transition-colors hover:border-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-35"
                title={m.profile.pastePrev}
                aria-label={m.profile.pastePrev}
              >
                ←
              </button>
              <button
                type="button"
                disabled={index >= chunks.length - 1}
                onClick={() =>
                  setIndex((i) => Math.min(chunks.length - 1, i + 1))
                }
                className="inline-grid h-9 w-9 place-items-center rounded border border-[#6b7280] bg-[#2a3340] text-white transition-colors hover:border-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-35"
                title={m.profile.pasteNext}
                aria-label={m.profile.pasteNext}
              >
                →
              </button>
            </div>
          )}
        </div>

        <pre className="max-h-[min(55vh,420px)] overflow-auto whitespace-pre-wrap break-all rounded border border-[#2a3340] bg-[#0a0e14] p-4 font-mono text-[12px] leading-relaxed text-[#e5e7eb]">
          {chunk}
        </pre>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={copy}
            className="rounded bg-[var(--accent)] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[var(--accent-on)] hover:bg-[var(--accent-hover)]"
          >
            {copied ? m.common.copied : m.common.copy}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#6b7280] bg-[#2a3340] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-[#9ca3af] hover:bg-[#343e4e]"
          >
            {m.profile.pasteClose}
          </button>
        </div>
      </div>
    </div>
  )
}
