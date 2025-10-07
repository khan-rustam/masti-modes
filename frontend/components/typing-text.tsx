"use client"

import { useEffect, useMemo, useState } from "react"

interface TypingTextProps {
  phrases: string[]
  speed?: number // ms per character
  pause?: number // ms pause after a phrase completes
  className?: string
}

export function TypingText({ phrases, speed = 40, pause = 1200, className }: TypingTextProps) {
  const safePhrases = useMemo(() => (phrases && phrases.length > 0 ? phrases : [""]), [phrases])
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState("")

  useEffect(() => {
    let mounted = true
    let timeout: ReturnType<typeof setTimeout>

    const current = safePhrases[phraseIndex % safePhrases.length]

    const typeNext = (i: number) => {
      if (!mounted) return
      if (i <= current.length) {
        setText(current.slice(0, i))
        timeout = setTimeout(() => typeNext(i + 1), speed)
      } else {
        timeout = setTimeout(() => {
          if (!mounted) return
          setPhraseIndex((p) => (p + 1) % safePhrases.length)
          setText("")
        }, pause)
      }
    }

    typeNext(0)

    return () => {
      mounted = false
      clearTimeout(timeout)
    }
  }, [phraseIndex, safePhrases, speed, pause])

  return <span className={className}>{text}<span className="inline-block w-[1ch] animate-pulse">|</span></span>
}


